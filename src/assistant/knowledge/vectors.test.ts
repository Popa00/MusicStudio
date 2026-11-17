import { describe, expect, it } from 'vitest'
import { decodeVector, dot, encodeVector, normalizeVector } from './vectors.ts'

describe('normalizeVector', () => {
  it('produce un vettore di lunghezza 1', () => {
    const v = normalizeVector([3, 4])
    expect(Math.hypot(...v)).toBeCloseTo(1, 6)
    expect(v[0]).toBeCloseTo(0.6, 6)
  })

  it('il vettore zero resta tutto zeri', () => {
    expect([...normalizeVector([0, 0, 0])]).toEqual([0, 0, 0])
  })

  it('NaN e Infinity danno tutti zeri', () => {
    expect([...normalizeVector([1, NaN, 2])]).toEqual([0, 0, 0])
    expect([...normalizeVector([1, Infinity])]).toEqual([0, 0])
  })

  it('un vettore vuoto resta vuoto', () => {
    expect(normalizeVector([]).length).toBe(0)
  })
})

describe('dot', () => {
  it('calcola il prodotto scalare', () => {
    expect(dot(Float32Array.of(1, 2, 3), Float32Array.of(4, 5, 6))).toBe(32)
  })

  it('vale 1 per vettori normalizzati uguali e -1 per opposti', () => {
    const a = normalizeVector([1, 2, 2])
    const b = normalizeVector([-1, -2, -2])
    expect(dot(a, a)).toBeCloseTo(1, 6)
    expect(dot(a, b)).toBeCloseTo(-1, 6)
  })

  it('con lunghezze diverse restituisce 0', () => {
    expect(dot(Float32Array.of(1, 2), Float32Array.of(1))).toBe(0)
  })
})

describe('encodeVector / decodeVector', () => {
  it('andata e ritorno esatti', () => {
    const v = Float32Array.of(0.1, -0.25, 1e-7, 3.4e38, 0)
    expect([...decodeVector(encodeVector(v), v.length)]).toEqual([...v])
  })

  it('funziona con una vista con byteOffset diverso da 0', () => {
    const buffer = new Float32Array([9, 9, 0.5, -1.5, 2.25, 9]).buffer
    const view = new Float32Array(buffer, 8, 3)
    expect(view.byteOffset).toBe(8)
    expect([...decodeVector(encodeVector(view), 3)]).toEqual([0.5, -1.5, 2.25])
  })

  it('codifica un vettore vuoto come stringa vuota', () => {
    expect(encodeVector(new Float32Array(0))).toBe('')
  })
})
