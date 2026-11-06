import { describe, expect, it } from 'vitest'
import { DRUM_VOICES, type DrumVoiceId } from '../../music/drumPattern'
import { BPM_MAX, BPM_MIN } from '../../music/timing'
import { MIN_VELOCITY } from '../../music/velocity'
import type { RhythmHits } from './build'
import { findGenre, GENRE_RHYTHMS } from './genres'

const specs = (hits: RhythmHits) =>
  Object.entries(hits).flatMap(([voice, list]) => (list ?? []).map((s) => ({ voice, step: typeof s === 'number' ? s : s[0], vel: typeof s === 'number' ? undefined : s[1] })))
const count = (hits: RhythmHits) => specs(hits).length
const all = GENRE_RHYTHMS.flatMap((g) => g.variants.map((v) => ({ g, v })))

describe('GENRE_RHYTHMS', () => {
  it('contiene 8 generi, ciascuno con una variante Base e una Ricco', () => {
    expect(GENRE_RHYTHMS).toHaveLength(8)
    for (const g of GENRE_RHYTHMS) expect(g.variants.map((v) => v.name)).toEqual(['Base', 'Ricco'])
  })
  it('ogni genere ha un id unico', () => {
    const ids = GENRE_RHYTHMS.map((g) => g.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
  it('ogni genere ha un BPM intero-valido tra BPM_MIN e BPM_MAX, nome e descrizione', () => {
    for (const g of GENRE_RHYTHMS) {
      expect(g.bpm).toBeGreaterThanOrEqual(BPM_MIN)
      expect(g.bpm).toBeLessThanOrEqual(BPM_MAX)
      expect(g.name.length).toBeGreaterThan(0)
      expect(g.description.length).toBeGreaterThan(0)
    }
  })
  it('le voci usate sono tutte DrumVoiceId validi', () => {
    for (const { v } of all) for (const key of Object.keys(v.hits)) expect(DRUM_VOICES).toContain(key as DrumVoiceId)
  })
  it('ogni step è un intero tra 0 e 15', () => {
    for (const { v } of all) for (const s of specs(v.hits)) {
      expect(Number.isInteger(s.step)).toBe(true)
      expect(s.step).toBeGreaterThanOrEqual(0)
      expect(s.step).toBeLessThanOrEqual(15)
    }
  })
  it('le intensità esplicite sono tra MIN_VELOCITY e 1', () => {
    for (const { v } of all) for (const s of specs(v.hits)) {
      if (s.vel === undefined) continue
      expect(s.vel).toBeGreaterThanOrEqual(MIN_VELOCITY)
      expect(s.vel).toBeLessThanOrEqual(1)
    }
  })
  it('ogni variante ha almeno la cassa oppure rullante/clap', () => {
    for (const { v } of all) {
      const has = (k: DrumVoiceId) => (v.hits[k]?.length ?? 0) > 0
      expect(has('kick') || has('snare') || has('clap')).toBe(true)
    }
  })
  it('la variante Ricco ha almeno tanti colpi quanto la Base', () => {
    for (const g of GENRE_RHYTHMS) expect(count(g.variants[1].hits)).toBeGreaterThanOrEqual(count(g.variants[0].hits))
  })
  it('nessuna voce ha lo stesso step ripetuto due volte nella stessa variante', () => {
    for (const { v } of all) for (const [voice, list] of Object.entries(v.hits)) {
      const steps = (list ?? []).map((s) => (typeof s === 'number' ? s : s[0]))
      expect(new Set(steps).size, voice).toBe(steps.length)
    }
  })
})

describe('findGenre', () => {
  it('trova un genere per id', () => {
    expect(findGenre('house')?.name).toBe('House')
  })
  it('restituisce undefined per un id sconosciuto o vuoto', () => {
    expect(findGenre('xyz')).toBeUndefined()
    expect(findGenre('')).toBeUndefined()
  })
})
