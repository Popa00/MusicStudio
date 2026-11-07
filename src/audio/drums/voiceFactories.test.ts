import { describe, expect, it, vi } from 'vitest'

vi.mock('tone', () => ({}))

import { DRUM_VOICES } from '../../music/drumPattern'
import { VOICE_FACTORIES } from './voiceFactories'

describe('VOICE_FACTORIES', () => {
  it.each([...DRUM_VOICES])('ha una funzione di costruzione per %s', (voice) => {
    expect(typeof VOICE_FACTORIES[voice]).toBe('function')
  })
  it('non ha chiavi per suoni inesistenti', () => {
    expect(Object.keys(VOICE_FACTORIES).sort()).toEqual([...DRUM_VOICES].sort())
  })
})
