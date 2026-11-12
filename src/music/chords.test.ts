import { describe, expect, it } from 'vitest'
import { commonNotes, identifyChord } from './chords'

const name = (pitches: number[]) => identifyChord(pitches)?.name

describe('identifyChord: tipi di accordo', () => {
  it('riconosce un accordo maggiore', () => {
    const chord = identifyChord([60, 64, 67])
    expect(chord).toMatchObject({ name: 'Do', quality: 'maggiore', root: 0, bass: 0 })
    expect(chord?.noteNames).toEqual(['Do', 'Mi', 'Sol'])
  })
  it('riconosce un accordo minore con il suffisso "m"', () => {
    expect(identifyChord([57, 60, 64])).toMatchObject({ name: 'Lam', quality: 'minore', noteNames: ['La', 'Do', 'Mi'] })
  })
  it('riconosce diminuito e aumentato', () => {
    expect(name([59, 62, 65])).toBe('Sidim')
    expect(name([60, 64, 68])).toBe('Do+')
  })
  it('riconosce gli accordi sospesi', () => {
    expect(name([60, 65, 67])).toBe('Dosus4')
    expect(name([60, 62, 67])).toBe('Dosus2')
  })
  it('riconosce gli accordi di settima', () => {
    expect(name([55, 59, 62, 65])).toBe('Sol7')
    expect(name([60, 64, 67, 71])).toBe('Domaj7')
    expect(name([57, 60, 64, 67])).toBe('Lam7')
    expect(name([59, 62, 65, 69])).toBe('Sim7b5')
  })
  it('scrive i diesis con il nome della nota', () => {
    expect(name([66, 70, 73])).toBe('Fa#')
  })
})

describe('identifyChord: ottave, rivolti e duplicati', () => {
  it('non cambia con le note in un\'altra ottava o in ordine diverso', () => {
    expect(name([36, 52, 67])).toBe('Do')
    expect(name([67, 64, 60])).toBe('Do')
    expect(name([0, 4, 7])).toBe('Do')
    expect(name([127, 124, 120])).toBeDefined()
  })
  it('un rivolto prende il nome con la nota più grave dopo la barra', () => {
    expect(identifyChord([64, 67, 72])).toMatchObject({ name: 'Do/Mi', root: 0, bass: 4 })
    expect(name([67, 72, 76])).toBe('Do/Sol')
    expect(name([69, 72, 77])).toBe('Fa/La')
  })
  it('un rivolto di un accordo minore o di settima mantiene il suffisso', () => {
    expect(name([60, 64, 69])).toBe('Lam/Do')
    expect(name([59, 62, 65, 67])).toBe('Sol7/Si')
  })
  it('le note ripetute in ottave diverse contano una volta sola', () => {
    expect(name([60, 64, 67, 72, 76, 79])).toBe('Do')
    expect(name([48, 60, 64, 67])).toBe('Do')
  })
  it('il basso è la nota più grave anche se è un raddoppio', () => {
    expect(name([40, 60, 64, 67])).toBe('Do/Mi')
  })
  it('un accordo aumentato prende come fondamentale la nota più grave', () => {
    expect(name([64, 68, 72])).toBe('Mi+')
    expect(name([68, 72, 76])).toBe('Sol#+')
  })
})

describe('identifyChord: casi che non sono accordi', () => {
  it('senza note restituisce null', () => {
    expect(identifyChord([])).toBeNull()
  })
  it('con meno di 3 note diverse restituisce null', () => {
    expect(identifyChord([60])).toBeNull()
    expect(identifyChord([60, 64])).toBeNull()
    expect(identifyChord([60, 72, 84])).toBeNull()
    expect(identifyChord([60, 64, 76, 64])).toBeNull()
  })
  it('note vicine tra loro (non un accordo comune) restituiscono null', () => {
    expect(identifyChord([60, 61, 62])).toBeNull()
    expect(identifyChord([60, 62, 64])).toBeNull()
    expect(identifyChord([60, 63, 64, 67, 70])).toBeNull()
  })
})

describe('commonNotes', () => {
  const lam = identifyChord([57, 60, 64])!
  const fa = identifyChord([53, 57, 60])!
  it('elenca le note in comune nell\'ordine del primo accordo', () => {
    expect(commonNotes(lam, fa)).toEqual(['La', 'Do'])
  })
  it('è vuoto se gli accordi non condividono note', () => {
    expect(commonNotes(fa, identifyChord([55, 59, 62])!)).toEqual([])
  })
  it('un accordo con se stesso le ha tutte', () => {
    expect(commonNotes(lam, lam)).toEqual(lam.noteNames)
  })
})
