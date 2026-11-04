import { z } from 'zod'
import { DEFAULT_DRUM_VELOCITY } from '../music/velocity'
import { LIMITS, MAX_PATTERN_STEPS } from '../project/limits'
import { drumPatternSchema, notePatternSchema } from '../project/schema/pattern'
import { projectSchema } from '../project/schema/project'
import type { Project } from '../project/types'

/** Versione 1: le caselle della batteria erano solo accese (true) o spente (false). */
const v1Steps = z.array(z.boolean()).max(MAX_PATTERN_STEPS)

const v1DrumPattern = drumPatternSchema.extend({
  steps: z.object({ kick: v1Steps, snare: v1Steps, clap: v1Steps, hihatClosed: v1Steps, hihatOpen: v1Steps }),
})

const v1ProjectSchema = projectSchema.extend({
  formatVersion: z.literal(1),
  patterns: z.array(z.discriminatedUnion('kind', [v1DrumPattern, notePatternSchema])).max(LIMITS.patterns),
})

type V1Project = z.infer<typeof v1ProjectSchema>

export type ParseOutcome = { success: true; data: Project } | { success: false; error: z.ZodError }

const toVelocity = (row: boolean[]) => row.map((on) => (on ? DEFAULT_DRUM_VELOCITY : 0))

function toV2(project: V1Project): unknown {
  const patterns = project.patterns.map((p) => {
    if (p.kind !== 'drums') return p
    const { kick, snare, clap, hihatClosed, hihatOpen } = p.steps
    const steps = {
      kick: toVelocity(kick),
      snare: toVelocity(snare),
      clap: toVelocity(clap),
      hihatClosed: toVelocity(hihatClosed),
      hihatOpen: toVelocity(hihatOpen),
    }
    return { ...p, steps }
  })
  return { ...project, formatVersion: 2, patterns }
}

function isV1(data: unknown): boolean {
  return typeof data === 'object' && data !== null && (data as { formatVersion?: unknown }).formatVersion === 1
}

/**
 * Valida un progetto di qualsiasi versione supportata e lo porta alla versione attuale.
 * Un file vecchio viene prima validato per intero con lo schema della sua versione, poi convertito
 * e validato di nuovo: i colpi accesi prendono la forza che avevano sempre avuto, il suono non cambia.
 */
export function parseAnyVersion(data: unknown): ParseOutcome {
  if (!isV1(data)) return projectSchema.safeParse(data)
  const v1 = v1ProjectSchema.safeParse(data)
  if (!v1.success) return { success: false, error: v1.error }
  return projectSchema.safeParse(toV2(v1.data))
}
