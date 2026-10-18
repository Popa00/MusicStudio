import { describe, expect, it } from 'vitest'
import { createEmptyProject } from '../factory'
import { clampNumber, findPattern, findTrack, mapPattern, mapTrack, nextName, patternsOfTrack } from './helpers'
import { addTrack } from './tracks'

function must<T>(value: T | null | undefined): T {
  if (value === null || value === undefined) throw new Error('valore mancante')
  return value
}

function fixture() {
  const a = addTrack(createEmptyProject(), 'drums')
  const b = addTrack(a.project, 'synth')
  return { project: b.project, drums: must(a.trackId), synth: must(b.trackId) }
}

describe('ricerca', () => {
  it('findTrack e findPattern trovano per id, undefined se non esistono', () => {
    const f = fixture()
    expect(findTrack(f.project, f.synth)?.kind).toBe('synth')
    expect(findTrack(f.project, 'manca')).toBeUndefined()
    const pattern = f.project.patterns[0]
    expect(findPattern(f.project, pattern.id)).toBe(pattern)
    expect(findPattern(f.project, 'manca')).toBeUndefined()
  })
  it('patternsOfTrack restituisce solo i pattern della traccia', () => {
    const f = fixture()
    expect(patternsOfTrack(f.project, f.drums).map((p) => p.kind)).toEqual(['drums'])
    expect(patternsOfTrack(f.project, 'manca')).toEqual([])
  })
})

describe('mapTrack / mapPattern', () => {
  it('cambiano solo l\'elemento indicato senza mutare il progetto', () => {
    const f = fixture()
    const p = mapTrack(f.project, f.drums, (t) => ({ ...t, name: 'X' }))
    expect(must(findTrack(p, f.drums)).name).toBe('X')
    expect(findTrack(p, f.synth)).toBe(findTrack(f.project, f.synth))
    expect(must(findTrack(f.project, f.drums)).name).toBe('Batteria 1')
    const id = f.project.patterns[0].id
    const q = mapPattern(f.project, id, (x) => ({ ...x, name: 'Y' }))
    expect(must(findPattern(q, id)).name).toBe('Y')
    expect(f.project.patterns[0].name).toBe('Pattern 1')
  })
})

describe('clampNumber', () => {
  it('limita al minimo e al massimo', () => {
    expect(clampNumber(5, 0, 10)).toBe(5)
    expect(clampNumber(-1, 0, 10)).toBe(0)
    expect(clampNumber(11, 0, 10)).toBe(10)
  })
  it('valori non finiti (NaN, ±Infinity) diventano il minimo', () => {
    for (const v of [NaN, Infinity, -Infinity]) expect(clampNumber(v, 2, 10)).toBe(2)
  })
})

describe('nextName', () => {
  it('sceglie il primo numero libero', () => {
    expect(nextName('Pattern', [])).toBe('Pattern 1')
    expect(nextName('Pattern', ['Pattern 1', 'Pattern 2'])).toBe('Pattern 3')
    expect(nextName('Pattern', ['Pattern 1', 'Pattern 3'])).toBe('Pattern 2')
  })
})
