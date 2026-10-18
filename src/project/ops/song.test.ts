import { describe, expect, it } from 'vitest'
import { BPM_MAX, BPM_MIN, DEFAULT_BPM } from '../../music/timing'
import { createEmptyProject } from '../factory'
import { LIMITS } from '../limits'
import { renameProject, setBpm, setMasterVolume, setScale } from './song'

const base = createEmptyProject()

describe('setBpm', () => {
  it('imposta il tempo limitandolo ai valori ammessi', () => {
    expect(setBpm(base, 128).bpm).toBe(128)
    expect(setBpm(base, 10).bpm).toBe(BPM_MIN)
    expect(setBpm(base, 999).bpm).toBe(BPM_MAX)
    expect(setBpm(base, NaN).bpm).toBe(DEFAULT_BPM)
  })
  it('non modifica il progetto originale', () => {
    setBpm(base, 90)
    expect(base.bpm).toBe(DEFAULT_BPM)
  })
})

describe('setScale', () => {
  it('imposta tonica e tipo di scala', () => {
    expect(setScale(base, 9, 'minor').scale).toEqual({ root: 9, type: 'minor' })
  })
  it('la tonica resta tra 0 (Do) e 11 (Si), intera', () => {
    expect(setScale(base, 13, 'major').scale.root).toBe(11)
    expect(setScale(base, -1, 'major').scale.root).toBe(0)
    expect(setScale(base, 4.6, 'major').scale.root).toBe(5)
    expect(setScale(base, NaN, 'major').scale.root).toBe(0)
  })
})

describe('setMasterVolume', () => {
  it('limita il volume generale tra -60 e +6 dB', () => {
    expect(setMasterVolume(base, -10).master.volumeDb).toBe(-10)
    expect(setMasterVolume(base, 20).master.volumeDb).toBe(6)
    expect(setMasterVolume(base, -100).master.volumeDb).toBe(-60)
    expect(setMasterVolume(base, Infinity).master.volumeDb).toBe(-60)
  })
})

describe('renameProject', () => {
  it('tronca il nome al limite ammesso', () => {
    expect(renameProject(base, 'Canzone').name).toBe('Canzone')
    expect(renameProject(base, 'a'.repeat(100)).name).toHaveLength(LIMITS.nameLength)
  })
})
