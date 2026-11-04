import type { Project } from '../types'
import { TemplateBuilder, type DrumHitSpec } from './build'

/** Charleston a ottavi: forte sul battito, più leggero in mezzo (il ritmo "respira"). */
const EIGHTHS: DrumHitSpec[] = [0, [2, 0.55], 4, [6, 0.55], 8, [10, 0.55], 12, [14, 0.55]]

/** Ritmo per ogni battuta: la nota base `root` suonata in stile "basso elettronico". */
function bassBar(root: number, bar: number): [number, number, number][] {
  const o = bar * 16
  return [[root, o, 3], [root, o + 4, 2], [root + 12, o + 6, 2], [root, o + 8, 3], [root, o + 12, 2], [root + 7, o + 14, 2]]
}

function chord(pitches: number[], bar: number): [number, number, number][] {
  return pitches.map((p) => [p, bar * 16, 16])
}

/** La minore, 110 BPM: batteria, basso, accordi e una melodia che entra a metà. */
export function electronicBeat(): Project {
  const b = new TemplateBuilder('Beat elettronico', 110)
  b.project = { ...b.project, scale: { root: 9, type: 'minor' } }

  const drums = b.drums('Batteria')
  const groove = b.drumPattern(drums, 'Groove', { kick: [0, 4, 8, 12], clap: [4, 12], hihatClosed: EIGHTHS })
  const fill = b.drumPattern(drums, 'Variante', { kick: [0, 4, 8, 10, 12], clap: [4, 12, 14], hihatClosed: [0, 4, 8, 12], hihatOpen: [2, 6, 10, 14] })

  const bass = b.synth('Basso', 'Basso', -4)
  const bassLine = b.notePattern(bass, 'Giro di basso', [...bassBar(45, 0), ...bassBar(41, 1), ...bassBar(48, 2), ...bassBar(43, 3)], 4)

  const pad = b.synth('Accordi', 'Pad atmosferico', -10)
  const chords = b.notePattern(pad, 'La- Fa Do Sol', [...chord([57, 60, 64], 0), ...chord([53, 57, 60], 1), ...chord([55, 60, 64], 2), ...chord([55, 59, 62], 3)], 4)

  const lead = b.synth('Melodia', 'Pluck', 0)
  const melody = b.notePattern(lead, 'Melodia', [
    [69, 0, 2], [72, 2, 2], [76, 4, 4], [74, 8, 2], [72, 10, 2], [69, 12, 4],
    [72, 16, 2], [74, 18, 2], [76, 20, 4], [79, 24, 4], [76, 28, 4],
    [76, 32, 2], [74, 34, 2], [72, 36, 4], [74, 40, 4], [72, 44, 4],
    [74, 48, 2], [72, 50, 2], [69, 52, 8], [67, 60, 4],
  ], 4)

  b.place(groove, 0, 1, 2, 4, 5, 6)
  b.place(fill, 3, 7)
  b.place(bassLine, 0, 4)
  b.place(chords, 0, 4)
  b.place(melody, 4)
  return b.project
}
