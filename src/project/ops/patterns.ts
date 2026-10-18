import { createPattern } from '../factory'
import { newId } from '../ids'
import { LIMITS } from '../limits'
import type { Project } from '../types'
import { findPattern, findTrack, nextName, patternsOfTrack } from './helpers'

type Result = { project: Project; patternId: string | null }

export function addPattern(project: Project, trackId: string): Result {
  const track = findTrack(project, trackId)
  if (!track || project.patterns.length >= LIMITS.patterns) return { project, patternId: null }
  const names = patternsOfTrack(project, trackId).map((p) => p.name)
  const pattern = createPattern(track, nextName('Pattern', names), project.timeSignature)
  return { project: { ...project, patterns: [...project.patterns, pattern] }, patternId: pattern.id }
}

/** Copia un pattern (per fare una variazione senza toccare l'originale). */
export function duplicatePattern(project: Project, patternId: string): Result {
  const source = findPattern(project, patternId)
  if (!source || project.patterns.length >= LIMITS.patterns) return { project, patternId: null }
  const names = patternsOfTrack(project, source.trackId).map((p) => p.name)
  const copy = structuredClone(source)
  copy.id = newId()
  copy.name = nextName(`${source.name} copia`, names)
  if (copy.kind === 'notes') copy.notes = copy.notes.map((n) => ({ ...n, id: newId() }))
  return { project: { ...project, patterns: [...project.patterns, copy] }, patternId: copy.id }
}

export function renamePattern(project: Project, patternId: string, name: string): Project {
  const clean = name.slice(0, LIMITS.nameLength)
  return { ...project, patterns: project.patterns.map((p) => (p.id === patternId ? { ...p, name: clean } : p)) }
}

/** Elimina il pattern e tutti i blocchi della linea del tempo che lo usano. */
export function removePattern(project: Project, patternId: string): Project {
  return {
    ...project,
    patterns: project.patterns.filter((p) => p.id !== patternId),
    clips: project.clips.filter((c) => c.patternId !== patternId),
  }
}
