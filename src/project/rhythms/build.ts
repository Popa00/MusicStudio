import type { DrumVoiceId } from '../../music/drumPattern'
import type { DrumHitSpec } from '../templates/build'

/** I colpi di una battuta da 16 step (4 per battito): voce → step accesi, con intensità facoltativa. */
export type RhythmHits = Partial<Record<DrumVoiceId, DrumHitSpec[]>>

export interface RhythmVariant {
  name: 'Base' | 'Ricco'
  hits: RhythmHits
}

export interface GenreRhythm {
  id: string
  name: string
  /** Spiegazione semplice del carattere del ritmo. */
  description: string
  /** Velocità tipica del genere, in BPM. */
  bpm: number
  variants: [RhythmVariant, RhythmVariant]
}

/** Intensità ricorrenti: colpo forte, normale, medio, leggero, "fantasma" (appena accennato). */
export const V = { strong: 0.95, normal: 0.85, mid: 0.65, soft: 0.5, ghost: 0.35 } as const

/** Charleston a ottavi: `onBeat` sui battiti, `offBeat` in mezzo. Gli step in `skip` restano vuoti. */
export function eighths(onBeat: number, offBeat: number, skip: number[] = []): DrumHitSpec[] {
  return [0, 2, 4, 6, 8, 10, 12, 14].filter((s) => !skip.includes(s)).map((s) => [s, s % 4 === 0 ? onBeat : offBeat])
}

/** Charleston a sedicesimi: intensità diversa per battito, ottavo e sedicesimo (il ritmo "respira"). */
export function sixteenths(onBeat: number, eighth: number, sixteenth: number, skip: number[] = []): DrumHitSpec[] {
  return Array.from({ length: 16 }, (_, s) => s)
    .filter((s) => !skip.includes(s))
    .map((s) => [s, s % 4 === 0 ? onBeat : s % 2 === 0 ? eighth : sixteenth])
}
