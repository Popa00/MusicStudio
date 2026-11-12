import { describe, expect, it } from 'vitest'
import { parseSseData, splitSseEvents } from './sse'

const delta = (content: unknown) => JSON.stringify({ choices: [{ delta: { content } }] })

describe('splitSseEvents', () => {
  it('separa più eventi completi', () => {
    expect(splitSseEvents('data: a\n\ndata: b\n\n')).toEqual({ data: ['a', 'b'], rest: '' })
  })
  it('lascia in `rest` l\'evento rimasto a metà', () => {
    expect(splitSseEvents('data: a\n\ndata: par')).toEqual({ data: ['a'], rest: 'data: par' })
  })
  it('senza nessun evento completo restituisce tutto in `rest`', () => {
    expect(splitSseEvents('data: x')).toEqual({ data: [], rest: 'data: x' })
    expect(splitSseEvents('')).toEqual({ data: [], rest: '' })
  })
  it('capisce i fine riga \\r\\n', () => {
    expect(splitSseEvents('data: a\r\n\r\ndata: b\r\n\r\n')).toEqual({ data: ['a', 'b'], rest: '' })
  })
  it('ricompone un \\r\\n\\r\\n spezzato tra due pezzi', () => {
    const first = splitSseEvents('data: a\r\n\r')
    expect(first.data).toEqual([])
    expect(splitSseEvents(first.rest + '\ndata: b\r\n\r\n').data).toEqual(['a', 'b'])
  })
  it('ricompone un evento arrivato in più pezzi', () => {
    let rest = ''
    const out: string[] = []
    for (const part of ['da', 'ta: {"x"', ':1}\n', '\nda', 'ta: [DONE]\n\n']) {
      const result = splitSseEvents(rest + part)
      rest = result.rest
      out.push(...result.data)
    }
    expect(out).toEqual(['{"x":1}', '[DONE]'])
  })
  it('ignora le righe che non sono "data:" (commenti, event, id)', () => {
    expect(splitSseEvents(': keep-alive\nevent: message\nid: 4\ndata: ok\n\n').data).toEqual(['ok'])
  })
  it('accetta "data:" senza spazio e toglie gli spazi intorno', () => {
    expect(splitSseEvents('data:a\n\ndata:   b  \n\n').data).toEqual(['a', 'b'])
  })
})

describe('parseSseData', () => {
  it('[DONE] chiude la risposta', () => {
    expect(parseSseData('[DONE]')).toEqual({ kind: 'done' })
  })
  it('estrae il testo del primo "choice"', () => {
    expect(parseSseData(delta('Ciao'))).toEqual({ kind: 'text', text: 'Ciao' })
  })
  it('conserva gli spazi e i caratteri accentati del testo', () => {
    expect(parseSseData(delta(' è così '))).toEqual({ kind: 'text', text: ' è così ' })
  })
  it('un errore come oggetto ha il suo messaggio', () => {
    expect(parseSseData(JSON.stringify({ error: { message: 'modello non caricato' } }))).toEqual({ kind: 'error', message: 'modello non caricato' })
  })
  it('un errore come stringa è il messaggio stesso', () => {
    expect(parseSseData(JSON.stringify({ error: 'troppo lungo' }))).toEqual({ kind: 'error', message: 'troppo lungo' })
  })
  it('JSON non valido o vuoto viene ignorato', () => {
    expect(parseSseData('{non json')).toEqual({ kind: 'ignore' })
    expect(parseSseData('')).toEqual({ kind: 'ignore' })
  })
  it('un delta vuoto, nullo o senza contenuto viene ignorato', () => {
    expect(parseSseData(delta(''))).toEqual({ kind: 'ignore' })
    expect(parseSseData(delta(null))).toEqual({ kind: 'ignore' })
    expect(parseSseData(JSON.stringify({ choices: [{ delta: { role: 'assistant' } }] }))).toEqual({ kind: 'ignore' })
    expect(parseSseData(JSON.stringify({ choices: [{}] }))).toEqual({ kind: 'ignore' })
    expect(parseSseData(JSON.stringify({ choices: [] }))).toEqual({ kind: 'ignore' })
  })
  it('forme inattese (numeri, array, null, contenuto non testuale) vengono ignorate', () => {
    for (const data of ['1', 'null', '[]', '"testo"', delta(42), JSON.stringify({ choices: 'x' })]) {
      expect(parseSseData(data)).toEqual({ kind: 'ignore' })
    }
  })
  it('troppi "choice" rendono il pezzo non valido', () => {
    const choices = Array.from({ length: 9 }, () => ({ delta: { content: 'x' } }))
    expect(parseSseData(JSON.stringify({ choices }))).toEqual({ kind: 'ignore' })
  })
  it('un campo __proto__ nel JSON non inquina nulla', () => {
    const result = parseSseData('{"__proto__":{"polluted":true},"choices":[{"delta":{"content":"ok"}}]}')
    expect(result).toEqual({ kind: 'text', text: 'ok' })
    expect(({} as Record<string, unknown>).polluted).toBeUndefined()
  })
})
