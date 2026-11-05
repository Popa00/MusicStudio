import { describe, expect, it } from 'vitest'
import { createEmptyProject } from '../factory'
import { LIMITS } from '../limits'
import type { Note, Project } from '../types'
import { findPattern, mapPattern, patternsOfTrack } from './helpers'
import { insertNotes, notesInRect, removeNotes, resizeNotes } from './noteGroup'
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


describe('resizeNotes', () => {
  it('cambia la durata di tutto il gruppo', () => {
    const a = note('a', { duration: 2 })
    const b = note('b', { start: 4, duration: 3 })
    const { project, patternId } = setup([a, b])
    expect(notesOf(resizeNotes(project, patternId, [a, b], 2), patternId).map((n) => n.duration)).toEqual([4, 5])
  })
  it('la durata minima è 1', () => {
    const a = note('a', { duration: 2 })
    const { project, patternId } = setup([a])
    expect(notesOf(resizeNotes(project, patternId, [a], -10), patternId)[0].duration).toBe(1)
  })
  it('non supera la fine del pattern', () => {
    const a = note('a', { start: 12, duration: 2 })
    const { project, patternId } = setup([a])
    expect(notesOf(resizeNotes(project, patternId, [a], 50), patternId)[0].duration).toBe(4)
  })
  it('se nulla cambia restituisce lo stesso oggetto', () => {
    const a = note('a', { start: 12, duration: 4 })
    const { project, patternId } = setup([a])
    expect(resizeNotes(project, patternId, [a], 3)).toBe(project)
    expect(resizeNotes(project, patternId, [a], 0)).toBe(project)
  })
})

describe('removeNotes', () => {
  it('toglie solo le note indicate', () => {
    const { project, patternId } = setup([note('a'), note('b'), note('c')])
    expect(notesOf(removeNotes(project, patternId, ['a', 'c']), patternId).map((n) => n.id)).toEqual(['b'])
  })
  it('con id inesistenti o lista vuota restituisce lo stesso progetto', () => {
    const { project, patternId } = setup([note('a')])
    expect(removeNotes(project, patternId, ['x'])).toBe(project)
    expect(removeNotes(project, patternId, [])).toBe(project)
  })
})

describe('insertNotes', () => {
  const input = (o: Partial<Omit<Note, 'id'>> = {}) => ({ pitch: 60, start: 0, duration: 2, velocity: 0.8, ...o })
  it('aggiunge le note con id nuovi e distinti', () => {
    const { project, patternId } = setup([note('a')])
    const r = insertNotes(project, patternId, [input(), input({ start: 4 })])
    expect(r.noteIds).toHaveLength(2)
    expect(new Set([...r.noteIds, 'a']).size).toBe(3)
    expect(notesOf(r.project, patternId).map((n) => n.id)).toEqual(['a', ...r.noteIds])
  })
  it('scarta le note con inizio fuori dal pattern ma tiene quelle valide', () => {
    const { project, patternId } = setup([])
    const r = insertNotes(project, patternId, [input({ start: 16 }), input({ start: -1 }), input({ start: 15, duration: 5 })])
    const notes = notesOf(r.project, patternId)
    expect(notes).toHaveLength(1)
    expect(notes[0]).toMatchObject({ start: 15, duration: 1 })
  })
  it('se nessuna nota entra restituisce lo stesso progetto e nessun id', () => {
    const { project, patternId } = setup([])
    const r = insertNotes(project, patternId, [input({ start: 40 })])
    expect(r.project).toBe(project)
    expect(r.noteIds).toEqual([])
    expect(insertNotes(project, patternId, []).project).toBe(project)
  })
  it('applica clampNote (altezza e intensità)', () => {
    const { project, patternId } = setup([])
    const r = insertNotes(project, patternId, [input({ pitch: 300, velocity: 9 })])
    const n = notesOf(r.project, patternId)[0]
    expect(n.pitch).toBe(127)
    expect(n.velocity).toBeLessThanOrEqual(1)
  })
  it('rispetta il limite di note per pattern', () => {
    const full = Array.from({ length: LIMITS.notesPerPattern - 1 }, (_, i) => note(`n${i}`))
    const { project, patternId } = setup(full)
    const r = insertNotes(project, patternId, [input(), input({ start: 1 }), input({ start: 2 })])
    expect(r.noteIds).toHaveLength(1)
    expect(notesOf(r.project, patternId)).toHaveLength(LIMITS.notesPerPattern)
    const again = insertNotes(r.project, patternId, [input()])
    expect(again.project).toBe(r.project)
    expect(again.noteIds).toEqual([])
  })
  it('con poco spazio entrano le note che iniziano prima, anche se fornite in disordine', () => {
    const full = Array.from({ length: LIMITS.notesPerPattern - 2 }, (_, i) => note(`n${i}`))
    const { project, patternId } = setup(full)
    const r = insertNotes(project, patternId, [input({ start: 12 }), input({ start: 3 }), input({ start: 9 }), input({ start: 1 })])
    const added = notesOf(r.project, patternId).slice(full.length)
    expect(added.map((n) => n.start)).toEqual([1, 3])
  })
  it('con un pattern inesistente non cambia nulla', () => {
    const { project } = setup([])
    expect(insertNotes(project, 'manca', [input()])).toEqual({ project, noteIds: [] })
  })
})

describe('notesInRect', () => {
  const notes = [note('a', { start: 4, duration: 4, pitch: 60 }), note('b', { start: 10, duration: 2, pitch: 65 })]
  const rect = { fromStep: 0, toStep: 15, lowPitch: 0, highPitch: 127 }
  it('trova le note che toccano il rettangolo, anche in parte', () => {
    expect(notesInRect(notes, { ...rect, fromStep: 6, toStep: 6 })).toEqual(['a'])
  })
  it('gli estremi sono inclusi (primo e ultimo step della nota)', () => {
    expect(notesInRect(notes, { ...rect, fromStep: 7, toStep: 7 })).toEqual(['a'])
    expect(notesInRect(notes, { ...rect, fromStep: 0, toStep: 4 })).toEqual(['a'])
  })
  it('esclude le note appena fuori dagli step', () => {
    expect(notesInRect(notes, { ...rect, fromStep: 8, toStep: 9 })).toEqual([])
    expect(notesInRect(notes, { ...rect, fromStep: 0, toStep: 3 })).toEqual([])
  })
  it('filtra per altezza con estremi inclusi', () => {
    expect(notesInRect(notes, { ...rect, lowPitch: 65, highPitch: 65 })).toEqual(['b'])
    expect(notesInRect(notes, { ...rect, lowPitch: 61, highPitch: 64 })).toEqual([])
  })
  it('con nessuna nota restituisce una lista vuota', () => {
    expect(notesInRect([], rect)).toEqual([])
  })
})
