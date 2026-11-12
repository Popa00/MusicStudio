import { describe, expect, it } from 'vitest'
import { createEmptyProject } from '../project/factory'
import { LIMITS } from '../project/limits'
import { addClip } from '../project/ops/clips'
import { patternsOfTrack } from '../project/ops/helpers'
import { setPatternLength } from '../project/ops/patternLength'
import { addTrack } from '../project/ops/tracks'
import type { Project } from '../project/types'
import { activeLoop, cleanLoopRange, defaultLoopRange } from './loopRegion'
import { stepsPerBar } from './timing'

/** Progetto con una traccia di batteria, un pattern di 2 battute e un blocco alla battuta 4 (brano di 6 battute). */
function fixture() {
  const t = addTrack(createEmptyProject(), 'drums')
  const trackId = t.trackId as string
  const patternId = patternsOfTrack(t.project, trackId)[0].id
  const withLen = setPatternLength(t.project, patternId, 2)
  const added = addClip(withLen, trackId, patternId, 4)
  return { project: added.project, clipId: added.clipId as string, patternId }
}

describe('cleanLoopRange', () => {
  it('lascia invariata una parte già valida', () => {
    expect(cleanLoopRange({ start: 2, end: 6 })).toEqual({ start: 2, end: 6 })
  })
  it('arrotonda a numeri interi', () => {
    expect(cleanLoopRange({ start: 1.4, end: 3.6 })).toEqual({ start: 1, end: 4 })
  })
  it('impone almeno una battuta quando fine <= inizio', () => {
    expect(cleanLoopRange({ start: 5, end: 5 })).toEqual({ start: 5, end: 6 })
    expect(cleanLoopRange({ start: 5, end: 2 })).toEqual({ start: 5, end: 6 })
  })
  it('porta a 0 un inizio negativo', () => {
    expect(cleanLoopRange({ start: -3, end: 2 })).toEqual({ start: 0, end: 2 })
  })
  it('con NaN usa inizio 0 e una battuta', () => {
    expect(cleanLoopRange({ start: NaN, end: NaN })).toEqual({ start: 0, end: 1 })
  })
  it('con Infinity scarta il valore e usa il valore di ripiego', () => {
    expect(cleanLoopRange({ start: 2, end: Infinity })).toEqual({ start: 2, end: 3 })
    expect(cleanLoopRange({ start: Infinity, end: 5 })).toEqual({ start: 0, end: 5 })
  })
  it('non supera la lunghezza massima del brano', () => {
    const max = LIMITS.songBars
    expect(cleanLoopRange({ start: 0, end: max + 50 })).toEqual({ start: 0, end: max })
    expect(cleanLoopRange({ start: max + 10, end: max + 20 })).toEqual({ start: max - 1, end: max })
  })
})

describe('defaultLoopRange', () => {
  it('con un blocco selezionato usa le sue battute', () => {
    const { project, clipId } = fixture()
    expect(defaultLoopRange(project, clipId, 0)).toEqual({ start: 4, end: 6 })
  })
  it('senza blocco ripete 4 battute dalla battuta di partenza', () => {
    const { project } = fixture()
    const bar = stepsPerBar(project.timeSignature)
    expect(defaultLoopRange(project, null, bar)).toEqual({ start: 1, end: 5 })
  })
  it('non supera la fine del brano', () => {
    const { project } = fixture()
    const bar = stepsPerBar(project.timeSignature)
    expect(defaultLoopRange(project, null, 4 * bar)).toEqual({ start: 4, end: 6 })
  })
  it("con startStep oltre la fine del brano riparte dall'inizio", () => {
    const { project } = fixture()
    const bar = stepsPerBar(project.timeSignature)
    expect(defaultLoopRange(project, null, 6 * bar)).toEqual({ start: 0, end: 4 })
    expect(defaultLoopRange(project, null, 500 * bar)).toEqual({ start: 0, end: 4 })
  })
  it('con un id di blocco inesistente ricade sulla battuta di partenza', () => {
    const { project } = fixture()
    expect(defaultLoopRange(project, 'non-esiste', 0)).toEqual({ start: 0, end: 4 })
  })
  it('con un blocco il cui pattern manca ricade sulla battuta di partenza', () => {
    const { project, clipId } = fixture()
    const broken: Project = { ...project, patterns: [] }
    expect(defaultLoopRange(broken, clipId, 0)).toEqual({ start: 0, end: 4 })
  })
  it('in un brano vuoto ripete una sola battuta', () => {
    expect(defaultLoopRange(createEmptyProject(), null, 0)).toEqual({ start: 0, end: 1 })
  })
})

describe('activeLoop', () => {
  it('in modalità brano con una parte usa la parte (pulita)', () => {
    const { project } = fixture()
    expect(activeLoop(project, { mode: 'song' }, { start: 1, end: 3 })).toEqual({ start: 1, end: 3 })
    expect(activeLoop(project, { mode: 'song' }, { start: 2, end: 2 })).toEqual({ start: 2, end: 3 })
  })
  it('in modalità brano senza parte gira su tutto il brano', () => {
    const { project } = fixture()
    expect(activeLoop(project, { mode: 'song' }, null)).toEqual({ start: 0, end: 6 })
  })
  it('in modalità pattern ignora la parte e usa la lunghezza del pattern', () => {
    const { project, patternId } = fixture()
    expect(activeLoop(project, { mode: 'pattern', patternId }, { start: 1, end: 3 })).toEqual({ start: 0, end: 2 })
  })
  it('in modalità pattern con pattern inesistente gira su una battuta', () => {
    const { project } = fixture()
    expect(activeLoop(project, { mode: 'pattern', patternId: 'x' }, null)).toEqual({ start: 0, end: 1 })
  })
})
