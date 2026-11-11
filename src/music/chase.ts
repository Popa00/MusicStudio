import type { Project } from '../project/types'
import { patternsAtStep, type PlayTarget, type TriggerEvent } from './schedule'

/**
 * Note degli strumenti ancora "in corso" allo step `globalStep`: cominciate prima e non ancora finite.
 * Quando la musica parte o salta a metà di un accordo lungo, si suonano subito per il tempo che
 * resta (il "note chasing" dei programmi musicali); senza, l'accordo tacerebbe fino al successivo.
 * Solo tracce synth: un colpo di batteria o di percussione ripetuto a metà non avrebbe senso.
 */
export function sustainedNotesAt(project: Project, target: PlayTarget, globalStep: number): TriggerEvent[] {
  const events: TriggerEvent[] = []
  for (const { pattern, local } of patternsAtStep(project, target, globalStep)) {
    if (pattern.kind !== 'notes') continue
    const track = project.tracks.find((t) => t.id === pattern.trackId)
    if (track?.kind !== 'synth') continue
    for (const note of pattern.notes) {
      const remaining = note.start + note.duration - local
      if (note.start < local && remaining > 0) {
        events.push({ kind: 'note', trackId: pattern.trackId, pitch: note.pitch, durationSteps: remaining, velocity: note.velocity })
      }
    }
  }
  return events
}
