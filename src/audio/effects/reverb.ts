import * as Tone from 'tone'
import type { EffectNode, SettingsOf } from './types'

export function createReverb(settings: SettingsOf<'reverb'>): EffectNode {
  const reverb = new Tone.Reverb({ decay: settings.decay, wet: settings.wet })
  let decay = settings.decay

  return {
    node: reverb,
    ready: reverb.ready,
    update: (s) => {
      if (s.type !== 'reverb') return
      reverb.wet.rampTo(s.wet, 0.05)
      // Cambiare la durata ricalcola il riverbero: solo se è cambiata davvero.
      if (s.decay !== decay) {
        decay = s.decay
        reverb.decay = s.decay
      }
    },
    dispose: () => reverb.dispose(),
  }
}
