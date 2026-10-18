export const formatDb = (db: number) => (db <= -60 ? '-∞ dB' : `${db > 0 ? '+' : ''}${db.toFixed(1)} dB`)

export const formatSeconds = (s: number) => (s < 1 ? `${Math.round(s * 1000)} ms` : `${s.toFixed(2)} s`)

export const formatHz = (hz: number) => (hz >= 1000 ? `${(hz / 1000).toFixed(1)} kHz` : `${Math.round(hz)} Hz`)

export const formatPercent = (v: number) => `${Math.round(v * 100)}%`

export function formatPan(pan: number): string {
  if (Math.abs(pan) < 0.05) return 'Centro'
  return `${Math.round(Math.abs(pan) * 100)}% ${pan < 0 ? 'Sx' : 'Dx'}`
}
