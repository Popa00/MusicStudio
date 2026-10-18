import { describe, expect, it } from 'vitest'
import { createEmptyProject } from '../factory'
import { LIMITS } from '../limits'
import type { Note, Project } from '../types'
import { findPattern, patternsOfTrack } from './helpers'
import { addNote, clampNote, noteAt, removeNote, updateNote } from './notes'
import { addTrack } from './tracks'

function must<T>(value: T | null | undefined): T {
  if (value === null || value === undefined) throw new Error('valore mancante')
  return value
}

function fixture() {
  const d = addTrack(createEmptyProject(), 'drums')
  const s = addTrack(d.project, 'synth')
  const drumId = patternsOfTrack(s.project, must(d.trackId))[0].id
  const noteId = patternsOfTrack(s.project, must(s.trackId))[0].id
  return { project: s.project, drumId, noteId }
}

function notesOf(project: Project, patternId: string): Note[] {
  const p = must(findPattern(project, patternId))
  return p.kind === 'notes' ? p.notes : []
}

const note = (o: Partial<Note> = {}): Note => ({ id: 'n', pitch: 60, start: 0, duration: 4, velocity: 0.8, ...o })

describe('clampNote', () => {
  it('lascia invariata una nota valida', () => {
    expect(clampNote(note({ start: 4 }), 16)).toEqual(note({ start: 4 }))
  })
  it('tiene inizio e durata dentro il pattern', () => {
    expect(clampNote(note({ start: -3 }), 16).start).toBe(0)
    expect(clampNote(note({ start: 40 }), 16)).toMatchObject({ start: 15, duration: 1 })
    expect(clampNote(note({ start: 12, duration: 10 }), 16).duration).toBe(4)
    expect(clampNote(note({ duration: 0 }), 16).duration).toBe(1)
  })
  it('tiene la nota dentro la tastiera MIDI (0-127) e arrotonda', () => {
    expect(clampNote(note({ pitch: 200 }), 16).pitch).toBe(127)
    expect(clampNote(note({ pitch: -5 }), 16).pitch).toBe(0)
    expect(clampNote(note({ pitch: 60.6, start: 2.4 }), 16)).toMatchObject({ pitch: 61, start: 2 })
  })
  it('limita l\'intensità tra 0 e 1, NaN diventa 0', () => {
    expect(clampNote(note({ velocity: 2 }), 16).velocity).toBe(1)
    expect(clampNote(note({ velocity: NaN }), 16).velocity).toBe(0)
  })
})

describe('addNote / updateNote / removeNote', () => {
  it('aggiunge una nota con l\'id restituito, già corretta', () => {
    const f = fixture()
    const r = addNote(f.project, f.noteId, { pitch: 64, start: 14, duration: 8, velocity: 0.5 })
    expect(notesOf(r.project, f.noteId)).toEqual([{ id: r.noteId, pitch: 64, start: 14, duration: 2, velocity: 0.5 }])
    expect(notesOf(f.project, f.noteId)).toEqual([])
  })
  it('non aggiunge note a un pattern di batteria', () => {
    const f = fixture()
    const r = addNote(f.project, f.drumId, { pitch: 64, start: 0, duration: 1, velocity: 1 })
    expect(r.project.patterns).toEqual(f.project.patterns)
  })
  it('rispetta il numero massimo di note per pattern', () => {
    const f = fixture()
    const full = Array.from({ length: LIMITS.notesPerPattern }, (_, i) => note({ id: `n${i}` }))
    const project = { ...f.project, patterns: f.project.patterns.map((p) => (p.kind === 'notes' ? { ...p, notes: full } : p)) }
    const r = addNote(project, f.noteId, { pitch: 64, start: 0, duration: 1, velocity: 1 })
    expect(notesOf(r.project, f.noteId)).toHaveLength(LIMITS.notesPerPattern)
  })
  it('updateNote cambia e corregge solo la nota indicata', () => {
    const f = fixture()
    const a = addNote(f.project, f.noteId, { pitch: 60, start: 0, duration: 2, velocity: 0.8 })
    const b = addNote(a.project, f.noteId, { pitch: 62, start: 4, duration: 2, velocity: 0.8 })
    const p = updateNote(b.project, f.noteId, a.noteId, { pitch: 300, start: 8 })
    expect(notesOf(p, f.noteId)).toEqual([
      { id: a.noteId, pitch: 127, start: 8, duration: 2, velocity: 0.8 },
      notesOf(b.project, f.noteId)[1],
    ])
    expect(notesOf(b.project, f.noteId)[0].pitch).toBe(60)
  })
  it('removeNote toglie la nota', () => {
    const f = fixture()
    const a = addNote(f.project, f.noteId, { pitch: 60, start: 0, duration: 2, velocity: 0.8 })
    expect(notesOf(removeNote(a.project, f.noteId, a.noteId), f.noteId)).toEqual([])
  })
})

describe('noteAt', () => {
  const notes = [note({ id: 'a', pitch: 60, start: 4, duration: 3 })]
  it('trova la nota in ogni cella che occupa', () => {
    for (const step of [4, 5, 6]) expect(noteAt(notes, 60, step)?.id).toBe('a')
  })
  it('non trova nulla subito dopo la fine, prima dell\'inizio o su un\'altra altezza', () => {
    expect(noteAt(notes, 60, 7)).toBeUndefined()
    expect(noteAt(notes, 60, 3)).toBeUndefined()
    expect(noteAt(notes, 61, 5)).toBeUndefined()
  })
})
