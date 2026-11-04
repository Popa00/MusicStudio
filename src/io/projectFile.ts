import { LIMITS } from '../project/limits'
import type { Project } from '../project/types'
import { PROJECT_FORMAT_VERSION } from '../project/schema/project'
import { parseAnyVersion } from './migrate'
import { normalizeProject } from './normalize'

export const PROJECT_EXTENSION = '.msproj'

export type ParseResult = { ok: true; project: Project } | { ok: false; error: string }

export function serializeProject(project: Project): string {
  return JSON.stringify(project)
}

/**
 * Legge un progetto da testo non fidato (file aperto o salvataggio automatico).
 * Lo schema zod rifiuta valori fuori range e scarta i campi sconosciuti (es. "__proto__").
 * I file delle versioni precedenti vengono convertiti alla versione attuale.
 */
export function parseProject(text: string): ParseResult {
  if (text.length > LIMITS.fileChars) return { ok: false, error: 'Il file è troppo grande per essere un progetto.' }
  let data: unknown
  try {
    data = JSON.parse(text)
  } catch {
    return { ok: false, error: 'Il file non è un progetto valido (formato non leggibile).' }
  }
  if (isNewerVersion(data)) {
    return { ok: false, error: "Il progetto è stato creato con una versione più recente dell'app: aggiornala per aprirlo." }
  }
  const result = parseAnyVersion(data)
  if (!result.success) {
    const first = result.error.issues[0]
    const where = first?.path.join('.') || 'file'
    return { ok: false, error: `Il progetto contiene dati non validi (${where}).` }
  }
  return { ok: true, project: normalizeProject(result.data) }
}

function isNewerVersion(data: unknown): boolean {
  const version = typeof data === 'object' && data !== null ? (data as { formatVersion?: unknown }).formatVersion : undefined
  return typeof version === 'number' && version > PROJECT_FORMAT_VERSION
}

/** Nome file sicuro a partire dal nome del progetto. */
export function projectFileName(name: string): string {
  const safe = name.replace(/[^\p{L}\p{N} _-]/gu, '').trim().slice(0, 40)
  return `${safe || 'progetto'}${PROJECT_EXTENSION}`
}
