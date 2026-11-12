import { z } from 'zod'
import { parseSseData, splitSseEvents } from './sse'
import { AssistantError, type ChatMessage, type ChatProvider } from './types'

/** Una risposta più lunga di così viene interrotta: protegge da un modello che non smette più. */
const MAX_ANSWER_CHARS = 12_000
/** Byte letti al massimo, contando anche le parti che non si mostrano (es. il "ragionamento"). */
const MAX_STREAM_BYTES = 256_000
/** Un evento più lungo di così vuol dire che il server non sta mandando il formato atteso. */
const MAX_EVENT_CHARS = 64_000
/** Token per il "ragionamento" nascosto di Gemma (spesso 200-600) più la risposta (~250 per 150 parole). */
const MAX_TOKENS = 2000
const TOO_LONG ='\n\n… (risposta troppo lunga, interrotta)'

const NOT_RUNNING =
  'LM Studio non risponde. Aprilo, carica il modello e avvia il server locale (oppure, da terminale: "lms server start"), poi riprova.'
const NO_PROXY = "L'assistente funziona solo con l'app avviata da avvia.bat o con \"npm run dev\"."

const modelsSchema = z.object({ data: z.array(z.object({ id: z.string().max(300) })).max(500) })

async function request(url: string, init: RequestInit): Promise<Response> {
  let response: Response
  try {
    response = await fetch(url, init)
  } catch (error) {
    if (init.signal?.aborted) throw error
    throw new AssistantError(NOT_RUNNING)
  }
  if (response.status === 404) throw new AssistantError(NO_PROXY)
  // Il proxy di Vite risponde 5xx quando LM Studio è spento.
  if (response.status >= 500) throw new AssistantError(NOT_RUNNING)
  if (!response.ok) throw new AssistantError(`LM Studio ha rifiutato la richiesta (errore ${response.status}).`)
  return response
}

/** Il modello da usare: preferibilmente quello scelto nella fase di prova (Gemma), altrimenti il primo. */
async function pickModel(baseUrl: string, preferred: RegExp, signal: AbortSignal): Promise<string> {
  const response = await request(`${baseUrl}/models`, { signal })
  const parsed = modelsSchema.safeParse(await response.json().catch(() => null))
  if (!parsed.success) throw new AssistantError('LM Studio ha risposto in un formato inatteso.')
  const ids = parsed.data.data.map((m) => m.id).filter((id) => !/embed/i.test(id))
  if (ids.length === 0) throw new AssistantError('In LM Studio non c\'è nessun modello: scarica e carica Gemma.')
  return ids.find((id) => preferred.test(id)) ?? ids[0]
}

async function* readText(body: ReadableStream<Uint8Array>, signal: AbortSignal): AsyncGenerator<string> {
  const reader = body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let chars = 0
  let bytes = 0
  try {
    while (!signal.aborted) {
      const { value, done } = await reader.read()
      if (done) return
      bytes += value.byteLength
      const { data, rest } = splitSseEvents(buffer + decoder.decode(value, { stream: true }))
      buffer = rest
      if (buffer.length > MAX_EVENT_CHARS) throw new AssistantError('LM Studio ha mandato una risposta in un formato inatteso.')
      for (const item of data) {
        if (signal.aborted) return
        const chunk = parseSseData(item)
        if (chunk.kind === 'done') return
        if (chunk.kind === 'error') throw new AssistantError(`LM Studio: ${chunk.message.slice(0, 300)}`)
        if (chunk.kind === 'text') chars += chunk.text.length
        if (chars > MAX_ANSWER_CHARS || bytes > MAX_STREAM_BYTES) {
          yield TOO_LONG
          return
        }
        if (chunk.kind === 'text') yield chunk.text
      }
    }
  } finally {
    reader.cancel().catch(() => {})
  }
}

/**
 * Un server sul PC compatibile con il formato OpenAI (LM Studio), raggiunto tramite il proxy del dev server
 * (`baseUrl`, es. "/api/llm"): il browser parla solo con l'app, mai direttamente con altri indirizzi.
 */
export function localServerProvider(baseUrl: string, preferred = /gemma/i): ChatProvider {
  let model: string | null = null

  return {
    modelName: () => model,
    async *stream(messages: ChatMessage[], signal: AbortSignal) {
      model ??= await pickModel(baseUrl, preferred, signal)
      const body = JSON.stringify({ model, messages, stream: true, temperature: 0.7, max_tokens: MAX_TOKENS })
      try {
        const response = await request(`${baseUrl}/chat/completions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
          signal,
        })
        if (!response.body) throw new AssistantError('LM Studio non ha mandato nessuna risposta.')
        yield* readText(response.body, signal)
      } catch (error) {
        // Al prossimo tentativo si richiede l'elenco: magari nel frattempo è stato caricato un altro modello.
        model = null
        throw error
      }
    },
  }
}
