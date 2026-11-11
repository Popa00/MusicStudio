import { describe, expect, it } from 'vitest'
import { createEmptyProject } from '../project/factory'
import { addClip } from '../project/ops/clips'
import { toggleDrumStep } from '../project/ops/drums'
import { patternsOfTrack } from '../project/ops/helpers'
import { addNote } from '../project/ops/notes'
import { addTrack } from '../project/ops/tracks'
import type { Project } from '../project/types'
import { sustainedNotesAt } from './chase'
import type { PlayTarget } from './schedule'

const SONG: PlayTarget = { mode: 'song' }

function must<T>(value: T | null | undefined): T {
  if (value === null || value === undefined) throw new Error('valore mancante')
  return value
}

/** Uno strumento con un accordo Do-Mi-Sol lungo una battuta (step 0..16) e una nota breve (step 4, lunga 2). */
function fixture() {
  const s = addTrack(createEmptyProject(), 'synth')
  const trackId = must(s.trackId)
  const patternId = patternsOfTrack(s.project, trackId)[0].id
  let project = s.project
  for (const pitch of [60, 64, 67]) {
    project = addNote(project, patternId, { pitch, start: 0, duration: 16, velocity: 0.8 }).project
  }
  project = addNote(project, patternId, { pitch: 48, start: 4, duration: 2, velocity: 0.5 }).project
  return { project, trackId, patternId }
}

function withClip(project: Project, trackId: string, patternId: string, bar: number): Project {
  return addClip(project, trackId, patternId, bar).project
}

function pitchesOf(events: ReturnType<typeof sustainedNotesAt>): number[] {
  return events.flatMap((e) => (e.kind === 'note' ? [e.pitch] : [])).sort((a, b) => a - b)
}

describe('sustainedNotesAt in modalità brano', () => {
  it('a metà di un accordo lungo restituisce le sue note con la durata che resta', () => {
    const f = fixture()
    const p = withClip(f.project, f.trackId, f.patternId, 0)
    const out = sustainedNotesAt(p, SONG, 6)
    expect(pitchesOf(out)).toEqual([60, 64, 67])
    expect(out[0]).toMatchObject({ kind: 'note', trackId: f.trackId, durationSteps: 10, velocity: 0.8 })
  })
  it('l\'ultimo step dell\'accordo ha 1 step di durata residua', () => {
    const f = fixture()
    const p = withClip(f.project, f.trackId, f.patternId, 0)
    const e = sustainedNotesAt(p, SONG, 15).find((x) => x.kind === 'note' && x.pitch === 60)
    expect(e).toMatchObject({ durationSteps: 1 })
  })
  it('le note che iniziano esattamente su quello step non sono incluse', () => {
    const f = fixture()
    const p = withClip(f.project, f.trackId, f.patternId, 0)
    expect(sustainedNotesAt(p, SONG, 0)).toEqual([])
    expect(pitchesOf(sustainedNotesAt(p, SONG, 4))).not.toContain(48)
  })
  it('le note già finite non sono incluse', () => {
    const f = fixture()
    const p = withClip(f.project, f.trackId, f.patternId, 0)
    expect(pitchesOf(sustainedNotesAt(p, SONG, 6))).not.toContain(48)
    expect(sustainedNotesAt(p, SONG, 16)).toEqual([])
  })
  it('una nota breve ancora in corso viene inclusa con 1 step residuo', () => {
    const f = fixture()
    const p = withClip(f.project, f.trackId, f.patternId, 0)
    const e = sustainedNotesAt(p, SONG, 5).find((x) => x.kind === 'note' && x.pitch === 48)
    expect(e).toMatchObject({ durationSteps: 1, velocity: 0.5 })
  })
  it('fuori da ogni blocco non restituisce nulla', () => {
    const f = fixture()
    const p = withClip(f.project, f.trackId, f.patternId, 1)
    expect(sustainedNotesAt(p, SONG, 6)).toEqual([])
    expect(sustainedNotesAt(f.project, SONG, 6)).toEqual([])
  })
  it('con più blocchi usa la posizione relativa a ciascun blocco', () => {
    const f = fixture()
    const p = withClip(withClip(f.project, f.trackId, f.patternId, 0), f.trackId, f.patternId, 2)
    const out = sustainedNotesAt(p, SONG, 32 + 10).filter((e) => e.kind === 'note' && e.pitch === 60)
    expect(out).toEqual([expect.objectContaining({ durationSteps: 6 })])
    expect(sustainedNotesAt(p, SONG, 20)).toEqual([])
  })
  it('blocchi sovrapposti su tracce diverse contribuiscono entrambi', () => {
    const f = fixture()
    const s2 = addTrack(f.project, 'synth')
    const t2 = must(s2.trackId)
    const p2 = patternsOfTrack(s2.project, t2)[0].id
    let p = addNote(s2.project, p2, { pitch: 72, start: 0, duration: 8, velocity: 1 }).project
    p = withClip(withClip(p, f.trackId, f.patternId, 0), t2, p2, 0)
    const out = sustainedNotesAt(p, SONG, 2)
    expect(out.filter((e) => e.trackId === f.trackId)).toHaveLength(3)
    expect(out.filter((e) => e.trackId === t2)).toEqual([expect.objectContaining({ pitch: 72, durationSteps: 6 })])
  })
})

describe('sustainedNotesAt esclude le tracce non synth', () => {
  it('ignora i pattern di batteria', () => {
    const d = addTrack(createEmptyProject(), 'drums')
    const t = must(d.trackId)
    const id = patternsOfTrack(d.project, t)[0].id
    const p = withClip(toggleDrumStep(d.project, id, 'kick', 0), t, id, 0)
    expect(sustainedNotesAt(p, SONG, 2)).toEqual([])
  })
  it('ignora una traccia percussione anche se il suo pattern contiene note', () => {
    const f = fixture()
    const base = withClip(f.project, f.trackId, f.patternId, 0)
    const p = { ...base, tracks: base.tracks.map((t) => ({ ...t, kind: 'percussion' })) } as unknown as Project
    expect(sustainedNotesAt(p, SONG, 6)).toEqual([])
  })
  it('ignora una traccia percussione creata normalmente', () => {
    const r = addTrack(createEmptyProject(), 'percussion')
    const t = must(r.trackId)
    const id = patternsOfTrack(r.project, t)[0].id
    expect(sustainedNotesAt(withClip(r.project, t, id, 0), SONG, 6)).toEqual([])
  })
  it('ignora i pattern la cui traccia non esiste', () => {
    const f = fixture()
    const base = withClip(f.project, f.trackId, f.patternId, 0)
    expect(sustainedNotesAt({ ...base, tracks: [] }, SONG, 6)).toEqual([])
  })
})

describe('sustainedNotesAt in modalità pattern', () => {
  it('usa lo step dentro il loop: dopo il giro la nota è di nuovo in corso', () => {
    const f = fixture()
    const target: PlayTarget = { mode: 'pattern', patternId: f.patternId }
    const out = sustainedNotesAt(f.project, target, 16 * 3 + 6).filter((e) => e.kind === 'note' && e.pitch === 60)
    expect(out).toEqual([expect.objectContaining({ durationSteps: 10 })])
  })
  it('all\'inizio esatto di un nuovo giro del loop non restituisce nulla', () => {
    const f = fixture()
    expect(sustainedNotesAt(f.project, { mode: 'pattern', patternId: f.patternId }, 32)).toEqual([])
  })
  it('pattern inesistente: nessuna nota', () => {
    expect(sustainedNotesAt(fixture().project, { mode: 'pattern', patternId: 'manca' }, 6)).toEqual([])
  })
})
