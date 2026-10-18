import { DRUM_VOICES } from '../../music/drumPattern'
import { stepsPerBeat } from '../../music/timing'
import { useProjectStore } from '../../state/projectStore'
import { keepFocusOnMouseDown } from '../keepFocusOnMouseDown'
import { StepRow } from './StepRow'
import './sequencer.css'

/** Griglia della batteria: ogni riga è un suono, ogni casella un sedicesimo di battuta. */
export function StepSequencer() {
  const pattern = useProjectStore((s) => s.drumPattern)
  const ts = useProjectStore((s) => s.timeSignature)
  const clear = useProjectStore((s) => s.clearDrumPattern)
  const perBeat = stepsPerBeat(ts)

  function handleClear() {
    if (window.confirm('Cancellare tutti i colpi della batteria?')) clear()
  }

  return (
    <section className="sequencer">
      <header className="sequencer__header">
        <h2>Batteria</h2>
        <button onClick={handleClear} onMouseDown={keepFocusOnMouseDown}>
          Svuota
        </button>
      </header>
      <p className="sequencer__help">
        Clicca le caselle per accendere un colpo. Ogni gruppo di {perBeat} caselle è un battito.
      </p>
      {DRUM_VOICES.map((voice) => (
        <StepRow key={voice} voice={voice} steps={pattern[voice]} stepsPerBeat={perBeat} />
      ))}
    </section>
  )
}
