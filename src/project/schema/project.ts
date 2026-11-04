import { z } from 'zod'
import { BPM_MAX, BPM_MIN, stepsPerBar } from '../../music/timing'
import { SCALE_TYPES } from '../../music/scales'
import { LIMITS, MAX_STEPS_PER_BAR } from '../limits'
import { patternSchema } from './pattern'
import { trackSchema } from './track'

/** 2: le caselle della batteria hanno un'intensità (prima erano solo accese/spente). */
export const PROJECT_FORMAT_VERSION = 2

const id = z.string().min(1).max(64)

/** Un blocco sulla linea del tempo: "suona questo pattern a partire da questa battuta". */
export const clipSchema = z.object({
  id,
  trackId: id,
  patternId: id,
  startBar: z.number().int().min(0).max(LIMITS.songBars - 1),
})

export const projectSchema = z.object({
  formatVersion: z.literal(PROJECT_FORMAT_VERSION),
  name: z.string().max(LIMITS.nameLength),
  bpm: z.number().min(BPM_MIN).max(BPM_MAX),
  // Al massimo 16 step per battuta (es. 4/4, 3/4, 6/8): i limiti di pattern e note dipendono da questo.
  timeSignature: z
    .object({
      beatsPerBar: z.number().int().min(1).max(8),
      beatUnit: z.union([z.literal(4), z.literal(8)]),
    })
    .refine((ts) => stepsPerBar(ts) <= MAX_STEPS_PER_BAR, 'Tempo musicale non supportato'),
  scale: z.object({
    root: z.number().int().min(0).max(11),
    type: z.enum(SCALE_TYPES),
  }),
  master: z.object({ volumeDb: z.number().min(-60).max(6) }),
  tracks: z.array(trackSchema).max(LIMITS.tracks),
  patterns: z.array(patternSchema).max(LIMITS.patterns),
  clips: z.array(clipSchema).max(LIMITS.clips),
})

export type Clip = z.infer<typeof clipSchema>
export type Project = z.infer<typeof projectSchema>
