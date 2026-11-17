import { describe, expect, it } from 'vitest'
import { createBm25, type KeywordDoc } from './bm25.ts'

const doc = (title: string, keywords: string[], text: string): KeywordDoc => ({ title, keywords, text })

describe('createBm25', () => {
  it('un documento con la parola nel titolo batte uno che ce l\'ha solo nel testo', () => {
    const score = createBm25([doc('Delay', [], 'altro argomento'), doc('Altro', [], 'si parla di delay qui')])('delay')
    expect(score[0]).toBeGreaterThan(score[1])
  })

  it('un documento con la parola nelle parole chiave batte uno che ce l\'ha solo nel testo', () => {
    const score = createBm25([doc('A', ['chorus'], 'testo'), doc('B', [], 'testo chorus')])('chorus')
    expect(score[0]).toBeGreaterThan(score[1])
  })

  it('le parole rare pesano più di quelle comuni', () => {
    const score = createBm25([
      doc('A', [], 'ritmo ritmo'),
      doc('B', [], 'ritmo'),
      doc('C', [], 'ritmo'),
      doc('D', [], 'sidechain'),
    ])
    expect(score('sidechain')[3]).toBeGreaterThan(score('ritmo')[1])
  })

  it('una domanda vuota o di sole stopword dà tutti zeri', () => {
    const score = createBm25([doc('Delay', [], 'testo delay')])
    expect(score('')).toEqual([0])
    expect(score('come il di la')).toEqual([0])
  })

  it('singolare e plurale coincidono', () => {
    const score = createBm25([doc('Accordi', [], 'tre note')])
    expect(score('accordo')[0]).toBeGreaterThan(0)
    expect(score('accordo')[0]).toBe(score('accordi')[0])
  })

  it('un documento senza corrispondenze ha punteggio 0', () => {
    expect(createBm25([doc('A', [], 'basso')])('chitarra')).toEqual([0])
  })

  it('senza documenti restituisce una lista vuota', () => {
    expect(createBm25([])('delay')).toEqual([])
  })

  it('ripetere la stessa parola nella domanda non cambia il punteggio', () => {
    const score = createBm25([doc('Delay', [], 'testo')])
    expect(score('delay delay')).toEqual(score('delay'))
  })
})
