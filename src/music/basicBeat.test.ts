import { describe, expect, it } from 'vitest'
import { createBasicBeat } from './basicBeat'

const on = (row: boolean[]) => row.flatMap((v, i) => (v ? [i] : []))

describe('createBasicBeat', () => {
  it('su 16 step mette la cassa su ogni battito', () => {
    expect(on(createBasicBeat(16).kick)).toEqual([0, 4, 8, 12])
  })
  it('su 16 step mette il battimani sul 2 e sul 4', () => {
    expect(on(createBasicBeat(16).clap)).toEqual([4, 12])
  })
  it('su 16 step mette il charleston chiuso su ogni ottavo', () => {
    expect(on(createBasicBeat(16).hihatClosed)).toEqual([0, 2, 4, 6, 8, 10, 12, 14])
  })
  it('lascia vuoti rullante e charleston aperto', () => {
    const p = createBasicBeat(16)
    expect(on(p.snare)).toEqual([])
    expect(on(p.hihatOpen)).toEqual([])
  })
  it('rispetta la lunghezza richiesta (anche 12 e 0)', () => {
    expect(createBasicBeat(12).kick).toHaveLength(12)
    expect(on(createBasicBeat(12).kick)).toEqual([0, 4, 8])
    expect(createBasicBeat(0).kick).toEqual([])
  })
})
