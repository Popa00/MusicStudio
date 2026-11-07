import { createBlips } from './blip'
import type { AudioOutput, DrumVoice } from './types'

/** Clave: due legnetti battuti, un "toc" acuto e cortissimo. */
export function createClave(output: AudioOutput): DrumVoice {
  return createBlips(output, { frequencies: [2500], type: 'triangle', decay: 0.04, volumeDb: -1 })
}
