import { degreesBetween, snapToScale, type ScaleRef } from '../../music/scaleLock'
import { findPattern } from '../../project/ops/helpers'
import type { PitchRange } from '../../project/ops/noteGroup'
import { fitNotesToScale, moveNotesInScale, removeDuplicateNotes } from '../../project/ops/scaleNotes'
import type { Note } from '../../project/types'
import { useProjectStore } from '../projectStore'
import { useUiStore } from '../uiStore'
import { selectedNotes } from './noteSelectionActions'

const store = () => useProjectStore.getState()

/** La scala a cui agganciare le note, oppure null se il blocco è spento o la scala è "nessuna". */
export function lockedScale(): ScaleRef | null {
  const { scale } = store().project
  return useUiStore.getState().scaleLock && scale.type !== 'none' ? scale : null
}

/** Altezza da usare per una nota nuova o suonata: con il blocco attivo, la nota della scala più vicina. */
export function lockPitch(pitch: number): number {
  const scale = lockedScale()
  return scale ? snapToScale(pitch, scale) : pitch
}

/**
 * Trascinamento con il blocco attivo: la nota presa segue il mouse sulla nota della scala più vicina
 * e le altre si spostano dello stesso numero di gradi della scala.
 */
export function dragNotesInScale(
  patternId: string,
  originals: Note[],
  grabbedPitch: number,
  dStep: number,
  dPitch: number,
  range: PitchRange,
  dragId: string,
): void {
  const scale = lockedScale()
  if (!scale) return
  const degrees = degreesBetween(grabbedPitch, grabbedPitch + dPitch, scale)
  store().commit(moveNotesInScale(store().project, patternId, originals, dStep, degrees, scale, range), dragId)
}

/** Fine di un trascinamento: le note finite una sopra l'altra diventano una (stesso passo di Annulla). */
export function finishScaleDrag(patternId: string, noteIds: string[], dragId: string): void {
  if (!lockedScale()) return
  store().commit(removeDuplicateNotes(store().project, patternId, noteIds), dragId)
}

/** Frecce su/giù con il blocco attivo: una nota della scala alla volta. */
export function nudgeSelectedInScale(patternId: string, degrees: number, range: PitchRange): void {
  const scale = lockedScale()
  if (!scale) return
  const notes = selectedNotes(patternId)
  const moved = moveNotesInScale(store().project, patternId, notes, 0, degrees, scale, range)
  store().commit(removeDuplicateNotes(moved, patternId, notes.map((n) => n.id)), `nudge:${patternId}`)
}

/** "Adatta alla scala": le note selezionate, oppure tutte quelle del pattern se non ce n'è nessuna. */
export function fitPatternToScale(patternId: string): void {
  const { scale } = store().project
  const pattern = findPattern(store().project, patternId)
  if (scale.type === 'none' || pattern?.kind !== 'notes') return
  const selected = selectedNotes(patternId)
  const ids = (selected.length > 0 ? selected : pattern.notes).map((n) => n.id)
  store().commit(fitNotesToScale(store().project, patternId, ids, scale))
}
