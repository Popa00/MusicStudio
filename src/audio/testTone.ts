import * as Tone from 'tone'
import { getMasterInput } from './master'

let synth: Tone.PolySynth | null = null

/** Suona una nota di prova per verificare che la catena audio funzioni. */
export function playTestNote(note = 'C4'): void {
  synth ??= new Tone.PolySynth(Tone.Synth).connect(getMasterInput())
  synth.triggerAttackRelease(note, '8n')
}
