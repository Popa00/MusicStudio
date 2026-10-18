import * as Tone from 'tone'
import { dbToAmplitude, hardClip } from './clip'

// Soglia in dBFS: un po' sotto 0 per proteggere udito e casse.
export const MASTER_CEILING_DB = -1

let masterInput: Tone.Gain | null = null

/**
 * Ingresso unico del master. Tutte le tracce si collegano qui, mai a Tone.Destination:
 * così ogni suono passa dal limiter (morbido) e poi dal clipper (taglio netto).
 * Il limiter di Tone è un compressore senza lookahead: da solo lascia passare i picchi rapidi.
 */
export function getMasterInput(): Tone.Gain {
  if (!masterInput) {
    const ceiling = dbToAmplitude(MASTER_CEILING_DB)
    const clipper = new Tone.WaveShaper((x) => hardClip(x, ceiling)).toDestination()
    const limiter = new Tone.Limiter(MASTER_CEILING_DB).connect(clipper)
    masterInput = new Tone.Gain(1).connect(limiter)
  }
  return masterInput
}
