import { describe, expect, it } from 'vitest'
import { createEmptyProject } from '../project/factory'
import type { Pattern, Project, Track } from '../project/types'
import { normalizeProject } from './normalize'
import { parseProject } from './projectFile'

const mixer = { volumeDb: 0, pan: 0, mute: false, solo: false }
const drumTrack = (id: string, name = id): Track => ({ id, name, kind: 'drums', mixer, effects: [] })
const empty16 = () => Array<number>(16).fill(0)
const drumPattern = (id: string, trackId: string, name = id): Pattern => ({
  id, trackId, name, lengthBars: 1, kind: 'drums',
  steps: { kick: empty16(), snare: empty16(), clap: empty16(), hihatClosed: empty16(), hihatOpen: empty16() },
})
const notePattern = (id: string, trackId: string, notes: [string, number, number][] = []): Pattern => ({
  id, trackId, name: id, lengthBars: 1, kind: 'notes',
  notes: notes.map(([nid, start, duration]) => ({ id: nid, pitch: 60, start, duration, velocity: 1 })),
})
const clip = (id: string, trackId: string, patternId: string, startBar = 0) => ({ id, trackId, patternId, startBar })

function project(parts: Partial<Project>): Project {
  return { ...createEmptyProject(), ...parts }
}

describe('normalizeProject: riferimenti incoerenti', () => {
  it('toglie i pattern di tracce inesistenti e i loro blocchi', () => {
    const p = normalizeProject(project({
      tracks: [drumTrack('t1')],
      patterns: [drumPattern('p1', 't1'), drumPattern('orfano', 'manca')],
      clips: [clip('c1', 't1', 'p1'), clip('c2', 'manca', 'orfano')],
    }))
    expect(p.patterns.map((x) => x.id)).toEqual(['p1'])
    expect(p.clips.map((x) => x.id)).toEqual(['c1'])
  })
  it('toglie i pattern di tipo diverso dalla traccia (note su una batteria)', () => {
    const p = normalizeProject(project({ tracks: [drumTrack('t1')], patterns: [notePattern('p1', 't1')] }))
    expect(p.patterns).toEqual([])
  })
  it('toglie i blocchi con pattern inesistente o di un\'altra traccia', () => {
    const p = normalizeProject(project({
      tracks: [drumTrack('t1'), drumTrack('t2')],
      patterns: [drumPattern('p1', 't1')],
      clips: [clip('ok', 't1', 'p1'), clip('manca', 't1', 'x'), clip('altra', 't2', 'p1', 2)],
    }))
    expect(p.clips.map((x) => x.id)).toEqual(['ok'])
  })
})

describe('normalizeProject: id duplicati', () => {
  it('tiene solo la prima traccia, il primo pattern e il primo blocco con lo stesso id', () => {
    const p = normalizeProject(project({
      tracks: [drumTrack('t', 'prima'), drumTrack('t', 'seconda')],
      patterns: [drumPattern('p', 't', 'primo'), drumPattern('p', 't', 'secondo')],
      clips: [clip('c', 't', 'p', 0), clip('c', 't', 'p', 4)],
    }))
    expect(p.tracks.map((t) => t.name)).toEqual(['prima'])
    expect(p.patterns.map((x) => x.name)).toEqual(['primo'])
    expect(p.clips.map((c) => c.startBar)).toEqual([0])
  })
  // BUG: normalizeProject toglie gli id duplicati di tracce, pattern e blocchi ma non quelli
  // delle note dentro un pattern (né degli effetti di una traccia). Con due note con lo stesso id,
  // updateNote/removeNote modificano o cancellano entrambe insieme. Atteso: id resi unici.
  it('rende unici gli id delle note dentro un pattern', () => {
    const p = normalizeProject(project({
      tracks: [{ ...drumTrack('t'), kind: 'synth', synth: { preset: '', waveform: 'sine', attack: 0.01, decay: 0.1, sustain: 0.5, release: 0.1, cutoff: 1000, resonance: 1 } }],
      patterns: [notePattern('p', 't', [['n', 0, 1], ['n', 4, 1]])],
    }))
    const notes = p.patterns[0].kind === 'notes' ? p.patterns[0].notes : []
    expect(new Set(notes.map((n) => n.id)).size).toBe(notes.length)
  })
})

describe('normalizeProject: lunghezze', () => {
  it('riallinea le caselle della batteria alla lunghezza del pattern', () => {
    const short = drumPattern('p', 't')
    if (short.kind !== 'drums') throw new Error()
    short.steps.kick = [0.9, 0, 0.5]
    short.steps.snare = Array<number>(40).fill(0.7)
    const p = normalizeProject(project({ tracks: [drumTrack('t')], patterns: [short] }))
    const steps = p.patterns[0].kind === 'drums' ? p.patterns[0].steps : null
    expect(steps?.kick).toEqual([0.9, 0, 0.5, ...Array(13).fill(0)])
    expect(steps?.snare).toEqual(Array(16).fill(0.7))
  })
  it('via parseProject: toglie le note oltre la fine e accorcia quelle a cavallo', () => {
    const synth = { ...drumTrack('t'), kind: 'synth', synth: { preset: '', waveform: 'sine', attack: 0.01, decay: 0.1, sustain: 0.5, release: 0.1, cutoff: 1000, resonance: 1 } }
    const data = project({ patterns: [notePattern('p', 't', [['a', 0, 4], ['b', 14, 8], ['c', 30, 1]])] })
    const result = parseProject(JSON.stringify({ ...data, tracks: [synth] }))
    expect(result.ok).toBe(true)
    const pattern = result.ok ? result.project.patterns[0] : null
    expect(pattern?.kind === 'notes' && pattern.notes.map((n) => [n.id, n.duration])).toEqual([['a', 4], ['b', 2]])
  })
  it('non modifica il progetto ricevuto', () => {
    const input = project({ tracks: [drumTrack('t'), drumTrack('t')], patterns: [drumPattern('p', 'manca')] })
    const copy = structuredClone(input)
    normalizeProject(input)
    expect(input).toEqual(copy)
  })
})
