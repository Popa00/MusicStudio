import { describe, expect, it } from 'vitest'
import { stem, stripAccents, words } from './words.ts'

describe('stripAccents', () => {
  it('toglie gli accenti', () => {
    expect(stripAccents('perché tonalità è')).toBe('perche tonalita e')
  })

  it('lascia invariato il testo senza accenti', () => {
    expect(stripAccents('accordo')).toBe('accordo')
  })
})

describe('stem', () => {
  it('singolare e plurale hanno la stessa radice', () => {
    expect(stem('accordi')).toBe(stem('accordo'))
    expect(stem('accordo')).toBe('accord')
  })

  it('lascia invariate le parole corte', () => {
    expect(stem('re')).toBe('re')
    expect(stem('nota')).toBe('nota')
    expect(stem('')).toBe('')
  })
})

describe('words', () => {
  it('elimina stopword e punteggiatura', () => {
    expect(words('Come si usa il riverbero, nel brano?')).toEqual(['riverber'])
  })

  it('gestisce accenti e maiuscole', () => {
    expect(words('Perché la TONALITÀ?')).toEqual(['tonalit'])
  })

  it('scarta le parole di una sola lettera', () => {
    expect(words('x y z')).toEqual([])
  })

  it('un testo vuoto o di sola punteggiatura non dà parole', () => {
    expect(words('')).toEqual([])
    expect(words('?!... ,;')).toEqual([])
  })

  it('mantiene i numeri', () => {
    expect(words('120 bpm')).toEqual(['120', 'bpm'])
  })
})
