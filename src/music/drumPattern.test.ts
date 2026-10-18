import { describe, expect, it } from 'vitest'
import { activeVoicesAt, createEmptyPattern, DRUM_VOICES, toggleStep } from './drumPattern'

describe('createEmptyPattern', () => {
  it('crea una riga vuota per ogni suono con la lunghezza richiesta', () => {
    const p = createEmptyPattern(16)
    for (const v of DRUM_VOICES) {
      expect(p[v]).toHaveLength(16)
      expect(p[v].every((x) => x === false)).toBe(true)
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
    expect(on.snare[3]).toBe(true)
    expect(toggleStep(on, 'snare', 3).snare[3]).toBe(false)
  })
  it('non muta il pattern originale e cambia solo il suono richiesto', () => {
    const p = createEmptyPattern(8)
    const next = toggleStep(p, 'kick', 0)
    expect(p.kick[0]).toBe(false)
    expect(next).not.toBe(p)
    expect(next.kick).not.toBe(p.kick)
    expect(next.snare).toBe(p.snare)
  })
  it('funziona sui bordi (primo e ultimo step)', () => {
    const p = createEmptyPattern(8)
    expect(toggleStep(p, 'clap', 0).clap[0]).toBe(true)
    expect(toggleStep(p, 'clap', 7).clap[7]).toBe(true)
  })
  it('ignora step fuori range, negativi, non interi o non finiti', () => {
    const p = createEmptyPattern(8)
    for (const s of [-1, 8, 100, 1.5, NaN, Infinity, -Infinity]) {
      expect(toggleStep(p, 'kick', s)).toBe(p)
    }
  })
})

describe('activeVoicesAt', () => {
  it("restituisce i suoni attivi su uno step, nell'ordine di DRUM_VOICES", () => {
    let p = createEmptyPattern(4)
    p = toggleStep(p, 'hihatClosed', 2)
    p = toggleStep(p, 'kick', 2)
    expect(activeVoicesAt(p, 2)).toEqual(['kick', 'hihatClosed'])
  })
  it('restituisce un array vuoto se nessun suono è attivo', () => {
    expect(activeVoicesAt(createEmptyPattern(4), 1)).toEqual([])
  })
  it('restituisce un array vuoto per step fuori range', () => {
    const p = toggleStep(createEmptyPattern(4), 'kick', 0)
    expect(activeVoicesAt(p, 4)).toEqual([])
    expect(activeVoicesAt(p, -1)).toEqual([])
  })
})
