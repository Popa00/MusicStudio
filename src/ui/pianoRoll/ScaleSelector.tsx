import { pitchClassName } from '../../music/notes'
import { SCALE_LABELS, SCALE_TYPES, type ScaleType } from '../../music/scales'
import { changeScale } from '../../state/actions/projectActions'
import { fitPatternToScale } from '../../state/actions/scaleLockActions'
import { useProjectStore } from '../../state/projectStore'
import { useUiStore } from '../../state/uiStore'
import { noFocus } from '../keepFocusOnMouseDown'

/**
 * Scala del brano: le note che "stanno bene insieme" vengono evidenziate nel piano roll.
 * "Blocca sulla scala" impedisce di usare le altre; "Adatta alla scala" corregge quelle già scritte.
 */
export function ScaleSelector({ patternId }: { patternId: string }) {
  const scale = useProjectStore((s) => s.project.scale)
  const scaleLock = useUiStore((s) => s.scaleLock)
  const noScale = scale.type === 'none'

  return (
    <div className="scale-selector" title="Le righe chiare sono le note della scala: usando quelle è difficile stonare">
      <label>
        Tonalità{' '}
        <select value={scale.root} onChange={(e) => changeScale(Number(e.target.value), scale.type)}>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i}>
              {pitchClassName(i)}
            </option>
          ))}
        </select>
      </label>
      <label>
        Scala{' '}
        <select value={scale.type} onChange={(e) => changeScale(scale.root, e.target.value as ScaleType)}>
          {SCALE_TYPES.map((t) => (
            <option key={t} value={t}>
              {SCALE_LABELS[t]}
            </option>
          ))}
        </select>
      </label>
      <label
        className="scale-selector__lock"
        title={noScale ? 'Scegli prima una scala' : 'Le note disegnate, spostate o suonate restano sempre sulle note della scala'}
      >
        <input type="checkbox" checked={scaleLock} disabled={noScale} onChange={(e) => useUiStore.getState().set({ scaleLock: e.target.checked })} />{' '}
        Blocca sulla scala
      </label>
      <button
        className="button-small button-secondary"
        disabled={noScale}
        onClick={() => fitPatternToScale(patternId)}
        title="Sposta sulla nota della scala più vicina le note selezionate (o tutte, se nessuna è selezionata)"
        {...noFocus}
      >
        Adatta alla scala
      </button>
    </div>
  )
}
