import { z } from 'zod'

const id = z.string().min(1).max(64)
const wet = z.number().min(0).max(1)

/** Riverbero: simula l'eco di una stanza. */
export const reverbSchema = z.object({
  id,
  type: z.literal('reverb'),
  enabled: z.boolean(),
  decay: z.number().min(0.2).max(10),
  wet,
})

/** Delay (eco): ripete il suono a tempo. Feedback < 1 per evitare eco infinite. */
export const delaySchema = z.object({
  id,
  type: z.literal('delay'),
  enabled: z.boolean(),
  time: z.enum(['4n', '8n', '8n.', '16n']),
  feedback: z.number().min(0).max(0.85),
  wet,
})

/** Filtro: toglie le frequenze alte (lowpass) o basse (highpass). */
export const filterSchema = z.object({
  id,
  type: z.literal('filter'),
  enabled: z.boolean(),
  mode: z.enum(['lowpass', 'highpass']),
  frequency: z.number().min(20).max(20000),
  resonance: z.number().min(0.1).max(15),
})

/** Equalizzatore a 3 bande: bassi, medi, alti in dB. */
export const eqSchema = z.object({
  id,
  type: z.literal('eq'),
  enabled: z.boolean(),
  low: z.number().min(-24).max(12),
  mid: z.number().min(-24).max(12),
  high: z.number().min(-24).max(12),
})

/** Distorsione: rende il suono "sporco" e aggressivo. */
export const distortionSchema = z.object({
  id,
  type: z.literal('distortion'),
  enabled: z.boolean(),
  amount: z.number().min(0).max(1),
  wet,
})

export const effectSchema = z.discriminatedUnion('type', [
  reverbSchema,
  delaySchema,
  filterSchema,
  eqSchema,
  distortionSchema,
])

export type EffectSettings = z.infer<typeof effectSchema>
export type EffectType = EffectSettings['type']
