import { createEmptyPattern, setStepVelocity, toggleStep, type DrumPattern, type DrumVoiceId } from '../../music/drumPattern'
import type { Project } from '../types'
import { mapPattern } from './helpers'
import { patternSteps } from './patternLength'

function mapDrumSteps(project: Project, patternId: string, fn: (steps: DrumPattern) => DrumPattern): Project {
  return mapPattern(project, patternId, (p) => {
    if (p.kind !== 'drums') return p
    const steps = fn(p.steps)
    return steps === p.steps ? p : { ...p, steps }
  })
}

export function toggleDrumStep(project: Project, patternId: string, voice: DrumVoiceId, step: number): Project {
  return mapDrumSteps(project, patternId, (steps) => toggleStep(steps, voice, step))
}

/** Cambia la forza di un colpo già acceso. */
export function setDrumStepVelocity(project: Project, patternId: string, voice: DrumVoiceId, step: number, velocity: number): Project {
  return mapDrumSteps(project, patternId, (steps) => setStepVelocity(steps, voice, step, velocity))
}

/** Svuota un pattern: tutte le caselle (batteria) o tutte le note (strumento). */
export function clearPattern(project: Project, patternId: string): Project {
  return mapPattern(project, patternId, (p) =>
    p.kind === 'drums'
      ? { ...p, steps: createEmptyPattern(patternSteps(p, project.timeSignature)) }
      : { ...p, notes: [] },
  )
}
