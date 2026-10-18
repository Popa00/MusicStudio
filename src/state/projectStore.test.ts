import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createEmptyProject } from '../project/factory'
import { setBpm } from '../project/ops/song'
import { projectSchema } from '../project/schema/project'
import { emptyHistory } from './history'
import { useProjectStore } from './projectStore'

const initial = useProjectStore.getState()
const s = () => useProjectStore.getState()

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(100_000)
  useProjectStore.setState({ ...initial, project: createEmptyProject(), history: emptyHistory() }, true)
})
afterEach(() => vi.useRealTimers())

describe('projectStore', () => {
  it('parte con un progetto valido (il modello, in Node non c\'è autosalvataggio)', () => {
    expect(projectSchema.safeParse(initial.project).success).toBe(true)
    expect(initial.project.tracks.length).toBeGreaterThan(0)
    expect(initial.history).toEqual(emptyHistory())
  })
  it('commit applica la modifica e la registra per l\'annulla', () => {
    const before = s().project
    s().commit(setBpm(before, 90))
    expect(s().project.bpm).toBe(90)
    expect(s().history.past).toEqual([before])
  })
  it('commit dello stesso oggetto non registra nulla', () => {
    s().commit(s().project)
    expect(s().history.past).toEqual([])
  })
  it('apply parte dal progetto corrente', () => {
    s().apply((p) => setBpm(p, 100))
    s().apply((p) => setBpm(p, p.bpm + 1))
    expect(s().project.bpm).toBe(101)
    expect(s().history.past).toHaveLength(2)
  })
  it('undo e redo ripristinano gli stati', () => {
    const start = s().project
    s().apply((p) => setBpm(p, 90))
    const at90 = s().project
    s().undo()
    expect(s().project).toBe(start)
    s().redo()
    expect(s().project).toBe(at90)
  })
  it('undo e redo senza cronologia non cambiano nulla', () => {
    const start = s().project
    s().undo()
    s().redo()
    expect(s().project).toBe(start)
  })
  it('una nuova modifica dopo un annulla cancella il "ripeti"', () => {
    s().apply((p) => setBpm(p, 90))
    s().undo()
    s().apply((p) => setBpm(p, 80))
    expect(s().history.future).toEqual([])
    s().redo()
    expect(s().project.bpm).toBe(80)
  })
  it('mergeKey unisce le modifiche rapide in un solo annulla', () => {
    const start = s().project
    for (const bpm of [91, 92, 93]) {
      s().apply((p) => setBpm(p, bpm), 'bpm')
      vi.advanceTimersByTime(300)
    }
    expect(s().history.past).toHaveLength(1)
    s().undo()
    expect(s().project).toBe(start)
  })
  it('con mergeKey, dopo una pausa lunga si crea un nuovo passo', () => {
    s().apply((p) => setBpm(p, 91), 'bpm')
    vi.advanceTimersByTime(1500)
    s().apply((p) => setBpm(p, 92), 'bpm')
    expect(s().history.past).toHaveLength(2)
  })
  it('replace sostituisce il progetto e azzera la cronologia', () => {
    s().apply((p) => setBpm(p, 90))
    const other = createEmptyProject('Altro')
    s().replace(other)
    expect(s().project).toBe(other)
    expect(s().history).toEqual(emptyHistory())
    s().undo()
    expect(s().project).toBe(other)
  })
})
