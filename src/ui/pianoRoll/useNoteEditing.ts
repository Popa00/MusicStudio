import { useRef, type PointerEvent } from 'react'
import { previewNote } from '../../audio/live'
import type { Note, NotePatternData } from '../../project/types'
import { changeNote, createNote, deleteNote } from '../../state/actions/noteActions'
import { useUiStore } from '../../state/uiStore'
import { cellAt, RESIZE_HANDLE } from './geometry'

interface Drag {
  mode: 'move' | 'resize'
  noteId: string
  key: string
  start: { step: number; pitch: number }
  original: Pick<Note, 'start' | 'pitch' | 'duration'>
  lastPitch: number
}

function localPoint(e: PointerEvent<HTMLDivElement>) {
  const rect = e.currentTarget.getBoundingClientRect()
  return { x: e.clientX - rect.left, y: e.clientY - rect.top }
}

/** Gestione del mouse sulla griglia: disegna, sposta, allunga e cancella note. */
export function useNoteEditing(trackId: string, pattern: NotePatternData, totalSteps: number) {
  const drag = useRef<Drag | null>(null)

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    const { x, y } = localPoint(e)
    const cell = cellAt(x, y, totalSteps)
    const noteEl = (e.target as HTMLElement).closest<HTMLElement>('[data-note-id]')
    const note = pattern.notes.find((n) => n.id === noteEl?.dataset.noteId)
    if (e.button === 2) {
      if (note) deleteNote(pattern.id, note.id)
      return
    }
    if (e.button !== 0) return
    e.currentTarget.setPointerCapture(e.pointerId)
    const key = `gesture:note:${crypto.randomUUID()}`
    if (note && noteEl) {
      const nearRightEdge = noteEl.getBoundingClientRect().right - e.clientX <= RESIZE_HANDLE
      drag.current = { mode: nearRightEdge ? 'resize' : 'move', noteId: note.id, key, start: cell, original: note, lastPitch: note.pitch }
      if (!nearRightEdge) previewNote(trackId, note.pitch)
      return
    }
    const duration = Math.min(useUiStore.getState().noteLength, totalSteps - cell.step)
    const input = { pitch: cell.pitch, start: cell.step, duration, velocity: 0.8 }
    const noteId = createNote(pattern.id, input, key)
    previewNote(trackId, cell.pitch)
    drag.current = { mode: 'resize', noteId, key, start: cell, original: input, lastPitch: cell.pitch }
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    const d = drag.current
    if (!d) return
    const { x, y } = localPoint(e)
    const cell = cellAt(x, y, totalSteps)
    if (d.mode === 'resize') {
      const duration = Math.max(1, cell.step - d.original.start + 1)
      changeNote(pattern.id, d.noteId, { duration }, d.key)
      return
    }
    const pitch = d.original.pitch + (cell.pitch - d.start.pitch)
    const start = d.original.start + (cell.step - d.start.step)
    changeNote(pattern.id, d.noteId, { pitch, start }, d.key)
    if (pitch !== d.lastPitch) {
      d.lastPitch = pitch
      previewNote(trackId, pitch, 0.15)
    }
  }

  function onPointerUp() {
    const d = drag.current
    drag.current = null
    if (d?.mode !== 'resize') return
    // La prossima nota disegnata avrà la stessa lunghezza dell'ultima.
    const duration = pattern.notes.find((n) => n.id === d.noteId)?.duration
    if (duration) useUiStore.getState().set({ noteLength: duration })
  }

  return { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp }
}
