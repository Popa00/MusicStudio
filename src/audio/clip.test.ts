import { describe, expect, it } from 'vitest'
import { dbToAmplitude, hardClip } from './clip'

describe('dbToAmplitude', () => {
  it('converte 0 dB in ampiezza 1', () => {
    expect(dbToAmplitude(0)).toBe(1)
  })

  it('converte -6 dB in circa metà ampiezza', () => {
    expect(dbToAmplitude(-6)).toBeCloseTo(0.501, 3)
  })
})

describe('hardClip', () => {
  const ceiling = dbToAmplitude(-1)

  it('lascia invariati i campioni sotto la soglia', () => {
    expect(hardClip(0.5, ceiling)).toBe(0.5)
    expect(hardClip(-0.5, ceiling)).toBe(-0.5)
  })

  it('taglia i picchi positivi e negativi alla soglia', () => {
    expect(hardClip(1, ceiling)).toBe(ceiling)
    expect(hardClip(-4, ceiling)).toBe(-ceiling)
  })

  it('non supera mai la soglia su tutta la curva del WaveShaper', () => {
    for (let x = -1; x <= 1; x += 0.001) {
      expect(Math.abs(hardClip(x, ceiling))).toBeLessThanOrEqual(ceiling)
    }
  })
})
