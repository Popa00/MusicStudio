import { describe, expect, it, vi } from 'vitest'

vi.mock('tone', () => ({}))

import { balanceGains } from './balance'

describe('balanceGains', () => {
  it('al centro entrambi i lati valgono radice di un mezzo', () => {
    const g = balanceGains(0)
    expect(g.left).toBeCloseTo(Math.SQRT1_2, 10)
    expect(g.right).toBeCloseTo(Math.SQRT1_2, 10)
  })
  it('tutto a sinistra (-1): (1, 0)', () => {
    const g = balanceGains(-1)
    expect(g.left).toBeCloseTo(1, 10)
    expect(g.right).toBeCloseTo(0, 10)
  })
  it('tutto a destra (+1): (0, 1)', () => {
    const g = balanceGains(1)
    expect(g.left).toBeCloseTo(0, 10)
    expect(g.right).toBeCloseTo(1, 10)
  })
  it('potenza costante: left² + right² = 1 per ogni pan', () => {
    for (let pan = -1; pan <= 1; pan += 0.05) {
      const { left, right } = balanceGains(pan)
      expect(left ** 2 + right ** 2).toBeCloseTo(1, 10)
    }
  })
  it('un pan fuori da [-1, 1] viene limitato', () => {
    expect(balanceGains(-5)).toEqual(balanceGains(-1))
    expect(balanceGains(7)).toEqual(balanceGains(1))
    expect(balanceGains(Infinity)).toEqual(balanceGains(1))
  })
})
