import { describe, expect, it } from 'vitest'
import { createEmptyProject } from '../../project/factory'
import type { NotePatternData, Project } from '../../project/types'
import { describeNotePattern } from './notesText'

function pattern(notes: [number, number, number][]): NotePatternData {
  return {
    id: 'p',
    trackId: 't',
    name: 'P',
    lengthBars: 4,
    kind: 'notes',
    notes: notes.map(([pitch, start, duration], i) => ({ id: `n${i}`, pitch, start, duration, velocity: 0.8 })),
  }
}

const project = (scale: Project['scale'] = { root: 0, type: 'major' }): Project => ({ ...createEmptyProject(), scale })

describe('describeNotePattern', () => {
  it('un pattern senza note lo dice', () => {
    expect(describeNotePattern(pattern([]), project(), true)).toEqual(['(nessuna nota)'])
  })
  it('elenca posizione, nome con ottava e durata', () => {
    const lines = describeNotePattern(pattern([[60, 0, 4], [62, 6, 2]]), project(), true)
    expect(lines[0]).toBe('Note: 1.1 Do4 (1 battito) · 1.2+½ Re4 (½ battito)')
  })
  it('un accordo ha il nome già calcolato e le sue note', () => {
    const lines = describeNotePattern(pattern([[60, 0, 16], [64, 0, 16], [67, 0, 16]]), project(), true)
    expect(lines[0]).toBe('Note: 1.1 Do (Do4 Mi4 Sol4) (4 battiti)')
  })
  it('indica la nota più grave e la più acuta', () => {
    const lines = describeNotePattern(pattern([[72, 0, 4], [48, 4, 4], [60, 8, 4]]), project(), true)
    expect(lines).toContain('Dalla più grave alla più acuta: Do3 – Do5')
  })
  it('segnala le note fuori scala, una volta per nota, alla prima posizione', () => {
    const lines = describeNotePattern(pattern([[73, 16, 4], [61, 4, 4], [66, 8, 4], [60, 0, 4]]), project(), true)
    expect(lines.at(-1)).toBe('Note fuori dalla scala: Do# (1.2), Fa# (1.3)')
  })
  it('non scrive la riga fuori scala se tutte le note sono nella scala', () => {
    const lines = describeNotePattern(pattern([[60, 0, 4], [64, 4, 4], [67, 8, 4]]), project(), true)
    expect(lines.some((l) => l.includes('fuori dalla scala'))).toBe(false)
  })
  it('senza scala scelta non segnala note fuori scala', () => {
    const lines = describeNotePattern(pattern([[61, 0, 4]]), project({ root: 0, type: 'none' }), true)
    expect(lines.some((l) => l.includes('fuori dalla scala'))).toBe(false)
  })
  it('tiene conto della tonalità del progetto', () => {
    const lines = describeNotePattern(pattern([[60, 0, 4], [61, 4, 4]]), project({ root: 9, type: 'minor' }), true)
    expect(lines.at(-1)).toBe('Note fuori dalla scala: Do# (1.2)')
  })
  it('per le percussioni (non tonali) elenca solo le note', () => {
    const lines = describeNotePattern(pattern([[61, 0, 4], [55, 4, 4]]), project(), false)
    expect(lines).toHaveLength(1)
    expect(lines[0].startsWith('Note: ')).toBe(true)
  })
  it('elenca al massimo 48 gruppi e dice quanti mancano', () => {
    const notes = Array.from({ length: 50 }, (_, i): [number, number, number] => [60, i, 1])
    const [line] = describeNotePattern(pattern(notes), project(), false)
    expect(line.split(' · ')).toHaveLength(49)
    expect(line.endsWith('… altre 2')).toBe(true)
  })
  it('con esattamente 48 gruppi non scrive "altre"', () => {
    const notes = Array.from({ length: 48 }, (_, i): [number, number, number] => [60, i, 1])
    const [line] = describeNotePattern(pattern(notes), project(), false)
    expect(line).not.toContain('altre')
  })
})
