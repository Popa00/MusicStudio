import { beforeEach, describe, expect, it } from 'vitest'
import { createBasicBeat } from '../music/basicBeat'
import { BPM_MAX, BPM_MIN, DEFAULT_BPM } from '../music/timing'
import { useProjectStore } from './projectStore'

const initial = useProjectStore.getState()
beforeEach(() => useProjectStore.setState(initial, true))

describe('projectStore', () => {
  it('parte con BPM predefinito, 4/4 e il ritmo base', () => {
    const s = useProjectStore.getState()
    expect(s.bpm).toBe(DEFAULT_BPM)
    expect(s.timeSignature).toEqual({ beatsPerBar: 4, beatUnit: 4 })
    expect(s.drumPattern).toEqual(createBasicBeat(16))
  })
  it('setBpm imposta il valore', () => {
    useProjectStore.getState().setBpm(90)
    expect(useProjectStore.getState().bpm).toBe(90)
  })
  it('setBpm limita ai bordi e gestisce NaN/Infinity/decimali', () => {
    const { setBpm } = useProjectStore.getState()
    setBpm(1000)
    expect(useProjectStore.getState().bpm).toBe(BPM_MAX)
    setBpm(-5)
    expect(useProjectStore.getState().bpm).toBe(BPM_MIN)
    setBpm(NaN)
    expect(useProjectStore.getState().bpm).toBe(DEFAULT_BPM)
    setBpm(100.6)
    expect(useProjectStore.getState().bpm).toBe(101)
  })
  it('toggleDrumStep cambia lo step senza mutare il vecchio pattern', () => {
    const before = useProjectStore.getState().drumPattern
    const wasOn = before.snare[2]
    useProjectStore.getState().toggleDrumStep('snare', 2)
    const after = useProjectStore.getState().drumPattern
    expect(after.snare[2]).toBe(!wasOn)
    expect(before.snare[2]).toBe(wasOn)
    expect(after).not.toBe(before)
  })
  it('toggleDrumStep con step non valido non cambia il pattern', () => {
    const before = useProjectStore.getState().drumPattern
    useProjectStore.getState().toggleDrumStep('kick', 99)
    expect(useProjectStore.getState().drumPattern).toBe(before)
  })
  it('clearDrumPattern svuota tutti i suoni mantenendo 16 step', () => {
    useProjectStore.getState().clearDrumPattern()
    const p = useProjectStore.getState().drumPattern
    for (const row of Object.values(p)) {
      expect(row).toHaveLength(16)
      expect(row.some(Boolean)).toBe(false)
    }
  })
  it('clearDrumPattern usa la lunghezza della battuta corrente (3/4)', () => {
    useProjectStore.setState({ timeSignature: { beatsPerBar: 3, beatUnit: 4 } })
    useProjectStore.getState().clearDrumPattern()
    expect(useProjectStore.getState().drumPattern.kick).toHaveLength(12)
  })
})
