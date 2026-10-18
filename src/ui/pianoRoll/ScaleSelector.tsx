import { pitchClassName } from '../../music/notes'
import { SCALE_LABELS, SCALE_TYPES, type ScaleType } from '../../music/scales'
import { changeScale } from '../../state/actions/projectActions'
import { useProjectStore } from '../../state/projectStore'

/** Scala del brano: le note che "stanno bene insieme" vengono evidenziate nel piano roll. */
export function ScaleSelector() {
  const scale = useProjectStore((s) => s.project.scale)

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
    </div>
  )
}
