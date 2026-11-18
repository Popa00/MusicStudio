import { z } from 'zod'
import { normalizeVector } from '../../src/assistant/knowledge/vectors.ts'

/** Server di LM Studio sul PC (solo per costruire l'indice: l'app passa dal proxy). */
export const LM_STUDIO = 'http://127.0.0.1:1234/v1'
export const DEFAULT_MODEL = 'text-embedding-bge-m3'

const BATCH = 16
const responseSchema = z.object({
  data: z.array(z.object({ index: z.number().int(), embedding: z.array(z.number()).min(8).max(4096) })),
})

/** Prefissi richiesti da alcuni modelli per distinguere domande e documenti (bge-m3 non ne vuole). */
function prefix(model: string, kind: 'query' | 'document'): string {
  return /nomic/i.test(model) ? `search_${kind}: ` : ''
}

/** Vettori normalizzati dei testi, calcolati da LM Studio a gruppi. */
export async function embed(texts: string[], model: string, kind: 'query' | 'document'): Promise<Float32Array[]> {
  const out: Float32Array[] = []
  for (let i = 0; i < texts.length; i += BATCH) {
    const input = texts.slice(i, i + BATCH).map((t) => prefix(model, kind) + t)
    const response = await fetch(`${LM_STUDIO}/embeddings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, input }),
      // Solo LM Studio sul PC: un rinvio verso un altro indirizzo è un errore.
      redirect: 'error',
    }).catch(() => {
      throw new Error('LM Studio non risponde: avvia il server ("lms server start") e riprova.')
    })
    if (!response.ok) throw new Error(`LM Studio ha risposto ${response.status}: ${(await response.text()).slice(0, 300)}`)
    const parsed = responseSchema.parse(await response.json())
    const sorted = [...parsed.data].sort((a, b) => a.index - b.index)
    if (sorted.length !== input.length) throw new Error('LM Studio ha restituito un numero sbagliato di vettori.')
    out.push(...sorted.map((d) => normalizeVector(d.embedding)))
  }
  return out
}
