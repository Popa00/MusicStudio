import type * as Tone from 'tone'
import type { EffectSettings, EffectType } from '../../project/types'

export type SettingsOf<T extends EffectType> = Extract<EffectSettings, { type: T }>

/** Un effetto vivo nel motore audio. */
export interface EffectNode {
  readonly node: Tone.ToneAudioNode
  /** Applica nuovi parametri (stesso tipo di effetto). */
  update: (settings: EffectSettings) => void
  /** Si risolve quando l'effetto è pronto a suonare (il riverbero deve prima calcolarsi). */
  ready: Promise<void>
  dispose: () => void
}
