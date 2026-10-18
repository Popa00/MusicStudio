import type { DrumVoiceId } from '../../music/drumPattern'
import { createEmptyProject, createPattern, createTrack } from '../factory'
import { newId } from '../ids'
import { findPreset } from '../synthPresets'
import type { DrumPatternData, Note, Pattern, Project, Track } from '../types'

/** Piccolo costruttore per scrivere i progetti di partenza in modo leggibile. */
export class TemplateBuilder {
  project: Project

  constructor(name: string, bpm: number) {
    this.project = { ...createEmptyProject(name), bpm }
  }

  drums(name: string): Track {
    return this.addTrack(createTrack('drums', name))
  }

  synth(name: string, presetName: string, volumeDb = 0): Track {
    const preset = findPreset(presetName)
    const track = createTrack('synth', name, preset?.settings)
    return this.addTrack({ ...track, mixer: { ...track.mixer, volumeDb } })
  }

  /** `hits` mappa ogni suono agli step accesi, es. { kick: [0, 4, 8, 12] }. */
  drumPattern(track: Track, name: string, hits: Partial<Record<DrumVoiceId, number[]>>, bars = 1): Pattern {
    const pattern = createPattern(track, name, this.project.timeSignature, bars) as DrumPatternData
    for (const [voice, steps] of Object.entries(hits) as [DrumVoiceId, number[]][]) {
      for (const s of steps) pattern.steps[voice][s] = true
    }
    return this.addPattern(pattern)
  }

  /** `notes`: [pitch, start, duration]. */
  notePattern(track: Track, name: string, notes: [number, number, number][], bars = 1): Pattern {
    const base = createPattern(track, name, this.project.timeSignature, bars)
    const list: Note[] = notes.map(([pitch, start, duration]) => ({ id: newId(), pitch, start, duration, velocity: 0.8 }))
    return this.addPattern({ ...base, kind: 'notes', notes: list } as Pattern)
  }

  place(pattern: Pattern, ...bars: number[]): void {
    const clips = bars.map((startBar) => ({ id: newId(), trackId: pattern.trackId, patternId: pattern.id, startBar }))
    this.project = { ...this.project, clips: [...this.project.clips, ...clips] }
  }

  private addTrack(track: Track): Track {
    this.project = { ...this.project, tracks: [...this.project.tracks, track] }
    return track
  }

  private addPattern(pattern: Pattern): Pattern {
    this.project = { ...this.project, patterns: [...this.project.patterns, pattern] }
    return pattern
  }
}
