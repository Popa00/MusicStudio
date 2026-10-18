import { createPattern, createTrack } from '../factory'
import { LIMITS } from '../limits'
import { synthSettingsSchema } from '../schema/track'
import type { MixerSettings, Project, SynthSettings, TrackKind } from '../types'
import { clampNumber, mapTrack, nextName } from './helpers'

const DEFAULT_NAMES: Record<TrackKind, string> = { drums: 'Batteria', synth: 'Strumento' }

/** Aggiunge una traccia con un primo pattern vuoto. */
export function addTrack(project: Project, kind: TrackKind): { project: Project; trackId: string | null } {
  if (project.tracks.length >= LIMITS.tracks || project.patterns.length >= LIMITS.patterns) {
    return { project, trackId: null }
  }
  const name = nextName(DEFAULT_NAMES[kind], project.tracks.map((t) => t.name))
  const track = createTrack(kind, name)
  const pattern = createPattern(track, 'Pattern 1', project.timeSignature)
  return {
    project: { ...project, tracks: [...project.tracks, track], patterns: [...project.patterns, pattern] },
    trackId: track.id,
  }
}

/** Elimina la traccia con i suoi pattern e i suoi blocchi. */
export function removeTrack(project: Project, trackId: string): Project {
  return {
    ...project,
    tracks: project.tracks.filter((t) => t.id !== trackId),
    patterns: project.patterns.filter((p) => p.trackId !== trackId),
    clips: project.clips.filter((c) => c.trackId !== trackId),
  }
}

export function renameTrack(project: Project, trackId: string, name: string): Project {
  return mapTrack(project, trackId, (t) => ({ ...t, name: name.slice(0, LIMITS.nameLength) }))
}

export function updateMixer(project: Project, trackId: string, changes: Partial<MixerSettings>): Project {
  return mapTrack(project, trackId, (t) => {
    const mixer = { ...t.mixer, ...changes }
    mixer.volumeDb = clampNumber(mixer.volumeDb, -60, 6)
    mixer.pan = clampNumber(mixer.pan, -1, 1)
    return { ...t, mixer }
  })
}

/** Cambia le impostazioni del sintetizzatore. Valori fuori range vengono ignorati. */
export function updateSynth(project: Project, trackId: string, changes: Partial<SynthSettings>): Project {
  return mapTrack(project, trackId, (t) => {
    if (t.kind !== 'synth') return t
    const parsed = synthSettingsSchema.safeParse({ ...t.synth, ...changes })
    return parsed.success ? { ...t, synth: parsed.data } : t
  })
}
