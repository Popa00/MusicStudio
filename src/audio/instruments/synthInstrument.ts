import * as Tone from 'tone'
import type { SynthSettings } from '../../project/types'
import { toMonoSynthOptions } from './synthOptions'
import type { Instrument } from './types'

/** Volume di base: più note insieme si sommano, serve margine. */
const SYNTH_LEVEL_DB = -9
const MAX_VOICES = 16

function frequency(pitch: number): number {
  return Tone.Frequency(pitch, 'midi').toFrequency()
}

export function createSynthInstrument(settings: SynthSettings): Instrument {
  const poly = new Tone.PolySynth(Tone.MonoSynth, toMonoSynthOptions(settings))
  poly.maxPolyphony = MAX_VOICES
  poly.volume.value = SYNTH_LEVEL_DB
  let current = settings

  return {
    output: poly,
    play: (event, time, stepSeconds) => {
      if (event.kind !== 'note') return
      poly.triggerAttackRelease(frequency(event.pitch), event.durationSteps * stepSeconds, time, event.velocity)
    },
    noteOn: (pitch, velocity) => poly.triggerAttack(frequency(pitch), Tone.now(), velocity),
    noteOff: (pitch) => poly.triggerRelease(frequency(pitch), Tone.now()),
    releaseAll: () => poly.releaseAll(),
    update: (track) => {
      if (track.kind !== 'synth' || track.synth === current) return
      current = track.synth
      poly.set(toMonoSynthOptions(current))
    },
    dispose: () => poly.dispose(),
  }
}
