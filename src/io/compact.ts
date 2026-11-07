import { EXTRA_DRUM_VOICES } from '../music/drumPattern'
import type { Pattern, Project } from '../project/types'

/** 3 decimali bastano (0,1% di intensità) e tolgono numeri come 0.7166666666666667. */
const round = (v: number) => Math.round(v * 1000) / 1000

function compactPattern(pattern: Pattern): unknown {
  if (pattern.kind === 'notes') {
    return { ...pattern, notes: pattern.notes.map((n) => ({ ...n, velocity: round(n.velocity) })) }
  }
  const steps: Record<string, number[]> = {}
  for (const [voice, row] of Object.entries(pattern.steps)) {
    // Le percussioni in più senza colpi non si scrivono: aprendo il file tornano righe vuote.
    const extra = (EXTRA_DRUM_VOICES as readonly string[]).includes(voice)
    if (extra && row.every((v) => v === 0)) continue
    steps[voice] = row.map(round)
  }
  return { ...pattern, steps }
}

/**
 * Il progetto nella forma da salvare: più piccolo, così anche un brano grande resta sotto il
 * limite di dimensione dei file (con 21 righe di batteria sempre scritte poteva superarlo).
 */
export function compactProject(project: Project): unknown {
  return { ...project, patterns: project.patterns.map(compactPattern) }
}
