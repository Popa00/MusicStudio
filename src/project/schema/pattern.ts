import { z } from 'zod'
import { LIMITS, MAX_PATTERN_STEPS } from '../limits'

const id = z.string().min(1).max(64)
const steps = z.array(z.boolean()).max(MAX_PATTERN_STEPS)

/** Una nota nel piano roll. Posizione e durata sono in step (sedicesimi). */
export const noteSchema = z.object({
  id,
  pitch: z.number().int().min(0).max(127),
  start: z.number().int().min(0).max(MAX_PATTERN_STEPS - 1),
  duration: z.number().int().min(1).max(MAX_PATTERN_STEPS),
  velocity: z.number().min(0).max(1),
})

export const drumStepsSchema = z.object({
  kick: steps,
  snare: steps,
  clap: steps,
  hihatClosed: steps,
  hihatOpen: steps,
})

const patternBase = {
  id,
  trackId: id,
  name: z.string().max(LIMITS.nameLength),
  lengthBars: z.number().int().min(1).max(LIMITS.patternBars),
}

export const drumPatternSchema = z.object({
  ...patternBase,
  kind: z.literal('drums'),
  steps: drumStepsSchema,
})

export const notePatternSchema = z.object({
  ...patternBase,
  kind: z.literal('notes'),
  notes: z.array(noteSchema).max(LIMITS.notesPerPattern),
})

export const patternSchema = z.discriminatedUnion('kind', [drumPatternSchema, notePatternSchema])

export type Note = z.infer<typeof noteSchema>
export type Pattern = z.infer<typeof patternSchema>
export type DrumPatternData = z.infer<typeof drumPatternSchema>
export type NotePatternData = z.infer<typeof notePatternSchema>
