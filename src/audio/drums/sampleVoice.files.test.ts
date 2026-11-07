import { describe, expect, it, vi } from 'vitest'

vi.mock('tone', () => ({}))

import { DRUM_VOICES } from '../../music/drumPattern'
import { isSampled, SAMPLE_FILES } from './sampleVoice'

// Elenco dei file realmente presenti in public/samples (solo i percorsi, senza leggerli).
const present = Object.keys(import.meta.glob('/public/samples/**/*.wav', { query: '?url' }))

describe('SAMPLE_FILES', () => {
  it.each(Object.entries(SAMPLE_FILES))('il file di %s esiste in public/samples', (_voice, file) => {
    expect(present).toContain(`/public/samples/${file}`)
  })
  it.each(['shaker', 'tambourine', 'conga', 'bongo'] as const)('%s è un campione registrato', (voice) => {
    expect(isSampled(voice)).toBe(true)
  })
  it('i suoni sintetizzati non sono campioni', () => {
    for (const voice of ['kick', 'snare', 'clap', 'cowbell', 'clave', 'perc'] as const) {
      expect(isSampled(voice)).toBe(false)
    }
  })
  it('ogni voce campionata è un suono di batteria valido', () => {
    for (const voice of Object.keys(SAMPLE_FILES)) expect(DRUM_VOICES).toContain(voice)
  })
})
