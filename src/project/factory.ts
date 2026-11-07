import { createEmptyPattern, type DrumVoiceId } from '../music/drumPattern'
import { DEFAULT_BPM, stepsPerBar, type TimeSignature } from '../music/timing'
import { newId } from './ids'
import { PROJECT_FORMAT_VERSION } from './schema/project'
import { DEFAULT_SYNTH } from './synthPresets'
import type { MixerSettings, Pattern, PercussionSound, Project, SynthSettings, Track, TrackKind } from './types'

export const DEFAULT_MIXER: MixerSettings = { volumeDb: 0, pan: 0, mute: false, solo: false }

/** Suono di partenza di una traccia "percussione": il suono così com'è, intero. */
export function defaultPercussionSound(voice: DrumVoiceId = 'hihatClosed'): PercussionSound {
  return { voice, tune: 0, length: 1 }
}

export function createTrack(kind: TrackKind, name: string, synth: SynthSettings = DEFAULT_SYNTH): Track {
  const base = { id: newId(), name, mixer: DEFAULT_MIXER, effects: [] }
  if (kind === 'drums') return { ...base, kind }
  if (kind === 'percussion') return { ...base, kind, sound: defaultPercussionSound() }
  return { ...base, kind, synth }
}

export function createPattern(track: Track, name: string, ts: TimeSignature, lengthBars = 1): Pattern {
  const base = { id: newId(), trackId: track.id, name, lengthBars }
  if (track.kind === 'drums') {
    return { ...base, kind: 'drums', steps: createEmptyPattern(lengthBars * stepsPerBar(ts)) }
  }
  return { ...base, kind: 'notes', notes: [] }
}

export function createEmptyProject(name = 'Nuovo progetto'): Project {
  return {
    formatVersion: PROJECT_FORMAT_VERSION,
    name,
    bpm: DEFAULT_BPM,
    timeSignature: { beatsPerBar: 4, beatUnit: 4 },
    scale: { root: 0, type: 'major' },
    master: { volumeDb: 0 },
    tracks: [],
    patterns: [],
    clips: [],
  }
}
