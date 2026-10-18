import { describe, expect, it } from 'vitest'
import { isInScale, SCALE_TYPES } from './scales'

const OCTAVE = Array.from({ length: 12 }, (_, i) => 60 + i)

describe('isInScale', () => {
  it('con "none" ogni nota è nella scala', () => {
    for (const p of [0, 61, 127]) expect(isInScale(p, 0, 'none')).toBe(true)
  })
  it('Do maggiore contiene solo i tasti bianchi', () => {
    const notes = OCTAVE.filter((p) => isInScale(p, 0, 'major'))
    expect(notes).toEqual([60, 62, 64, 65, 67, 69, 71])
  })
  it('La minore: La, Si, Do, Re, Mi, Fa, Sol (niente Sol#)', () => {
    expect(isInScale(69, 9, 'minor')).toBe(true)
    expect(isInScale(72, 9, 'minor')).toBe(true)
    expect(isInScale(67, 9, 'minor')).toBe(true)
    expect(isInScale(68, 9, 'minor')).toBe(false)
  })
  it('pentatonica maggiore di Do esclude Fa e Si', () => {
    expect(isInScale(65, 0, 'pentatonicMajor')).toBe(false)
    expect(isInScale(71, 0, 'pentatonicMajor')).toBe(false)
    expect(isInScale(67, 0, 'pentatonicMajor')).toBe(true)
  })
  it('pentatonica minore di La: La Do Re Mi Sol', () => {
    const notes = OCTAVE.filter((p) => isInScale(p, 9, 'pentatonicMinor'))
    expect(notes).toEqual([60, 62, 64, 67, 69])
  })
  it('ogni scala ha il numero giusto di note per ottava, per ogni tonica', () => {
    const expected = { none: 12, major: 7, minor: 7, pentatonicMajor: 5, pentatonicMinor: 5 }
    for (const type of SCALE_TYPES) {
      for (let root = 0; root < 12; root++) {
        expect(OCTAVE.filter((p) => isInScale(p, root, type))).toHaveLength(expected[type])
      }
    }
  })
  it('la tonica è sempre nella scala, anche con note negative o in ottave diverse', () => {
    for (const type of SCALE_TYPES) {
      expect(isInScale(9 - 12, 9, type)).toBe(true)
      expect(isInScale(9 + 108, 9, type)).toBe(true)
    }
  })
})
