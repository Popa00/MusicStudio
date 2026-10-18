import { afterEach, describe, expect, it, vi } from 'vitest'
import { isBlackKey } from '../../music/notes'
import { isTypingTarget, MAX_OCTAVE, MIN_OCTAVE, pitchForKey } from './keyMap'

const WHITE = ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon']
const BLACK = ['KeyW', 'KeyE', 'KeyT', 'KeyY', 'KeyU', 'KeyO', 'KeyP']

describe('pitchForKey', () => {
  it('con l\'ottava 4 il tasto A è il Do centrale (60)', () => {
    expect(pitchForKey('KeyA', 4)).toBe(60)
    expect(pitchForKey('KeyW', 4)).toBe(61)
    expect(pitchForKey('KeyK', 4)).toBe(72)
    expect(pitchForKey('Semicolon', 4)).toBe(76)
  })
  it('la fila A S D F... dà tasti bianchi, W E T Y... tasti neri', () => {
    for (const code of WHITE) expect(isBlackKey(pitchForKey(code, 4) ?? -1)).toBe(false)
    for (const code of BLACK) expect(isBlackKey(pitchForKey(code, 4) ?? -1)).toBe(true)
  })
  it('cambiare ottava sposta di 12 semitoni', () => {
    expect(pitchForKey('KeyA', 5)).toBe(72)
    expect(pitchForKey('KeyA', MIN_OCTAVE)).toBe(24)
  })
  it('a tutte le ottave ammesse le note restano nella tastiera MIDI (0-127)', () => {
    for (let o = MIN_OCTAVE; o <= MAX_OCTAVE; o++) {
      for (const code of [...WHITE, ...BLACK]) {
        const pitch = pitchForKey(code, o)
        expect(pitch).not.toBeNull()
        expect(pitch).toBeGreaterThanOrEqual(0)
        expect(pitch).toBeLessThanOrEqual(127)
      }
    }
  })
  it('i tasti che non sono note restituiscono null', () => {
    for (const code of ['KeyZ', 'KeyX', 'Space', 'a', '']) {
      expect(pitchForKey(code, 4)).toBeNull()
    }
  })
})

describe('isTypingTarget (con un HTMLElement finto, senza DOM)', () => {
  class FakeElement {
    tagName: string
    isContentEditable: boolean
    constructor(tagName: string, editable = false) {
      this.tagName = tagName
      this.isContentEditable = editable
    }
  }
  const el = (tag: string, editable = false) => new FakeElement(tag, editable) as unknown as EventTarget

  afterEach(() => vi.unstubAllGlobals())

  it('riconosce campi di testo, aree di testo, menu e contenuti modificabili', () => {
    vi.stubGlobal('HTMLElement', FakeElement)
    for (const tag of ['INPUT', 'TEXTAREA', 'SELECT']) expect(isTypingTarget(el(tag))).toBe(true)
    expect(isTypingTarget(el('DIV', true))).toBe(true)
  })
  it('gli altri elementi e null non sono campi di scrittura', () => {
    vi.stubGlobal('HTMLElement', FakeElement)
    expect(isTypingTarget(el('BUTTON'))).toBe(false)
    expect(isTypingTarget(el('DIV'))).toBe(false)
    expect(isTypingTarget(null)).toBe(false)
    expect(isTypingTarget({} as EventTarget)).toBe(false)
  })
})
