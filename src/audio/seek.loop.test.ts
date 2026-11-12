import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  target: { mode: 'song' } as { mode: 'song' } | { mode: 'pattern'; patternId: string },
  bars: 8,
}))

vi.mock('./transport', () => ({ seekTransport: vi.fn() }))
vi.mock('../state/playTarget', () => ({ currentPlayTarget: () => mocks.target }))
vi.mock('../music/schedule', () => ({ loopLengthBars: () => mocks.bars }))

import { stepsPerBar } from '../music/timing'
import { usePlaybackStore } from '../state/playbackStore'
import { useProjectStore } from '../state/projectStore'
import { playbackStartStep } from './seek'

const initial = usePlaybackStore.getState()
const bar = () => stepsPerBar(useProjectStore.getState().project.timeSignature)

beforeEach(() => {
  usePlaybackStore.setState(initial, true)
  mocks.target = { mode: 'song' }
  mocks.bars = 8
})

describe('playbackStartStep con "Ripeti parte"', () => {
  it('parte dallo step scelto se è dentro la parte', () => {
    const s = usePlaybackStore.getState()
    s.setLoopRange({ start: 2, end: 4 })
    s.setLoopOn(true)
    s.setStartStep(2 * bar() + 3)
    expect(playbackStartStep()).toBe(2 * bar() + 3)
  })
  it('parte dall\'inizio della parte se lo step scelto è prima', () => {
    const s = usePlaybackStore.getState()
    s.setLoopRange({ start: 2, end: 4 })
    s.setLoopOn(true)
    s.setStartStep(bar())
    expect(playbackStartStep()).toBe(2 * bar())
  })
  it('parte dall\'inizio della parte se lo step scelto è dopo', () => {
    const s = usePlaybackStore.getState()
    s.setLoopRange({ start: 2, end: 4 })
    s.setLoopOn(true)
    s.setStartStep(6 * bar())
    expect(playbackStartStep()).toBe(2 * bar())
  })
  it('la fine della parte è esclusa, l\'inizio è incluso', () => {
    const s = usePlaybackStore.getState()
    s.setLoopRange({ start: 2, end: 4 })
    s.setLoopOn(true)
    s.setStartStep(4 * bar())
    expect(playbackStartStep()).toBe(2 * bar())
    s.setStartStep(2 * bar())
    expect(playbackStartStep()).toBe(2 * bar())
    s.setStartStep(4 * bar() - 1)
    expect(playbackStartStep()).toBe(4 * bar() - 1)
  })
  it('con la parte ricordata ma spenta si comporta come senza loop', () => {
    const s = usePlaybackStore.getState()
    s.setLoopRange({ start: 2, end: 4 })
    s.setStartStep(6 * bar())
    expect(playbackStartStep()).toBe(6 * bar())
  })
  it('in modalità pattern ignora la parte e parte da 0', () => {
    mocks.target = { mode: 'pattern', patternId: 'p' }
    const s = usePlaybackStore.getState()
    s.setLoopRange({ start: 2, end: 4 })
    s.setLoopOn(true)
    s.setStartStep(3 * bar())
    expect(playbackStartStep()).toBe(0)
  })
})
