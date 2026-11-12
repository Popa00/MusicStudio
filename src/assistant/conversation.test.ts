import { describe, expect, it } from 'vitest'
import { buildMessages, completedTurns, visibleAnswer, type StoredMessage } from './conversation'
import type { ChatMessage } from './provider/types'

const u = (content: string): ChatMessage => ({ role: 'user', content })
const a = (content: string): ChatMessage => ({ role: 'assistant', content })

describe('buildMessages', () => {
  it('con la cronologia vuota manda solo le istruzioni', () => {
    expect(buildMessages('SYS', [])).toEqual([{ role: 'system', content: 'SYS' }])
  })
  it('mette il messaggio di sistema per primo e tiene tutto se ci sta', () => {
    const history = [u('d1'), a('r1'), u('d2')]
    expect(buildMessages('SYS', history)).toEqual([{ role: 'system', content: 'SYS' }, ...history])
  })
  it('scarta i messaggi più vecchi che non stanno nel limite', () => {
    const history = [u('1'.repeat(10)), a('2'.repeat(10)), u('3'.repeat(10)), a('4'.repeat(10)), u('5'.repeat(10))]
    const out = buildMessages('SYS', history, 25)
    // Restano "4" e "5", ma "4" è una risposta e viene tolta: si parte dalla domanda.
    expect(out.map((m) => m.content[0])).toEqual(['S', '5'])
  })
  it('non comincia mai con una risposta: toglie quella rimasta senza domanda', () => {
    const history = [u('x'.repeat(10)), a('y'.repeat(10)), u('z'.repeat(10))]
    const out = buildMessages('SYS', history, 25)
    expect(out).toEqual([{ role: 'system', content: 'SYS' }, history[2]])
  })
  it('tiene gli scambi interi più recenti dentro il limite', () => {
    const history = [u('aaaa'), a('bbbb'), u('cccc'), a('dddd'), u('eeee')]
    const out = buildMessages('SYS', history, 12)
    expect(out.slice(1).map((m) => m.content)).toEqual(['cccc', 'dddd', 'eeee'])
  })
  it("l'ultima domanda c'è sempre, anche se da sola supera il limite", () => {
    const out = buildMessages('SYS', [u('vecchia'), a('risposta'), u('q'.repeat(500))], 10)
    expect(out).toEqual([{ role: 'system', content: 'SYS' }, u('q'.repeat(500))])
  })
  it('con limite zero tiene comunque la domanda', () => {
    expect(buildMessages('SYS', [u('ciao')], 0)).toHaveLength(2)
  })
  it('il messaggio di sistema non conta nel limite', () => {
    const out = buildMessages('S'.repeat(10_000), [u('ciao')], 10)
    expect(out).toHaveLength(2)
  })
})

describe('completedTurns', () => {
  const msg = (role: StoredMessage['role'], content: string, error?: boolean): StoredMessage => ({ role, content, error })
  it('senza messaggi è vuoto', () => {
    expect(completedTurns([])).toEqual([])
  })
  it('tiene le coppie domanda e risposta', () => {
    expect(completedTurns([msg('user', 'q1'), msg('assistant', 'r1'), msg('user', 'q2'), msg('assistant', 'r2')])).toEqual([
      u('q1'), a('r1'), u('q2'), a('r2'),
    ])
  })
  it('toglie una domanda la cui risposta è un errore', () => {
    const out = completedTurns([msg('user', 'q1'), msg('assistant', 'LM Studio non risponde', true), msg('user', 'q2'), msg('assistant', 'r2')])
    expect(out).toEqual([u('q2'), a('r2')])
  })
  it('toglie una domanda con risposta vuota, di soli spazi o di solo ragionamento', () => {
    const out = completedTurns([
      msg('user', 'q1'), msg('assistant', ''),
      msg('user', 'q2'), msg('assistant', '  \n'),
      msg('user', 'q3'), msg('assistant', '<think>ci penso'),
      msg('user', 'q4'), msg('assistant', 'ok'),
    ])
    expect(out).toEqual([u('q4'), a('ok')])
  })
  it('toglie una domanda senza risposta, anche l\'ultima', () => {
    expect(completedTurns([msg('user', 'q1'), msg('user', 'q2'), msg('assistant', 'r2'), msg('user', 'q3')])).toEqual([u('q2'), a('r2')])
  })
  it('non rimanda il ragionamento nascosto', () => {
    expect(completedTurns([msg('user', 'q'), msg('assistant', '<think>boh</think>Ecco')])).toEqual([u('q'), a('Ecco')])
  })
  it('alterna sempre domanda e risposta, qualunque sia la cronologia', () => {
    const roles = ['user', 'assistant', 'assistant', 'user', 'user', 'assistant', 'user', 'assistant', 'assistant'] as const
    const out = completedTurns(roles.map((role, i) => msg(role, `m${i}`, i === 7 ? true : undefined)))
    expect(out.map((m) => m.role)).toEqual(out.map((_, i) => (i % 2 === 0 ? 'user' : 'assistant')))
    expect(out.length % 2).toBe(0)
  })
})

describe('visibleAnswer', () => {
  it('toglie un blocco <think> chiuso e gli spazi che lo seguono', () => {
    expect(visibleAnswer('<think>ragiono</think>\n\nCiao')).toBe('Ciao')
  })
  it('toglie più blocchi', () => {
    expect(visibleAnswer('A<think>x</think>B<think>y</think>C')).toBe('ABC')
  })
  it('nasconde un blocco non ancora chiuso', () => {
    expect(visibleAnswer('<think>sto pensando')).toBe('')
    expect(visibleAnswer('Ciao <think>sto pen')).toBe('Ciao ')
  })
  it('toglie un blocco su più righe', () => {
    expect(visibleAnswer('<think>riga1\nriga2</think>Fine')).toBe('Fine')
  })
  it('lascia invariato un testo senza ragionamento', () => {
    expect(visibleAnswer('Una risposta normale.')).toBe('Una risposta normale.')
    expect(visibleAnswer('')).toBe('')
  })
})
