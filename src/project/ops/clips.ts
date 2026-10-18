import { newId } from '../ids'
import { LIMITS } from '../limits'
import type { Clip, Project } from '../types'
import { findPattern } from './helpers'

/** Battute occupate da un blocco: [inizio, fine). */
export function clipSpan(project: Project, clip: Clip): [number, number] {
  const length = findPattern(project, clip.patternId)?.lengthBars ?? 1
  return [clip.startBar, clip.startBar + length]
}

/** True se un blocco del pattern messo a `startBar` si sovrappone ad altri blocchi della stessa traccia. */
export function overlaps(project: Project, trackId: string, patternId: string, startBar: number, ignoreClipId?: string): boolean {
  const length = findPattern(project, patternId)?.lengthBars ?? 1
  return project.clips.some((c) => {
    if (c.trackId !== trackId || c.id === ignoreClipId) return false
    const [s, e] = clipSpan(project, c)
    return startBar < e && s < startBar + length
  })
}

function fitsInSong(project: Project, patternId: string, startBar: number): boolean {
  const length = findPattern(project, patternId)?.lengthBars ?? 1
  return Number.isInteger(startBar) && startBar >= 0 && startBar + length <= LIMITS.songBars
}

export function addClip(project: Project, trackId: string, patternId: string, startBar: number): { project: Project; clipId: string | null } {
  const pattern = findPattern(project, patternId)
  const valid =
    pattern?.trackId === trackId &&
    project.clips.length < LIMITS.clips &&
    fitsInSong(project, patternId, startBar) &&
    !overlaps(project, trackId, patternId, startBar)
  if (!valid) return { project, clipId: null }
  const clip: Clip = { id: newId(), trackId, patternId, startBar }
  return { project: { ...project, clips: [...project.clips, clip] }, clipId: clip.id }
}

export function moveClip(project: Project, clipId: string, startBar: number): Project {
  const clip = project.clips.find((c) => c.id === clipId)
  if (!clip || !fitsInSong(project, clip.patternId, startBar)) return project
  if (overlaps(project, clip.trackId, clip.patternId, startBar, clipId)) return project
  return { ...project, clips: project.clips.map((c) => (c.id === clipId ? { ...c, startBar } : c)) }
}

export function removeClip(project: Project, clipId: string): Project {
  if (!project.clips.some((c) => c.id === clipId)) return project
  return { ...project, clips: project.clips.filter((c) => c.id !== clipId) }
}

/** Copia il blocco nel primo spazio libero dopo di esso. */
export function duplicateClip(project: Project, clipId: string): { project: Project; clipId: string | null } {
  const clip = project.clips.find((c) => c.id === clipId)
  if (!clip) return { project, clipId: null }
  let start = clipSpan(project, clip)[1]
  while (start < LIMITS.songBars && overlaps(project, clip.trackId, clip.patternId, start)) start++
  return addClip(project, clip.trackId, clip.patternId, start)
}

/** Durata del brano in battute: fino alla fine dell'ultimo blocco (minimo 1). */
export function songLengthBars(project: Project): number {
  return project.clips.reduce((max, c) => Math.max(max, clipSpan(project, c)[1]), 1)
}
