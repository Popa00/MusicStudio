import { describe, expect, it } from 'vitest'
import { BASE_DRUM_VOICES, EXTRA_DRUM_VOICES } from '../../music/drumPattern'
import { drumStepsSchema } from './pattern'

const row = (n: number, v = 0) => Array<number>(n).fill(v)
const base = (n: number) => ({ kick: row(n, 1), snare: row(n), clap: row(n), hihatClosed: row(n), hihatOpen: row(n) })

describe('drumStepsSchema', () => {
  it('riempie le righe extra mancanti con zeri lunghi quanto la cassa', () => {
    const r = drumStepsSchema.parse(base(16))
    for (const v of EXTRA_DRUM_VOICES) expect(r[v]).toEqual(row(16))
  })
  it('le righe extra mancanti seguono la lunghezza della cassa anche se è 0', () => {
    expect(drumStepsSchema.parse(base(0)).conga).toEqual([])
  })
  it('conserva le righe extra presenti', () => {
    const r = drumStepsSchema.parse({ ...base(4), cowbell: [0, 0.5, 0, 1] })
    expect(r.cowbell).toEqual([0, 0.5, 0, 1])
    expect(r.clave).toEqual(row(4))
  })
  it.each(BASE_DRUM_VOICES)('rifiuta un file senza la riga di base %s', (voice) => {
    const { [voice]: _omit, ...rest } = base(16)
    expect(drumStepsSchema.safeParse(rest).success).toBe(false)
  })
  it('rifiuta valori fuori range o non numerici in una riga extra', () => {
    for (const bad of [[2], [-0.1], [Number.NaN], ['x']]) {
      expect(drumStepsSchema.safeParse({ ...base(1), perc: bad }).success).toBe(false)
    }
  })
  it('non condivide lo stesso array tra le righe extra', () => {
    const r = drumStepsSchema.parse(base(4))
    expect(r.conga).not.toBe(r.bongo)
  })
})
