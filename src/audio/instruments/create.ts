import type { Track } from '../../project/types'
import { createDrumInstrument } from './drumInstrument'
import { createSynthInstrument } from './synthInstrument'
import type { Instrument } from './types'

export function createInstrument(track: Track): Instrument {
  return track.kind === 'drums' ? createDrumInstrument() : createSynthInstrument(track.synth)
}
