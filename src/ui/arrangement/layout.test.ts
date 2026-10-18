import { describe, expect, it } from 'vitest'
import { BAR_WIDTH, barsFromPixels, visibleBars } from './layout'

describe('visibleBars', () => {
  it('mostra almeno 16 battute', () => {
    expect(visibleBars(0, 128)).toBe(16)
    expect(visibleBars(12, 128)).toBe(16)
  })
  it('mostra il brano più 4 battute libere', () => {
    expect(visibleBars(13, 128)).toBe(17)
    expect(visibleBars(40, 128)).toBe(44)
  })
  it('non supera il massimo', () => {
    expect(visibleBars(125, 128)).toBe(128)
    expect(visibleBars(500, 128)).toBe(128)
  })
})

describe('barsFromPixels', () => {
  it('converte uno spostamento in battute intere', () => {
    expect(barsFromPixels(0)).toBe(0)
    expect(barsFromPixels(BAR_WIDTH * 3)).toBe(3)
    expect(barsFromPixels(-BAR_WIDTH)).toBe(-1)
  })
  it('arrotonda alla battuta più vicina', () => {
    expect(barsFromPixels(BAR_WIDTH / 2 - 1)).toBe(0)
    expect(barsFromPixels(BAR_WIDTH / 2)).toBe(1)
    expect(barsFromPixels(-BAR_WIDTH / 2 - 1)).toBe(-1)
  })
})
