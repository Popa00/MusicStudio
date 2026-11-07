import * as Tone from 'tone'
import type { DrumVoiceId } from '../../music/drumPattern'
import { dbToAmplitude } from '../clip'
import { loadedSample, loadSample, sampleUrl } from './samples'
import { createVoiceLimit } from './voiceLimit'
import type { AudioOutput, DrumVoice } from './types'

/** I suoni registrati: file in public/samples (licenza CC0, vedi i LICENSE.txt nelle cartelle). */
export const SAMPLE_FILES = {
  crash: 'cymbals/crash.wav',
  ride: 'cymbals/ride.wav',
  rideBell: 'cymbals/ride-bell.wav',
  tambourine: 'perc/tambourine.wav',
  shaker: 'perc/shaker.wav',
  conga: 'perc/conga.wav',
  bongo: 'perc/bongo.wav',
} as const satisfies Partial<Record<DrumVoiceId, string>>

export type SampledVoiceId = keyof typeof SAMPLE_FILES

export function isSampled(voice: DrumVoiceId): voice is SampledVoiceId {
  return Object.hasOwn(SAMPLE_FILES, voice)
}

/** Scarica in anticipo tutti i suoni registrati: servono già pronti al primo colpo (e prima dell'export). */
export function preloadSamples(): Promise<void> {
  return Promise.all(Object.values(SAMPLE_FILES).map((f) => loadSample(sampleUrl(f)))).then(() => undefined)
}

/**
 * Un suono registrato. Ogni colpo è una sorgente nuova: un piatto colpito di nuovo continua a
 * risuonare sotto il colpo successivo, come nella realtà (niente taglio netto con click).
 */
export function createSampleVoice(output: AudioOutput, file: string, volumeDb: number): DrumVoice {
  const url = sampleUrl(file)
  const level = new Tone.Gain(dbToAmplitude(volumeDb)).connect(output)
  void loadSample(url).catch(() => {})
  const playing = createVoiceLimit<Tone.ToneBufferSource>((source) => {
    source.fadeOut = 0.03
    source.stop()
  })

  return {
    trigger: (time, velocity) => {
      const buffer = loadedSample(url)
      if (!buffer) return
      // Contesto esplicito: durante l'export il colpo nasce mentre il contesto globale è quello dal vivo.
      const source = new Tone.ToneBufferSource({
        context: level.context,
        url: new Tone.ToneAudioBuffer(buffer),
        onended: () => {
          playing.remove(source)
          source.dispose()
        },
      }).connect(level)
      source.start(time, 0, undefined, velocity)
      playing.add(source)
    },
    dispose: () => {
      playing.clear((source) => source.dispose())
      level.dispose()
    },
  }
}
