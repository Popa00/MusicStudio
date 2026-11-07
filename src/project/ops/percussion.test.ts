import { describe, expect, it } from 'vitest'
import { createEmptyProject } from '../factory'
import { LIMITS } from '../limits'
import { patternsOfTrack } from './helpers'
import { addPercussionTrack, updatePercussion } from './percussion'
import { addTrack } from './tracks'

const empty = () => createEmptyProject()

describe('addPercussionTrack', () => {
  it('crea traccia e pattern vuoto di tipo note, con il suono scelto', () => {
    const r = addPercussionTrack(empty(), 'shaker', 'Shaker')
    const track = r.project.tracks[0]
    expect(r.trackId).toBe(track.id)
    expect(track.kind === 'percussion' && track.sound).toEqual({ voice: 'shaker', tune: 0, length: 1 })
    const patterns = patternsOfTrack(r.project, track.id)
    expect(patterns).toHaveLength(1)
    expect(patterns[0].kind).toBe('notes')
  })
  it("usa l'etichetta come nome, senza numero la prima volta", () => {
    expect(addPercussionTrack(empty(), 'conga', 'Conga').project.tracks[0].name).toBe('Conga')
  })
  it('aggiunge un numero solo se il nome è già usato', () => {
    const a = addPercussionTrack(empty(), 'conga', 'Conga').project
    const b = addPercussionTrack(a, 'conga', 'Conga').project
    const c = addPercussionTrack(b, 'conga', 'Conga').project
    expect(c.tracks.map((t) => t.name)).toEqual(['Conga', 'Conga 1', 'Conga 2'])
  })
  it('non muta il progetto di partenza', () => {
    const p = empty()
    addPercussionTrack(p, 'conga', 'Conga')
    expect(p.tracks).toEqual([])
    expect(p.patterns).toEqual([])
  })
  it('rifiuta quando si raggiunge il limite di tracce', () => {
    let p = empty()
    for (let i = 0; i < LIMITS.tracks; i++) p = addTrack(p, 'synth').project
    const r = addPercussionTrack(p, 'conga', 'Conga')
    expect(r.trackId).toBeNull()
    expect(r.project).toBe(p)
  })
  it('rifiuta quando si raggiunge il limite di pattern', () => {
    const base = addPercussionTrack(empty(), 'conga', 'Conga').project
    const filler = base.patterns[0]
    const p = { ...base, patterns: Array.from({ length: LIMITS.patterns }, (_, i) => ({ ...filler, id: `x${i}` })) }
    const r = addPercussionTrack(p, 'bongo', 'Bongo')
    expect(r.trackId).toBeNull()
    expect(r.project).toBe(p)
  })
})

describe('updatePercussion', () => {
  const base = () => {
    const r = addPercussionTrack(empty(), 'conga', 'Conga')
    return { p: r.project, id: r.trackId ?? '' }
  }
  const soundOf = (p: ReturnType<typeof empty>) => {
    const t = p.tracks[0]
    return t.kind === 'percussion' ? t.sound : null
  }
  it('cambia voce, intonazione e lunghezza', () => {
    const { p, id } = base()
    expect(soundOf(updatePercussion(p, id, { voice: 'bongo', tune: 5, length: 0.5 }))).toEqual({ voice: 'bongo', tune: 5, length: 0.5 })
  })
  it('ignora valori fuori range e restituisce lo stesso progetto', () => {
    const { p, id } = base()
    for (const changes of [{ tune: 13 }, { tune: -13 }, { length: 0 }, { length: 1.5 }, { tune: NaN }]) {
      expect(updatePercussion(p, id, changes)).toBe(p)
    }
  })
  it('ignora una voce sconosciuta', () => {
    const { p, id } = base()
    expect(updatePercussion(p, id, { voice: 'zzz' as never })).toBe(p)
  })
  it('accetta i valori ai bordi', () => {
    const { p, id } = base()
    expect(soundOf(updatePercussion(p, id, { tune: -12, length: 0.05 }))).toMatchObject({ tune: -12, length: 0.05 })
  })
  it('lascia invariata una traccia che non è percussione', () => {
    const t = addTrack(empty(), 'synth')
    expect(updatePercussion(t.project, t.trackId ?? '', { tune: 3 })).toBe(t.project)
  })
  it('id inesistente: nessun cambiamento', () => {
    const { p } = base()
    expect(updatePercussion(p, 'manca', { tune: 3 })).toBe(p)
  })
})
