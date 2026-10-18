import { create } from 'zustand'

export type PlayMode = 'song' | 'pattern'
export type Panel = 'editor' | 'effects' | 'mixer'

/** Stato dell'interfaccia: non fa parte del brano, non viene salvato né annullato. */
interface UiState {
  selectedTrackId: string | null
  selectedPatternId: string | null
  selectedClipId: string | null
  playMode: PlayMode
  metronome: boolean
  panel: Panel
  /** Ottava suonata dalla tastiera del PC (4 = ottava del Do centrale). */
  octave: number
  /** Lunghezza, in step, delle nuove note disegnate nel piano roll. */
  noteLength: number
  set: (changes: Partial<Omit<UiState, 'set'>>) => void
}

export const useUiStore = create<UiState>()((set) => ({
  selectedTrackId: null,
  selectedPatternId: null,
  selectedClipId: null,
  playMode: 'song',
  metronome: false,
  panel: 'editor',
  octave: 4,
  noteLength: 4,
  set: (changes) => set(changes),
}))
