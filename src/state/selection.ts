import type { PlayTarget } from '../music/schedule'
import { findPattern, findTrack, patternsOfTrack } from '../project/ops/helpers'
import type { Pattern, Project, Track } from '../project/types'
import type { PlayMode } from './uiStore'

export interface Selection {
  track: Track | null
  pattern: Pattern | null
}

/**
 * Traccia e pattern selezionati, con ripiego sensato se la selezione non è più valida
 * (es. dopo annulla o apertura di un altro progetto): prima traccia, primo pattern.
 */
export function resolveSelection(project: Project, trackId: string | null, patternId: string | null): Selection {
  const track = (trackId && findTrack(project, trackId)) || project.tracks[0] || null
  if (!track) return { track: null, pattern: null }
  const selected = patternId ? findPattern(project, patternId) : undefined
  const pattern = selected?.trackId === track.id ? selected : patternsOfTrack(project, track.id)[0]
  return { track, pattern: pattern ?? null }
}

export function resolvePlayTarget(project: Project, mode: PlayMode, trackId: string | null, patternId: string | null): PlayTarget {
  if (mode === 'song') return { mode: 'song' }
  const { pattern } = resolveSelection(project, trackId, patternId)
  return pattern ? { mode: 'pattern', patternId: pattern.id } : { mode: 'song' }
}
