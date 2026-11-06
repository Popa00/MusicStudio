import { usePlaybackStore } from './playbackStore'

/**
 * Le finestre del browser (conferma, avviso) bloccano la pagina finché sono aperte: il motore non
 * può più dare il tempo e restano a suonare solo le note già partite, fuori ritmo. Per questo
 * la musica si ferma prima di aprirle (lo Stop sfuma in audio, anche a pagina bloccata).
 */
function stopPlayback(): void {
  const playback = usePlaybackStore.getState()
  if (playback.isPlaying) playback.setPlaying(false)
}

/** Chiede conferma con la finestra del browser, dopo aver fermato la musica. */
export function askConfirm(message: string): boolean {
  stopPlayback()
  return window.confirm(message)
}

/** Mostra un avviso con la finestra del browser, dopo aver fermato la musica. */
export function showAlert(message: string): void {
  stopPlayback()
  window.alert(message)
}
