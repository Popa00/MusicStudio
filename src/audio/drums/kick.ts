import * as Tone from 'tone'
import type { AudioOutput, DrumVoice } from './types'

/** Cassa: una nota grave la cui altezza scende rapidamente, come una membrana colpita. */
export function createKick(output: AudioOutput): DrumVoice {
  const synth = new Tone.MembraneSynth({
    pitchDecay: 0.05,
    octaves: 6,
    envelope: { attack: 0.001, decay: 0.4, sustain: 0, release: 0.1 },
  }).connect(output)

  return {
    trigger: (time, velocity) => synth.triggerAttackRelease('C1', '8n', time, velocity),
    dispose: () => synth.dispose(),
  }
}
