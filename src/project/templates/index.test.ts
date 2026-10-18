import { describe, expect, it } from 'vitest'
import { normalizeProject } from '../../io/normalize'
import { parseProject, serializeProject } from '../../io/projectFile'
import { LIMITS } from '../limits'
import { clipSpan, overlaps } from '../ops/clips'
import { findPattern, findTrack } from '../ops/helpers'
import { projectSchema } from '../schema/project'
import { TEMPLATES } from './index'

describe.each(TEMPLATES.map((t) => [t.name, t] as const))('modello "%s"', (_, template) => {
  it('supera lo schema del progetto senza perdere campi', () => {
    const project = template.create()
    const result = projectSchema.safeParse(project)
    expect(result.success).toBe(true)
    expect(result.data).toEqual(project)
  })
  it('resta invariato dopo normalizeProject', () => {
    const project = template.create()
    expect(normalizeProject(project)).toEqual(project)
  })
  it('ogni blocco si riferisce a un pattern esistente della stessa traccia', () => {
    const project = template.create()
    expect(project.clips.length).toBeGreaterThan(0)
    for (const clip of project.clips) {
      const pattern = findPattern(project, clip.patternId)
      expect(pattern?.trackId).toBe(clip.trackId)
      expect(findTrack(project, clip.trackId)).toBeDefined()
    }
  })
  it('i blocchi non si sovrappongono e finiscono entro il brano', () => {
    const project = template.create()
    for (const clip of project.clips) {
      expect(overlaps(project, clip.trackId, clip.patternId, clip.startBar, clip.id)).toBe(false)
      expect(clipSpan(project, clip)[1]).toBeLessThanOrEqual(LIMITS.songBars)
    }
  })
  it('ogni pattern è dello stesso tipo della sua traccia', () => {
    const project = template.create()
    for (const pattern of project.patterns) {
      const track = findTrack(project, pattern.trackId)
      expect(track?.kind === 'drums').toBe(pattern.kind === 'drums')
    }
  })
  it('sopravvive a salvataggio e riapertura identico', () => {
    const project = template.create()
    expect(parseProject(serializeProject(project))).toEqual({ ok: true, project })
  })
  it('ogni chiamata crea id nuovi (due progetti indipendenti)', () => {
    const a = template.create()
    const b = template.create()
    expect(a.tracks[0].id).not.toBe(b.tracks[0].id)
  })
})

describe('TEMPLATES', () => {
  it('hanno id unici', () => {
    const ids = TEMPLATES.map((t) => t.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
