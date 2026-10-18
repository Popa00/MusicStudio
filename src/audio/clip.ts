/** Converte decibel in ampiezza lineare (0 dB = 1). */
export function dbToAmplitude(db: number): number {
  return 10 ** (db / 20)
}

/** Taglio netto: nessun campione esce da [-ceiling, +ceiling]. */
export function hardClip(sample: number, ceiling: number): number {
  return Math.max(-ceiling, Math.min(ceiling, sample))
}
