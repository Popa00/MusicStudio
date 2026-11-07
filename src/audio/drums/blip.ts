import * as Tone from 'tone'
import type { AudioOutput } from './types'

export interface BlipOptions {
  /** Frequenze suonate insieme, in Hz. */
  frequencies: number[]
  type: 'sine' | 'triangle' | 'square'
  /** Durata della coda, in secondi. */
  decay: number
  volumeDb: number
}

/**
 * Uno o più "bip" intonati, brevissimi e senza sostegno: la base di rimshot, campanaccio, clave.
 * Un Synth per frequenza (l'oscillatore suona solo durante il colpo, quindi pesa poco).
 */
export function createBlips(output: AudioOutput, { frequencies, type, decay, volumeDb }: BlipOptions) {
  const synths = frequencies.map((frequency) => {
    const synth = new Tone.Synth({
      oscillator: { type },
      envelope: { attack: 0.001, decay, sustain: 0, release: 0.01 },
    }).connect(output)
    synth.volume.value = volumeDb
    return { synth, frequency }
  })
  return {
    trigger: (time: number, velocity: number) => {
      for (const { synth, frequency } of synths) synth.triggerAttackRelease(frequency, decay, time, velocity)
    },
    dispose: () => synths.forEach(({ synth }) => synth.dispose()),
  }
}

/** Un breve fruscio (rumore bianco): attacco di bacchetta, schiocco, sonagli, sabbia. */
export function createNoiseBurst(output: AudioOutput, attack: number, decay: number, volumeDb: number) {
  const noise = new Tone.NoiseSynth({
    noise: { type: 'white' },
    envelope: { attack, decay, sustain: 0, release: 0.01 },
  }).connect(output)
  noise.volume.value = volumeDb
  return {
    trigger: (time: number, velocity: number) => noise.triggerAttackRelease(attack + decay, time, velocity),
    dispose: () => noise.dispose(),
  }
}
