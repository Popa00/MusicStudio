import type * as Tone from 'tone'
import type { SynthSettings } from '../../project/types'

type MonoOptions = NonNullable<ConstructorParameters<typeof Tone.MonoSynth>[0]>

/** Traduce le manopole dell'app nelle opzioni del MonoSynth di Tone.js. */
export function toMonoSynthOptions(s: SynthSettings): MonoOptions {
  return {
    oscillator: { type: s.waveform },
    envelope: { attack: s.attack, decay: s.decay, sustain: s.sustain, release: s.release },
    filter: { type: 'lowpass', Q: s.resonance, rolloff: -24 },
    // Il filtro si apre un po' all'attacco della nota e torna a "cutoff": suono più vivo.
    filterEnvelope: {
      baseFrequency: s.cutoff,
      octaves: 1.5,
      attack: s.attack,
      decay: s.decay,
      sustain: 0.4,
      release: s.release,
    },
  }
}
