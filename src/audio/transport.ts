import * as Tone from 'tone'
import type { TimeSignature } from '../music/timing'

/** Piccolo anticipo all'avvio, così il primo colpo non viene tagliato. */
const START_DELAY = '+0.05'

export function applyLoop(bars: number): void {
  const transport = Tone.getTransport()
  transport.loop = true
  transport.loopStart = 0
  transport.loopEnd = `${Math.max(1, bars)}m`
}

export function applyTempo(bpm: number): void {
  Tone.getTransport().bpm.value = bpm
}

export function applyTimeSignature(ts: TimeSignature): void {
  Tone.getTransport().timeSignature = [ts.beatsPerBar, ts.beatUnit]
}

export function startTransport(): void {
  Tone.getTransport().start(START_DELAY)
}

export function stopTransport(): void {
  Tone.getTransport().stop()
  // Annulla gli aggiornamenti grafici già programmati per gli step successivi.
  // Attenzione: cancella TUTTI gli eventi di Tone.Draw.
  Tone.getDraw().cancel(0)
}
