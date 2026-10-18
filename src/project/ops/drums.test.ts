import { describe, expect, it } from 'vitest'
import { DRUM_VOICES } from '../../music/drumPattern'
import { createEmptyProject } from '../factory'
import type { Pattern, Project } from '../types'
import { clearPattern, toggleDrumStep } from './drums'
import { findPattern, patternsOfTrack } from './helpers'
import { addNote } from './notes'
import { setPatternLength } from './patternLength'
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

const pattern = (p: Project, id: string): Pattern => must(findPattern(p, id))

describe('toggleDrumStep', () => {
  it('accende e spegne una casella', () => {
    const f = fixture()
    const on = toggleDrumStep(f.project, f.drumId, 'snare', 4)
    const p = pattern(on, f.drumId)
    expect(p.kind === 'drums' && p.steps.snare[4]).toBe(true)
    const off = pattern(toggleDrumStep(on, f.drumId, 'snare', 4), f.drumId)
    expect(off.kind === 'drums' && off.steps.snare[4]).toBe(false)
  })
  it("funziona sull'ultimo step di un pattern di 2 battute", () => {
    const f = fixture()
    const long = setPatternLength(f.project, f.drumId, 2)
    const p = pattern(toggleDrumStep(long, f.drumId, 'kick', 31), f.drumId)
    expect(p.kind === 'drums' && p.steps.kick[31]).toBe(true)
  })
  it('non cambia i pattern di note né il progetto originale', () => {
    const f = fixture()
    const next = toggleDrumStep(f.project, f.noteId, 'kick', 0)
    expect(pattern(next, f.noteId)).toBe(pattern(f.project, f.noteId))
    toggleDrumStep(f.project, f.drumId, 'kick', 0)
    const orig = pattern(f.project, f.drumId)
    expect(orig.kind === 'drums' && orig.steps.kick[0]).toBe(false)
  })
})

describe('clearPattern', () => {
  it('spegne tutte le caselle mantenendo la lunghezza', () => {
    const f = fixture()
    let p = setPatternLength(f.project, f.drumId, 2)
    p = toggleDrumStep(p, f.drumId, 'kick', 0)
    p = toggleDrumStep(p, f.drumId, 'hihatOpen', 30)
    const cleared = pattern(clearPattern(p, f.drumId), f.drumId)
    if (cleared.kind !== 'drums') throw new Error('atteso pattern di batteria')
    for (const v of DRUM_VOICES) {
      expect(cleared.steps[v]).toHaveLength(32)
      expect(cleared.steps[v].some(Boolean)).toBe(false)
    }
  })
  it('toglie tutte le note da un pattern di note', () => {
    const f = fixture()
    const p = addNote(f.project, f.noteId, { pitch: 60, start: 0, duration: 1, velocity: 1 }).project
    const cleared = pattern(clearPattern(p, f.noteId), f.noteId)
    expect(cleared.kind === 'notes' && cleared.notes).toEqual([])
  })
})
