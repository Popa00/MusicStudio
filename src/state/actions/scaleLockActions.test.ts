import { beforeEach, describe, expect, it } from 'vitest'
import { createEmptyProject } from '../../project/factory'
import { findPattern, mapPattern, patternsOfTrack } from '../../project/ops/helpers'
import { setScale } from '../../project/ops/song'
import { addTrack } from '../../project/ops/tracks'
import type { Note } from '../../project/types'
import { emptyHistory, GESTURE_PREFIX } from '../history'
import { useProjectStore } from '../projectStore'
import { useUiStore } from '../uiStore'
import { dragNotesInScale, fitPatternToScale, lockedScale, lockPitch, nudgeSelectedInScale } from './scaleLockActions'

const projectInitial = useProjectStore.getState()
const uiInitial = useUiStore.getState()
const s = () => useProjectStore.getState()
const ui = () => useUiStore.getState()
const RANGE = { min: 24, max: 96 }
const note = (id: string, o: Partial<Note> = {}): Note => ({ id, pitch: 60, start: 0, duration: 2, velocity: 0.8, ...o })

function setup(notes: Note[], type: 'major' | 'none' | 'pentatonicMinor' = 'major', root = 0) {
  const t = addTrack(createEmptyProject(), 'synth')
  const patternId = patternsOfTrack(t.project, t.trackId ?? '')[0].id
  const base = mapPattern(t.project, patternId, (p) => (p.kind === 'notes' ? { ...p, notes } : p))
  useProjectStore.setState({ ...projectInitial, project: setScale(base, root, type), history: emptyHistory() }, true)
  useUiStore.setState({ ...uiInitial }, true)
  return patternId
}
const notesOf = (id: string): Note[] => {
  const p = findPattern(s().project, id)
  return p?.kind === 'notes' ? p.notes : []
}
const pitches = (id: string) => notesOf(id).map((n) => n.pitch)

beforeEach(() => useUiStore.setState({ ...uiInitial }, true))

describe('lockedScale e lockPitch', () => {
  it('il blocco è attivo di default e restituisce la scala del progetto', () => {
    setup([])
    expect(lockedScale()).toEqual({ root: 0, type: 'major' })
  })
  it('è null se il blocco è spento', () => {
    setup([])
    ui().set({ scaleLock: false })
    expect(lockedScale()).toBeNull()
  })
  it('è null se la scala è "nessuna", anche con il blocco acceso', () => {
    setup([], 'none')
    expect(ui().scaleLock).toBe(true)
    expect(lockedScale()).toBeNull()
  })
  it('lockPitch aggancia la nota suonata (Do# -> Do; Re resta Re)', () => {
    setup([])
    expect(lockPitch(61)).toBe(60)
    expect(lockPitch(62)).toBe(62)
  })
  it('lockPitch con la tonica spostata e una pentatonica (La minore pent.: La# -> La)', () => {
    setup([], 'pentatonicMinor', 9)
    expect(lockPitch(70)).toBe(69)
  })
  it('lockPitch non cambia nulla con blocco spento o scala "nessuna"', () => {
    setup([])
    ui().set({ scaleLock: false })
    expect(lockPitch(61)).toBe(61)
    setup([], 'none')
    expect(lockPitch(61)).toBe(61)
  })
})

describe('dragNotesInScale', () => {
  it('sposta di tanti gradi quanti ne copre il mouse, tutte le note insieme', () => {
    const notes = [note('a', { pitch: 60 }), note('b', { pitch: 64, start: 2 })]
    const id = setup(notes)
    dragNotesInScale(id, notes, 60, 0, 4, RANGE, `${GESTURE_PREFIX}1`)
    expect(pitches(id)).toEqual([64, 67])
  })
  it('calcola sempre dalle note originali (trascinare avanti e indietro non accumula)', () => {
    const notes = [note('a')]
    const id = setup(notes)
    dragNotesInScale(id, notes, 60, 0, 7, RANGE, `${GESTURE_PREFIX}1`)
    dragNotesInScale(id, notes, 60, 0, 4, RANGE, `${GESTURE_PREFIX}1`)
    expect(pitches(id)).toEqual([64])
  })
  it('è un solo "annulla" per tutto il trascinamento', () => {
    const notes = [note('a')]
    const id = setup(notes)
    dragNotesInScale(id, notes, 60, 0, 2, RANGE, `${GESTURE_PREFIX}1`)
    dragNotesInScale(id, notes, 60, 0, 4, RANGE, `${GESTURE_PREFIX}1`)
    s().undo()
    expect(pitches(id)).toEqual([60])
  })
  it('non fa nulla se il blocco è spento', () => {
    const notes = [note('a')]
    const id = setup(notes)
    ui().set({ scaleLock: false })
    dragNotesInScale(id, notes, 60, 0, 4, RANGE, 'drag')
    expect(pitches(id)).toEqual([60])
  })
})

describe('nudgeSelectedInScale', () => {
  it('sposta le note selezionate di un grado e lascia le altre', () => {
    const id = setup([note('a'), note('b', { start: 4 })])
    ui().set({ selectedNoteIds: ['a'] })
    nudgeSelectedInScale(id, 1, RANGE)
    expect(pitches(id)).toEqual([62, 60])
  })
  it('una nota fuori scala va sulla nota della scala in quella direzione', () => {
    const id = setup([note('a', { pitch: 61 })])
    ui().set({ selectedNoteIds: ['a'] })
    nudgeSelectedInScale(id, 1, RANGE)
    expect(pitches(id)).toEqual([62])
  })
  it('un\'ottava di gradi (7 in Do maggiore) è 12 semitoni', () => {
    const id = setup([note('a')])
    ui().set({ selectedNoteIds: ['a'] })
    nudgeSelectedInScale(id, 7, RANGE)
    expect(pitches(id)).toEqual([72])
  })
  it('al bordo dell\'intervallo non esce', () => {
    const id = setup([note('a', { pitch: 96 })])
    ui().set({ selectedNoteIds: ['a'] })
    nudgeSelectedInScale(id, 1, RANGE)
    expect(pitches(id)).toEqual([96])
  })
  it('le ripetute si uniscono in un solo "annulla" (chiave nudge:pattern)', () => {
    const id = setup([note('a')])
    ui().set({ selectedNoteIds: ['a'] })
    nudgeSelectedInScale(id, 1, RANGE)
    nudgeSelectedInScale(id, 1, RANGE)
    expect(pitches(id)).toEqual([64])
    s().undo()
    expect(pitches(id)).toEqual([60])
  })
  it('non fa nulla con blocco spento o senza selezione', () => {
    const id = setup([note('a')])
    nudgeSelectedInScale(id, 1, RANGE)
    ui().set({ selectedNoteIds: ['a'], scaleLock: false })
    nudgeSelectedInScale(id, 1, RANGE)
    expect(pitches(id)).toEqual([60])
  })
})

describe('fitPatternToScale', () => {
  it('adatta solo le note selezionate, se ce ne sono', () => {
    const id = setup([note('a', { pitch: 61 }), note('b', { pitch: 61, start: 2 })])
    ui().set({ selectedNoteIds: ['b'] })
    fitPatternToScale(id)
    expect(pitches(id)).toEqual([61, 60])
  })
  it('adatta tutte le note se non ce n\'è nessuna selezionata', () => {
    const id = setup([note('a', { pitch: 61 }), note('b', { pitch: 66, start: 2 })])
    fitPatternToScale(id)
    expect(pitches(id)).toEqual([60, 65])
  })
  it('funziona anche con il blocco spento (è un comando esplicito)', () => {
    const id = setup([note('a', { pitch: 61 })])
    ui().set({ scaleLock: false })
    fitPatternToScale(id)
    expect(pitches(id)).toEqual([60])
  })
  it('è un solo "annulla", anche se toglie dei duplicati', () => {
    const id = setup([note('a', { pitch: 61 }), note('b', { pitch: 60 }), note('c', { pitch: 66, start: 4 })])
    fitPatternToScale(id)
    expect(notesOf(id)).toHaveLength(2)
    s().undo()
    expect(pitches(id)).toEqual([61, 60, 66])
  })
  it('con scala "nessuna" non fa nulla e non crea passi di annulla', () => {
    const id = setup([note('a', { pitch: 61 })], 'none')
    fitPatternToScale(id)
    expect(pitches(id)).toEqual([61])
    expect(s().history.past).toHaveLength(0)
  })
  it('con un pattern inesistente non fa nulla', () => {
    setup([note('a', { pitch: 61 })])
    fitPatternToScale('manca')
    expect(s().history.past).toHaveLength(0)
  })
})
