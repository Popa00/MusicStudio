import { stepsPerBar, stepsPerBeat, type TimeSignature } from '../../music/timing'

/** Larghezza in pixel di una battuta sulla linea del tempo. */
export const BAR_WIDTH = 64

/** Battute sempre visibili, anche con un brano corto: si vede subito che si può continuare. */
export const MIN_VISIBLE_BARS = 32
/** Battute libere dopo la fine del brano, dove aggiungere i blocchi successivi. */
export const FREE_BARS = 8

/** Battute visibili: il brano più un po' di spazio libero per continuare (minimo 32). */
export function visibleBars(songBars: number, maxBars: number): number {
  return Math.min(maxBars, Math.max(MIN_VISIBLE_BARS, songBars + FREE_BARS))
}

/** Posizione da dare allo scorrimento perché la battuta `x` (in pixel) resti visibile, o null se lo è già. */
export function scrollToShow(x: number, scrollLeft: number, viewWidth: number, margin: number): number | null {
  // In una vista molto stretta il margine non può occupare tutto lo spazio (scorrerebbe a ogni step).
  margin = Math.max(0, Math.min(margin, viewWidth / 4))
  if (x >= scrollLeft + margin && x <= scrollLeft + viewWidth - margin) return null
  return Math.max(0, x - margin)
}

/** Spostamento in pixel → spostamento in battute (arrotondato alla battuta più vicina). */
export function barsFromPixels(dx: number): number {
  return Math.round(dx / BAR_WIDTH)
}

/**
 * Punto cliccato sulla riga delle battute (pixel dall'inizio) → step da cui ascoltare,
 * agganciato all'inizio del battito, tra 0 e l'ultimo battito delle prime `bars` battute.
 */
export function stepAtRulerX(x: number, ts: TimeSignature, bars: number): number {
  const beat = stepsPerBeat(ts)
  const step = Math.floor(((x / BAR_WIDTH) * stepsPerBar(ts)) / beat) * beat
  const last = bars * stepsPerBar(ts) - beat
  return Math.min(Math.max(0, step), Math.max(0, last))
}
