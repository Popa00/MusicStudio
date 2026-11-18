import realIndex from '../../../public/knowledge/index.json?raw'
import { describe, expect, it } from 'vitest'
import { MAX_INDEX_BYTES, parseLibrary } from './library'
import { encodeVector, normalizeVector } from './vectors'

const DIMS = 8
const SOURCE = { title: 'Reverberation', url: 'https://en.wikipedia.org/wiki/Reverberation', license: 'CC BY-SA 4.0' }

function unit(i: number): Float32Array {
  return normalizeVector(Array.from({ length: DIMS }, (_, k) => (k === i ? 1 : 0)))
}

function chunk(card: string, text: string, vector: Float32Array, keywords: string[] = []) {
  return { card, area: 'effetti', title: card, text, keywords, sources: [SOURCE], vector: encodeVector(vector) }
}

function build(chunks: unknown[], extra: object = {}): string {
  return JSON.stringify({ version: 1, model: 'm', dims: DIMS, license: 'CC BY-SA 4.0', chunks, ...extra })
}

const valid = () =>
  build([
    chunk('riverbero', 'Il riverbero simula le riflessioni del suono in una sala.', unit(0), ['riverbero']),
    chunk('delay', 'Il delay ripete il suono come un eco.', unit(1), ['delay']),
  ])

describe('parseLibrary: rifiuta indici non validi', () => {
  it('rifiuta un testo più grande del limite', () => {
    expect(() => parseLibrary('x'.repeat(MAX_INDEX_BYTES + 1))).toThrow(/troppo grande/)
  })
  it('rifiuta JSON non valido', () => {
    expect(() => parseLibrary('{non json')).toThrow()
  })
  it('rifiuta uno schema non valido', () => {
    expect(() => parseLibrary(JSON.stringify({ version: 2, chunks: [] }))).toThrow()
    expect(() => parseLibrary('[]')).toThrow()
  })
  it('rifiuta una fonte da un sito non ammesso', () => {
    const bad = { ...chunk('a', 't', unit(0)), sources: [{ ...SOURCE, url: 'https://evil.example/wiki/x' }] }
    expect(() => parseLibrary(build([bad]))).toThrow()
  })
  it('rifiuta un vettore con NaN', () => {
    const v = unit(0)
    v[3] = NaN
    expect(() => parseLibrary(build([chunk('a', 't', v)]))).toThrow(/vettore non valido/)
  })
  it('rifiuta un vettore con Infinity', () => {
    const v = unit(0)
    v[2] = Infinity
    expect(() => parseLibrary(build([chunk('a', 't', v)]))).toThrow(/vettore non valido/)
  })
  it('rifiuta un vettore non normalizzato', () => {
    const v = unit(0).map((x) => x * 3)
    expect(() => parseLibrary(build([chunk('a', 't', v)]))).toThrow(/vettore non valido/)
  })
  it('rifiuta un vettore a zero', () => {
    expect(() => parseLibrary(build([chunk('a', 't', new Float32Array(DIMS))]))).toThrow(/vettore non valido/)
  })
})

describe('parseLibrary: indice valido', () => {
  it('accetta l indice ed espone modello e schede', () => {
    const lib = parseLibrary(valid())
    expect(lib.model).toBe('m')
    expect(lib.chunks.map((c) => c.card)).toEqual(['riverbero', 'delay'])
  })
  it('accetta un indice senza schede', () => {
    expect(parseLibrary(build([])).search('qualcosa', null)).toEqual([])
  })
  it('cerca per parole senza vettore', () => {
    const hits = parseLibrary(valid()).search('delay', null)
    expect(hits.map((c) => c.card)).toEqual(['delay'])
  })
  it('cerca per vettore anche senza parole in comune', () => {
    const hits = parseLibrary(valid()).search('zzz', unit(1))
    expect(hits.map((c) => c.card)).toEqual(['delay'])
  })
  it('un vettore ortogonale a tutte le schede e parole assenti non trova nulla', () => {
    expect(parseLibrary(valid()).search('zzz', unit(5))).toEqual([])
  })
  it('rispetta il limite delle opzioni', () => {
    const lib = parseLibrary(valid())
    expect(lib.search('suono', null, { limit: 1, minSimilarity: 0.45, rrfK: 60 }).length).toBeLessThanOrEqual(1)
  })
})

describe('parseLibrary: indice vero del progetto', () => {
  const text: string = realIndex
  it('passa la validazione', () => {
    expect(parseLibrary(text).chunks.length).toBeGreaterThan(0)
  })
  it('è sotto il limite di dimensione', () => {
    expect(text.length).toBeLessThan(MAX_INDEX_BYTES)
  })
  it('la parola riverbero, senza vettore, trova la scheda riverbero', () => {
    const hits = parseLibrary(text).search('riverbero', null)
    expect(hits.map((c) => c.card)).toContain('riverbero')
  })
})
