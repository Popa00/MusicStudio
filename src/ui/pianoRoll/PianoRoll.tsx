import { useEffect, useRef } from 'react'
import { findPattern } from '../../project/ops/helpers'
import type { NotePatternData } from '../../project/types'
import { useProjectStore } from '../../state/projectStore'
import { NoteGrid } from './NoteGrid'
import { NoteVelocityLane } from './NoteVelocityLane'
import { PianoKeys } from './PianoKeys'
import { ScaleSelector } from './ScaleSelector'
import { scrollTopFor } from './geometry'
import './pianoRoll.css'

/** Editor delle note: in verticale l'altezza (grave in basso, acuto in alto), in orizzontale il tempo. */
export function PianoRoll({ trackId, pattern }: { trackId: string; pattern: NotePatternData }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Quando si apre un pattern (non a ogni nota modificata), centra la vista sulle sue note o sul Do centrale.
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const opened = findPattern(useProjectStore.getState().project, pattern.id)
    const notes = opened?.kind === 'notes' ? opened.notes : []
    const center = notes.length ? notes.reduce((sum, n) => sum + n.pitch, 0) / notes.length : 64
    el.scrollTop = scrollTopFor(center, el.clientHeight)
  }, [pattern.id])

  return (
    <div className="piano-roll">
      <div className="piano-roll__header">
        <h3>Note</h3>
        <ScaleSelector patternId={pattern.id} />
      </div>
      <p className="hint">
        Clicca per aggiungere una nota (trascina per allungarla) · trascina una nota per spostarla · bordo destro per
        allungarla · clic destro per cancellarla · Shift + clic o Shift + trascina sul vuoto per selezionarne più insieme
        (poi trascina, frecce, Canc, Ctrl+C/V, Ctrl+D) · nella striscia in basso trascina le barrette per rendere una nota
        più forte o più leggera · suona con i tasti A-K (Z/X cambiano ottava) · con "Blocca sulla scala" le note restano
        sempre sulle note della scala (righe chiare).
      </p>
      <div className="piano-roll__scroll" ref={scrollRef}>
        <div className="piano-roll__body">
          <PianoKeys trackId={trackId} />
          <NoteGrid trackId={trackId} pattern={pattern} />
        </div>
        <NoteVelocityLane pattern={pattern} />
      </div>
    </div>
  )
}
