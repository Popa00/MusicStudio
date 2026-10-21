import type { Project } from '../types'
import { TemplateBuilder } from './build'

function chord(pitches: number[], bar: number): [number, number, number][] {
  return pitches.map((p) => [p, bar * 16, 14])
}

/** Do maggiore, 80 BPM: ritmo lento e accordi "jazz" morbidi. */
export function lofi(): Project {
  const b = new TemplateBuilder('Lo-fi tranquillo', 80)

  const drums = b.drums('Batteria')
  const beat = b.drumPattern(drums, 'Beat lento', { kick: [0, 7, 10], snare: [4, 12], hihatClosed: [0, 2, 4, 6, 8, 10, 12, 14] })

  const keys = b.synth('Piano', 'Piano elettrico', -5)
  const progression = b.notePattern(keys, 'Accordi', [
    ...chord([60, 64, 67, 71], 0),
    ...chord([57, 60, 64, 67], 1),
    ...chord([62, 65, 69, 72], 2),
    ...chord([55, 59, 62, 65], 3),
  ], 4)

  const bass = b.synth('Basso', 'Basso', -3)
  const bassLine = b.notePattern(bass, 'Basso', [[36, 0, 6], [36, 10, 4], [33, 16, 6], [33, 26, 4], [38, 32, 6], [38, 42, 4], [31, 48, 6], [31, 58, 4]], 4)

  b.place(beat, 0, 1, 2, 3, 4, 5, 6, 7)
  b.place(progression, 0, 4)
  b.place(bassLine, 4)
  return b.project
}
