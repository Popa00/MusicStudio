import { LIMITS } from '../project/limits'
import { resizePattern } from '../project/ops/patternLength'
import type { Clip, Pattern, Project, Track } from '../project/types'

function uniqueById<T extends { id: string }>(items: T[]): T[] {
  const seen = new Set<string>()
  return items.filter((item) => !seen.has(item.id) && seen.add(item.id))
}

function kindMatches(track: Track, pattern: Pattern): boolean {
  return (track.kind === 'drums') === (pattern.kind === 'drums')
}

function normalizePattern(pattern: Pattern, project: Project): Pattern {
  const resized = resizePattern(pattern, pattern.lengthBars, project.timeSignature)
  return resized.kind === 'notes' ? { ...resized, notes: uniqueById(resized.notes) } : resized
}

/** Tiene solo i blocchi dentro il brano e non sovrapposti ad altri della stessa traccia. */
function validClips(clips: Clip[], patternById: Map<string, Pattern>): Clip[] {
  const occupied = new Map<string, boolean[]>()
  const accepted = new Set<Clip>()
  for (const clip of [...clips].sort((a, b) => a.startBar - b.startBar)) {
    const pattern = patternById.get(clip.patternId)
    if (pattern?.trackId !== clip.trackId) continue
    const end = clip.startBar + pattern.lengthBars
    if (end > LIMITS.songBars) continue
    const bars = occupied.get(clip.trackId) ?? []
    if (bars.slice(clip.startBar, end).some(Boolean)) continue
    for (let b = clip.startBar; b < end; b++) bars[b] = true
    occupied.set(clip.trackId, bars)
    accepted.add(clip)
  }
  // Mantiene l'ordine originale: un progetto già valido resta identico.
  return clips.filter((c) => accepted.has(c))
}

/**
 * Rende coerente un progetto già validato dallo schema: toglie riferimenti a tracce o pattern
 * inesistenti, id duplicati, blocchi sovrapposti o fuori dal brano, e riallinea le griglie.
 */
export function normalizeProject(project: Project): Project {
  const tracks = uniqueById(project.tracks).map((t) => ({ ...t, effects: uniqueById(t.effects) }))
  const trackById = new Map(tracks.map((t) => [t.id, t]))

  const patterns = uniqueById(project.patterns)
    .filter((p) => {
      const track = trackById.get(p.trackId)
      return track !== undefined && kindMatches(track, p)
    })
    .map((p) => normalizePattern(p, project))
  const patternById = new Map(patterns.map((p) => [p.id, p]))

  return { ...project, tracks, patterns, clips: validClips(uniqueById(project.clips), patternById) }
}
