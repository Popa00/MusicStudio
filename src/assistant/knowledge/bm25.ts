import { words } from './words.ts'

/** Un documento per la ricerca per parole chiave: titolo e parole chiave contano più del testo. */
export interface KeywordDoc {
  title: string
  keywords: readonly string[]
  text: string
}

const K1 = 1.2
const B = 0.75
/** Quante volte contano titolo e parole chiave rispetto al testo. */
const TITLE_WEIGHT = 3
const KEYWORD_WEIGHT = 3

function termCounts(doc: KeywordDoc): Map<string, number> {
  const counts = new Map<string, number>()
  const add = (list: string[], weight: number) => {
    for (const w of list) counts.set(w, (counts.get(w) ?? 0) + weight)
  }
  add(words(doc.title), TITLE_WEIGHT)
  add(words(doc.keywords.join(' ')), KEYWORD_WEIGHT)
  add(words(doc.text), 1)
  return counts
}

/**
 * Ricerca BM25 (il metodo classico dei motori di ricerca): premia le parole della domanda che compaiono
 * spesso in un documento e raramente negli altri. Restituisce una funzione che dà un punteggio a ogni documento.
 */
export function createBm25(docs: readonly KeywordDoc[]): (query: string) => number[] {
  const counts = docs.map(termCounts)
  const lengths = counts.map((c) => [...c.values()].reduce((a, b) => a + b, 0))
  const average = lengths.reduce((a, b) => a + b, 0) / Math.max(1, docs.length)
  const docFrequency = new Map<string, number>()
  for (const c of counts) for (const term of c.keys()) docFrequency.set(term, (docFrequency.get(term) ?? 0) + 1)

  return (query) => {
    const terms = [...new Set(words(query))]
    return counts.map((c, i) => {
      let score = 0
      for (const term of terms) {
        const tf = c.get(term)
        if (!tf) continue
        const df = docFrequency.get(term) ?? 0
        const idf = Math.log(1 + (docs.length - df + 0.5) / (df + 0.5))
        score += (idf * tf * (K1 + 1)) / (tf + K1 * (1 - B + (B * lengths[i]) / (average || 1)))
      }
      return score
    })
  }
}
