import { describe, expect, it } from 'vitest'
import { DRUM_VOICES } from '../music/drumPattern'
import { electronicBeat } from '../project/templates/electronicBeat'
import { lofi } from '../project/templates/lofi'
import type { Project } from '../project/types'
import { parseProject, serializeProject } from './projectFile'

function v1Text(project: Project): string {
  const patterns = project.patterns.map((p) => {
    if (p.kind !== 'drums') return p
    const steps = {} as Record<string, boolean[]>
    for (const v of DRUM_VOICES) steps[v] = p.steps[v].map((x) => x > 0)
    return { ...p, steps }
  })
  return JSON.stringify({ ...project, formatVersion: 1, patterns })
}

describe('parseProject: migrazione da versione 1', () => {
  it('apre un file v1 e lo porta alla versione 3 con colpi a 0,9', () => {
    const result = parseProject(v1Text(electronicBeat()))
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.project.formatVersion).toBe(3)
    for (const p of result.project.patterns) {
      if (p.kind !== 'drums') continue
      for (const v of DRUM_VOICES) expect(p.steps[v].every((x) => x === 0 || x === 0.9)).toBe(true)
    }
  })
  it('il file migrato, salvato e riaperto, torna identico', () => {
    const first = parseProject(v1Text(lofi()))
    if (!first.ok) throw new Error(first.error)
    expect(parseProject(serializeProject(first.project))).toEqual({ ok: true, project: first.project })
  })
  it('un file v1 con una casella non booleana è rifiutato con un errore chiaro', () => {
    const data = JSON.parse(v1Text(electronicBeat())) as { patterns: { steps?: { kick: unknown[] } }[] }
    const drums = data.patterns.find((p) => p.steps)
    if (drums?.steps) drums.steps.kick[0] = 0.5
    const result = parseProject(JSON.stringify(data))
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error).toContain('dati non validi')
  })
  it('un file v2 con intensità 1,5 o -0,1 è rifiutato indicando dove', () => {
    for (const bad of [1.5, -0.1]) {
      const data = JSON.parse(serializeProject(electronicBeat())) as { patterns: { steps?: { kick: unknown[] } }[] }
      const idx = data.patterns.findIndex((p) => p.steps)
      const drums = data.patterns[idx]
      if (drums.steps) drums.steps.kick[0] = bad
      const result = parseProject(JSON.stringify(data))
      expect(result.ok).toBe(false)
      if (!result.ok) expect(result.error).toContain(`patterns.${idx}.steps.kick.0`)
    }
  })
  it('un salvataggio v1 con __proto__ nelle caselle viene aperto senza inquinare nulla', () => {
    const text = v1Text(electronicBeat()).replace('"steps":{', '"steps":{"__proto__":{"polluted":true},')
    const result = parseProject(text)
    expect(result.ok).toBe(true)
    expect(({} as Record<string, unknown>).polluted).toBeUndefined()
  })
})
