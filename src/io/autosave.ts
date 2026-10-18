import type { Project } from '../project/types'
import { parseProject, serializeProject } from './projectFile'

const STORAGE_KEY = 'music-studio:autosave'
/** Copia di un salvataggio che non si è riusciti a leggere: non viene mai sovrascritto in silenzio. */
export const BACKUP_KEY = 'music-studio:autosave-backup'
const SAVE_DELAY_MS = 1000

/** Progetto salvato automaticamente nel browser, se c'è ed è valido. */
export function loadAutosave(): Project | null {
  try {
    const text = localStorage.getItem(STORAGE_KEY)
    if (!text) return null
    const result = parseProject(text)
    if (result.ok) return result.project
    localStorage.setItem(BACKUP_KEY, text)
    return null
  } catch {
    return null
  }
}

/** True se all'avvio un salvataggio illeggibile è stato messo da parte. */
export function hasAutosaveBackup(): boolean {
  try {
    return localStorage.getItem(BACKUP_KEY) !== null
  } catch {
    return false
  }
}

/** Salva subito. Restituisce false se il browser non lo permette (spazio pieno, privacy). */
export function saveNow(project: Project): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, serializeProject(project))
    return true
  } catch {
    return false
  }
}

export interface DebouncedSaver {
  save: (project: Project) => void
  /** Salva subito l'eventuale modifica in attesa (es. alla chiusura della pagina). */
  flush: () => void
}

/** Salva in ritardo: tante modifiche ravvicinate producono un solo salvataggio. */
export function createDebouncedSaver(onError: () => void): DebouncedSaver {
  let timer: ReturnType<typeof setTimeout> | undefined
  let pending: Project | null = null

  function flush() {
    clearTimeout(timer)
    if (pending && !saveNow(pending)) onError()
    pending = null
  }

  return {
    save: (project) => {
      pending = project
      clearTimeout(timer)
      timer = setTimeout(flush, SAVE_DELAY_MS)
    },
    flush,
  }
}
