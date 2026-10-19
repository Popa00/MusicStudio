import { describe, expect, it } from 'vitest'
import type { SynthSettings } from '../../project/types'
import { toFilterOptions, toVoiceOptions } from './synthOptions'

const settings: SynthSettings = {
  waveform: 'sawtooth',
  attack: 0.02,
  decay: 0.3,
  sustain: 0.6,
  release: 1.5,
  cutoff: 2400,
  resonance: 4,
} as SynthSettings

describe('toVoiceOptions', () => {
  it('mappa la forma d\'onda sull\'oscillatore', () => {
    expect(toVoiceOptions(settings).oscillator).toEqual({ type: 'sawtooth' })
  })

  it('mappa i quattro valori dell\'inviluppo ADSR', () => {
    expect(toVoiceOptions(settings).envelope).toEqual({ attack: 0.02, decay: 0.3, sustain: 0.6, release: 1.5 })
  })

  it('non include filtro né altri campi (voci leggere)', () => {
    expect(Object.keys(toVoiceOptions(settings)).sort()).toEqual(['envelope', 'oscillator'])
  })

  it('segue ogni forma d\'onda dello schema', () => {
    for (const waveform of ['sine', 'triangle', 'sawtooth', 'square'] as const) {
      expect(toVoiceOptions({ ...settings, waveform }).oscillator).toEqual({ type: waveform })
    }
  })
})

describe('toFilterOptions', () => {
  it('è un passa-basso con rolloff -12', () => {
    const o = toFilterOptions(settings)
    expect(o.type).toBe('lowpass')
    expect(o.rolloff).toBe(-12)
  })

  it('usa cutoff come frequenza e risonanza come Q', () => {
    const o = toFilterOptions(settings)
    expect(o.frequency).toBe(2400)
    expect(o.Q).toBe(4)
  })

  it('accetta i valori ai bordi dello schema', () => {
    expect(toFilterOptions({ ...settings, cutoff: 50, resonance: 0.1 })).toMatchObject({ frequency: 50, Q: 0.1 })
    expect(toFilterOptions({ ...settings, cutoff: 18000, resonance: 15 })).toMatchObject({ frequency: 18000, Q: 15 })
  })
})
