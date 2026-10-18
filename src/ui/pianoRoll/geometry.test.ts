import { describe, expect, it } from 'vitest'
import { BOTTOM_PITCH, cellAt, PITCHES, pitchToY, ROW_HEIGHT, scrollTopFor, STEP_WIDTH, TOP_PITCH } from './geometry'

describe('PITCHES / pitchToY', () => {
  it('elenca le note dalla più acuta alla più grave', () => {
    expect(PITCHES[0]).toBe(TOP_PITCH)
    expect(PITCHES.at(-1)).toBe(BOTTOM_PITCH)
    expect(PITCHES).toHaveLength(TOP_PITCH - BOTTOM_PITCH + 1)
  })
  it('la nota più acuta è in cima, ogni semitono più giù di una riga', () => {
    expect(pitchToY(TOP_PITCH)).toBe(0)
    expect(pitchToY(TOP_PITCH - 1)).toBe(ROW_HEIGHT)
    expect(pitchToY(BOTTOM_PITCH)).toBe((TOP_PITCH - BOTTOM_PITCH) * ROW_HEIGHT)
  })
})

describe('cellAt', () => {
  it('l\'angolo in alto a sinistra è il primo step della nota più acuta', () => {
    expect(cellAt(0, 0, 16)).toEqual({ step: 0, pitch: TOP_PITCH })
  })
  it('i bordi delle celle appartengono alla cella successiva', () => {
    expect(cellAt(STEP_WIDTH - 0.1, ROW_HEIGHT - 0.1, 16)).toEqual({ step: 0, pitch: TOP_PITCH })
    expect(cellAt(STEP_WIDTH, ROW_HEIGHT, 16)).toEqual({ step: 1, pitch: TOP_PITCH - 1 })
  })
  it('l\'inverso di pitchToY: il centro di una riga dà la sua nota', () => {
    for (const pitch of [TOP_PITCH, 60, BOTTOM_PITCH]) {
      expect(cellAt(5, pitchToY(pitch) + ROW_HEIGHT / 2, 16).pitch).toBe(pitch)
    }
  })
  it('punti fuori dalla griglia vengono riportati dentro', () => {
    expect(cellAt(-50, -50, 16)).toEqual({ step: 0, pitch: TOP_PITCH })
    expect(cellAt(1e6, 1e6, 16)).toEqual({ step: 15, pitch: BOTTOM_PITCH })
    expect(cellAt(1e6, 0, 32).step).toBe(31)
  })
})

describe('scrollTopFor', () => {
  it('centra la nota nella finestra', () => {
    expect(scrollTopFor(60, 400)).toBe(pitchToY(60) - 200)
  })
  it('non scorre mai sopra l\'inizio', () => {
    expect(scrollTopFor(TOP_PITCH, 400)).toBe(0)
  })
})
