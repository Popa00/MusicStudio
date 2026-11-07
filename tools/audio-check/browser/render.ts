import * as Tone from 'tone'
import { encodeWav } from '../../../src/audio/export/encodeWav'
import { clearRenderedVoices } from '../../../src/audio/drums/voiceBuffer'
import { renderSong } from '../../../src/audio/export/renderSong'
import { SCENARIOS, type Scenario } from './scenarios'

/*
 * Caricato nella pagina dal dev server di Vite (tools/audio-check/lib/renderAll.mjs):
 * esporta i suoni di prova con lo stesso motore dell'export WAV dell'app.
 */

/**
 * Numeri casuali "fissi": Tone genera il rumore (batteria, riverbero) con Math.random.
 * Con un seme fisso due esecuzioni sullo stesso codice danno lo stesso audio, e il confronto
 * con il riferimento segnala solo i cambiamenti veri. Vale solo in questa pagina di prova.
 */
function seededRandom(seed: number): () => number {
  let state = seed
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

let noiseReady = false

/**
 * Tone crea i suoi buffer di rumore una volta sola per pagina, al primo suono che li usa, con
 * Math.random. Senza questo passo il rumore dipenderebbe da quale scenario arriva per primo
 * (e quindi da --only o dall'ordine): il charleston aperto variava fino a 3 dB tra due esecuzioni.
 * Qui i buffer nascono sempre all'inizio, sempre dallo stesso seme.
 */
function prepareNoiseBuffers(): void {
  if (noiseReady) return
  Math.random = seededRandom(0)
  for (const type of ['white', 'pink', 'brown'] as const) {
    const noise = new Tone.Noise(type)
    noise.start().stop()
    noise.dispose()
  }
  noiseReady = true
}

export function listScenarios(): Omit<Scenario, 'build'>[] {
  return SCENARIOS.map(({ name, category, description, expect }) => ({ name, category, description, expect }))
}

function toBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  return btoa(binary)
}

/** Esporta lo scenario e restituisce il WAV codificato in base64. */
export async function renderScenario(name: string): Promise<string> {
  const scenario = SCENARIOS.find((s) => s.name === name)
  if (!scenario) throw new Error(`Scenario sconosciuto: ${name}`)
  prepareNoiseBuffers()
  // I suoni delle tracce "percussione" si rigenerano in ogni prova, dallo stesso seme.
  clearRenderedVoices()
  Math.random = seededRandom(1)
  const audio = await renderSong(scenario.build())
  const channels = Array.from({ length: audio.numberOfChannels }, (_, i) => audio.getChannelData(i))
  return toBase64(encodeWav(channels, audio.sampleRate))
}
