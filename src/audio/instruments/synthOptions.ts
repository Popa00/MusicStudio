import type * as Tone from 'tone'
import type { SynthSettings } from '../../project/types'

type VoiceOptions = NonNullable<ConstructorParameters<typeof Tone.Synth>[0]>
type FilterOptions = NonNullable<ConstructorParameters<typeof Tone.Filter>[0]>

/** Opzioni di ogni voce: solo oscillatore e inviluppo, così ogni nota costa poco al processore. */
export function toVoiceOptions(s: SynthSettings): VoiceOptions {
  return {
    oscillator: { type: s.waveform },
    envelope: { attack: s.attack, decay: s.decay, sustain: s.sustain, release: s.release },
  }
}

/** Un solo filtro per traccia (non uno per nota): "Brillantezza" e "Risonanza". */
export function toFilterOptions(s: SynthSettings): FilterOptions {
  return { type: 'lowpass', frequency: s.cutoff, Q: s.resonance, rolloff: -12 }
}
