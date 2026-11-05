import { describe, expect, it } from 'vitest'
import { BPM, DECIBELS, HERTZ, PAN, PERCENT, PLAIN, SECONDS, readNumber } from './valueUnits'

describe('readNumber', () => {
  it('restituisce null per stringa vuota o solo spazi', () => {
    expect(readNumber('')).toBeNull()
    expect(readNumber('   ')).toBeNull()
  })
  it('restituisce null se non ci sono cifre', () => {
    expect(readNumber('abc')).toBeNull()
    expect(readNumber('-∞')).toBeNull()
    expect(readNumber('-')).toBeNull()
  })
  it('accetta la virgola italiana e il punto', () => {
    expect(readNumber('2,5')).toBe(2.5)
    expect(readNumber('2.5')).toBe(2.5)
    expect(readNumber(',5')).toBe(0.5)
  })
  it('legge numeri negativi, con segno più e con unità attaccata', () => {
    expect(readNumber('-12')).toBe(-12)
    expect(readNumber('+3')).toBe(3)
    expect(readNumber('440hz')).toBe(440)
  })
  it('legge lo zero', () => {
    expect(readNumber('0')).toBe(0)
  })
})

describe('unità semplici', () => {
  it('PLAIN e BPM leggono il numero e rifiutano il testo', () => {
    expect(PLAIN.parse('1,5', 0)).toBe(1.5)
    expect(BPM.parse('120 bpm', 100)).toBe(120)
    expect(BPM.parse('', 100)).toBeNull()
    expect(BPM.parse('abc', 100)).toBeNull()
  })
  it('PERCENT: "65" e "65%" valgono entrambi 0.65', () => {
    expect(PERCENT.parse('65', 0.5)).toBeCloseTo(0.65)
    expect(PERCENT.parse('65%', 0.5)).toBeCloseTo(0.65)
    expect(PERCENT.parse('0', 0.5)).toBe(0)
    expect(PERCENT.parse('', 0.5)).toBeNull()
    expect(PERCENT.parse('abc', 0.5)).toBeNull()
  })
  it('DECIBELS: "-∞" e "inf" danno -Infinity, i numeri restano in dB', () => {
    expect(DECIBELS.parse('-∞', 0)).toBe(-Infinity)
    expect(DECIBELS.parse('-inf', 0)).toBe(-Infinity)
    expect(DECIBELS.parse('-6,5 dB', 0)).toBe(-6.5)
    expect(DECIBELS.parse('', 0)).toBeNull()
    expect(DECIBELS.parse('abc', 0)).toBeNull()
  })
})

describe('SECONDS', () => {
  it('"700 ms" con valore attuale 2.5 vale 0.7 s', () => {
    expect(SECONDS.parse('700 ms', 2.5)).toBeCloseTo(0.7)
  })
  it('"3" con valore attuale 0.5 è letto come 3 ms', () => {
    expect(SECONDS.parse('3', 0.5)).toBeCloseTo(0.003)
  })
  it('"3" con valore attuale >= 1 è letto in secondi', () => {
    expect(SECONDS.parse('3', 2.5)).toBe(3)
    expect(SECONDS.parse('3', 1)).toBe(3)
  })
  it('"1.5 s" resta 1.5 secondi anche se il valore attuale è sotto 1', () => {
    expect(SECONDS.parse('1.5 s', 0.5)).toBe(1.5)
    expect(SECONDS.parse('1,5 sec', 0.5)).toBe(1.5)
  })
  it('accetta zero e rifiuta vuoto o testo', () => {
    expect(SECONDS.parse('0', 0.5)).toBe(0)
    expect(SECONDS.parse('', 0.5)).toBeNull()
    expect(SECONDS.parse('abc', 0.5)).toBeNull()
  })
})

describe('HERTZ', () => {
  it('"2,5 khz" vale 2500 Hz', () => {
    expect(HERTZ.parse('2,5 khz', 440)).toBe(2500)
    expect(HERTZ.parse('2,5 kHz', 440)).toBe(2500)
  })
  it('"440 hz" resta 440 anche se il valore attuale è in kHz', () => {
    expect(HERTZ.parse('440 hz', 5000)).toBe(440)
  })
  it('senza unità segue quella mostrata (kHz se attuale >= 1000)', () => {
    expect(HERTZ.parse('2', 5000)).toBe(2000)
    expect(HERTZ.parse('2', 999)).toBe(2)
    expect(HERTZ.parse('2', 1000)).toBe(2000)
  })
  it('rifiuta vuoto e testo', () => {
    expect(HERTZ.parse('', 440)).toBeNull()
    expect(HERTZ.parse('abc', 440)).toBeNull()
  })
})

describe('PAN', () => {
  it('"centro" e "c" valgono 0', () => {
    expect(PAN.parse('centro', 0.5)).toBe(0)
    expect(PAN.parse('Centro', -0.5)).toBe(0)
  })
  it('"50 dx" vale +0.5 e "30 sx" vale -0.3', () => {
    expect(PAN.parse('50 dx', 0)).toBeCloseTo(0.5)
    expect(PAN.parse('30 sx', 0)).toBeCloseTo(-0.3)
  })
  it('"-20" senza unità vale -0.2 (sinistra)', () => {
    expect(PAN.parse('-20', 0)).toBeCloseTo(-0.2)
    expect(PAN.parse('20', 0)).toBeCloseTo(0.2)
  })
  it('rifiuta vuoto e testo', () => {
    expect(PAN.parse('', 0)).toBeNull()
    expect(PAN.parse('abc', 0)).toBeNull()
  })
})
