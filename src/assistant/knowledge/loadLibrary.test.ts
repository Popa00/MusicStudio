import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MAX_INDEX_BYTES } from './library'
import { forgetLibrary, loadLibrary } from './loadLibrary'
import { encodeVector, normalizeVector } from './vectors'

const SOURCE = { title: 'Reverberation', url: 'https://en.wikipedia.org/wiki/Reverberation', license: 'CC BY-SA 4.0' }
const vec = normalizeVector([1, 0, 0, 0, 0, 0, 0, 0])
const GOOD = JSON.stringify({
  version: 1,
  model: 'm',
  dims: 8,
  license: 'x',
  chunks: [{ card: 'riverbero', area: 'effetti', title: 'Riverbero', text: 'testo', keywords: [], sources: [SOURCE], vector: encodeVector(vec) }],
})

const bytes = (s: string) => new TextEncoder().encode(s)

/** Risposta con corpo a pezzi; senza Content-Length a meno che sia indicato. */
function streamed(parts: Uint8Array[], headers: Record<string, string> = {}): Response {
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      for (const p of parts) controller.enqueue(p)
      controller.close()
    },
  })
  return new Response(body, { headers })
}

const fetchMock = vi.fn()

beforeEach(() => {
  forgetLibrary()
  fetchMock.mockReset()
  vi.stubGlobal('fetch', fetchMock)
})
afterEach(() => vi.unstubAllGlobals())

describe('loadLibrary', () => {
  it('scarica e valida l indice', async () => {
    fetchMock.mockResolvedValue(streamed([bytes(GOOD)]))
    const lib = await loadLibrary('/i.json')
    expect(lib.chunks).toHaveLength(1)
    expect(fetchMock).toHaveBeenCalledWith('/i.json', expect.objectContaining({ redirect: 'error', signal: expect.any(AbortSignal) }))
  })
  it('scarica una volta sola (cache), anche con chiamate simultanee', async () => {
    fetchMock.mockImplementation(async () => streamed([bytes(GOOD)]))
    const [a, b] = await Promise.all([loadLibrary('/i.json'), loadLibrary('/i.json')])
    await loadLibrary('/i.json')
    expect(a).toBe(b)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
  it('dopo un errore riprova al tentativo successivo', async () => {
    fetchMock.mockRejectedValueOnce(new Error('rete')).mockResolvedValueOnce(streamed([bytes(GOOD)]))
    await expect(loadLibrary('/i.json')).rejects.toThrow('rete')
    await expect(loadLibrary('/i.json')).resolves.toBeDefined()
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
  it('rifiuta una risposta non ok', async () => {
    fetchMock.mockResolvedValue(new Response('no', { status: 404 }))
    await expect(loadLibrary('/i.json')).rejects.toThrow(/404/)
  })
  it('rifiuta un Content-Length troppo grande', async () => {
    fetchMock.mockResolvedValue(streamed([bytes(GOOD)], { 'Content-Length': String(MAX_INDEX_BYTES + 1) }))
    await expect(loadLibrary('/i.json')).rejects.toThrow(/troppo grande/)
  })
  it('rifiuta un corpo in streaming più grande del limite, senza Content-Length', async () => {
    const big = new Uint8Array(1_000_000).fill(32)
    fetchMock.mockResolvedValue(streamed(Array.from({ length: 6 }, () => big)))
    await expect(loadLibrary('/i.json')).rejects.toThrow(/troppo grande/)
  })
  it('un corpo esattamente al limite non è rifiutato per la dimensione (fallisce poi per il contenuto)', async () => {
    fetchMock.mockResolvedValue(streamed([new Uint8Array(MAX_INDEX_BYTES).fill(32)]))
    const error = await loadLibrary('/i.json').catch((e: Error) => e)
    expect(error).toBeInstanceOf(Error)
    expect((error as Error).message).not.toMatch(/troppo grande/)
  })
  it('rifiuta una risposta senza corpo', async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, headers: new Headers(), body: null })
    await expect(loadLibrary('/i.json')).rejects.toThrow(/vuot/)
  })
  it('rifiuta un indice con contenuto non valido', async () => {
    fetchMock.mockResolvedValue(streamed([bytes('{"version":1}')]))
    await expect(loadLibrary('/i.json')).rejects.toThrow()
  })
})
