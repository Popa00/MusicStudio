import { liveGraph } from './engine'

/** Suona una nota dal vivo sulla traccia (tastiera del PC, tasti del piano roll). */
export function previewNoteOn(trackId: string, pitch: number, velocity = 0.8): void {
  liveGraph()?.track(trackId)?.instrument.noteOn(pitch, velocity)
}

export function previewNoteOff(trackId: string, pitch: number): void {
  liveGraph()?.track(trackId)?.instrument.noteOff(pitch)
}

/** Nota breve di prova, es. quando si disegna una nota nel piano roll. */
export function previewNote(trackId: string, pitch: number, seconds = 0.25): void {
  previewNoteOn(trackId, pitch)
  setTimeout(() => previewNoteOff(trackId, pitch), seconds * 1000)
}

function meterDb(meter: { getValue: () => number | number[] } | undefined): number {
  const value = meter?.getValue()
  const db = Array.isArray(value) ? Math.max(...value) : (value ?? -Infinity)
  return Number.isFinite(db) ? db : -Infinity
}

/** Livello attuale della traccia in dB (per l'indicatore del mixer). */
export function trackLevelDb(trackId: string): number {
  return meterDb(liveGraph()?.track(trackId)?.meter)
}

export function masterLevelDb(): number {
  return meterDb(liveGraph()?.master.meter)
}
