import * as Tone from 'tone'
import type { AudioOutput, DrumVoice } from './types'

/** Rullante: un fruscio breve (la cordiera) sopra un colpo corto di membrana (il corpo). */
export function createSnare(output: AudioOutput): DrumVoice {
  const filter = new Tone.Filter(1800, 'highpass').connect(output)
  const noise = new Tone.NoiseSynth({
    noise: { type: 'white' },
    envelope: { attack: 0.001, decay: 0.18, sustain: 0 },
  }).connect(filter)
  noise.volume.value = -6
  const body = new Tone.MembraneSynth({
    pitchDecay: 0.02,
    octaves: 2,
    envelope: { attack: 0.001, decay: 0.12, sustain: 0 },
  }).connect(output)
  body.volume.value = -8

  return {
    trigger: (time, velocity) => {
      noise.triggerAttackRelease('16n', time, velocity)
      body.triggerAttackRelease('D3', '16n', time, velocity)
    },
    dispose: () => {
      noise.dispose()
      body.dispose()
      filter.dispose()
    },
  }
}
