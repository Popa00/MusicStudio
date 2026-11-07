import * as Tone from 'tone'
import { createBlips, createNoiseBurst } from './blip'
import type { AudioOutput, DrumVoice } from './types'

/** Rimshot: il "tac" secco della bacchetta sul bordo del rullante (stile drum machine). */
export function createRimshot(output: AudioOutput): DrumVoice {
  const band = new Tone.Filter({ type: 'bandpass', frequency: 1700, Q: 1.2 }).connect(output)
  const body = createBlips(band, { frequencies: [480, 1750], type: 'triangle', decay: 0.03, volumeDb: 0 })
  const click = createNoiseBurst(band, 0.001, 0.012, -6)

  return {
    trigger: (time, velocity) => {
      body.trigger(time, velocity)
      click.trigger(time, velocity)
    },
    dispose: () => {
      body.dispose()
      click.dispose()
      band.dispose()
    },
  }
}
