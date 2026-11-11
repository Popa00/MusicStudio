import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  seekTransport: vi.fn(),
  target: { mode: 'song' } as { mode: 'song' } | { mode: 'pattern'; patternId: string },
  bars: 4,
}))

vi.mock('./transport', () => ({ seekTransport: mocks.seekTransport }))
vi.mock('../state/playTarget', () => ({ currentPlayTarget: () => mocks.target }))
vi.mock('../music/schedule', () => ({ loopLengthBars: () => mocks.bars }))

import { usePlaybackStore } from '../state/playbackStore'
import { useProjectStore } from '../state/projectStore'
import { bindSeek, playbackStartStep } from './seek'
import { stepsPerBar } from '../music/timing'
import type { AudioGraph } from './graph/graph'

const initial = usePlaybackStore.getState()
const total = () => mocks.bars * stepsPerBar(useProjectStore.getState().project.timeSignature)

beforeEach(() => {
  usePlaybackStore.setState(initial, true)
  mocks.seekTransport.mockReset()
  mocks.target = { mode: 'song' }
  mocks.bars = 4
})

describe('playbackStartStep', () => {
  it('in modalità brano restituisce lo step scelto', () => {
    usePlaybackStore.getState().setStartStep(10)
    expect(playbackStartStep()).toBe(10)
  })
  it('in modalità pattern parte sempre da 0', () => {
    mocks.target = { mode: 'pattern', patternId: 'p' }
    usePlaybackStore.getState().setStartStep(10)
    expect(playbackStartStep()).toBe(0)
  })
  it('se lo step scelto è oltre la fine del brano riparte da 0', () => {
    usePlaybackStore.getState().setStartStep(total() + 5)
    expect(playbackStartStep()).toBe(0)
  })
  it('esattamente sulla fine del brano riparte da 0, un attimo prima resta', () => {
    usePlaybackStore.getState().setStartStep(total())
    expect(playbackStartStep()).toBe(0)
    usePlaybackStore.getState().setStartStep(total() - 1)
    expect(playbackStartStep()).toBe(total() - 1)
  })
})

describe('bindSeek', () => {
  function setup() {
    const releaseAll = vi.fn()
    const graph = { track: vi.fn(() => ({ instrument: { releaseAll } })) } as unknown as AudioGraph
    const unbind = bindSeek(graph)
    return { releaseAll, graph, unbind }
  }

  it('mentre suona, seekTo rilascia le note, sposta il trasporto e aggiorna currentStep', () => {
    const { releaseAll, unbind } = setup()
    const n = useProjectStore.getState().project.tracks.length
    usePlaybackStore.getState().setPlaying(true)
    usePlaybackStore.getState().seekTo(8)
    expect(releaseAll).toHaveBeenCalledTimes(n)
    expect(mocks.seekTransport).toHaveBeenCalledWith(8)
    expect(usePlaybackStore.getState().currentStep).toBe(8)
    unbind()
  })
  it('con la musica ferma non fa nulla', () => {
    const { releaseAll, unbind } = setup()
    usePlaybackStore.getState().seekTo(8)
    expect(releaseAll).not.toHaveBeenCalled()
    expect(mocks.seekTransport).not.toHaveBeenCalled()
    expect(usePlaybackStore.getState().currentStep).toBeNull()
    unbind()
  })
  it('cambiare altro stato mentre suona non sposta il trasporto', () => {
    const { unbind } = setup()
    usePlaybackStore.getState().setPlaying(true)
    usePlaybackStore.getState().setCurrentStep(3)
    expect(mocks.seekTransport).not.toHaveBeenCalled()
    unbind()
  })
  it('con seekTo oltre la fine salta all\'inizio', () => {
    const { unbind } = setup()
    usePlaybackStore.getState().setPlaying(true)
    usePlaybackStore.getState().seekTo(total() + 1)
    expect(mocks.seekTransport).toHaveBeenCalledWith(0)
    expect(usePlaybackStore.getState().currentStep).toBe(0)
    unbind()
  })
  it('dopo unbind non reagisce più', () => {
    const { unbind } = setup()
    unbind()
    usePlaybackStore.getState().setPlaying(true)
    usePlaybackStore.getState().seekTo(8)
    expect(mocks.seekTransport).not.toHaveBeenCalled()
  })
  it('cliccare di nuovo sullo stesso punto mentre suona salta di nuovo lì', () => {
    const { unbind } = setup()
    usePlaybackStore.getState().setPlaying(true)
    usePlaybackStore.getState().seekTo(8)
    usePlaybackStore.getState().setCurrentStep(20)
    usePlaybackStore.getState().seekTo(8)
    expect(mocks.seekTransport).toHaveBeenCalledTimes(2)
    expect(usePlaybackStore.getState().currentStep).toBe(8)
    unbind()
  })
  it('setStartStep sceglie il punto ma non fa saltare la musica', () => {
    const { unbind } = setup()
    usePlaybackStore.getState().setPlaying(true)
    usePlaybackStore.getState().setStartStep(8)
    expect(mocks.seekTransport).not.toHaveBeenCalled()
    unbind()
  })
})
