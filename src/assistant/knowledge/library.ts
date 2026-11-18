import { KNOWLEDGE_LIMITS, knowledgeIndexSchema, type KnowledgeChunk, type KnowledgeSource } from './schema'
import { createSearch, DEFAULT_SEARCH, type SearchOptions } from './search'
import { decodeVector, dot } from './vectors'

/** Oltre questa dimensione l'indice non viene nemmeno letto (`knowledge:build` avvisa prima di arrivarci). */
export const MAX_INDEX_BYTES = KNOWLEDGE_LIMITS.indexBytes

/** Una scheda intera, ricomposta dai suoi pezzi: è quella che si passa al modello. */
export interface LibraryCard {
  card: string
  title: string
  text: string
  sources: KnowledgeSource[]
}

/** La biblioteca pronta per cercare. */
export interface KnowledgeLibrary {
  /** Il modello di embedding con cui è stato costruito l'indice: le domande vanno trasformate con lo stesso. */
  model: string
  chunks: readonly KnowledgeChunk[]
  /** I pezzi più adatti alla domanda (al massimo uno per scheda); senza `queryVector` cerca solo per parole chiave. */
  search(query: string, queryVector: Float32Array | null, options?: SearchOptions): KnowledgeChunk[]
  /** Quanto un pezzo somiglia a un vettore (da -1 a 1). */
  similarity(chunk: KnowledgeChunk, vector: Float32Array): number
  /** La scheda intera a cui appartiene il pezzo: i suoi pezzi uniti nell'ordine originale. */
  cardOf(chunk: KnowledgeChunk): LibraryCard
}

/** Un vettore utilizzabile: tutti numeri veri e lunghezza circa 1 (l'indice li salva già normalizzati). */
function validVector(vector: Float32Array): boolean {
  let sum = 0
  for (const v of vector) {
    if (!Number.isFinite(v)) return false
    sum += v * v
  }
  return Math.abs(sum - 1) < 0.01
}

/** Le schede intere, ricomposte unendo i pezzi con lo stesso `card` (le fonti sono quelle del primo pezzo). */
function groupCards(chunks: readonly KnowledgeChunk[]): Map<string, LibraryCard> {
  const cards = new Map<string, LibraryCard>()
  for (const c of chunks) {
    const card = cards.get(c.card)
    if (card) card.text += `\n\n${c.text}`
    else cards.set(c.card, { card: c.card, title: c.title, text: c.text, sources: c.sources })
  }
  return cards
}

/**
 * Controlla e prepara l'indice letto da `public/knowledge/index.json`. Come ogni file letto dall'app,
 * viene validato prima dell'uso: un indice non valido fa lanciare un errore (e l'assistente risponde senza biblioteca).
 */
export function parseLibrary(text: string): KnowledgeLibrary {
  if (text.length > MAX_INDEX_BYTES) throw new Error('Indice della biblioteca troppo grande.')
  const index = knowledgeIndexSchema.parse(JSON.parse(text))
  const vectors = index.chunks.map((c) => decodeVector(c.vector, index.dims))
  if (!vectors.every(validVector)) throw new Error('Indice della biblioteca: vettore non valido.')
  const vectorOf = new Map(index.chunks.map((c, i) => [c, vectors[i]]))
  const cards = groupCards(index.chunks)
  const find = createSearch(index.chunks.map((c, i) => ({ ...c, vector: vectors[i] })))
  return {
    model: index.model,
    chunks: index.chunks,
    search: (query, queryVector, options = DEFAULT_SEARCH) => find(query, queryVector, options).map((hit) => index.chunks[hit.index]),
    similarity: (chunk, vector) => dot(vectorOf.get(chunk) ?? new Float32Array(0), vector),
    cardOf: (chunk) => cards.get(chunk.card) ?? { card: chunk.card, title: chunk.title, text: chunk.text, sources: chunk.sources },
  }
}
