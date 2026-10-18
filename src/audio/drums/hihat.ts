import * as Tone from 'tone'
import type { AudioOutput, DrumVoice } from './types'

/**
 * Charleston (hi-hat): suono metallico acuto.
 * `decay` corto = chiuso ("tic"), lungo = aperto ("tsss").
 */
export function createHihat(output: AudioOutput, decay: number): DrumVoice {
  const filter = new Tone.Filter(7000, 'highpass').connect(output)
  const metal = new Tone.MetalSynth({
    envelope: { attack: 0.001, decay, release: 0.01 },
    harmonicity: 5.1,
    modulationIndex: 32,
    resonance: 4000,
    octaves: 1.5,
  }).connect(filter)
  metal.volume.value = -18

  return {
    trigger: (time, velocity) => metal.triggerAttackRelease(300, decay, time, velocity),
    dispose: () => {
      metal.dispose()
      filter.dispose()
    },
  }
}
