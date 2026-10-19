import * as Tone from 'tone'
import { dbToAmplitude, hardClip } from '../clip'

// Soglia in dBFS: un po' sotto 0 per proteggere udito e casse.
export const MASTER_CEILING_DB = -1

export interface Master {
  /** Ingresso unico: tutte le tracce si collegano qui, mai a Tone.Destination. */
  input: Tone.Gain
  meter: Tone.Meter
  setVolume: (db: number) => void
  dispose: () => void
}

/**
 * Catena del master: volume → limiter (morbido) → clipper (taglio netto).
 * Il limiter di Tone è un compressore senza lookahead: da solo lascia passare i picchi rapidi.
 * Niente altro compressore: ogni compressore pesa sul processore audio.
 */
export function createMaster(): Master {
  const ceiling = dbToAmplitude(MASTER_CEILING_DB)
  const clipper = new Tone.WaveShaper((x) => hardClip(x, ceiling)).toDestination()
  const limiter = new Tone.Limiter(MASTER_CEILING_DB).connect(clipper)
  const volume = new Tone.Volume(0).connect(limiter)
  const input = new Tone.Gain(1).connect(volume)
  const meter = new Tone.Meter({ smoothing: 0.8 })
  clipper.connect(meter)

  return {
    input,
    meter,
    setVolume: (db) => volume.volume.rampTo(db, 0.05),
    dispose: () => {
      for (const node of [input, volume, limiter, clipper, meter]) node.dispose()
    },
  }
}
