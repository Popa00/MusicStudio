import { describe, expect, it } from 'vitest'
import { createEmptyPattern, DRUM_VOICES, toggleStep } from './drumPattern'

describe('createEmptyPattern', () => {
  it('crea una riga vuota per ogni suono con la lunghezza richiesta', () => {
    const p = createEmptyPattern(16)
    for (const v of DRUM_VOICES) {
      expect(p[v]).toHaveLength(16)
      expect(p[v].every((x) => x === 0)).toBe(true)
    }
  })
  it('con 0 step crea righe vuote', () => {
    expect(createEmptyPattern(0).kick).toEqual([])
  })
  it('non condivide gli array tra suoni diversi', () => {
    const p = createEmptyPattern(4)
    expect(p.kick).not.toBe(p.snare)
  })
})

describe('toggleStep', () => {
  it('attiva e poi disattiva uno step', () => {
    const p = createEmptyPattern(8)
    const on = toggleStep(p, 'snare', 3)
    expect(on.snare[3]).toBe(0.9)
    expect(toggleStep(on, 'snare', 3).snare[3]).toBe(0)
  })
  it('non muta il pattern originale e cambia solo il suono richiesto', () => {
    const p = createEmptyPattern(8)
    const next = toggleStep(p, 'kick', 0)
    expect(p.kick[0]).toBe(0)
    expect(next).not.toBe(p)
    expect(next.kick).not.toBe(p.kick)
    expect(next.snare).toBe(p.snare)
  })
  it('funziona sui bordi (primo e ultimo step)', () => {
    const p = createEmptyPattern(8)
    expect(toggleStep(p, 'clap', 0).clap[0]).toBe(0.9)
    expect(toggleStep(p, 'clap', 7).clap[7]).toBe(0.9)
  })
  it('ignora step fuori range, negativi, non interi o non finiti', () => {
    const p = createEmptyPattern(8)
    for (const s of [-1, 8, 100, 1.5, NaN, Infinity, -Infinity]) {
      expect(toggleStep(p, 'kick', s)).toBe(p)
    }
  })
})
