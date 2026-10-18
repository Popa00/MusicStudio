import { createEmptyPattern, toggleStep, type DrumVoiceId } from '../../music/drumPattern'
import type { Project } from '../types'
import { mapPattern } from './helpers'
import { patternSteps } from './patternLength'

export function toggleDrumStep(project: Project, patternId: string, voice: DrumVoiceId, step: number): Project {
  return mapPattern(project, patternId, (p) => {
    if (p.kind !== 'drums') return p
    const steps = toggleStep(p.steps, voice, step)
    return steps === p.steps ? p : { ...p, steps }
  })
}

/** Svuota un pattern: tutte le caselle (batteria) o tutte le note (strumento). */
export function clearPattern(project: Project, patternId: string): Project {
  return mapPattern(project, patternId, (p) =>
    p.kind === 'drums'
      ? { ...p, steps: createEmptyPattern(patternSteps(p, project.timeSignature)) }
      : { ...p, notes: [] },
  )
}
