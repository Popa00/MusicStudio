import * as Tone from 'tone'
import type { DrumVoiceId } from '../../music/drumPattern'
import { PERCUSSION_ROOT_PITCH } from '../../project/ops/percussion'
import type { PercussionSound } from '../../project/types'
import { dbToAmplitude } from '../clip'
import { KIT_LEVEL_DB } from '../drums/kit'
import { loadVoiceBuffer } from '../drums/voiceBuffer'
import { createVoiceLimit } from '../drums/voiceLimit'
import { SAMPLE_LEVEL_DB } from '../drums/voiceFactories'
import { reportOnce } from '../safety'
import type { Instrument } from './types'

/** Dissolvenza quando la "Lunghezza" taglia la coda: evita il click. */
const CUT_FADE_SECONDS = 0.02
/** Al massimo due ottave sopra o sotto il suono originale. */
const MAX_SHIFT = 24

/** Stesso volume dello stesso suono nella batteria (i suoni registrati hanno il loro livello). */
function levelDb(voice: DrumVoiceId): number {
  const sampled = (SAMPLE_LEVEL_DB as Partial<Record<DrumVoiceId, number>>)[voice] ?? 0
  return KIT_LEVEL_DB + sampled
}

/**
 * Un suono di batteria suonato come strumento (un piccolo campionatore): ogni nota fa partire
 * il suono "registrato", più veloce e acuto sopra il Do centrale, più lento e grave sotto.
 */
export function createPercussionInstrument(sound: PercussionSound): Instrument {
  const output = new Tone.Gain(dbToAmplitude(levelDb(sound.voice)))
  let current = sound
  let buffer: AudioBuffer | null = null

  function load(voice: DrumVoiceId): Promise<void> {
    return loadVoiceBuffer(voice)
      .then((loaded) => {
        if (current.voice === voice) buffer = loaded
      })
      .catch((error: unknown) => reportOnce(error, 'suono della percussione'))
  }
  let ready = load(sound.voice)

  interface Ringing {
    source: AudioBufferSourceNode
    envelope: GainNode
  }
  const ringing = createVoiceLimit<Ringing>(({ source, envelope }) => {
    const now = envelope.context.currentTime
    envelope.gain.cancelScheduledValues(now)
    envelope.gain.setTargetAtTime(0, now, 0.01)
    source.stop(now + 0.06)
  })

  function hit(pitch: number, time: number, velocity: number): void {
    if (!buffer || !Number.isFinite(time)) return
    const shift = Math.max(-MAX_SHIFT, Math.min(MAX_SHIFT, pitch - PERCUSSION_ROOT_PITCH + current.tune))
    const rate = 2 ** (shift / 12)
    // Nodi del contesto della traccia (dal vivo o offline durante l'export): una sorgente per colpo,
    // così un colpo nuovo non taglia la coda del precedente.
    const raw = output.context.rawContext
    const start = Math.max(time, raw.currentTime)
    const source = raw.createBufferSource()
    source.buffer = buffer
    source.playbackRate.value = rate
    const envelope = raw.createGain()
    envelope.gain.setValueAtTime(velocity, start)
    if (current.length < 1) {
      const end = start + (buffer.duration / rate) * current.length
      envelope.gain.setValueAtTime(velocity, Math.max(start, end - CUT_FADE_SECONDS))
      envelope.gain.linearRampToValueAtTime(0, end)
    }
    source.connect(envelope)
    Tone.connect(envelope, output)
    const hitNodes = { source, envelope }
    source.onended = () => {
      ringing.remove(hitNodes)
      source.disconnect()
      envelope.disconnect()
    }
    source.start(start)
    // Lo stop va chiesto dopo lo start (altrimenti il browser dà errore).
    if (current.length < 1) source.stop(start + (buffer.duration / rate) * current.length + 0.01)
    ringing.add(hitNodes)
  }

  return {
    output,
    get ready() {
      return ready
    },
    play: (event, time) => {
      if (event.kind === 'note') hit(event.pitch, time, event.velocity)
    },
    noteOn: (pitch, velocity) => hit(pitch, Tone.now(), velocity),
    noteOff: () => {},
    releaseAll: () => {},
    update: (track) => {
      if (track.kind !== 'percussion' || track.sound === current) return
      const voiceChanged = track.sound.voice !== current.voice
      current = track.sound
      if (!voiceChanged) return
      buffer = null
      output.gain.rampTo(dbToAmplitude(levelDb(current.voice)), 0.05)
      ready = load(current.voice)
    },
    dispose: () => output.dispose(),
  }
}
