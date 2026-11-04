import { describe, expect, it } from 'vitest'
import { createEmptyPattern, hitsAt, setStepVelocity, toggleStep } from './drumPattern'

describe('setStepVelocity', () => {
  it("cambia l'intensità di una casella accesa", () => {
    const p = toggleStep(createEmptyPattern(8), 'kick', 2)
    expect(setStepVelocity(p, 'kick', 2, 0.4).kick[2]).toBe(0.4)
  })
  it('non accende una casella spenta', () => {
    const p = createEmptyPattern(8)
    expect(setStepVelocity(p, 'kick', 2, 0.4)).toBe(p)
  })
  it('limita il valore tra 0,1 e 1; con NaN lascia il pattern com è', () => {
    const p = toggleStep(createEmptyPattern(8), 'snare', 0)
    expect(setStepVelocity(p, 'snare', 0, 0).snare[0]).toBe(0.1)
    expect(setStepVelocity(p, 'snare', 0, 7).snare[0]).toBe(1)
    expect(setStepVelocity(p, 'snare', 0, NaN)).toBe(p)
  })
  it("restituisce lo stesso oggetto se l'intensità non cambia", () => {
    const p = toggleStep(createEmptyPattern(8), 'clap', 1)
    expect(setStepVelocity(p, 'clap', 1, 0.9)).toBe(p)
    expect(setStepVelocity(p, 'clap', 1, 5)).not.toBe(p)
  })
  it('ignora step non validi', () => {
    const p = toggleStep(createEmptyPattern(8), 'kick', 0)
    for (const s of [-1, 8, 0.5, NaN, Infinity]) expect(setStepVelocity(p, 'kick', s, 0.3)).toBe(p)
  })
  it("non muta l'originale e lascia intatti gli altri suoni e step", () => {
    const p = toggleStep(toggleStep(createEmptyPattern(8), 'kick', 0), 'kick', 4)
    const next = setStepVelocity(p, 'kick', 4, 0.3)
    expect(p.kick[4]).toBe(0.9)
    expect(next.kick).toEqual([0.9, 0, 0, 0, 0.3, 0, 0, 0])
    expect(next.snare).toBe(p.snare)
  })
})

describe('hitsAt', () => {
  it("restituisce i colpi con la loro intensità, nell'ordine di DRUM_VOICES", () => {
    let p = createEmptyPattern(4)
    p = toggleStep(toggleStep(p, 'hihatClosed', 2), 'kick', 2)
    p = setStepVelocity(p, 'hihatClosed', 2, 0.45)
    expect(hitsAt(p, 2)).toEqual([{ voice: 'kick', velocity: 0.9 }, { voice: 'hihatClosed', velocity: 0.45 }])
  })
  it("restituisce un array vuoto se non c'è nessun colpo o lo step è fuori range", () => {
    const p = toggleStep(createEmptyPattern(4), 'kick', 0)
    expect(hitsAt(p, 1)).toEqual([])
    expect(hitsAt(p, 4)).toEqual([])
    expect(hitsAt(p, -1)).toEqual([])
  })
  it('ignora le caselle a 0', () => {
    expect(hitsAt(createEmptyPattern(4), 0)).toEqual([])
  })
})
