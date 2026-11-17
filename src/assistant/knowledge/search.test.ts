import { describe, expect, it } from 'vitest'
import { createSearch, DEFAULT_SEARCH, type SearchDoc } from './search.ts'

const doc = (card: string, title: string, vector: number[], text = 'testo neutro'): SearchDoc => ({
  card,
  title,
  keywords: [],
  text,
  vector: Float32Array.from(vector),
})

const opts = (over: Partial<typeof DEFAULT_SEARCH> = {}) => ({ ...DEFAULT_SEARCH, ...over })
const X = Float32Array.of(1, 0)

describe('createSearch', () => {
  it('senza vettore della domanda usa solo le parole chiave', () => {
    const search = createSearch([doc('a', 'Altro', [1, 0]), doc('b', 'Delay', [0, 1])])
    expect(search('delay', null).map((h) => h.index)).toEqual([1])
  })

  it('con il vettore trova per significato anche senza parole in comune', () => {
    const search = createSearch([doc('a', 'Uno', [1, 0]), doc('b', 'Due', [0, 1])])
    expect(search('qualcosa', X).map((h) => h.index)).toEqual([0])
  })

  it('la fusione RRF somma i contributi delle due classifiche', () => {
    const search = createSearch([
      doc('a', 'Altro', [1, 0]),
      doc('b', 'Delay', [0.9, 0.436]),
      doc('c', 'Altro', [0, 1], 'delay'),
    ])
    const hits = search('delay', X, opts())
    expect(hits[0].index).toBe(1)
    expect(hits[0].score).toBeCloseTo(1 / 62 + 1 / 61, 10)
    expect(hits.map((h) => h.index)).toContain(0)
    expect(hits.map((h) => h.index)).toContain(2)
  })

  it('restituisce un solo risultato per scheda, il migliore', () => {
    const search = createSearch([
      doc('a', 'Altro', [0, 1]),
      doc('a', 'Delay', [0, 1]),
      doc('b', 'Delay', [0, 1], 'delay delay'),
    ])
    const indexes = search('delay', null, opts()).map((h) => h.index)
    expect(indexes).toHaveLength(2)
    expect(indexes).toContain(1)
    expect(indexes).not.toContain(0)
  })

  it('rispetta il limite', () => {
    const docs = ['a', 'b', 'c', 'd'].map((c) => doc(c, 'Delay', [0, 1]))
    expect(createSearch(docs)('delay', null, opts({ limit: 2 }))).toHaveLength(2)
    expect(createSearch(docs)('delay', null, opts({ limit: 3 }))).toHaveLength(3)
  })

  it('scarta i risultati per significato sotto minSimilarity', () => {
    const search = createSearch([doc('a', 'Uno', [0.4, 0.917])])
    expect(search('x', X, opts({ minSimilarity: 0.45 }))).toEqual([])
    expect(search('x', X, opts({ minSimilarity: 0.3 }))).toHaveLength(1)
  })

  it('documenti senza nessuna corrispondenza danno una lista vuota', () => {
    const search = createSearch([doc('a', 'Uno', [0, 1]), doc('b', 'Due', [0, -1])])
    expect(search('chitarra', X, opts())).toEqual([])
  })

  it('senza documenti restituisce una lista vuota', () => {
    expect(createSearch([])('delay', X)).toEqual([])
  })
})
