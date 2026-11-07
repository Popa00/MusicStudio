import { describe, expect, it } from 'vitest'
import { createEmptyProject } from '../factory'
import { LIMITS } from '../limits'
import type { Project } from '../types'
import { addClip } from './clips'
import { setDrumStepVelocity, toggleDrumStep } from './drums'
import { findPattern, patternsOfTrack } from './helpers'
import { moveDrumRowToTrack } from './percussion'
import { addTrack } from './tracks'

function setup() {
  const t = addTrack(createEmptyProject(), 'drums')
  const trackId = t.trackId ?? ''
  const patternId = patternsOfTrack(t.project, trackId)[0].id
  let p = t.project
  p = toggleDrumStep(p, patternId, 'conga', 0)
  p = toggleDrumStep(p, patternId, 'conga', 5)
  p = setDrumStepVelocity(p, patternId, 'conga', 5, 0.4)
  p = toggleDrumStep(p, patternId, 'kick', 0)
  return { p, trackId, patternId }
}
const drums = (p: Project, id: string) => {
  const x = findPattern(p, id)
  return x?.kind === 'drums' ? x : null
}
const notesOf = (p: Project, trackId: string | null) => {
  const x = patternsOfTrack(p, trackId ?? '')[0]
  return x.kind === 'notes' ? x.notes : []
}

describe('moveDrumRowToTrack', () => {
  it('trasforma i colpi in note sul Do centrale con stesso step e durata 1', () => {
    const { p, patternId } = setup()
    const r = moveDrumRowToTrack(p, patternId, 'conga', 'Conga')
    expect(notesOf(r.project, r.trackId).map((n) => [n.pitch, n.start, n.duration])).toEqual([[60, 0, 1], [60, 5, 1]])
  })
  it('la velocity delle note è quella del colpo originale', () => {
    const { p, patternId } = setup()
    const src = drums(p, patternId)
    const r = moveDrumRowToTrack(p, patternId, 'conga', 'Conga')
    expect(notesOf(r.project, r.trackId).map((n) => n.velocity)).toEqual([src?.steps.conga[0], 0.4])
  })
  it('svuota la riga di origine e lascia intatte le altre righe', () => {
    const { p, patternId } = setup()
    const r = moveDrumRowToTrack(p, patternId, 'conga', 'Conga')
    const after = drums(r.project, patternId)
    expect(after?.steps.conga.every((v) => v === 0)).toBe(true)
    expect(after?.steps.kick).toEqual(drums(p, patternId)?.steps.kick)
  })
  it('crea la traccia percussione con la voce giusta', () => {
    const { p, patternId } = setup()
    const r = moveDrumRowToTrack(p, patternId, 'conga', 'Conga')
    const track = r.project.tracks.find((t) => t.id === r.trackId)
    expect(track?.kind === 'percussion' && track.sound.voice).toBe('conga')
  })
  it('crea blocchi nelle stesse battute dei blocchi del sorgente, e non altri', () => {
    const { p, trackId, patternId } = setup()
    let q = addClip(p, trackId, patternId, 0).project
    q = addClip(q, trackId, patternId, 3).project
    const r = moveDrumRowToTrack(q, patternId, 'conga', 'Conga')
    const clips = r.project.clips.filter((c) => c.trackId === r.trackId)
    expect(clips.map((c) => c.startBar).sort()).toEqual([0, 3])
    expect(r.project.clips).toHaveLength(4)
    expect(new Set(clips.map((c) => c.patternId)).size).toBe(1)
  })
  it('senza blocchi sul sorgente non crea blocchi', () => {
    const { p, patternId } = setup()
    expect(moveDrumRowToTrack(p, patternId, 'conga', 'Conga').project.clips).toHaveLength(0)
  })
  it('riga vuota: crea comunque una traccia con pattern senza note', () => {
    const { p, patternId } = setup()
    const r = moveDrumRowToTrack(p, patternId, 'bongo', 'Bongo')
    expect(notesOf(r.project, r.trackId)).toEqual([])
  })
  it('non tocca altri pattern', () => {
    const { p, patternId } = setup()
    const other = { ...(drums(p, patternId) as NonNullable<ReturnType<typeof drums>>), id: 'altro' }
    const r = moveDrumRowToTrack({ ...p, patterns: [...p.patterns, other] }, patternId, 'conga', 'Conga')
    expect(r.project.patterns.find((x) => x.id === 'altro')).toBe(other)
  })
  it('pattern non di batteria o inesistente: nessun cambiamento', () => {
    const s = addTrack(createEmptyProject(), 'synth')
    const pid = patternsOfTrack(s.project, s.trackId ?? '')[0].id
    for (const id of [pid, 'manca']) {
      const r = moveDrumRowToTrack(s.project, id, 'conga', 'Conga')
      expect(r.trackId).toBeNull()
      expect(r.project).toBe(s.project)
    }
  })
  it('rispetta il limite di blocchi', () => {
    const { p, trackId, patternId } = setup()
    const clips = Array.from({ length: LIMITS.clips }, (_, i) => ({ id: `c${i}`, trackId, patternId, startBar: 0 }))
    const q = { ...p, clips }
    const r = moveDrumRowToTrack(q, patternId, 'conga', 'Conga')
    expect(r.trackId).toBeNull()
    expect(r.project).toBe(q)
  })
})
