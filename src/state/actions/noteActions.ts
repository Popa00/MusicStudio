import { addNote, removeNote, updateNote, type NoteInput } from '../../project/ops/notes'
import { useProjectStore } from '../projectStore'

const store = () => useProjectStore.getState()

/** `dragId` permette di unire creazione e trascinamento successivo in un solo "annulla". */
export function createNote(patternId: string, note: NoteInput, dragId?: string): string {
  const result = addNote(store().project, patternId, note)
  store().commit(result.project, dragId)
  return result.noteId
}

/** `dragId` unisce in un solo "annulla" tutti i movimenti dello stesso trascinamento. */
export function changeNote(patternId: string, noteId: string, changes: Partial<NoteInput>, dragId?: string): void {
  store().commit(updateNote(store().project, patternId, noteId, changes), dragId)
}

/** Stessa intensità per più note (es. un accordo); `dragId` come sopra. */
export function changeNotesVelocity(patternId: string, noteIds: string[], velocity: number, dragId?: string): void {
  let next = store().project
  for (const id of noteIds) next = updateNote(next, patternId, id, { velocity })
  store().commit(next, dragId)
}

export function deleteNote(patternId: string, noteId: string): void {
  store().commit(removeNote(store().project, patternId, noteId))
}
