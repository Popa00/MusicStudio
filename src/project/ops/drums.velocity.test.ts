import { describe, expect, it } from 'vitest'
import { createEmptyProject } from '../factory'
import type { Pattern } from '../types'
import { setDrumStepVelocity, toggleDrumStep } from './drums'
import { findPattern, patternsOfTrack } from './helpers'
import { addNote } from './notes'
import { addTrack } from './tracks'

function must<T>(value: T | null | undefined): T {
  if (value === null || value === undefined) throw new Error('valore mancante')
  return value
}

function fixture() {
  const d = addTrack(createEmptyProject(), 'drums')
  const s = addTrack(d.project, 'synth')
  return {
    project: s.project,
    drumId: patternsOfTrack(s.project, must(d.trackId))[0].id,
    noteId: patternsOfTrack(s.project, must(s.trackId))[0].id,
  }
}

const kick = (p: Pattern | undefined) => (p?.kind === 'drums' ? p.steps.kick : [])

describe('setDrumStepVelocity', () => {
  it("cambia l'intensità di un colpo acceso", () => {
    const f = fixture()
    const on = toggleDrumStep(f.project, f.drumId, 'kick', 3)
    const next = setDrumStepVelocity(on, f.drumId, 'kick', 3, 0.35)
    expect(kick(findPattern(next, f.drumId))[3]).toBe(0.35)
    expect(kick(findPattern(on, f.drumId))[3]).toBe(0.9)
  })
  it('non cambia nulla su una casella spenta (stesso oggetto progetto)', () => {
    const f = fixture()
    expect(setDrumStepVelocity(f.project, f.drumId, 'kick', 3, 0.35)).toBe(f.project)
  })
  it("limita il valore e lavora sull'ultimo step", () => {
    const f = fixture()
    const on = toggleDrumStep(f.project, f.drumId, 'kick', 15)
    expect(kick(findPattern(setDrumStepVelocity(on, f.drumId, 'kick', 15, 3), f.drumId))[15]).toBe(1)
    expect(kick(findPattern(setDrumStepVelocity(on, f.drumId, 'kick', 15, -3), f.drumId))[15]).toBe(0.1)
  })
  it('ignora i pattern di note e gli id inesistenti', () => {
    const f = fixture()
    const withNote = addNote(f.project, f.noteId, { pitch: 60, start: 0, duration: 1, velocity: 1 }).project
    expect(setDrumStepVelocity(withNote, f.noteId, 'kick', 0, 0.5)).toBe(withNote)
    expect(setDrumStepVelocity(withNote, 'manca', 'kick', 0, 0.5)).toBe(withNote)
  })
})
