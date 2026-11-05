import { describe, expect, it } from 'vitest'
import { createEmptyProject } from '../factory'
import type { Note, Project } from '../types'
import { findPattern, mapPattern, patternsOfTrack } from './helpers'
import { moveNotes } from './noteGroup'
import { addTrack } from './tracks'

const note = (id: string, o: Partial<Note> = {}): Note => ({ id, pitch: 60, start: 0, duration: 2, velocity: 0.8, ...o })

function setup(notes: Note[]) {
  const t = addTrack(createEmptyProject(), 'synth')
  const patternId = patternsOfTrack(t.project, t.trackId ?? '')[0].id
  const project = mapPattern(t.project, patternId, (p) => (p.kind === 'notes' ? { ...p, notes } : p))
  return { project, patternId }
}

const notesOf = (project: Project, id: string): Note[] => {
  const p = findPattern(project, id)
  return p?.kind === 'notes' ? p.notes : []
}

describe('moveNotes', () => {
  it('sposta il gruppo di step e semitoni dalle posizioni originali', () => {
    const a = note('a', { start: 2, pitch: 60 })
    const b = note('b', { start: 6, pitch: 64 })
    const { project, patternId } = setup([a, b])
    const out = notesOf(moveNotes(project, patternId, [a, b], 3, -2), patternId)
    expect(out.map((n) => [n.start, n.pitch])).toEqual([[5, 58], [9, 62]])
  })
  it('usa sempre gli originali: ripetere lo stesso trascinamento non accumula', () => {
    const a = note('a', { start: 2 })
    const { project, patternId } = setup([a])
    const once = moveNotes(project, patternId, [a], 3, 0)
    const twice = moveNotes(once, patternId, [a], 3, 0)
    expect(notesOf(twice, patternId)[0].start).toBe(5)
  })
  it('riduce lo spostamento a sinistra perché nessuna nota esca dal pattern', () => {
    const a = note('a', { start: 1 })
    const b = note('b', { start: 5 })
    const { project, patternId } = setup([a, b])
    const out = notesOf(moveNotes(project, patternId, [a, b], -10, 0), patternId)
    expect(out.map((n) => n.start)).toEqual([0, 4])
  })
  it('riduce lo spostamento a destra senza accorciare le note (pattern da 16 step)', () => {
    const a = note('a', { start: 10, duration: 4 })
    const b = note('b', { start: 2, duration: 2 })
    const { project, patternId } = setup([a, b])
    const out = notesOf(moveNotes(project, patternId, [a, b], 99, 0), patternId)
    expect(out.map((n) => [n.start, n.duration])).toEqual([[12, 4], [4, 2]])
  })
  it("rispetta l'intervallo di altezze", () => {
    const a = note('a', { pitch: 50 })
    const b = note('b', { pitch: 70 })
    const { project, patternId } = setup([a, b])
    const range = { min: 24, max: 72 }
    expect(notesOf(moveNotes(project, patternId, [a, b], 0, 30, range), patternId).map((n) => n.pitch)).toEqual([52, 72])
    expect(notesOf(moveNotes(project, patternId, [a, b], 0, -99, range), patternId).map((n) => n.pitch)).toEqual([24, 44])
  })
  it('di default usa tutta la tastiera MIDI 0-127', () => {
    const a = note('a', { pitch: 120 })
    const { project, patternId } = setup([a])
    expect(notesOf(moveNotes(project, patternId, [a], 0, 50), patternId)[0].pitch).toBe(127)
  })
  it('non muove le note fuori dal gruppo', () => {
    const a = note('a', { start: 0 })
    const b = note('b', { start: 8 })
    const { project, patternId } = setup([a, b])
    expect(notesOf(moveNotes(project, patternId, [a], 2, 0), patternId)[1]).toBe(b)
  })
  it('se nulla cambia restituisce lo stesso oggetto', () => {
    const a = note('a', { start: 0, pitch: 60 })
    const { project, patternId } = setup([a])
    expect(moveNotes(project, patternId, [a], 0, 0)).toBe(project)
    expect(moveNotes(project, patternId, [a], -5, 0)).toBe(project)
    expect(moveNotes(project, patternId, [], 3, 3)).toBe(project)
  })
  it('con un pattern inesistente non cambia il progetto', () => {
    const { project } = setup([])
    expect(moveNotes(project, 'manca', [note('a')], 1, 1)).toBe(project)
  })
  it('arrotonda gli spostamenti frazionari', () => {
    const a = note('a', { start: 2 })
    const { project, patternId } = setup([a])
    expect(notesOf(moveNotes(project, patternId, [a], 1.4, 0), patternId)[0].start).toBe(3)
  })
})

describe('moveNotes: note già fuori dall\'intervallo', () => {
  const range = { min: 24, max: 96 }
  it('con spostamento 0 non cambia nulla (stesso oggetto)', () => {
    const a = note('a', { pitch: 10 })
    const b = note('b', { pitch: 120 })
    const { project, patternId } = setup([a, b])
    expect(moveNotes(project, patternId, [a, b], 0, 0, range)).toBe(project)
  })
  it('lo spostamento orizzontale non fa saltare l\'altezza', () => {
    const a = note('a', { pitch: 10, start: 2 })
    const b = note('b', { pitch: 120, start: 4 })
    const { project, patternId } = setup([a, b])
    const out = notesOf(moveNotes(project, patternId, [a, b], 3, 0, range), patternId)
    expect(out.map((n) => [n.start, n.pitch])).toEqual([[5, 10], [7, 120]])
  })
  it('uno spostamento verticale non le obbliga a muoversi', () => {
    const a = note('a', { pitch: 10 })
    const b = note('b', { pitch: 120 })
    const { project, patternId } = setup([a, b])
    expect(moveNotes(project, patternId, [a, b], 0, 5, range)).toBe(project)
  })
  it('mai risultati fuori da 0-127 o con start negativo', () => {
    const a = note('a', { pitch: 3, start: 1 })
    const { project, patternId } = setup([a])
    for (const [ds, dp] of [[-99, -99], [99, 999], [-1e9, 1e9]]) {
      const n = notesOf(moveNotes(project, patternId, [a], ds, dp), patternId)[0]
      expect(n.start).toBeGreaterThanOrEqual(0)
      expect(n.pitch).toBeGreaterThanOrEqual(0)
      expect(n.pitch).toBeLessThanOrEqual(127)
    }
  })
})
