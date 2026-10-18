import { describe, expect, it } from 'vitest'
import { LIMITS } from '../project/limits'
import { electronicBeat } from '../project/templates/electronicBeat'
import type { Project } from '../project/types'
import { parseProject, serializeProject } from './projectFile'

/** Serializza il progetto e sostituisce il primo `"chiave": valore` con un testo grezzo. */
function withRaw(project: Project, key: string, raw: string): string {
  return serializeProject(project).replace(new RegExp(`"${key}":\\s*[^,\\n}]+`), `"${key}":${raw}`)
}

function rejected(text: string): boolean {
  return !parseProject(text).ok
}

describe('parseProject rifiuta valori fuori range', () => {
  const project = electronicBeat()
  const cases: [string, string][] = [
    ['bpm', '39'],
    ['bpm', '241'],
    ['bpm', '-120'],
    ['volumeDb', '7'],
    ['pan', '1.5'],
    ['startBar', '-1'],
    ['startBar', String(LIMITS.songBars)],
    ['startBar', '0.5'],
    ['lengthBars', '0'],
    ['lengthBars', String(LIMITS.patternBars + 1)],
    ['pitch', '128'],
    ['pitch', '-1'],
    ['duration', '0'],
    ['velocity', '1.5'],
    ['attack', '0'],
    ['root', '12'],
    ['beatsPerBar', '0'],
    ['beatUnit', '3'],
  ]
  it.each(cases)('%s = %s', (key, raw) => {
    expect(serializeProject(project)).toContain(`"${key}":`)
    expect(rejected(withRaw(project, key, raw))).toBe(true)
  })
  it('controllo: lo stesso progetto senza modifiche è accettato', () => {
    expect(rejected(serializeProject(project))).toBe(false)
  })
})

describe('parseProject rifiuta NaN e Infinity', () => {
  const project = electronicBeat()
  it.each(['"NaN"', '"Infinity"', '"-Infinity"', 'null', '"120"', 'true', '1e999', '-1e999'])('bpm = %s', (raw) => {
    expect(rejected(withRaw(project, 'bpm', raw))).toBe(true)
  })
  it.each(['"NaN"', '"Infinity"', '1e999'])('velocity di una nota = %s', (raw) => {
    expect(rejected(withRaw(project, 'velocity', raw))).toBe(true)
  })
})

describe('parseProject rifiuta file con troppi elementi', () => {
  it('più tracce del massimo', () => {
    const project = electronicBeat()
    const tracks = Array.from({ length: LIMITS.tracks + 1 }, (_, i) => ({ ...project.tracks[0], id: `t${i}` }))
    expect(rejected(JSON.stringify({ ...project, tracks }))).toBe(true)
  })
  it('un nome troppo lungo', () => {
    expect(rejected(JSON.stringify({ ...electronicBeat(), name: 'x'.repeat(LIMITS.nameLength + 1) }))).toBe(true)
  })
  it('id vuoti o enormi', () => {
    const project = electronicBeat()
    for (const id of ['', 'x'.repeat(65)]) {
      const clips = project.clips.map((c, i) => (i === 0 ? { ...c, id } : c))
      expect(rejected(JSON.stringify({ ...project, clips }))).toBe(true)
    }
  })
})
