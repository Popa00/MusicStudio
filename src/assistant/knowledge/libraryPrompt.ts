import { splitCitations } from './citations'
import type { LibraryCard } from './library'
import type { FoundCard } from './retrieve'
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

/** Fonti mostrate al massimo per scheda (le prime sono le principali) e in tutto: una riga, non un elenco. */
export const SOURCES_PER_CARD = 2
export const MAX_SOURCES = 5

/** Le fonti delle schede indicate, senza ripetizioni, da mostrare sotto la risposta. */
export function sourcesOf(cards: readonly Pick<LibraryCard, 'sources'>[]): KnowledgeSource[] {
  const seen = new Set<string>()
  const out: KnowledgeSource[] = []
  for (const source of cards.flatMap((c) => c.sources.slice(0, SOURCES_PER_CARD))) {
    if (seen.has(source.url)) continue
    seen.add(source.url)
    out.push(source)
  }
  return out.slice(0, MAX_SOURCES)
}

/**
 * Le fonti da mostrare per una risposta: quelle delle schede che il modello dice di aver usato ("FONTI: 1, 3"),
 * oppure, se non l'ha scritto, quelle delle schede abbastanza vicine alla domanda.
 */
export function answerSources(cards: readonly FoundCard[], answer: string): KnowledgeSource[] {
  const { cited } = splitCitations(answer)
  return sourcesOf(cited ? cards.filter((_, i) => cited.includes(i + 1)) : cards.filter((c) => c.cited))
}
