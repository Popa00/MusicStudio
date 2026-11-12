import { pitchClassName } from './notes'

/** Un tipo di accordo: le distanze in semitoni dalla nota che gli dà il nome (la "fondamentale"). */
interface ChordShape {
  intervals: readonly number[]
  /** Come si scrive dopo il nome della nota: "" = maggiore, "m" = minore, ... */
  suffix: string
  label: string
}

/** In ordine di preferenza: a parità di note vince il primo (es. un accordo di 3 note prima di uno sospeso). */
const SHAPES: readonly ChordShape[] = [
  { intervals: [0, 4, 7], suffix: '', label: 'maggiore' },
  { intervals: [0, 3, 7], suffix: 'm', label: 'minore' },
  { intervals: [0, 3, 6], suffix: 'dim', label: 'diminuito' },
  { intervals: [0, 4, 8], suffix: '+', label: 'aumentato' },
  { intervals: [0, 5, 7], suffix: 'sus4', label: 'sospeso (con la quarta)' },
  { intervals: [0, 2, 7], suffix: 'sus2', label: 'sospeso (con la seconda)' },
  { intervals: [0, 4, 7, 10], suffix: '7', label: 'di settima' },
  { intervals: [0, 4, 7, 11], suffix: 'maj7', label: 'maggiore con settima maggiore' },
  { intervals: [0, 3, 7, 10], suffix: 'm7', label: 'minore con settima' },
  { intervals: [0, 3, 6, 10], suffix: 'm7b5', label: 'semidiminuito' },
]

export interface Chord {
  /** Fondamentale (0 = Do). */
  root: number
  /** Nota più grave (0 = Do): se non è la fondamentale l'accordo è "rivoltato". */
  bass: number
  /** Es. "Lam", "Sol7", "Do/Mi". */
  name: string
  /** Es. "minore". */
  quality: string
  /** Le note dell'accordo dalla fondamentale, es. ["La", "Do", "Mi"]. */
  noteNames: string[]
}

const mod12 = (n: number) => ((n % 12) + 12) % 12

function shapeFor(pitchClasses: number[], root: number): ChordShape | undefined {
  const intervals = pitchClasses.map((pc) => mod12(pc - root)).sort((a, b) => a - b)
  return SHAPES.find((s) => s.intervals.length === intervals.length && s.intervals.every((v, i) => v === intervals[i]))
}

/**
 * Riconosce l'accordo formato da più note suonate insieme (numeri MIDI, in qualsiasi ottava).
 * Restituisce null con meno di 3 note diverse o con combinazioni che non sono un accordo comune.
 */
export function identifyChord(pitches: readonly number[]): Chord | null {
  if (pitches.length === 0) return null
  const pitchClasses = [...new Set(pitches.map(mod12))]
  if (pitchClasses.length < 3) return null
  const bass = mod12(Math.min(...pitches))
  const matches = pitchClasses
    .map((root) => ({ root, shape: shapeFor(pitchClasses, root) }))
    .filter((m): m is { root: number; shape: ChordShape } => m.shape !== undefined)
  if (matches.length === 0) return null
  // Accordi simmetrici (aumentato) o ambigui (sus2/sus4): si preferisce la nota più grave come fondamentale.
  const best = matches.find((m) => m.root === bass) ?? matches.sort((a, b) => SHAPES.indexOf(a.shape) - SHAPES.indexOf(b.shape))[0]
  const slash = best.root === bass ? '' : `/${pitchClassName(bass)}`
  return {
    root: best.root,
    bass,
    name: `${pitchClassName(best.root)}${best.shape.suffix}${slash}`,
    quality: best.shape.label,
    noteNames: best.shape.intervals.map((i) => pitchClassName(best.root + i)),
  }
}

/** Note che due accordi hanno in comune, es. Lam e Fa → ["La", "Do"]. */
export function commonNotes(a: Chord, b: Chord): string[] {
  return a.noteNames.filter((n) => b.noteNames.includes(n))
}
