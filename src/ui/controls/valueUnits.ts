import { formatDb, formatHz, formatPan, formatPercent, formatSeconds } from './format'

/**
 * Come si mostra un valore e come si legge quello scritto a mano.
 * `parse` riceve anche il valore attuale: un numero senza unità si intende nell'unità mostrata
 * (con "500 ms" sullo schermo, scrivere "300" vuol dire 300 ms). Restituisce null se non è un numero.
 */
export interface ValueUnit {
  format: (value: number) => string
  parse: (text: string, current: number) => number | null
}

const NUMBER = /[-+]?(?:\d+(?:[.,]\d*)?|[.,]\d+)/

/** Il primo numero nel testo; accetta la virgola italiana ("2,5"). */
export function readNumber(text: string): number | null {
  const match = text.match(NUMBER)
  if (!match) return null
  const value = Number(match[0].replace(',', '.'))
  return Number.isFinite(value) ? value : null
}

/** Quello che resta dopo il numero, in minuscolo (es. "ms", "khz", "dx"). */
function suffix(text: string): string {
  return text.replace(NUMBER, '').trim().toLowerCase()
}

export const PLAIN: ValueUnit = { format: (v) => v.toFixed(1), parse: (text) => readNumber(text) }

export const BPM: ValueUnit = { format: (v) => `${v} BPM`, parse: (text) => readNumber(text) }

export const PERCENT: ValueUnit = {
  format: formatPercent,
  parse: (text) => {
    const n = readNumber(text)
    return n === null ? null : n / 100
  },
}

export const DECIBELS: ValueUnit = {
  format: formatDb,
  parse: (text) => (/∞|inf/i.test(text) ? -Infinity : readNumber(text)),
}

export const SECONDS: ValueUnit = {
  format: formatSeconds,
  parse: (text, current) => {
    const n = readNumber(text)
    if (n === null) return null
    const unit = suffix(text)
    const inMs = unit.startsWith('ms') || (!unit.startsWith('s') && current < 1)
    return inMs ? n / 1000 : n
  },
}

export const HERTZ: ValueUnit = {
  format: formatHz,
  parse: (text, current) => {
    const n = readNumber(text)
    if (n === null) return null
    const unit = suffix(text)
    const inKhz = unit.startsWith('k') || (!unit.startsWith('h') && current >= 1000)
    return inKhz ? n * 1000 : n
  },
}

/** Pan: "50 dx", "30 sx", "-30" (negativo = sinistra), "centro". */
export const PAN: ValueUnit = {
  format: formatPan,
  parse: (text) => {
    if (/^\s*c/i.test(text)) return 0
    const n = readNumber(text)
    if (n === null) return null
    const unit = suffix(text)
    if (/^(sx|s|l)/.test(unit)) return -Math.abs(n) / 100
    if (/^(dx|d|r)/.test(unit)) return Math.abs(n) / 100
    return n / 100
  },
}

/** Intonazione in semitoni (il passo tra due tasti vicini del pianoforte). */
export const SEMITONES: ValueUnit = {
  format: (v) => `${v > 0 ? '+' : ''}${Math.round(v)} semitoni`,
  parse: (text) => {
    const n = readNumber(text)
    return n === null ? null : Math.round(n)
  },
}
