import * as Tone from 'tone'
import type { AudioOutput, DrumVoice } from './types'

/** Perc: un "blip" breve e intonato con una piccola scivolata, molto usato in techno e house. */
export function createPerc(output: AudioOutput): DrumVoice {
  const synth = new Tone.MembraneSynth({
    pitchDecay: 0.01,
    octaves: 1.5,
    oscillator: { type: 'triangle' },
    envelope: { attack: 0.001, decay: 0.08, sustain: 0, release: 0.02 },
  }).connect(output)
  synth.volume.value = -2

  return {
    trigger: (time, velocity) => synth.triggerAttackRelease('A5', 0.08, time, velocity),
    dispose: () => synth.dispose(),
  }
}
