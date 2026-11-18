import type { LibraryCard } from './library'
import type { KnowledgeSource } from './schema'

export const LIBRARY_TITLE = 'BIBLIOTECA'

/**
 * La sezione delle istruzioni con le schede trovate per questa domanda. Vuota se non ce ne sono:
 * allora il modello risponde con quello che sa, come prima.
 */
export function librarySection(cards: readonly Pick<LibraryCard, 'title' | 'text'>[]): string {
  if (cards.length === 0) return ''
  const text = cards.map((c, i) => `[${i + 1}] ${c.title}\n${c.text}`).join('\n\n')
  return `${LIBRARY_TITLE} (schede verificate scelte per questa domanda; possono anche non c'entrare)\n${text}`
}

/** Le fonti delle schede indicate, senza ripetizioni, da mostrare sotto la risposta. */
export function sourcesOf(cards: readonly Pick<LibraryCard, 'sources'>[]): KnowledgeSource[] {
  const seen = new Set<string>()
  const out: KnowledgeSource[] = []
  for (const source of cards.flatMap((c) => c.sources)) {
    if (seen.has(source.url)) continue
    seen.add(source.url)
    out.push(source)
  }
  return out
}
