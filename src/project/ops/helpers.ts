import { LIMITS } from '../limits'
import type { Pattern, Project, Track } from '../types'

export function findTrack(project: Project, trackId: string): Track | undefined {
  return project.tracks.find((t) => t.id === trackId)
}

export function findPattern(project: Project, patternId: string): Pattern | undefined {
  return project.patterns.find((p) => p.id === patternId)
}

export function patternsOfTrack(project: Project, trackId: string): Pattern[] {
  return project.patterns.filter((p) => p.trackId === trackId)
}

/** Applica `fn` all'elemento con quell'id. Se nulla cambia, restituisce lo stesso array. */
function mapById<T extends { id: string }>(items: T[], id: string, fn: (item: T) => T): T[] {
  let changed = false
  const next = items.map((item) => {
    if (item.id !== id) return item
    const updated = fn(item)
    if (updated !== item) changed = true
    return updated
  })
  return changed ? next : items
}

/** Le operazioni senza effetto restituiscono lo stesso progetto: così non creano passi di "Annulla" vuoti. */
export function mapTrack(project: Project, trackId: string, fn: (t: Track) => Track): Project {
  const tracks = mapById(project.tracks, trackId, fn)
  return tracks === project.tracks ? project : { ...project, tracks }
}

export function mapPattern(project: Project, patternId: string, fn: (p: Pattern) => Pattern): Project {
  const patterns = mapById(project.patterns, patternId, fn)
  return patterns === project.patterns ? project : { ...project, patterns }
}

/** True se i due array contengono gli stessi elementi (stessi riferimenti) nello stesso ordine. */
export function sameItems<T>(a: T[], b: T[]): boolean {
  return a.length === b.length && a.every((item, i) => item === b[i])
}

export function clampNumber(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min
  return Math.min(max, Math.max(min, value))
}

/** Primo nome libero del tipo "Pattern 1", "Pattern 2"... sempre entro la lunghezza massima. */
export function nextName(prefix: string, existing: string[]): string {
  let n = 1
  const make = () => {
    const suffix = ` ${n}`
    return `${prefix.slice(0, LIMITS.nameLength - suffix.length)}${suffix}`
  }
  while (existing.includes(make())) n++
  return make()
}
