import { useRef, useState, type PointerEvent } from 'react'
import { previewNote } from '../../audio/live'
import { DEFAULT_NOTE_VELOCITY } from '../../music/velocity'
import { findPattern } from '../../project/ops/helpers'
import type { Note, NotePatternData } from '../../project/types'
import { changeNote, createNote, deleteNote } from '../../state/actions/noteActions'
import { dragNoteLengths, dragNotes, setNoteSelection } from '../../state/actions/noteSelectionActions'
import { useProjectStore } from '../../state/projectStore'
import { useUiStore } from '../../state/uiStore'
import { noteDrag } from './dragState'
import { cellAt, PIANO_RANGE } from './geometry'
import { boxRect, isNearRightEdge, selectInBox, startOnNote, toggleInSelection, type BoxRect, type Drag, type Point } from './noteDragModes'

function localPoint(e: PointerEvent<HTMLDivElement>): Point {
  const rect = e.currentTarget.getBoundingClientRect()
  return { x: e.clientX - rect.left, y: e.clientY - rect.top }
}

function noteNow(patternId: string, noteId: string): Note | undefined {
  const p = findPattern(useProjectStore.getState().project, patternId)
  return p?.kind === 'notes' ? p.notes.find((n) => n.id === noteId) : undefined
}

/**
 * Mouse sulla griglia: clic sul vuoto disegna una nota; clic su una nota la seleziona e trascinandola
 * si sposta (o si allunga dal bordo destro) insieme alle altre selezionate. Shift/Ctrl + clic aggiunge
 * o toglie una nota dalla selezione; Shift/Ctrl + trascinamento sul vuoto seleziona con un rettangolo.
 */
export function useNoteEditing(trackId: string, pattern: NotePatternData, totalSteps: number) {
  const drag = useRef<Drag | null>(null)
  const [box, setBox] = useState<BoxRect | null>(null)

  function begin(d: Drag) {
    drag.current = d
    noteDrag.active = true
  }

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    const point = localPoint(e)
    const cell = cellAt(point.x, point.y, totalSteps)
    const noteEl = (e.target as HTMLElement).closest<HTMLElement>('[data-note-id]')
    const note = pattern.notes.find((n) => n.id === noteEl?.dataset.noteId)
    const additive = e.shiftKey || e.ctrlKey || e.metaKey
    if (e.button === 2) {
      if (!note) return
      deleteNote(pattern.id, note.id)
      setNoteSelection(useUiStore.getState().selectedNoteIds.filter((id) => id !== note.id))
      return
    }
    if (e.button !== 0) return
    if (note && additive) return toggleInSelection(note.id)
    e.currentTarget.setPointerCapture(e.pointerId)
    const key = `gesture:note:${crypto.randomUUID()}`
    if (note && noteEl) {
      const d = startOnNote(pattern.id, note, isNearRightEdge(noteEl, e.clientX), cell, key)
      if (d.mode === 'move') previewNote(trackId, note.pitch)
      return begin(d)
    }
    if (additive) return begin({ mode: 'box', anchor: point, base: e.shiftKey ? useUiStore.getState().selectedNoteIds : [] })
    const duration = Math.min(useUiStore.getState().noteLength, totalSteps - cell.step)
    const noteId = createNote(pattern.id, { pitch: cell.pitch, start: cell.step, duration, velocity: DEFAULT_NOTE_VELOCITY }, key)
    setNoteSelection([noteId])
    previewNote(trackId, cell.pitch)
    begin({ mode: 'create', key, noteId, start: cell.step })
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    const d = drag.current
    if (!d) return
    const point = localPoint(e)
    if (d.mode === 'box') {
      setBox(boxRect(d.anchor, point))
      return selectInBox(pattern, d, point, totalSteps)
    }
    const cell = cellAt(point.x, point.y, totalSteps)
    if (d.mode === 'create') return changeNote(pattern.id, d.noteId, { duration: Math.max(1, cell.step - d.start + 1) }, d.key)
    if (d.mode === 'resize') return dragNoteLengths(pattern.id, d.originals, cell.step - d.anchor.step, d.key)
    dragNotes(pattern.id, d.originals, cell.step - d.anchor.step, cell.pitch - d.anchor.pitch, PIANO_RANGE, d.key)
    const pitch = noteNow(pattern.id, d.grabbedId)?.pitch
    if (pitch !== undefined && pitch !== d.lastPitch) {
      d.lastPitch = pitch
      previewNote(trackId, pitch, 0.15)
    }
  }

  function onPointerUp() {
    const d = drag.current
    drag.current = null
    noteDrag.active = false
    setBox(null)
    // La prossima nota disegnata avrà la stessa lunghezza dell'ultima disegnata o allungata.
    const noteId = d?.mode === 'create' ? d.noteId : d?.mode === 'resize' && d.originals.length === 1 ? d.originals[0].id : null
    const duration = noteId ? noteNow(pattern.id, noteId)?.duration : undefined
    if (duration) useUiStore.getState().set({ noteLength: duration })
  }

  return { handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp }, box }
}
