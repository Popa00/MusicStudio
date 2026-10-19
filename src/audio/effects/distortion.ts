import * as Tone from 'tone'
import type { EffectNode, SettingsOf } from './types'

export function createDistortion(settings: SettingsOf<'distortion'>): EffectNode {
  const distortion = new Tone.Distortion({ distortion: settings.amount, wet: settings.wet, oversample: '2x' })

  return {
    input: distortion,
    output: distortion,
    ready: Promise.resolve(),
    update: (s) => {
      if (s.type !== 'distortion') return
      distortion.distortion = s.amount
      distortion.wet.rampTo(s.wet, 0.05)
    },
    dispose: () => distortion.dispose(),
  }
}
