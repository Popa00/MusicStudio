import { describe, expect, it } from 'vitest'
import { createEmptyProject } from '../project/factory'
import { addClip } from '../project/ops/clips'
import { patternsOfTrack } from '../project/ops/helpers'
import { setPatternLength } from '../project/ops/patternLength'
import { addTrack } from '../project/ops/tracks'
import { patternsAtStep } from './schedule'

function setup() {
  const r = addTrack(createEmptyProject(), 'synth')
  const trackId = r.trackId as string
  const patternId = patternsOfTrack(r.project, trackId)[0].id
  return { project: r.project, trackId, patternId }
}

describe('patternsAtStep', () => {
  it('in modalità brano restituisce il pattern del blocco con lo step locale', () => {
    const f = setup()
    const p = addClip(f.project, f.trackId, f.patternId, 1).project
    const out = patternsAtStep(p, { mode: 'song' }, 20)
    expect(out).toHaveLength(1)
    expect(out[0]).toMatchObject({ local: 4 })
    expect(out[0].pattern.id).toBe(f.patternId)
  })
  it('in modalità brano esclude gli step prima e dopo il blocco (fine esclusa)', () => {
    const f = setup()
    const p = addClip(f.project, f.trackId, f.patternId, 1).project
    expect(patternsAtStep(p, { mode: 'song' }, 15)).toEqual([])
    expect(patternsAtStep(p, { mode: 'song' }, 32)).toEqual([])
    expect(patternsAtStep(p, { mode: 'song' }, 16)).toHaveLength(1)
  })
  it('in modalità pattern fa il loop sulla lunghezza del pattern', () => {
    const f = setup()
    const p = setPatternLength(f.project, f.patternId, 2)
    const target = { mode: 'pattern' as const, patternId: f.patternId }
    expect(patternsAtStep(p, target, 33)[0].local).toBe(1)
    expect(patternsAtStep(p, target, 31)[0].local).toBe(31)
  })
  it('pattern inesistente o brano vuoto: lista vuota', () => {
    const f = setup()
    expect(patternsAtStep(f.project, { mode: 'pattern', patternId: 'manca' }, 0)).toEqual([])
    expect(patternsAtStep(f.project, { mode: 'song' }, 0)).toEqual([])
  })
})
