import * as Tone from 'tone'
import { createBlips } from './blip'
import type { AudioOutput, DrumVoice } from './types'

/** Campanaccio (cowbell) come nella Roland 808: due onde quadre a 540 e 800 Hz, filtrate attorno a 800. */
export function createCowbell(output: AudioOutput): DrumVoice {
  const band = new Tone.Filter({ type: 'bandpass', frequency: 800, Q: 1.5 }).connect(output)
  const tones = createBlips(band, { frequencies: [540, 800], type: 'square', decay: 0.35, volumeDb: -10 })

  return {
    trigger: tones.trigger,
    dispose: () => {
      tones.dispose()
      band.dispose()
    },
  }
}
