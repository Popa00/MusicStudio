/* oxlint-disable require-yield -- i fornitori finti che falliscono subito sono generatori senza yield, apposta */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AssistantError, type ChatProvider } from '../../assistant/provider/types'
import { TEMPLATES } from '../../project/templates'
import { useAssistantStore } from '../assistantStore'
import { useProjectStore } from '../projectStore'
import { askAssistant, clearAssistant, stopAssistant } from './assistantActions'

const store = () => useAssistantStore.getState()
const untilAborted = (signal: AbortSignal) => new Promise<void>((resolve) => signal.addEventListener('abort', () => resolve()))

const providerOf = (script: (signal: AbortSignal) => AsyncGenerator<string>): ChatProvider => ({
  modelName: () => null,
  stream: (_messages, signal) => script(signal),
})

beforeEach(() => {
  stopAssistant()
  useAssistantStore.setState({ messages: [], answering: false, model: null })
  useProjectStore.setState({ project: TEMPLATES[0].create() })
})

describe('askAssistant: errori', () => {
  it('un AssistantError diventa un messaggio con error:true e il suo testo', async () => {
    await askAssistant('q', providerOf(async function* () { throw new AssistantError('LM Studio non risponde. Riprova.') }))
    expect(store().messages[1]).toMatchObject({ role: 'assistant', content: 'LM Studio non risponde. Riprova.', error: true })
    expect(store().answering).toBe(false)
  })
  it('un errore qualunque mostra un messaggio generico senza i dettagli tecnici', async () => {
    await askAssistant('q', providerOf(async function* () { throw new Error('dettaglio interno segreto') }))
    expect(store().messages[1].error).toBe(true)
    expect(store().messages[1].content).toContain('Qualcosa è andato storto')
    expect(store().messages[1].content).not.toContain('segreto')
  })
  it('un errore dopo qualche pezzo sostituisce il testo parziale con l\'errore', async () => {
    await askAssistant('q', providerOf(async function* () { yield 'parz'; throw new AssistantError('caduto') }))
    expect(store().messages[1]).toMatchObject({ content: 'caduto', error: true })
  })
  it('dopo un errore si può fare una nuova domanda', async () => {
    await askAssistant('q', providerOf(async function* () { throw new AssistantError('x') }))
    await askAssistant('q2', providerOf(async function* () { yield 'ok' }))
    expect(store().messages).toHaveLength(4)
    expect(store().messages[3]).toMatchObject({ content: 'ok' })
    expect(store().messages[3].error).toBeUndefined()
  })
})

describe('stopAssistant e clearAssistant', () => {
  it('fermare con del testo già scritto lo conserva e aggiunge "(interrotta)"', async () => {
    const done = askAssistant('q', providerOf(async function* (signal) { yield 'Parziale'; await untilAborted(signal) }))
    await vi.waitFor(() => expect(store().messages[1]?.content).toBe('Parziale'))
    stopAssistant()
    await done
    expect(store().messages[1].content).toBe('Parziale … (interrotta)')
    expect(store().messages[1].error).toBeUndefined()
    expect(store().answering).toBe(false)
  })
  it('fermare prima di qualsiasi testo dà "(interrotta)" come errore, che non va rimandato al modello', async () => {
    const done = askAssistant('q', providerOf(async function* (signal) { await untilAborted(signal) }))
    await vi.waitFor(() => expect(store().answering).toBe(true))
    stopAssistant()
    await done
    expect(store().messages[1]).toMatchObject({ content: '(interrotta)', error: true })
  })
  it('un errore del fornitore causato dall\'interruzione non diventa un messaggio di errore', async () => {
    const done = askAssistant('q', providerOf(async function* (signal) {
      yield 'a'
      await untilAborted(signal)
      throw new DOMException('Aborted', 'AbortError')
    }))
    await vi.waitFor(() => expect(store().messages[1]?.content).toBe('a'))
    stopAssistant()
    await done
    expect(store().messages[1].content).toBe('a … (interrotta)')
  })
  it('stopAssistant senza risposte in corso non fa nulla', () => {
    expect(() => stopAssistant()).not.toThrow()
    expect(store().answering).toBe(false)
  })
  it('clearAssistant cancella la conversazione', async () => {
    await askAssistant('q', providerOf(async function* () { yield 'a' }))
    expect(store().messages).toHaveLength(2)
    clearAssistant()
    expect(store().messages).toEqual([])
  })
  it('clearAssistant durante una risposta la ferma e non lascia messaggi', async () => {
    const done = askAssistant('q', providerOf(async function* (signal) { yield 'a'; await untilAborted(signal) }))
    await vi.waitFor(() => expect(store().messages[1]?.content).toBe('a'))
    clearAssistant()
    await done
    expect(store().messages).toEqual([])
    expect(store().answering).toBe(false)
  })
  it('dopo clearAssistant si può ricominciare', async () => {
    await askAssistant('q', providerOf(async function* () { yield 'a' }))
    clearAssistant()
    await askAssistant('nuova', providerOf(async function* () { yield 'b' }))
    expect(store().messages.map((m) => m.content)).toEqual(['nuova', 'b'])
  })
})
