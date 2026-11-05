import { beforeEach, describe, expect, it } from 'vitest'
import { createEmptyProject } from '../../project/factory'
import { findPattern, mapPattern, patternsOfTrack } from '../../project/ops/helpers'
import { addTrack } from '../../project/ops/tracks'
import type { Note } from '../../project/types'
import { emptyHistory } from '../../state/history'
import { useProjectStore } from '../../state/projectStore'
import { useUiStore } from '../../state/uiStore'
import { handleNoteShortcut } from './noteShortcuts'

const projectInitial = useProjectStore.getState()
const uiInitial = useUiStore.getState()
const s = () => useProjectStore.getState()
const ui = () => useUiStore.getState()

const note = (id: string, o: Partial<Note> = {}): Note => ({ id, pitch: 60, start: 4, duration: 2, velocity: 0.8, ...o })

function key(code: string, mods: { ctrl?: boolean; meta?: boolean; shift?: boolean } = {}): KeyboardEvent {
  return { code, ctrlKey: !!mods.ctrl, metaKey: !!mods.meta, shiftKey: !!mods.shift } as KeyboardEvent
}

function setup(kind: 'synth' | 'drums' = 'synth') {
  const t = addTrack(createEmptyProject(), kind)
  const patternId = patternsOfTrack(t.project, t.trackId ?? '')[0].id
  const project = mapPattern(t.project, patternId, (p) =>
    p.kind === 'notes' ? { ...p, notes: [note('a'), note('b', { start: 8 })] } : p,
  )
  useProjectStore.setState({ ...projectInitial, project, history: emptyHistory() }, true)
  useUiStore.setState({ ...uiInitial, selectedTrackId: t.trackId, selectedPatternId: patternId, panel: 'editor' }, true)
  return patternId
}

const notesOf = (id: string): Note[] => {
  const p = findPattern(s().project, id)
  return p?.kind === 'notes' ? p.notes : []
}

beforeEach(() => useUiStore.setState({ ...uiInitial }, true))

describe('handleNoteShortcut: quando funziona', () => {
  it('ignora tutto se il pannello non è l\'editor', () => {
    const id = setup()
    ui().set({ panel: 'mixer' })
    expect(handleNoteShortcut(key('KeyA', { ctrl: true }))).toBe(false)
    expect(ui().selectedNoteIds).toEqual([])
    expect(notesOf(id)).toHaveLength(2)
  })
  it('ignora tutto se il pattern aperto è di batteria', () => {
    setup('drums')
    expect(handleNoteShortcut(key('KeyA', { ctrl: true }))).toBe(false)
  })
  it('ignora tutto se non c\'è nessuna traccia', () => {
    useProjectStore.setState({ ...projectInitial, project: createEmptyProject(), history: emptyHistory() }, true)
    useUiStore.setState({ ...uiInitial }, true)
    expect(handleNoteShortcut(key('KeyA', { ctrl: true }))).toBe(false)
  })
})

describe('handleNoteShortcut: Ctrl', () => {
  it('Ctrl+A seleziona tutte le note', () => {
    setup()
    expect(handleNoteShortcut(key('KeyA', { ctrl: true }))).toBe(true)
    expect(ui().selectedNoteIds).toEqual(['a', 'b'])
  })
  it('Cmd (meta) vale come Ctrl', () => {
    setup()
    expect(handleNoteShortcut(key('KeyA', { meta: true }))).toBe(true)
    expect(ui().selectedNoteIds).toHaveLength(2)
  })
  it('Ctrl+C, Ctrl+V incollano subito dopo', () => {
    const id = setup()
    ui().set({ selectedNoteIds: ['a'] })
    expect(handleNoteShortcut(key('KeyC', { ctrl: true }))).toBe(true)
    expect(handleNoteShortcut(key('KeyV', { ctrl: true }))).toBe(true)
    expect(notesOf(id).map((n) => n.start)).toEqual([4, 8, 6])
  })
  it('Ctrl+X taglia', () => {
    const id = setup()
    ui().set({ selectedNoteIds: ['a'] })
    expect(handleNoteShortcut(key('KeyX', { ctrl: true }))).toBe(true)
    expect(notesOf(id).map((n) => n.id)).toEqual(['b'])
    expect(ui().noteClipboard).not.toBeNull()
  })
  it('Ctrl+D duplica', () => {
    const id = setup()
    ui().set({ selectedNoteIds: ['a'] })
    expect(handleNoteShortcut(key('KeyD', { ctrl: true }))).toBe(true)
    expect(notesOf(id)).toHaveLength(3)
  })
  it('Ctrl+Shift+A non è una scorciatoia delle note', () => {
    setup()
    expect(handleNoteShortcut(key('KeyA', { ctrl: true, shift: true }))).toBe(false)
    expect(ui().selectedNoteIds).toEqual([])
  })
  it('Ctrl+freccia o Ctrl+Canc non fanno nulla', () => {
    const id = setup()
    ui().set({ selectedNoteIds: ['a'] })
    expect(handleNoteShortcut(key('ArrowRight', { ctrl: true }))).toBe(false)
    expect(handleNoteShortcut(key('Delete', { ctrl: true }))).toBe(false)
    expect(notesOf(id)[0].start).toBe(4)
  })
})

describe('handleNoteShortcut: Canc, Esc e frecce', () => {
  it.each(['Delete', 'Backspace'])('%s elimina le note selezionate', (code) => {
    const id = setup()
    ui().set({ selectedNoteIds: ['a'] })
    expect(handleNoteShortcut(key(code))).toBe(true)
    expect(notesOf(id).map((n) => n.id)).toEqual(['b'])
    expect(ui().selectedNoteIds).toEqual([])
  })
  it('Canc senza note selezionate restituisce false (lo gestisce il Canc globale)', () => {
    const id = setup()
    expect(handleNoteShortcut(key('Delete'))).toBe(false)
    expect(notesOf(id)).toHaveLength(2)
  })
  it('Esc toglie la selezione', () => {
    setup()
    ui().set({ selectedNoteIds: ['a', 'b'] })
    expect(handleNoteShortcut(key('Escape'))).toBe(true)
    expect(ui().selectedNoteIds).toEqual([])
  })
  it('le frecce sposta di uno step e un semitono', () => {
    const id = setup()
    ui().set({ selectedNoteIds: ['a'] })
    handleNoteShortcut(key('ArrowRight'))
    handleNoteShortcut(key('ArrowUp'))
    expect([notesOf(id)[0].start, notesOf(id)[0].pitch]).toEqual([5, 61])
    handleNoteShortcut(key('ArrowLeft'))
    handleNoteShortcut(key('ArrowDown'))
    expect([notesOf(id)[0].start, notesOf(id)[0].pitch]).toEqual([4, 60])
  })
  it('con Shift sposta di un battito (4 step) o di un\'ottava', () => {
    const id = setup()
    ui().set({ selectedNoteIds: ['a'] })
    expect(handleNoteShortcut(key('ArrowRight', { shift: true }))).toBe(true)
    expect(notesOf(id)[0].start).toBe(8)
    handleNoteShortcut(key('ArrowUp', { shift: true }))
    expect(notesOf(id)[0].pitch).toBe(72)
    handleNoteShortcut(key('ArrowDown', { shift: true }))
    handleNoteShortcut(key('ArrowLeft', { shift: true }))
    expect([notesOf(id)[0].start, notesOf(id)[0].pitch]).toEqual([4, 60])
  })
  it('senza note selezionate le frecce restituiscono false', () => {
    setup()
    expect(handleNoteShortcut(key('ArrowRight'))).toBe(false)
    expect(handleNoteShortcut(key('Escape'))).toBe(false)
  })
  it('un tasto qualunque restituisce false', () => {
    setup()
    ui().set({ selectedNoteIds: ['a'] })
    expect(handleNoteShortcut(key('KeyQ'))).toBe(false)
  })
})
