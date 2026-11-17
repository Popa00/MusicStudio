import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { z } from 'zod'
import { KNOWLEDGE_LIMITS, sourceSchema, type KnowledgeSource } from '../../src/assistant/knowledge/schema.ts'
import { sourceLicense } from '../../src/assistant/knowledge/sources.ts'

/**
 * Le schede della biblioteca: un file markdown per area in `knowledge/cards/`.
 *
 *   ## riverbero | Riverbero
 *   parole: riverbero, reverb, eco della stanza
 *   fonti: Riverbero (Wikipedia) <https://it.wikipedia.org/wiki/Riverbero>; …
 *
 *   Testo della scheda…
 */

export interface Card {
  id: string
  area: string
  title: string
  keywords: string[]
  sources: KnowledgeSource[]
  text: string
}

const cardSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]{1,60}$/),
  area: z.string().min(1).max(40),
  title: z.string().min(1).max(120),
  keywords: z.array(z.string().min(1).max(60)).min(1).max(KNOWLEDGE_LIMITS.keywords),
  sources: z.array(sourceSchema).min(1).max(KNOWLEDGE_LIMITS.sources),
  text: z.string().min(80).max(KNOWLEDGE_LIMITS.textChars),
})

function parseSource(part: string, where: string): KnowledgeSource {
  const match = /^(.+?)\s*<(https:\/\/[^>\s]+)>$/.exec(part.trim())
  if (!match) throw new Error(`${where}: fonte non valida "${part}" (formato: Titolo <https://…>)`)
  const license = sourceLicense(match[2])
  if (!license) throw new Error(`${where}: sito non ammesso come fonte: ${match[2]}`)
  return { title: match[1], url: match[2], license }
}

function parseCard(block: string, area: string): Card {
  const [heading, ...rest] = block.split('\n')
  const [id, title] = heading.split('|').map((s) => s.trim())
  const where = `${area}/${id}`
  const meta = (name: string) => rest.find((l) => l.startsWith(`${name}:`))?.slice(name.length + 1).trim() ?? ''
  const text = rest
    .filter((l) => !/^(parole|fonti):/.test(l))
    .join('\n')
    .trim()
  const card = {
    id,
    area,
    title: title ?? '',
    keywords: meta('parole').split(',').map((k) => k.trim()).filter(Boolean),
    sources: meta('fonti').split(';').filter((s) => s.trim()).map((s) => parseSource(s, where)),
    text,
  }
  const parsed = cardSchema.safeParse(card)
  if (!parsed.success) throw new Error(`${where}: ${parsed.error.issues.map((i) => `${i.path.join('.')} ${i.message}`).join('; ')}`)
  return parsed.data
}

export function parseCards(markdown: string, area: string): Card[] {
  return markdown
    .replace(/\r\n/g, '\n')
    .split(/^## /m)
    .slice(1)
    .map((block) => parseCard(block, area))
}

/** Tutte le schede della cartella, controllando che gli identificativi non si ripetano. */
export function loadCards(dir: string): Card[] {
  const cards = readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .sort()
    .flatMap((f) => parseCards(readFileSync(join(dir, f), 'utf8'), f.replace(/\.md$/, '')))
  const ids = new Set<string>()
  for (const card of cards) {
    if (ids.has(card.id)) throw new Error(`Scheda ripetuta: ${card.id}`)
    ids.add(card.id)
  }
  return cards
}
