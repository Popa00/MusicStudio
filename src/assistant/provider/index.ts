import { localEmbeddings } from './localEmbeddings'
import { localServerProvider } from './localServer'

/** Percorso del proxy verso LM Studio, configurato in `build/llmProxy.ts`. */
export const LLM_PROXY_PATH = '/api/llm'

/** Il fornitore usato dall'app. Per passare a un servizio in rete basta cambiare questa riga. */
export const assistantProvider = localServerProvider(LLM_PROXY_PATH)

/** Chi calcola i vettori delle domande per la biblioteca (stesso server delle risposte). */
export const assistantEmbeddings = localEmbeddings(LLM_PROXY_PATH)
