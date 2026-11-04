import * as Tone from 'tone'
import { buildSide, setDecay, STEREO_SPREAD } from './reverb/network'
import { attachDiffusers } from './reverb/tail'
import type { EffectNode, SettingsOf } from './types'

const LOW_CUT_HZ = 150

/**
 * Riverbero algoritmico (stile Freeverb): pettini fatti di ritardi, filtri e volumi nativi del browser,
 * poi passa-tutto in un AudioWorklet (vedi reverb/tail.ts).
 * Il riverbero "a convoluzione" di Tone suona simile ma costa molto di più, e il costo cresce con
 * la durata della coda: con 2-3 riverberi il motore audio non reggeva (gracchiare, poi silenzio).
 */
export function createReverb(settings: SettingsOf<'reverb'>): EffectNode {
  const input = new Tone.Gain(1)
  const output = new Tone.Gain(1)
  const dry = new Tone.Gain(1 - settings.wet)
  const wet = new Tone.Gain(settings.wet)
  const ctx = input.context
  const nodes: AudioNode[] = []

  // Mono verso la rete: i due lati ricevono lo stesso segnale e lo "allargano" con ritardi diversi.
  const mono = ctx.createGain()
  mono.channelCount = 1
  mono.channelCountMode = 'explicit'
  // Niente bassi profondi nel riverbero: le risonanze dei pettini li gonfierebbero di +20 dB
  // (rimbombo e master che "gracchia"). È la pratica standard nei riverberi.
  const lowCut = ctx.createBiquadFilter()
  lowCut.type = 'highpass'
  lowCut.frequency.value = LOW_CUT_HZ
  lowCut.Q.value = -3
  const merge = ctx.createChannelMerger(2)
  nodes.push(mono, lowCut, merge)

  input.connect(dry)
  dry.connect(output)
  input.connect(mono)
  mono.connect(lowCut)
  const sides = [buildSide(ctx, lowCut, 0, nodes), buildSide(ctx, lowCut, STEREO_SPREAD, nodes)]
  merge.connect(wet.input)
  wet.connect(output)
  const combs = sides.flatMap((side) => side.combs)
  setDecay(ctx, combs, settings.decay, true)

  const tail = attachDiffusers(ctx, sides.map((side) => side.sum), merge)

  return {
    input,
    output,
    ready: tail.ready,
    update: (s) => {
      if (s.type !== 'reverb') return
      dry.gain.rampTo(1 - s.wet, 0.05)
      wet.gain.rampTo(s.wet, 0.05)
      setDecay(ctx, combs, s.decay)
    },
    dispose: () => {
      tail.dispose()
      for (const n of nodes) n.disconnect()
      for (const n of [input, output, dry, wet]) n.dispose()
    },
  }
}
