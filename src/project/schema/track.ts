import { z } from 'zod'
import { DRUM_VOICES } from '../../music/drumPattern'
import { LIMITS } from '../limits'
import { effectSchema } from './effects'

const id = z.string().min(1).max(64)

export const synthSettingsSchema = z.object({
  preset: z.string().max(LIMITS.nameLength),
  waveform: z.enum(['sine', 'triangle', 'sawtooth', 'square']),
  attack: z.number().min(0.001).max(4),
  decay: z.number().min(0.01).max(4),
  sustain: z.number().min(0).max(1),
  release: z.number().min(0.01).max(8),
  cutoff: z.number().min(50).max(18000),
  resonance: z.number().min(0.1).max(15),
})

export const mixerSchema = z.object({
  volumeDb: z.number().min(-60).max(6),
  pan: z.number().min(-1).max(1),
  mute: z.boolean(),
  solo: z.boolean(),
})

const trackBase = {
  id,
  name: z.string().max(LIMITS.nameLength),
  mixer: mixerSchema,
  effects: z.array(effectSchema).max(LIMITS.effectsPerTrack),
}

export const drumTrackSchema = z.object({ ...trackBase, kind: z.literal('drums') })

export const synthTrackSchema = z.object({
  ...trackBase,
  kind: z.literal('synth'),
  synth: synthSettingsSchema,
})

/**
 * Un solo suono di batteria suonato come strumento: le note del piano roll lo rendono più acuto o
 * più grave (il Do centrale è il suono originale) e la traccia ha i suoi effetti e il suo mixer.
 */
export const percussionSoundSchema = z.object({
  voice: z.enum(DRUM_VOICES),
  /** Intonazione di base, in semitoni. */
  tune: z.number().min(-12).max(12),
  /** Quanta parte della coda tenere: 1 = tutta, 0.1 = colpo cortissimo. */
  length: z.number().min(0.05).max(1),
})

export const percussionTrackSchema = z.object({
  ...trackBase,
  kind: z.literal('percussion'),
  sound: percussionSoundSchema,
})

export const trackSchema = z.discriminatedUnion('kind', [drumTrackSchema, synthTrackSchema, percussionTrackSchema])

export type SynthSettings = z.infer<typeof synthSettingsSchema>
export type MixerSettings = z.infer<typeof mixerSchema>
export type Track = z.infer<typeof trackSchema>
export type SynthTrack = z.infer<typeof synthTrackSchema>
export type PercussionSound = z.infer<typeof percussionSoundSchema>
export type PercussionTrack = z.infer<typeof percussionTrackSchema>
export type TrackKind = Track['kind']
