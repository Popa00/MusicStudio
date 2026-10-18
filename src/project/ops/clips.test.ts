import { describe, expect, it } from 'vitest'
import { createEmptyProject } from '../factory'
import { LIMITS } from '../limits'
import type { Project } from '../types'
import { addClip, clipSpan, moveClip, overlaps, removeClip } from './clips'
import { patternsOfTrack } from './helpers'
import { setPatternLength } from './patternLength'
import { addTrack } from './tracks'

function must<T>(value: T | null | undefined): T {
  if (value === null || value === undefined) throw new Error('valore mancante')
  return value
}

/** Due tracce: la batteria ha un pattern di 2 battute, lo strumento uno di 1 battuta. */
function fixture() {
  const d = addTrack(createEmptyProject(), 'drums')
  const s = addTrack(d.project, 'synth')
  const drumTrack = must(d.trackId)
  const synthTrack = must(s.trackId)
  const drumId = patternsOfTrack(s.project, drumTrack)[0].id
  const noteId = patternsOfTrack(s.project, synthTrack)[0].id
  const project = setPatternLength(s.project, drumId, 2)
  return { project, drumTrack, synthTrack, drumId, noteId }
}

describe('addClip', () => {
  it('aggiunge un blocco e ne restituisce l\'id', () => {
    const f = fixture()
    const r = addClip(f.project, f.drumTrack, f.drumId, 3)
    expect(r.clipId).not.toBeNull()
    expect(r.project.clips).toEqual([{ id: r.clipId, trackId: f.drumTrack, patternId: f.drumId, startBar: 3 }])
    expect(f.project.clips).toEqual([])
  })
  it('rifiuta un pattern che appartiene a un\'altra traccia', () => {
    const f = fixture()
    const r = addClip(f.project, f.synthTrack, f.drumId, 0)
    expect(r).toEqual({ project: f.project, clipId: null })
  })
  it('rifiuta inizi negativi, non interi o non finiti', () => {
    const f = fixture()
    for (const bar of [-1, 1.5, NaN, Infinity]) {
      expect(addClip(f.project, f.drumTrack, f.drumId, bar).clipId).toBeNull()
    }
  })
  it('il blocco deve finire entro la lunghezza massima del brano', () => {
    const f = fixture()
    expect(addClip(f.project, f.drumTrack, f.drumId, LIMITS.songBars - 2).clipId).not.toBeNull()
    expect(addClip(f.project, f.drumTrack, f.drumId, LIMITS.songBars - 1).clipId).toBeNull()
  })
  it('rifiuta blocchi sovrapposti sulla stessa traccia, accetta quelli adiacenti', () => {
    const f = fixture()
    const p = addClip(f.project, f.drumTrack, f.drumId, 2).project
    expect(addClip(p, f.drumTrack, f.drumId, 3).clipId).toBeNull()
    expect(addClip(p, f.drumTrack, f.drumId, 1).clipId).toBeNull()
    expect(addClip(p, f.drumTrack, f.drumId, 0).clipId).not.toBeNull()
    expect(addClip(p, f.drumTrack, f.drumId, 4).clipId).not.toBeNull()
  })
  it('tracce diverse possono avere blocchi nella stessa battuta', () => {
    const f = fixture()
    const p = addClip(f.project, f.drumTrack, f.drumId, 0).project
    expect(addClip(p, f.synthTrack, f.noteId, 0).clipId).not.toBeNull()
  })
  it('rispetta il numero massimo di blocchi', () => {
    const f = fixture()
    const clips = Array.from({ length: LIMITS.clips }, (_, i) => ({ id: `c${i}`, trackId: 'altra', patternId: 'x', startBar: 0 }))
    const p: Project = { ...f.project, clips }
    expect(addClip(p, f.drumTrack, f.drumId, 0).clipId).toBeNull()
  })
})

describe('overlaps / clipSpan', () => {
  it('clipSpan è [inizio, inizio + lunghezza del pattern)', () => {
    const f = fixture()
    const r = addClip(f.project, f.drumTrack, f.drumId, 5)
    expect(clipSpan(r.project, r.project.clips[0])).toEqual([5, 7])
  })
  it('un pattern sconosciuto conta come lungo 1 battuta', () => {
    const f = fixture()
    expect(clipSpan(f.project, { id: 'c', trackId: 't', patternId: 'manca', startBar: 2 })).toEqual([2, 3])
  })
  it('ignora il blocco indicato (utile per spostarlo)', () => {
    const f = fixture()
    const r = addClip(f.project, f.drumTrack, f.drumId, 0)
    expect(overlaps(r.project, f.drumTrack, f.drumId, 1)).toBe(true)
    expect(overlaps(r.project, f.drumTrack, f.drumId, 1, must(r.clipId))).toBe(false)
  })
})

describe('moveClip / removeClip', () => {
  it('sposta un blocco, anche sovrapponendolo alla sua vecchia posizione', () => {
    const f = fixture()
    const r = addClip(f.project, f.drumTrack, f.drumId, 0)
    const moved = moveClip(r.project, must(r.clipId), 1)
    expect(moved.clips[0].startBar).toBe(1)
  })
  it('non sposta su un altro blocco, fuori dal brano o in posizioni non valide', () => {
    const f = fixture()
    const a = addClip(f.project, f.drumTrack, f.drumId, 0)
    const b = addClip(a.project, f.drumTrack, f.drumId, 4)
    const id = must(b.clipId)
    for (const bar of [0, 1, -1, 0.5, LIMITS.songBars - 1, NaN]) {
      expect(moveClip(b.project, id, bar)).toBe(b.project)
    }
  })
  it('id sconosciuto: progetto invariato', () => {
    const f = fixture()
    expect(moveClip(f.project, 'manca', 0)).toBe(f.project)
  })
  it('removeClip toglie solo il blocco indicato', () => {
    const f = fixture()
    const a = addClip(f.project, f.drumTrack, f.drumId, 0)
    const b = addClip(a.project, f.drumTrack, f.drumId, 2)
    const p = removeClip(b.project, must(a.clipId))
    expect(p.clips.map((c) => c.id)).toEqual([b.clipId])
  })
})
