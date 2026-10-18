import * as Tone from 'tone'
import { dbToAmplitude } from '../clip'
import { createClap } from './clap'
import { createHihat } from './hihat'
import { createKick } from './kick'
import { createSnare } from './snare'
import type { DrumKit, DrumVoices } from './types'

/** Volume complessivo della batteria: lascia margine prima del limiter del master. */
const KIT_LEVEL_DB = -6

/** Batteria sintetizzata: nessun campione audio, tutti i suoni sono generati. */
export function createDrumKit(): DrumKit {
  const bus = new Tone.Gain(dbToAmplitude(KIT_LEVEL_DB))
  const voices: DrumVoices = {
    kick: createKick(bus),
    snare: createSnare(bus),
    clap: createClap(bus),
    hihatClosed: createHihat(bus, 0.05),
    hihatOpen: createHihat(bus, 0.3),
  }

  return {
    voices,
    output: bus,
    dispose: () => {
      for (const voice of Object.values(voices)) voice.dispose()
      bus.dispose()
    },
  }
}
