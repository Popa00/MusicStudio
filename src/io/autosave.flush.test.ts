import { afterEach, describe, expect, it, vi } from 'vitest'
import { createEmptyProject } from '../project/factory'
import { BACKUP_KEY, createDebouncedSaver, hasAutosaveBackup, loadAutosave } from './autosave'

function stubStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial))
  const storage = {
    getItem: vi.fn((k: string) => data.get(k) ?? null),
    setItem: vi.fn((k: string, v: string) => void data.set(k, v)),
  }
  vi.stubGlobal('localStorage', storage)
  return { data, storage }
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

describe('createDebouncedSaver.flush', () => {
  it('salva subito la modifica in attesa (es. chiusura della pagina)', () => {
    vi.useFakeTimers()
    const { storage } = stubStorage()
    const saver = createDebouncedSaver(vi.fn())
    saver.save(createEmptyProject('ultimo'))
    saver.flush()
    expect(storage.setItem).toHaveBeenCalledTimes(1)
    vi.advanceTimersByTime(2000)
    expect(storage.setItem).toHaveBeenCalledTimes(1)
  })

  it('senza modifiche in attesa non salva nulla', () => {
    const { storage } = stubStorage()
    createDebouncedSaver(vi.fn()).flush()
    expect(storage.setItem).not.toHaveBeenCalled()
  })
})

describe('loadAutosave con salvataggio illeggibile', () => {
  it('ne conserva una copia di backup invece di perderlo', () => {
    const { data } = stubStorage({ 'music-studio:autosave': '{"rotto": true}' })
    expect(loadAutosave()).toBeNull()
    expect(data.get(BACKUP_KEY)).toBe('{"rotto": true}')
    expect(hasAutosaveBackup()).toBe(true)
  })

  it('nessun backup se il salvataggio è valido o assente', () => {
    stubStorage()
    expect(loadAutosave()).toBeNull()
    expect(hasAutosaveBackup()).toBe(false)
  })
})
