import * as Tone from 'tone'
import { dbToAmplitude } from '../clip'
import { createClap } from './clap'
import { createHihat } from './hihat'
import { createKick } from './kick'
import { monotonic } from './monotonic'
import { createSnare } from './snare'
import type { DrumKit, DrumVoices } from './types'

/** Volume complessivo della batteria: lascia margine prima del limiter del master. */
const KIT_LEVEL_DB = -6

/** Batteria sintetizzata: nessun campione audio, tutti i suoni sono generati. */
export function createDrumKit(): DrumKit {
  const bus = new Tone.Gain(dbToAmplitude(KIT_LEVEL_DB))
  // Il contesto del bus: quello dal vivo, oppure quello offline durante l'export.
  const now = () => bus.context.currentTime
  const voices: DrumVoices = {
    kick: monotonic(createKick(bus), now),
    snare: monotonic(createSnare(bus), now),
    clap: monotonic(createClap(bus), now),
    hihatClosed: monotonic(createHihat(bus, 0.05), now),
    hihatOpen: monotonic(createHihat(bus, 0.3), now),
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
