import { describe, expect, it } from 'vitest'
import { emptyHistory, HISTORY_LIMIT, MERGE_WINDOW_MS, record, redo, undo, type History } from './history'

const T0 = 10_000

describe('record', () => {
  it('aggiunge lo stato precedente e svuota il "ripeti"', () => {
    const h: History<string> = { ...emptyHistory<string>(), future: ['x'] }
    const next = record(h, 'a', undefined, T0)
    expect(next).toEqual({ past: ['a'], future: [], mergeKey: null, changedAt: T0 })
  })
  it('unisce modifiche con la stessa chiave entro la finestra (un solo "annulla")', () => {
    let h = record(emptyHistory<string>(), 'a', 'drag', T0)
    h = record(h, 'b', 'drag', T0 + 500)
    h = record(h, 'c', 'drag', T0 + 1400)
    expect(h.past).toEqual(['a'])
    expect(h.changedAt).toBe(T0 + 1400)
  })
  it('non unisce oltre la finestra (esattamente MERGE_WINDOW_MS conta come fuori)', () => {
    let h = record(emptyHistory<string>(), 'a', 'k', T0)
    h = record(h, 'b', 'k', T0 + MERGE_WINDOW_MS)
    expect(h.past).toEqual(['a', 'b'])
  })
  it('non unisce chiavi diverse né modifiche senza chiave', () => {
    let h = record(emptyHistory<string>(), 'a', 'k1', T0)
    h = record(h, 'b', 'k2', T0 + 10)
    h = record(h, 'c', undefined, T0 + 20)
    h = record(h, 'd', undefined, T0 + 30)
    expect(h.past).toEqual(['a', 'b', 'c', 'd'])
    expect(h.mergeKey).toBeNull()
  })
  it(`tiene al massimo ${HISTORY_LIMIT} stati, scartando i più vecchi`, () => {
    let h = emptyHistory<number>()
    for (let i = 0; i < HISTORY_LIMIT + 50; i++) h = record(h, i, undefined, T0 + i)
    expect(h.past).toHaveLength(HISTORY_LIMIT)
    expect(h.past[0]).toBe(50)
    expect(h.past.at(-1)).toBe(HISTORY_LIMIT + 49)
  })
  it('non modifica la cronologia ricevuta', () => {
    const h = record(emptyHistory<string>(), 'a', undefined, T0)
    record(h, 'b', undefined, T0 + 1)
    expect(h.past).toEqual(['a'])
  })
})

describe('undo / redo', () => {
  it('con cronologia vuota restituiscono null', () => {
    expect(undo(emptyHistory<string>(), 'x')).toBeNull()
    expect(redo(emptyHistory<string>(), 'x')).toBeNull()
  })
  it('annulla torna allo stato precedente, ripeti lo ripristina', () => {
    let h = record(emptyHistory<string>(), 'a', undefined, T0)
    h = record(h, 'b', undefined, T0 + 1)
    const u1 = undo(h, 'c')
    expect(u1?.value).toBe('b')
    const u2 = undo(u1!.history, 'b')
    expect(u2?.value).toBe('a')
    expect(u2?.history).toMatchObject({ past: [], future: ['b', 'c'] })
    const r1 = redo(u2!.history, 'a')
    expect(r1?.value).toBe('b')
    const r2 = redo(r1!.history, 'b')
    expect(r2?.value).toBe('c')
    expect(r2?.history).toMatchObject({ past: ['a', 'b'], future: [] })
  })
  it('dopo un annulla la modifica successiva con la stessa chiave non viene unita', () => {
    const h = record(emptyHistory<string>(), 'a', 'k', T0)
    const u = undo(h, 'b')
    const next = record(u!.history, 'a', 'k', T0 + 10)
    expect(next.past).toEqual(['a'])
    expect(next.future).toEqual([])
  })
})
