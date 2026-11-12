/* oxlint-disable require-yield -- i fornitori finti che falliscono subito sono generatori senza yield, apposta */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { QUESTION_MAX_CHARS } from '../../assistant/conversation'
import { AssistantError, type ChatMessage, type ChatProvider } from '../../assistant/provider/types'
import { projectSummary } from '../../assistant/summary/projectSummary'
import { TEMPLATES } from '../../project/templates'
import { useAssistantStore } from '../assistantStore'
import { useProjectStore } from '../projectStore'
import { useUiStore } from '../uiStore'
import { askAssistant, stopAssistant } from './assistantActions'

const store = () => useAssistantStore.getState()

/** Un fornitore finto: `script` scrive la risposta; salva i messaggi ricevuti. */
function fake(script: (signal: AbortSignal) => AsyncGenerator<string>, model: string | null = 'gemma-finto') {
  const received: ChatMessage[][] = []
  const provider: ChatProvider = {
    modelName: () => model,
    stream(messages, signal) {
      received.push(messages)
      return script(signal)
    },
  }
  return { provider, received }
}

async function* pieces(...texts: string[]) {
  for (const t of texts) yield t
}

/** Resta in attesa finché non arriva l'interruzione. */
const untilAborted = (signal: AbortSignal) => new Promise<void>((resolve) => signal.addEventListener('abort', () => resolve()))

beforeEach(() => {
  stopAssistant()
  useAssistantStore.setState({ messages: [], answering: false, model: null })
  useUiStore.setState({ selectedTrackId: null, selectedPatternId: null })
  useProjectStore.setState({ project: TEMPLATES[0].create() })
})

describe('askAssistant: risposta in streaming', () => {
  it('scrive domanda e risposta nello store, pezzo dopo pezzo', async () => {
    const seen: string[] = []
    const { provider } = fake(async function* () {
      yield 'Ciao'
      seen.push(store().messages[1].content)
      yield ' mondo'
      seen.push(store().messages[1].content)
    })
    await askAssistant('  Che cos\'è un accordo?  ', provider)
    expect(seen).toEqual(['Ciao', 'Ciao mondo'])
    expect(store().messages.map(({ role, content }) => ({ role, content }))).toEqual([
      { role: 'user', content: "Che cos'è un accordo?" },
      { role: 'assistant', content: 'Ciao mondo' },
    ])
    expect(store().messages.every((m) => !m.error)).toBe(true)
  })
  it('"answering" è vero durante la risposta e falso alla fine', async () => {
    const during: boolean[] = []
    const { provider } = fake(async function* () {
      during.push(store().answering)
      yield 'x'
    })
    expect(store().answering).toBe(false)
    await askAssistant('domanda', provider)
    expect(during).toEqual([true])
    expect(store().answering).toBe(false)
  })
  it('ogni messaggio ha un id diverso', async () => {
    await askAssistant('uno', fake(() => pieces('a')).provider)
    await askAssistant('due', fake(() => pieces('b')).provider)
    const ids = store().messages.map((m) => m.id)
    expect(new Set(ids).size).toBe(4)
  })
  it('tiene nello store il nome del modello usato dal fornitore', async () => {
    await askAssistant('q', fake(() => pieces('a'), 'gemma-1').provider)
    expect(store().model).toBe('gemma-1')
    await askAssistant('q2', fake(() => pieces('a'), 'altro').provider)
    expect(store().model).toBe('altro')
  })
  it('una domanda vuota o di soli spazi non fa nulla', async () => {
    const { provider, received } = fake(() => pieces('x'))
    await askAssistant('', provider)
    await askAssistant('   \n ', provider)
    expect(received).toHaveLength(0)
    expect(store().messages).toEqual([])
  })
  it(`una domanda più lunga di ${QUESTION_MAX_CHARS} caratteri viene accorciata`, async () => {
    await askAssistant('a'.repeat(QUESTION_MAX_CHARS + 500), fake(() => pieces('x')).provider)
    expect(store().messages[0].content).toHaveLength(QUESTION_MAX_CHARS)
  })
  it('mentre risponde ignora una seconda domanda', async () => {
    const { provider, received } = fake(async function* (signal) {
      yield 'a'
      await untilAborted(signal)
    })
    const first = askAssistant('prima', provider)
    await vi.waitFor(() => expect(store().messages[1]?.content).toBe('a'))
    await askAssistant('seconda', provider)
    expect(received).toHaveLength(1)
    expect(store().messages).toHaveLength(2)
    stopAssistant()
    await first
  })
})

describe('askAssistant: cosa riceve il modello', () => {
  it('il messaggio di sistema contiene il riassunto del progetto attuale', async () => {
    const { provider, received } = fake(() => pieces('ok'))
    const project = useProjectStore.getState().project
    await askAssistant('Che scala uso?', provider)
    const [system, question] = received[0]
    expect(system.role).toBe('system')
    expect(system.content).toContain(projectSummary(project, { trackId: null, patternId: null }))
    expect(question).toEqual({ role: 'user', content: 'Che scala uso?' })
  })
  it('il riassunto riflette la traccia selezionata e le modifiche al progetto', async () => {
    const project = useProjectStore.getState().project
    useUiStore.setState({ selectedTrackId: project.tracks[0].id, selectedPatternId: project.patterns[0].id })
    useProjectStore.setState({ project: { ...project, name: 'Cambiato' } })
    const { provider, received } = fake(() => pieces('ok'))
    await askAssistant('q', provider)
    expect(received[0][0].content).toContain('Nome: «Cambiato»')
    expect(received[0][0].content).toContain('— SELEZIONATA')
    expect(received[0][0].content).toContain('APERTO ORA NELL')
  })
  it('alla seconda domanda manda anche lo scambio precedente', async () => {
    await askAssistant('prima', fake(() => pieces('risposta uno')).provider)
    const { provider, received } = fake(() => pieces('x'))
    await askAssistant('seconda', provider)
    expect(received[0].slice(1)).toEqual([
      { role: 'user', content: 'prima' },
      { role: 'assistant', content: 'risposta uno' },
      { role: 'user', content: 'seconda' },
    ])
  })
  it('non rimanda al modello le domande finite in errore', async () => {
    await askAssistant('fallita', fake(async function* () { throw new AssistantError('spento') }).provider)
    const { provider, received } = fake(() => pieces('x'))
    await askAssistant('nuova', provider)
    expect(received[0].slice(1)).toEqual([{ role: 'user', content: 'nuova' }])
    expect(store().messages).toHaveLength(4)
  })
})
