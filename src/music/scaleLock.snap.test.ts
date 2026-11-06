import { describe, expect, it } from 'vitest'
import { SCALE_TYPES, scaleIntervals, type ScaleType } from './scales'
import { snapToScale, type ScaleRef } from './scaleLock'

const C_MAJOR: ScaleRef = { root: 0, type: 'major' }
const inScale = (p: number, s: ScaleRef) => scaleIntervals(s.type).includes((((p - s.root) % 12) + 12) % 12)

describe('scaleIntervals', () => {
  it('con "nessuna" restituisce tutti i 12 semitoni', () => {
    expect(scaleIntervals('none')).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
  })
  it('restituisce 7 gradi per maggiore e minore e 5 per le pentatoniche', () => {
    expect(scaleIntervals('major')).toHaveLength(7)
    expect(scaleIntervals('minor')).toHaveLength(7)
    expect(scaleIntervals('pentatonicMajor')).toEqual([0, 2, 4, 7, 9])
    expect(scaleIntervals('pentatonicMinor')).toEqual([0, 3, 5, 7, 10])
  })
})

describe('snapToScale', () => {
  it('lascia invariata una nota già nella scala', () => {
    expect(snapToScale(60, C_MAJOR)).toBe(60)
    expect(snapToScale(67, C_MAJOR)).toBe(67)
  })
  it('a pari distanza va verso il basso (Do# in Do maggiore diventa Do)', () => {
    expect(snapToScale(61, C_MAJOR)).toBe(60)
  })
  it('a pari distanza va verso il basso (Re# tra Re e Mi diventa Re)', () => {
    expect(snapToScale(63, C_MAJOR)).toBe(62)
  })
  it('sceglie la nota sopra se è strettamente più vicina (pentatonica: Fa va a Mi, Fa# va a Sol)', () => {
    const penta: ScaleRef = { root: 0, type: 'pentatonicMajor' }
    expect(snapToScale(65, penta)).toBe(64)
    expect(snapToScale(66, penta)).toBe(67)
  })
  it('rispetta la tonica: in Re maggiore Fa# resta e Fa va a Mi', () => {
    const d: ScaleRef = { root: 2, type: 'major' }
    expect(snapToScale(66, d)).toBe(66)
    expect(snapToScale(65, d)).toBe(64)
  })
  it('con "nessuna" non cambia mai nulla', () => {
    for (const p of [0, 1, 61, 127]) expect(snapToScale(p, { root: 5, type: 'none' })).toBe(p)
  })
  it.each(SCALE_TYPES)('con scala %s ogni altezza 0-127 finisce nella scala e dentro la tastiera', (type: ScaleType) => {
    for (let root = 0; root < 12; root++) {
      for (let p = 0; p <= 127; p++) {
        const r = snapToScale(p, { root, type })
        expect(r).toBeGreaterThanOrEqual(0)
        expect(r).toBeLessThanOrEqual(127)
        expect(inScale(r, { root, type })).toBe(true)
        expect(Math.abs(r - p)).toBeLessThanOrEqual(3)
      }
    }
  })
  it('ai bordi: 0 e 127 restano dentro la tastiera anche se la scala li escluderebbe', () => {
    const fSharp: ScaleRef = { root: 6, type: 'major' }
    expect(snapToScale(0, fSharp)).toBeGreaterThanOrEqual(0)
    expect(snapToScale(127, fSharp)).toBeLessThanOrEqual(127)
    expect(inScale(snapToScale(0, fSharp), fSharp)).toBe(true)
  })
  it('altezze negative vengono portate dentro la tastiera su una nota della scala', () => {
    const r = snapToScale(-5, C_MAJOR)
    expect(r).toBeGreaterThanOrEqual(0)
    expect(inScale(r, C_MAJOR)).toBe(true)
  })
  it('altezze oltre 127 vengono portate dentro la tastiera su una nota della scala', () => {
    const r = snapToScale(200, C_MAJOR)
    expect(r).toBeLessThanOrEqual(127)
    expect(inScale(r, C_MAJOR)).toBe(true)
  })
})
