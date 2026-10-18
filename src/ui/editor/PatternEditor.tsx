import type { Pattern, Track } from '../../project/types'
import { newPattern } from '../../state/actions/patternActions'
import { PianoRoll } from '../pianoRoll/PianoRoll'
import { StepSequencer } from '../sequencer/StepSequencer'
import { SynthPanel } from '../synth/SynthPanel'
import { PatternBar } from './PatternBar'

/** Editor del pattern selezionato: griglia della batteria oppure piano roll + suono dello strumento. */
export function PatternEditor({ track, pattern }: { track: Track; pattern: Pattern | null }) {
  if (!pattern) {
    return (
      <div className="hint">
        Questa traccia non ha pattern. <button onClick={() => newPattern(track.id)}>Crea un pattern</button>
      </div>
    )
  }

  return (
    <div className="pattern-editor">
      <PatternBar track={track} pattern={pattern} />
      {pattern.kind === 'drums' && <StepSequencer pattern={pattern} />}
      {pattern.kind === 'notes' && track.kind === 'synth' && (
        <div className="pattern-editor__synth">
          <SynthPanel track={track} />
          <PianoRoll trackId={track.id} pattern={pattern} />
        </div>
      )}
    </div>
  )
}
