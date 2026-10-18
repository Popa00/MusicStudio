import type { Project } from '../../project/types'
import { encodeWav } from './encodeWav'
import { renderSong } from './renderSong'

/** Brano intero → file WAV pronto da scaricare. */
export async function exportWav(project: Project): Promise<Blob> {
  const audio = await renderSong(project)
  const channels = Array.from({ length: audio.numberOfChannels }, (_, i) => audio.getChannelData(i))
  return new Blob([encodeWav(channels, audio.sampleRate)], { type: 'audio/wav' })
}
