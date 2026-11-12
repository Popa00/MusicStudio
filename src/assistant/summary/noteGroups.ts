import { identifyChord, type Chord } from '../../music/chords'
import type { Note } from '../../project/types'

/** Note che partono nello stesso istante: una nota singola oppure un accordo. */
export interface NoteGroup {
  start: number
  /** La durata più lunga del gruppo, in step. */
  duration: number
  pitches: number[]
  chord: Chord | null
}

/** Raggruppa le note per istante di partenza, in ordine di tempo. */
export function noteGroups(notes: readonly Note[]): NoteGroup[] {
  const byStart = new Map<number, Note[]>()
  for (const note of notes) byStart.set(note.start, [...(byStart.get(note.start) ?? []), note])
  return [...byStart.entries()]
    .sort(([a], [b]) => a - b)
    .map(([start, group]) => {
      const pitches = group.map((n) => n.pitch).sort((a, b) => a - b)
      return { start, duration: Math.max(...group.map((n) => n.duration)), pitches, chord: identifyChord(pitches) }
    })
}
