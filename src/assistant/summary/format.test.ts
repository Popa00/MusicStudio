import { describe, expect, it } from 'vitest'
import type { TimeSignature } from '../../music/timing'
import { barRangeLabel, beatsLabel, noteLabel, positionLabel } from './format'

const T44: TimeSignature = { beatsPerBar: 4, beatUnit: 4 }
const T68: TimeSignature = { beatsPerBar: 6, beatUnit: 8 }

describe('noteLabel', () => {
  it("scrive il nome con l'ottava (il Do centrale è Do4)", () => {
    expect(noteLabel(60)).toBe('Do4')
    expect(noteLabel(45)).toBe('La2')
    expect(noteLabel(61)).toBe('Do#4')
  })
  it('gestisce i bordi del MIDI', () => {
    expect(noteLabel(0)).toBe('Do-1')
    expect(noteLabel(127)).toBe('Sol9')
  })
})

describe('beatsLabel in 4/4', () => {
  it('usa il singolare fino a un battito e il plurale oltre', () => {
    expect(beatsLabel(4, T44)).toBe('1 battito')
    expect(beatsLabel(16, T44)).toBe('4 battiti')
    expect(beatsLabel(8, T44)).toBe('2 battiti')
  })
  it('scrive le frazioni di battito con i simboli', () => {
    expect(beatsLabel(2, T44)).toBe('½ battito')
    expect(beatsLabel(1, T44)).toBe('¼ battito')
    expect(beatsLabel(3, T44)).toBe('¾ battito')
    expect(beatsLabel(6, T44)).toBe('1½ battiti')
    expect(beatsLabel(5, T44)).toBe('1¼ battiti')
  })
  it('con durata zero non esplode', () => {
    expect(beatsLabel(0, T44)).toBe('0 battito')
  })
  it('una frazione non prevista usa la virgola', () => {
    expect(beatsLabel(1.2, T44)).toBe('0,3 battito')
  })
})

describe('beatsLabel in 6/8', () => {
  it('un battito sono 2 step', () => {
    expect(beatsLabel(2, T68)).toBe('1 battito')
    expect(beatsLabel(1, T68)).toBe('½ battito')
    expect(beatsLabel(12, T68)).toBe('6 battiti')
  })
})

describe('positionLabel', () => {
  it('in 4/4 scrive battuta.battito', () => {
    expect(positionLabel(0, T44)).toBe('1.1')
    expect(positionLabel(4, T44)).toBe('1.2')
    expect(positionLabel(15, T44)).toBe('1.4+¾')
    expect(positionLabel(16, T44)).toBe('2.1')
  })
  it('in 4/4 aggiunge la frazione se cade dentro il battito', () => {
    expect(positionLabel(2, T44)).toBe('1.1+½')
    expect(positionLabel(5, T44)).toBe('1.2+¼')
    expect(positionLabel(18, T44)).toBe('2.1+½')
  })
  it('in 6/8 la battuta ha 12 step e 6 battiti', () => {
    expect(positionLabel(11, T68)).toBe('1.6+½')
    expect(positionLabel(12, T68)).toBe('2.1')
    expect(positionLabel(13, T68)).toBe('2.1+½')
    expect(positionLabel(2, T68)).toBe('1.2')
  })
})

describe('barRangeLabel', () => {
  it('una sola battuta è un numero', () => {
    expect(barRangeLabel(2, 2)).toBe('3')
    expect(barRangeLabel(0, 0)).toBe('1')
  })
  it('più battute sono un intervallo', () => {
    expect(barRangeLabel(0, 3)).toBe('1–4')
    expect(barRangeLabel(4, 5)).toBe('5–6')
  })
})
