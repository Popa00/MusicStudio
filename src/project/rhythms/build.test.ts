import { describe, expect, it } from 'vitest'
import { eighths, sixteenths, V } from './build'

describe('V', () => {
  it('le intensità sono ordinate dalla più forte alla più leggera', () => {
    expect(V.strong).toBeGreaterThan(V.normal)
    expect(V.normal).toBeGreaterThan(V.mid)
    expect(V.mid).toBeGreaterThan(V.soft)
    expect(V.soft).toBeGreaterThan(V.ghost)
    expect(V.ghost).toBeGreaterThan(0)
  })
})

describe('eighths', () => {
  it('produce 8 colpi sugli step pari, forti sui battiti e leggeri in mezzo', () => {
    const out = eighths(0.9, 0.5)
    expect(out.map((s) => (s as [number, number])[0])).toEqual([0, 2, 4, 6, 8, 10, 12, 14])
    expect(out).toEqual([[0, 0.9], [2, 0.5], [4, 0.9], [6, 0.5], [8, 0.9], [10, 0.5], [12, 0.9], [14, 0.5]])
  })
  it('salta gli step indicati', () => {
    expect(eighths(1, 0.5, [0, 14]).map((s) => (s as [number, number])[0])).toEqual([2, 4, 6, 8, 10, 12])
  })
  it('ignora skip fuori griglia o dispari e può svuotare tutto', () => {
    expect(eighths(1, 0.5, [1, 99])).toHaveLength(8)
    expect(eighths(1, 0.5, [0, 2, 4, 6, 8, 10, 12, 14])).toEqual([])
  })
})

describe('sixteenths', () => {
  it('produce 16 colpi con intensità per battito, ottavo e sedicesimo', () => {
    const out = sixteenths(0.9, 0.6, 0.3)
    expect(out).toHaveLength(16)
    expect(out[0]).toEqual([0, 0.9])
    expect(out[1]).toEqual([1, 0.3])
    expect(out[2]).toEqual([2, 0.6])
    expect(out[4]).toEqual([4, 0.9])
    expect(out[15]).toEqual([15, 0.3])
  })
  it('salta gli step indicati', () => {
    const out = sixteenths(1, 0.6, 0.3, [0, 15])
    expect(out).toHaveLength(14)
    expect((out[0] as [number, number])[0]).toBe(1)
  })
})
