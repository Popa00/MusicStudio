import { describe, expect, it } from 'vitest'
import type { ScaleRef } from '../../music/scaleLock'
import { createEmptyProject } from '../factory'
import { findPattern, mapPattern, patternsOfTrack } from './helpers'
import { fitNotesToScale, moveNotesInScale, removeDuplicateNotes } from './scaleNotes'
import { addTrack } from './tracks'
import type { Note, Project } from '../types'

const C_MAJOR: ScaleRef = { root: 0, type: 'major' }
const RANGE = { min: 24, max: 96 }
const note = (id: string, o: Partial<Note> = {}): Note => ({ id, pitch: 60, start: 0, duration: 2, velocity: 0.8, ...o })

function setup(notes: Note[]): { project: Project; patternId: string } {
  const t = addTrack(createEmptyProject(), 'synth')
  const patternId = patternsOfTrack(t.project, t.trackId ?? '')[0].id
  return { project: mapPattern(t.project, patternId, (p) => (p.kind === 'notes' ? { ...p, notes } : p)), patternId }
}
const ids = (p: Project, id: string) => {
  const pat = findPattern(p, id)
  return pat?.kind === 'notes' ? pat.notes.map((n) => n.id) : []
}

describe('removeDuplicateNotes', () => {
  it('di due note identiche (stessa altezza e inizio) resta la più lunga', () => {
    const { project, patternId } = setup([note('a', { duration: 2 }), note('b', { duration: 4 })])
    expect(ids(removeDuplicateNotes(project, patternId, ['a', 'b']), patternId)).toEqual(['b'])
  })
  it('a parità di durata resta la prima', () => {
    const { project, patternId } = setup([note('a'), note('b')])
    expect(ids(removeDuplicateNotes(project, patternId, ['a', 'b']), patternId)).toEqual(['a'])
  })
  it('non tocca note con altezza o inizio diversi (stesso riferimento)', () => {
    const { project, patternId } = setup([note('a'), note('b', { pitch: 62 }), note('c', { start: 4 })])
    expect(removeDuplicateNotes(project, patternId, ['a', 'b', 'c'])).toBe(project)
  })
  it('non scarta mai note fuori da noteIds, anche se doppie', () => {
    const { project, patternId } = setup([note('a'), note('b', { duration: 4 })])
    expect(removeDuplicateNotes(project, patternId, ['b'])).toBe(project)
  })
  it('una nota indicata uguale a una non indicata più lunga viene scartata', () => {
    const { project, patternId } = setup([note('a', { duration: 4 }), note('b', { duration: 2 })])
    expect(ids(removeDuplicateNotes(project, patternId, ['b']), patternId)).toEqual(['a'])
  })
  it('con tre note identiche resta la più lunga', () => {
    const { project, patternId } = setup([note('a'), note('b', { duration: 3 }), note('c', { duration: 1 })])
    expect(ids(removeDuplicateNotes(project, patternId, ['a', 'b', 'c']), patternId)).toEqual(['b'])
  })
  it('lista vuota o pattern inesistente: progetto invariato', () => {
    const { project, patternId } = setup([note('a'), note('b')])
    expect(removeDuplicateNotes(project, patternId, [])).toBe(project)
    expect(removeDuplicateNotes(project, 'manca', ['a'])).toBe(project)
  })
  it('non muta il progetto di partenza', () => {
    const { project, patternId } = setup([note('a'), note('b')])
    const before = JSON.stringify(project)
    removeDuplicateNotes(project, patternId, ['a', 'b'])
    expect(JSON.stringify(project)).toBe(before)
  })
})

describe('fitNotesToScale con duplicati e moveNotesInScale non finiti', () => {
  it('Do e Do# insieme diventano una sola nota Do', () => {
    const { project, patternId } = setup([note('a', { pitch: 61 }), note('b', { pitch: 60 })])
    const out = fitNotesToScale(project, patternId, ['a', 'b'], C_MAJOR)
    expect(ids(out, patternId)).toHaveLength(1)
  })
  it.each([NaN, Infinity, -Infinity])('moveNotesInScale con gradi %s restituisce il progetto invariato', (deg) => {
    const notes = [note('a')]
    const { project, patternId } = setup(notes)
    expect(moveNotesInScale(project, patternId, notes, 0, deg, C_MAJOR, RANGE)).toBe(project)
  })
})
