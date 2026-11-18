import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { localEmbeddings } from './localEmbeddings'

const fetchMock = vi.fn()
const vec = (n: number) => Array.from({ length: 8 }, (_, i) => (i === n ? 3 : 0))
const ok = (body: unknown) => new Response(JSON.stringify(body), { status: 200 })
const signal = () => new AbortController().signal

beforeEach(() => {
  fetchMock.mockReset()
  vi.stubGlobal('fetch', fetchMock)
})
afterEach(() => vi.unstubAllGlobals())

describe('localEmbeddings', () => {
  it('manda una POST a baseUrl/embeddings con model e input', async () => {
    fetchMock.mockResolvedValue(ok({ data: [{ index: 0, embedding: vec(0) }] }))
    const s = signal()
    await localEmbeddings('/api').embed(['ciao'], 'mod', s)
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('/api/embeddings')
    expect(init.method).toBe('POST')
    expect(JSON.parse(init.body)).toEqual({ model: 'mod', input: ['ciao'] })
    expect(init.signal).toBe(s)
  })
  it('ordina i vettori per index e li normalizza', async () => {
    fetchMock.mockResolvedValue(ok({ data: [{ index: 1, embedding: vec(1) }, { index: 0, embedding: vec(0) }] }))
    const out = await localEmbeddings('/api').embed(['a', 'b'], 'm', signal())
    expect(out).toHaveLength(2)
    expect(out[0][0]).toBeCloseTo(1)
    expect(out[1][1]).toBeCloseTo(1)
    expect(Math.hypot(...out[0])).toBeCloseTo(1)
  })
  it('lancia su status non ok', async () => {
    fetchMock.mockResolvedValue(new Response('x', { status: 500 }))
    await expect(localEmbeddings('/api').embed(['a'], 'm', signal())).rejects.toThrow(/500/)
  })
  it('lancia su risposta malformata', async () => {
    for (const body of [{}, { data: 'x' }, { data: [{ index: 0, embedding: [1, 2] }] }, { data: [{ index: -1, embedding: vec(0) }] }]) {
      fetchMock.mockResolvedValueOnce(ok(body))
      await expect(localEmbeddings('/api').embed(['a'], 'm', signal())).rejects.toThrow()
    }
  })
  it('lancia se la risposta non è JSON', async () => {
    fetchMock.mockResolvedValue(new Response('<html>', { status: 200 }))
    await expect(localEmbeddings('/api').embed(['a'], 'm', signal())).rejects.toThrow()
  })
  it('lancia se il numero di vettori è sbagliato', async () => {
    fetchMock.mockResolvedValue(ok({ data: [{ index: 0, embedding: vec(0) }] }))
    await expect(localEmbeddings('/api').embed(['a', 'b'], 'm', signal())).rejects.toThrow(/incompleta/)
  })
  it('lancia se mancano indici (duplicati o salti)', async () => {
    fetchMock.mockResolvedValue(ok({ data: [{ index: 0, embedding: vec(0) }, { index: 0, embedding: vec(1) }] }))
    await expect(localEmbeddings('/api').embed(['a', 'b'], 'm', signal())).rejects.toThrow(/incompleta/)
    fetchMock.mockResolvedValue(ok({ data: [{ index: 0, embedding: vec(0) }, { index: 2, embedding: vec(1) }] }))
    await expect(localEmbeddings('/api').embed(['a', 'b'], 'm', signal())).rejects.toThrow(/incompleta/)
  })
})
