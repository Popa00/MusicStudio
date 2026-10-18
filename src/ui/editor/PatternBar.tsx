import { patternsOfTrack } from '../../project/ops/helpers'
import type { Pattern, Track } from '../../project/types'
import { copyPattern, deletePattern, emptyPattern, newPattern, selectPattern, setPatternBars, setPatternName } from '../../state/actions/patternActions'
import { useProjectStore } from '../../state/projectStore'
import { noFocus } from '../keepFocusOnMouseDown'

const LENGTHS = [1, 2, 4, 8]

/** Scelta del pattern da modificare: un pattern è un pezzo riutilizzabile (es. "strofa", "ritornello"). */
export function PatternBar({ track, pattern }: { track: Track; pattern: Pattern }) {
  const project = useProjectStore((s) => s.project)
  const patterns = patternsOfTrack(project, track.id)

  function confirmThen(message: string, action: () => void) {
    if (window.confirm(message)) action()
  }

  return (
    <div className="pattern-bar">
      <label title="Un pattern è un pezzo di musica riutilizzabile: lo metti più volte sulla linea del tempo">
        Pattern{' '}
        <select value={pattern.id} onChange={(e) => selectPattern(track.id, e.target.value)}>
          {patterns.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </label>
      <input type="text" value={pattern.name} aria-label="Nome del pattern" onChange={(e) => setPatternName(pattern.id, e.target.value)} />
      <label title="Lunghezza del pattern in battute">
        Lunghezza{' '}
        <select value={pattern.lengthBars} onChange={(e) => setPatternBars(pattern.id, Number(e.target.value))}>
          {LENGTHS.map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? 'battuta' : 'battute'}
            </option>
          ))}
        </select>
      </label>
      <button className="button-small" onClick={() => newPattern(track.id)} title="Nuovo pattern vuoto" {...noFocus}>
        Nuovo
      </button>
      <button className="button-small button-secondary" onClick={() => copyPattern(track.id, pattern.id)} title="Copia questo pattern per farne una variazione" {...noFocus}>
        Duplica
      </button>
      <button className="button-small button-secondary" onClick={() => confirmThen('Cancellare tutte le note di questo pattern?', () => emptyPattern(pattern.id))} {...noFocus}>
        Svuota
      </button>
      {patterns.length > 1 && (
        <button className="button-small button-secondary" onClick={() => confirmThen(`Eliminare il pattern "${pattern.name}" e i suoi blocchi dal brano?`, () => deletePattern(pattern.id))} {...noFocus}>
          Elimina
        </button>
      )}
    </div>
  )
}
