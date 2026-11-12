import { pitchClassName } from '../../music/notes'
import { stepsPerBar, stepsPerBeat, type TimeSignature } from '../../music/timing'

/** Numero MIDI → nome con ottava, es. 45 → "La2" (il Do centrale è Do4). */
export function noteLabel(pitch: number): string {
  return `${pitchClassName(pitch)}${Math.floor(pitch / 12) - 1}`
}

const PARTS: Record<number, string | undefined> = { 0: '', 0.25: '¼', 0.5: '½', 0.75: '¾' }

/** Frazioni di battito leggibili ("½") invece dei decimali. */
function fraction(beats: number): string {
  const whole = Math.floor(beats)
  const part = PARTS[beats - whole]
  if (part === undefined) return String(Math.round(beats * 100) / 100).replace('.', ',')
  return whole === 0 ? part || '0' : `${whole}${part}`
}

/** Durata in step → "4 battiti", "1 battito", "½ battito". */
export function beatsLabel(steps: number, ts: TimeSignature): string {
  const beats = steps / stepsPerBeat(ts)
  return `${fraction(beats)} ${beats > 1 ? 'battiti' : 'battito'}`
}

/** Step dall'inizio → posizione "battuta.battito", es. "2.1"; "2.1+½" se cade a metà del battito. */
export function positionLabel(step: number, ts: TimeSignature): string {
  const bar = Math.floor(step / stepsPerBar(ts)) + 1
  const inBar = step % stepsPerBar(ts)
  const beat = Math.floor(inBar / stepsPerBeat(ts)) + 1
  const offset = (inBar % stepsPerBeat(ts)) / stepsPerBeat(ts)
  return offset === 0 ? `${bar}.${beat}` : `${bar}.${beat}+${fraction(offset)}`
}

/** Battute consecutive come intervallo: [0,1,2,3] → "1–4"; una sola → "3". */
export function barRangeLabel(firstBar: number, lastBar: number): string {
  return firstBar === lastBar ? `${firstBar + 1}` : `${firstBar + 1}–${lastBar + 1}`
}
