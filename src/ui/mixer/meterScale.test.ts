import { describe, expect, it } from 'vitest'
import { meterFraction } from './meterScale'

describe('meterFraction', () => {
  it('0 dB riempie la barra, -30 dB la riempie a metà', () => {
    expect(meterFraction(0)).toBe(1)
    expect(meterFraction(-30)).toBeCloseTo(0.5)
  })
  it('da -60 dB in giù la barra è vuota', () => {
    expect(meterFraction(-60)).toBe(0)
    expect(meterFraction(-90)).toBe(0)
    expect(meterFraction(-Infinity)).toBe(0)
  })
  it('sopra 0 dB la barra non supera il pieno', () => {
    expect(meterFraction(6)).toBe(1)
    expect(meterFraction(Infinity)).toBe(0)
  })
  it('NaN dà una barra vuota', () => {
    expect(meterFraction(NaN)).toBe(0)
  })
})
