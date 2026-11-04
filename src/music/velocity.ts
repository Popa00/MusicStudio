/**
 * Intensità ("velocity") di una nota o di un colpo: da 0 a 1, quanto forte suona.
 * Il motore la usa come guadagno lineare: 0,5 ≈ −6 dB, 0,25 ≈ −12 dB.
 */

/** Sotto questo valore una nota sarebbe quasi inudibile: è il minimo che si può impostare. */
export const MIN_VELOCITY = 0.1

/** Note nuove del piano roll. */
export const DEFAULT_NOTE_VELOCITY = 0.8

/** Colpi nuovi della batteria (ed è la forza di tutti i colpi dei progetti prima dell'intensità). */
export const DEFAULT_DRUM_VELOCITY = 0.9

/** Porta un valore nell'intervallo valido (MIN_VELOCITY-1); un valore non numerico diventa `fallback`. */
export function clampVelocity(value: number, fallback = DEFAULT_NOTE_VELOCITY): number {
  if (!Number.isFinite(value)) return fallback
  return Math.min(1, Math.max(MIN_VELOCITY, value))
}

/** Intensità come percentuale da mostrare, es. 0.8 → "80%". */
export function formatVelocity(value: number): string {
  return `${Math.round(value * 100)}%`
}
