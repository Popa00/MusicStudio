import { buildMessages, completedTurns, QUESTION_MAX_CHARS, visibleAnswer } from '../../assistant/conversation'
import { BLOCKED_ANSWER, leaksInstructions } from '../../assistant/guard'
import { systemPrompt } from '../../assistant/prompt'
import { assistantProvider } from '../../assistant/provider'
import { AssistantError, type ChatMessage, type ChatProvider } from '../../assistant/provider/types'
import { projectSummary } from '../../assistant/summary/projectSummary'
import { newId } from '../../project/ids'
import { useAssistantStore, type AssistantMessage } from '../assistantStore'
import { useProjectStore } from '../projectStore'
import { useUiStore } from '../uiStore'

let controller: AbortController | null = null

function updateMessage(id: string, change: (m: AssistantMessage) => AssistantMessage): void {
  const { messages, set } = useAssistantStore.getState()
  set({ messages: messages.map((m) => (m.id === id ? change(m) : m)) })
}

/** Le istruzioni con il brano com'è adesso: ogni domanda vede le ultime modifiche. */
function currentSystemPrompt(): string {
  const { selectedTrackId, selectedPatternId } = useUiStore.getState()
  const project = useProjectStore.getState().project
  return systemPrompt(projectSummary(project, { trackId: selectedTrackId, patternId: selectedPatternId }))
}

function errorText(error: unknown): string {
  return error instanceof AssistantError ? error.message : "Qualcosa è andato storto con l'assistente. Riprova."
}

/** Manda una domanda all'assistente e scrive la risposta man mano che arriva. */
export async function askAssistant(question: string, provider: ChatProvider = assistantProvider): Promise<void> {
  const text = question.trim().slice(0, QUESTION_MAX_CHARS)
  const store = useAssistantStore.getState()
  if (!text || store.answering) return
  const history: ChatMessage[] = [...completedTurns(store.messages), { role: 'user', content: text }]
  const answer: AssistantMessage = { id: newId(), role: 'assistant', content: '' }
  store.set({ messages: [...store.messages, { id: newId(), role: 'user', content: text }, answer], answering: true })
  controller = new AbortController()
  const { signal } = controller
  let content = ''
  try {
    for await (const piece of provider.stream(buildMessages(currentSystemPrompt(), history), signal)) {
      content += piece
      // Se il modello sta ricopiando le istruzioni riservate, la risposta si ferma e viene sostituita.
      if (leaksInstructions(visibleAnswer(content))) {
        updateMessage(answer.id, (m) => ({ ...m, content: BLOCKED_ANSWER }))
        break
      }
      updateMessage(answer.id, (m) => ({ ...m, content }))
      const model = provider.modelName()
      if (useAssistantStore.getState().model !== model) useAssistantStore.getState().set({ model })
    }
  } catch (error) {
    if (!signal.aborted) updateMessage(answer.id, (m) => ({ ...m, content: errorText(error), error: true }))
  } finally {
    if (signal.aborted) updateMessage(answer.id, (m) => (m.content ? { ...m, content: `${m.content} … (interrotta)` } : { ...m, content: '(interrotta)', error: true }))
    useAssistantStore.getState().set({ answering: false })
    controller = null
  }
}

/** Ferma la risposta in arrivo (quello che è già scritto resta). */
export function stopAssistant(): void {
  controller?.abort()
}

/** Ricomincia da capo: cancella la conversazione. */
export function clearAssistant(): void {
  stopAssistant()
  useAssistantStore.getState().set({ messages: [] })
}
