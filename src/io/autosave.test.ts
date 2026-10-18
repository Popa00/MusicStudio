import { afterEach, describe, expect, it, vi } from 'vitest'
import { createEmptyProject } from '../project/factory'
import { createDebouncedSaver, loadAutosave, saveNow } from './autosave'
import { serializeProject } from './projectFile'

const KEY = 'music-studio:autosave'

/** localStorage finto in memoria; `failWrites` simula spazio pieno o privacy. */
function stubStorage(initial: Record<string, string> = {}, failWrites = false) {
  const data = new Map(Object.entries(initial))
  const storage = {
    getItem: vi.fn((k: string) => data.get(k) ?? null),
    setItem: vi.fn((k: string, v: string) => {
      if (failWrites) throw new Error('QuotaExceededError')
      data.set(k, v)
    }),
  }
  vi.stubGlobal('localStorage', storage)
  return { data, storage }
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

describe('loadAutosave', () => {
  it('in Node (senza localStorage) restituisce null senza lanciare', () => {
    expect(() => loadAutosave()).not.toThrow()
    expect(loadAutosave()).toBeNull()
  })
  it('restituisce null se non c\'è nulla di salvato', () => {
    stubStorage()
    expect(loadAutosave()).toBeNull()
  })
  it('restituisce il progetto salvato se è valido', () => {
    const project = createEmptyProject('Salvato')
    stubStorage({ [KEY]: serializeProject(project) })
    expect(loadAutosave()).toEqual(project)
  })
  it('restituisce null se il salvataggio è corrotto o non valido', () => {
    for (const text of ['{', '{"bpm": 999}', 'null']) {
      stubStorage({ [KEY]: text })
      expect(loadAutosave()).toBeNull()
    }
  })
  it('restituisce null se localStorage lancia un errore', () => {
    vi.stubGlobal('localStorage', { getItem: () => { throw new Error('SecurityError') } })
    expect(loadAutosave()).toBeNull()
  })
})

describe('saveNow', () => {
  it('salva il progetto serializzato e restituisce true', () => {
    const { data } = stubStorage()
    const project = createEmptyProject('Uno')
    expect(saveNow(project)).toBe(true)
    expect(data.get(KEY)).toBe(serializeProject(project))
  })
  it('restituisce false se il browser rifiuta il salvataggio', () => {
    stubStorage({}, true)
    expect(saveNow(createEmptyProject())).toBe(false)
  })
  it('restituisce false in Node senza localStorage', () => {
    expect(saveNow(createEmptyProject())).toBe(false)
  })
})

describe('createDebouncedSaver', () => {
  it('molte modifiche ravvicinate producono un solo salvataggio, con l\'ultimo progetto', () => {
    vi.useFakeTimers()
    const { data, storage } = stubStorage()
    const onError = vi.fn()
    const { save } = createDebouncedSaver(onError)
    save(createEmptyProject('a'))
    vi.advanceTimersByTime(500)
    save(createEmptyProject('b'))
    vi.advanceTimersByTime(999)
    expect(storage.setItem).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1)
    expect(storage.setItem).toHaveBeenCalledTimes(1)
    expect(loadAutosave()?.name).toBe('b')
    expect(data.size).toBe(1)
    expect(onError).not.toHaveBeenCalled()
  })
  it('modifiche distanti producono salvataggi separati', () => {
    vi.useFakeTimers()
    const { storage } = stubStorage()
    const { save } = createDebouncedSaver(vi.fn())
    save(createEmptyProject('a'))
    vi.advanceTimersByTime(1000)
    save(createEmptyProject('b'))
    vi.advanceTimersByTime(1000)
    expect(storage.setItem).toHaveBeenCalledTimes(2)
  })
  it('chiama onError se il salvataggio fallisce', () => {
    vi.useFakeTimers()
    stubStorage({}, true)
    const onError = vi.fn()
    createDebouncedSaver(onError).save(createEmptyProject())
    expect(onError).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1000)
    expect(onError).toHaveBeenCalledTimes(1)
  })
})
