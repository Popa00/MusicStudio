import { useRef } from 'react'
import { songLengthBars } from '../../project/ops/clips'
import { LIMITS } from '../../project/limits'
import { useProjectStore } from '../../state/projectStore'
import { ArrangementToolbar } from './ArrangementToolbar'
import { BarRuler } from './BarRuler'
import { visibleBars } from './layout'
import { TrackHeader } from './TrackHeader'
import { TrackLane } from './TrackLane'
import { useFollowPlayhead } from './useFollowPlayhead'
import './arrangement.css'

/** Linea del tempo: una riga per traccia, i blocchi dicono quale pattern suona in quale battuta. */
export function Arrangement() {
  const project = useProjectStore((s) => s.project)
  const songBars = songLengthBars(project)
  const bars = visibleBars(songBars, LIMITS.songBars)
  const scrollRef = useRef<HTMLDivElement>(null)
  useFollowPlayhead(scrollRef)

  return (
    <section className="arrangement">
      <ArrangementToolbar />
      <div className="arrangement__scroll" ref={scrollRef}>
        <div className="arrangement__grid">
          <div className="arrangement__corner" />
          <BarRuler bars={bars} songBars={songBars} />
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
