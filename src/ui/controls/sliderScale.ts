/** Risoluzione dei cursori logaritmici (posizioni da 0 a RESOLUTION). */
export const RESOLUTION = 1000

/**
 * Le frequenze e i tempi si percepiscono "a rapporti": da 100 a 200 Hz sembra un salto
 * grande quanto da 1000 a 2000. Il cursore logaritmico distribuisce i valori in modo naturale.
 */
export function logToPosition(value: number, min: number, max: number): number {
  const clamped = Math.min(max, Math.max(min, value))
  return Math.round((Math.log(clamped / min) / Math.log(max / min)) * RESOLUTION)
}

export function positionToLog(position: number, min: number, max: number): number {
  return min * Math.pow(max / min, position / RESOLUTION)
}

/** Arrotonda a un numero "leggibile" di cifre significative. */
export function roundSignificant(value: number, digits = 3): number {
  if (value === 0) return 0
  const factor = Math.pow(10, digits - Math.ceil(Math.log10(Math.abs(value))))
  return Math.round(value * factor) / factor
}
