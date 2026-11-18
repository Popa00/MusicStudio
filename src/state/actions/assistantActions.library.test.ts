import { beforeEach, describe, expect, it, vi } from 'vitest'
import { BLOCKED_ANSWER } from '../../assistant/guard'
import { LIBRARY_TITLE } from '../../assistant/knowledge/libraryPrompt'
import type { FoundCard, Retriever } from '../../assistant/knowledge/retrieve'
import type { KnowledgeSource } from '../../assistant/knowledge/schema'
import { FEATURES_TITLE } from '../../assistant/prompt'
import { AssistantError, type ChatMessage, type ChatProvider } from '../../assistant/provider/types'
import { TEMPLATES } from '../../project/templates'
import { useAssistantStore } from '../assistantStore'
import { useProjectStore } from '../projectStore'
import { askAssistant, stopAssistant } from './assistantActions'

const store = () => useAssistantStore.getState()
const src = (n: string): KnowledgeSource => ({ title: n, url: `https://en.wikipedia.org/wiki/${n}`, license: 'CC BY-SA 4.0' })
const chunk = (title: string, sources: KnowledgeSource[], cited = true): FoundCard =>
  ({ card: title.toLowerCase(), title, text: `testo di ${title}`, sources, cited })

function provider(texts: string[] | Error = ['ok']) {
  const received: ChatMessage[][] = []
  const p: ChatProvider = {
    modelName: () => 'finto',
    stream(messages) {
      received.push(messages)
      return (async function* () {
        if (texts instanceof Error) throw texts
        for (const t of texts) yield t
      })()
    },
  }
  return { p, received }
}

const retrieverOf = (chunks: FoundCard[]) => vi.fn<Retriever>(async () => chunks)

beforeEach(() => {
  stopAssistant()
  useAssistantStore.setState({ messages: [], answering: false, model: null })
  useProjectStore.setState({ project: TEMPLATES[0].create() })
})

describe('askAssistant: biblioteca', () => {
  it('passa al retriever la domanda e null come precedente alla prima domanda', async () => {
    const retrieve = retrieverOf([])
    await askAssistant('  cos è il riverbero?  ', provider().p, retrieve)
    expect(retrieve.mock.calls[0][0]).toBe('cos è il riverbero?')
    expect(retrieve.mock.calls[0][1]).toBeNull()
    expect(retrieve.mock.calls[0][2]).toBeInstanceOf(AbortSignal)
  })
  it('passa come precedente l ultima domanda con risposta riuscita', async () => {
    const retrieve = retrieverOf([])
    await askAssistant('prima', provider(['r1']).p, retrieve)
    await askAssistant('seconda', provider(new AssistantError('fallita')).p, retrieve)
    await askAssistant('terza', provider(['r3']).p, retrieve)
    expect(retrieve.mock.calls.map((c) => c[1])).toEqual([null, 'prima', 'prima'])
  })
  it('mette le schede nel messaggio di sistema, dopo il progetto', async () => {
    const { p, received } = provider()
    await askAssistant('q', p, retrieverOf([chunk('Riverbero', [src('Reverberation')])]))
    const system = received[0][0]
    expect(system.role).toBe('system')
    expect(system.content).toContain(`${LIBRARY_TITLE} (`)
    expect(system.content).toContain('[1] Riverbero\ntesto di Riverbero')
    expect(system.content.indexOf(FEATURES_TITLE)).toBeLessThan(system.content.indexOf(LIBRARY_TITLE + ' ('))
  })
  it('senza schede il messaggio di sistema non ha la sezione biblioteca', async () => {
    const { p, received } = provider()
    await askAssistant('q', p, retrieverOf([]))
    expect(received[0][0].content).not.toContain('[1]')
    expect(received[0][0].content).not.toContain(`${LIBRARY_TITLE} (`)
  })
  it('la risposta ha le fonti deduplicate quando ci sono schede', async () => {
    const a = src('A')
    const b = src('B')
    await askAssistant('q', provider(['uno ', 'due']).p, retrieverOf([chunk('X', [a, b]), chunk('Y', [a])]))
    expect(store().messages[1].content).toBe('uno due')
    expect(store().messages[1].sources).toEqual([a, b])
  })
  it('le schede non pertinenti vanno al modello ma le loro fonti non si mostrano', async () => {
    const { p, received } = provider()
    await askAssistant('q', p, retrieverOf([chunk('X', [src('A')]), chunk('Y', [src('B')], false)]))
    expect(received[0][0].content).toContain('[2] Y')
    expect(store().messages[1].sources).toEqual([src('A')])
  })
  it('se nessuna scheda è pertinente non si mostra nessuna fonte', async () => {
    await askAssistant('q', provider().p, retrieverOf([chunk('Y', [src('B')], false)]))
    expect(store().messages[1].sources).toBeUndefined()
  })
  it('senza schede la risposta non ha il campo sources', async () => {
    await askAssistant('q', provider().p, retrieverOf([]))
    expect(store().messages[1].sources).toBeUndefined()
  })
  it('schede senza fonti: nessun sources', async () => {
    await askAssistant('q', provider().p, retrieverOf([chunk('X', [])]))
    expect(store().messages[1].sources).toBeUndefined()
  })
  it('una risposta bloccata dal controllo non ha le fonti', async () => {
    await askAssistant('q', provider([`Ecco: ${FEATURES_TITLE}`, ' altro']).p, retrieverOf([chunk('X', [src('A')])]))
    expect(store().messages[1].content).toBe(BLOCKED_ANSWER)
    expect(store().messages[1].sources).toBeUndefined()
  })
  it('un errore del fornitore non lascia le fonti', async () => {
    const { p } = provider(new AssistantError('rotto'))
    await askAssistant('q', p, retrieverOf([chunk('X', [src('A')])]))
    expect(store().messages[1]).toMatchObject({ content: 'rotto', error: true })
    expect(store().messages[1].sources).toBeUndefined()
  })
  it('stop durante la ricerca: il fornitore non viene chiamato e il messaggio è (interrotta)', async () => {
    const { p, received } = provider()
    const retrieve: Retriever = (_q, _p, signal) =>
      new Promise((resolve) => signal.addEventListener('abort', () => resolve([chunk('X', [src('A')])])))
    const pending = askAssistant('q', p, retrieve)
    await Promise.resolve()
    stopAssistant()
    await pending
    expect(received).toHaveLength(0)
    expect(store().messages[1]).toMatchObject({ content: '(interrotta)', error: true })
    expect(store().messages[1].sources).toBeUndefined()
    expect(store().answering).toBe(false)
  })
})
