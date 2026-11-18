import { describe, expect, it } from 'vitest'
import { visibleAnswer, withoutThinking } from '../conversation'
import { splitCitations } from './citations'
import { answerSources, MAX_SOURCES, sourcesOf } from './libraryPrompt'
import type { FoundCard } from './retrieve'

describe('splitCitations', () => {
  it('legge e toglie la riga finale "FONTI: 1, 3"', () => {
    expect(splitCitations('Risposta.\n\nFONTI: 1, 3')).toEqual({ text: 'Risposta.', cited: [1, 3] })
  })
  it('"FONTI: nessuna" vuol dire nessuna scheda usata', () => {
    expect(splitCitations('Ciao.\nFONTI: nessuna')).toEqual({ text: 'Ciao.', cited: [] })
  })
  it('accetta grassetto, minuscole e spazi', () => {
    expect(splitCitations('Testo\n**Fonti:** 2').cited).toEqual([2])
    expect(splitCitations('Testo\n  fonti : 1 e 2').cited).toEqual([1, 2])
  })
  it('senza la riga: cited null e testo intatto', () => {
    expect(splitCitations('Solo testo.\nSeconda riga.')).toEqual({ text: 'Solo testo.\nSeconda riga.', cited: null })
  })
  it('mentre arriva, nasconde un inizio di "FONTI:" ancora incompleto', () => {
    expect(splitCitations('Risposta.\nFON').text).toBe('Risposta.')
    expect(splitCitations('Risposta.\nF').text).toBe('Risposta.')
  })
  it('riconosce la riga anche con gli "a capo" di Windows (\\r\\n)', () => {
    expect(splitCitations('Risposta.\r\nFONTI: 1, 3\r\n')).toEqual({ text: 'Risposta.', cited: [1, 3] })
  })
  it('una riga "Fonti:" a metà risposta non è la riga delle citazioni', () => {
    const answer = 'Fonti: puoi leggere i libri di teoria.\nPoi prova nel piano roll.'
    expect(splitCitations(answer)).toEqual({ text: answer, cited: null })
  })
  it('la riga vale anche se dopo ci sono righe vuote', () => {
    expect(splitCitations('Testo.\nFONTI: 2\n\n').cited).toEqual([2])
  })
  it('non nasconde una riga normale che comincia con F', () => {
    expect(splitCitations('Risposta.\nFa una prova').text).toBe('Risposta.\nFa una prova')
  })
})

describe('visibleAnswer', () => {
  it('toglie sia il ragionamento sia la riga delle fonti', () => {
    expect(visibleAnswer('<think>penso</think>Il riverbero…\nFONTI: 1')).toBe('Il riverbero…')
  })
  it('una riga FONTI scritta solo nel ragionamento non conta', () => {
    const cards = [card('a', false), card('b', false)]
    expect(answerSources(cards, withoutThinking('<think>chiuderò con\nFONTI: 2</think>Risposta senza riga.'))).toEqual([])
  })
})

const src = (n: string) => ({ title: n, url: `https://en.wikipedia.org/wiki/${n}`, license: 'CC BY-SA 4.0' as const })
const card = (id: string, cited: boolean, sources = [src(`${id}1`), src(`${id}2`), src(`${id}3`)]): FoundCard =>
  ({ card: id, title: id, text: 't', sources, cited })

describe('fonti da mostrare', () => {
  it('sourcesOf prende al massimo 2 fonti per scheda e 5 in tutto', () => {
    const out = sourcesOf([card('a', true), card('b', true), card('c', true)])
    expect(out.map((s) => s.title)).toEqual(['a1', 'a2', 'b1', 'b2', 'c1'])
    expect(out).toHaveLength(MAX_SOURCES)
  })
  it('answerSources usa le schede indicate dal modello', () => {
    const cards = [card('a', true), card('b', true), card('c', false)]
    expect(answerSources(cards, 'x\nFONTI: 3').map((s) => s.title)).toEqual(['c1', 'c2'])
    expect(answerSources(cards, 'x\nFONTI: nessuna')).toEqual([])
  })
  it('ignora numeri che non corrispondono a nessuna scheda', () => {
    expect(answerSources([card('a', true)], 'x\nFONTI: 7')).toEqual([])
  })
  it('senza la riga usa le schede vicine alla domanda', () => {
    const cards = [card('a', false), card('b', true)]
    expect(answerSources(cards, 'solo testo').map((s) => s.title)).toEqual(['b1', 'b2'])
  })
})
