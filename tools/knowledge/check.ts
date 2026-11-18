/**
 * Controlla le schede senza costruire l'indice (non serve LM Studio): formato, fonti ammesse, identificativi
 * non ripetuti, lunghezza e divisione in pezzi. Utile mentre si scrivono le schede.
 *
 *   npm run knowledge:check
 */
import { resolve } from 'node:path'
import { KNOWLEDGE_LIMITS } from '../../src/assistant/knowledge/schema.ts'
import { loadCards } from './cards.ts'
import { MIN_CHUNK_CHARS, splitCard } from './chunks.ts'

const CARDS_DIR = resolve(import.meta.dirname, '../../knowledge/cards')
/** Lunghezza consigliata del testo di una scheda (il limite vero, nello schema, è più alto). */
const SUGGESTED_MAX = 2600
/** Byte medi di un pezzo nell'indice con bge-m3 (misurati: 3,19 MB / 477 pezzi). */
const BYTES_PER_PIECE = 6700

function main(): void {
  const cards = loadCards(CARDS_DIR)
  const areas = new Map<string, number>()
  const warnings: string[] = []
  let pieces = 0
  for (const card of cards) {
    areas.set(card.area, (areas.get(card.area) ?? 0) + 1)
    const chunks = splitCard(card.text)
    pieces += chunks.length
    if (card.text.length > SUGGESTED_MAX) warnings.push(`${card.area}/${card.id}: ${card.text.length} caratteri (consigliati al massimo ${SUGGESTED_MAX})`)
    const short = chunks.filter((c) => c.text.length < MIN_CHUNK_CHARS && chunks.length > 1)
    if (short.length) warnings.push(`${card.area}/${card.id}: una sotto-sezione troppo corta viene unita a un'altra`)
  }
  const average = Math.round(cards.reduce((sum, c) => sum + c.text.length, 0) / Math.max(1, cards.length))
  console.log(`${cards.length} schede valide, ${pieces} pezzi, in media ${average} caratteri.`)
  for (const [area, count] of [...areas].sort()) console.log(`  ${area}: ${count}`)
  // Stima dell'indice: quasi tutto lo spazio è nei vettori (1024 numeri in base64 per pezzo, più il testo).
  const estimate = pieces * BYTES_PER_PIECE
  console.log(`Indice stimato: ${(estimate / 1e6).toFixed(1)} MB su ${(KNOWLEDGE_LIMITS.indexBytes / 1e6).toFixed(1)} MB che l'app accetta.`)
  if (estimate > 0.8 * KNOWLEDGE_LIMITS.indexBytes) warnings.push("l'indice si avvicina al limite di dimensione dell'app")
  if (warnings.length) console.log(`Avvisi:\n  ${warnings.join('\n  ')}`)
}

try {
  main()
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
}
