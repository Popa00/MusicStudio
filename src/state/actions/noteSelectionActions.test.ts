import { beforeEach, describe, expect, it } from 'vitest'
import { createEmptyProject } from '../../project/factory'
import { findPattern, mapPattern, patternsOfTrack } from '../../project/ops/helpers'
import { addTrack } from '../../project/ops/tracks'
import type { Note } from '../../project/types'
import { emptyHistory, GESTURE_PREFIX } from '../history'
import { useProjectStore } from '../projectStore'
import { useUiStore } from '../uiStore'
import {
  deleteSelectedNotes,
  dragNoteLengths,
  dragNotes,
  nudgeSelected,
  selectAllNotes,
  selectedNotes,
  setNoteSelection,
} from './noteSelectionActions'

const projectInitial = useProjectStore.getState()
const uiInitial = useUiStore.getState()
const s = () => useProjectStore.getState()
const ui = () => useUiStore.getState()
const RANGE = { min: 24, max: 96 }

const note = (id: string, o: Partial<Note> = {}): Note => ({ id, pitch: 60, start: 0, duration: 2, velocity: 0.8, ...o })

function setup(notes: Note[]) {
  const t = addTrack(createEmptyProject(), 'synth')
  const patternId = patternsOfTrack(t.project, t.trackId ?? '')[0].id
  const project = mapPattern(t.project, patternId, (p) => (p.kind === 'notes' ? { ...p, notes } : p))
  useProjectStore.setState({ ...projectInitial, project, history: emptyHistory() }, true)
  useUiStore.setState({ ...uiInitial }, true)
  return patternId
}

const notesOf = (id: string): Note[] => {
  const p = findPattern(s().project, id)
  return p?.kind === 'notes' ? p.notes : []
}

beforeEach(() => {
  useUiStore.setState({ ...uiInitial }, true)
})

describe('selezione note', () => {
  it('selectedNotes ignora gli id che non esistono più', () => {
    const id = setup([note('a'), note('b')])
    ui().set({ selectedNoteIds: ['a', 'fantasma'] })
    expect(selectedNotes(id).map((n) => n.id)).toEqual(['a'])
  })
  it('selectedNotes con un pattern inesistente è vuoto', () => {
    setup([note('a')])
    ui().set({ selectedNoteIds: ['a'] })
    expect(selectedNotes('manca')).toEqual([])
  })
  it('setNoteSelection azzera il blocco selezionato', () => {
    setup([note('a')])
    ui().set({ selectedClipId: 'clip1' })
    setNoteSelection(['a'])
    expect(ui().selectedNoteIds).toEqual(['a'])
    expect(ui().selectedClipId).toBeNull()
  })
  it('selectAllNotes seleziona tutte le note del pattern', () => {
    const id = setup([note('a'), note('b'), note('c')])
    selectAllNotes(id)
    expect(ui().selectedNoteIds).toEqual(['a', 'b', 'c'])
  })
  it('selectAllNotes con pattern inesistente non cambia la selezione', () => {
    setup([note('a')])
    setNoteSelection(['a'])
    selectAllNotes('manca')
    expect(ui().selectedNoteIds).toEqual(['a'])
  })
})

describe('trascinamento e frecce', () => {
  it('dragNotes con lo stesso dragId è un solo annulla e parte sempre dagli originali', () => {
    const id = setup([note('a', { start: 2 }), note('b', { start: 6 })])
    const originals = notesOf(id)
    const drag = `${GESTURE_PREFIX}mv:1`
    for (const d of [1, 2, 3]) dragNotes(id, originals, d, 1, RANGE, drag)
    expect(notesOf(id).map((n) => [n.start, n.pitch])).toEqual([[5, 61], [9, 61]])
    expect(s().history.past).toHaveLength(1)
    s().undo()
    expect(notesOf(id).map((n) => [n.start, n.pitch])).toEqual([[2, 60], [6, 60]])
  })
  it('dragNoteLengths con lo stesso dragId è un solo annulla', () => {
    const id = setup([note('a', { duration: 2 })])
    const originals = notesOf(id)
    const drag = `${GESTURE_PREFIX}rs:1`
    for (const d of [1, 2, 3]) dragNoteLengths(id, originals, d, drag)
    expect(notesOf(id)[0].duration).toBe(5)
    expect(s().history.past).toHaveLength(1)
    s().undo()
    expect(notesOf(id)[0].duration).toBe(2)
  })
  it('un trascinamento che non cambia nulla non registra annulla', () => {
    const id = setup([note('a', { start: 0 })])
    dragNotes(id, notesOf(id), -3, 0, RANGE, `${GESTURE_PREFIX}mv:2`)
    expect(s().history.past).toHaveLength(0)
  })
  it('nudgeSelected sposta solo le note selezionate', () => {
    const id = setup([note('a', { start: 2 }), note('b', { start: 6 })])
    setNoteSelection(['b'])
    nudgeSelected(id, 1, -1, RANGE)
    expect(notesOf(id).map((n) => [n.start, n.pitch])).toEqual([[2, 60], [7, 59]])
    expect(s().history.past).toHaveLength(1)
  })
  it('nudgeSelected senza selezione non fa nulla', () => {
    const id = setup([note('a', { start: 2 })])
    nudgeSelected(id, 1, 1, RANGE)
    expect(notesOf(id)[0].start).toBe(2)
    expect(s().history.past).toHaveLength(0)
  })
  it('nudgeSelected non porta le note oltre l\'intervallo di altezze', () => {
    const id = setup([note('a', { pitch: 96 })])
    setNoteSelection(['a'])
    nudgeSelected(id, 0, 12, RANGE)
    expect(notesOf(id)[0].pitch).toBe(96)
  })
})

describe('nudgeSelected: unione dei passi di annulla', () => {
  it('più frecce di seguito producono un solo passo di annulla', () => {
    const id = setup([note('a', { start: 2 })])
    setNoteSelection(['a'])
    for (let i = 0; i < 3; i++) nudgeSelected(id, 1, 0, RANGE)
    expect(notesOf(id)[0].start).toBe(5)
    expect(s().history.past).toHaveLength(1)
    expect(s().history.mergeKey).toBe(`nudge:${id}`)
    s().undo()
    expect(notesOf(id)[0].start).toBe(2)
  })
})

describe('deleteSelectedNotes', () => {
  it('elimina le note selezionate e svuota la selezione', () => {
    const id = setup([note('a'), note('b'), note('c')])
    setNoteSelection(['a', 'c'])
    deleteSelectedNotes(id)
    expect(notesOf(id).map((n) => n.id)).toEqual(['b'])
    expect(ui().selectedNoteIds).toEqual([])
    s().undo()
    expect(notesOf(id)).toHaveLength(3)
  })
  it('senza note selezionate non registra annulla', () => {
    const id = setup([note('a')])
    deleteSelectedNotes(id)
    expect(notesOf(id)).toHaveLength(1)
    expect(s().history.past).toHaveLength(0)
  })
})
