import { defaultLoopRange, type LoopRange } from '../../music/loopRegion'
import { stepsPerBar } from '../../music/timing'
import { usePlaybackStore } from '../playbackStore'
import { useProjectStore } from '../projectStore'
import { useUiStore } from '../uiStore'

/** La parte ripetuta è del brano: se si ascoltava "Solo pattern", si torna al brano. */
function listenToSong(): void {
  if (useUiStore.getState().playMode !== 'song') useUiStore.getState().set({ playMode: 'song' })
}

/**
 * Se la musica suona fuori dalla parte appena scelta, salta al suo inizio: altrimenti si sentirebbero
 * le battute fuori dalla parte finché il cursore non arriva alla sua fine.
 */
function keepPlayheadInside(): void {
  const playback = usePlaybackStore.getState()
  const range = playback.loopRange
  if (!playback.isPlaying || !playback.loopOn || !range || playback.currentStep === null) return
  const bar = stepsPerBar(useProjectStore.getState().project.timeSignature)
  if (playback.currentStep < range.start * bar || playback.currentStep >= range.end * bar) playback.seekTo(range.start * bar)
}

/**
 * Accende o spegne "Ripeti parte". La prima volta sceglie da sola cosa ripetere:
 * il blocco selezionato, oppure 4 battute dal punto di partenza.
 */
export function toggleLoop(): void {
  const playback = usePlaybackStore.getState()
  // In "Solo pattern" il pulsante appare spento anche se la parte è ricordata: premerlo la riaccende.
  if (playback.loopOn && useUiStore.getState().playMode === 'song') {
    playback.setLoopOn(false)
    return
  }
  if (!playback.loopRange) {
    const { project } = useProjectStore.getState()
    playback.setLoopRange(defaultLoopRange(project, useUiStore.getState().selectedClipId, playback.startStep))
  }
  listenToSong()
  usePlaybackStore.getState().setLoopOn(true)
  keepPlayheadInside()
}

/** Ripete le battute del blocco indicato. */
export function loopClip(clipId: string): void {
  const { project } = useProjectStore.getState()
  if (!project.clips.some((c) => c.id === clipId)) return
  setLoop(defaultLoopRange(project, clipId, 0))
}

/** Ripete la parte indicata (accende "Ripeti parte" se era spento). */
export function setLoop(range: LoopRange): void {
  const playback = usePlaybackStore.getState()
  playback.setLoopRange(range)
  listenToSong()
  if (!playback.loopOn) playback.setLoopOn(true)
  keepPlayheadInside()
}
