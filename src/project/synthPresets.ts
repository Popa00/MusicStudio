import type { SynthSettings } from './types'

export interface SynthPreset {
  name: string
  description: string
  settings: SynthSettings
}

/** Suoni pronti: un punto di partenza da ritoccare con le manopole. */
export const SYNTH_PRESETS: SynthPreset[] = [
  {
    name: 'Piano elettrico',
    description: 'Morbido e rotondo, adatto ad accordi e melodie',
    settings: { preset: 'Piano elettrico', waveform: 'triangle', attack: 0.005, decay: 0.6, sustain: 0.3, release: 0.8, cutoff: 2500, resonance: 1 },
  },
  {
    name: 'Basso',
    description: 'Grave e pieno, per la linea di basso',
    settings: { preset: 'Basso', waveform: 'sawtooth', attack: 0.005, decay: 0.3, sustain: 0.6, release: 0.15, cutoff: 600, resonance: 2 },
  },
  {
    name: 'Pad atmosferico',
    description: 'Entra e sfuma lentamente, crea un tappeto sonoro',
    settings: { preset: 'Pad atmosferico', waveform: 'sawtooth', attack: 0.8, decay: 1, sustain: 0.8, release: 2.5, cutoff: 1800, resonance: 1 },
  },
  {
    name: 'Lead',
    description: 'Brillante e deciso, per la melodia principale',
    settings: { preset: 'Lead', waveform: 'square', attack: 0.01, decay: 0.2, sustain: 0.4, release: 0.3, cutoff: 2500, resonance: 1.5 },
  },
  {
    name: 'Campanella',
    description: 'Breve e cristallino, per arpeggi',
    settings: { preset: 'Campanella', waveform: 'sine', attack: 0.002, decay: 0.4, sustain: 0, release: 0.6, cutoff: 8000, resonance: 1 },
  },
  {
    name: 'Pluck',
    description: 'Pizzicato e corto, tipico della musica elettronica',
    settings: { preset: 'Pluck', waveform: 'sawtooth', attack: 0.002, decay: 0.3, sustain: 0.15, release: 0.2, cutoff: 2500, resonance: 4 },
  },
]

export const DEFAULT_SYNTH = SYNTH_PRESETS[0].settings

export function findPreset(name: string): SynthPreset | undefined {
  return SYNTH_PRESETS.find((p) => p.name === name)
}
