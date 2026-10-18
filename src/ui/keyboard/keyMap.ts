/**
 * Tastiera del PC come pianoforte (schema di GarageBand):
 * la fila A S D F G H J K sono i tasti bianchi, W E T Y U O P i tasti neri.
 */
const KEY_TO_SEMITONE: Record<string, number> = {
  KeyA: 0, KeyW: 1, KeyS: 2, KeyE: 3, KeyD: 4, KeyF: 5, KeyT: 6, KeyG: 7,
  KeyY: 8, KeyH: 9, KeyU: 10, KeyJ: 11, KeyK: 12, KeyO: 13, KeyL: 14, KeyP: 15, Semicolon: 16,
}

export const OCTAVE_DOWN_KEY = 'KeyZ'
export const OCTAVE_UP_KEY = 'KeyX'
export const MIN_OCTAVE = 1
export const MAX_OCTAVE = 7

/** Codice del tasto → nota MIDI (con l'ottava scelta), oppure null se il tasto non è una nota. */
export function pitchForKey(code: string, octave: number): number | null {
  const semitone = KEY_TO_SEMITONE[code]
  if (semitone === undefined) return null
  return (octave + 1) * 12 + semitone
}

/** True se l'evento arriva da un campo dove l'utente sta scrivendo. */
export function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  return ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable
}
