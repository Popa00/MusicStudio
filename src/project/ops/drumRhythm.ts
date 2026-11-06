import { createEmptyPattern, type DrumVoiceId } from '../../music/drumPattern'
import { stepsPerBar } from '../../music/timing'
import { clampVelocity, DEFAULT_DRUM_VELOCITY } from '../../music/velocity'
import type { RhythmHits } from '../rhythms/build'
import type { Project } from '../types'
import { mapPattern } from './helpers'
import { patternSteps } from './patternLength'

/**
 * Sostituisce il contenuto di un pattern di batteria con un ritmo pronto, ripetuto in ogni battuta.
 * I colpi oltre la fine della battuta (es. in metriche più corte) vengono ignorati.
 */
export function applyRhythm(project: Project, patternId: string, hits: RhythmHits): Project {
  return mapPattern(project, patternId, (p) => {
    if (p.kind !== 'drums') return p
    const total = patternSteps(p, project.timeSignature)
    const barLength = stepsPerBar(project.timeSignature)
    const steps = createEmptyPattern(total)
    for (const [voice, specs] of Object.entries(hits) as [DrumVoiceId, NonNullable<RhythmHits[DrumVoiceId]>][]) {
      for (const spec of specs) {
        const [step, velocity] = typeof spec === 'number' ? [spec, DEFAULT_DRUM_VELOCITY] : spec
        if (step < 0 || step >= barLength) continue
        for (let at = step; at < total; at += barLength) steps[voice][at] = clampVelocity(velocity, DEFAULT_DRUM_VELOCITY)
      }
    }
    return { ...p, steps }
  })
}
