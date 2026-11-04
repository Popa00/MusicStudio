import type { DrumVoiceId } from '../../music/drumPattern'
import { DEFAULT_DRUM_VELOCITY, DEFAULT_NOTE_VELOCITY } from '../../music/velocity'
import { createEmptyProject, createPattern, createTrack } from '../factory'
import { newId } from '../ids'
import { findPreset } from '../synthPresets'
import type { DrumPatternData, Note, Pattern, Project, Track } from '../types'

/** Uno step acceso, oppure [step, intensità]. */
export type DrumHitSpec = number | [number, number]

/** [pitch, start, duration] con intensità facoltativa. */
export type NoteSpec = [number, number, number] | [number, number, number, number]

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

  /**
   * `hits` mappa ogni suono agli step accesi, es. { kick: [0, 4, 8, 12] }.
   * Un colpo può essere anche [step, intensità], es. [2, 0.5] per un colpo più leggero.
   */
  drumPattern(track: Track, name: string, hits: Partial<Record<DrumVoiceId, DrumHitSpec[]>>, bars = 1): Pattern {
    const pattern = createPattern(track, name, this.project.timeSignature, bars) as DrumPatternData
    for (const [voice, specs] of Object.entries(hits) as [DrumVoiceId, DrumHitSpec[]][]) {
      for (const spec of specs) {
        const [step, velocity] = typeof spec === 'number' ? [spec, DEFAULT_DRUM_VELOCITY] : spec
        pattern.steps[voice][step] = velocity
      }
    }
    return this.addPattern(pattern)
  }

  /** `notes`: [pitch, start, duration] oppure [pitch, start, duration, intensità]. */
  notePattern(track: Track, name: string, notes: NoteSpec[], bars = 1): Pattern {
    const base = createPattern(track, name, this.project.timeSignature, bars)
    const list: Note[] = notes.map(([pitch, start, duration, velocity = DEFAULT_NOTE_VELOCITY]) => ({ id: newId(), pitch, start, duration, velocity }))
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
