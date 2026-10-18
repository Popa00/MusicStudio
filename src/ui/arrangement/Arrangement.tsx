import { songLengthBars } from '../../project/ops/clips'
import { LIMITS } from '../../project/limits'
import { useProjectStore } from '../../state/projectStore'
import { ArrangementToolbar } from './ArrangementToolbar'
import { BarRuler } from './BarRuler'
import { visibleBars } from './layout'
import { TrackHeader } from './TrackHeader'
import { TrackLane } from './TrackLane'
import './arrangement.css'

/** Linea del tempo: una riga per traccia, i blocchi dicono quale pattern suona in quale battuta. */
export function Arrangement() {
  const project = useProjectStore((s) => s.project)
  const bars = visibleBars(songLengthBars(project), LIMITS.songBars)

  return (
    <section className="arrangement">
      <ArrangementToolbar />
      <div className="arrangement__scroll">
        <div className="arrangement__grid">
          <div className="arrangement__corner" />
          <BarRuler bars={bars} />
          {project.tracks.map((track) => (
            <div className="arrangement__row" key={track.id}>
              <TrackHeader track={track} />
              <TrackLane track={track} bars={bars} />
            </div>
          ))}
        </div>
      </div>
      {project.tracks.length === 0 && <p className="hint">Nessuna traccia: aggiungine una con i pulsanti qui sopra.</p>}
    </section>
  )
}
