import { LIMITS } from '../project/limits'
import { songLengthBars } from '../project/ops/clips'
import { findPattern } from '../project/ops/helpers'
import type { Project } from '../project/types'
import { loopLengthBars, type PlayTarget } from './schedule'
import { stepsPerBar } from './timing'

/** Una parte del brano da ripetere: dalla battuta `start` (compresa) a `end` (esclusa), contate da 0. */
export interface LoopRange {
  start: number
  end: number
}

/** Battute ripetute di default quando non c'è un blocco selezionato. */
export const DEFAULT_LOOP_BARS = 4

/** Rende valida una parte: numeri interi, almeno una battuta, dentro la lunghezza massima del brano. */
export function cleanLoopRange(range: LoopRange): LoopRange {
  const max = LIMITS.songBars
  const whole = (n: number, fallback: number) => (Number.isFinite(n) ? Math.round(n) : fallback)
  const start = Math.min(Math.max(0, whole(range.start, 0)), max - 1)
  const end = Math.min(Math.max(start + 1, whole(range.end, start + 1)), max)
  return { start, end }
}

/**
 * La parte da ripetere quando si attiva "Ripeti parte": le battute del blocco selezionato, se c'è,
 * altrimenti 4 battute dalla battuta di partenza, senza andare oltre la fine del brano se possibile.
 */
export function defaultLoopRange(project: Project, selectedClipId: string | null, startStep: number): LoopRange {
  const clip = selectedClipId ? project.clips.find((c) => c.id === selectedClipId) : undefined
  const pattern = clip ? findPattern(project, clip.patternId) : undefined
  if (clip && pattern) return cleanLoopRange({ start: clip.startBar, end: clip.startBar + pattern.lengthBars })
  const song = songLengthBars(project)
  let start = Math.floor(startStep / stepsPerBar(project.timeSignature))
  if (start >= song) start = 0
  const end = Math.min(start + DEFAULT_LOOP_BARS, Math.max(song, start + 1))
  return cleanLoopRange({ start, end })
}

/**
 * Le battute in cui gira la riproduzione: la parte scelta se "Ripeti parte" è attivo e si ascolta il brano,
 * altrimenti tutto il brano (o tutto il pattern in "Solo pattern").
 */
export function activeLoop(project: Project, target: PlayTarget, range: LoopRange | null): LoopRange {
  if (target.mode === 'song' && range) return cleanLoopRange(range)
  return { start: 0, end: Math.max(1, loopLengthBars(project, target)) }
}
