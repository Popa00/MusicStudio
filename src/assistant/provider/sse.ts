import { z } from 'zod'

/**
 * Il server manda la risposta come "Server-Sent Events": blocchi di righe "data: {...}" separati da
 * una riga vuota. Restituisce i dati dei blocchi completi e il pezzo finale ancora incompleto.
 */
export function splitSseEvents(buffer: string): { data: string[]; rest: string } {
  const blocks = buffer.replace(/\r\n/g, '\n').split('\n\n')
  const rest = blocks.pop() ?? ''
  const data = blocks.flatMap((block) =>
    block
      .split('\n')
      .filter((line) => line.startsWith('data:'))
      .map((line) => line.slice(5).trim()),
  )
  return { data, rest }
}

// Formato compatibile OpenAI (LM Studio, Ollama, llama.cpp e molti servizi in rete).
const chunkSchema = z.object({
  choices: z
    .array(z.object({ delta: z.object({ content: z.string().nullish() }).nullish() }))
    .max(8),
})
const errorSchema = z.object({
  error: z.union([z.string(), z.object({ message: z.string() })]),
})

export type SseChunk = { kind: 'text'; text: string } | { kind: 'done' } | { kind: 'error'; message: string } | { kind: 'ignore' }

/** Interpreta i dati di un evento: un pezzo di testo, la fine della risposta o un errore del server. */
export function parseSseData(data: string): SseChunk {
  if (data === '[DONE]') return { kind: 'done' }
  let json: unknown
  try {
    json = JSON.parse(data)
  } catch {
    return { kind: 'ignore' }
  }
  const error = errorSchema.safeParse(json)
  if (error.success) {
    const { error: e } = error.data
    return { kind: 'error', message: typeof e === 'string' ? e : e.message }
  }
  const chunk = chunkSchema.safeParse(json)
  const text = chunk.success ? (chunk.data.choices[0]?.delta?.content ?? '') : ''
  return text ? { kind: 'text', text } : { kind: 'ignore' }
}
