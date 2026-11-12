import { create } from 'zustand'
import { cleanLoopRange, type LoopRange } from '../music/loopRegion'

/** Stato della riproduzione: non fa parte del brano e non viene salvato. */
interface PlaybackState {
  isPlaying: boolean
  /** Step che sta suonando ora (null quando è fermo). Lo scrive il motore audio. */
  currentStep: number | null
  /** Da dove parte il brano (in step), scelto cliccando o trascinando sulla riga delle battute. Lo Stop riporta qui. */
  startStep: number
  /**
   * Contatore delle richieste di salto: cresce a ogni `seekTo`, anche se il punto è lo stesso di prima
   * (cliccare di nuovo sulla battuta 9 mentre suona deve tornare alla battuta 9).
   */
  seekRequest: number
  /** "Ripeti parte": se attivo, il brano gira in loop solo su `loopRange`. */
  loopOn: boolean
  /** La parte scelta da ripetere; resta ricordata anche quando "Ripeti parte" è spento. */
  loopRange: LoopRange | null
  setPlaying: (playing: boolean) => void
  setCurrentStep: (step: number | null) => void
  /** Sceglie il punto di partenza senza saltare. */
  setStartStep: (step: number) => void
  /** Sceglie il punto di partenza e, se la musica suona, la fa saltare lì. */
  seekTo: (step: number) => void
  setLoopOn: (on: boolean) => void
  setLoopRange: (range: LoopRange) => void
  /** Un altro brano: si riparte dall'inizio, senza parte ripetuta. */
  resetPosition: () => void
}

const cleanStep = (step: number) => (Number.isFinite(step) ? Math.max(0, Math.round(step)) : 0)

export const usePlaybackStore = create<PlaybackState>()((set) => ({
  isPlaying: false,
  currentStep: null,
  startStep: 0,
  seekRequest: 0,
  loopOn: false,
  loopRange: null,
  setPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentStep: (currentStep) => set({ currentStep }),
  setStartStep: (step) => set({ startStep: cleanStep(step) }),
  seekTo: (step) => set((s) => ({ startStep: cleanStep(step), seekRequest: s.seekRequest + 1 })),
  setLoopOn: (loopOn) => set({ loopOn }),
  setLoopRange: (range) => set({ loopRange: cleanLoopRange(range) }),
  resetPosition: () => set({ startStep: 0, loopOn: false, loopRange: null }),
}))

/** La parte da ripetere se "Ripeti parte" è attivo, altrimenti null. */
export function activeLoopRange(state: Pick<PlaybackState, 'loopOn' | 'loopRange'>): LoopRange | null {
  return state.loopOn ? state.loopRange : null
}
