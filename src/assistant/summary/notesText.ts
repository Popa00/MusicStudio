import { isInScale } from '../../music/scales'
import { pitchClassName } from '../../music/notes'
import type { NotePatternData, Project } from '../../project/types'
import { beatsLabel, noteLabel, positionLabel } from './format'
import { noteGroups, type NoteGroup } from './noteGroups'

/** Note o accordi elencati al massimo per pattern (il riassunto deve restare corto). */
const MAX_GROUPS = 48

function groupLabel(group: NoteGroup): string {
  const notes = group.pitches.map(noteLabel).join(' ')
  return group.chord ? `${group.chord.name} (${notes})` : notes
}

function outOfScale(pattern: NotePatternData, project: Project): string | null {
  const { root, type } = project.scale
  const found = new Map<number, number>()
  for (const note of [...pattern.notes].sort((a, b) => a.start - b.start)) {
    const pc = note.pitch % 12
    if (!isInScale(note.pitch, root, type) && !found.has(pc)) found.set(pc, note.start)
  }
  if (found.size === 0) return null
  const items = [...found].map(([pc, start]) => `${pitchClassName(pc)} (${positionLabel(start, project.timeSignature)})`)
  return `Note fuori dalla scala: ${items.join(', ')}`
}

/**
 * Le note di un pattern: posizione, nome con ottava, durata; gli accordi con il loro nome già calcolato.
 * `tonal`: false per le percussioni, dove l'altezza della nota cambia solo l'intonazione del suono.
 */
export function describeNotePattern(pattern: NotePatternData, project: Project, tonal: boolean): string[] {
  const ts = project.timeSignature
  const groups = noteGroups(pattern.notes)
  if (groups.length === 0) return ['(nessuna nota)']
  const items = groups.slice(0, MAX_GROUPS).map((g) => `${positionLabel(g.start, ts)} ${groupLabel(g)} (${beatsLabel(g.duration, ts)})`)
  const more = groups.length > MAX_GROUPS ? ` · … altre ${groups.length - MAX_GROUPS}` : ''
  const lines = [`Note: ${items.join(' · ')}${more}`]
  if (!tonal) return lines
  const pitches = pattern.notes.map((n) => n.pitch)
  lines.push(`Dalla più grave alla più acuta: ${noteLabel(Math.min(...pitches))} – ${noteLabel(Math.max(...pitches))}`)
  const outside = project.scale.type === 'none' ? null : outOfScale(pattern, project)
  if (outside) lines.push(outside)
  return lines
}
