import * as Tone from 'tone'
import type { SynthSettings } from '../../project/types'
import { toFilterOptions, toVoiceOptions } from './synthOptions'
import type { Instrument } from './types'

/** Volume di base: più note insieme si sommano, serve margine. */
const SYNTH_LEVEL_DB = -6

/**
 * Le forme d'onda hanno energia molto diversa a parità di ampiezza (la quadra è la più "piena"):
 * senza compensazione, cambiando preset il volume saltava fino a 18 dB.
 */
const WAVEFORM_TRIM_DB: Record<SynthSettings['waveform'], number> = {
  sine: 0,
  triangle: 0,
  sawtooth: -3,
  square: -6,
}

export function synthLevelDb(settings: SynthSettings): number {
  return SYNTH_LEVEL_DB + WAVEFORM_TRIM_DB[settings.waveform]
}

/** Note contemporanee per traccia: oltre, la nota più vecchia viene interrotta. */
const MAX_VOICES = 10

function frequency(pitch: number): number {
  return Tone.Frequency(pitch, 'midi').toFrequency()
}

function createPoly(settings: SynthSettings, output: Tone.InputNode): Tone.PolySynth {
  const poly = new Tone.PolySynth(Tone.Synth, toVoiceOptions(settings)).connect(output)
  poly.maxPolyphony = MAX_VOICES
  return poly
}

/**
 * Voci leggere → un filtro unico → volume. Le note suonate dal vivo (tastiera, piano roll) usano
 * un secondo PolySynth, creato solo al primo uso: se condividessero le voci con il brano, il
 * rilascio di una nota del brano potrebbe colpire una nota suonata dal vivo sulla stessa altezza.
 */
export function createSynthInstrument(settings: SynthSettings): Instrument {
  const output = new Tone.Volume(synthLevelDb(settings))
  const filter = new Tone.Filter(toFilterOptions(settings)).connect(output)
  const sequenced = createPoly(settings, filter)
  let live: Tone.PolySynth | null = null
  let current = settings
  const livePoly = () => (live ??= createPoly(current, filter))

  return {
    output,
    play: (event, time, stepSeconds) => {
      if (event.kind !== 'note') return
      const duration = event.durationSteps * stepSeconds
      if (!(duration > 0) || !Number.isFinite(duration)) return
      sequenced.triggerAttackRelease(frequency(event.pitch), duration, time, event.velocity)
    },
    noteOn: (pitch, velocity) => livePoly().triggerAttack(frequency(pitch), Tone.now(), velocity),
    noteOff: (pitch) => live?.triggerRelease(frequency(pitch), Tone.now()),
    releaseAll: () => {
      sequenced.releaseAll()
      live?.releaseAll()
    },
    update: (track) => {
      if (track.kind !== 'synth' || track.synth === current) return
      current = track.synth
      sequenced.set(toVoiceOptions(current))
      live?.set(toVoiceOptions(current))
      // Mai filter.set(): con "rolloff" Tone ricrea i filtri a ogni chiamata (click e nodi orfani).
      filter.frequency.rampTo(current.cutoff, 0.05)
      filter.Q.rampTo(current.resonance, 0.05)
      output.volume.rampTo(synthLevelDb(current), 0.05)
    },
    dispose: () => {
      sequenced.dispose()
      live?.dispose()
      filter.dispose()
      output.dispose()
    },
  }
}
