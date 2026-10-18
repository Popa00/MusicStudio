import { describe, expect, it } from 'vitest'
import { logToPosition, positionToLog, RESOLUTION, roundSignificant } from './sliderScale'

describe('logToPosition / positionToLog', () => {
  it('il minimo è la posizione 0, il massimo la fine del cursore', () => {
    expect(logToPosition(20, 20, 20000)).toBe(0)
    expect(logToPosition(20000, 20, 20000)).toBe(RESOLUTION)
  })
  it('la media geometrica sta a metà cursore (scala logaritmica)', () => {
    expect(logToPosition(Math.sqrt(20 * 20000), 20, 20000)).toBe(RESOLUTION / 2)
    expect(positionToLog(RESOLUTION / 2, 20, 20000)).toBeCloseTo(Math.sqrt(20 * 20000), 6)
  })
  it('valori fuori range vanno ai bordi', () => {
    expect(logToPosition(1, 20, 20000)).toBe(0)
    expect(logToPosition(1e9, 20, 20000)).toBe(RESOLUTION)
  })
  it('posizione → valore → posizione torna alla stessa posizione', () => {
    for (const pos of [0, 1, 250, 777, RESOLUTION]) {
      expect(logToPosition(positionToLog(pos, 50, 18000), 50, 18000)).toBe(pos)
    }
  })
  it('positionToLog ai bordi restituisce minimo e massimo', () => {
    expect(positionToLog(0, 0.001, 4)).toBeCloseTo(0.001, 9)
    expect(positionToLog(RESOLUTION, 0.001, 4)).toBeCloseTo(4, 9)
  })
})

describe('roundSignificant', () => {
  it('arrotonda a 3 cifre significative', () => {
    expect(roundSignificant(1234.5)).toBe(1230)
    expect(roundSignificant(0.012345)).toBeCloseTo(0.0123, 10)
    expect(roundSignificant(999.6)).toBe(1000)
    expect(roundSignificant(-1234.5)).toBe(-1230)
  })
  it('rispetta il numero di cifre richiesto', () => {
    expect(roundSignificant(1234, 2)).toBe(1200)
  })
  it('0 resta 0', () => {
    expect(roundSignificant(0)).toBe(0)
  })
})
