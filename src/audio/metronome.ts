import * as Tone from 'tone'
import { stepsPerBar, stepsPerBeat, type TimeSignature } from '../music/timing'

export interface Metronome {
  /** Fa "tic" su ogni battito, più acuto sul primo della battuta. */
  tick: (step: number, ts: TimeSignature, time: number) => void
  dispose: () => void
}

export function createMetronome(destination: Tone.InputNode): Metronome {
  const click = new Tone.Synth({
    oscillator: { type: 'sine' },
    envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.01 },
    volume: -12,
  }).connect(destination)

  return {
    tick: (step, ts, time) => {
      if (step % stepsPerBeat(ts) !== 0) return
      const accent = step % stepsPerBar(ts) === 0
      click.triggerAttackRelease(accent ? 1600 : 1000, 0.03, time)
    },
    dispose: () => click.dispose(),
  }
}
