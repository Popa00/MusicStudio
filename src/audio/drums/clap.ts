import * as Tone from 'tone'
import type { AudioOutput, DrumVoice } from './types'

/**
 * Battimani: un fruscio filtrato sulle frequenze medie, breve e secco.
 * Rumore bianco (non rosa): ha più energia sui medi, dove "vive" il battimani; con il rumore rosa
 * e un filtro stretto si sentiva appena (-37 dB contro i -13 della cassa).
 */
export function createClap(output: AudioOutput): DrumVoice {
  const filter = new Tone.Filter({ frequency: 1500, type: 'bandpass', Q: 1 }).connect(output)
  const noise = new Tone.NoiseSynth({
    noise: { type: 'white' },
    envelope: { attack: 0.001, decay: 0.15, sustain: 0 },
  }).connect(filter)
  noise.volume.value = 6

  return {
    trigger: (time, velocity) => noise.triggerAttackRelease('16n', time, velocity),
    dispose: () => {
      noise.dispose()
      filter.dispose()
    },
  }
}
