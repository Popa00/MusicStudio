import { describe, expect, it } from 'vitest'
import { createEmptyProject } from '../project/factory'
import { patternsOfTrack } from '../project/ops/helpers'
import { addPattern, removePattern } from '../project/ops/patterns'
import { addTrack } from '../project/ops/tracks'
import { resolvePlayTarget, resolveSelection } from './selection'

function must<T>(value: T | null | undefined): T {
  if (value === null || value === undefined) throw new Error('valore mancante')
  return value
}

/** Due tracce; la prima ha due pattern (p1, p2), la seconda uno (q1). */
function fixture() {
  const a = addTrack(createEmptyProject(), 'drums')
  const b = addTrack(a.project, 'synth')
  const t1 = must(a.trackId)
  const t2 = must(b.trackId)
  const extra = addPattern(b.project, t1)
  const project = extra.project
  const [p1, p2] = patternsOfTrack(project, t1).map((p) => p.id)
  const q1 = patternsOfTrack(project, t2)[0].id
  return { project, t1, t2, p1, p2, q1 }
}

const ids = (sel: ReturnType<typeof resolveSelection>) => [sel.track?.id ?? null, sel.pattern?.id ?? null]

describe('resolveSelection', () => {
  it('progetto senza tracce: niente selezione', () => {
    expect(resolveSelection(createEmptyProject(), 'x', 'y')).toEqual({ track: null, pattern: null })
  })
  it('senza selezione ripiega sulla prima traccia e sul suo primo pattern', () => {
    const f = fixture()
    expect(ids(resolveSelection(f.project, null, null))).toEqual([f.t1, f.p1])
  })
  it('una traccia inesistente (es. dopo annulla) ripiega sulla prima', () => {
    const f = fixture()
    expect(ids(resolveSelection(f.project, 'sparita', f.p2))).toEqual([f.t1, f.p2])
  })
  it('rispetta una selezione valida', () => {
    const f = fixture()
    expect(ids(resolveSelection(f.project, f.t1, f.p2))).toEqual([f.t1, f.p2])
    expect(ids(resolveSelection(f.project, f.t2, f.q1))).toEqual([f.t2, f.q1])
  })
  it('un pattern di un\'altra traccia o inesistente ripiega sul primo della traccia', () => {
    const f = fixture()
    expect(ids(resolveSelection(f.project, f.t2, f.p2))).toEqual([f.t2, f.q1])
    expect(ids(resolveSelection(f.project, f.t1, 'sparito'))).toEqual([f.t1, f.p1])
  })
  it('una traccia senza pattern ha pattern null', () => {
    const f = fixture()
    const p = removePattern(f.project, f.q1)
    expect(ids(resolveSelection(p, f.t2, null))).toEqual([f.t2, null])
  })
})

describe('resolvePlayTarget', () => {
  it('in modalità brano suona tutto il brano', () => {
    const f = fixture()
    expect(resolvePlayTarget(f.project, 'song', f.t1, f.p2)).toEqual({ mode: 'song' })
  })
  it('in modalità pattern suona il pattern selezionato (con ripiego)', () => {
    const f = fixture()
    expect(resolvePlayTarget(f.project, 'pattern', f.t1, f.p2)).toEqual({ mode: 'pattern', patternId: f.p2 })
    expect(resolvePlayTarget(f.project, 'pattern', null, null)).toEqual({ mode: 'pattern', patternId: f.p1 })
  })
  it('in modalità pattern senza alcun pattern ripiega sul brano', () => {
    expect(resolvePlayTarget(createEmptyProject(), 'pattern', null, null)).toEqual({ mode: 'song' })
  })
})
