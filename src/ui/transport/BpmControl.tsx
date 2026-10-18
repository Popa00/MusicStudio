import { BPM_MAX, BPM_MIN } from '../../music/timing'
import { useProjectStore } from '../../state/projectStore'

/** BPM = battiti al minuto: più è alto, più il brano è veloce. */
export function BpmControl() {
  const bpm = useProjectStore((s) => s.bpm)
  const setBpm = useProjectStore((s) => s.setBpm)

  return (
    <label className="transport__bpm" title="Velocità del brano in battiti al minuto">
      <span>Velocità</span>
      <input
        type="range"
        min={BPM_MIN}
        max={BPM_MAX}
        value={bpm}
        onChange={(e) => setBpm(Number(e.target.value))}
      />
      <output>{bpm} BPM</output>
    </label>
  )
}
