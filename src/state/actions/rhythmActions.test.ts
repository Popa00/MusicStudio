import { beforeEach, describe, expect, it } from 'vitest'
import { createEmptyProject } from '../../project/factory'
import { findPattern, patternsOfTrack } from '../../project/ops/helpers'
import { addTrack } from '../../project/ops/tracks'
import { findGenre } from '../../project/rhythms/genres'
import { emptyHistory } from '../history'
import { useProjectStore } from '../projectStore'
import { applyGenreRhythm, applyGenreTempo } from './rhythmActions'

const initial = useProjectStore.getState()
const s = () => useProjectStore.getState()
let drumId = ''
const kicks = () => {
  const p = findPattern(s().project, drumId)
  return p?.kind === 'drums' ? p.steps.kick.flatMap((v, i) => (v > 0 ? [i] : [])) : []
}

beforeEach(() => {
  const t = addTrack(createEmptyProject(), 'drums')
  drumId = patternsOfTrack(t.project, t.trackId ?? '')[0].id
  useProjectStore.setState({ ...initial, project: t.project, history: emptyHistory() }, true)
})

describe('applyGenreRhythm', () => {
  it('mette il ritmo del genere e della variante scelta', () => {
    applyGenreRhythm(drumId, 'house', 'Base')
    expect(kicks()).toEqual([0, 4, 8, 12])
  })
  it('è un solo passo di annulla', () => {
    applyGenreRhythm(drumId, 'house', 'Base')
    expect(s().history.past).toHaveLength(1)
    s().undo()
    expect(kicks()).toEqual([])
  })
  it('le due varianti producono ritmi diversi', () => {
    applyGenreRhythm(drumId, 'pop', 'Base')
    const base = kicks()
    applyGenreRhythm(drumId, 'pop', 'Ricco')
    expect(kicks()).not.toEqual(base)
  })
  it('genere o variante sconosciuti non cambiano nulla', () => {
    applyGenreRhythm(drumId, 'xyz', 'Base')
    applyGenreRhythm(drumId, 'pop', 'Altro' as 'Base')
    expect(s().history.past).toHaveLength(0)
    expect(kicks()).toEqual([])
  })
  it('non cambia il BPM', () => {
    const bpm = s().project.bpm
    applyGenreRhythm(drumId, 'techno', 'Ricco')
    expect(s().project.bpm).toBe(bpm)
  })
})

describe('applyGenreTempo', () => {
  it('imposta il BPM tipico del genere', () => {
    applyGenreTempo('techno')
    expect(s().project.bpm).toBe(findGenre('techno')?.bpm)
  })
  it('con un genere sconosciuto non cambia nulla', () => {
    const bpm = s().project.bpm
    applyGenreTempo('xyz')
    expect(s().project.bpm).toBe(bpm)
    expect(s().history.past).toHaveLength(0)
  })
  it('si annulla', () => {
    const bpm = s().project.bpm
    applyGenreTempo('trap')
    s().undo()
    expect(s().project.bpm).toBe(bpm)
  })
})
