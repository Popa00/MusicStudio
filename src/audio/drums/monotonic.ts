import type { DrumVoice } from './types'

/** Distanza minima tra due colpi dello stesso suono, in secondi. */
export const MIN_GAP_SECONDS = 0.005

/**
 * Un suono di batteria può ricevere colpi da due parti (sequencer e tastiera) quasi insieme.
 * Tone.js rifiuta un colpo programmato prima dell'ultimo, e sposta al "tempo attuale" quelli
 * già passati (es. dopo un rallentamento della pagina): così due colpi possono coincidere.
 * Qui ogni colpo cade dopo l'ultimo e mai nel passato, spostato al massimo di pochi millisecondi.
 */
export function nextTriggerTime(time: number, last: number, now: number): number {
  return Math.max(time, now, last + MIN_GAP_SECONDS)
}

/** `now` restituisce il tempo attuale del contesto audio in cui suona la voce. */
export function monotonic(voice: DrumVoice, now: () => number): DrumVoice {
  let last = -Infinity
  return {
    trigger: (time, velocity) => {
      if (!Number.isFinite(time)) return
      last = nextTriggerTime(time, last, now())
      voice.trigger(last, velocity)
    },
    dispose: voice.dispose,
  }
}
