import { describe, expect, it } from 'vitest'
import { createEmptyProject } from '../project/factory'
import { addClip } from '../project/ops/clips'
import { setDrumStepVelocity, toggleDrumStep } from '../project/ops/drums'
import { patternsOfTrack } from '../project/ops/helpers'
import { addTrack } from '../project/ops/tracks'
import { eventsAtStep } from './schedule'

describe('eventsAtStep: intensità dei colpi di batteria', () => {
  it("ogni evento di batteria porta l'intensità della sua casella", () => {
    const d = addTrack(createEmptyProject(), 'drums')
    const trackId = d.trackId ?? ''
    const patternId = patternsOfTrack(d.project, trackId)[0].id
    let p = toggleDrumStep(d.project, patternId, 'hihatClosed', 2)
    p = toggleDrumStep(p, patternId, 'kick', 2)
    p = setDrumStepVelocity(p, patternId, 'hihatClosed', 2, 0.45)
    p = addClip(p, trackId, patternId, 0).project
    expect(eventsAtStep(p, { mode: 'pattern', patternId }, 2)).toEqual([
      { kind: 'drum', trackId, voice: 'kick', velocity: 0.9 },
      { kind: 'drum', trackId, voice: 'hihatClosed', velocity: 0.45 },
    ])
    expect(eventsAtStep(p, { mode: 'song' }, 2)).toHaveLength(2)
    expect(eventsAtStep(p, { mode: 'pattern', patternId }, 3)).toEqual([])
  })
  it('un colpo spento non genera eventi', () => {
    const d = addTrack(createEmptyProject(), 'drums')
    const patternId = patternsOfTrack(d.project, d.trackId ?? '')[0].id
    expect(eventsAtStep(d.project, { mode: 'pattern', patternId }, 0)).toEqual([])
  })
})
