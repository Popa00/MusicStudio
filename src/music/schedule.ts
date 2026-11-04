import { songLengthBars } from '../project/ops/clips'
import { findPattern } from '../project/ops/helpers'
import { patternSteps } from '../project/ops/patternLength'
import type { Pattern, Project } from '../project/types'
import { hitsAt, type DrumVoiceId } from './drumPattern'
import { stepsPerBar } from './timing'

export type TriggerEvent =
  | { kind: 'drum'; trackId: string; voice: DrumVoiceId; velocity: number }
  | { kind: 'note'; trackId: string; pitch: number; durationSteps: number; velocity: number }

/** Cosa suonare: tutto il brano, oppure solo un pattern in loop. */
export type PlayTarget = { mode: 'song' } | { mode: 'pattern'; patternId: string }

/** Eventi che partono in un certo step di un pattern. */
export function patternEventsAt(pattern: Pattern, step: number): TriggerEvent[] {
  const trackId = pattern.trackId
  if (pattern.kind === 'drums') {
    return hitsAt(pattern.steps, step).map(({ voice, velocity }) => ({ kind: 'drum', trackId, voice, velocity }))
  }
  return pattern.notes
    .filter((n) => n.start === step)
    .map((n) => ({ kind: 'note', trackId, pitch: n.pitch, durationSteps: n.duration, velocity: n.velocity }))
}

/** Tutti gli eventi da suonare allo step `globalStep` (contato dall'inizio). */
export function eventsAtStep(project: Project, target: PlayTarget, globalStep: number): TriggerEvent[] {
  if (target.mode === 'pattern') {
    const pattern = findPattern(project, target.patternId)
    if (!pattern) return []
    return patternEventsAt(pattern, globalStep % patternSteps(pattern, project.timeSignature))
  }
  const barSteps = stepsPerBar(project.timeSignature)
  const events: TriggerEvent[] = []
  for (const clip of project.clips) {
    const pattern = findPattern(project, clip.patternId)
    if (!pattern) continue
    const local = globalStep - clip.startBar * barSteps
    if (local >= 0 && local < patternSteps(pattern, project.timeSignature)) {
      events.push(...patternEventsAt(pattern, local))
    }
  }
  return events
}

/** Lunghezza del loop di riproduzione, in battute. */
export function loopLengthBars(project: Project, target: PlayTarget): number {
  if (target.mode === 'pattern') return findPattern(project, target.patternId)?.lengthBars ?? 1
  return songLengthBars(project)
}

/** Step del pattern che sta suonando ora (per evidenziarlo nell'editor), o null. */
export function playingStepOfPattern(project: Project, target: PlayTarget, patternId: string, globalStep: number): number | null {
  const pattern = findPattern(project, patternId)
  if (!pattern) return null
  const total = patternSteps(pattern, project.timeSignature)
  if (target.mode === 'pattern') return target.patternId === patternId ? globalStep % total : null
  const barSteps = stepsPerBar(project.timeSignature)
  for (const clip of project.clips) {
    if (clip.patternId !== patternId) continue
    const local = globalStep - clip.startBar * barSteps
    if (local >= 0 && local < total) return local
  }
  return null
}
