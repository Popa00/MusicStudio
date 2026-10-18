import { beforeEach, describe, expect, it } from 'vitest'
import { usePlaybackStore } from './playbackStore'

const initial = usePlaybackStore.getState()
beforeEach(() => usePlaybackStore.setState(initial, true))

describe('playbackStore', () => {
  it('parte fermo e senza step corrente', () => {
    const s = usePlaybackStore.getState()
    expect(s.isPlaying).toBe(false)
    expect(s.currentStep).toBeNull()
  })
  it('setPlaying avvia e ferma', () => {
    usePlaybackStore.getState().setPlaying(true)
    expect(usePlaybackStore.getState().isPlaying).toBe(true)
    usePlaybackStore.getState().setPlaying(false)
    expect(usePlaybackStore.getState().isPlaying).toBe(false)
  })
  it('setCurrentStep imposta lo step, incluso 0, e lo azzera con null', () => {
    const { setCurrentStep } = usePlaybackStore.getState()
    setCurrentStep(0)
    expect(usePlaybackStore.getState().currentStep).toBe(0)
    setCurrentStep(5)
    expect(usePlaybackStore.getState().currentStep).toBe(5)
    setCurrentStep(null)
    expect(usePlaybackStore.getState().currentStep).toBeNull()
  })
  it('setPlaying non tocca currentStep', () => {
    usePlaybackStore.getState().setCurrentStep(3)
    usePlaybackStore.getState().setPlaying(true)
    expect(usePlaybackStore.getState().currentStep).toBe(3)
  })
})
