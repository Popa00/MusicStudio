/** Un messaggio della conversazione, nel formato usato da quasi tutti i servizi di modelli linguistici. */
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

/**
 * Chi genera le risposte. Oggi un modello sul PC (LM Studio); domani un servizio in rete dietro un server:
 * il resto dell'app non cambia, cambia solo questa implementazione.
 */
export interface ChatProvider {
  /** La risposta un pezzo alla volta, man mano che il modello la scrive. */
  stream(messages: ChatMessage[], signal: AbortSignal): AsyncGenerator<string>
  /** Nome del modello usato l'ultima volta (da mostrare), o null se non si sa ancora. */
  modelName(): string | null
}

/** Chi trasforma i testi in vettori (embedding) per cercare nella biblioteca per significato. */
export interface EmbeddingProvider {
  /** Un vettore normalizzato per ogni testo, nello stesso ordine, calcolato con il modello indicato. */
  embed(texts: string[], model: string, signal: AbortSignal): Promise<Float32Array[]>
}

/** Errore con un messaggio già pronto da mostrare all'utente. */
export class AssistantError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AssistantError'
  }
}
