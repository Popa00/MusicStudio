import { beforeEach, describe, expect, it } from 'vitest'
import { createEmptyProject } from '../../project/factory'
import { findPattern, mapPattern, patternsOfTrack } from '../../project/ops/helpers'
import { setScale } from '../../project/ops/song'
import { addTrack } from '../../project/ops/tracks'
import type { Note } from '../../project/types'
import { emptyHistory, GESTURE_PREFIX } from '../history'
import { useProjectStore } from '../projectStore'
import { useUiStore } from '../uiStore'
import { dragNotesInScale, finishScaleDrag, nudgeSelectedInScale } from './scaleLockActions'

const projectInitial = useProjectStore.getState()
const uiInitial = useUiStore.getState()
const s = () => useProjectStore.getState()
const ui = () => useUiStore.getState()
const RANGE = { min: 24, max: 96 }
const note = (id: string, o: Partial<Note> = {}): Note => ({ id, pitch: 60, start: 0, duration: 2, velocity: 0.8, ...o })
const DRAG = `${GESTURE_PREFIX}1`

function setup(notes: Note[]) {
  const t = addTrack(createEmptyProject(), 'synth')
  const patternId = patternsOfTrack(t.project, t.trackId ?? '')[0].id
  const base = mapPattern(t.project, patternId, (p) => (p.kind === 'notes' ? { ...p, notes } : p))
  useProjectStore.setState({ ...projectInitial, project: setScale(base, 0, 'major'), history: emptyHistory() }, true)
  useUiStore.setState({ ...uiInitial }, true)
  return patternId
}
const pitches = (id: string) => {
  const p = findPattern(s().project, id)
  return p?.kind === 'notes' ? p.notes.map((n) => n.pitch) : []
}

beforeEach(() => useUiStore.setState({ ...uiInitial }, true))

describe('nudgeSelectedInScale senza duplicati', () => {
  it('Do e Do# allo stesso inizio + freccia su danno un solo Re', () => {
    const id = setup([note('a', { pitch: 60 }), note('b', { pitch: 61 })])
    ui().set({ selectedNoteIds: ['a', 'b'] })
    nudgeSelectedInScale(id, 1, RANGE)
    expect(pitches(id)).toEqual([62])
  })
  it("è un solo passo di annulla che ripristina entrambe le note", () => {
    const id = setup([note('a', { pitch: 60 }), note('b', { pitch: 61 })])
    ui().set({ selectedNoteIds: ['a', 'b'] })
    nudgeSelectedInScale(id, 1, RANGE)
    s().undo()
    expect(pitches(id)).toEqual([60, 61])
  })
  it('note già distinte restano tutte', () => {
    const id = setup([note('a', { pitch: 60 }), note('b', { pitch: 64 })])
    ui().set({ selectedNoteIds: ['a', 'b'] })
    nudgeSelectedInScale(id, 1, RANGE)
    expect(pitches(id)).toEqual([62, 65])
  })
})

describe('finishScaleDrag', () => {
  it("toglie le note finite una sopra l'altra", () => {
    const id = setup([note('a'), note('b', { duration: 4 })])
    finishScaleDrag(id, ['a', 'b'], DRAG)
    expect(pitches(id)).toEqual([60])
  })
  it('non fa nulla con il blocco spento', () => {
    const id = setup([note('a'), note('b')])
    ui().set({ scaleLock: false })
    finishScaleDrag(id, ['a', 'b'], DRAG)
    expect(pitches(id)).toEqual([60, 60])
    expect(s().history.past).toHaveLength(0)
  })
  it('non fa nulla con scala "nessuna"', () => {
    const id = setup([note('a'), note('b')])
    useProjectStore.setState({ project: setScale(s().project, 0, 'none') })
    finishScaleDrag(id, ['a', 'b'], DRAG)
    expect(pitches(id)).toEqual([60, 60])
  })
  it('si unisce al trascinamento nello stesso passo di annulla', () => {
    const originals = [note('a', { pitch: 60 }), note('b', { pitch: 61 })]
    const id = setup(originals)
    dragNotesInScale(id, [originals[0]], 60, 0, 2, RANGE, DRAG)
    dragNotesInScale(id, [originals[0]], 60, 0, 4, RANGE, DRAG)
    finishScaleDrag(id, ['a', 'b'], DRAG)
    expect(s().history.past).toHaveLength(1)
    s().undo()
    expect(pitches(id)).toEqual([60, 61])
  })
  it('senza doppie non cambia le note', () => {
    const id = setup([note('a'), note('b', { pitch: 64 })])
    finishScaleDrag(id, ['a', 'b'], DRAG)
    expect(pitches(id)).toEqual([60, 64])
  })
})
