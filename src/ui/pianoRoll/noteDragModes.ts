import { notesInRect } from '../../project/ops/noteGroup'
import type { Note, NotePatternData } from '../../project/types'
import { dragNotes, selectedNotes, setNoteSelection } from '../../state/actions/noteSelectionActions'
import { dragNotesInScale, lockedScale } from '../../state/actions/scaleLockActions'
import { useUiStore } from '../../state/uiStore'
import { cellAt, PIANO_RANGE, RESIZE_HANDLE } from './geometry'

export type Cell = { step: number; pitch: number }
export type Point = { x: number; y: number }

/** Cosa sta facendo il trascinamento in corso sulla griglia. */
export type Drag =
  | { mode: 'create'; key: string; noteId: string; start: number }
  | { mode: 'move'; key: string; anchor: Cell; originals: Note[]; grabbedId: string; lastPitch: number }
  | { mode: 'resize'; key: string; anchor: Cell; originals: Note[] }
  | { mode: 'box'; anchor: Point; base: string[] }

/** Rettangolo di selezione da disegnare, in pixel. */
export interface BoxRect {
  left: number
  top: number
  width: number
  height: number
}

/**
 * Clic su una nota: se non era selezionata diventa l'unica selezionata, altrimenti si trascina tutto
 * il gruppo. Vicino al bordo destro si allunga, altrove si sposta.
 */
export function startOnNote(patternId: string, note: Note, nearRightEdge: boolean, cell: Cell, key: string): Drag {
  const isSelected = useUiStore.getState().selectedNoteIds.includes(note.id)
  if (!isSelected) setNoteSelection([note.id])
  const originals = isSelected ? selectedNotes(patternId) : [note]
  if (nearRightEdge) return { mode: 'resize', key, anchor: cell, originals }
  return { mode: 'move', key, anchor: cell, originals, grabbedId: note.id, lastPitch: note.pitch }
}

/** Sposta il gruppo trascinato; con "Blocca sulla scala" in verticale va di nota della scala in nota della scala. */
export function moveGroup(patternId: string, d: Extract<Drag, { mode: 'move' }>, cell: Cell): void {
  const dStep = cell.step - d.anchor.step
  const dPitch = cell.pitch - d.anchor.pitch
  const grabbed = d.originals.find((n) => n.id === d.grabbedId)
  if (grabbed && lockedScale()) return dragNotesInScale(patternId, d.originals, grabbed.pitch, dStep, dPitch, PIANO_RANGE, d.key)
  dragNotes(patternId, d.originals, dStep, dPitch, PIANO_RANGE, d.key)
}

export function isNearRightEdge(noteEl: HTMLElement, clientX: number): boolean {
  return noteEl.getBoundingClientRect().right - clientX <= RESIZE_HANDLE
}

/** Shift/Ctrl + clic su una nota: la aggiunge o la toglie dalla selezione. */
export function toggleInSelection(noteId: string): void {
  const ids = useUiStore.getState().selectedNoteIds
  setNoteSelection(ids.includes(noteId) ? ids.filter((id) => id !== noteId) : [...ids, noteId])
}

export function boxRect(a: Point, b: Point): BoxRect {
  return { left: Math.min(a.x, b.x), top: Math.min(a.y, b.y), width: Math.abs(b.x - a.x), height: Math.abs(b.y - a.y) }
}

/** Seleziona le note che toccano il rettangolo (più quelle già selezionate, se si teneva Shift). */
export function selectInBox(pattern: NotePatternData, d: Extract<Drag, { mode: 'box' }>, point: Point, totalSteps: number): void {
  const a = cellAt(d.anchor.x, d.anchor.y, totalSteps)
  const b = cellAt(point.x, point.y, totalSteps)
  const rect = {
    fromStep: Math.min(a.step, b.step),
    toStep: Math.max(a.step, b.step),
    lowPitch: Math.min(a.pitch, b.pitch),
    highPitch: Math.max(a.pitch, b.pitch),
  }
  setNoteSelection([...new Set([...d.base, ...notesInRect(pattern.notes, rect)])])
}
