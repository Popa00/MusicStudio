import { describe, expect, it } from 'vitest'
import { DRUM_VOICES } from '../../music/drumPattern'
import { VOICE_GROUPS, VOICE_LABELS } from './voiceLabels'

describe('voiceLabels', () => {
  it.each([...DRUM_VOICES])('il suono %s ha nome e spiegazione non vuoti', (voice) => {
    expect(VOICE_LABELS[voice].name.trim()).not.toBe('')
    expect(VOICE_LABELS[voice].hint.trim()).not.toBe('')
  })
  it('non ci sono etichette per suoni inesistenti', () => {
    expect(Object.keys(VOICE_LABELS).sort()).toEqual([...DRUM_VOICES].sort())
  })
  it('i nomi sono tutti diversi tra loro', () => {
    const names = Object.values(VOICE_LABELS).map((l) => l.name)
    expect(new Set(names).size).toBe(names.length)
  })
  it('i gruppi contengono ogni suono esattamente una volta', () => {
    const all = VOICE_GROUPS.flatMap((g) => g.voices)
    expect(all).toHaveLength(DRUM_VOICES.length)
    expect([...all].sort()).toEqual([...DRUM_VOICES].sort())
  })
  it('nessun gruppo è vuoto e i nomi dei gruppi sono unici', () => {
    expect(VOICE_GROUPS.every((g) => g.voices.length > 0)).toBe(true)
    expect(new Set(VOICE_GROUPS.map((g) => g.name)).size).toBe(VOICE_GROUPS.length)
  })
})
