import * as Tone from 'tone'
import type { EffectNode, SettingsOf } from './types'

/** Mai 1 o più: con feedback ≥ 1 l'eco crescerebbe all'infinito. */
const MAX_FEEDBACK = 0.85

export function createDelay(settings: SettingsOf<'delay'>): EffectNode {
  const delay = new Tone.FeedbackDelay({
    delayTime: settings.time,
    feedback: Math.min(settings.feedback, MAX_FEEDBACK),
    wet: settings.wet,
  })

  return {
    input: delay,
    output: delay,
    ready: Promise.resolve(),
    update: (s) => {
      if (s.type !== 'delay') return
      delay.delayTime.value = Tone.Time(s.time).toSeconds()
      delay.feedback.rampTo(Math.min(s.feedback, MAX_FEEDBACK), 0.05)
      delay.wet.rampTo(s.wet, 0.05)
    },
    dispose: () => delay.dispose(),
  }
}
