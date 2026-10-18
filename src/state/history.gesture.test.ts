import { describe, expect, it } from 'vitest'
import { emptyHistory, GESTURE_PREFIX, MERGE_WINDOW_MS, record } from './history'

describe('record: gesti', () => {
  it('un trascinamento resta un solo "annulla" anche con pause più lunghe della finestra', () => {
    const key = `${GESTURE_PREFIX}note:1`
    let h = record(emptyHistory<number>(), 0, key, 0)
    h = record(h, 1, key, MERGE_WINDOW_MS * 5)
    h = record(h, 2, key, MERGE_WINDOW_MS * 10)
    expect(h.past).toEqual([0])
  })

  it('le chiavi normali dopo la finestra creano un nuovo passo', () => {
    let h = record(emptyHistory<number>(), 0, 'bpm', 0)
    h = record(h, 1, 'bpm', MERGE_WINDOW_MS + 1)
    expect(h.past).toEqual([0, 1])
  })

  it('due gesti diversi non si uniscono', () => {
    let h = record(emptyHistory<number>(), 0, `${GESTURE_PREFIX}a`, 0)
    h = record(h, 1, `${GESTURE_PREFIX}b`, 10)
    expect(h.past).toEqual([0, 1])
  })
})
