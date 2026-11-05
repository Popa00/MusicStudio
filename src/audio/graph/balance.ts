import * as Tone from 'tone'

/** Pan da −1 (tutto a sinistra) a +1 (tutto a destra) → guadagni dei due lati. */
export function balanceGains(pan: number): { left: number; right: number } {
  const angle = ((Math.min(1, Math.max(-1, pan)) + 1) * Math.PI) / 4
  return { left: Math.cos(angle), right: Math.sin(angle) }
}

export interface Balance {
  input: Tone.ToneAudioNode
  output: Tone.ToneAudioNode
  setPan: (pan: number) => void
  dispose: () => void
}

/**
 * Pan della traccia che funziona sia con suoni mono sia stereo.
 * Un suono mono arriva uguale sui due lati; ogni lato viene moltiplicato per cos/sin: è la legge
 * "a potenza costante" di sempre (al centro −3 dB per lato, tutto a un lato = volume pieno su quel
 * lato), quindi il volume non cambia spostando la traccia. Un suono stereo (riverbero) mantiene
 * la sua ampiezza. Il pan di Tone, con ingresso stereo, alzava fino a +3 dB le tracce spostate.
 */
export function createBalance(pan: number): Balance {
  // Il divisore di canali tratta un ingresso mono come "solo sinistra" (interpretazione discreta):
  // prima lo si porta a stereo copiando il mono su entrambi i lati.
  const upmix = new Tone.Gain(1)
  upmix.channelCount = 2
  upmix.channelCountMode = 'explicit'
  upmix.channelInterpretation = 'speakers'
  const split = new Tone.Split(2)
  upmix.connect(split)
  const left = new Tone.Gain()
  const right = new Tone.Gain()
  const merge = new Tone.Merge(2)
  split.connect(left, 0, 0)
  split.connect(right, 1, 0)
  left.connect(merge, 0, 0)
  right.connect(merge, 0, 1)

  function setPan(value: number, rampSeconds: number): void {
    const gains = balanceGains(value)
    left.gain.rampTo(gains.left, rampSeconds)
    right.gain.rampTo(gains.right, rampSeconds)
  }
  // Valore iniziale senza rampa: niente "scivolata" dal centro all'avvio.
  const initial = balanceGains(pan)
  left.gain.value = initial.left
  right.gain.value = initial.right

  return {
    input: upmix,
    output: merge,
    setPan: (value) => setPan(value, 0.05),
    dispose: () => {
      for (const node of [upmix, split, left, right, merge]) node.dispose()
    },
  }
}
