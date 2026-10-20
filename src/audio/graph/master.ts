import * as Tone from 'tone'
import { dbToAmplitude, hardClip } from '../clip'

// Soglia in dBFS: un po' sotto 0 per proteggere udito e casse.
export const MASTER_CEILING_DB = -1

/** Durata della dissolvenza allo Stop: abbastanza breve da sembrare immediata, senza "click". */
export const STOP_FADE_SECONDS = 0.03

export interface Master {
  /** Ingresso unico: tutte le tracce si collegano qui, mai a Tone.Destination. */
  input: Tone.Gain
  meter: Tone.Meter
  setVolume: (db: number) => void
  /** Abbassa tutto a zero in un attimo (Stop). */
  close: () => void
  /** Riporta il suono al volume normale. */
  open: () => void
  dispose: () => void
}

/**
 * Catena del master: cancello (per lo Stop) → volume → limiter (morbido) → clipper (taglio netto).
 * Il limiter di Tone è un compressore senza lookahead: da solo lascia passare i picchi rapidi.
 * Niente altro compressore: ogni compressore pesa sul processore audio.
 */
export function createMaster(): Master {
  const ceiling = dbToAmplitude(MASTER_CEILING_DB)
  const clipper = new Tone.WaveShaper((x) => hardClip(x, ceiling)).toDestination()
  const limiter = new Tone.Limiter(MASTER_CEILING_DB).connect(clipper)
  const volume = new Tone.Volume(0).connect(limiter)
  const gate = new Tone.Gain(1).connect(volume)
  const input = new Tone.Gain(1).connect(gate)
  const meter = new Tone.Meter({ smoothing: 0.8 })
  clipper.connect(meter)

  function fadeTo(value: number, seconds: number): void {
    // Il tempo audio attuale, non gate.now(): quello include l'anticipo di programmazione (0,1 s).
    const now = gate.context.currentTime
    gate.gain.cancelScheduledValues(now)
    gate.gain.setValueAtTime(gate.gain.getValueAtTime(now), now)
    gate.gain.linearRampToValueAtTime(value, now + seconds)
  }

  return {
    input,
    meter,
    setVolume: (db) => volume.volume.rampTo(db, 0.05),
    close: () => fadeTo(0, STOP_FADE_SECONDS),
    open: () => fadeTo(1, 0.01),
    dispose: () => {
      for (const node of [input, gate, volume, limiter, clipper, meter]) node.dispose()
    },
  }
}
