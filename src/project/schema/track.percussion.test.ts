import { describe, expect, it } from 'vitest'
import { createPattern, createTrack, defaultPercussionSound } from '../factory'
import { percussionSoundSchema, percussionTrackSchema, trackSchema } from './track'

const sound = { voice: 'conga', tune: 0, length: 1 }

describe('percussionSoundSchema', () => {
  it('accetta valori ai bordi del range', () => {
    for (const s of [{ tune: -12, length: 0.05 }, { tune: 12, length: 1 }]) {
      expect(percussionSoundSchema.safeParse({ voice: 'kick', ...s }).success).toBe(true)
    }
  })
  it('rifiuta una voce sconosciuta', () => {
    expect(percussionSoundSchema.safeParse({ ...sound, voice: 'flauto' }).success).toBe(false)
  })
  it('rifiuta intonazione fuori range, NaN e Infinity', () => {
    for (const tune of [-12.01, 12.01, NaN, Infinity, -Infinity]) {
      expect(percussionSoundSchema.safeParse({ ...sound, tune }).success).toBe(false)
    }
  })
  it('rifiuta lunghezza fuori range, zero e negativa', () => {
    for (const length of [0, 0.049, 1.01, -1, NaN, Infinity]) {
      expect(percussionSoundSchema.safeParse({ ...sound, length }).success).toBe(false)
    }
  })
})

describe('traccia percussione', () => {
  it('trackSchema riconosce kind "percussion"', () => {
    const track = createTrack('percussion', 'Conga')
    expect(trackSchema.safeParse(track).success).toBe(true)
    expect(percussionTrackSchema.safeParse(track).success).toBe(true)
  })
  it('senza "sound" viene rifiutata', () => {
    const { sound: _s, ...senza } = createTrack('percussion', 'X') as { sound: unknown }
    expect(trackSchema.safeParse(senza).success).toBe(false)
  })
})

describe('factory per la percussione', () => {
  it('defaultPercussionSound usa il suono intero e senza intonazione', () => {
    expect(defaultPercussionSound('bongo')).toEqual({ voice: 'bongo', tune: 0, length: 1 })
  })
  it('defaultPercussionSound senza argomenti usa un suono valido', () => {
    expect(percussionSoundSchema.safeParse(defaultPercussionSound()).success).toBe(true)
  })
  it('createTrack("percussion") crea una traccia con sound valido', () => {
    const t = createTrack('percussion', 'P')
    expect(t.kind).toBe('percussion')
    expect(t.kind === 'percussion' && t.sound).toEqual(defaultPercussionSound())
  })
  it('createPattern per percussione crea un pattern "notes" vuoto', () => {
    const p = createPattern(createTrack('percussion', 'P'), 'Pattern 1', { beatsPerBar: 4, beatUnit: 4 })
    expect(p.kind).toBe('notes')
    expect(p.kind === 'notes' && p.notes).toEqual([])
  })
})
