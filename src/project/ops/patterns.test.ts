import { describe, expect, it } from 'vitest'
import { createEmptyProject } from '../factory'
import { LIMITS } from '../limits'
import { projectSchema } from '../schema/project'
import { addClip } from './clips'
import { findPattern, patternsOfTrack } from './helpers'
import { addNote } from './notes'
import { addPattern, duplicatePattern, removePattern, renamePattern } from './patterns'
import { addTrack } from './tracks'

function must<T>(value: T | null | undefined): T {
  if (value === null || value === undefined) throw new Error('valore mancante')
  return value
}

function fixture() {
  const s = addTrack(createEmptyProject(), 'synth')
  const trackId = must(s.trackId)
  const patternId = patternsOfTrack(s.project, trackId)[0].id
  const project = addNote(s.project, patternId, { pitch: 60, start: 0, duration: 2, velocity: 0.8 }).project
  return { project, trackId, patternId }
}

describe('addPattern', () => {
  it('aggiunge un pattern vuoto dello stesso tipo della traccia con un nome libero', () => {
    const f = fixture()
    const r = addPattern(f.project, f.trackId)
    const p = must(findPattern(r.project, must(r.patternId)))
    expect(p).toMatchObject({ trackId: f.trackId, name: 'Pattern 2', kind: 'notes', notes: [], lengthBars: 1 })
  })
  it('traccia inesistente: nessun pattern', () => {
    const f = fixture()
    expect(addPattern(f.project, 'manca')).toEqual({ project: f.project, patternId: null })
  })
  it('rispetta il numero massimo di pattern', () => {
    let { project, trackId } = fixture()
    while (project.patterns.length < LIMITS.patterns) project = must(addPattern(project, trackId)).project
    expect(addPattern(project, trackId).patternId).toBeNull()
  })
})

describe('duplicatePattern', () => {
  it('crea una copia indipendente con nuovi id per pattern e note', () => {
    const f = fixture()
    const r = duplicatePattern(f.project, f.patternId)
    const orig = must(findPattern(r.project, f.patternId))
    const copy = must(findPattern(r.project, must(r.patternId)))
    expect(copy.id).not.toBe(orig.id)
    expect(copy.name).toBe('Pattern 1 copia 1')
    if (copy.kind !== 'notes' || orig.kind !== 'notes') throw new Error('attesi pattern di note')
    const withoutId = (n: { id: string }) => ({ ...n, id: undefined })
    expect(copy.notes.map(withoutId)).toEqual(orig.notes.map(withoutId))
    expect(copy.notes[0].id).not.toBe(orig.notes[0].id)
    expect(copy.notes).not.toBe(orig.notes)
  })
  it('copie successive hanno nomi diversi', () => {
    const f = fixture()
    const a = duplicatePattern(f.project, f.patternId)
    const b = duplicatePattern(a.project, f.patternId)
    expect(must(findPattern(b.project, must(b.patternId))).name).toBe('Pattern 1 copia 2')
  })
  it('pattern inesistente: nessuna copia', () => {
    const f = fixture()
    expect(duplicatePattern(f.project, 'manca')).toEqual({ project: f.project, patternId: null })
  })
  // BUG: il nome della copia ("<nome> copia N") non viene troncato a LIMITS.nameLength.
  // Con un nome di 40 caratteri il progetto diventa non valido per lo schema e,
  // una volta salvato, non si riapre più (né dal file né dal salvataggio automatico).
  it('la copia di un pattern con nome lungo resta un progetto valido', () => {
    const f = fixture()
    const named = renamePattern(f.project, f.patternId, 'x'.repeat(LIMITS.nameLength))
    const r = duplicatePattern(named, f.patternId)
    expect(must(findPattern(r.project, must(r.patternId))).name.length).toBeLessThanOrEqual(LIMITS.nameLength)
    expect(projectSchema.safeParse(r.project).success).toBe(true)
  })
})

describe('renamePattern / removePattern', () => {
  it('rinomina troncando al limite di lunghezza', () => {
    const f = fixture()
    const p = renamePattern(f.project, f.patternId, 'y'.repeat(100))
    expect(must(findPattern(p, f.patternId)).name).toBe('y'.repeat(LIMITS.nameLength))
  })
  it('eliminare un pattern elimina anche i suoi blocchi sulla linea del tempo', () => {
    const f = fixture()
    const other = addPattern(f.project, f.trackId)
    let p = addClip(other.project, f.trackId, f.patternId, 0).project
    p = addClip(p, f.trackId, must(other.patternId), 1).project
    const removed = removePattern(p, f.patternId)
    expect(findPattern(removed, f.patternId)).toBeUndefined()
    expect(removed.clips.map((c) => c.patternId)).toEqual([other.patternId])
  })
})
