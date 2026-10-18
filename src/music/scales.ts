export const SCALE_TYPES = ['none', 'major', 'minor', 'pentatonicMajor', 'pentatonicMinor'] as const

export type ScaleType = (typeof SCALE_TYPES)[number]

/** Distanze in semitoni dalla nota base (la "tonica"). */
const INTERVALS: Record<Exclude<ScaleType, 'none'>, number[]> = {
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
  pentatonicMajor: [0, 2, 4, 7, 9],
  pentatonicMinor: [0, 3, 5, 7, 10],
}

export const SCALE_LABELS: Record<ScaleType, string> = {
  none: 'Nessuna (tutte le note)',
  major: 'Maggiore (allegra)',
  minor: 'Minore (malinconica)',
  pentatonicMajor: 'Pentatonica maggiore (difficile sbagliare)',
  pentatonicMinor: 'Pentatonica minore (blues, rock)',
}

/** True se la nota (numero MIDI) appartiene alla scala con quella tonica (0 = Do). */
export function isInScale(pitch: number, root: number, type: ScaleType): boolean {
  if (type === 'none') return true
  const degree = (((pitch - root) % 12) + 12) % 12
  return INTERVALS[type].includes(degree)
}
