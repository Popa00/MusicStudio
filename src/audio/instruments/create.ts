import type { Track } from '../../project/types'
import { createDrumInstrument } from './drumInstrument'
import { createPercussionInstrument } from './percussionInstrument'
import { createSynthInstrument } from './synthInstrument'
import type { Instrument } from './types'

export function createInstrument(track: Track): Instrument {
  if (track.kind === 'drums') return createDrumInstrument()
  if (track.kind === 'percussion') return createPercussionInstrument(track.sound)
  return createSynthInstrument(track.synth)
}
