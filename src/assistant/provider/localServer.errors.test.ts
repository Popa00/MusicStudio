import { afterEach, describe, expect, it, vi } from 'vitest'
import { localServerProvider } from './localServer'

const enc = new TextEncoder()
const ev = (content: string) => `data: ${JSON.stringify({ choices: [{ delta: { content } }] })}\n\n`
const models = () => new Response(JSON.stringify({ data: [{ id: 'gemma' }] }), { status: 200 })

function chunked(chunks: string[]): Response {
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      for (const c of chunks) controller.enqueue(enc.encode(c))
      controller.close()
    },
  })
  return new Response(body, { status: 200 })
}

/** Finto fetch con una risposta diversa per l'elenco dei modelli e per la chat. */
function mockFetch(models_: () => Response | Promise<Response>, chat: () => Response | Promise<Response>) {
  vi.stubGlobal('fetch', vi.fn(async (url: string) => (url.endsWith('/models') ? models_() : chat())))
}

async function collect(gen: AsyncGenerator<string>): Promise<string[]> {
  const out: string[] = []
  for await (const piece of gen) out.push(piece)
  return out
}

const run = (signal = new AbortController().signal, provider = localServerProvider('/api/llm')) => collect(provider.stream([{ role: 'user', content: 'x' }], signal))

afterEach(() => vi.unstubAllGlobals())

describe('localServerProvider: errori di rete e di stato', () => {
  it('se fetch fallisce dice che LM Studio non risponde', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))
    await expect(run()).rejects.toMatchObject({ name: 'AssistantError', message: expect.stringMatching(/^LM Studio non risponde/) })
  })
  it('se fetch fallisce nella chat (dopo l\'elenco) dice lo stesso', async () => {
    mockFetch(models, () => { throw new TypeError('rete') })
    await expect(run()).rejects.toThrow(/^LM Studio non risponde/)
  })
  it('404 vuol dire che manca il proxy (app non avviata con npm run dev)', async () => {
    mockFetch(() => new Response(null, { status: 404 }), () => chunked([]))
    await expect(run()).rejects.toThrow(/avvia\.bat|npm run dev/)
    mockFetch(models, () => new Response(null, { status: 404 }))
    await expect(run()).rejects.toThrow(/npm run dev/)
  })
  it('500, 502 e 503 (proxy senza LM Studio) vogliono dire non avviato', async () => {
    for (const status of [500, 502, 503]) {
      mockFetch(() => new Response(null, { status }), () => chunked([]))
      await expect(run()).rejects.toThrow(/^LM Studio non risponde/)
    }
  })
  it('un altro errore, come 400, riporta il codice', async () => {
    mockFetch(models, () => new Response(null, { status: 400 }))
    await expect(run()).rejects.toThrow('rifiutato la richiesta (errore 400)')
  })
  it('una risposta senza corpo dà un errore chiaro', async () => {
    mockFetch(models, () => new Response(null, { status: 200 }))
    await expect(run()).rejects.toThrow('non ha mandato nessuna risposta')
  })
  it('dopo un errore richiede di nuovo l\'elenco dei modelli', async () => {
    const fetchMock = vi.fn(async (url: string) => (url.endsWith('/models') ? models() : new Response(null, { status: 503 })))
    vi.stubGlobal('fetch', fetchMock)
    const provider = localServerProvider('/api/llm')
    await expect(run(undefined, provider)).rejects.toThrow()
    await expect(run(undefined, provider)).rejects.toThrow()
    expect(fetchMock.mock.calls.filter(([u]) => u.endsWith('/models'))).toHaveLength(2)
    expect(provider.modelName()).toBeNull()
  })
})

describe('localServerProvider: interruzione e limite', () => {
  it('se è già interrotto e fetch fallisce rilancia l\'errore originale', async () => {
    const abort = new AbortController()
    abort.abort()
    const original = new DOMException('Aborted', 'AbortError')
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(original))
    await expect(run(abort.signal)).rejects.toBe(original)
  })
  it('interrompendo durante la lettura smette di restituire testo', async () => {
    const abort = new AbortController()
    mockFetch(models, () => chunked([ev('a'), ev('b'), ev('c')]))
    const out: string[] = []
    for await (const piece of localServerProvider('/api/llm').stream([{ role: 'user', content: 'x' }], abort.signal)) {
      out.push(piece)
      abort.abort()
    }
    expect(out).toEqual(['a'])
  })
  it('una risposta troppo lunga viene interrotta a 12.000 caratteri con un avviso', async () => {
    mockFetch(models, () => chunked([ev('x'.repeat(5000)), ev('y'.repeat(5000)), ev('z'.repeat(5000)), ev('w')]))
    const out = await run()
    expect(out).toHaveLength(3)
    expect(out.slice(0, 2).join('').length).toBe(10_000)
    expect(out[2]).toContain('risposta troppo lunga')
  })
  it('un pezzo che arriva esattamente a 12.000 caratteri è ancora ammesso, uno in più no', async () => {
    mockFetch(models, () => chunked([ev('x'.repeat(12_000)), ev('!')]))
    const out = await run()
    expect(out[0]).toHaveLength(12_000)
    expect(out).toHaveLength(2)
    expect(out.join('')).not.toContain('!')
    expect(out[1]).toContain('troppo lunga')
  })
  it('anche gli eventi senza testo contano nel limite di byte letti', async () => {
    const empty = 'data: {"choices":[{"delta":{}}]}\n\n'.repeat(1000)
    mockFetch(models, () => chunked(Array.from({ length: 10 }, () => empty).concat(Array(40).fill(empty), [ev('x')])))
    const out = await run()
    expect(out.join('')).not.toBe('x')
    expect(out.at(-1)).toContain('troppo lunga')
  })
  it('un evento che non finisce mai (oltre 64.000 caratteri) viene rifiutato', async () => {
    mockFetch(models, () => chunked(['data: ' + 'a'.repeat(70_000)]))
    await expect(run()).rejects.toThrow('formato inatteso')
  })
  it('il messaggio di errore del server viene accorciato a 300 caratteri', async () => {
    mockFetch(models, () => chunked([`data: {"error":"${'e'.repeat(1000)}"}\n\n`]))
    await expect(run()).rejects.toThrow(new RegExp(`^LM Studio: e{300}$`))
  })
})
