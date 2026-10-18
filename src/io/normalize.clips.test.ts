import { describe, expect, it } from 'vitest'
import { createEffectSettings } from '../project/effectDefaults'
import { LIMITS } from '../project/limits'
import { electronicBeat } from '../project/templates/electronicBeat'
import type { Clip, Project } from '../project/types'
import { normalizeProject } from './normalize'
import { parseProject, serializeProject } from './projectFile'

function withClips(project: Project, clips: Clip[]): Project {
  return { ...project, clips }
}

describe('normalizeProject: blocchi', () => {
  const base = electronicBeat()
  const pattern = base.patterns[0]
  const clip = (id: string, startBar: number): Clip => ({ id, trackId: pattern.trackId, patternId: pattern.id, startBar })

  it('scarta i blocchi sovrapposti sulla stessa traccia, tenendo il primo nel tempo', () => {
    const result = normalizeProject(withClips(base, [clip('b', 0), clip('a', 0), clip('c', 1)]))
    expect(result.clips.map((c) => c.id)).toEqual(['b', 'c'])
  })

  it('scarta i blocchi che finiscono oltre la fine del brano', () => {
    const long = { ...pattern, lengthBars: 8 } as typeof pattern
    const project = { ...base, patterns: base.patterns.map((p) => (p.id === pattern.id ? long : p)) }
    const result = normalizeProject(withClips(project, [clip('ok', LIMITS.songBars - 8), clip('fuori', LIMITS.songBars - 7)]))
    expect(result.clips.map((c) => c.id)).toEqual(['ok'])
  })

  it('512 blocchi tutti sovrapposti diventano uno solo (niente blocco della riproduzione)', () => {
    const clips = Array.from({ length: LIMITS.clips }, (_, i) => clip(`c${i}`, 0))
    const parsed = parseProject(serializeProject(withClips(base, clips)))
    expect(parsed.ok && parsed.project.clips).toHaveLength(1)
  })

  it('rende unici gli id degli effetti di una traccia', () => {
    const fx = createEffectSettings('reverb')
    const tracks = base.tracks.map((t, i) => (i === 0 ? { ...t, effects: [fx, { ...fx }] } : t))
    expect(normalizeProject({ ...base, tracks }).tracks[0].effects).toHaveLength(1)
  })
})

describe('schema: tempo musicale', () => {
  const withTs = (beatsPerBar: number, beatUnit: number) =>
    serializeProject({ ...electronicBeat(), timeSignature: { beatsPerBar, beatUnit: beatUnit as 4 } })

  it('accetta 4/4, 3/4 e 6/8', () => {
    expect(parseProject(withTs(4, 4)).ok).toBe(true)
    expect(parseProject(withTs(3, 4)).ok).toBe(true)
    expect(parseProject(withTs(6, 8)).ok).toBe(true)
  })

  it('rifiuta tempi con più di 16 step per battuta (es. 5/4), che supererebbero i limiti dei pattern', () => {
    expect(parseProject(withTs(5, 4)).ok).toBe(false)
  })
})
