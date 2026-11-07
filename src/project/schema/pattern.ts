import { z } from 'zod'
import { EXTRA_DRUM_VOICES, type DrumVoiceId, type ExtraDrumVoiceId } from '../../music/drumPattern'
import { LIMITS, MAX_PATTERN_STEPS } from '../limits'

const id = z.string().min(1).max(64)
/** 0 = casella spenta, altrimenti l'intensità del colpo. */
const steps = z.array(z.number().min(0).max(1)).max(MAX_PATTERN_STEPS)

/** Una nota nel piano roll. Posizione e durata sono in step (sedicesimi). */
export const noteSchema = z.object({
  id,
  pitch: z.number().int().min(0).max(127),
  start: z.number().int().min(0).max(MAX_PATTERN_STEPS - 1),
  duration: z.number().int().min(1).max(MAX_PATTERN_STEPS),
  velocity: z.number().min(0).max(1),
})

const extraRows = Object.fromEntries(EXTRA_DRUM_VOICES.map((voice) => [voice, steps.optional()])) as Record<
  ExtraDrumVoiceId,
  z.ZodOptional<typeof steps>
>

/**
 * Le 5 righe di base ci sono sempre; le percussioni aggiunte dopo sono facoltative (i progetti
 * precedenti non le hanno) e, se mancano, diventano righe vuote lunghe quanto le altre.
 */
export const drumStepsSchema = z
  .object({ kick: steps, snare: steps, clap: steps, hihatClosed: steps, hihatOpen: steps, ...extraRows })
  .transform((rows): Record<DrumVoiceId, number[]> => {
    const filled = { ...rows } as Record<DrumVoiceId, number[]>
    for (const voice of EXTRA_DRUM_VOICES) filled[voice] = rows[voice] ?? Array<number>(rows.kick.length).fill(0)
    return filled
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
