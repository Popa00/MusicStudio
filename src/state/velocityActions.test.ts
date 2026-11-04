import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createEmptyProject } from '../project/factory'
import { patternsOfTrack } from '../project/ops/helpers'
import { addTrack } from '../project/ops/tracks'
import { GESTURE_PREFIX, emptyHistory, MERGE_WINDOW_MS } from './history'
import { changeNotesVelocity, createNote } from './actions/noteActions'
import { setStepVelocity, toggleStep } from './actions/patternActions'
import { useProjectStore } from './projectStore'

const initial = useProjectStore.getState()
const s = () => useProjectStore.getState()

function setup() {
  const d = addTrack(createEmptyProject(), 'drums')
  const n = addTrack(d.project, 'synth')
  const drumId = patternsOfTrack(n.project, d.trackId ?? '')[0].id
  const noteId = patternsOfTrack(n.project, n.trackId ?? '')[0].id
  useProjectStore.setState({ ...initial, project: n.project, history: emptyHistory() }, true)
  return { drumId, noteId }
}

const notesOf = (id: string) => {
  const p = s().project.patterns.find((x) => x.id === id)
  return p?.kind === 'notes' ? p.notes : []
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(100_000)
})
afterEach(() => vi.useRealTimers())

describe('changeNotesVelocity', () => {
  it('cambia l\'intensità di più note con un solo passo di annulla', () => {
    const { noteId } = setup()
    const a = createNote(noteId, { pitch: 60, start: 0, duration: 2, velocity: 0.8 })
    const b = createNote(noteId, { pitch: 64, start: 0, duration: 2, velocity: 0.5 })
    vi.setSystemTime(200_000)
    const before = s().history.past.length
    changeNotesVelocity(noteId, [a, b], 0.3)
    expect(notesOf(noteId).map((n) => n.velocity)).toEqual([0.3, 0.3])
    expect(s().history.past).toHaveLength(before + 1)
    s().undo()
    expect(notesOf(noteId).map((n) => n.velocity)).toEqual([0.8, 0.5])
  })
  it('limita il valore e non registra nulla se non cambia niente', () => {
    const { noteId } = setup()
    const a = createNote(noteId, { pitch: 60, start: 0, duration: 2, velocity: 1 })
    vi.setSystemTime(200_000)
    const before = s().history.past.length
    changeNotesVelocity(noteId, [a], 5)
    expect(s().history.past).toHaveLength(before)
    changeNotesVelocity(noteId, [a], -2)
    expect(notesOf(noteId)[0].velocity).toBe(0.1)
  })
  it('con una lista vuota o id inesistenti non cambia il progetto', () => {
    const { noteId } = setup()
    const project = s().project
    changeNotesVelocity(noteId, [], 0.3)
    changeNotesVelocity(noteId, ['manca'], 0.3)
    expect(s().project).toBe(project)
  })
  it('un trascinamento con lo stesso dragId è un solo annulla, anche con pause lunghe', () => {
    const { noteId } = setup()
    const a = createNote(noteId, { pitch: 60, start: 0, duration: 2, velocity: 0.8 })
    vi.setSystemTime(200_000)
    const before = s().history.past.length
    const drag = `${GESTURE_PREFIX}vel:1`
    for (const [i, v] of [0.7, 0.6, 0.4].entries()) {
      vi.setSystemTime(200_000 + i * MERGE_WINDOW_MS * 3)
      changeNotesVelocity(noteId, [a], v, drag)
    }
    expect(s().history.past).toHaveLength(before + 1)
    s().undo()
    expect(notesOf(noteId)[0].velocity).toBe(0.8)
  })
})

describe('setStepVelocity (azione)', () => {
  it('cambia l\'intensità di un colpo acceso e un trascinamento è un solo annulla', () => {
    const { drumId } = setup()
    toggleStep(drumId, 'hihatClosed', 2)
    const before = s().history.past.length
    const drag = `${GESTURE_PREFIX}dv:1`
    for (const [i, v] of [0.7, 0.5, 0.3].entries()) {
      vi.setSystemTime(300_000 + i * MERGE_WINDOW_MS * 3)
      setStepVelocity(drumId, 'hihatClosed', 2, v, drag)
    }
    const row = () => {
      const p = s().project.patterns.find((x) => x.id === drumId)
      return p?.kind === 'drums' ? p.steps.hihatClosed : []
    }
    expect(row()[2]).toBe(0.3)
    expect(s().history.past).toHaveLength(before + 1)
    s().undo()
    expect(row()[2]).toBe(0.9)
  })
  it('su una casella spenta non cambia nulla e non registra annulla', () => {
    const { drumId } = setup()
    const project = s().project
    setStepVelocity(drumId, 'kick', 0, 0.5)
    expect(s().project).toBe(project)
    expect(s().history.past).toEqual([])
  })
})
