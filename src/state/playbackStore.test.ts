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
  it('startStep parte da 0', () => {
    expect(usePlaybackStore.getState().startStep).toBe(0)
  })
  it('setStartStep arrotonda al più vicino', () => {
    usePlaybackStore.getState().setStartStep(4.4)
    expect(usePlaybackStore.getState().startStep).toBe(4)
    usePlaybackStore.getState().setStartStep(4.6)
    expect(usePlaybackStore.getState().startStep).toBe(5)
  })
  it('seekTo sceglie il punto e conta ogni richiesta, anche sullo stesso punto', () => {
    const before = usePlaybackStore.getState().seekRequest
    usePlaybackStore.getState().seekTo(8.4)
    usePlaybackStore.getState().seekTo(8)
    expect(usePlaybackStore.getState().startStep).toBe(8)
    expect(usePlaybackStore.getState().seekRequest).toBe(before + 2)
  })
  it('setStartStep non scende mai sotto 0', () => {
    usePlaybackStore.getState().setStartStep(-7)
    expect(usePlaybackStore.getState().startStep).toBe(0)
  })
  it('setStartStep con valori non finiti torna a 0', () => {
    for (const v of [NaN, Infinity, -Infinity]) {
      usePlaybackStore.getState().setStartStep(12)
      usePlaybackStore.getState().setStartStep(v)
      expect(usePlaybackStore.getState().startStep).toBe(0)
    }
  })
})
