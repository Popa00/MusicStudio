/**
 * Lettura minima del "markdown" che i modelli usano nelle risposte (titoli, elenchi, grassetto).
 * Produce solo dati: i componenti li trasformano in elementi React, mai in HTML grezzo.
 */
export type Block = { kind: 'p' | 'h'; text: string } | { kind: 'ul' | 'ol'; items: string[] }
export type Inline = { kind: 'text' | 'strong' | 'em' | 'code'; text: string }

const HEADING = /^#{1,6}\s+(.*)$/
const BULLET = /^[-*•]\s+(.*)$/
const NUMBERED = /^\d+[.)]\s+(.*)$/

export function parseBlocks(text: string): Block[] {
  const blocks: Block[] = []
  let paragraph: string[] = []
  const flush = () => {
    if (paragraph.length > 0) blocks.push({ kind: 'p', text: paragraph.join('\n') })
    paragraph = []
  }
  for (const raw of text.split('\n')) {
    const line = raw.trim()
    const heading = HEADING.exec(line)
    const item = BULLET.exec(line) ?? NUMBERED.exec(line)
    if (!line) {
      flush()
    } else if (heading) {
      flush()
      blocks.push({ kind: 'h', text: heading[1] })
    } else if (item) {
      flush()
      const kind = BULLET.test(line) ? 'ul' : 'ol'
      const last = blocks.at(-1)
      // Righe vuote tra un punto e l'altro non spezzano l'elenco.
      if (last?.kind === kind) last.items.push(item[1])
      else blocks.push({ kind, items: [item[1]] })
    } else {
      paragraph.push(line)
    }
  }
  flush()
  return blocks
}

const INLINE = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*\s][^*]*\*)/g

export function parseInline(text: string): Inline[] {
  // Con un gruppo nella regex, split mette le parti riconosciute nelle posizioni dispari:
  // solo quelle diventano grassetto/corsivo/codice, il resto resta testo (anche "****").
  return text
    .split(INLINE)
    .map((part, i): Inline => {
      if (i % 2 === 0) return { kind: 'text', text: part }
      if (part.startsWith('**')) return { kind: 'strong', text: part.slice(2, -2) }
      if (part.startsWith('`')) return { kind: 'code', text: part.slice(1, -1) }
      return { kind: 'em', text: part.slice(1, -1) }
    })
    .filter((part) => part.text !== '')
}
