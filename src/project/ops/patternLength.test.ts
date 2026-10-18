import { describe, expect, it } from 'vitest'
import { createEmptyProject } from '../factory'
import { LIMITS } from '../limits'
import type { Pattern } from '../types'
import { addClip, overlaps } from './clips'
import { findPattern, patternsOfTrack } from './helpers'
import { patternSteps, resizePattern, setPatternLength } from './patternLength'
import { addTrack } from './tracks'

const TS = { beatsPerBar: 4, beatUnit: 4 } as const

function must<T>(value: T | null | undefined): T {
  if (value === null || value === undefined) throw new Error('valore mancante')
  return value
}

function drumPattern(lengthBars: number, kick: boolean[]): Pattern {
  const empty = Array<boolean>(kick.length).fill(false)
  return { id: 'p', trackId: 't', name: 'P', lengthBars, kind: 'drums', steps: { kick, snare: empty, clap: empty, hihatClosed: empty, hihatOpen: empty } }
}

function notePattern(lengthBars: number, notes: [number, number][]): Pattern {
  const list = notes.map(([start, duration], i) => ({ id: `n${i}`, pitch: 60, start, duration, velocity: 1 }))
  return { id: 'p', trackId: 't', name: 'P', lengthBars, kind: 'notes', notes: list }
}

describe('patternSteps', () => {
  it('conta gli step in base alle battute e al tempo musicale', () => {
    expect(patternSteps(notePattern(2, []), TS)).toBe(32)
    expect(patternSteps(notePattern(1, []), { beatsPerBar: 3, beatUnit: 4 })).toBe(12)
  })
})

describe('resizePattern', () => {
  it('allungando un pattern di batteria mantiene i colpi e aggiunge caselle vuote', () => {
    const kick = Array<boolean>(16).fill(false)
    kick[0] = kick[15] = true
    const r = resizePattern(drumPattern(1, kick), 2, TS)
    if (r.kind !== 'drums') throw new Error('atteso pattern di batteria')
    expect(r.lengthBars).toBe(2)
    expect(r.steps.kick).toHaveLength(32)
    expect(r.steps.kick.filter(Boolean)).toHaveLength(2)
    expect(r.steps.kick[15]).toBe(true)
    expect(r.steps.snare).toHaveLength(32)
  })
  it('accorciando taglia i colpi oltre la fine', () => {
    const kick = Array<boolean>(32).fill(false)
    kick[20] = true
    const r = resizePattern(drumPattern(2, kick), 1, TS)
    expect(r.kind === 'drums' && r.steps.kick).toEqual(Array(16).fill(false))
  })
  it('accorciando toglie le note che iniziano dopo la fine e accorcia quelle a cavallo', () => {
    const r = resizePattern(notePattern(2, [[0, 4], [14, 6], [20, 2]]), 1, TS)
    expect(r.kind === 'notes' && r.notes.map((n) => [n.start, n.duration])).toEqual([[0, 4], [14, 2]])
  })
  it('limita la lunghezza tra 1 e il massimo, arrotonda e gestisce NaN', () => {
    const p = notePattern(1, [])
    expect(resizePattern(p, 0, TS).lengthBars).toBe(1)
    expect(resizePattern(p, 99, TS).lengthBars).toBe(LIMITS.patternBars)
    expect(resizePattern(p, 2.6, TS).lengthBars).toBe(3)
    expect(resizePattern(p, NaN, TS).lengthBars).toBe(1)
  })
  it('non modifica il pattern originale', () => {
    const kick = Array<boolean>(16).fill(true)
    const p = drumPattern(1, kick)
    resizePattern(p, 2, TS)
    expect(p.kind === 'drums' && p.steps.kick).toHaveLength(16)
  })
})

describe('setPatternLength', () => {
  it('cambia solo il pattern indicato', () => {
    const d = addTrack(createEmptyProject(), 'drums')
    const id = patternsOfTrack(d.project, must(d.trackId))[0].id
    const p = setPatternLength(d.project, id, 4)
    expect(must(findPattern(p, id)).lengthBars).toBe(4)
    expect(must(findPattern(d.project, id)).lengthBars).toBe(1)
  })
  // BUG: allungare un pattern non controlla i blocchi già sulla linea del tempo.
  // Due blocchi adiacenti (battute 0 e 1) dopo l'allungamento a 2 battute si sovrappongono:
  // in riproduzione le note suonano doppie, cosa che addClip/moveClip impediscono sempre.
  it('allungare un pattern non crea blocchi sovrapposti sulla stessa traccia', () => {
    const d = addTrack(createEmptyProject(), 'drums')
    const trackId = must(d.trackId)
    const id = patternsOfTrack(d.project, trackId)[0].id
    const a = addClip(d.project, trackId, id, 0)
    const b = addClip(a.project, trackId, id, 1)
    const p = setPatternLength(b.project, id, 2)
    for (const c of p.clips) expect(overlaps(p, trackId, id, c.startBar, c.id)).toBe(false)
  })
})
