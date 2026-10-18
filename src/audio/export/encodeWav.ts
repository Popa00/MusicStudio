const HEADER_BYTES = 44
const BYTES_PER_SAMPLE = 2

function writeString(view: DataView, offset: number, text: string): void {
  for (let i = 0; i < text.length; i++) view.setUint8(offset + i, text.charCodeAt(i))
}

function toInt16(sample: number): number {
  const s = Math.max(-1, Math.min(1, Number.isFinite(sample) ? sample : 0))
  return s < 0 ? s * 0x8000 : s * 0x7fff
}

/**
 * Codifica l'audio in WAV (PCM 16 bit): il formato non compresso che si apre ovunque.
 * `channels` sono i campioni di ogni canale (1 = mono, 2 = stereo), tutti della stessa lunghezza.
 */
export function encodeWav(channels: Float32Array[], sampleRate: number): ArrayBuffer {
  const numChannels = channels.length
  const frames = channels[0]?.length ?? 0
  const dataBytes = frames * numChannels * BYTES_PER_SAMPLE
  const view = new DataView(new ArrayBuffer(HEADER_BYTES + dataBytes))

  writeString(view, 0, 'RIFF')
  view.setUint32(4, 36 + dataBytes, true)
  writeString(view, 8, 'WAVE')
  writeString(view, 12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, numChannels, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * numChannels * BYTES_PER_SAMPLE, true)
  view.setUint16(32, numChannels * BYTES_PER_SAMPLE, true)
  view.setUint16(34, 16, true)
  writeString(view, 36, 'data')
  view.setUint32(40, dataBytes, true)

  let offset = HEADER_BYTES
  for (let frame = 0; frame < frames; frame++) {
    for (let ch = 0; ch < numChannels; ch++) {
      view.setInt16(offset, toInt16(channels[ch][frame]), true)
      offset += BYTES_PER_SAMPLE
    }
  }
  return view.buffer
}
