import { LIMITS } from '../limits'
import { newId } from '../ids'
import type { Note, NotePatternData, Project } from '../types'
import { findPattern, mapPattern, sameItems } from './helpers'
import { clampNote, type NoteInput } from './notes'
import { patternSteps } from './patternLength'

/** Altezze ammesse per un gruppo spostato (di default tutta la tastiera MIDI). */
export interface PitchRange {
  min: number
  max: number
}

const FULL_RANGE: PitchRange = { min: 0, max: 127 }

function notePattern(project: Project, patternId: string): NotePatternData | undefined {
  const p = findPattern(project, patternId)
  return p?.kind === 'notes' ? p : undefined
}

function mapNotes(project: Project, patternId: string, fn: (p: NotePatternData) => Note[]): Project {
  return mapPattern(project, patternId, (p) => {
    if (p.kind !== 'notes') return p
    const notes = fn(p)
    return sameItems(notes, p.notes) ? p : { ...p, notes }
  })
}

/**
 * Limita lo spostamento a [min, max], ma senza mai obbligare a muoversi: se il gruppo è già fuori
 * dall'intervallo (es. note importate fuori dalla parte visibile), lo zero resta sempre ammesso.
 */
function clampDelta(delta: number, min: number, max: number): number {
  return Math.round(Math.min(Math.max(0, max), Math.max(Math.min(0, min), delta)))
}

/**
 * Sposta un gruppo di note di `dStep` step e `dPitch` semitoni rispetto alle posizioni `originals`.
 * Lo spostamento viene ridotto perché tutto il gruppo resti dentro il pattern e nell'intervallo
 * di altezze: le note non si accorciano e non si "schiacciano" contro i bordi.
 */
export function moveNotes(project: Project, patternId: string, originals: Note[], dStep: number, dPitch: number, range = FULL_RANGE): Project {
  const p = notePattern(project, patternId)
  if (!p || originals.length === 0) return project
  const total = patternSteps(p, project.timeSignature)
  const step = clampDelta(dStep, -Math.min(...originals.map((n) => n.start)), total - Math.max(...originals.map((n) => n.start + n.duration)))
  const pitch = clampDelta(dPitch, range.min - Math.min(...originals.map((n) => n.pitch)), range.max - Math.max(...originals.map((n) => n.pitch)))
  const byId = new Map(originals.map((n) => [n.id, n]))
  return mapNotes(project, patternId, (pattern) =>
    pattern.notes.map((n) => {
      const o = byId.get(n.id)
      if (!o) return n
      // Ultima rete: valori sempre validi per lo schema, così il progetto si riapre.
      const moved = { ...n, start: Math.max(0, o.start + step), pitch: Math.min(127, Math.max(0, o.pitch + pitch)) }
      return moved.start === n.start && moved.pitch === n.pitch ? n : moved
    }),
  )
}

/** Allunga o accorcia tutte le note del gruppo di `dDuration` step (minimo 1, mai oltre la fine). */
export function resizeNotes(project: Project, patternId: string, originals: Note[], dDuration: number): Project {
  const p = notePattern(project, patternId)
  if (!p) return project
  const total = patternSteps(p, project.timeSignature)
  const byId = new Map(originals.map((n) => [n.id, n]))
  return mapNotes(project, patternId, (pattern) =>
    pattern.notes.map((n) => {
      const o = byId.get(n.id)
      if (!o) return n
      const duration = Math.round(Math.min(total - n.start, Math.max(1, o.duration + dDuration)))
      return duration === n.duration ? n : { ...n, duration }
    }),
  )
}

export function removeNotes(project: Project, patternId: string, noteIds: string[]): Project {
  const ids = new Set(noteIds)
  return mapNotes(project, patternId, (p) => p.notes.filter((n) => !ids.has(n.id)))
}

/**
 * Aggiunge più note in una volta (incolla). Le note che cadrebbero oltre la fine del pattern
 * vengono scartate, e non si supera il limite di note per pattern.
 */
export function insertNotes(project: Project, patternId: string, inputs: NoteInput[]): { project: Project; noteIds: string[] } {
  const p = notePattern(project, patternId)
  if (!p) return { project, noteIds: [] }
  const total = patternSteps(p, project.timeSignature)
  const room = LIMITS.notesPerPattern - p.notes.length
  const added = inputs
    .filter((n) => n.start >= 0 && n.start < total)
    .sort((a, b) => a.start - b.start)
    .slice(0, Math.max(0, room))
    .map((n) => clampNote({ ...n, id: newId() }, total))
  if (added.length === 0) return { project, noteIds: [] }
  const next = mapNotes(project, patternId, (pattern) => [...pattern.notes, ...added])
  return { project: next, noteIds: added.map((n) => n.id) }
}

/** Rettangolo di selezione, in step e altezze (estremi inclusi). */
export interface NoteRect {
  fromStep: number
  toStep: number
  lowPitch: number
  highPitch: number
}

/** Note che toccano il rettangolo (anche solo in parte). */
export function notesInRect(notes: Note[], rect: NoteRect): string[] {
  return notes
    .filter((n) => n.pitch >= rect.lowPitch && n.pitch <= rect.highPitch)
    .filter((n) => n.start <= rect.toStep && n.start + n.duration - 1 >= rect.fromStep)
    .map((n) => n.id)
}
