import type { DrumVoiceId } from '../../music/drumPattern'
import { createPattern, createTrack, defaultPercussionSound } from '../factory'
import { newId } from '../ids'
import { LIMITS } from '../limits'
import { percussionSoundSchema } from '../schema/track'
import type { Clip, Note, PercussionSound, Project, Track } from '../types'
import { findPattern, mapTrack, nextName } from './helpers'

/** La nota che suona il suono così com'è (Do centrale): più in alto è più acuto. */
export const PERCUSSION_ROOT_PITCH = 60

function percussionTrack(project: Project, voice: DrumVoiceId, label: string): Track {
  const names = project.tracks.map((t) => t.name)
  const name = names.includes(label) ? nextName(label, names) : label
  return { ...createTrack('percussion', name), kind: 'percussion', sound: defaultPercussionSound(voice) }
}

function hasRoom(project: Project, clips = 0): boolean {
  return (
    project.tracks.length < LIMITS.tracks &&
    project.patterns.length < LIMITS.patterns &&
    project.clips.length + clips <= LIMITS.clips
  )
}

/** Nuova traccia con un solo suono di batteria, suonabile come uno strumento. */
export function addPercussionTrack(project: Project, voice: DrumVoiceId, label: string): { project: Project; trackId: string | null } {
  if (!hasRoom(project)) return { project, trackId: null }
  const track = percussionTrack(project, voice, label)
  const pattern = createPattern(track, 'Pattern 1', project.timeSignature)
  return {
    project: { ...project, tracks: [...project.tracks, track], patterns: [...project.patterns, pattern] },
    trackId: track.id,
  }
}

/**
 * Sposta una riga della batteria (di questo pattern) su una traccia nuova tutta sua: i colpi
 * diventano note sul Do centrale, nelle stesse battute del brano. La riga della batteria si svuota.
 */
export function moveDrumRowToTrack(
  project: Project,
  patternId: string,
  voice: DrumVoiceId,
  label: string,
): { project: Project; trackId: string | null } {
  const source = findPattern(project, patternId)
  if (source?.kind !== 'drums') return { project, trackId: null }
  const sourceClips = project.clips.filter((c) => c.patternId === patternId)
  if (!hasRoom(project, sourceClips.length)) return { project, trackId: null }

  const track = percussionTrack(project, voice, label)
  const notes: Note[] = source.steps[voice].flatMap((velocity, start) =>
    velocity > 0 ? [{ id: newId(), pitch: PERCUSSION_ROOT_PITCH, start, duration: 1, velocity }] : [],
  )
  const base = createPattern(track, source.name, project.timeSignature, source.lengthBars)
  const pattern = { ...base, kind: 'notes' as const, notes }
  const clips: Clip[] = sourceClips.map((c) => ({ id: newId(), trackId: track.id, patternId: pattern.id, startBar: c.startBar }))
  const emptied = { ...source, steps: { ...source.steps, [voice]: source.steps[voice].map(() => 0) } }

  return {
    project: {
      ...project,
      tracks: [...project.tracks, track],
      patterns: [...project.patterns.map((p) => (p.id === patternId ? emptied : p)), pattern],
      clips: [...project.clips, ...clips],
    },
    trackId: track.id,
  }
}

/** Cambia suono, intonazione o lunghezza di una traccia percussione. Valori fuori range ignorati. */
export function updatePercussion(project: Project, trackId: string, changes: Partial<PercussionSound>): Project {
  return mapTrack(project, trackId, (t) => {
    if (t.kind !== 'percussion') return t
    const parsed = percussionSoundSchema.safeParse({ ...t.sound, ...changes })
    return parsed.success ? { ...t, sound: parsed.data } : t
  })
}
