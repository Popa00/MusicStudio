import { createBm25, type KeywordDoc } from './bm25.ts'
import { dot } from './vectors.ts'

export interface SearchDoc extends KeywordDoc {
  card: string
  vector: Float32Array
}

export interface SearchHit {
  index: number
  score: number
}

export interface SearchOptions {
  /** Quante schede diverse restituire al massimo. */
  limit: number
  /** Somiglianza minima perché un risultato "per significato" conti (sotto è quasi sempre fuori tema). */
  minSimilarity: number
  /** Costante della Reciprocal Rank Fusion: più è alta, meno conta essere primi. */
  rrfK: number
}

export const DEFAULT_SEARCH: SearchOptions = { limit: 3, minSimilarity: 0.45, rrfK: 60 }

/** Posizioni in classifica (0 = primo) dei documenti con punteggio sopra la soglia. */
function ranking(scores: number[], threshold: number): Map<number, number> {
  const order = scores
    .map((score, index) => ({ score, index }))
    .filter((s) => s.score > threshold)
    .sort((a, b) => b.score - a.score)
  return new Map(order.map((s, rank) => [s.index, rank]))
}

/**
 * Ricerca combinata: per significato (embedding) e per parole chiave (BM25), unite con la
 * Reciprocal Rank Fusion. Senza vettore della domanda (`queryVector` null) usa solo le parole chiave.
 * Restituisce al massimo un pezzo per scheda, il migliore.
 */
export function createSearch(docs: readonly SearchDoc[]) {
  const bm25 = createBm25(docs)
  return (query: string, queryVector: Float32Array | null, options: SearchOptions = DEFAULT_SEARCH): SearchHit[] => {
    const lists = [ranking(bm25(query), 0)]
    if (queryVector) lists.push(ranking(docs.map((d) => dot(d.vector, queryVector)), options.minSimilarity))
    const fused = new Map<number, number>()
    for (const list of lists) {
      for (const [index, rank] of list) fused.set(index, (fused.get(index) ?? 0) + 1 / (options.rrfK + rank + 1))
    }
    const seen = new Set<string>()
    const hits: SearchHit[] = []
    for (const [index, score] of [...fused].sort((a, b) => b[1] - a[1])) {
      if (seen.has(docs[index].card)) continue
      seen.add(docs[index].card)
      hits.push({ index, score })
      if (hits.length >= options.limit) break
    }
    return hits
  }
}
