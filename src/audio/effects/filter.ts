import * as Tone from 'tone'
import type { EffectNode, SettingsOf } from './types'

export function createFilter(settings: SettingsOf<'filter'>): EffectNode {
  const filter = new Tone.Filter({ type: settings.mode, frequency: settings.frequency, Q: settings.resonance })

  return {
    node: filter,
    ready: Promise.resolve(),
    update: (s) => {
      if (s.type !== 'filter') return
      filter.type = s.mode
      filter.frequency.rampTo(s.frequency, 0.05)
      filter.Q.rampTo(s.resonance, 0.05)
    },
    dispose: () => filter.dispose(),
  }
}
