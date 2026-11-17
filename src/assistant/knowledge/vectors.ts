/** Vettori degli embedding: normalizzazione, prodotto scalare e codifica compatta (Float32 → base64). */

export function normalizeVector(values: readonly number[]): Float32Array {
  const out = Float32Array.from(values)
  let sum = 0
  for (const v of out) sum += v * v
  const length = Math.sqrt(sum)
  if (!Number.isFinite(length) || length === 0) return out.fill(0)
  for (let i = 0; i < out.length; i++) out[i] /= length
  return out
}

/** Somiglianza tra due vettori normalizzati (coseno): da -1 (opposti) a 1 (uguali). */
export function dot(a: Float32Array, b: Float32Array): number {
  if (a.length !== b.length) return 0
  let sum = 0
  for (let i = 0; i < a.length; i++) sum += a[i] * b[i]
  return sum
}

export function encodeVector(vector: Float32Array): string {
  const bytes = new Uint8Array(vector.buffer, vector.byteOffset, vector.byteLength)
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary)
}

export function decodeVector(base64: string, dims: number): Float32Array {
  const binary = atob(base64)
  const bytes = new Uint8Array(dims * 4)
  for (let i = 0; i < bytes.length; i++) bytes[i] = binary.charCodeAt(i)
  return new Float32Array(bytes.buffer)
}
