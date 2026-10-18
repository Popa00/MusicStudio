import { describe, expect, it } from 'vitest'
import { createEmptyProject } from '../project/factory'
import { LIMITS } from '../project/limits'
import { electronicBeat } from '../project/templates/electronicBeat'
import { parseProject, serializeProject, type ParseResult } from './projectFile'

function expectError(result: ParseResult, fragment: string): void {
  expect(result.ok).toBe(false)
  if (!result.ok) expect(result.error).toContain(fragment)
}

describe('serializeProject → parseProject', () => {
  it('un progetto completo torna identico', () => {
    const project = electronicBeat()
    expect(parseProject(serializeProject(project))).toEqual({ ok: true, project })
  })
  it('anche un progetto vuoto', () => {
    const project = createEmptyProject('Vuoto')
    expect(parseProject(serializeProject(project))).toEqual({ ok: true, project })
  })
  it('il testo salvato è JSON leggibile', () => {
    expect(() => JSON.parse(serializeProject(createEmptyProject()))).not.toThrow()
  })
})

describe('parseProject con file non validi', () => {
  it('rifiuta JSON non valido con un messaggio chiaro', () => {
    for (const text of ['', '{', '{"name": }', 'ciao', '\u0000']) {
      expectError(parseProject(text), 'formato non leggibile')
    }
  })
  it('rifiuta JSON valido che non è un progetto', () => {
    for (const text of ['null', '42', '"testo"', '[]', '{}']) {
      expectError(parseProject(text), 'dati non validi')
    }
  })
  it('rifiuta un file troppo grande prima di leggerlo', () => {
    expectError(parseProject(' '.repeat(LIMITS.fileChars + 1)), 'troppo grande')
  })
  it('un file esattamente al limite non viene rifiutato per la dimensione', () => {
    const text = serializeProject(createEmptyProject())
    const padded = text + ' '.repeat(LIMITS.fileChars - text.length)
    expect(parseProject(padded).ok).toBe(true)
  })
  it('rifiuta una versione di formato sconosciuta', () => {
    const data = { ...createEmptyProject(), formatVersion: 2 }
    expectError(parseProject(JSON.stringify(data)), 'formatVersion')
  })
  it('indica nel messaggio dove si trova il dato sbagliato', () => {
    const project = electronicBeat()
    const data = { ...project, tracks: project.tracks.map((t, i) => (i === 1 ? { ...t, mixer: { ...t.mixer, volumeDb: 99 } } : t)) }
    expectError(parseProject(JSON.stringify(data)), 'tracks.1.mixer.volumeDb')
  })
})

describe('parseProject con campi pericolosi', () => {
  const inject = (text: string, at: string, extra: string) => text.replace(at, `${at}${extra}`)
  const evil = '"__proto__":{"polluted":true},"constructor":{"prototype":{"polluted":true}},'

  it('scarta "__proto__" e "constructor" al primo livello senza inquinare Object.prototype', () => {
    const text = inject(serializeProject(electronicBeat()), '{', evil)
    const result = parseProject(text)
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(Object.getPrototypeOf(result.project)).toBe(Object.prototype)
    expect(Object.hasOwn(result.project, '__proto__')).toBe(false)
    expect(Object.hasOwn(result.project, 'constructor')).toBe(false)
    expect(({} as Record<string, unknown>).polluted).toBeUndefined()
  })
  it('scarta "__proto__" anche dentro tracce e pattern', () => {
    let text = serializeProject(electronicBeat())
    text = text.replaceAll('"mixer":', `${evil}"mixer":`).replaceAll('"lengthBars":', `${evil}"lengthBars":`)
    const result = parseProject(text)
    expect(result.ok).toBe(true)
    if (!result.ok) return
    for (const item of [...result.project.tracks, ...result.project.patterns]) {
      expect(Object.getPrototypeOf(item)).toBe(Object.prototype)
      expect(Object.hasOwn(item, '__proto__')).toBe(false)
      expect(Object.hasOwn(item, 'constructor')).toBe(false)
    }
    expect(({} as Record<string, unknown>).polluted).toBeUndefined()
  })
  it('scarta i campi sconosciuti', () => {
    const data = { ...createEmptyProject(), script: '<script>alert(1)</script>' }
    const result = parseProject(JSON.stringify(data))
    expect(result.ok && Object.hasOwn(result.project, 'script')).toBe(false)
  })
})
