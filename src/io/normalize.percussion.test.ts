import { describe, expect, it } from 'vitest'
import { createEmptyPattern } from '../music/drumPattern'
import { createEmptyProject, createTrack } from '../project/factory'
import type { Pattern } from '../project/types'
import { normalizeProject } from './normalize'

const track = createTrack('percussion', 'Conga')
const notes: Pattern = {
  id: 'p1', trackId: track.id, name: 'P', lengthBars: 1, kind: 'notes',
  notes: [{ id: 'n1', pitch: 60, start: 0, duration: 1, velocity: 1 }],
}
const drums: Pattern = { id: 'p2', trackId: track.id, name: 'D', lengthBars: 1, kind: 'drums', steps: createEmptyPattern(16) }
const clip = (id: string, patternId: string, startBar = 0) => ({ id, trackId: track.id, patternId, startBar })
const make = (patterns: Pattern[], clips = [clip('c1', 'p1')]) =>
  normalizeProject({ ...createEmptyProject(), tracks: [track], patterns, clips })

describe('normalizeProject con tracce percussione', () => {
  it('mantiene un pattern "notes" su una traccia percussione', () => {
    expect(make([notes]).patterns.map((p) => p.id)).toEqual(['p1'])
  })
  it('mantiene le note e i blocchi del pattern', () => {
    const p = make([notes])
    expect(p.patterns[0].kind === 'notes' && p.patterns[0].notes).toHaveLength(1)
    expect(p.clips.map((c) => c.id)).toEqual(['c1'])
  })
  it('rimuove un pattern "drums" su una traccia percussione e il suo blocco', () => {
    const p = make([notes, drums], [clip('c1', 'p1'), clip('c2', 'p2', 1)])
    expect(p.patterns.map((x) => x.id)).toEqual(['p1'])
    expect(p.clips.map((c) => c.id)).toEqual(['c1'])
  })
})
