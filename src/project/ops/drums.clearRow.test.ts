import { describe, expect, it } from 'vitest'
import { createEmptyProject } from '../factory'
import type { Project } from '../types'
import { clearDrumRow, toggleDrumStep } from './drums'
import { findPattern, patternsOfTrack } from './helpers'
import { addTrack } from './tracks'

function setup() {
  const t = addTrack(createEmptyProject(), 'drums')
  const patternId = patternsOfTrack(t.project, t.trackId ?? '')[0].id
  return { project: t.project, patternId }
}
const stepsOf = (p: Project, id: string) => {
  const pat = findPattern(p, id)
  if (pat?.kind !== 'drums') throw new Error('atteso pattern di batteria')
  return pat.steps
}

describe('clearDrumRow', () => {
  it('spegne tutti i colpi di una riga e lascia le altre intatte', () => {
    const { project, patternId } = setup()
    let p = toggleDrumStep(project, patternId, 'conga', 0)
    p = toggleDrumStep(p, patternId, 'conga', 5)
    p = toggleDrumStep(p, patternId, 'kick', 3)
    const s = stepsOf(clearDrumRow(p, patternId, 'conga'), patternId)
    expect(s.conga.every((v) => v === 0)).toBe(true)
    expect(s.conga).toHaveLength(stepsOf(p, patternId).conga.length)
    expect(s.kick[3]).toBeGreaterThan(0)
  })
  it('su una riga già vuota restituisce lo stesso progetto', () => {
    const { project, patternId } = setup()
    expect(clearDrumRow(project, patternId, 'perc')).toBe(project)
  })
  it('con un pattern inesistente non cambia nulla', () => {
    const { project } = setup()
    expect(clearDrumRow(project, 'manca', 'perc')).toBe(project)
  })
  it('non muta il progetto di partenza', () => {
    const { project, patternId } = setup()
    const p = toggleDrumStep(project, patternId, 'bongo', 1)
    const copy = structuredClone(p)
    clearDrumRow(p, patternId, 'bongo')
    expect(p).toEqual(copy)
  })
})
