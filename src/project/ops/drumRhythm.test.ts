import { describe, expect, it } from 'vitest'
import { DRUM_VOICES } from '../../music/drumPattern'
import { MIN_VELOCITY } from '../../music/velocity'
import { parseProject, serializeProject } from '../../io/projectFile'
import { createEmptyProject } from '../factory'
import { GENRE_RHYTHMS } from '../rhythms/genres'
import type { Project } from '../types'
import { applyRhythm } from './drumRhythm'
import { findPattern, patternsOfTrack } from './helpers'
import { setPatternLength } from './patternLength'
import { addTrack } from './tracks'

function setup(bars = 2) {
  const d = addTrack(createEmptyProject(), 'drums')
  const s = addTrack(d.project, 'synth')
  const drumId = patternsOfTrack(s.project, d.trackId ?? '')[0].id
  const noteId = patternsOfTrack(s.project, s.trackId ?? '')[0].id
  return { project: setPatternLength(s.project, drumId, bars), drumId, noteId }
}
const steps = (p: Project, id: string) => {
  const pat = findPattern(p, id)
  if (pat?.kind !== 'drums') throw new Error('non è batteria')
  return pat.steps
}
const at = (row: number[]) => row.flatMap((v, i) => (v > 0 ? [i] : []))

describe('applyRhythm', () => {
  it('ripete la battuta da 16 step in ogni battuta di un pattern di 2 battute', () => {
    const { project, drumId } = setup(2)
    const out = steps(applyRhythm(project, drumId, { kick: [0, 8], snare: [[4, 0.5]] }), drumId)
    expect(out.kick).toHaveLength(32)
    expect(at(out.kick)).toEqual([0, 8, 16, 24])
    expect(at(out.snare)).toEqual([4, 20])
    expect(out.snare[20]).toBe(0.5)
  })
  it('sostituisce i colpi precedenti', () => {
    const { project, drumId } = setup(2)
    const first = applyRhythm(project, drumId, { kick: [0], hihatOpen: [2] })
    const out = steps(applyRhythm(first, drumId, { snare: [4] }), drumId)
    expect(at(out.kick)).toEqual([])
    expect(at(out.hihatOpen)).toEqual([])
    expect(at(out.snare)).toEqual([4, 20])
  })
  it('un colpo senza intensità usa quella predefinita (>0)', () => {
    const { project, drumId } = setup(1)
    expect(steps(applyRhythm(project, drumId, { kick: [0] }), drumId).kick[0]).toBeGreaterThan(0)
  })
  it('ignora step fuori dalla battuta (negativi, >=16)', () => {
    const { project, drumId } = setup(2)
    const out = steps(applyRhythm(project, drumId, { kick: [-1, 16, 99, 3] }), drumId)
    expect(at(out.kick)).toEqual([3, 19])
  })
  it("porta le intensità nell'intervallo valido", () => {
    const { project, drumId } = setup(1)
    const out = steps(applyRhythm(project, drumId, { kick: [[0, 5], [1, 0.01], [2, NaN]], snare: [[0, -1]] }), drumId)
    expect(out.kick[0]).toBe(1)
    expect(out.kick[1]).toBe(MIN_VELOCITY)
    expect(out.kick[2]).toBeGreaterThanOrEqual(MIN_VELOCITY)
    expect(out.snare[0]).toBe(MIN_VELOCITY)
  })
  it('un ritmo vuoto svuota il pattern', () => {
    const { project, drumId } = setup(1)
    const filled = applyRhythm(project, drumId, { kick: [0] })
    expect(at(steps(applyRhythm(filled, drumId, {}), drumId).kick)).toEqual([])
  })
  it('ignora i pattern di note: progetto invariato', () => {
    const { project, noteId } = setup()
    expect(applyRhythm(project, noteId, { kick: [0] })).toEqual(project)
  })
  it('non tocca gli altri pattern e non muta il progetto di partenza', () => {
    const { project, drumId, noteId } = setup()
    const before = JSON.stringify(project)
    const out = applyRhythm(project, drumId, { kick: [0] })
    expect(findPattern(out, noteId)).toBe(findPattern(project, noteId))
    expect(JSON.stringify(project)).toBe(before)
  })
  it('con un id inesistente non cambia nulla', () => {
    const { project } = setup()
    expect(applyRhythm(project, 'manca', { kick: [0] })).toEqual(project)
  })
  it('ogni ritmo di genere produce un progetto che passa lo schema zod (round-trip)', () => {
    for (const g of GENRE_RHYTHMS) for (const v of g.variants) {
      const { project, drumId } = setup(2)
      const out = applyRhythm(project, drumId, v.hits)
      const parsed = parseProject(serializeProject(out))
      expect(parsed.ok, `${g.id} ${v.name}`).toBe(true)
      if (parsed.ok) expect(steps(parsed.project, drumId).kick).toEqual(steps(out, drumId).kick)
      expect(DRUM_VOICES.every((k) => steps(out, drumId)[k].length === 32)).toBe(true)
    }
  })
})
