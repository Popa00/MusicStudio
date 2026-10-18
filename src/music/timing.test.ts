import { describe, expect, it } from 'vitest'
import { BPM_MAX, BPM_MIN, clampBpm, DEFAULT_BPM, stepAtTicks, stepsPerBar, stepsPerBeat } from './timing'

describe('stepsPerBeat / stepsPerBar', () => {
  it('in 4/4 ci sono 4 step per battito e 16 per battuta', () => {
    const ts = { beatsPerBar: 4, beatUnit: 4 } as const
    expect(stepsPerBeat(ts)).toBe(4)
    expect(stepsPerBar(ts)).toBe(16)
  })
  it('in 3/4 ci sono 12 step per battuta', () => {
    const ts = { beatsPerBar: 3, beatUnit: 4 } as const
    expect(stepsPerBeat(ts)).toBe(4)
    expect(stepsPerBar(ts)).toBe(12)
  })
  it('in 6/8 ci sono 2 step per battito e 12 per battuta', () => {
    const ts = { beatsPerBar: 6, beatUnit: 8 } as const
    expect(stepsPerBeat(ts)).toBe(2)
    expect(stepsPerBar(ts)).toBe(12)
  })
  it('con zero battiti per battuta restituisce 0 step', () => {
    expect(stepsPerBar({ beatsPerBar: 0, beatUnit: 4 })).toBe(0)
  })
})

describe('clampBpm', () => {
  it('lascia invariati i valori validi', () => {
    expect(clampBpm(120)).toBe(120)
  })
  it('accetta esattamente i bordi', () => {
    expect(clampBpm(BPM_MIN)).toBe(BPM_MIN)
    expect(clampBpm(BPM_MAX)).toBe(BPM_MAX)
  })
  it('limita i valori fuori range', () => {
    expect(clampBpm(BPM_MIN - 1)).toBe(BPM_MIN)
    expect(clampBpm(BPM_MAX + 1)).toBe(BPM_MAX)
    expect(clampBpm(0)).toBe(BPM_MIN)
    expect(clampBpm(-50)).toBe(BPM_MIN)
  })
  it("arrotonda i decimali all'intero più vicino", () => {
    expect(clampBpm(120.4)).toBe(120)
    expect(clampBpm(120.5)).toBe(121)
    expect(clampBpm(BPM_MAX + 0.4)).toBe(BPM_MAX)
  })
  it('usa il valore predefinito per NaN e Infinity', () => {
    expect(clampBpm(NaN)).toBe(DEFAULT_BPM)
    expect(clampBpm(Infinity)).toBe(DEFAULT_BPM)
    expect(clampBpm(-Infinity)).toBe(DEFAULT_BPM)
  })
})

describe('stepAtTicks (PPQ 192, 48 tick per step)', () => {
  it('tick 0 è lo step 0', () => {
    expect(stepAtTicks(0, 192, 16)).toBe(0)
  })
  it('converte tick esatti in step', () => {
    expect(stepAtTicks(48, 192, 16)).toBe(1)
    expect(stepAtTicks(192, 192, 16)).toBe(4)
    expect(stepAtTicks(48 * 15, 192, 16)).toBe(15)
  })
  it('torna a 0 alla fine della battuta', () => {
    expect(stepAtTicks(48 * 16, 192, 16)).toBe(0)
    expect(stepAtTicks(48 * 17, 192, 16)).toBe(1)
  })
  it('rispetta battute da 12 step (3/4)', () => {
    expect(stepAtTicks(48 * 12, 192, 12)).toBe(0)
    expect(stepAtTicks(48 * 11, 192, 12)).toBe(11)
  })
  it('arrotonda al più vicino: 23 tick sono step 0, 24 sono step 1', () => {
    expect(stepAtTicks(23, 192, 16)).toBe(0)
    expect(stepAtTicks(24, 192, 16)).toBe(1)
  })
  it("l'arrotondamento dell'ultimo step fa il wrap a 0", () => {
    expect(stepAtTicks(48 * 15 + 30, 192, 16)).toBe(0)
  })
  it('scala con un PPQ diverso', () => {
    expect(stepAtTicks(120, 480, 16)).toBe(1)
  })
})
