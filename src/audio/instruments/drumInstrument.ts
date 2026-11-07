import * as Tone from 'tone'
import type { DrumVoiceId } from '../../music/drumPattern'
import { createDrumKit } from '../drums/kit'
import { preloadSamples } from '../drums/sampleVoice'
import { reportOnce } from '../safety'
import type { Instrument } from './types'

/**
 * Tasti da Do in su → suoni di batteria, per suonarla dalla tastiera del PC.
 * Tasti bianchi (A S D F G H J): i suoni principali; tasti neri (W E T Y U): percussioni.
 */
const KEY_TO_VOICE: Record<number, DrumVoiceId> = {
  0: 'kick',
  1: 'rimshot',
  2: 'snare',
  3: 'snap',
  4: 'clap',
  5: 'hihatClosed',
  6: 'shaker',
  7: 'hihatOpen',
  8: 'tambourine',
  9: 'tomLow',
  10: 'cowbell',
  11: 'tomHigh',
}

export function drumVoiceForPitch(pitch: number): DrumVoiceId | undefined {
  return KEY_TO_VOICE[((pitch % 12) + 12) % 12]
}

export function createDrumInstrument(): Instrument {
  const kit = createDrumKit()

  // I piatti registrati si scaricano subito: al primo colpo (o all'export) devono essere già pronti.
  // Se il file non arriva si avvisa una volta e la batteria suona lo stesso, senza piatti.
  const ready = preloadSamples().catch((error: unknown) => reportOnce(error, 'suoni registrati'))

  return {
    output: kit.output,
    ready,
    play: (event, time) => {
      if (event.kind === 'drum') kit.trigger(event.voice, time, event.velocity)
    },
    noteOn: (pitch, velocity) => {
      const voice = drumVoiceForPitch(pitch)
      if (voice) kit.trigger(voice, Tone.now(), velocity)
    },
    noteOff: () => {},
    releaseAll: () => {},
    update: () => {},
    dispose: kit.dispose,
  }
}
