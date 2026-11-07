import * as Tone from 'tone'
import type { DrumVoiceId } from '../../music/drumPattern'
import { dbToAmplitude } from '../clip'
import { monotonic } from './monotonic'
import type { DrumKit, DrumVoice } from './types'
import { VOICE_FACTORIES } from './voiceFactories'

/** Volume complessivo della batteria: lascia margine prima del limiter del master. */
export const KIT_LEVEL_DB = -3

/**
 * Crea i nodi nel contesto audio di `owner`. Un suono nasce al primo colpo, anche durante
 * l'export offline, quando il contesto globale di Tone è di nuovo quello dal vivo: senza questo
 * scambio i nodi finirebbero nel contesto sbagliato e la batteria esportata sarebbe muta.
 */
function inContextOf<T>(owner: Tone.ToneAudioNode, create: () => T): T {
  const original = Tone.getContext()
  if (original === owner.context) return create()
  Tone.setContext(owner.context)
  try {
    return create()
  } finally {
    Tone.setContext(original)
  }
}

/**
 * Batteria sintetizzata: nessun campione audio, tutti i suoni sono generati.
 * Ogni suono viene creato solo la prima volta che serve: un kit con 18 suoni non pesa
 * sul processore (né sullo Stop, che ricrea gli strumenti) se se ne usano 5.
 */
export function createDrumKit(): DrumKit {
  const bus = new Tone.Gain(dbToAmplitude(KIT_LEVEL_DB))
  // La batteria è mono (al centro): il rumore di Tone è stereo, con i due lati diversi, e senza
  // questa riduzione charleston e battimani diventerebbero una "nuvola" larga e 3 dB più forte.
  bus.channelCount = 1
  bus.channelCountMode = 'explicit'
  // Il contesto del bus: quello dal vivo, oppure quello offline durante l'export.
  const now = () => bus.context.currentTime
  const voices = new Map<DrumVoiceId, DrumVoice>()

  function voice(id: DrumVoiceId): DrumVoice {
    let created = voices.get(id)
    if (!created) {
      created = monotonic(inContextOf(bus, () => VOICE_FACTORIES[id](bus)), now)
      voices.set(id, created)
    }
    return created
  }

  return {
    trigger: (id, time, velocity) => voice(id).trigger(time, velocity),
    output: bus,
    dispose: () => {
      for (const v of voices.values()) v.dispose()
      voices.clear()
      bus.dispose()
    },
  }
}
