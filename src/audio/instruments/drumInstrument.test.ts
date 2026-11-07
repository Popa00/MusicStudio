import { describe, expect, it, vi } from 'vitest'

vi.mock('tone', () => ({}))
vi.mock('../drums/kit', () => ({ createDrumKit: vi.fn() }))

import { drumVoiceForPitch } from './drumInstrument'

const EXPECTED = ['kick', 'rimshot', 'snare', 'snap', 'clap', 'hihatClosed', 'shaker', 'hihatOpen', 'tambourine', 'tomLow', 'cowbell', 'tomHigh']

describe('drumVoiceForPitch', () => {
  it.each(EXPECTED.map((v, i) => [i, v] as const))('la nota di classe %i suona %s', (pitch, voice) => {
    expect(drumVoiceForPitch(pitch)).toBe(voice)
  })
  it('ripete lo schema a ogni ottava (Do 60 = cassa, Si 71 = tom alto)', () => {
    expect(drumVoiceForPitch(60)).toBe('kick')
    expect(drumVoiceForPitch(71)).toBe('tomHigh')
    expect(drumVoiceForPitch(127)).toBe(drumVoiceForPitch(7))
  })
  it('gestisce le note negative con lo stesso schema', () => {
    expect(drumVoiceForPitch(-1)).toBe('tomHigh')
    expect(drumVoiceForPitch(-12)).toBe('kick')
    expect(drumVoiceForPitch(-5)).toBe('hihatOpen')
  })
  it('ogni classe di nota dà un suono diverso', () => {
    const voices = Array.from({ length: 12 }, (_, i) => drumVoiceForPitch(i))
    expect(new Set(voices).size).toBe(12)
  })
})
