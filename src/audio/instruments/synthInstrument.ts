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

function createPoly(settings: SynthSettings, output: Tone.ToneAudioNode): Tone.PolySynth {
  const poly = new Tone.PolySynth(Tone.MonoSynth, toMonoSynthOptions(settings)).connect(output)
  poly.maxPolyphony = MAX_VOICES
  return poly
}

/**
 * Due sintetizzatori con lo stesso suono: uno per le note del brano, uno per quelle suonate
 * dal vivo (tastiera, piano roll). Se condividessero le voci, il rilascio di una nota del brano
 * potrebbe colpire la voce di una nota suonata dal vivo sulla stessa altezza.
 */
export function createSynthInstrument(settings: SynthSettings): Instrument {
  const output = new Tone.Volume(SYNTH_LEVEL_DB)
  const sequenced = createPoly(settings, output)
  const live = createPoly(settings, output)
  let current = settings

  return {
    output,
    play: (event, time, stepSeconds) => {
      if (event.kind !== 'note') return
      const duration = event.durationSteps * stepSeconds
      if (!(duration > 0) || !Number.isFinite(duration)) return
      sequenced.triggerAttackRelease(frequency(event.pitch), duration, time, event.velocity)
    },
    noteOn: (pitch, velocity) => live.triggerAttack(frequency(pitch), Tone.now(), velocity),
    noteOff: (pitch) => live.triggerRelease(frequency(pitch), Tone.now()),
    releaseAll: () => {
      sequenced.releaseAll()
      live.releaseAll()
    },
    update: (track) => {
      if (track.kind !== 'synth' || track.synth === current) return
      current = track.synth
      sequenced.set(toMonoSynthOptions(current))
      live.set(toMonoSynthOptions(current))
    },
    dispose: () => {
      sequenced.dispose()
      live.dispose()
      output.dispose()
    },
  }
}
