import { describe, expect, it } from 'vitest'
import { isBlackKey, noteName, pitchClassName } from './notes'

describe('noteName', () => {
  it('60 è il Do centrale: "Do4 (C4)"', () => {
    expect(noteName(60)).toBe('Do4 (C4)')
  })
  it('69 è il La4 a 440 Hz', () => {
    expect(noteName(69)).toBe('La4 (A4)')
  })
  it('include i diesis', () => {
    expect(noteName(61)).toBe('Do#4 (C#4)')
  })
  it('gestisce i bordi della tastiera MIDI (0 e 127)', () => {
    expect(noteName(0)).toBe('Do-1 (C-1)')
    expect(noteName(127)).toBe('Sol9 (G9)')
  })
  it("il Si prima del Do cambia ottava correttamente", () => {
    expect(noteName(59)).toBe('Si3 (B3)')
  })
})

describe('pitchClassName', () => {
  it('funziona anche con valori negativi o oltre 11', () => {
    expect(pitchClassName(0)).toBe('Do')
    expect(pitchClassName(12)).toBe('Do')
    expect(pitchClassName(-1)).toBe('Si')
  })
})

describe('isBlackKey', () => {
  it('riconosce i tasti neri di un\'ottava (Do#, Re#, Fa#, Sol#, La#)', () => {
    const black = Array.from({ length: 12 }, (_, i) => 60 + i).filter(isBlackKey)
    expect(black).toEqual([61, 63, 66, 68, 70])
  })
  it('i Do e i Mi/Si sono tasti bianchi', () => {
    expect(isBlackKey(60)).toBe(false)
    expect(isBlackKey(64)).toBe(false)
    expect(isBlackKey(71)).toBe(false)
  })
  it('funziona con valori negativi', () => {
    expect(isBlackKey(-1)).toBe(false)
    expect(isBlackKey(-2)).toBe(true)
  })
})
