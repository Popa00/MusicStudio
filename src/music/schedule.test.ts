import { describe, expect, it } from 'vitest'
import { createEmptyProject } from '../project/factory'
import { addClip } from '../project/ops/clips'
import { toggleDrumStep } from '../project/ops/drums'
import { patternsOfTrack } from '../project/ops/helpers'
import { addNote } from '../project/ops/notes'
import { setPatternLength } from '../project/ops/patternLength'
import { addTrack } from '../project/ops/tracks'
import type { Project } from '../project/types'
import { eventsAtStep, loopLengthBars, playingStepOfPattern, type PlayTarget } from './schedule'
import type { TimeSignature } from './timing'

const SONG: PlayTarget = { mode: 'song' }

function must<T>(value: T | null | undefined): T {
  if (value === null || value === undefined) throw new Error('valore mancante')
  return value
}

/** Una batteria (cassa su 0 e 4) e uno strumento (Do4 sullo step 2, lungo 3). */
function fixture(ts: TimeSignature = { beatsPerBar: 4, beatUnit: 4 }) {
  let project: Project = { ...createEmptyProject(), timeSignature: ts }
  const d = addTrack(project, 'drums')
  const s = addTrack(d.project, 'synth')
  project = s.project
  const drumTrack = must(d.trackId)
  const synthTrack = must(s.trackId)
  const drumId = patternsOfTrack(project, drumTrack)[0].id
  const noteId = patternsOfTrack(project, synthTrack)[0].id
  project = toggleDrumStep(project, drumId, 'kick', 0)
  project = toggleDrumStep(project, drumId, 'kick', 4)
  project = addNote(project, noteId, { pitch: 60, start: 2, duration: 3, velocity: 0.7 }).project
  return { project, drumTrack, synthTrack, drumId, noteId }
}

function place(project: Project, trackId: string, patternId: string, ...bars: number[]): Project {
  return bars.reduce((p, bar) => {
    const result = addClip(p, trackId, patternId, bar)
    must(result.clipId)
    return result.project
  }, project)
}

describe('eventsAtStep in modalità brano', () => {
  it('suona i pattern solo dove ci sono i blocchi sulla linea del tempo', () => {
    const f = fixture()
    const p = place(f.project, f.drumTrack, f.drumId, 0, 2)
    expect(eventsAtStep(p, SONG, 0)).toEqual([{ kind: 'drum', trackId: f.drumTrack, voice: 'kick', velocity: 0.9 }])
    expect(eventsAtStep(p, SONG, 16)).toEqual([])
    expect(eventsAtStep(p, SONG, 32)).toHaveLength(1)
    expect(eventsAtStep(p, SONG, 36)).toHaveLength(1)
    expect(eventsAtStep(p, SONG, 48)).toEqual([])
  })
  it('produce eventi di nota con durata e intensità', () => {
    const f = fixture()
    const p = place(f.project, f.synthTrack, f.noteId, 1)
    expect(eventsAtStep(p, SONG, 18)).toEqual([
      { kind: 'note', trackId: f.synthTrack, pitch: 60, durationSteps: 3, velocity: 0.7 },
    ])
    expect(eventsAtStep(p, SONG, 2)).toEqual([])
  })
  it('combina gli eventi di tracce diverse sullo stesso step', () => {
    const f = fixture()
    let p = toggleDrumStep(f.project, f.drumId, 'snare', 2)
    p = place(p, f.drumTrack, f.drumId, 0)
    p = place(p, f.synthTrack, f.noteId, 0)
    expect(eventsAtStep(p, SONG, 2).map((e) => e.kind).sort()).toEqual(['drum', 'note'])
  })
  it('in 3/4 la seconda battuta inizia allo step 12', () => {
    const f = fixture({ beatsPerBar: 3, beatUnit: 4 })
    const p = place(f.project, f.drumTrack, f.drumId, 1)
    expect(eventsAtStep(p, SONG, 12)).toHaveLength(1)
    expect(eventsAtStep(p, SONG, 16)).toHaveLength(1)
    expect(eventsAtStep(p, SONG, 24)).toEqual([])
  })
  it('ignora i blocchi che puntano a pattern inesistenti', () => {
    const f = fixture()
    const p = { ...f.project, clips: [{ id: 'c', trackId: f.drumTrack, patternId: 'manca', startBar: 0 }] }
    expect(eventsAtStep(p, SONG, 0)).toEqual([])
  })
})

describe('eventsAtStep in modalità pattern', () => {
  it('ripete il pattern in loop ignorando la linea del tempo', () => {
    const f = fixture()
    const target: PlayTarget = { mode: 'pattern', patternId: f.drumId }
    expect(eventsAtStep(f.project, target, 0)).toHaveLength(1)
    expect(eventsAtStep(f.project, target, 16)).toHaveLength(1)
    expect(eventsAtStep(f.project, target, 20)).toHaveLength(1)
    expect(eventsAtStep(f.project, target, 17)).toEqual([])
  })
  it('un pattern di 2 battute fa il loop ogni 32 step', () => {
    const f = fixture()
    const p = setPatternLength(f.project, f.drumId, 2)
    const target: PlayTarget = { mode: 'pattern', patternId: f.drumId }
    expect(eventsAtStep(p, target, 16)).toEqual([])
    expect(eventsAtStep(p, target, 32)).toHaveLength(1)
  })
  it('pattern inesistente: nessun evento', () => {
    expect(eventsAtStep(fixture().project, { mode: 'pattern', patternId: 'manca' }, 0)).toEqual([])
  })
})

describe('loopLengthBars', () => {
  it('in modalità brano è la lunghezza del brano (minimo 1)', () => {
    const f = fixture()
    expect(loopLengthBars(f.project, SONG)).toBe(1)
    expect(loopLengthBars(place(f.project, f.drumTrack, f.drumId, 5), SONG)).toBe(6)
  })
  it('in modalità pattern è la lunghezza del pattern, 1 se non esiste', () => {
    const f = fixture()
    const p = setPatternLength(f.project, f.noteId, 4)
    expect(loopLengthBars(p, { mode: 'pattern', patternId: f.noteId })).toBe(4)
    expect(loopLengthBars(p, { mode: 'pattern', patternId: 'manca' })).toBe(1)
  })
})

describe('playingStepOfPattern', () => {
  it('in modalità pattern restituisce lo step nel loop solo per il pattern che suona', () => {
    const f = fixture()
    const target: PlayTarget = { mode: 'pattern', patternId: f.drumId }
    expect(playingStepOfPattern(f.project, target, f.drumId, 21)).toBe(5)
    expect(playingStepOfPattern(f.project, target, f.noteId, 21)).toBeNull()
  })
  it('in modalità brano restituisce lo step dentro il blocco che sta suonando', () => {
    const f = fixture()
    const p = place(f.project, f.drumTrack, f.drumId, 2)
    expect(playingStepOfPattern(p, SONG, f.drumId, 35)).toBe(3)
    expect(playingStepOfPattern(p, SONG, f.drumId, 31)).toBeNull()
    expect(playingStepOfPattern(p, SONG, f.drumId, 48)).toBeNull()
  })
  it('restituisce null per un pattern inesistente', () => {
    expect(playingStepOfPattern(fixture().project, SONG, 'manca', 0)).toBeNull()
  })
})
