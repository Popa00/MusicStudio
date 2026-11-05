import { BPM_MAX, BPM_MIN } from '../../music/timing'
import { changeBpm } from '../../state/actions/projectActions'
import { useProjectStore } from '../../state/projectStore'
import { EditableValue } from '../controls/EditableValue'
import { BPM } from '../controls/valueUnits'

/** BPM = battiti al minuto: più è alto, più il brano è veloce. */
export function BpmControl() {
  const bpm = useProjectStore((s) => s.project.bpm)

  return (
    <label className="transport__bpm" title="Velocità del brano in battiti al minuto">
      <span>Velocità</span>
      <input type="range" min={BPM_MIN} max={BPM_MAX} value={bpm} onChange={(e) => changeBpm(Number(e.target.value))} />
      <EditableValue className="transport__bpm-value" value={bpm} min={BPM_MIN} max={BPM_MAX} unit={BPM} label="Velocità" onChange={changeBpm} />
    </label>
  )
}
