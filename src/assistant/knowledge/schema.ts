import { z } from 'zod'
import { SOURCE_LICENSES, sourceLicense } from './sources.ts'

/**
 * Formato dell'indice della biblioteca (`public/knowledge/index.json`), creato da `npm run knowledge:build`.
 * Lo usano sia lo strumento che lo crea sia l'app che lo legge: l'app lo valida prima dell'uso.
 * Questo file importa solo zod e `sources.ts`, così Node lo può eseguire direttamente.
 */

export const KNOWLEDGE_LIMITS = {
  chunks: 1000,
  textChars: 4000,
  keywords: 40,
  sources: 8,
  dims: 2048,
} as const

/** Una fonte: solo dai siti ammessi (`sources.ts`), e con la licenza che corrisponde a quel sito. */
export const sourceSchema = z
  .object({
    title: z.string().min(1).max(200),
    url: z.string().max(500),
    license: z.enum(SOURCE_LICENSES),
  })
  .refine((s) => sourceLicense(s.url) === s.license, { message: 'Fonte da un sito non ammesso o con licenza sbagliata.' })

const chunk = z.object({
  /** Identificativo della scheda (es. "riverbero"); più pezzi della stessa scheda hanno lo stesso `card`. */
  card: z.string().regex(/^[a-z0-9-]{1,60}$/),
  area: z.string().min(1).max(40),
  title: z.string().min(1).max(120),
  text: z.string().min(1).max(KNOWLEDGE_LIMITS.textChars),
  keywords: z.array(z.string().min(1).max(60)).max(KNOWLEDGE_LIMITS.keywords),
  sources: z.array(sourceSchema).max(KNOWLEDGE_LIMITS.sources),
  /** Vettore dell'embedding, già normalizzato (lunghezza 1), in Float32 little-endian codificato base64. */
  vector: z.string().regex(/^[A-Za-z0-9+/]+={0,2}$/),
})

export const knowledgeIndexSchema = z
  .object({
    version: z.literal(1),
    /** Il modello di embedding usato: per cercare bisogna usare lo stesso. */
    model: z.string().min(1).max(200),
    dims: z.number().int().min(8).max(KNOWLEDGE_LIMITS.dims),
    license: z.string().min(1).max(200),
    chunks: z.array(chunk).max(KNOWLEDGE_LIMITS.chunks),
  })
  // In base64 ogni 3 byte diventano 4 caratteri; un Float32 occupa 4 byte.
  .refine((index) => index.chunks.every((c) => c.vector.length === 4 * Math.ceil((index.dims * 4) / 3)), {
    message: 'Un vettore non ha la lunghezza indicata da "dims".',
  })

export type KnowledgeIndex = z.infer<typeof knowledgeIndexSchema>
export type KnowledgeChunk = KnowledgeIndex['chunks'][number]
export type KnowledgeSource = z.infer<typeof sourceSchema>
