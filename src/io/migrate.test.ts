import { describe, expect, it } from 'vitest'
import { DRUM_VOICES } from '../music/drumPattern'
import { electronicBeat } from '../project/templates/electronicBeat'
import type { Project } from '../project/types'
import { parseAnyVersion } from './migrate'

type Json = Record<string, unknown>

/** Un file come lo salvava la versione 1: caselle booleane. */
function toV1(project: Project): Json {
  const patterns = project.patterns.map((p) => {
    if (p.kind !== 'drums') return p
    const steps: Json = {}
    for (const v of DRUM_VOICES) steps[v] = p.steps[v].map((x) => x > 0)
    return { ...p, steps }
  })
  return { ...project, formatVersion: 1, patterns } as Json
}

function firstDrums(data: Json): { steps: Record<string, unknown[]> } {
  const found = (data.patterns as { kind: string }[]).find((p) => p.kind === 'drums')
  return found as unknown as { steps: Record<string, unknown[]> }
}

describe('parseAnyVersion: file versione 1', () => {
  it('converte true in 0,9 e false in 0, senza cambiare altro', () => {
    const v2 = electronicBeat()
    const flat = { ...v2, patterns: v2.patterns.map((p) => {
      if (p.kind !== 'drums') return p
      const steps = { ...p.steps }
      for (const v of DRUM_VOICES) steps[v] = steps[v].map((x) => (x > 0 ? 0.9 : 0))
      return { ...p, steps }
    }) }
    const result = parseAnyVersion(toV1(v2))
    expect(result.success).toBe(true)
    if (!result.success) return
    expect(result.data).toEqual({ ...flat, formatVersion: 2 })
  })
  it('mantiene la posizione dei colpi: stessi step accesi di prima', () => {
    const v2 = electronicBeat()
    const v1 = toV1(v2)
    const result = parseAnyVersion(v1)
    if (!result.success) throw new Error('atteso successo')
    const before = firstDrums(v1).steps.kick
    const migrated = result.data.patterns.find((p) => p.kind === 'drums')
    expect(migrated?.kind === 'drums' && migrated.steps.kick.map((x) => x > 0)).toEqual(before)
  })
  it('non muta i dati in ingresso', () => {
    const v1 = toV1(electronicBeat())
    const copy = structuredClone(v1)
    parseAnyVersion(v1)
    expect(v1).toEqual(copy)
  })
  it('rifiuta caselle non booleane (numeri, stringhe, null)', () => {
    for (const bad of [1, 0.5, 'true', null]) {
      const v1 = toV1(electronicBeat())
      firstDrums(v1).steps.kick[0] = bad
      expect(parseAnyVersion(v1).success).toBe(false)
    }
  })
  it('rifiuta un file v1 con altri dati non validi (bpm, note fuori range)', () => {
    expect(parseAnyVersion({ ...toV1(electronicBeat()), bpm: NaN }).success).toBe(false)
    expect(parseAnyVersion({ ...toV1(electronicBeat()), bpm: 99999 }).success).toBe(false)
    expect(parseAnyVersion({ ...toV1(electronicBeat()), tracks: 'x' }).success).toBe(false)
  })
  it('scarta __proto__, constructor e campi sconosciuti nelle caselle e nel pattern', () => {
    const v1 = toV1(electronicBeat())
    const d = firstDrums(v1) as unknown as Json
    const steps = d.steps as Json
    d.steps = JSON.parse(`{"__proto__":{"polluted":true},"constructor":{"x":1},"extra":[true],"kick":${JSON.stringify(steps.kick)},"snare":${JSON.stringify(steps.snare)},"clap":${JSON.stringify(steps.clap)},"hihatClosed":${JSON.stringify(steps.hihatClosed)},"hihatOpen":${JSON.stringify(steps.hihatOpen)}}`)
    d.script = 'x'
    const result = parseAnyVersion(v1)
    expect(result.success).toBe(true)
    if (!result.success) return
    const out = result.data.patterns.find((p) => p.kind === 'drums')
    if (out?.kind !== 'drums') throw new Error('atteso pattern di batteria')
    expect(Object.keys(out.steps).sort()).toEqual([...DRUM_VOICES].sort())
    expect(Object.hasOwn(out, 'script')).toBe(false)
    expect(Object.getPrototypeOf(out.steps)).toBe(Object.prototype)
    expect(({} as Json).polluted).toBeUndefined()
  })
})

describe('parseAnyVersion: file versione 2 e altre', () => {
  it('accetta un file v2 valido senza modificarlo', () => {
    const p = electronicBeat()
    expect(parseAnyVersion(p)).toEqual({ success: true, data: p })
  })
  it('rifiuta intensità fuori range (1,5 e -0,1) e non numeriche', () => {
    for (const bad of [1.5, -0.1, NaN, Infinity, '0.5', true, null]) {
      const p = JSON.parse(JSON.stringify(electronicBeat())) as Json
      firstDrums(p).steps.kick[0] = bad
      expect(parseAnyVersion(p).success).toBe(false)
    }
  })
  it('rifiuta caselle booleane in un file che dichiara la versione 2', () => {
    const p = JSON.parse(JSON.stringify(electronicBeat())) as Json
    firstDrums(p).steps.kick[0] = true
    expect(parseAnyVersion(p).success).toBe(false)
  })
  it('rifiuta versioni sconosciute, mancanti o dati che non sono oggetti', () => {
    const base = JSON.parse(JSON.stringify(electronicBeat())) as Json
    for (const formatVersion of [0, 3, -1, '1', undefined]) {
      expect(parseAnyVersion({ ...base, formatVersion }).success).toBe(false)
    }
    for (const junk of [null, undefined, 5, 'x', [], [1]]) expect(parseAnyVersion(junk).success).toBe(false)
  })
})
