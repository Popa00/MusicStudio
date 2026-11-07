import type * as Tone from 'tone'
import type { DrumVoiceId } from '../../music/drumPattern'

/** Un suono di batteria: si fa partire a un tempo preciso con una certa intensità (0-1). */
export interface DrumVoice {
  trigger: (time: number, velocity: number) => void
  dispose: () => void
}

export interface DrumKit {
  /** Fa suonare un suono del kit (creato al primo uso). */
  trigger: (voice: DrumVoiceId, time: number, velocity: number) => void
  output: Tone.ToneAudioNode
  dispose: () => void
}

export type AudioOutput = Tone.ToneAudioNode
