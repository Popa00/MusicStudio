import type { Track } from '../../project/types'
import { placeClip } from '../../state/actions/clipActions'
import { useProjectStore } from '../../state/projectStore'
import { ClipBlock } from './ClipBlock'
import { BAR_WIDTH } from './layout'

/** Riga della traccia sulla linea del tempo: caselle vuote cliccabili e blocchi. */
export function TrackLane({ track, bars }: { track: Track; bars: number }) {
  const clips = useProjectStore((s) => s.project.clips)
  const patterns = useProjectStore((s) => s.project.patterns)

  return (
    <div className="lane" style={{ width: bars * BAR_WIDTH }}>
      {Array.from({ length: bars }, (_, bar) => (
        <button
          key={bar}
          className="lane__cell"
          style={{ left: bar * BAR_WIDTH, width: BAR_WIDTH }}
          onClick={() => placeClip(track.id, bar)}
          aria-label={`Inserisci pattern alla battuta ${bar + 1}`}
          tabIndex={-1}
        />
      ))}
      {clips
        .filter((c) => c.trackId === track.id)
        .map((clip) => {
          const pattern = patterns.find((p) => p.id === clip.patternId)
          return pattern ? <ClipBlock key={clip.id} clip={clip} pattern={pattern} /> : null
        })}
    </div>
  )
}
