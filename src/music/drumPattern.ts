import { clampVelocity, DEFAULT_DRUM_VELOCITY } from './velocity'

/** I 5 suoni sempre visibili (e sempre presenti nei progetti di ogni versione). */
export const BASE_DRUM_VOICES = ['kick', 'snare', 'clap', 'hihatClosed', 'hihatOpen'] as const

/** Percussioni in più: righe nascoste finché non si aggiungono o non hanno colpi. */
export const EXTRA_DRUM_VOICES = [
  'kick808', 'rimshot', 'snap', 'tomLow', 'tomMid', 'tomHigh',
  'shaker', 'tambourine', 'conga', 'bongo', 'cowbell', 'clave', 'perc',
  'crash', 'ride', 'rideBell',
] as const

export const DRUM_VOICES = [...BASE_DRUM_VOICES, ...EXTRA_DRUM_VOICES] as const

export type DrumVoiceId = (typeof DRUM_VOICES)[number]
export type ExtraDrumVoiceId = (typeof EXTRA_DRUM_VOICES)[number]

/** Per ogni suono, una casella per step: 0 = spenta, altrimenti l'intensità del colpo (0-1). */
export type DrumPattern = Record<DrumVoiceId, number[]>

export interface DrumHit {
  voice: DrumVoiceId
  velocity: number
}

export function createEmptyPattern(steps: number): DrumPattern {
  const pattern = {} as DrumPattern
  for (const voice of DRUM_VOICES) pattern[voice] = Array<number>(steps).fill(0)
  return pattern
}

function isValidStep(row: number[], step: number): boolean {
  return Number.isInteger(step) && step >= 0 && step < row.length
}

/** Accende (con l'intensità predefinita) o spegne una casella. */
export function toggleStep(pattern: DrumPattern, voice: DrumVoiceId, step: number): DrumPattern {
  const row = pattern[voice]
  if (!isValidStep(row, step)) return pattern
  const nextRow = row.map((v, i) => (i !== step ? v : v > 0 ? 0 : DEFAULT_DRUM_VELOCITY))
  return { ...pattern, [voice]: nextRow }
}

/** Cambia l'intensità di una casella accesa; una casella spenta resta spenta. */
export function setStepVelocity(pattern: DrumPattern, voice: DrumVoiceId, step: number, velocity: number): DrumPattern {
  const row = pattern[voice]
  if (!isValidStep(row, step) || !(row[step] > 0)) return pattern
  const value = clampVelocity(velocity, row[step])
  if (row[step] === value) return pattern
  return { ...pattern, [voice]: row.map((v, i) => (i === step ? value : v)) }
}

/** I colpi che partono in uno step, con la loro intensità. */
export function hitsAt(pattern: DrumPattern, step: number): DrumHit[] {
  return DRUM_VOICES.filter((voice) => pattern[voice][step] > 0).map((voice) => ({ voice, velocity: pattern[voice][step] }))
}
