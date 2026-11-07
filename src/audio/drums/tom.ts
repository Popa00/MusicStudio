import * as Tone from 'tone'
import type { AudioOutput, DrumVoice } from './types'

/**
 * Tom: tamburo intonato dei "giri" di batteria (tum-tum-TUM). Come la cassa ma più acuto e
 * con una scivolata di tono più breve. `note` decide se è basso, medio o alto.
 */
export function createTom(output: AudioOutput, note: string, decay: number): DrumVoice {
  const synth = new Tone.MembraneSynth({
    pitchDecay: 0.06,
    octaves: 2.5,
    oscillator: { type: 'sine' },
    envelope: { attack: 0.001, decay, sustain: 0, release: 0.1 },
  }).connect(output)
  synth.volume.value = -4

  return {
    trigger: (time, velocity) => synth.triggerAttackRelease(note, decay, time, velocity),
    dispose: () => synth.dispose(),
  }
}
