import { identifyChord, type Chord } from './chords'
import { pitchClassName } from './notes'
import { scaleIntervals, type ScaleType } from './scales'

const SCALE_NAMES: Record<ScaleType, string> = {
  none: 'nessuna scala',
  major: 'maggiore',
  minor: 'minore',
  pentatonicMajor: 'pentatonica maggiore',
  pentatonicMinor: 'pentatonica minore',
}

/** Es. "La minore". */
export function scaleName(root: number, type: ScaleType): string {
  return type === 'none' ? SCALE_NAMES.none : `${pitchClassName(root)} ${SCALE_NAMES[type]}`
}

/** Le note della scala in ordine, es. La minore → La Si Do Re Mi Fa Sol. */
export function scaleNoteNames(root: number, type: ScaleType): string[] {
  return scaleIntervals(type).map((i) => pitchClassName(root + i))
}

/**
 * Gli accordi "di casa" della scala: su ogni nota se ne costruisce uno prendendo una nota sì e una no
 * (1ª, 3ª e 5ª). Solo per le scale di 7 note (maggiore e minore): con questi non si sbaglia.
 */
export function scaleChords(root: number, type: ScaleType): Chord[] {
  const intervals = scaleIntervals(type)
  if (intervals.length !== 7) return []
  const chords: Chord[] = []
  for (let degree = 0; degree < 7; degree++) {
    const pitches = [0, 2, 4].map((k) => {
      const i = degree + k
      return 60 + root + intervals[i % 7] + 12 * Math.floor(i / 7)
    })
    const chord = identifyChord(pitches)
    if (chord) chords.push(chord)
  }
  return chords
}
