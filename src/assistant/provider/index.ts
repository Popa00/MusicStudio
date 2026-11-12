import { localServerProvider } from './localServer'

/** Percorso del proxy verso LM Studio, configurato in `build/llmProxy.ts`. */
export const LLM_PROXY_PATH = '/api/llm'

/** Il fornitore usato dall'app. Per passare a un servizio in rete basta cambiare questa riga. */
export const assistantProvider = localServerProvider(LLM_PROXY_PATH)
