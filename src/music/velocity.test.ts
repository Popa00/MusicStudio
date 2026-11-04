import { describe, expect, it } from 'vitest'
import { clampVelocity, DEFAULT_DRUM_VELOCITY, DEFAULT_NOTE_VELOCITY, formatVelocity, MIN_VELOCITY } from './velocity'

describe('clampVelocity', () => {
  it("lascia invariati i valori nell'intervallo valido, estremi inclusi", () => {
    for (const v of [MIN_VELOCITY, 0.5, 0.8, 1]) expect(clampVelocity(v)).toBe(v)
  })
  it('porta a 0,1 zero e i valori negativi', () => {
    expect(clampVelocity(0)).toBe(MIN_VELOCITY)
    expect(clampVelocity(-5)).toBe(MIN_VELOCITY)
    expect(clampVelocity(-Infinity)).toBe(0.8)
  })
  it('porta a 1 i valori sopra il massimo', () => {
    expect(clampVelocity(1.0001)).toBe(1)
    expect(clampVelocity(100)).toBe(1)
  })
  it("usa l'intensità predefinita delle note (0,8) per NaN e Infinity", () => {
    expect(clampVelocity(NaN)).toBe(DEFAULT_NOTE_VELOCITY)
    expect(clampVelocity(Infinity)).toBe(0.8)
  })
})

describe('clampVelocity con fallback', () => {
  it('usa il fallback indicato per valori non finiti', () => {
    expect(clampVelocity(NaN, 0.3)).toBe(0.3)
    expect(clampVelocity(Infinity, 0.5)).toBe(0.5)
  })
  it('ignora il fallback per i valori finiti', () => {
    expect(clampVelocity(0.6, 0.3)).toBe(0.6)
    expect(clampVelocity(9, 0.3)).toBe(1)
    expect(clampVelocity(0, 0.3)).toBe(0.1)
  })
})

describe('costanti di intensità', () => {
  it('hanno i valori concordati', () => {
    expect([MIN_VELOCITY, DEFAULT_NOTE_VELOCITY, DEFAULT_DRUM_VELOCITY]).toEqual([0.1, 0.8, 0.9])
  })
})

describe('formatVelocity', () => {
  it('mostra una percentuale arrotondata', () => {
    expect(formatVelocity(0.8)).toBe('80%')
    expect(formatVelocity(1)).toBe('100%')
    expect(formatVelocity(0.1)).toBe('10%')
    expect(formatVelocity(0.556)).toBe('56%')
    expect(formatVelocity(0)).toBe('0%')
  })
})
