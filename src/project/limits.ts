/** Limiti del progetto: proteggono da file importati enormi o malformati. */
export const LIMITS = {
  tracks: 16,
  patterns: 128,
  clips: 512,
  notesPerPattern: 1024,
  effectsPerTrack: 6,
  patternBars: 8,
  songBars: 128,
  nameLength: 40,
  /** Dimensione massima di un file di progetto da aprire, in caratteri. */
  fileChars: 5_000_000,
  /** Durata massima dell'export WAV, in secondi. */
  exportSeconds: 600,
} as const

/** Step massimi in una battuta (4/4 = 16 sedicesimi). Lo schema rifiuta tempi musicali più lunghi. */
export const MAX_STEPS_PER_BAR = 16

/** Step massimi in un pattern: 8 battute da 16 sedicesimi. */
export const MAX_PATTERN_STEPS = LIMITS.patternBars * MAX_STEPS_PER_BAR
