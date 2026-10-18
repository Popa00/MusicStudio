import { describe, expect, it } from 'vitest'
import { createEmptyProject } from '../factory'
import { LIMITS } from '../limits'
import { addClip, duplicateClip, songLengthBars } from './clips'
import { patternsOfTrack } from './helpers'
import { setPatternLength } from './patternLength'
import { addTrack } from './tracks'

function must<T>(value: T | null | undefined): T {
  if (value === null || value === undefined) throw new Error('valore mancante')
  return value
}

/** Una batteria con un pattern di 2 battute. */
function fixture() {
  const d = addTrack(createEmptyProject(), 'drums')
  const trackId = must(d.trackId)
  const patternId = patternsOfTrack(d.project, trackId)[0].id
  return { project: setPatternLength(d.project, patternId, 2), trackId, patternId }
}

describe('duplicateClip', () => {
  it('mette la copia subito dopo il blocco originale', () => {
    const f = fixture()
    const a = addClip(f.project, f.trackId, f.patternId, 0)
    const r = duplicateClip(a.project, must(a.clipId))
    expect(r.clipId).not.toBeNull()
    expect(r.project.clips.find((c) => c.id === r.clipId)?.startBar).toBe(2)
  })
  it('salta i blocchi già presenti fino al primo spazio libero', () => {
    const f = fixture()
    const a = addClip(f.project, f.trackId, f.patternId, 0)
    const b = addClip(a.project, f.trackId, f.patternId, 2)
    const c = addClip(b.project, f.trackId, f.patternId, 5)
    const r = duplicateClip(c.project, must(a.clipId))
    expect(r.project.clips.find((x) => x.id === r.clipId)?.startBar).toBe(7)
  })
  it('se non c\'è spazio prima della fine del brano non aggiunge nulla', () => {
    const f = fixture()
    const a = addClip(f.project, f.trackId, f.patternId, LIMITS.songBars - 2)
    const r = duplicateClip(a.project, must(a.clipId))
    expect(r).toEqual({ project: a.project, clipId: null })
  })
  it('id sconosciuto: nessuna copia', () => {
    const f = fixture()
    expect(duplicateClip(f.project, 'manca')).toEqual({ project: f.project, clipId: null })
  })
})

describe('songLengthBars', () => {
  it('un brano vuoto dura 1 battuta', () => {
    expect(songLengthBars(createEmptyProject())).toBe(1)
  })
  it('arriva fino alla fine dell\'ultimo blocco', () => {
    const f = fixture()
    const a = addClip(f.project, f.trackId, f.patternId, 4)
    const b = addClip(a.project, f.trackId, f.patternId, 0)
    expect(songLengthBars(b.project)).toBe(6)
  })
  it('un blocco su un pattern sconosciuto conta 1 battuta', () => {
    const p = { ...createEmptyProject(), clips: [{ id: 'c', trackId: 't', patternId: 'manca', startBar: 9 }] }
    expect(songLengthBars(p)).toBe(10)
  })
})
