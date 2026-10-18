import { create } from 'zustand'

/** Stato della riproduzione: non fa parte del brano e non viene salvato. */
interface PlaybackState {
  isPlaying: boolean
  /** Step che sta suonando ora (null quando è fermo). Lo scrive il motore audio. */
  currentStep: number | null
  setPlaying: (playing: boolean) => void
  setCurrentStep: (step: number | null) => void
}

export const usePlaybackStore = create<PlaybackState>()((set) => ({
  isPlaying: false,
  currentStep: null,
  setPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentStep: (currentStep) => set({ currentStep }),
}))
