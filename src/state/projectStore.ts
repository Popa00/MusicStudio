import { create } from 'zustand'
import { createBasicBeat } from '../music/basicBeat'
import { createEmptyPattern, toggleStep, type DrumPattern, type DrumVoiceId } from '../music/drumPattern'
import { clampBpm, DEFAULT_BPM, stepsPerBar, type TimeSignature } from '../music/timing'

/** Tutto ciò che fa parte del brano e verrà salvato nel file di progetto. */
interface ProjectState {
  bpm: number
  timeSignature: TimeSignature
  drumPattern: DrumPattern
  setBpm: (bpm: number) => void
  toggleDrumStep: (voice: DrumVoiceId, step: number) => void
  clearDrumPattern: () => void
}

const INITIAL_TIME_SIGNATURE: TimeSignature = { beatsPerBar: 4, beatUnit: 4 }

export const useProjectStore = create<ProjectState>()((set) => ({
  bpm: DEFAULT_BPM,
  timeSignature: INITIAL_TIME_SIGNATURE,
  drumPattern: createBasicBeat(stepsPerBar(INITIAL_TIME_SIGNATURE)),
  setBpm: (bpm) => set({ bpm: clampBpm(bpm) }),
  toggleDrumStep: (voice, step) =>
    set((s) => ({ drumPattern: toggleStep(s.drumPattern, voice, step) })),
  clearDrumPattern: () =>
    set((s) => ({ drumPattern: createEmptyPattern(stepsPerBar(s.timeSignature)) })),
}))
