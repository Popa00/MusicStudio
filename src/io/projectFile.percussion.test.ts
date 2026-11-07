import { describe, expect, it } from 'vitest'
import { createEmptyProject } from '../project/factory'
import { addPercussionTrack } from '../project/ops/percussion'
import type { Project } from '../project/types'
import { parseProject, serializeProject } from './projectFile'

const withPercussion = (): Project => addPercussionTrack(createEmptyProject('Perc'), 'conga', 'Conga').project

const withSound = (sound: unknown): string => {
  const p = withPercussion()
  return JSON.stringify({ ...p, tracks: [{ ...p.tracks[0], sound }] })
}

describe('file di progetto con traccia percussione', () => {
  it('salva e riapre un progetto identico', () => {
    const project = withPercussion()
    expect(parseProject(serializeProject(project))).toEqual({ ok: true, project })
  })
  it('conserva intonazione e lunghezza modificate', () => {
    const project = withPercussion()
    const track = { ...project.tracks[0], sound: { voice: 'bongo', tune: -3.5, length: 0.25 } } as Project['tracks'][number]
    const modified = { ...project, tracks: [track] }
    expect(parseProject(serializeProject(modified))).toEqual({ ok: true, project: modified })
  })
  it('rifiuta una voce sconosciuta', () => {
    expect(parseProject(withSound({ voice: 'tromba', tune: 0, length: 1 })).ok).toBe(false)
  })
  it('rifiuta valori fuori range', () => {
    expect(parseProject(withSound({ voice: 'conga', tune: 13, length: 1 })).ok).toBe(false)
    expect(parseProject(withSound({ voice: 'conga', tune: 0, length: 0 })).ok).toBe(false)
    expect(parseProject(withSound({ voice: 'conga', tune: 0, length: 2 })).ok).toBe(false)
  })
  it('rifiuta una traccia percussione senza suono', () => {
    expect(parseProject(withSound(undefined)).ok).toBe(false)
  })
})
