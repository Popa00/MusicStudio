import { create } from 'zustand'
import type { KnowledgeSource } from '../assistant/knowledge/schema'

export interface AssistantMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  /** Il messaggio è un errore da mostrare (es. LM Studio spento): non viene rimandato al modello. */
  error?: boolean
  /** Le fonti delle schede della biblioteca consultate per questa risposta. */
  sources?: KnowledgeSource[]
}

/** La chat con l'assistente: resta solo finché la pagina è aperta, non fa parte del brano. */
interface AssistantState {
  messages: AssistantMessage[]
  answering: boolean
  model: string | null
  set: (changes: Partial<Omit<AssistantState, 'set'>>) => void
}

export const useAssistantStore = create<AssistantState>()((set) => ({
  messages: [],
  answering: false,
  model: null,
  set: (changes) => set(changes),
}))
