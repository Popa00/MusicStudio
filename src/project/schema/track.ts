import { z } from 'zod'
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

export const trackSchema = z.discriminatedUnion('kind', [drumTrackSchema, synthTrackSchema])

export type SynthSettings = z.infer<typeof synthSettingsSchema>
export type MixerSettings = z.infer<typeof mixerSchema>
export type Track = z.infer<typeof trackSchema>
export type SynthTrack = z.infer<typeof synthTrackSchema>
export type TrackKind = Track['kind']
