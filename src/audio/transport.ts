import * as Tone from 'tone'
import { ticksAtStep, type TimeSignature } from '../music/timing'

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

/** Avvia la riproduzione dallo step indicato (0 = dall'inizio). */
export function startTransport(fromStep = 0): void {
  const transport = Tone.getTransport()
  transport.start(START_DELAY, `${ticksAtStep(fromStep, transport.PPQ)}i`)
}

/** Salta a un altro punto mentre la musica suona. */
export function seekTransport(step: number): void {
  const transport = Tone.getTransport()
  // Gli aggiornamenti grafici già programmati mostrerebbero per un attimo la posizione vecchia.
  Tone.getDraw().cancel(0)
  transport.ticks = ticksAtStep(step, transport.PPQ)
}

export function stopTransport(): void {
  Tone.getTransport().stop()
  // Annulla gli aggiornamenti grafici già programmati per gli step successivi.
  // Attenzione: cancella TUTTI gli eventi di Tone.Draw.
  Tone.getDraw().cancel(0)
}
