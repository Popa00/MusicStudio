import { describe, expect, it } from 'vitest'
import { createEmptyProject } from '../factory'
import { LIMITS } from '../limits'
import { projectSchema } from '../schema/project'
import { DEFAULT_SYNTH } from '../synthPresets'
import type { Project, Track } from '../types'
import { addClip } from './clips'
import { findTrack, patternsOfTrack } from './helpers'
import { addPattern } from './patterns'
import { addTrack, removeTrack, renameTrack, updateMixer, updateSynth } from './tracks'

function must<T>(value: T | null | undefined): T {
  if (value === null || value === undefined) throw new Error('valore mancante')
  return value
}

const track = (p: Project, id: string): Track => must(findTrack(p, id))

describe('addTrack', () => {
  it('aggiunge una batteria con un primo pattern di batteria da 16 step', () => {
    const r = addTrack(createEmptyProject(), 'drums')
    const id = must(r.trackId)
    expect(track(r.project, id)).toMatchObject({ kind: 'drums', name: 'Batteria 1', effects: [] })
    const [pattern] = patternsOfTrack(r.project, id)
    expect(pattern).toMatchObject({ kind: 'drums', name: 'Pattern 1', lengthBars: 1 })
    expect(pattern.kind === 'drums' && pattern.steps.kick).toHaveLength(16)
  })
  it('uno strumento usa il suono predefinito e un pattern di note', () => {
    const r = addTrack(createEmptyProject(), 'synth')
    const t = track(r.project, must(r.trackId))
    expect(t.kind === 'synth' && t.synth).toEqual(DEFAULT_SYNTH)
    expect(patternsOfTrack(r.project, t.id)[0].kind).toBe('notes')
  })
  it('i nomi non si ripetono', () => {
    const a = addTrack(createEmptyProject(), 'drums')
    const b = addTrack(a.project, 'drums')
    expect(track(b.project, must(b.trackId)).name).toBe('Batteria 2')
  })
  it('rispetta il numero massimo di tracce', () => {
    let p = createEmptyProject()
    for (let i = 0; i < LIMITS.tracks; i++) p = addTrack(p, 'synth').project
    expect(addTrack(p, 'drums')).toEqual({ project: p, trackId: null })
  })
  // BUG: addTrack crea sempre un pattern senza controllare LIMITS.patterns.
  // Con 128 pattern già presenti si arriva a 129: il progetto non supera più lo schema
  // e, una volta salvato, non si riapre. Atteso: traccia rifiutata (o senza pattern).
  it('non supera il limite di pattern aggiungendo una traccia', () => {
    const first = addTrack(createEmptyProject(), 'drums')
    let p = first.project
    while (p.patterns.length < LIMITS.patterns) p = addPattern(p, must(first.trackId)).project
    const r = addTrack(p, 'synth')
    expect(r.project.patterns.length).toBeLessThanOrEqual(LIMITS.patterns)
    expect(projectSchema.safeParse(r.project).success).toBe(true)
  })
})

describe('removeTrack / renameTrack', () => {
  it('elimina la traccia con i suoi pattern e blocchi, lasciando le altre', () => {
    const a = addTrack(createEmptyProject(), 'drums')
    const b = addTrack(a.project, 'synth')
    const aId = must(a.trackId)
    const bId = must(b.trackId)
    let p = addClip(b.project, aId, patternsOfTrack(b.project, aId)[0].id, 0).project
    p = addClip(p, bId, patternsOfTrack(p, bId)[0].id, 0).project
    const r = removeTrack(p, aId)
    expect(r.tracks.map((t) => t.id)).toEqual([bId])
    expect(r.patterns.every((x) => x.trackId === bId)).toBe(true)
    expect(r.clips.every((c) => c.trackId === bId)).toBe(true)
  })
  it('rinomina troncando al limite', () => {
    const a = addTrack(createEmptyProject(), 'drums')
    const p = renameTrack(a.project, must(a.trackId), 'z'.repeat(80))
    expect(track(p, must(a.trackId)).name).toHaveLength(LIMITS.nameLength)
  })
})

describe('updateMixer', () => {
  const setup = () => addTrack(createEmptyProject(), 'drums')
  it('applica volume, panoramica e mute', () => {
    const a = setup()
    const p = updateMixer(a.project, must(a.trackId), { volumeDb: -12, pan: 0.5, mute: true })
    expect(track(p, must(a.trackId)).mixer).toEqual({ volumeDb: -12, pan: 0.5, mute: true, solo: false })
  })
  it('limita volume (-60..6) e panoramica (-1..1); NaN va al minimo', () => {
    const a = setup()
    const id = must(a.trackId)
    expect(track(updateMixer(a.project, id, { volumeDb: 40, pan: -9 }), id).mixer).toMatchObject({ volumeDb: 6, pan: -1 })
    expect(track(updateMixer(a.project, id, { volumeDb: NaN }), id).mixer.volumeDb).toBe(-60)
  })
  it('non modifica il mixer condiviso di default', () => {
    const a = setup()
    updateMixer(a.project, must(a.trackId), { volumeDb: -5 })
    expect(track(a.project, must(a.trackId)).mixer.volumeDb).toBe(0)
  })
})

describe('updateSynth', () => {
  it('applica valori validi', () => {
    const a = addTrack(createEmptyProject(), 'synth')
    const id = must(a.trackId)
    const t = track(updateSynth(a.project, id, { attack: 1, waveform: 'square' }), id)
    expect(t.kind === 'synth' && t.synth).toMatchObject({ attack: 1, waveform: 'square' })
  })
  it('ignora valori fuori range o non finiti', () => {
    const a = addTrack(createEmptyProject(), 'synth')
    const id = must(a.trackId)
    for (const changes of [{ attack: 10 }, { cutoff: 5 }, { sustain: NaN }, { release: Infinity }]) {
      const t = track(updateSynth(a.project, id, changes), id)
      expect(t.kind === 'synth' && t.synth).toEqual(DEFAULT_SYNTH)
    }
  })
  it('non tocca le tracce di batteria', () => {
    const a = addTrack(createEmptyProject(), 'drums')
    const id = must(a.trackId)
    expect(track(updateSynth(a.project, id, { attack: 1 }), id)).toEqual(track(a.project, id))
  })
})
