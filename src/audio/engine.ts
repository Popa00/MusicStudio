import * as Tone from 'tone'
import { getMasterInput } from './master'

/** Il browser permette l'audio solo dopo un gesto dell'utente (click, tasto). */
export async function startAudio(): Promise<void> {
  await Tone.start()
  getMasterInput()
}

export function isAudioRunning(): boolean {
  return Tone.getContext().state === 'running'
}
