import * as Tone from 'tone'
import type { DrumVoiceId } from '../../music/drumPattern'
import { createDrumKit } from '../drums/kit'
import type { Instrument } from './types'

/** Tasti bianchi da Do in su → suoni di batteria, per suonarla dalla tastiera del PC. */
const KEY_TO_VOICE: Record<number, DrumVoiceId> = {
  0: 'kick',
  2: 'snare',
  4: 'clap',
  5: 'hihatClosed',
  7: 'hihatOpen',
}

export function drumVoiceForPitch(pitch: number): DrumVoiceId | undefined {
  return KEY_TO_VOICE[((pitch % 12) + 12) % 12]
}

export function createDrumInstrument(): Instrument {
  const kit = createDrumKit()

  return {
    output: kit.output,
    play: (event, time) => {
      if (event.kind === 'drum') kit.voices[event.voice].trigger(time, event.velocity)
    },
    noteOn: (pitch, velocity) => {
      const voice = drumVoiceForPitch(pitch)
      if (voice) kit.voices[voice].trigger(Tone.now(), velocity)
    },
    noteOff: () => {},
    releaseAll: () => {},
    update: () => {},
    dispose: kit.dispose,
  }
}
