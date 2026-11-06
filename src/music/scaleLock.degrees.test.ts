import { describe, expect, it } from 'vitest'
import { SCALE_TYPES, scaleIntervals } from './scales'
import { degreeIndex, degreesBetween, pitchAtDegree, stepInScale, type ScaleRef } from './scaleLock'

const C_MAJOR: ScaleRef = { root: 0, type: 'major' }
const A_MINOR: ScaleRef = { root: 9, type: 'minor' }

describe('degreeIndex / pitchAtDegree', () => {
  it('la tonica dell\'ottava 0 è il grado 0', () => {
    expect(degreeIndex(0, C_MAJOR)).toBe(0)
    expect(pitchAtDegree(0, C_MAJOR)).toBe(0)
  })
  it('numera i gradi salendo (Do centrale = grado 35 in Do maggiore)', () => {
    expect(degreeIndex(60, C_MAJOR)).toBe(35)
    expect(pitchAtDegree(35, C_MAJOR)).toBe(60)
    expect(pitchAtDegree(36, C_MAJOR)).toBe(62)
  })
  it('una nota fuori scala prende il grado di quella subito sotto', () => {
    expect(degreeIndex(61, C_MAJOR)).toBe(degreeIndex(60, C_MAJOR))
  })
  it('funziona con gradi e altezze negative', () => {
    expect(pitchAtDegree(-1, C_MAJOR)).toBe(-1)
    expect(degreeIndex(-1, C_MAJOR)).toBe(-1)
    expect(pitchAtDegree(-7, C_MAJOR)).toBe(-12)
  })
  it('con tonica diversa da zero (La minore) i gradi seguono la tonica', () => {
    expect(pitchAtDegree(degreeIndex(69, A_MINOR), A_MINOR)).toBe(69)
    expect(pitchAtDegree(degreeIndex(69, A_MINOR) + 1, A_MINOR)).toBe(71)
  })
  it.each(SCALE_TYPES)('con scala %s il grado di ogni altezza dà la nota della scala sotto o uguale', (type) => {
    const s: ScaleRef = { root: 4, type }
    const n = scaleIntervals(type).length
    for (let p = -30; p <= 160; p++) {
      const below = pitchAtDegree(degreeIndex(p, s), s)
      expect(below).toBeLessThanOrEqual(p)
      expect(p - below).toBeLessThan(12)
      expect(pitchAtDegree(degreeIndex(p, s) + n, s)).toBe(below + 12)
    }
  })
})

describe('stepInScale', () => {
  it('sale di una nota della scala (Do -> Re, Mi -> Fa)', () => {
    expect(stepInScale(60, C_MAJOR, 1)).toBe(62)
    expect(stepInScale(64, C_MAJOR, 1)).toBe(65)
  })
  it('scende di una nota della scala (Do -> Si)', () => {
    expect(stepInScale(60, C_MAJOR, -1)).toBe(59)
  })
  it.each(SCALE_TYPES)('con scala %s un\'ottava di gradi equivale a 12 semitoni', (type) => {
    const s: ScaleRef = { root: 0, type }
    const n = scaleIntervals(type).length
    expect(stepInScale(60, s, n)).toBe(72)
    expect(stepInScale(60, s, -n)).toBe(48)
  })
  it('con passo 0 una nota nella scala resta ferma', () => {
    expect(stepInScale(62, C_MAJOR, 0)).toBe(62)
  })
  it('da una nota fuori scala il primo passo in su va alla nota della scala sopra (Do# -> Re)', () => {
    expect(stepInScale(61, C_MAJOR, 1)).toBe(62)
  })
  it('da una nota fuori scala il primo passo in giù va alla nota della scala sotto (Do# -> Do)', () => {
    expect(stepInScale(61, C_MAJOR, -1)).toBe(60)
  })
  it('da una nota fuori scala due passi vanno alla seconda nota della scala in quella direzione', () => {
    expect(stepInScale(61, C_MAJOR, 2)).toBe(64)
    expect(stepInScale(61, C_MAJOR, -2)).toBe(59)
  })
  it('nelle pentatoniche salta i semitoni mancanti (Mi -> Sol)', () => {
    expect(stepInScale(64, { root: 0, type: 'pentatonicMajor' }, 1)).toBe(67)
  })
  it('con "nessuna" si muove di un semitono', () => {
    expect(stepInScale(60, { root: 0, type: 'none' }, 1)).toBe(61)
    expect(stepInScale(60, { root: 0, type: 'none' }, -1)).toBe(59)
  })
})

describe('degreesBetween', () => {
  it('conta i gradi tra due note della scala', () => {
    expect(degreesBetween(60, 64, C_MAJOR)).toBe(2)
    expect(degreesBetween(64, 60, C_MAJOR)).toBe(-2)
    expect(degreesBetween(60, 72, C_MAJOR)).toBe(7)
  })
  it('è 0 se le due note finiscono sulla stessa nota della scala', () => {
    expect(degreesBetween(60, 60, C_MAJOR)).toBe(0)
    expect(degreesBetween(60, 61, C_MAJOR)).toBe(0)
  })
  it('aggancia prima entrambe le note (Do# -> Fa# vale come Do -> Fa)', () => {
    expect(degreesBetween(61, 66, C_MAJOR)).toBe(degreesBetween(60, 65, C_MAJOR))
  })
})
