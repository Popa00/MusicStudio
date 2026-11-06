import { describe, expect, it } from 'vitest'
import type { ScaleRef } from '../../music/scaleLock'
import { createEmptyProject } from '../factory'
import { findPattern, mapPattern, patternsOfTrack } from './helpers'
import { fitNotesToScale, moveNotesInScale } from './scaleNotes'
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
const notesOf = (p: Project, id: string): Note[] => {
  const pat = findPattern(p, id)
  return pat?.kind === 'notes' ? pat.notes : []
}

describe('moveNotesInScale', () => {
  it('sposta di gradi della scala e conserva la forma della melodia (Do Mi Sol + 1 grado = Re Fa La)', () => {
    const notes = [note('a', { pitch: 60 }), note('b', { pitch: 64, start: 2 }), note('c', { pitch: 67, start: 4 })]
    const { project, patternId } = setup(notes)
    const out = moveNotesInScale(project, patternId, notes, 0, 1, C_MAJOR, RANGE)
    expect(notesOf(out, patternId).map((n) => n.pitch)).toEqual([62, 65, 69])
  })
  it('sposta anche nel tempo di dStep', () => {
    const notes = [note('a')]
    const { project, patternId } = setup(notes)
    expect(notesOf(moveNotesInScale(project, patternId, notes, 3, 1, C_MAJOR, RANGE), patternId)[0]).toMatchObject({ start: 3, pitch: 62 })
  })
  it('una nota fuori scala con il blocco attivo va prima sulla scala (Do# agganciato a Do, poi un grado)', () => {
    const notes = [note('a', { pitch: 61 })]
    const { project, patternId } = setup(notes)
    // Do# si aggancia a Do (pari distanza, va giù), poi sale di un grado.
    expect(notesOf(moveNotesInScale(project, patternId, notes, 0, 1, C_MAJOR, RANGE), patternId)[0].pitch).toBe(62)
    expect(notesOf(moveNotesInScale(project, patternId, notes, 0, -1, C_MAJOR, RANGE), patternId)[0].pitch).toBe(59)
  })
  it('con passo 0 aggancia soltanto alla scala', () => {
    const notes = [note('a', { pitch: 61 }), note('b', { pitch: 62, start: 2 })]
    const { project, patternId } = setup(notes)
    expect(notesOf(moveNotesInScale(project, patternId, notes, 0, 0, C_MAJOR, RANGE), patternId).map((n) => n.pitch)).toEqual([60, 62])
  })
  it('un passo non intero viene arrotondato', () => {
    const notes = [note('a')]
    const { project, patternId } = setup(notes)
    expect(notesOf(moveNotesInScale(project, patternId, notes, 0, 1.4, C_MAJOR, RANGE), patternId)[0].pitch).toBe(62)
  })
  it('riduce il passo se una nota uscirebbe dall\'intervallo, senza deformare la melodia', () => {
    const notes = [note('a', { pitch: 60 }), note('b', { pitch: 95, start: 2 })]
    const { project, patternId } = setup(notes)
    // Si (95) + 1 grado = Do (96): ammesso. +2 gradi = Re (98): fuori, quindi passo ridotto a 1.
    const out = notesOf(moveNotesInScale(project, patternId, notes, 0, 5, C_MAJOR, RANGE), patternId)
    expect(out.map((n) => n.pitch)).toEqual([62, 96])
  })
  it('riduce anche verso il basso fino al limite minimo', () => {
    const notes = [note('a', { pitch: 24 }), note('b', { pitch: 40, start: 2 })]
    const { project, patternId } = setup(notes)
    expect(notesOf(moveNotesInScale(project, patternId, notes, 0, -9, C_MAJOR, RANGE), patternId).map((n) => n.pitch)).toEqual([24, 40])
  })
  it('con note già fuori intervallo e passo 0 le aggancia comunque alla scala', () => {
    const notes = [note('a', { pitch: 102 })]
    const { project, patternId } = setup(notes)
    expect(notesOf(moveNotesInScale(project, patternId, notes, 0, 0, C_MAJOR, RANGE), patternId)[0].pitch).toBe(101)
  })
  it('non modifica il progetto originale né le note passate (nessuna mutazione)', () => {
    const notes = [note('a')]
    const { project, patternId } = setup(notes)
    const copy = structuredClone(project)
    moveNotesInScale(project, patternId, notes, 2, 3, C_MAJOR, RANGE)
    expect(project).toEqual(copy)
    expect(notes[0]).toMatchObject({ pitch: 60, start: 0 })
  })
  it('senza note restituisce lo stesso progetto', () => {
    const { project, patternId } = setup([])
    expect(moveNotesInScale(project, patternId, [], 0, 1, C_MAJOR, RANGE)).toBe(project)
  })
  it('lascia invariate (stesso riferimento) le note non indicate', () => {
    const a = note('a')
    const b = note('b', { start: 4 })
    const { project, patternId } = setup([a, b])
    const out = notesOf(moveNotesInScale(project, patternId, [a], 0, 1, C_MAJOR, RANGE), patternId)
    expect(out[1]).toBe(b)
  })
  it('con "nessuna" scala si muove di semitoni', () => {
    const notes = [note('a')]
    const { project, patternId } = setup(notes)
    expect(notesOf(moveNotesInScale(project, patternId, notes, 0, 2, { root: 0, type: 'none' }, RANGE), patternId)[0].pitch).toBe(62)
  })
})

describe('fitNotesToScale', () => {
  it('porta le note indicate sulla nota della scala più vicina (Do# -> Do, Fa# -> Sol)', () => {
    const notes = [note('a', { pitch: 61 }), note('b', { pitch: 66, start: 2 })]
    const { project, patternId } = setup(notes)
    expect(notesOf(fitNotesToScale(project, patternId, ['a', 'b'], C_MAJOR), patternId).map((n) => n.pitch)).toEqual([60, 65])
  })
  it('non tocca le note non indicate', () => {
    const b = note('b', { pitch: 61, start: 2 })
    const { project, patternId } = setup([note('a', { pitch: 61 }), b])
    const out = notesOf(fitNotesToScale(project, patternId, ['a'], C_MAJOR), patternId)
    expect(out.map((n) => n.pitch)).toEqual([60, 61])
    expect(out[1]).toBe(b)
  })
  it('se tutto è già nella scala restituisce lo stesso progetto', () => {
    const { project, patternId } = setup([note('a'), note('b', { pitch: 64, start: 2 })])
    expect(fitNotesToScale(project, patternId, ['a', 'b'], C_MAJOR)).toBe(project)
  })
  it('se due note diventano identiche resta la più lunga', () => {
    const { project, patternId } = setup([note('a', { pitch: 60, duration: 2 }), note('b', { pitch: 61, duration: 5 })])
    const out = notesOf(fitNotesToScale(project, patternId, ['a', 'b'], C_MAJOR), patternId)
    expect(out.map((n) => n.id)).toEqual(['b'])
    expect(out[0].pitch).toBe(60)
  })
  it('a pari durata ne resta una sola (la prima)', () => {
    const { project, patternId } = setup([note('a', { pitch: 61 }), note('b', { pitch: 60 })])
    const out = notesOf(fitNotesToScale(project, patternId, ['a', 'b'], C_MAJOR), patternId)
    expect(out).toHaveLength(1)
    expect(out[0].id).toBe('a')
  })
  it('note con lo stesso grado ma inizio diverso non sono duplicati', () => {
    const { project, patternId } = setup([note('a', { pitch: 61, start: 0 }), note('b', { pitch: 60, start: 2 })])
    expect(notesOf(fitNotesToScale(project, patternId, ['a', 'b'], C_MAJOR), patternId)).toHaveLength(2)
  })
  it('non scarta mai una nota non indicata, anche se identica a una adattata', () => {
    const { project, patternId } = setup([note('a', { pitch: 61, duration: 8 }), note('b', { pitch: 60, duration: 1 })])
    const out = notesOf(fitNotesToScale(project, patternId, ['a'], C_MAJOR), patternId)
    expect(out.map((n) => n.id)).toEqual(['a', 'b'])
  })
  it('con "nessuna" scala non cambia nulla', () => {
    const { project, patternId } = setup([note('a', { pitch: 61 })])
    expect(fitNotesToScale(project, patternId, ['a'], { root: 0, type: 'none' })).toBe(project)
  })
  it('funziona con le pentatoniche (La minore pentatonica: Fa# diventa Sol)', () => {
    const { project, patternId } = setup([note('a', { pitch: 66 })])
    const out = fitNotesToScale(project, patternId, ['a'], { root: 9, type: 'pentatonicMinor' })
    expect(notesOf(out, patternId)[0].pitch).toBe(67)
  })
  it('con pattern inesistente restituisce lo stesso progetto', () => {
    const { project } = setup([note('a', { pitch: 61 })])
    expect(fitNotesToScale(project, 'nope', ['a'], C_MAJOR)).toBe(project)
  })
})
