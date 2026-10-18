const FLOOR_DB = -60

/** Livello in dB → altezza 0-1 della barra (sotto -60 dB la barra è vuota). */
export function meterFraction(db: number): number {
  if (!Number.isFinite(db) || db <= FLOOR_DB) return 0
  return Math.min(1, (db - FLOOR_DB) / -FLOOR_DB)
}
