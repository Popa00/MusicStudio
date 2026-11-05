import { masterLevelDb } from '../../audio/live'
import { changeMasterVolume } from '../../state/actions/projectActions'
import { useProjectStore } from '../../state/projectStore'
import { EditableValue } from '../controls/EditableValue'
import { DECIBELS } from '../controls/valueUnits'
import { MeterBar } from './MeterBar'

/** Volume generale: tutto passa da qui, poi dal limitatore che protegge da picchi eccessivi. */
export function MasterStrip() {
  const volumeDb = useProjectStore((s) => s.project.master.volumeDb)

  return (
    <div className="strip strip--master">
      <strong className="strip__name">Master</strong>
      <div className="strip__fader">
        <MeterBar getLevelDb={masterLevelDb} />
        <input
          type="range"
          className="strip__volume"
          min={-60}
          max={6}
          step={0.5}
          value={volumeDb}
          onChange={(e) => changeMasterVolume(Number(e.target.value))}
          onDoubleClick={() => changeMasterVolume(0)}
          aria-label="Volume master"
          title="Volume generale (doppio clic: torna a 0 dB)"
        />
      </div>
      <EditableValue className="strip__value" value={volumeDb} min={-60} max={6} unit={DECIBELS} label="Volume master" onChange={changeMasterVolume} />
    </div>
  )
}
