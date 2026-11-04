import type { CSSProperties } from 'react'
import type { DrumVoiceId } from '../../music/drumPattern'
import { formatVelocity } from '../../music/velocity'
import { toggleStep } from '../../state/actions/patternActions'
import { noFocus } from '../keepFocusOnMouseDown'
import { VOICE_LABELS } from './voiceLabels'

interface StepRowProps {
  patternId: string
  voice: DrumVoiceId
  /** 0 = spenta, altrimenti l'intensità del colpo. */
  steps: number[]
  stepsPerBeat: number
  playingStep: number | null
  /** Chiamata quando si clicca una casella di questa riga (la striscia delle intensità la segue). */
  onEdit: (voice: DrumVoiceId) => void
}

/** I colpi leggeri hanno un colore più tenue: si vedono subito gli accenti. */
function strengthStyle(velocity: number): CSSProperties {
  return { ['--strength' as string]: `${Math.round(30 + 70 * velocity)}%` }
}

export function StepRow({ patternId, voice, steps, stepsPerBeat, playingStep, onEdit }: StepRowProps) {
  const { name, hint } = VOICE_LABELS[voice]

  return (
    <div className="sequencer__row">
      <span className="sequencer__label" title={hint}>
        {name}
      </span>
      <div className="sequencer__steps">
        {steps.map((velocity, i) => {
          const on = velocity > 0
          const classes = ['step']
          if (on) classes.push('step--on')
          if (i === playingStep) classes.push('step--current')
          if (Math.floor(i / stepsPerBeat) % 2 === 1) classes.push('step--alt-beat')
          const strength = on ? `, intensità ${formatVelocity(velocity)}` : ''
          return (
            <button
              key={i}
              className={classes.join(' ')}
              style={on ? strengthStyle(velocity) : undefined}
              title={on ? `Intensità ${formatVelocity(velocity)}` : undefined}
              onClick={() => {
                toggleStep(patternId, voice, i)
                onEdit(voice)
              }}
              aria-pressed={on}
              aria-label={`${name}, step ${i + 1}${strength}`}
              {...noFocus}
            />
          )
        })}
      </div>
    </div>
  )
}
