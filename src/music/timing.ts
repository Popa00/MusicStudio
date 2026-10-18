/** Tempo musicale (es. 4/4): quanti battiti per battuta e quale figura vale un battito. */
export interface TimeSignature {
  beatsPerBar: number
  beatUnit: 4 | 8
}

export const BPM_MIN = 40
export const BPM_MAX = 240
export const DEFAULT_BPM = 110

/** La griglia è a sedicesimi: 16 step per ogni nota intera. */
export const STEPS_PER_WHOLE_NOTE = 16

export function stepsPerBeat(ts: TimeSignature): number {
  return STEPS_PER_WHOLE_NOTE / ts.beatUnit
}

export function stepsPerBar(ts: TimeSignature): number {
  return ts.beatsPerBar * stepsPerBeat(ts)
}

export function clampBpm(bpm: number): number {
  if (!Number.isFinite(bpm)) return DEFAULT_BPM
  return Math.min(BPM_MAX, Math.max(BPM_MIN, Math.round(bpm)))
}

/** Durata di uno step (un sedicesimo) in secondi. */
export function stepSeconds(bpm: number): number {
  return 60 / bpm / 4
}

export function barSeconds(bpm: number, ts: TimeSignature): number {
  return stepsPerBar(ts) * stepSeconds(bpm)
}

/** Posizione del trasporto (in tick) → numero dello step dall'inizio. */
export function absoluteStepAtTicks(ticks: number, ppq: number): number {
  const ticksPerStep = (ppq * 4) / STEPS_PER_WHOLE_NOTE
  return Math.round(ticks / ticksPerStep)
}

/** Converte la posizione del trasporto (in tick) nell'indice dello step dentro la battuta. */
export function stepAtTicks(ticks: number, ppq: number, stepsInBar: number): number {
  return absoluteStepAtTicks(ticks, ppq) % stepsInBar
}
