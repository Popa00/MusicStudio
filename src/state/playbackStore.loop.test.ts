import { beforeEach, describe, expect, it } from 'vitest'
import { createEmptyProject } from '../project/factory'
import { activeLoopRange, usePlaybackStore } from './playbackStore'
import { useProjectStore } from './projectStore'

const initial = usePlaybackStore.getState()
beforeEach(() => usePlaybackStore.setState(initial, true))

describe('playbackStore: ripeti parte', () => {
  it('parte con la ripetizione spenta e nessuna parte', () => {
    const s = usePlaybackStore.getState()
    expect(s.loopOn).toBe(false)
    expect(s.loopRange).toBeNull()
  })
  it('setLoopOn accende e spegne senza toccare la parte', () => {
    const s = usePlaybackStore.getState()
    s.setLoopRange({ start: 1, end: 3 })
    s.setLoopOn(true)
    expect(usePlaybackStore.getState().loopOn).toBe(true)
    s.setLoopOn(false)
    expect(usePlaybackStore.getState().loopRange).toEqual({ start: 1, end: 3 })
  })
  it('setLoopRange pulisce la parte', () => {
    usePlaybackStore.getState().setLoopRange({ start: -2, end: NaN })
    expect(usePlaybackStore.getState().loopRange).toEqual({ start: 0, end: 1 })
    usePlaybackStore.getState().setLoopRange({ start: 3, end: 3 })
    expect(usePlaybackStore.getState().loopRange).toEqual({ start: 3, end: 4 })
  })
  it('activeLoopRange restituisce la parte solo se la ripetizione è accesa', () => {
    usePlaybackStore.getState().setLoopRange({ start: 1, end: 3 })
    expect(activeLoopRange(usePlaybackStore.getState())).toBeNull()
    usePlaybackStore.getState().setLoopOn(true)
    expect(activeLoopRange(usePlaybackStore.getState())).toEqual({ start: 1, end: 3 })
  })
  it('activeLoopRange è null se accesa ma senza parte', () => {
    usePlaybackStore.getState().setLoopOn(true)
    expect(activeLoopRange(usePlaybackStore.getState())).toBeNull()
  })
  it('resetPosition azzera punto di partenza, ripetizione e parte', () => {
    const s = usePlaybackStore.getState()
    s.setStartStep(40)
    s.setLoopRange({ start: 1, end: 3 })
    s.setLoopOn(true)
    usePlaybackStore.getState().resetPosition()
    const after = usePlaybackStore.getState()
    expect(after.startStep).toBe(0)
    expect(after.loopOn).toBe(false)
    expect(after.loopRange).toBeNull()
  })
  it('projectStore.replace azzera loop e punto di partenza', () => {
    const s = usePlaybackStore.getState()
    s.setStartStep(40)
    s.setLoopRange({ start: 1, end: 3 })
    s.setLoopOn(true)
    useProjectStore.getState().replace(createEmptyProject())
    const after = usePlaybackStore.getState()
    expect(after.startStep).toBe(0)
    expect(after.loopOn).toBe(false)
    expect(after.loopRange).toBeNull()
  })
})
