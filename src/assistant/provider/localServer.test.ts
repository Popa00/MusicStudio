import { afterEach, describe, expect, it, vi } from 'vitest'
import { localServerProvider } from './localServer'

const enc = new TextEncoder()
const ev = (content: string) => `data: ${JSON.stringify({ choices: [{ delta: { content } }] })}\n\n`

function modelsResponse(ids: string[]): Response {
  return new Response(JSON.stringify({ data: ids.map((id) => ({ id })) }), { status: 200 })
}

/** Una risposta in streaming che manda i pezzi indicati uno alla volta. */
function streamResponse(chunks: (string | Uint8Array)[]): Response {
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      for (const c of chunks) controller.enqueue(typeof c === 'string' ? enc.encode(c) : c)
      controller.close()
    },
  })
  return new Response(body, { status: 200 })
}

/** Finto fetch: risponde a /models e /chat/completions con quello che si decide nel test. */
function mockFetch(models: Response | (() => Response), chat: Response | (() => Response)) {
  const fn = vi.fn(async (url: string) => {
    const r = url.endsWith('/models') ? models : chat
    return typeof r === 'function' ? r() : r
  })
  vi.stubGlobal('fetch', fn)
  return fn
}

async function collect(gen: AsyncGenerator<string>): Promise<string[]> {
  const out: string[] = []
  for await (const piece of gen) out.push(piece)
  return out
}

const ask = (provider = localServerProvider('/api/llm')) => collect(provider.stream([{ role: 'user', content: 'ciao' }], new AbortController().signal))

afterEach(() => vi.unstubAllGlobals())

describe('localServerProvider: scelta del modello', () => {
  it('preferisce un modello Gemma tra quelli elencati', async () => {
    const fetchMock = mockFetch(modelsResponse(['llama-3', 'google/gemma-3-4b', 'qwen']), streamResponse(['data: [DONE]\n\n']))
    const provider = localServerProvider('/api/llm')
    await ask(provider)
    const [url, init] = fetchMock.mock.calls[1] as unknown as [string, RequestInit]
    expect(url).toBe('/api/llm/chat/completions')
    expect(JSON.parse(init.body as string)).toMatchObject({ model: 'google/gemma-3-4b', stream: true })
    expect(provider.modelName()).toBe('google/gemma-3-4b')
  })
  it('senza Gemma prende il primo, saltando i modelli di embedding', async () => {
    mockFetch(modelsResponse(['text-embedding-nomic', 'Embed-X', 'mistral']), streamResponse(['data: [DONE]\n\n']))
    const provider = localServerProvider('/api/llm')
    await ask(provider)
    expect(provider.modelName()).toBe('mistral')
  })
  it('un embedding con "gemma" nel nome non viene scelto', async () => {
    mockFetch(modelsResponse(['gemma-embedding', 'altro']), streamResponse(['data: [DONE]\n\n']))
    const provider = localServerProvider('/api/llm')
    await ask(provider)
    expect(provider.modelName()).toBe('altro')
  })
  it('senza modelli (o solo embedding) spiega cosa fare', async () => {
    mockFetch(modelsResponse(['text-embedding-x']), streamResponse([]))
    await expect(ask()).rejects.toThrow(/nessun modello/)
    mockFetch(modelsResponse([]), streamResponse([]))
    await expect(ask()).rejects.toThrow(/nessun modello/)
  })
  it('un elenco in formato inatteso dà un errore chiaro', async () => {
    mockFetch(new Response('non json', { status: 200 }), streamResponse([]))
    await expect(ask()).rejects.toThrow('formato inatteso')
    mockFetch(new Response(JSON.stringify({ data: 'x' }), { status: 200 }), streamResponse([]))
    await expect(ask()).rejects.toThrow('formato inatteso')
  })
  it('chiede l\'elenco una volta sola finché le risposte vanno a buon fine', async () => {
    const fetchMock = mockFetch(modelsResponse(['gemma']), () => streamResponse(['data: [DONE]\n\n']))
    const provider = localServerProvider('/api/llm')
    await ask(provider)
    await ask(provider)
    expect(fetchMock.mock.calls.filter(([u]) => String(u).endsWith('/models'))).toHaveLength(1)
  })
})

describe('localServerProvider: streaming', () => {
  it('restituisce i pezzi di testo uno per uno', async () => {
    mockFetch(modelsResponse(['gemma']), streamResponse([ev('Ci'), ev('ao'), 'data: [DONE]\n\n']))
    expect(await ask()).toEqual(['Ci', 'ao'])
  })
  it('un evento spezzato tra due chunk di rete viene ricomposto', async () => {
    const whole = ev('Ciao')
    mockFetch(modelsResponse(['gemma']), streamResponse([whole.slice(0, 20), whole.slice(20), ev('!')]))
    expect(await ask()).toEqual(['Ciao', '!'])
  })
  it('un carattere accentato spezzato a metà tra due chunk resta intero', async () => {
    const bytes = enc.encode(ev('è'))
    const cut = bytes.indexOf(0xc3) + 1
    mockFetch(modelsResponse(['gemma']), streamResponse([bytes.slice(0, cut), bytes.slice(cut)]))
    expect(await ask()).toEqual(['è'])
  })
  it('più eventi nello stesso chunk e righe vuote o commenti vengono gestiti', async () => {
    mockFetch(modelsResponse(['gemma']), streamResponse([`: ping\n\n${ev('a')}${ev('')}${ev('b')}`]))
    expect(await ask()).toEqual(['a', 'b'])
  })
  it('si ferma a [DONE] senza leggere oltre', async () => {
    mockFetch(modelsResponse(['gemma']), streamResponse([ev('a'), 'data: [DONE]\n\n', ev('dopo')]))
    expect(await ask()).toEqual(['a'])
  })
  it('un errore mandato dal server nello stream diventa AssistantError', async () => {
    mockFetch(modelsResponse(['gemma']), streamResponse([ev('a'), 'data: {"error":{"message":"Context overflow"}}\n\n']))
    const provider = localServerProvider('/api/llm')
    await expect(ask(provider)).rejects.toMatchObject({ name: 'AssistantError', message: 'LM Studio: Context overflow' })
    expect(provider.modelName()).toBeNull()
  })
  it('manda i messaggi e un limite di lunghezza nella richiesta', async () => {
    const fetchMock = mockFetch(modelsResponse(['gemma']), streamResponse([]))
    await ask()
    const init = (fetchMock.mock.calls[1] as unknown as [string, RequestInit])[1]
    expect(JSON.parse(init.body as string)).toMatchObject({ messages: [{ role: 'user', content: 'ciao' }], max_tokens: 2000 })
    expect(init.method).toBe('POST')
  })
})
