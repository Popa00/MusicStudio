import { newId } from './ids'
import type { EffectSettings, EffectType } from './types'

/** Impostazioni iniziali di ogni effetto: già "musicali", da ritoccare a orecchio. */
export function createEffectSettings(type: EffectType): EffectSettings {
  const base = { id: newId(), enabled: true }
  switch (type) {
    case 'reverb':
      return { ...base, type, decay: 2.5, wet: 0.3 }
    case 'delay':
      return { ...base, type, time: '8n', feedback: 0.35, wet: 0.25 }
    case 'filter':
      return { ...base, type, mode: 'lowpass', frequency: 2000, resonance: 1 }
    case 'eq':
      return { ...base, type, low: 0, mid: 0, high: 0 }
    case 'distortion':
      return { ...base, type, amount: 0.3, wet: 0.5 }
  }
}

export const EFFECT_INFO: Record<EffectType, { name: string; description: string }> = {
  reverb: { name: 'Riverbero', description: "Aggiunge l'eco di una stanza o di una sala: il suono diventa più ampio e lontano." },
  delay: { name: 'Delay (eco)', description: 'Ripete il suono a tempo, come un eco in montagna.' },
  filter: { name: 'Filtro', description: 'Toglie gli acuti (suono più scuro) o i bassi (suono più sottile).' },
  eq: { name: 'Equalizzatore', description: 'Alza o abbassa bassi, medi e acuti, come i toni di uno stereo.' },
  distortion: { name: 'Distorsione', description: 'Sporca il suono rendendolo ruvido e aggressivo, come una chitarra rock.' },
}

export const EFFECT_TYPES: EffectType[] = ['reverb', 'delay', 'filter', 'eq', 'distortion']
