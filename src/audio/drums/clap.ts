import * as Tone from 'tone'
import type { AudioOutput, DrumVoice } from './types'

/** Battimani: un fruscio filtrato sulle frequenze medie, breve e secco. */
export function createClap(output: AudioOutput): DrumVoice {
  const filter = new Tone.Filter({ frequency: 1200, type: 'bandpass', Q: 1.5 }).connect(output)
  const noise = new Tone.NoiseSynth({
    noise: { type: 'pink' },
    envelope: { attack: 0.001, decay: 0.15, sustain: 0 },
  }).connect(filter)
  noise.volume.value = -2

  return {
    trigger: (time, velocity) => noise.triggerAttackRelease('16n', time, velocity),
    dispose: () => {
      noise.dispose()
      filter.dispose()
    },
  }
}
