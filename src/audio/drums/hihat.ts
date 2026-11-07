import * as Tone from 'tone'
import type { AudioOutput, DrumVoice } from './types'

/**
 * Charleston (hi-hat): rumore bianco filtrato sugli acuti, come nelle drum machine classiche.
 * `decay` corto = chiuso ("tic"), lungo = aperto ("tsss").
 * Non usa MetalSynth: i suoi 6 oscillatori restano sempre accesi e pesano sul processore.
 * `volumeDb`: il chiuso è così corto che, allo stesso volume dell'aperto, si sentiva appena.
 */
export function createHihat(output: AudioOutput, decay: number, volumeDb: number): DrumVoice {
  // Q: Tone.Filter non accetta valori negativi (a differenza del filtro nativo): 0 è il minimo.
  const highpass = new Tone.Filter({ type: 'highpass', frequency: 7000, Q: 0 }).connect(output)
  const shine = new Tone.Filter({ type: 'peaking', frequency: 10000, Q: 1, gain: 6 }).connect(highpass)
  const noise = new Tone.NoiseSynth({
    noise: { type: 'white' },
    envelope: { attack: 0.001, decay, sustain: 0, release: 0.01 },
  }).connect(shine)
  noise.volume.value = volumeDb

  return {
    trigger: (time, velocity) => noise.triggerAttackRelease(decay, time, velocity),
    dispose: () => {
      noise.dispose()
      shine.dispose()
      highpass.dispose()
    },
  }
}
