import type { ChatMessage } from './provider/types'

/** Spazio per i messaggi precedenti, in caratteri (~1000 token): le domande vecchie escono per prime. */
export const HISTORY_MAX_CHARS = 3500
/** Lunghezza massima di una domanda. */
export const QUESTION_MAX_CHARS = 2000

/** Un messaggio della chat come lo conserva l'app (gli errori si mostrano ma non si rimandano al modello). */
export interface StoredMessage {
  role: 'user' | 'assistant'
  content: string
  error?: boolean
}

/**
 * Solo le coppie domanda + risposta riuscite, in ordine. Molti modelli (Gemma compreso) rifiutano
 * due domande di fila: una domanda rimasta senza risposta (errore, interruzione a vuoto) si toglie.
 */
export function completedTurns(messages: readonly StoredMessage[]): ChatMessage[] {
  const turns: ChatMessage[] = []
  for (let i = 0; i + 1 < messages.length; i++) {
    const [question, answer] = [messages[i], messages[i + 1]]
    if (question.role !== 'user' || answer.role !== 'assistant' || answer.error || !visibleAnswer(answer.content).trim()) continue
    // Il "ragionamento" nascosto non si rimanda: occuperebbe spazio senza servire.
    turns.push({ role: 'user', content: question.content }, { role: 'assistant', content: visibleAnswer(answer.content) })
    i++
  }
  return turns
}

/**
 * I messaggi da mandare al modello: le istruzioni di sistema (con il progetto aggiornato) e gli ultimi
 * scambi che stanno nel limite. L'ultimo messaggio, cioè la domanda, c'è sempre.
 */
export function buildMessages(system: string, history: readonly ChatMessage[], maxChars = HISTORY_MAX_CHARS): ChatMessage[] {
  const kept: ChatMessage[] = []
  let used = 0
  for (let i = history.length - 1; i >= 0; i--) {
    const message = history[i]
    if (kept.length > 0 && used + message.content.length > maxChars) break
    kept.unshift(message)
    used += message.content.length
  }
  // La conversazione deve cominciare con una domanda, non con una risposta rimasta a metà.
  while (kept.length > 1 && kept[0].role !== 'user') kept.shift()
  return [{ role: 'system', content: system }, ...kept]
}

/**
 * Toglie dalla risposta il "ragionamento" che alcuni modelli scrivono tra <think> e </think>:
 * all'utente serve solo la risposta. Un blocco non ancora chiuso (risposta in arrivo) viene nascosto.
 */
export function visibleAnswer(text: string): string {
  return text.replace(/<think>[\s\S]*?(<\/think>|$)/g, '').trimStart()
}
