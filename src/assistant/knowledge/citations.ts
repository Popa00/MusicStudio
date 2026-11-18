/**
 * Le schede che il modello dice di aver usato. Le istruzioni gli chiedono di chiudere la risposta con una
 * riga come "FONTI: 1, 3" (o "FONTI: nessuna"): l'app la toglie dal testo e mostra solo le fonti di quelle
 * schede. Se la riga manca, si decide in un altro modo (vedi `cited` in `retrieve.ts`).
 */

export const CITATION_LABEL = 'FONTI'

/** La riga delle citazioni, anche scritta con grassetto o corsivo ("**Fonti:** 2"). */
const CITATION_LINE = /^[\s*_>-]*fonti[\s*_]*:([^\r\n]*)$/i

export interface Citations {
  /** Il testo senza la riga delle citazioni. */
  text: string
  /** I numeri delle schede usate (vuoto = nessuna), o null se il modello non ha scritto la riga. */
  cited: number[] | null
}

/** Mentre la risposta arriva, l'ultima riga può essere l'inizio di "FONTI:" ancora incompleto: non si mostra. */
function isPartialLabel(line: string): boolean {
  const word = line.replace(/^[\s*_>-]+/, '').trimEnd().toUpperCase()
  return word.length > 0 && word.length < CITATION_LABEL.length + 1 && `${CITATION_LABEL}:`.startsWith(word)
}

/** L'indice dell'ultima riga non vuota (-1 se sono tutte vuote). */
function lastFilledLine(lines: readonly string[]): number {
  for (let i = lines.length - 1; i >= 0; i--) if (lines[i].trim()) return i
  return -1
}

/** Legge e toglie la riga delle citazioni: vale solo se è l'ultima riga scritta (dopo ci sono solo righe vuote). */
export function splitCitations(answer: string): Citations {
  const lines = answer.split(/\r?\n/)
  const last = lastFilledLine(lines)
  const match = last >= 0 ? CITATION_LINE.exec(lines[last]) : null
  if (match) {
    const cited = [...match[1].matchAll(/\d+/g)].map((m) => Number(m[0]))
    return { text: lines.slice(0, last).join('\n').trimEnd(), cited }
  }
  if (last > 0 && isPartialLabel(lines[last])) return { text: lines.slice(0, last).join('\n').trimEnd(), cited: null }
  return { text: answer, cited: null }
}
