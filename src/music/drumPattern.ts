export const DRUM_VOICES = ['kick', 'snare', 'clap', 'hihatClosed', 'hihatOpen'] as const

export type DrumVoiceId = (typeof DRUM_VOICES)[number]

/** Per ogni suono, una casella per step: true = il suono parte su quello step. */
export type DrumPattern = Record<DrumVoiceId, boolean[]>

export function createEmptyPattern(steps: number): DrumPattern {
  const pattern = {} as DrumPattern
  for (const voice of DRUM_VOICES) pattern[voice] = Array<boolean>(steps).fill(false)
  return pattern
}

export function toggleStep(pattern: DrumPattern, voice: DrumVoiceId, step: number): DrumPattern {
  const row = pattern[voice]
  if (!Number.isInteger(step) || step < 0 || step >= row.length) return pattern
  const nextRow = row.map((on, i) => (i === step ? !on : on))
  return { ...pattern, [voice]: nextRow }
}

export function activeVoicesAt(pattern: DrumPattern, step: number): DrumVoiceId[] {
  return DRUM_VOICES.filter((voice) => pattern[voice][step] === true)
}
