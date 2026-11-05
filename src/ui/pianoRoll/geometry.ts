/** Nota più acuta e più grave visibili nel piano roll (Do7 e Do1). */
export const TOP_PITCH = 96
export const BOTTOM_PITCH = 24
/** Le note (anche spostate in gruppo) restano nella parte visibile della tastiera. */
export const PIANO_RANGE = { min: BOTTOM_PITCH, max: TOP_PITCH }
export const ROW_HEIGHT = 16
export const STEP_WIDTH = 24
/** Zona (in pixel) sul bordo destro di una nota che serve ad allungarla. */
export const RESIZE_HANDLE = 6

export const PITCHES = Array.from({ length: TOP_PITCH - BOTTOM_PITCH + 1 }, (_, i) => TOP_PITCH - i)

export function pitchToY(pitch: number): number {
  return (TOP_PITCH - pitch) * ROW_HEIGHT
}

/** Punto nella griglia (in pixel, relativo all'angolo in alto a sinistra) → cella (step, nota). */
export function cellAt(x: number, y: number, totalSteps: number): { step: number; pitch: number } {
  const step = Math.min(totalSteps - 1, Math.max(0, Math.floor(x / STEP_WIDTH)))
  const pitch = Math.min(TOP_PITCH, Math.max(BOTTOM_PITCH, TOP_PITCH - Math.floor(y / ROW_HEIGHT)))
  return { step, pitch }
}

/** Posizione di scorrimento per avere `pitch` circa al centro di una finestra alta `viewHeight`. */
export function scrollTopFor(pitch: number, viewHeight: number): number {
  return Math.max(0, pitchToY(pitch) - viewHeight / 2)
}
