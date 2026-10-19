/** Massimo numero di tipi di errore diversi ricordati (evita che la memoria cresca all'infinito). */
const MAX_REPORTED = 50

const reported = new Set<string>()

/** Chiave dell'errore senza numeri, così "valore 0.31" e "valore 0.47" contano come lo stesso. */
export function errorKey(error: unknown): string {
  const message = error instanceof Error ? `${error.name}: ${error.message}` : String(error)
  return message.replace(/-?\d+(\.\d+)?(e[-+]?\d+)?/gi, '#').slice(0, 200)
}

/** Segnala in console un tipo di errore una sola volta per riproduzione. */
export function reportOnce(error: unknown, where: string): void {
  const key = errorKey(error)
  if (reported.has(key) || reported.size >= MAX_REPORTED) return
  reported.add(key)
  console.warn(`Music Studio: ${where} saltato:`, error)
}

/** Ad ogni nuova riproduzione gli errori tornano a essere segnalati. */
export function resetReported(): void {
  reported.clear()
}

/** Esegue `fn`; se fallisce lo segnala e prosegue, senza fermare il resto dell'audio. */
export function safely(fn: () => void, where = 'evento audio'): void {
  try {
    fn()
  } catch (error) {
    reportOnce(error, where)
  }
}

interface TimeoutHost {
  setTimeout: (fn: (...args: unknown[]) => void, timeout: number) => number
}

/**
 * Tone.js rinvia alcune operazioni (es. il rilascio delle note dei synth) con un suo timer.
 * Se una di queste lancia un errore, Tone la ripete a ogni tick e blocca l'orologio di tutto
 * il trasporto: silenzio totale. Qui ogni funzione rinviata viene protetta.
 */
export function guardContextTimeouts(context: TimeoutHost): void {
  const original = context.setTimeout.bind(context)
  context.setTimeout = (fn, timeout) => original((...args) => safely(() => fn(...args), 'evento rinviato'), timeout)
}
