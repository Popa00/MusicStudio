import type * as Tone from 'tone'
import type { DrumVoiceId } from '../../music/drumPattern'

/** Un suono di batteria: si fa partire a un tempo preciso con una certa intensità (0-1). */
export interface DrumVoice {
  trigger: (time: number, velocity: number) => void
  dispose: () => void
}

export type DrumVoices = Record<DrumVoiceId, DrumVoice>

export interface DrumKit {
  voices: DrumVoices
  output: Tone.ToneAudioNode
  dispose: () => void
}

export type AudioOutput = Tone.ToneAudioNode
