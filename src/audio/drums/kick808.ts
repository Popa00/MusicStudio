import * as Tone from 'tone'
import type { AudioOutput, DrumVoice } from './types'

/**
 * Cassa 808: un "boom" grave e lungo (quasi un secondo) che fa da cassa e da basso insieme.
 * Scivolata di tono più corta della cassa normale; una leggera saturazione aggiunge armoniche
 * che la rendono udibile anche su casse piccole, dove i 50 Hz da soli quasi spariscono.
 */
export function createKick808(output: AudioOutput): DrumVoice {
  const drive = new Tone.Distortion({ distortion: 0.6, oversample: '2x' }).connect(output)
  const synth = new Tone.MembraneSynth({
    pitchDecay: 0.05,
    octaves: 2.5,
    oscillator: { type: 'sine' },
    envelope: { attack: 0.002, decay: 1.1, sustain: 0, release: 0.3 },
  }).connect(drive)
  synth.volume.value = 2

  return {
    trigger: (time, velocity) => synth.triggerAttackRelease('G1', 0.9, time, velocity),
    dispose: () => {
      synth.dispose()
      drive.dispose()
    },
  }
}
