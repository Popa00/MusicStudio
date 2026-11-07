import * as Tone from 'tone'
import type { DrumVoiceId } from '../../music/drumPattern'
import { loadSample, sampleUrl } from './samples'
import type { DrumVoice } from './types'
import { isSampled, SAMPLE_FILES } from './sampleVoice'
import { VOICE_FACTORIES } from './voiceFactories'

/** Frequenza a cui si "registrano" i suoni sintetizzati (il contesto dal vivo la converte da sé). */
const RENDER_SAMPLE_RATE = 44100
/** Abbastanza per la coda più lunga (cassa 808). */
const RENDER_SECONDS = 2
/** Sotto questo livello (-80 dB) la coda è silenzio e si taglia. */
const SILENCE = 1e-4

const rendered = new Map<DrumVoiceId, Promise<AudioBuffer>>()

/** Toglie il silenzio finale: un colpo da 0,2 s non occupa 2 secondi di memoria. */
function trimTail(buffer: AudioBuffer): AudioBuffer {
  const data = buffer.getChannelData(0)
  let end = data.length
  while (end > 1 && Math.abs(data[end - 1]) < SILENCE) end--
  if (end === data.length) return buffer
  const trimmed = new AudioBuffer({ length: end, numberOfChannels: 1, sampleRate: buffer.sampleRate })
  trimmed.copyToChannel(data.subarray(0, end), 0)
  return trimmed
}

/**
 * "Registra" una volta un suono sintetizzato della batteria (colpo a piena forza, in mono).
 * Il contesto globale di Tone è scambiato solo per la parte sincrona e sempre ripristinato.
 */
async function renderVoice(voice: DrumVoiceId): Promise<AudioBuffer> {
  const context = new Tone.OfflineContext(1, RENDER_SECONDS, RENDER_SAMPLE_RATE)
  let created: DrumVoice | undefined
  try {
    const original = Tone.getContext()
    Tone.setContext(context)
    try {
      created = VOICE_FACTORIES[voice](context.destination)
      created.trigger(0, 1)
    } finally {
      Tone.setContext(original)
    }
    const result = await context.render(false)
    return trimTail(result.get() as AudioBuffer)
  } finally {
    created?.dispose()
    void context.dispose()
  }
}

/**
 * Il suono come file audio: quelli registrati (piatti, tamburello...) ci sono già, gli altri
 * si generano una volta. Diventati "campioni", si possono suonare più acuti o più gravi come un campionatore.
 */
export function loadVoiceBuffer(voice: DrumVoiceId): Promise<AudioBuffer> {
  if (isSampled(voice)) return loadSample(sampleUrl(SAMPLE_FILES[voice]))
  let pending = rendered.get(voice)
  if (!pending) {
    pending = renderVoice(voice)
    // Un errore non resta in memoria: al prossimo tentativo si riprova.
    pending.catch(() => rendered.delete(voice))
    rendered.set(voice, pending)
  }
  return pending
}

/** Dimentica i suoni generati (serve al controllo audio: ogni prova riparte dallo stesso caso). */
export function clearRenderedVoices(): void {
  rendered.clear()
}
