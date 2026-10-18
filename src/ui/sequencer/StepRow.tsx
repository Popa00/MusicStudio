import type { DrumVoiceId } from '../../music/drumPattern'
import { usePlaybackStore } from '../../state/playbackStore'
import { useProjectStore } from '../../state/projectStore'
import { keepFocusOnMouseDown } from '../keepFocusOnMouseDown'
import { VOICE_LABELS } from './voiceLabels'

interface StepRowProps {
  voice: DrumVoiceId
  steps: boolean[]
  stepsPerBeat: number
}

export function StepRow({ voice, steps, stepsPerBeat }: StepRowProps) {
  const toggle = useProjectStore((s) => s.toggleDrumStep)
  const currentStep = usePlaybackStore((s) => s.currentStep)
  const { name, hint } = VOICE_LABELS[voice]

  return (
    <div className="sequencer__row">
      <span className="sequencer__label" title={hint}>
        {name}
      </span>
      <div className="sequencer__steps">
        {steps.map((on, i) => {
          const classes = ['step']
          if (on) classes.push('step--on')
          if (i === currentStep) classes.push('step--current')
          if (Math.floor(i / stepsPerBeat) % 2 === 1) classes.push('step--alt-beat')
          return (
            <button
              key={i}
              className={classes.join(' ')}
              onClick={() => toggle(voice, i)}
              onMouseDown={keepFocusOnMouseDown}
              aria-pressed={on}
              aria-label={`${name}, step ${i + 1}`}
            />
          )
        })}
      </div>
    </div>
  )
}
