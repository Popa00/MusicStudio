import type { Card } from './cards.ts'

/**
 * Una scheda lunga si divide in pezzi, uno per sotto-sezione ("### Titolo" nel testo): ogni pezzo ha il suo
 * vettore, così una domanda precisa trova la parte giusta. All'assistente arriva poi la scheda intera
 * (l'app riunisce i pezzi), quindi il testo dei pezzi uniti con una riga vuota deve ridare la scheda.
 * Una scheda senza sotto-sezioni resta un pezzo solo.
 */

export interface CardChunk {
  /** Titolo della sotto-sezione, o null per la parte iniziale della scheda. */
  heading: string | null
  /** Testo del pezzo, con la riga "### Titolo" se c'è. */
  text: string
}

/** Pezzi più corti di così si uniscono al precedente: da soli non darebbero un vettore utile. */
export const MIN_CHUNK_CHARS = 200

export function splitCard(text: string): CardChunk[] {
  const parts = text.split(/\n(?=### )/).map((p) => p.trim()).filter(Boolean)
  const chunks: CardChunk[] = []
  for (const part of parts) {
    const heading = part.startsWith('### ') ? part.slice(4, part.indexOf('\n') > 0 ? part.indexOf('\n') : undefined).trim() : null
    const last = chunks.at(-1)
    if (last && last.text.length < MIN_CHUNK_CHARS) last.text += `\n\n${part}`
    else chunks.push({ heading, text: part })
  }
  return chunks
}

/**
 * Il testo da trasformare in vettore: titolo (e sotto-sezione), parole chiave (scritte anche come le direbbe
 * un principiante, così una domanda "di tutti i giorni" trova la scheda tecnica giusta) e testo del pezzo.
 */
export function chunkEmbeddingText(card: Pick<Card, 'title' | 'keywords'>, chunk: CardChunk): string {
  const title = chunk.heading ? `${card.title} — ${chunk.heading}` : card.title
  return `${title}\n${card.keywords.join(', ')}\n${chunk.text}`
}
