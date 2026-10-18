import { useRef } from 'react'
import type { Clip, Pattern } from '../../project/types'
import { deleteClip, moveClipTo, selectClip } from '../../state/actions/clipActions'
import { useUiStore } from '../../state/uiStore'
import { BAR_WIDTH, barsFromPixels } from './layout'

/** Un blocco sulla linea del tempo. Si trascina in orizzontale; clic destro per eliminarlo. */
export function ClipBlock({ clip, pattern }: { clip: Clip; pattern: Pattern }) {
  const selected = useUiStore((s) => s.selectedClipId === clip.id)
  const drag = useRef<{ x: number; startBar: number; id: string } | null>(null)

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.button !== 0) return
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { x: e.clientX, startBar: clip.startBar, id: crypto.randomUUID() }
    selectClip(clip.id)
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const d = drag.current
    if (!d) return
    const bar = d.startBar + barsFromPixels(e.clientX - d.x)
    if (bar !== clip.startBar) moveClipTo(clip.id, bar, `gesture:clip:${d.id}`)
  }

  return (
    <div
      className={`clip clip--${pattern.kind}${selected ? ' clip--selected' : ''}`}
      style={{ left: clip.startBar * BAR_WIDTH, width: pattern.lengthBars * BAR_WIDTH }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={() => (drag.current = null)}
      onContextMenu={(e) => {
        e.preventDefault()
        deleteClip(clip.id)
      }}
      title={`${pattern.name} — trascina per spostare, clic destro per eliminare`}
    >
      {pattern.name}
    </div>
  )
}
