import { describe, expect, it } from 'vitest'
import type { Note } from '../../project/types'
import { noteGroups } from './noteGroups'

let n = 0
const note = (pitch: number, start: number, duration = 4): Note => ({ id: `n${n++}`, pitch, start, duration, velocity: 0.8 })

describe('noteGroups', () => {
  it('senza note restituisce una lista vuota', () => {
    expect(noteGroups([])).toEqual([])
  })
  it('ordina i gruppi per istante di partenza', () => {
    const groups = noteGroups([note(60, 8), note(62, 0), note(64, 4)])
    expect(groups.map((g) => g.start)).toEqual([0, 4, 8])
  })
  it('unisce le note che partono insieme, dalla più grave', () => {
    const [group] = noteGroups([note(67, 0), note(60, 0), note(64, 0)])
    expect(group.pitches).toEqual([60, 64, 67])
    expect(group.chord?.name).toBe('Do')
  })
  it('la durata del gruppo è la più lunga', () => {
    const [group] = noteGroups([note(60, 0, 2), note(64, 0, 8), note(67, 0, 4)])
    expect(group.duration).toBe(8)
  })
  it('una nota sola o due note non sono un accordo', () => {
    const groups = noteGroups([note(60, 0), note(60, 4), note(64, 4)])
    expect(groups.map((g) => g.chord)).toEqual([null, null])
  })
  it('note vicine ma non insieme restano gruppi separati', () => {
    expect(noteGroups([note(60, 0), note(64, 1), note(67, 2)])).toHaveLength(3)
  })
  it('non modifica la lista di partenza', () => {
    const notes = [note(67, 0), note(60, 0)]
    const copy = structuredClone(notes)
    noteGroups(notes)
    expect(notes).toEqual(copy)
  })
})
