import { describe, expect, it } from 'vitest'
import SOURCE from './allpass.worklet.js?raw'

type Opts = { processorOptions: { delaysSeconds: number[]; gain: number } }
interface Proc {
  port: { onmessage: ((e: unknown) => void) | null }
  process(inputs: Float32Array[][], outputs: Float32Array[][]): boolean
}
type Ctor = new (o: Opts) => Proc

/** Esegue il worklet con globali finti e restituisce la classe passata a registerProcessor. */
function load(sampleRate: number, register?: (name: string, c: Ctor) => void) {
  const captured: { name?: string; cls?: Ctor } = {}
  class FakeBase {
    port = { onmessage: null as ((e: unknown) => void) | null }
  }
  const reg = register ?? ((name: string, cls: Ctor) => Object.assign(captured, { name, cls }))
  new Function('AudioWorkletProcessor', 'sampleRate', 'registerProcessor', SOURCE)(FakeBase, sampleRate, reg)
  return captured
}

const RATE = 1000
const make = (delays: number[], gain = 0.5, rate = RATE) => {
  const { cls } = load(rate)
  return new cls!({ processorOptions: { delaysSeconds: delays, gain } })
}

/** Fa girare il processore a blocchi; . */
function run(p: Proc, input: Float32Array, block = 128): Float32Array {
  const total = input.length
  const out = new Float32Array(total)
  for (let s = 0; s < total; s += block) {
    const n = Math.min(block, total - s)
    const o = new Float32Array(n)
    p.process([[input.subarray(s, s + n)]], [[o]])
    out.set(o, s)
  }
  return out
}

const impulse = (len: number) => Object.assign(new Float32Array(len), { 0: 1 })
const noise = (len: number) => Float32Array.from({ length: len }, (_, i) => Math.sin(i * 12.9898) * 0.7)

describe('allpass.worklet: risposta all\'impulso di un passa-tutto (D=10, g=0.5)', () => {
  const D = 10
  const g = 0.5
  const y = run(make([D / RATE]), impulse(10 * D))

  it('y[0] vale -g', () => expect(y[0]).toBeCloseTo(-g, 6))
  it('y[D] vale 1 - g²', () => expect(y[D]).toBeCloseTo(1 - g * g, 6))
  it('y[2D] vale g·(1 - g²)', () => expect(y[2 * D]).toBeCloseTo(g * (1 - g * g), 6))

  it('è zero altrove nei primi 3D campioni', () => {
    for (let n = 0; n < 3 * D; n++) {
      if (n % D !== 0) expect(y[n]).toBeCloseTo(0, 6)
    }
  })

  it('è un passa-tutto vero: energia totale circa 1', () => {
    const long = run(make([D / RATE]), impulse(D * 200))
    const energy = long.reduce((s, v) => s + v * v, 0)
    expect(energy).toBeCloseTo(1, 4)
  })
})

describe('allpass.worklet: comportamento del processore', () => {
  it('è deterministico: due istanze con lo stesso ingresso danno la stessa uscita', () => {
    const x = noise(1000)
    expect(run(make([0.01, 0.007]), x)).toEqual(run(make([0.01, 0.007]), x))
  })

  it('la catena di due passa-tutto equivale ad applicarli uno dopo l\'altro', () => {
    const x = noise(1000)
    const chain = run(make([0.012, 0.007]), x)
    const serial = run(make([0.007]), run(make([0.012]), x))
    chain.forEach((v, i) => expect(v).toBeCloseTo(serial[i], 6))
  })

  it('conserva lo stato tra blocchi da 128 campioni', () => {
    const x = noise(128 * 5)
    const blocks = run(make([0.1, 0.07]), x, 128)
    const whole = run(make([0.1, 0.07]), x, x.length)
    expect(blocks).toEqual(whole)
  })

  it('senza ingresso e con coda ancora da suonare, l\'uscita non è nulla', () => {
    const p = make([200 / RATE])
    p.process([[impulse(128)]], [[new Float32Array(128)]])
    const tail = new Float32Array(128)
    expect(() => p.process([[]], [[tail]])).not.toThrow()
    expect(tail.some((v) => v !== 0)).toBe(true)
  })

  it('senza uscita non va in errore', () => {
    expect(make([0.01]).process([[]], [])).toBe(true)
  })

  it('dopo un messaggio sulla porta process restituisce false', () => {
    const p = make([0.01])
    const o = [[new Float32Array(128)]]
    expect(p.process([[]], o)).toBe(true)
    p.port.onmessage!({})
    expect(p.process([[]], o)).toBe(false)
  })

  it('registra il processore con il nome allpass-chain', () => {
    expect(load(RATE).name).toBe('allpass-chain')
  })

  it('un registerProcessor che lancia (già registrato) non rompe il caricamento', () => {
    expect(() => load(RATE, () => { throw new Error('già registrato') })).not.toThrow()
  })

  it('converte il ritardo con sampleRate: 0.01 s a 48000 Hz sono 480 campioni', () => {
    const y = run(make([0.01], 0.5, 48000), impulse(481 + 480))
    expect(y[0]).toBeCloseTo(-0.5, 6)
    expect(y[480]).toBeCloseTo(0.75, 6)
    expect(y[479]).toBeCloseTo(0, 6)
    expect(y[481]).toBeCloseTo(0, 6)
  })
})
