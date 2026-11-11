import { stepsPerBar } from '../../music/timing'
import { usePlaybackStore } from '../../state/playbackStore'
import { useProjectStore } from '../../state/projectStore'
import { useUiStore } from '../../state/uiStore'
import { BAR_WIDTH } from './layout'
import { useRulerSeek } from './useRulerSeek'

/** Numeri delle battute, fine del brano e indicatore di riproduzione (in modalità "Brano"). */
export function BarRuler({ bars, songBars }: { bars: number; songBars: number }) {
  const step = usePlaybackStore((s) => s.currentStep)
  const ts = useProjectStore((s) => s.project.timeSignature)
  const playMode = useUiStore((s) => s.playMode)
  const startStep = usePlaybackStore((s) => s.startStep)
  const seekHandlers = useRulerSeek(songBars)
  const toX = (s: number) => (s / stepsPerBar(ts)) * BAR_WIDTH
  const showHead = step !== null && playMode === 'song'
  // Da ferma: dove partirà il Play (se non è l'inizio del brano).
  const showStart = step === null && playMode === 'song' && startStep > 0 && startStep < songBars * stepsPerBar(ts)

  return (
    <div
      className="ruler"
      style={{ width: bars * BAR_WIDTH }}
      title="Clicca o trascina qui per scegliere da dove ascoltare il brano"
      {...seekHandlers}
    >
      {Array.from({ length: bars }, (_, i) => (
        <span key={i} className="ruler__bar" style={{ width: BAR_WIDTH }}>
          {i + 1}
        </span>
      ))}
      {songBars > 0 && (
        <span className="ruler__end" style={{ left: songBars * BAR_WIDTH }} title={`Il brano finisce qui: ${songBars} battute`}>
          Fine
        </span>
      )}
      {showHead && <div className="playhead" style={{ transform: `translateX(${toX(step)}px)` }} />}
      {showStart && <div className="playhead playhead--start" style={{ transform: `translateX(${toX(startStep)}px)` }} />}
    </div>
  )
}
