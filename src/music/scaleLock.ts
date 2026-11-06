import { scaleIntervals, type ScaleType } from './scales'

export interface ScaleRef {
  /** Tonica: 0 = Do ... 11 = Si. */
  root: number
  type: ScaleType
}

const MIN_PITCH = 0
const MAX_PITCH = 127

/**
 * Numera le note della scala su tutta la tastiera: la tonica dell'ottava 0 è il grado 0, la nota
 * successiva della scala il grado 1, e così via (anche negativi). Una nota fuori scala prende il
 * grado della nota della scala subito sotto.
 */
export function degreeIndex(pitch: number, scale: ScaleRef): number {
  const intervals = scaleIntervals(scale.type)
  const relative = pitch - scale.root
  const octave = Math.floor(relative / 12)
  const inOctave = relative - octave * 12
  let index = 0
  while (index + 1 < intervals.length && intervals[index + 1] <= inOctave) index++
  return octave * intervals.length + index
}

/** L'altezza (numero MIDI) di un grado della scala. */
export function pitchAtDegree(degree: number, scale: ScaleRef): number {
  const intervals = scaleIntervals(scale.type)
  const octave = Math.floor(degree / intervals.length)
  return scale.root + octave * 12 + intervals[degree - octave * intervals.length]
}

/** La nota della scala più vicina (a pari distanza, quella sotto), sempre dentro la tastiera MIDI. */
export function snapToScale(rawPitch: number, scale: ScaleRef): number {
  const pitch = Math.min(MAX_PITCH, Math.max(MIN_PITCH, rawPitch))
  const degree = degreeIndex(pitch, scale)
  const below = pitchAtDegree(degree, scale)
  const above = pitchAtDegree(degree + 1, scale)
  if (below < MIN_PITCH) return above
  if (above > MAX_PITCH) return below
  return pitch - below <= above - pitch ? below : above
}

/**
 * Sale o scende di `steps` note della scala (+1 = la nota della scala successiva).
 * Da una nota fuori scala, il primo passo porta alla nota della scala più vicina in quella direzione.
 */
export function stepInScale(pitch: number, scale: ScaleRef, steps: number): number {
  const degree = degreeIndex(pitch, scale)
  const inScale = pitchAtDegree(degree, scale) === pitch
  const target = inScale || steps === 0 ? degree + steps : steps > 0 ? degree + steps : degree + steps + 1
  return pitchAtDegree(target, scale)
}

/** Di quanti gradi della scala si è spostato chi passa da `from` a `to` (entrambi agganciati alla scala). */
export function degreesBetween(from: number, to: number, scale: ScaleRef): number {
  return degreeIndex(snapToScale(to, scale), scale) - degreeIndex(snapToScale(from, scale), scale)
}
