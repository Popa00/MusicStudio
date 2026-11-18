import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { EmbeddingProvider } from '../provider/types'
import type { KnowledgeLibrary } from './library'
import { CITE_MIN, CITE_MIN_WITH_PREVIOUS, createRetriever, PREVIOUS_WEIGHT } from './retrieve'
import type { KnowledgeChunk } from './schema'
import { normalizeVector } from './vectors'

const CHUNK = { card: 'riverbero', area: 'effetti', title: 'Riverbero', text: 't', keywords: [], sources: [], vector: '' } as KnowledgeChunk

const CARD = { card: 'riverbero', title: 'Riverbero', text: 't', sources: [] }

/** Biblioteca finta: `similarity` restituisce i valori indicati, uno per chiamata (domanda, poi domanda + precedente). */
function fakeLibrary(similarities: number[] = []) {
  const search = vi.fn<KnowledgeLibrary['search']>(() => [CHUNK])
  const sims = [...similarities]
  const library: KnowledgeLibrary = {
    model: 'modello-x',
    chunks: [CHUNK],
    search,
    similarity: () => sims.shift() ?? 0,
    cardOf: () => ({ ...CARD }),
  }
  return { library, search }
}

const live = () => new AbortController().signal

beforeEach(() => {
  vi.spyOn(console, 'warn').mockImplementation(() => {})
})
afterEach(() => vi.restoreAllMocks())

describe('createRetriever', () => {
  it('con la biblioteca che fallisce restituisce [] e non chiama gli embedding', async () => {
    const embed = vi.fn()
    const retrieve = createRetriever({ library: () => Promise.reject(new Error('giù')), embeddings: { embed } })
    expect(await retrieve('q', null, live())).toEqual([])
    expect(embed).not.toHaveBeenCalled()
    expect(console.warn).toHaveBeenCalled()
  })
  it('con gli embedding che falliscono cerca solo per parole (queryVector null)', async () => {
    const { library, search } = fakeLibrary()
    const retrieve = createRetriever({ library: async () => library, embeddings: { embed: () => Promise.reject(new Error('no')) } })
    expect(await retrieve('riverbero', null, live())).toEqual([{ ...CARD, cited: true }])
    expect(search).toHaveBeenCalledWith('riverbero', null)
  })
  it('con gli embedding ok passa il vettore a search e usa il modello della biblioteca', async () => {
    const { library, search } = fakeLibrary()
    const v = normalizeVector([1, 0, 0])
    const embed = vi.fn<EmbeddingProvider['embed']>(async () => [v])
    const retrieve = createRetriever({ library: async () => library, embeddings: { embed } })
    await retrieve('riverbero', null, live())
    expect(embed.mock.calls[0][0]).toEqual(['riverbero'])
    expect(embed.mock.calls[0][1]).toBe('modello-x')
    expect(search).toHaveBeenCalledWith('riverbero', v)
  })
  it('con la domanda precedente l embed riceve [domanda, precedente] e il vettore è la combinazione normalizzata', async () => {
    const { library, search } = fakeLibrary()
    const a = normalizeVector([1, 0, 0])
    const b = normalizeVector([0, 1, 0])
    const embed = vi.fn<EmbeddingProvider['embed']>(async () => [a, b])
    const retrieve = createRetriever({ library: async () => library, embeddings: { embed } })
    await retrieve('e sulla voce?', 'cos è il riverbero?', live())
    expect(embed.mock.calls[0][0]).toEqual(['e sulla voce?', 'cos è il riverbero?'])
    const sent = search.mock.calls[0][1] as Float32Array
    const expected = normalizeVector([1, PREVIOUS_WEIGHT, 0])
    expect(Array.from(sent)).toEqual(Array.from(expected))
    expect(Math.hypot(...sent)).toBeCloseTo(1, 5)
    expect(search.mock.calls[0][0]).toBe('e sulla voce? cos è il riverbero?')
  })
  it('se i vettori hanno lunghezze diverse usa solo quello della domanda', async () => {
    const { library, search } = fakeLibrary()
    const a = normalizeVector([1, 0, 0])
    const embed = vi.fn<EmbeddingProvider['embed']>(async () => [a, normalizeVector([1, 0])])
    await createRetriever({ library: async () => library, embeddings: { embed } })('q', 'p', live())
    expect(search).toHaveBeenCalledWith('q p', a)
  })
  it('se embed non risponde entro il timeout, ripiega sulle parole chiave', async () => {
    const { library, search } = fakeLibrary()
    const embed: EmbeddingProvider['embed'] = (_t, _m, signal) =>
      new Promise((_resolve, reject) => signal.addEventListener('abort', () => reject(new Error('abortito'))))
    const retrieve = createRetriever({ library: async () => library, embeddings: { embed }, timeoutMs: 20 })
    expect(await retrieve('q', null, live())).toEqual([{ ...CARD, cited: true }])
    expect(search).toHaveBeenCalledWith('q', null)
  })
  it('un segnale già interrotto restituisce [] senza cercare', async () => {
    const { library, search } = fakeLibrary()
    const embed = vi.fn()
    const controller = new AbortController()
    controller.abort()
    const retrieve = createRetriever({ library: async () => library, embeddings: { embed } })
    expect(await retrieve('q', null, controller.signal)).toEqual([])
    expect(embed).not.toHaveBeenCalled()
    expect(search).not.toHaveBeenCalled()
  })
})

describe('createRetriever: quando mostrare le fonti', () => {
  const v = normalizeVector([1, 0, 0])
  const run = (sims: number[], previous: string | null) => {
    const { library } = fakeLibrary(sims)
    const embed = vi.fn<EmbeddingProvider['embed']>(async (texts) => texts.map(() => v))
    return createRetriever({ library: async () => library, embeddings: { embed } })('q', previous, live())
  }
  it('le mostra se la scheda somiglia abbastanza alla domanda', async () => {
    expect((await run([CITE_MIN, 0], null))[0].cited).toBe(true)
  })
  it('non le mostra per una domanda fuori tema (somiglianza bassa)', async () => {
    expect((await run([CITE_MIN - 0.01, CITE_MIN - 0.01], null))[0].cited).toBe(false)
  })
  it('per una domanda di seguito basta il significato insieme alla precedente, con una soglia più alta', async () => {
    expect((await run([0.3, CITE_MIN_WITH_PREVIOUS], 'cos è il riverbero?'))[0].cited).toBe(true)
    expect((await run([0.3, CITE_MIN_WITH_PREVIOUS - 0.01], 'cos è il riverbero?'))[0].cited).toBe(false)
  })
})
