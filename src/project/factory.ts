import { createEmptyPattern } from '../music/drumPattern'
import { DEFAULT_BPM, stepsPerBar, type TimeSignature } from '../music/timing'
import { newId } from './ids'
import { PROJECT_FORMAT_VERSION } from './schema/project'
import { DEFAULT_SYNTH } from './synthPresets'
import type { MixerSettings, Pattern, Project, SynthSettings, Track, TrackKind } from './types'

export const DEFAULT_MIXER: MixerSettings = { volumeDb: 0, pan: 0, mute: false, solo: false }

export function createTrack(kind: TrackKind, name: string, synth: SynthSettings = DEFAULT_SYNTH): Track {
  const base = { id: newId(), name, mixer: DEFAULT_MIXER, effects: [] }
  return kind === 'drums' ? { ...base, kind } : { ...base, kind, synth }
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
