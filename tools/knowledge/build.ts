/**
 * Costruisce l'indice della biblioteca: legge le schede di `knowledge/cards/`, calcola gli embedding
 * con LM Studio e scrive `public/knowledge/index.json` (validato con lo stesso schema usato dall'app).
 *
 *   npm run knowledge:build                       # con bge-m3
 *   npm run knowledge:build -- --model <nome>     # con un altro modello di LM Studio
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { knowledgeIndexSchema, type KnowledgeIndex } from '../../src/assistant/knowledge/schema.ts'
import { encodeVector } from '../../src/assistant/knowledge/vectors.ts'
import { loadCards } from './cards.ts'
import { chunkEmbeddingText, splitCard } from './chunks.ts'
import { DEFAULT_MODEL, embed } from './embed.ts'

const ROOT = resolve(import.meta.dirname, '../..')
const CARDS_DIR = resolve(ROOT, 'knowledge/cards')
const OUT = resolve(ROOT, 'public/knowledge/index.json')
const LICENSE = 'CC BY-SA 4.0 (testi della biblioteca, vedi knowledge/README.md)'

function argument(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`)
  return i >= 0 ? process.argv[i + 1] : undefined
}

async function main(): Promise<void> {
  const model = argument('model') ?? DEFAULT_MODEL
  const cards = loadCards(CARDS_DIR)
  const pieces = cards.flatMap((card) => splitCard(card.text).map((chunk) => ({ card, chunk })))
  console.log(`${cards.length} schede, ${pieces.length} pezzi. Calcolo gli embedding con ${model}…`)
  const vectors = await embed(pieces.map((p) => chunkEmbeddingText(p.card, p.chunk)), model, 'document')
  const index: KnowledgeIndex = {
    version: 1,
    model,
    dims: vectors[0]?.length ?? 8,
    license: LICENSE,
    chunks: pieces.map(({ card, chunk }, i) => ({
      card: card.id,
      area: card.area,
      title: card.title,
      text: chunk.text,
      keywords: card.keywords,
      sources: card.sources,
      vector: encodeVector(vectors[i]),
    })),
  }
  const checked = knowledgeIndexSchema.parse(index)
  mkdirSync(dirname(OUT), { recursive: true })
  writeFileSync(OUT, `${JSON.stringify(checked)}\n`)
  console.log(`Scritto ${OUT} (${checked.chunks.length} pezzi, ${checked.dims} dimensioni).`)
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
