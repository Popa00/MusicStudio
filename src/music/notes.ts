const ITALIAN = ['Do', 'Do#', 'Re', 'Re#', 'Mi', 'Fa', 'Fa#', 'Sol', 'Sol#', 'La', 'La#', 'Si']
const ENGLISH = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

/** Nome della nota "di base" (senza ottava), es. 0 → "Do". */
export function pitchClassName(pitchClass: number): string {
  return ITALIAN[((pitchClass % 12) + 12) % 12]
}

/** Numero MIDI → "Do4 (C4)". Il Do centrale del pianoforte è 60 = Do4. */
export function noteName(pitch: number): string {
  const octave = Math.floor(pitch / 12) - 1
  const index = ((pitch % 12) + 12) % 12
  return `${ITALIAN[index]}${octave} (${ENGLISH[index]}${octave})`
}

/** Tasti neri del pianoforte (diesis). */
export function isBlackKey(pitch: number): boolean {
  return [1, 3, 6, 8, 10].includes(((pitch % 12) + 12) % 12)
}
