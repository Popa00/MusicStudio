import * as Tone from 'tone'
import type { EffectNode, SettingsOf } from './types'

export function createEq(settings: SettingsOf<'eq'>): EffectNode {
  const eq = new Tone.EQ3({ low: settings.low, mid: settings.mid, high: settings.high })

  return {
    input: eq,
    output: eq,
    ready: Promise.resolve(),
    update: (s) => {
      if (s.type !== 'eq') return
      eq.low.rampTo(s.low, 0.05)
      eq.mid.rampTo(s.mid, 0.05)
      eq.high.rampTo(s.high, 0.05)
    },
    dispose: () => eq.dispose(),
  }
}
