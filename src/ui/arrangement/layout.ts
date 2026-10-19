/** Larghezza in pixel di una battuta sulla linea del tempo. */
export const BAR_WIDTH = 64

/** Battute visibili: il brano più un po' di spazio libero per continuare (minimo 16). */
export function visibleBars(songBars: number, maxBars: number): number {
  return Math.min(maxBars, Math.max(16, songBars + 4))
}

/** Spostamento in pixel → spostamento in battute (arrotondato alla battuta più vicina). */
export function barsFromPixels(dx: number): number {
  return Math.round(dx / BAR_WIDTH)
}
