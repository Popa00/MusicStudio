import { stepsPerBar, type TimeSignature } from '../../music/timing'
import { LIMITS } from '../limits'
import type { Pattern, Project } from '../types'
import { overlaps } from './clips'
import { clampNumber, findPattern, mapPattern } from './helpers'

export function patternSteps(pattern: Pattern, ts: TimeSignature): number {
  return pattern.lengthBars * stepsPerBar(ts)
}

function resizeSteps(row: boolean[], length: number): boolean[] {
  return Array.from({ length }, (_, i) => row[i] === true)
}

/** Cambia la lunghezza del pattern: le caselle in più sono vuote, le note oltre la fine vengono tolte. */
export function resizePattern(pattern: Pattern, lengthBars: number, ts: TimeSignature): Pattern {
  const bars = Math.round(clampNumber(lengthBars, 1, LIMITS.patternBars))
  const total = bars * stepsPerBar(ts)
  if (pattern.kind === 'drums') {
    const steps = { ...pattern.steps }
    for (const voice of Object.keys(steps) as (keyof typeof steps)[]) {
      steps[voice] = resizeSteps(steps[voice], total)
    }
    return { ...pattern, lengthBars: bars, steps }
  }
  const notes = pattern.notes
    .filter((n) => n.start < total)
    .map((n) => ({ ...n, duration: Math.min(n.duration, total - n.start) }))
  return { ...pattern, lengthBars: bars, notes }
}

/**
 * Cambia la lunghezza del pattern. Se i suoi blocchi sulla linea del tempo finirebbero sopra
 * altri blocchi o oltre la fine del brano, il cambio viene rifiutato (progetto invariato).
 */
export function setPatternLength(project: Project, patternId: string, lengthBars: number): Project {
  const next = mapPattern(project, patternId, (p) =>
    p.lengthBars === lengthBars ? p : resizePattern(p, lengthBars, project.timeSignature),
  )
  const length = findPattern(next, patternId)?.lengthBars ?? 1
  const fits = next.clips
    .filter((c) => c.patternId === patternId)
    .every((c) => c.startBar + length <= LIMITS.songBars && !overlaps(next, c.trackId, patternId, c.startBar, c.id))
  return fits ? next : project
}
