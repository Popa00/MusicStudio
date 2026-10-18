import { createEmptyPattern, type DrumPattern } from './drumPattern'

/**
 * Ritmo di partenza in 4/4, così all'avvio si sente subito qualcosa:
 * cassa su ogni battito, battimani sul 2 e sul 4, charleston chiuso su ogni ottavo.
 */
export function createBasicBeat(steps: number): DrumPattern {
  const pattern = createEmptyPattern(steps)
  for (let i = 0; i < steps; i++) {
    pattern.kick[i] = i % 4 === 0
    pattern.clap[i] = i % 8 === 4
    pattern.hihatClosed[i] = i % 2 === 0
  }
  return pattern
}
