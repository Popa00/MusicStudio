import { create } from 'zustand'
import type { DrumVoiceId } from '../music/drumPattern'
import type { NoteInput } from '../project/ops/notes'

export type PlayMode = 'song' | 'pattern'
export type Panel = 'editor' | 'effects' | 'mixer'

/** Note copiate (Ctrl+C) e dove incollarle la prossima volta. */
export interface NoteClipboard {
  notes: NoteInput[]
  /** Pattern in cui si è copiato o incollato l'ultima volta. */
  patternId: string
  /** Step da cui parte il prossimo incolla in quel pattern: subito dopo l'ultimo blocco. */
  pasteAt: number
}

/** Stato dell'interfaccia: non fa parte del brano, non viene salvato né annullato. */
interface UiState {
  selectedTrackId: string | null
  selectedPatternId: string | null
  selectedClipId: string | null
  /** Note selezionate nel piano roll (del pattern aperto). */
  selectedNoteIds: string[]
  noteClipboard: NoteClipboard | null
  playMode: PlayMode
  metronome: boolean
  panel: Panel
  /** Ottava suonata dalla tastiera del PC (4 = ottava del Do centrale). */
  octave: number
  /** Lunghezza, in step, delle nuove note disegnate nel piano roll. */
  noteLength: number
  /** Blocca sulla scala: le note disegnate, spostate o suonate restano sulle note della scala. */
  scaleLock: boolean
  /** Percussioni in più mostrate nella griglia di ogni traccia batteria (oltre a quelle con colpi). */
  drumRows: Record<string, DrumVoiceId[]>
  set: (changes: Partial<Omit<UiState, 'set'>>) => void
}

export const useUiStore = create<UiState>()((set) => ({
  selectedTrackId: null,
  selectedPatternId: null,
  selectedClipId: null,
  selectedNoteIds: [],
  noteClipboard: null,
  playMode: 'song',
  metronome: false,
  panel: 'editor',
  octave: 4,
  noteLength: 4,
  scaleLock: true,
  drumRows: {},
  set: (changes) => set(changes),
}))
