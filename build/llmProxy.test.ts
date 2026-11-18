import { describe, expect, it } from 'vitest'
import { LLM_PROXY } from './llmProxy.ts'

const bypass = LLM_PROXY['^/api/llm/'].bypass!
type Req = Parameters<typeof bypass>[0]

/** true = la richiesta viene inoltrata a LM Studio, false = 404. */
function forwarded(method: string, url: string, headers: Record<string, string> = {}): boolean {
  const req = { method, url, headers: { host: '127.0.0.1:5173', ...headers } } as unknown as Req
  return bypass(req, undefined as never, {} as never) === undefined
}

const JSON_TYPE = { 'content-type': 'application/json' }

describe('proxy verso LM Studio', () => {
  it('inoltra le tre richieste che servono, dall\'app e in JSON', () => {
    expect(forwarded('GET', '/api/llm/models')).toBe(true)
    expect(forwarded('POST', '/api/llm/chat/completions', { ...JSON_TYPE, origin: 'http://127.0.0.1:5173' })).toBe(true)
    expect(forwarded('POST', '/api/llm/embeddings', JSON_TYPE)).toBe(true)
  })
  it('rifiuta gli altri percorsi e metodi', () => {
    expect(forwarded('GET', '/api/llm/embeddings')).toBe(false)
    expect(forwarded('POST', '/api/llm/embeddings?x=1', JSON_TYPE)).toBe(false)
    expect(forwarded('POST', '/api/llm/models/load', JSON_TYPE)).toBe(false)
  })
  it('rifiuta le richieste da un altro sito', () => {
    expect(forwarded('POST', '/api/llm/embeddings', { ...JSON_TYPE, origin: 'https://example.com' })).toBe(false)
  })
  it('rifiuta i POST che non sono JSON (le richieste "semplici" che non chiedono permesso CORS)', () => {
    expect(forwarded('POST', '/api/llm/chat/completions', { 'content-type': 'text/plain' })).toBe(false)
    expect(forwarded('POST', '/api/llm/chat/completions')).toBe(false)
  })
})
