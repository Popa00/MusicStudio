import type { SynthSettings } from './types'

/** Gruppi del menu dei preset: aiutano a scegliere in base al ruolo nel brano. */
export const PRESET_CATEGORIES = ['Tastiere', 'Bassi', 'Melodie', 'Tappeti e archi', 'Suoni brevi'] as const
export type PresetCategory = (typeof PRESET_CATEGORIES)[number]

export interface SynthPreset {
  name: string
  category: PresetCategory
  description: string
  settings: SynthSettings
}

type Envelope = [attack: number, decay: number, sustain: number, release: number]

function preset(
  name: string,
  category: PresetCategory,
  description: string,
  waveform: SynthSettings['waveform'],
  [attack, decay, sustain, release]: Envelope,
  cutoff: number,
  resonance: number,
): SynthPreset {
  return { name, category, description, settings: { preset: name, waveform, attack, decay, sustain, release, cutoff, resonance } }
}

/** Suoni pronti: un punto di partenza da ritoccare con le manopole. Il primo è quello delle tracce nuove. */
export const SYNTH_PRESETS: SynthPreset[] = [
  preset('Piano elettrico', 'Tastiere', 'Morbido e rotondo, adatto ad accordi e melodie', 'triangle', [0.005, 0.6, 0.3, 0.8], 2500, 1),
  preset('Organo', 'Tastiere', 'Suono continuo e "vuoto", resta finché tieni la nota', 'square', [0.005, 0.1, 0.45, 0.08], 3000, 0.7),
  preset('Marimba', 'Tastiere', 'Colpo di legno morbido e breve, per giri ritmati', 'triangle', [0.001, 0.25, 0, 0.2], 2200, 1),

  preset('Basso', 'Bassi', 'Grave e pieno, per la linea di basso', 'sawtooth', [0.005, 0.3, 0.6, 0.15], 600, 2),
  preset('Sub basso', 'Bassi', 'Profondissimo e pulito: si sente più nel petto che nelle orecchie', 'sine', [0.005, 0.2, 0.45, 0.2], 400, 0.7),
  preset('Basso acido', 'Bassi', 'Nasale e graffiante, per bassi elettronici e techno', 'sawtooth', [0.003, 0.25, 0.5, 0.1], 900, 10),

  preset('Lead', 'Melodie', 'Brillante e deciso, per la melodia principale', 'square', [0.01, 0.2, 0.4, 0.3], 2500, 1.5),
  preset('Pluck', 'Melodie', 'Pizzicato e corto, tipico della musica elettronica', 'sawtooth', [0.002, 0.3, 0.15, 0.2], 2500, 4),
  preset('Flauto', 'Melodie', 'Dolce e soffiato, per melodie tranquille', 'triangle', [0.08, 0.2, 0.4, 0.3], 3000, 1),
  preset('Fiati synth', 'Melodie', 'Pieno e squillante, come una sezione di trombe elettroniche', 'sawtooth', [0.06, 0.3, 0.5, 0.25], 2300, 1.5),
  preset('Chiptune', 'Melodie', 'Il suono dei videogiochi anni \'80', 'square', [0.001, 0.1, 0.45, 0.05], 12000, 0.7),

  preset('Pad atmosferico', 'Tappeti e archi', 'Entra e sfuma lentamente, crea un tappeto sonoro', 'sawtooth', [0.8, 1, 0.8, 2.5], 1800, 1),
  preset('Archi', 'Tappeti e archi', 'Come un gruppo di violini: entra morbido e lega le note', 'sawtooth', [0.35, 0.5, 0.55, 1.2], 2800, 0.7),
  preset('Tappeto scuro', 'Tappeti e archi', 'Caldo e lontano, riempie lo sfondo senza disturbare', 'triangle', [1.5, 1, 0.6, 4], 900, 1),

  preset('Campanella', 'Suoni brevi', 'Breve e cristallino, per arpeggi', 'sine', [0.002, 0.4, 0, 0.6], 8000, 1),
  preset('Corda pizzicata', 'Suoni brevi', 'Come una chitarra o un\'arpa pizzicata', 'sawtooth', [0.001, 1.2, 0, 0.5], 1800, 1),
]

export const DEFAULT_SYNTH = SYNTH_PRESETS[0].settings

export function findPreset(name: string): SynthPreset | undefined {
  return SYNTH_PRESETS.find((p) => p.name === name)
}
