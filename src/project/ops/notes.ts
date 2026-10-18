import { LIMITS } from '../limits'
import { newId } from '../ids'
import type { Note, NotePatternData, Project } from '../types'
import { clampNumber, mapPattern, sameItems } from './helpers'
import { patternSteps } from './patternLength'

export type NoteInput = Omit<Note, 'id'>

/** Tiene la nota dentro il pattern e dentro la tastiera (0-127). */
export function clampNote(note: Note, totalSteps: number): Note {
  const start = Math.round(clampNumber(note.start, 0, totalSteps - 1))
  return {
    ...note,
    pitch: Math.round(clampNumber(note.pitch, 0, 127)),
    start,
    duration: Math.round(clampNumber(note.duration, 1, totalSteps - start)),
    velocity: clampNumber(note.velocity, 0, 1),
  }
}

function mapNotes(project: Project, patternId: string, fn: (p: NotePatternData) => Note[]): Project {
  return mapPattern(project, patternId, (p) => {
    if (p.kind !== 'notes') return p
    const notes = fn(p)
    return sameItems(notes, p.notes) ? p : { ...p, notes }
  })
}

function sameNote(a: Note, b: Note): boolean {
  return a.pitch === b.pitch && a.start === b.start && a.duration === b.duration && a.velocity === b.velocity
}

export function addNote(project: Project, patternId: string, input: NoteInput): { project: Project; noteId: string } {
  const noteId = newId()
  const next = mapNotes(project, patternId, (p) => {
    if (p.notes.length >= LIMITS.notesPerPattern) return p.notes
    const steps = patternSteps(p, project.timeSignature)
    return [...p.notes, clampNote({ ...input, id: noteId }, steps)]
  })
  return { project: next, noteId }
}

export function updateNote(project: Project, patternId: string, noteId: string, changes: Partial<NoteInput>): Project {
  return mapNotes(project, patternId, (p) => {
    const steps = patternSteps(p, project.timeSignature)
    return p.notes.map((n) => {
      if (n.id !== noteId) return n
      const updated = clampNote({ ...n, ...changes }, steps)
      return sameNote(updated, n) ? n : updated
    })
  })
}

export function removeNote(project: Project, patternId: string, noteId: string): Project {
  return mapNotes(project, patternId, (p) => p.notes.filter((n) => n.id !== noteId))
}

/** Nota che occupa quella cella (pitch, step), se c'è. */
export function noteAt(notes: Note[], pitch: number, step: number): Note | undefined {
  return notes.find((n) => n.pitch === pitch && step >= n.start && step < n.start + n.duration)
}
