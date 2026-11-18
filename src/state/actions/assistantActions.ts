import { buildMessages, completedTurns, QUESTION_MAX_CHARS, visibleAnswer } from '../../assistant/conversation'
import { assistantRetriever } from '../../assistant/knowledge/defaultRetriever'
import { librarySection, sourcesOf } from '../../assistant/knowledge/libraryPrompt'
import type { FoundCard, Retriever } from '../../assistant/knowledge/retrieve'
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

/** Le istruzioni con il brano com'è adesso (ogni domanda vede le ultime modifiche) e le schede trovate. */
function currentSystemPrompt(cards: readonly FoundCard[]): string {
  const { selectedTrackId, selectedPatternId } = useUiStore.getState()
  const project = useProjectStore.getState().project
  return systemPrompt(projectSummary(project, { trackId: selectedTrackId, patternId: selectedPatternId }), librarySection(cards))
}

/** L'ultima domanda a cui l'assistente ha risposto: serve a capire domande come "e sulla voce?". */
function previousQuestion(turns: readonly ChatMessage[]): string | null {
  return turns.findLast((m) => m.role === 'user')?.content ?? null
}

function errorText(error: unknown): string {
  return error instanceof AssistantError ? error.message : "Qualcosa è andato storto con l'assistente. Riprova."
}

/** Manda una domanda all'assistente e scrive la risposta man mano che arriva. */
export async function askAssistant(
  question: string,
  provider: ChatProvider = assistantProvider,
  retrieve: Retriever = assistantRetriever,
): Promise<void> {
  const text = question.trim().slice(0, QUESTION_MAX_CHARS)
  const store = useAssistantStore.getState()
  if (!text || store.answering) return
  const turns = completedTurns(store.messages)
  const history: ChatMessage[] = [...turns, { role: 'user', content: text }]
  const answer: AssistantMessage = { id: newId(), role: 'assistant', content: '' }
  store.set({ messages: [...store.messages, { id: newId(), role: 'user', content: text }, answer], answering: true })
  controller = new AbortController()
  const { signal } = controller
  let content = ''
  try {
    const cards = await retrieve(text, previousQuestion(turns), signal)
    // Fermata mentre cercava nella biblioteca: la domanda non parte nemmeno.
    if (signal.aborted) return
    const sources = sourcesOf(cards.filter((c) => c.cited))
    for await (const piece of provider.stream(buildMessages(currentSystemPrompt(cards), history), signal)) {
      content += piece
      // Se il modello sta ricopiando le istruzioni riservate, la risposta si ferma e viene sostituita.
      if (leaksInstructions(visibleAnswer(content))) {
        updateMessage(answer.id, (m) => ({ ...m, content: BLOCKED_ANSWER, sources: undefined }))
        break
      }
      updateMessage(answer.id, (m) => ({ ...m, content, sources: sources.length ? sources : undefined }))
      const model = provider.modelName()
      if (useAssistantStore.getState().model !== model) useAssistantStore.getState().set({ model })
    }
  } catch (error) {
    if (!signal.aborted) updateMessage(answer.id, (m) => ({ ...m, content: errorText(error), error: true, sources: undefined }))
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
