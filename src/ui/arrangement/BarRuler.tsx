import { stepsPerBar } from '../../music/timing'
import { usePlaybackStore } from '../../state/playbackStore'
import { useProjectStore } from '../../state/projectStore'
import { useUiStore } from '../../state/uiStore'
import { BAR_WIDTH } from './layout'

/** Numeri delle battute e indicatore di riproduzione (in modalità "Brano"). */
export function BarRuler({ bars }: { bars: number }) {
  const step = usePlaybackStore((s) => s.currentStep)
  const ts = useProjectStore((s) => s.project.timeSignature)
  const playMode = useUiStore((s) => s.playMode)
  const showHead = step !== null && playMode === 'song'
  const headX = showHead ? (step / stepsPerBar(ts)) * BAR_WIDTH : 0

  return (
    <div className="ruler" style={{ width: bars * BAR_WIDTH }}>
      {Array.from({ length: bars }, (_, i) => (
        <span key={i} className="ruler__bar" style={{ width: BAR_WIDTH }}>
          {i + 1}
        </span>
      ))}
      {showHead && <div className="playhead" style={{ transform: `translateX(${headX}px)` }} />}
    </div>
  )
}
