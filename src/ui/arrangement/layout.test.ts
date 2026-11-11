import { describe, expect, it } from 'vitest'
import { BAR_WIDTH, barsFromPixels, scrollToShow, stepAtRulerX, visibleBars } from './layout'

describe('visibleBars', () => {
  it('mostra almeno 32 battute', () => {
    expect(visibleBars(0, 128)).toBe(32)
    expect(visibleBars(24, 128)).toBe(32)
  })
  it('mostra il brano più 8 battute libere', () => {
    expect(visibleBars(25, 128)).toBe(33)
    expect(visibleBars(40, 128)).toBe(48)
  })
  it('non supera il massimo', () => {
    expect(visibleBars(121, 128)).toBe(128)
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

describe('scrollToShow', () => {
  it('non scorre se il punto è già visibile', () => {
    expect(scrollToShow(500, 0, 1000, 64)).toBeNull()
  })
  it('scorre in avanti quando il punto esce a destra', () => {
    expect(scrollToShow(980, 0, 1000, 64)).toBe(916)
  })
  it('torna indietro quando il punto è a sinistra (es. il brano riparte)', () => {
    expect(scrollToShow(0, 2000, 1000, 64)).toBe(0)
  })
  it('in una vista molto stretta non scorre a ogni step', () => {
    // vista di 100 px: il margine si riduce a 25 px, quindi un punto in mezzo è già visibile
    expect(scrollToShow(50, 0, 100, 64)).toBeNull()
  })
})

describe('stepAtRulerX', () => {
  const ts44 = { beatsPerBar: 4, beatUnit: 4 } as const
  it("si aggancia all'inizio del battito", () => {
    expect(stepAtRulerX(0, ts44, 32)).toBe(0)
    expect(stepAtRulerX(BAR_WIDTH * 2 + BAR_WIDTH / 4 + 3, ts44, 32)).toBe(36)
  })
  it('resta dentro le battute visibili', () => {
    expect(stepAtRulerX(-50, ts44, 32)).toBe(0)
    expect(stepAtRulerX(BAR_WIDTH * 100, ts44, 32)).toBe(32 * 16 - 4)
  })
  it('in 6/8 il battito è una croma (2 step)', () => {
    const ts68 = { beatsPerBar: 6, beatUnit: 8 } as const
    expect(stepAtRulerX(BAR_WIDTH / 2 + 1, ts68, 32)).toBe(6)
  })
})
