/** Quante modifiche si possono annullare. */
export const HISTORY_LIMIT = 100

/** Modifiche con la stessa chiave entro questo tempo contano come una sola (es. trascinare un cursore). */
export const MERGE_WINDOW_MS = 1000

/** Chiavi di un singolo gesto (un trascinamento): si uniscono sempre, anche con pause lunghe. */
export const GESTURE_PREFIX = 'gesture:'

export interface History<T> {
  past: T[]
  future: T[]
  mergeKey: string | null
  changedAt: number
}

export function emptyHistory<T>(): History<T> {
  return { past: [], future: [], mergeKey: null, changedAt: 0 }
}

function shouldMerge<T>(h: History<T>, mergeKey: string | undefined, now: number): boolean {
  if (mergeKey === undefined || mergeKey !== h.mergeKey) return false
  return mergeKey.startsWith(GESTURE_PREFIX) || now - h.changedAt < MERGE_WINDOW_MS
}

/** Registra `previous` nella cronologia prima di passare a un nuovo stato. */
export function record<T>(h: History<T>, previous: T, mergeKey: string | undefined, now: number): History<T> {
  const past = shouldMerge(h, mergeKey, now) ? h.past : [...h.past, previous].slice(-HISTORY_LIMIT)
  return { past, future: [], mergeKey: mergeKey ?? null, changedAt: now }
}

export function undo<T>(h: History<T>, current: T): { history: History<T>; value: T } | null {
  const value = h.past.at(-1)
  if (value === undefined) return null
  return { value, history: { past: h.past.slice(0, -1), future: [current, ...h.future], mergeKey: null, changedAt: 0 } }
}

export function redo<T>(h: History<T>, current: T): { history: History<T>; value: T } | null {
  const value = h.future[0]
  if (value === undefined) return null
  return { value, history: { past: [...h.past, current], future: h.future.slice(1), mergeKey: null, changedAt: 0 } }
}
