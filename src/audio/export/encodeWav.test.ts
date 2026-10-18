import { describe, expect, it } from 'vitest'
import { encodeWav } from './encodeWav'

const text = (view: DataView, offset: number, length: number) =>
  new TextDecoder().decode(new Uint8Array(view.buffer, offset, length))

function samples(buffer: ArrayBuffer): number[] {
  const view = new DataView(buffer)
  const out: number[] = []
  for (let o = 44; o < buffer.byteLength; o += 2) out.push(view.getInt16(o, true))
  return out
}

describe('encodeWav: intestazione', () => {
  it('scrive un header WAV PCM 16 bit corretto (mono)', () => {
    const buffer = encodeWav([new Float32Array([0, 0, 0])], 44100)
    const view = new DataView(buffer)
    expect(buffer.byteLength).toBe(44 + 6)
    expect(text(view, 0, 4)).toBe('RIFF')
    expect(view.getUint32(4, true)).toBe(36 + 6)
    expect(text(view, 8, 4)).toBe('WAVE')
    expect(text(view, 12, 4)).toBe('fmt ')
    expect(view.getUint32(16, true)).toBe(16)
    expect(view.getUint16(20, true)).toBe(1)
    expect(view.getUint16(22, true)).toBe(1)
    expect(view.getUint32(24, true)).toBe(44100)
    expect(view.getUint32(28, true)).toBe(44100 * 2)
    expect(view.getUint16(32, true)).toBe(2)
    expect(view.getUint16(34, true)).toBe(16)
    expect(text(view, 36, 4)).toBe('data')
    expect(view.getUint32(40, true)).toBe(6)
  })
  it('in stereo raddoppia byte al secondo, allineamento e dati', () => {
    const buffer = encodeWav([new Float32Array(4), new Float32Array(4)], 48000)
    const view = new DataView(buffer)
    expect(buffer.byteLength).toBe(44 + 16)
    expect(view.getUint16(22, true)).toBe(2)
    expect(view.getUint32(28, true)).toBe(48000 * 4)
    expect(view.getUint16(32, true)).toBe(4)
    expect(view.getUint32(40, true)).toBe(16)
  })
  it('audio vuoto: solo l\'header', () => {
    const buffer = encodeWav([new Float32Array(0)], 44100)
    expect(buffer.byteLength).toBe(44)
    expect(new DataView(buffer).getUint32(40, true)).toBe(0)
  })
})

describe('encodeWav: campioni', () => {
  it('converte -1..1 negli interi a 16 bit', () => {
    expect(samples(encodeWav([new Float32Array([0, 1, -1, 0.5, -0.5])], 44100))).toEqual([0, 32767, -32768, 16383, -16384])
  })
  it('in stereo alterna i canali sinistro e destro', () => {
    const left = new Float32Array([0.5, -0.5])
    const right = new Float32Array([1, -1])
    expect(samples(encodeWav([left, right], 44100))).toEqual([16383, 32767, -16384, -32768])
  })
  it('taglia i campioni oltre ±1 invece di farli "girare"', () => {
    expect(samples(encodeWav([new Float32Array([2, -3, 1.0001, 100])], 44100))).toEqual([32767, -32768, 32767, 32767])
  })
  it('NaN e Infinity diventano silenzio (0)', () => {
    expect(samples(encodeWav([new Float32Array([NaN, Infinity, -Infinity])], 44100))).toEqual([0, 0, 0])
  })
  it('un canale più corto viene completato con silenzio', () => {
    const out = samples(encodeWav([new Float32Array([1, 1]), new Float32Array([1])], 44100))
    expect(out).toEqual([32767, 32767, 32767, 0])
  })
})
