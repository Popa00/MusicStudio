import { describe, expect, it } from 'vitest'
import { PROJECT_EXTENSION, projectFileName } from './projectFile'

const base = (name: string) => projectFileName(name).slice(0, -PROJECT_EXTENSION.length)

describe('projectFileName', () => {
  it('usa il nome del progetto con l\'estensione .msproj', () => {
    expect(projectFileName('Il mio brano')).toBe('Il mio brano.msproj')
  })
  it('mantiene lettere accentate, numeri, trattini e underscore', () => {
    expect(projectFileName('Canzone è più bella_2-b')).toBe('Canzone è più bella_2-b.msproj')
  })
  it('toglie i percorsi ("../", "/", "\\") e i due punti', () => {
    expect(projectFileName('../../etc/passwd')).toBe('etcpasswd.msproj')
    expect(projectFileName('..\\..\\Windows\\system32')).toBe('Windowssystem32.msproj')
    expect(projectFileName('C:\\temp')).toBe('Ctemp.msproj')
    for (const name of ['../x', 'a/b', 'a\\b', '..', 'a:b']) {
      expect(base(name)).not.toMatch(/[/\\:.]/)
    }
  })
  it('toglie i caratteri non ammessi nei nomi di file (<>:"|?*) e i caratteri di controllo', () => {
    expect(projectFileName('<script>alert(1)</script>')).toBe('scriptalert1script.msproj')
    expect(projectFileName('a<>:"|?*b')).toBe('ab.msproj')
    expect(projectFileName('a\u0000b\nc\td')).toBe('abcd.msproj')
  })
  it('usa "progetto" se il nome è vuoto o resta vuoto dopo la pulizia', () => {
    for (const name of ['', '   ', '../', '<>', '...', '/\\']) {
      expect(projectFileName(name)).toBe('progetto.msproj')
    }
  })
  it('limita la lunghezza del nome a 40 caratteri', () => {
    expect(base('a'.repeat(200))).toHaveLength(40)
  })
  it('toglie gli spazi all\'inizio e alla fine', () => {
    expect(projectFileName('  Brano  ')).toBe('Brano.msproj')
  })
})
