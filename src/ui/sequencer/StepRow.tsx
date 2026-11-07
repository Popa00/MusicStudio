import type { CSSProperties } from 'react'
import type { DrumVoiceId } from '../../music/drumPattern'
import { formatVelocity } from '../../music/velocity'
import { previewDrum } from '../../audio/live'
import { hideDrumRow, moveDrumRowToOwnTrack } from '../../state/actions/drumRowActions'
import { toggleStep } from '../../state/actions/patternActions'
import { askConfirm, showAlert } from '../../state/browserDialogs'
import { noFocus } from '../keepFocusOnMouseDown'
import { VOICE_LABELS } from './voiceLabels'

interface StepRowProps {
  trackId: string
  patternId: string
  voice: DrumVoiceId
  /** 0 = spenta, altrimenti l'intensità del colpo. */
  steps: number[]
  stepsPerBeat: number
  playingStep: number | null
  /** Chiamata quando si clicca una casella di questa riga (la striscia delle intensità la segue). */
  onEdit: (voice: DrumVoiceId) => void
  /** Le percussioni aggiunte si possono nascondere (i 5 suoni di base no). */
  removable: boolean
}

/** I colpi leggeri hanno un colore più tenue: si vedono subito gli accenti. */
function strengthStyle(velocity: number): CSSProperties {
  return { ['--strength' as string]: `${Math.round(30 + 70 * velocity)}%` }
}

export function StepRow({ trackId, patternId, voice, steps, stepsPerBeat, playingStep, onEdit, removable }: StepRowProps) {
  const { name, hint } = VOICE_LABELS[voice]

  function remove() {
    const hasHits = steps.some((v) => v > 0)
    if (!hasHits || askConfirm(`Togliere "${name}" dalla griglia? I suoi colpi in questo pattern verranno spenti.`)) {
      hideDrumRow(trackId, patternId, voice)
    }
  }

  function separate() {
    if (!moveDrumRowToOwnTrack(trackId, patternId, voice, name)) {
      showAlert('Il progetto è pieno: elimina una traccia o qualche pattern prima di separare questo suono.')
    }
  }

  return (
    <div className="sequencer__row">
      <span className="sequencer__label">
        <button className="sequencer__name" title={`${hint} (clic per ascoltarlo)`} onClick={() => previewDrum(trackId, voice)} {...noFocus}>
          {name}
        </button>
        <button
          className="sequencer__remove button-small button-secondary"
          onClick={separate}
          aria-label={`Sposta ${name} su una traccia sua`}
          title="Sposta questo suono su una traccia tutta sua: potrai dargli effetti (es. riverbero), volume e intonazione solo suoi"
          {...noFocus}
        >
          ⇱
        </button>
        {removable && (
          <button className="sequencer__remove button-small button-secondary" onClick={remove} aria-label={`Togli ${name}`} title="Togli dalla griglia" {...noFocus}>
            ×
          </button>
        )}
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
