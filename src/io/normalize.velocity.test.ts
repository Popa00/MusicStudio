import { describe, expect, it } from 'vitest'
import { createEmptyProject } from '../project/factory'
import { electronicBeat } from '../project/templates/electronicBeat'
import { lofi } from '../project/templates/lofi'
import type { Pattern, Project, Track } from '../project/types'
import { normalizeProject } from './normalize'

const synth = { preset: '', waveform: 'sine' as const, attack: 0.01, decay: 0.1, sustain: 0.5, release: 0.1, cutoff: 1000, resonance: 1 }

function withVelocities(velocities: number[]): Project {
  const track: Track = { id: 't', name: 't', kind: 'synth', mixer: { volumeDb: 0, pan: 0, mute: false, solo: false }, effects: [], synth }
  const notes = velocities.map((velocity, i) => ({ id: `n${i}`, pitch: 60, start: i, duration: 1, velocity }))
  const pattern: Pattern = { id: 'p', trackId: 't', name: 'p', lengthBars: 1, kind: 'notes', notes }
  return { ...createEmptyProject(), tracks: [track], patterns: [pattern], clips: [] }
}

const velocitiesOf = (p: Project) => (p.patterns[0].kind === 'notes' ? p.patterns[0].notes.map((n) => n.velocity) : [])

describe('normalizeProject: intensità delle note', () => {
  it('porta 0 a 0,1 e lascia 1 e i valori validi', () => {
    const out = normalizeProject(withVelocities([0, 0.05, 0.1, 0.5, 1]))
    expect(velocitiesOf(out)).toEqual([0.1, 0.1, 0.1, 0.5, 1])
  })
  it('un progetto valido con note tra 0,1 e 1 resta identico', () => {
    const valid = withVelocities([0.1, 0.8, 1])
    expect(normalizeProject(valid)).toEqual(valid)
    for (const t of [electronicBeat(), lofi()]) expect(normalizeProject(t)).toEqual(t)
  })
  it('non muta il progetto originale', () => {
    const p = withVelocities([0])
    normalizeProject(p)
    expect(velocitiesOf(p)).toEqual([0])
  })
})
