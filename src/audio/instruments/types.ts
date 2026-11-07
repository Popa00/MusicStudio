import type * as Tone from 'tone'
import type { TriggerEvent } from '../../music/schedule'
import type { Track } from '../../project/types'

/** Qualcosa che produce suono per una traccia: batteria o sintetizzatore. */
export interface Instrument {
  readonly output: Tone.ToneAudioNode
  /** Si risolve quando i suoni registrati sono pronti (serve all'export); sempre risolta, anche se falliscono. */
  readonly ready?: Promise<void>
  /** Suona un evento programmato a un tempo preciso. */
  play: (event: TriggerEvent, time: number, stepSeconds: number) => void
  /** Suona dal vivo (tastiera del PC, click sul piano roll). */
  noteOn: (pitch: number, velocity: number) => void
  noteOff: (pitch: number) => void
  releaseAll: () => void
  /** Applica nuove impostazioni della traccia (preset, manopole). */
  update: (track: Track) => void
  dispose: () => void
}
