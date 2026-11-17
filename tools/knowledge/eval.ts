/**
 * Misura quanto bene la ricerca trova la scheda giusta per domande vere (`eval-questions.json`):
 * per ogni modello di embedding, la percentuale di domande con la scheda attesa al 1° posto e tra le prime 3,
 * cercando per parole chiave, per significato e con i due metodi insieme.
 *
 *   npm run knowledge:eval -- --models text-embedding-bge-m3,text-embedding-nomic-embed-text-v1.5
 *   npm run knowledge:eval -- --questions eval-questions-blind.json   # domande scritte senza vedere le schede
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { z } from 'zod'
import { createSearch, DEFAULT_SEARCH, type SearchDoc } from '../../src/assistant/knowledge/search.ts'
import { loadCards } from './cards.ts'
import { cardEmbeddingText, DEFAULT_MODEL, embed } from './embed.ts'

const ROOT = resolve(import.meta.dirname, '../..')
const questionsSchema = z.array(z.object({ q: z.string().min(3), expect: z.array(z.string()).min(1) }))

type Mode = 'parole' | 'significato' | 'insieme'

function argument(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`)
  return i >= 0 ? process.argv[i + 1] : undefined
}

async function evaluate(model: string, file: string): Promise<void> {
  const cards = loadCards(resolve(ROOT, 'knowledge/cards'))
  const questions = questionsSchema.parse(JSON.parse(readFileSync(resolve(import.meta.dirname, file), 'utf8')))
  const ids = new Set(cards.map((c) => c.id))
  for (const q of questions) for (const id of q.expect) if (!ids.has(id)) throw new Error(`Domanda "${q.q}": scheda inesistente ${id}`)

  const vectors = await embed(cards.map(cardEmbeddingText), model, 'document')
  const queryVectors = await embed(questions.map((q) => q.q), model, 'query')
  const docs: SearchDoc[] = cards.map((c, i) => ({ ...c, card: c.id, vector: vectors[i] }))
  const search = createSearch(docs)
  const modes: Mode[] = ['parole', 'significato', 'insieme']
  const misses: string[] = []

  console.log(`\n${model} — ${file} (${cards.length} schede, ${questions.length} domande)`)
  for (const mode of modes) {
    let top1 = 0
    let top3 = 0
    questions.forEach((q, i) => {
      const query = mode === 'significato' ? '' : q.q
      const vector = mode === 'parole' ? null : queryVectors[i]
      const found = search(query, vector, { ...DEFAULT_SEARCH, limit: 3 }).map((h) => docs[h.index].card)
      if (q.expect.includes(found[0])) top1++
      if (found.some((id) => q.expect.includes(id))) top3++
      else if (mode === 'insieme') misses.push(`  ✗ ${q.q} → ${found.join(', ') || '(niente)'} (attesa: ${q.expect.join('/')})`)
    })
    const pct = (n: number) => `${Math.round((100 * n) / questions.length)}%`
    console.log(`  ${mode.padEnd(12)} 1° posto ${pct(top1).padStart(4)}   tra i primi 3 ${pct(top3).padStart(4)}`)
  }
  if (misses.length) console.log(`  Non trovate (insieme):\n${misses.join('\n')}`)
}

async function main(): Promise<void> {
  const models = (argument('models') ?? DEFAULT_MODEL).split(',')
  const file = argument('questions') ?? 'eval-questions.json'
  if (!/^[\w.-]+\.json$/.test(file)) throw new Error('--questions: indica solo il nome di un file .json in tools/knowledge/')
  for (const model of models) await evaluate(model.trim(), file)
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
