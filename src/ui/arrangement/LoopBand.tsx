import type { PointerEvent } from 'react'
import { LIMITS } from '../../project/limits'
import { setLoop } from '../../state/actions/loopActions'
import { usePlaybackStore } from '../../state/playbackStore'
import { useUiStore } from '../../state/uiStore'
import { BAR_WIDTH } from './layout'

type Edge = 'start' | 'end'

/** Battuta più vicina al punto del mouse, contata dall'inizio della riga delle battute. */
function barAt(event: PointerEvent<HTMLElement>): number {
  const ruler = event.currentTarget.closest('.ruler')
  const left = ruler ? ruler.getBoundingClientRect().left : 0
  return Math.round((event.clientX - left) / BAR_WIDTH)
}

function moveEdge(edge: Edge, bar: number): void {
  const range = usePlaybackStore.getState().loopRange
  if (!range) return
  const next =
    edge === 'start'
      ? { start: Math.min(Math.max(0, bar), range.end - 1), end: range.end }
      : { start: range.start, end: Math.max(Math.min(LIMITS.songBars, bar), range.start + 1) }
  if (next.start !== range.start || next.end !== range.end) setLoop(next)
}

function Handle({ edge }: { edge: Edge }) {
  return (
    <span
      className={`loop-band__handle loop-band__handle--${edge}`}
      title={edge === 'start' ? "Trascina per cambiare l'inizio della parte ripetuta" : 'Trascina per cambiare la fine della parte ripetuta'}
      onPointerDown={(event) => {
        if (event.button !== 0) return
        // Non è un clic per scegliere da dove ascoltare.
        event.stopPropagation()
        event.currentTarget.setPointerCapture(event.pointerId)
      }}
      onPointerMove={(event) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) moveEdge(edge, barAt(event))
      }}
    />
  )
}

/** La parte del brano che si ripete ("Ripeti parte"), sulla riga delle battute. I bordi si trascinano. */
export function LoopBand() {
  const loopOn = usePlaybackStore((s) => s.loopOn)
  const range = usePlaybackStore((s) => s.loopRange)
  const playMode = useUiStore((s) => s.playMode)
  if (!loopOn || !range || playMode !== 'song') return null

  return (
    <div className="loop-band" style={{ left: range.start * BAR_WIDTH, width: (range.end - range.start) * BAR_WIDTH }}>
      <Handle edge="start" />
      <Handle edge="end" />
    </div>
  )
}
