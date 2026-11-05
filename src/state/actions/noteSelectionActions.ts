import { findPattern } from '../../project/ops/helpers'
import { insertNotes, moveNotes, removeNotes, resizeNotes, type PitchRange } from '../../project/ops/noteGroup'
import type { Note } from '../../project/types'
import { useProjectStore } from '../projectStore'
import { useUiStore } from '../uiStore'

const store = () => useProjectStore.getState()
const ui = () => useUiStore.getState()

/** Note selezionate che esistono ancora nel pattern (dopo un annulla alcune possono sparire). */
export function selectedNotes(patternId: string): Note[] {
  const pattern = findPattern(store().project, patternId)
  if (pattern?.kind !== 'notes') return []
  const ids = new Set(ui().selectedNoteIds)
  return pattern.notes.filter((n) => ids.has(n.id))
}

/** Selezionare note toglie la selezione del blocco nel brano: così Canc agisce su una cosa sola. */
export function setNoteSelection(noteIds: string[]): void {
  ui().set({ selectedNoteIds: noteIds, selectedClipId: null })
}

export function selectAllNotes(patternId: string): void {
  const pattern = findPattern(store().project, patternId)
  if (pattern?.kind === 'notes') setNoteSelection(pattern.notes.map((n) => n.id))
}

/** Trascinamento: posizioni sempre calcolate dagli originali, `dragId` = un solo "annulla". */
export function dragNotes(patternId: string, originals: Note[], dStep: number, dPitch: number, range: PitchRange, dragId: string): void {
  store().commit(moveNotes(store().project, patternId, originals, dStep, dPitch, range), dragId)
}

export function dragNoteLengths(patternId: string, originals: Note[], dDuration: number, dragId: string): void {
  store().commit(resizeNotes(store().project, patternId, originals, dDuration), dragId)
}

/** Frecce: sposta le note selezionate di qualche step o semitono. */
export function nudgeSelected(patternId: string, dStep: number, dPitch: number, range: PitchRange): void {
  // Tenendo premuta una freccia, le ripetizioni si uniscono in un solo "annulla".
  store().commit(moveNotes(store().project, patternId, selectedNotes(patternId), dStep, dPitch, range), `nudge:${patternId}`)
}

export function deleteSelectedNotes(patternId: string): void {
  const notes = selectedNotes(patternId)
  if (notes.length === 0) return
  store().commit(removeNotes(store().project, patternId, notes.map((n) => n.id)))
  ui().set({ selectedNoteIds: [] })
}

export function copySelectedNotes(patternId: string): void {
  const notes = selectedNotes(patternId)
  if (notes.length === 0) return
  const end = Math.max(...notes.map((n) => n.start + n.duration))
  const inputs = notes.map(({ pitch, start, duration, velocity }) => ({ pitch, start, duration, velocity }))
  ui().set({ noteClipboard: { notes: inputs, patternId, pasteAt: end } })
}

export function cutSelectedNotes(patternId: string): void {
  copySelectedNotes(patternId)
  deleteSelectedNotes(patternId)
}

/**
 * Incolla subito dopo l'ultimo blocco copiato o incollato (incollando più volte si mettono in fila).
 * In un altro pattern, la prima volta incolla nella stessa posizione di partenza.
 * Le note incollate restano selezionate, pronte da spostare.
 */
export function pasteNotes(patternId: string): void {
  const clip = ui().noteClipboard
  if (!clip || clip.notes.length === 0) return
  const first = Math.min(...clip.notes.map((n) => n.start))
  const span = Math.max(...clip.notes.map((n) => n.start + n.duration)) - first
  const at = clip.patternId === patternId ? clip.pasteAt : first
  const shifted = clip.notes.map((n) => ({ ...n, start: n.start - first + at }))
  const result = insertNotes(store().project, patternId, shifted)
  if (result.noteIds.length === 0) return
  store().commit(result.project)
  ui().set({ noteClipboard: { ...clip, patternId, pasteAt: at + span } })
  setNoteSelection(result.noteIds)
}

/** Ctrl+D: copia e incolla subito dopo. */
export function duplicateSelectedNotes(patternId: string): void {
  // Senza selezione non si incollano vecchi appunti.
  if (selectedNotes(patternId).length === 0) return
  copySelectedNotes(patternId)
  pasteNotes(patternId)
}
