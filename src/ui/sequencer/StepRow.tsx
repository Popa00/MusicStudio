import type { DrumVoiceId } from '../../music/drumPattern'
import { toggleStep } from '../../state/actions/patternActions'
import { noFocus } from '../keepFocusOnMouseDown'
import { VOICE_LABELS } from './voiceLabels'

interface StepRowProps {
  patternId: string
  voice: DrumVoiceId
  steps: boolean[]
  stepsPerBeat: number
  playingStep: number | null
}

export function StepRow({ patternId, voice, steps, stepsPerBeat, playingStep }: StepRowProps) {
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
          if (i === playingStep) classes.push('step--current')
          if (Math.floor(i / stepsPerBeat) % 2 === 1) classes.push('step--alt-beat')
          return (
            <button
              key={i}
              className={classes.join(' ')}
              onClick={() => toggleStep(patternId, voice, i)}
              aria-pressed={on}
              aria-label={`${name}, step ${i + 1}`}
              {...noFocus}
            />
          )
        })}
      </div>
    </div>
  )
}
