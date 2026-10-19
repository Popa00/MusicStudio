import { describe, expect, it } from 'vitest'
import { combFeedback, combInputGain } from './network'

const DELAY = 1557 / 44100
const MAX = 0.98

describe('combFeedback', () => {
  it('cresce con la durata della coda', () => {
    expect(combFeedback(DELAY, 0.5)).toBeLessThan(combFeedback(DELAY, 1))
    expect(combFeedback(DELAY, 1)).toBeLessThan(combFeedback(DELAY, 2))
  })

  it('non supera mai 0.98, nemmeno con decay 10 o ritardi minimi', () => {
    // Con il tetto a 0.98 anche una coda di 10 s non viene tagliata: la manopola funziona fino in fondo.
    expect(combFeedback(DELAY, 10)).toBeLessThanOrEqual(MAX)
    expect(combFeedback(DELAY, 10)).toBeGreaterThan(combFeedback(DELAY, 5))
    expect(combFeedback(0.0001, 10)).toBe(MAX)
    expect(combFeedback(0, 5)).toBe(MAX)
    expect(combFeedback(DELAY, 1e6)).toBeLessThanOrEqual(MAX)
  })

  it('è finito e nell\'intervallo (0, 0.98] con decay 0, minuscolo o negativo', () => {
    for (const decay of [0, 1e-9, -1]) {
      const g = combFeedback(DELAY, decay)
      expect(Number.isFinite(g)).toBe(true)
      expect(g).toBeGreaterThan(0)
      expect(g).toBeLessThanOrEqual(MAX)
    }
  })

  it('fa scendere l\'eco di 60 dB in `decay` secondi quando non è limitato', () => {
    for (const [delay, decay] of [[DELAY, 0.5], [1116 / 44100, 0.3], [0.03, 1]]) {
      const g = combFeedback(delay, decay)
      expect(g).toBeLessThan(MAX)
      expect(Math.pow(g, decay / delay)).toBeCloseTo(0.001, 6)
    }
  })

  it('con ritardi più lunghi basta meno ritorno a parità di decay (meno giri)', () => {
    expect(combFeedback(0.02, 1)).toBeGreaterThan(combFeedback(0.04, 1))
  })
})

describe('combInputGain', () => {
  it('è decrescente nel ritorno', () => {
    expect(combInputGain(0.2)).toBeGreaterThan(combInputGain(0.5))
    expect(combInputGain(0.5)).toBeGreaterThan(combInputGain(0.9))
  })

  it('vale 0 con ritorno 1', () => {
    expect(combInputGain(1)).toBe(0)
  })

  it('è positivo e finito con il ritorno massimo', () => {
    const v = combInputGain(MAX)
    expect(v).toBeGreaterThan(0)
    expect(Number.isFinite(v)).toBe(true)
  })
})
