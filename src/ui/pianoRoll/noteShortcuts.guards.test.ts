import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createEmptyProject } from '../../project/factory'
import { mapPattern, patternsOfTrack } from '../../project/ops/helpers'
import { addTrack } from '../../project/ops/tracks'
import { emptyHistory } from '../../state/history'
import { useProjectStore } from '../../state/projectStore'
import { useUiStore } from '../../state/uiStore'
import { noteDrag } from './dragState'
import { handleNoteShortcut } from './noteShortcuts'

const projectInitial = useProjectStore.getState()
const uiInitial = useUiStore.getState()
const ui = () => useUiStore.getState()

const key = (code: string, ctrl = true): KeyboardEvent =>
  ({ code, ctrlKey: ctrl, metaKey: false, shiftKey: false }) as KeyboardEvent

function setup() {
  const t = addTrack(createEmptyProject(), 'synth')
  const patternId = patternsOfTrack(t.project, t.trackId ?? '')[0].id
  const notes = [{ id: 'a', pitch: 60, start: 4, duration: 2, velocity: 0.8 }]
  const project = mapPattern(t.project, patternId, (p) => (p.kind === 'notes' ? { ...p, notes } : p))
  useProjectStore.setState({ ...projectInitial, project, history: emptyHistory() }, true)
  useUiStore.setState({ ...uiInitial, selectedTrackId: t.trackId, selectedPatternId: patternId, panel: 'editor' }, true)
}

beforeEach(() => {
  noteDrag.active = false
  setup()
})
afterEach(() => {
  vi.unstubAllGlobals()
  noteDrag.active = false
})

describe('handleNoteShortcut: finestre aperte', () => {
  it('con un dialog aperto restituisce false e non agisce', () => {
    vi.stubGlobal('document', { querySelector: (sel: string) => (sel === 'dialog[open]' ? {} : null) })
    expect(handleNoteShortcut(key('KeyA'))).toBe(false)
    expect(ui().selectedNoteIds).toEqual([])
  })
  it('senza dialog aperto le scorciatoie funzionano', () => {
    vi.stubGlobal('document', { querySelector: () => null })
    expect(handleNoteShortcut(key('KeyA'))).toBe(true)
  })
})

describe('handleNoteShortcut: Ctrl senza il necessario', () => {
  it.each(['KeyC', 'KeyX', 'KeyD'])('%s senza note selezionate restituisce false', (code) => {
    expect(handleNoteShortcut(key(code))).toBe(false)
    expect(ui().noteClipboard).toBeNull()
  })
  it.each(['KeyC', 'KeyX'])('%s con testo selezionato restituisce false e non tocca le note', (code) => {
    ui().set({ selectedNoteIds: ['a'] })
    vi.stubGlobal('window', { getSelection: () => ({ isCollapsed: false }) })
    expect(handleNoteShortcut(key(code))).toBe(false)
    expect(ui().noteClipboard).toBeNull()
    expect(useProjectStore.getState().history.past).toHaveLength(0)
  })
  it('Ctrl+V senza appunti restituisce false', () => {
    expect(handleNoteShortcut(key('KeyV'))).toBe(false)
  })
})

describe('handleNoteShortcut: durante un trascinamento', () => {
  it.each(['KeyZ', 'KeyY'])('Ctrl+%s è ignorato (true) senza toccare la cronologia', (code) => {
    ui().set({ selectedNoteIds: ['a'] })
    handleNoteShortcut(key('ArrowRight', false))
    const before = useProjectStore.getState()
    noteDrag.active = true
    expect(handleNoteShortcut(key(code))).toBe(true)
    const after = useProjectStore.getState()
    expect(after.history).toBe(before.history)
    expect(after.project).toBe(before.project)
  })
})
