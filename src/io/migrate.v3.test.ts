import { describe, expect, it } from 'vitest'
import { BASE_DRUM_VOICES, EXTRA_DRUM_VOICES } from '../music/drumPattern'
import { electronicBeat } from '../project/templates/electronicBeat'
import type { Project } from '../project/types'
import { parseAnyVersion } from './migrate'
import { parseProject, serializeProject } from './projectFile'

type Json = Record<string, unknown>
type Steps = Record<string, unknown>

/** Un file come lo salvava la v2: solo le 5 righe di base, senza percussioni extra. */
function toV2With5Rows(project: Project): Json {
  const patterns = project.patterns.map((p) => {
    if (p.kind !== 'drums') return p
    const steps: Steps = {}
    for (const v of BASE_DRUM_VOICES) steps[v] = p.steps[v]
    return { ...p, steps }
  })
  return { ...project, formatVersion: 2, patterns } as Json
}

function drumsOf(project: Project) {
  return project.patterns.flatMap((p) => (p.kind === 'drums' ? [p] : []))
}

describe('parseAnyVersion: v2 con sole 5 righe', () => {
  it('apre il file e lo porta alla versione 3', () => {
    const result = parseAnyVersion(toV2With5Rows(electronicBeat()))
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.formatVersion).toBe(3)
  })
  it('riempie le righe extra con zeri lunghi quanto la cassa', () => {
    const result = parseAnyVersion(toV2With5Rows(electronicBeat()))
    if (!result.success) throw new Error('atteso successo')
    for (const p of drumsOf(result.data)) {
      for (const v of EXTRA_DRUM_VOICES) expect(p.steps[v]).toEqual(Array(p.steps.kick.length).fill(0))
    }
  })
  it('conserva i colpi delle 5 righe di base', () => {
    const original = electronicBeat()
    const result = parseAnyVersion(toV2With5Rows(original))
    if (!result.success) throw new Error('atteso successo')
    const before = drumsOf(original).map((p) => BASE_DRUM_VOICES.map((v) => p.steps[v]))
    const after = drumsOf(result.data).map((p) => BASE_DRUM_VOICES.map((v) => p.steps[v]))
    expect(after).toEqual(before)
  })
  it('non muta i dati in ingresso', () => {
    const input = toV2With5Rows(electronicBeat())
    const copy = structuredClone(input)
    parseAnyVersion(input)
    expect(input).toEqual(copy)
  })
  it('passando da parseProject, salvato e riaperto torna identico', () => {
    const first = parseProject(JSON.stringify(toV2With5Rows(electronicBeat())))
    if (!first.ok) throw new Error(first.error)
    expect(parseProject(serializeProject(first.project))).toEqual({ ok: true, project: first.project })
  })
})

describe('parseAnyVersion: v3', () => {
  it('un file v3 con colpi nelle righe extra fa il giro salva e apri', () => {
    const base = electronicBeat()
    const patterns = base.patterns.map((p) => {
      if (p.kind !== 'drums') return p
      const conga = p.steps.kick.map((_, i) => (i === 2 ? 0.7 : 0))
      return { ...p, steps: { ...p.steps, conga } }
    })
    const first = parseProject(serializeProject({ ...base, patterns }))
    if (!first.ok) throw new Error(first.error)
    expect(drumsOf(first.project)[0].steps.conga[2]).toBe(0.7)
    expect(parseProject(serializeProject(first.project))).toEqual(first)
  })
  it('una riga extra con valori fuori range è rifiutata', () => {
    const data = JSON.parse(JSON.stringify(electronicBeat())) as { patterns: { steps?: Steps }[] }
    const drums = data.patterns.find((p) => p.steps)
    if (drums?.steps) drums.steps.conga = [2]
    expect(parseAnyVersion(data).success).toBe(false)
  })
  it('un file di versione 4 è rifiutato con il messaggio "versione più recente"', () => {
    const result = parseProject(JSON.stringify({ ...electronicBeat(), formatVersion: 4 }))
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error).toContain('versione più recente')
  })
})
