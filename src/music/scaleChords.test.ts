import { describe, expect, it } from 'vitest'
import { scaleChords, scaleName, scaleNoteNames } from './scaleChords'

const names = (root: number, type: Parameters<typeof scaleChords>[1]) => scaleChords(root, type).map((c) => c.name)

describe('scaleName', () => {
  it('unisce la nota di partenza e il tipo di scala', () => {
    expect(scaleName(9, 'minor')).toBe('La minore')
    expect(scaleName(0, 'major')).toBe('Do maggiore')
    expect(scaleName(2, 'pentatonicMinor')).toBe('Re pentatonica minore')
  })
  it('senza scala non nomina la nota', () => {
    expect(scaleName(5, 'none')).toBe('nessuna scala')
  })
})

describe('scaleNoteNames', () => {
  it('elenca le note in ordine dalla nota di partenza', () => {
    expect(scaleNoteNames(0, 'major')).toEqual(['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Si'])
    expect(scaleNoteNames(9, 'minor')).toEqual(['La', 'Si', 'Do', 'Re', 'Mi', 'Fa', 'Sol'])
  })
  it('la pentatonica ha 5 note e "nessuna scala" ne ha 12', () => {
    expect(scaleNoteNames(0, 'pentatonicMajor')).toHaveLength(5)
    expect(scaleNoteNames(0, 'none')).toHaveLength(12)
  })
})

describe('scaleChords', () => {
  it('Do maggiore: Do Rem Mim Fa Sol Lam Sidim', () => {
    expect(names(0, 'major')).toEqual(['Do', 'Rem', 'Mim', 'Fa', 'Sol', 'Lam', 'Sidim'])
  })
  it('La minore: Lam Sidim Do Rem Mim Fa Sol', () => {
    expect(names(9, 'minor')).toEqual(['Lam', 'Sidim', 'Do', 'Rem', 'Mim', 'Fa', 'Sol'])
  })
  it('Sol maggiore ha il Fa# diminuito come settimo accordo', () => {
    expect(names(7, 'major')).toEqual(['Sol', 'Lam', 'Sim', 'Do', 'Re', 'Mim', 'Fa#dim'])
  })
  it('gli accordi sono in posizione base (mai rivoltati) per ogni nota di partenza', () => {
    for (let root = 0; root < 12; root++) {
      for (const type of ['major', 'minor'] as const) {
        const chords = scaleChords(root, type)
        expect(chords).toHaveLength(7)
        expect(chords.every((c) => c.root === c.bass && !c.name.includes('/'))).toBe(true)
      }
    }
  })
  it('le scale pentatoniche e "nessuna scala" non hanno accordi', () => {
    expect(scaleChords(0, 'pentatonicMajor')).toEqual([])
    expect(scaleChords(9, 'pentatonicMinor')).toEqual([])
    expect(scaleChords(0, 'none')).toEqual([])
  })
})
