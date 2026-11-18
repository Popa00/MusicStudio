import { z } from 'zod'
import { normalizeVector } from '../knowledge/vectors'
import { readCapped } from '../net/readCapped'
import type { EmbeddingProvider } from './types'

/** Numero massimo di valori in un vettore: un modello di embedding normale ne usa da 384 a 4096. */
const MAX_DIMS = 4096
/** Una risposta valida (due vettori) occupa al massimo ~200 KB: oltre non si legge nemmeno. */
const MAX_RESPONSE_BYTES = 512_000

const responseSchema = z.object({
  data: z
    .array(z.object({ index: z.number().int().min(0), embedding: z.array(z.number()).min(8).max(MAX_DIMS) }))
    .max(64),
})

/**
 * I vettori calcolati da un server sul PC compatibile con il formato OpenAI (LM Studio), tramite il proxy
 * del dev server. Serve solo alla ricerca nella biblioteca: se fallisce, l'app cerca per parole chiave.
 */
export function localEmbeddings(baseUrl: string): EmbeddingProvider {
  return {
    async embed(texts, model, signal) {
      const response = await fetch(`${baseUrl}/embeddings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, input: texts }),
        signal,
      })
      if (!response.ok) throw new Error(`Embedding: errore ${response.status}`)
      const parsed = responseSchema.parse(JSON.parse(await readCapped(response, MAX_RESPONSE_BYTES, 'Embedding')))
      const sorted = [...parsed.data].sort((a, b) => a.index - b.index)
      if (sorted.length !== texts.length || sorted.some((d, i) => d.index !== i)) throw new Error('Embedding: risposta incompleta')
      return sorted.map((d) => normalizeVector(d.embedding))
    },
  }
}
