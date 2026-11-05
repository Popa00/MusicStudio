import { beforeEach, describe, expect, it } from 'vitest'
import { createEmptyProject } from '../../project/factory'
import { findPattern, mapPattern, patternsOfTrack } from '../../project/ops/helpers'
import { addTrack } from '../../project/ops/tracks'
import type { Note } from '../../project/types'
import { emptyHistory } from '../history'
import { useProjectStore } from '../projectStore'
import { useUiStore } from '../uiStore'
import {
  copySelectedNotes,
  cutSelectedNotes,
  duplicateSelectedNotes,
  pasteNotes,
  setNoteSelection,
} from './noteSelectionActions'

const projectInitial = useProjectStore.getState()
const uiInitial = useUiStore.getState()
const s = () => useProjectStore.getState()
const ui = () => useUiStore.getState()

const note = (id: string, o: Partial<Note> = {}): Note => ({ id, pitch: 60, start: 0, duration: 2, velocity: 0.8, ...o })

/** Due pattern di note nella stessa traccia: restituisce i loro id. */
function setup(notes: Note[]) {
  const t = addTrack(createEmptyProject(), 'synth')
  const first = patternsOfTrack(t.project, t.trackId ?? '')[0].id
  const project = mapPattern(t.project, first, (p) => (p.kind === 'notes' ? { ...p, notes } : p))
  const other = addTrack(project, 'synth')
  const second = patternsOfTrack(other.project, other.trackId ?? '')[0].id
  useProjectStore.setState({ ...projectInitial, project: other.project, history: emptyHistory() }, true)
  useUiStore.setState({ ...uiInitial }, true)
  return { first, second }
}

const notesOf = (id: string): Note[] => {
  const p = findPattern(s().project, id)
  return p?.kind === 'notes' ? p.notes : []
}
const starts = (id: string) => notesOf(id).map((n) => n.start)

beforeEach(() => useUiStore.setState({ ...uiInitial }, true))

describe('copia e taglia', () => {
  it('copy memorizza le note senza id e il punto subito dopo il blocco', () => {
    const { first } = setup([note('a', { start: 2, duration: 3 }), note('b', { start: 4, duration: 4 })])
    setNoteSelection(['a', 'b'])
    copySelectedNotes(first)
    const clip = ui().noteClipboard
    expect(clip?.pasteAt).toBe(8)
    expect(clip?.patternId).toBe(first)
    expect(clip?.notes).toHaveLength(2)
    expect(clip?.notes[0]).not.toHaveProperty('id')
    expect(notesOf(first)).toHaveLength(2)
  })
  it('copy senza selezione lascia gli appunti com\'erano', () => {
    const { first } = setup([note('a')])
    copySelectedNotes(first)
    expect(ui().noteClipboard).toBeNull()
  })
  it('cut copia e poi elimina le note, con un solo annulla', () => {
    const { first } = setup([note('a'), note('b', { start: 4 })])
    setNoteSelection(['a'])
    cutSelectedNotes(first)
    expect(notesOf(first).map((n) => n.id)).toEqual(['b'])
    expect(ui().noteClipboard?.notes).toHaveLength(1)
    expect(ui().selectedNoteIds).toEqual([])
    expect(s().history.past).toHaveLength(1)
  })
})

describe('pasteNotes', () => {
  it('senza appunti non fa nulla', () => {
    const { first } = setup([note('a')])
    pasteNotes(first)
    expect(notesOf(first)).toHaveLength(1)
    expect(s().history.past).toHaveLength(0)
  })
  it('incolla subito dopo l\'ultimo blocco e seleziona le note incollate', () => {
    const { first } = setup([note('a', { start: 0, duration: 2 }), note('b', { start: 2, duration: 2 })])
    setNoteSelection(['a', 'b'])
    copySelectedNotes(first)
    pasteNotes(first)
    expect(starts(first)).toEqual([0, 2, 4, 6])
    const pasted = notesOf(first).slice(2).map((n) => n.id)
    expect(ui().selectedNoteIds).toEqual(pasted)
    expect(pasted).not.toContain('a')
  })
  it('incollando più volte le copie si mettono in fila', () => {
    const { first } = setup([note('a', { start: 0, duration: 2 }), note('b', { start: 2, duration: 2 })])
    setNoteSelection(['a', 'b'])
    copySelectedNotes(first)
    pasteNotes(first)
    pasteNotes(first)
    pasteNotes(first)
    expect(starts(first)).toEqual([0, 2, 4, 6, 8, 10, 12, 14])
  })
  it('in un altro pattern la prima volta incolla alla posizione originale, poi in fila', () => {
    const { first, second } = setup([note('a', { start: 3, duration: 2 })])
    setNoteSelection(['a'])
    copySelectedNotes(first)
    pasteNotes(second)
    pasteNotes(second)
    expect(starts(second)).toEqual([3, 5])
    expect(ui().noteClipboard?.patternId).toBe(second)
  })
  it('non registra nulla se nessuna nota entra nel pattern', () => {
    const { first } = setup([note('a', { start: 14, duration: 2 })])
    setNoteSelection(['a'])
    copySelectedNotes(first)
    const project = s().project
    pasteNotes(first)
    expect(s().project).toBe(project)
    expect(s().history.past).toHaveLength(0)
    expect(ui().noteClipboard?.pasteAt).toBe(16)
  })
  it('incolla le note che entrano e scarta le altre', () => {
    const { first } = setup([note('a', { start: 10, duration: 2 }), note('b', { start: 12, duration: 2 })])
    setNoteSelection(['a', 'b'])
    copySelectedNotes(first)
    pasteNotes(first)
    expect(starts(first)).toEqual([10, 12, 14])
  })
})

describe('duplicateSelectedNotes', () => {
  it('copia e incolla subito dopo, selezionando le copie', () => {
    const { first } = setup([note('a', { start: 0, duration: 4 })])
    setNoteSelection(['a'])
    duplicateSelectedNotes(first)
    expect(starts(first)).toEqual([0, 4])
    expect(ui().selectedNoteIds).toEqual([notesOf(first)[1].id])
    duplicateSelectedNotes(first)
    expect(starts(first)).toEqual([0, 4, 8])
  })
  // Con nessuna nota selezionata Ctrl+D non deve incollare i vecchi appunti.
  it('senza selezione ma con appunti già pieni non incolla nulla', () => {
    const { first } = setup([note('a', { start: 0, duration: 2 }), note('b', { start: 8 })])
    setNoteSelection(['a'])
    copySelectedNotes(first)
    setNoteSelection([])
    duplicateSelectedNotes(first)
    expect(notesOf(first)).toHaveLength(2)
  })
  it('senza selezione né appunti non duplica nulla', () => {
    const { first } = setup([note('a')])
    duplicateSelectedNotes(first)
    expect(notesOf(first)).toHaveLength(1)
  })
})
