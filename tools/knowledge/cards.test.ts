import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { loadCards, parseCards } from './cards.ts'

const TEXT = 'Il riverbero simula il suono di una stanza: più è grande la stanza, più lunga è la coda del suono.'
const WIKI = 'Riverbero <https://it.wikipedia.org/wiki/Riverbero>'

function card(over: { id?: string; fonti?: string; text?: string } = {}) {
  return `## ${over.id ?? 'riverbero'} | Riverbero\nparole: riverbero, reverb\nfonti: ${over.fonti ?? WIKI}\n\n${over.text ?? TEXT}\n`
}

describe('parseCards', () => {
  it('legge una scheda valida', () => {
    const [c] = parseCards(card(), 'effetti')
    expect(c).toMatchObject({ id: 'riverbero', area: 'effetti', title: 'Riverbero', keywords: ['riverbero', 'reverb'], text: TEXT })
    expect(c.sources).toEqual([{ title: 'Riverbero', url: 'https://it.wikipedia.org/wiki/Riverbero', license: 'CC BY-SA 4.0' }])
  })

  it('legge più schede e ignora ciò che precede la prima', () => {
    const ids = parseCards('intro\n' + card() + '\n' + card({ id: 'delay' }), 'effetti').map((c) => c.id)
    expect(ids).toEqual(['riverbero', 'delay'])
  })

  it('un file senza schede dà una lista vuota', () => {
    expect(parseCards('', 'x')).toEqual([])
  })

  it('accetta i fine riga CRLF', () => {
    const [c] = parseCards(card().replace(/\n/g, '\r\n'), 'effetti')
    expect(c.text).toBe(TEXT)
    expect(c.title).toBe('Riverbero')
  })

  it('legge più fonti separate da ";"', () => {
    const fonti = `${WIKI}; Delay <https://en.wikipedia.org/wiki/Delay>; Teoria <https://viva.pressbooks.pub/openmusictheory/x>`
    expect(parseCards(card({ fonti }), 'effetti')[0].sources.map((s) => s.title)).toEqual(['Riverbero', 'Delay', 'Teoria'])
  })

  it('rifiuta URL di siti non ammessi', () => {
    expect(() => parseCards(card({ fonti: 'Blog <https://example.com/x>' }), 'effetti')).toThrow(/sito non ammesso/)
  })

  it('rifiuta un URL http non https', () => {
    expect(() => parseCards(card({ fonti: 'Wiki <http://it.wikipedia.org/wiki/X>' }), 'effetti')).toThrow(/fonte non valida/)
  })

  it('rifiuta una fonte nel formato sbagliato', () => {
    expect(() => parseCards(card({ fonti: 'https://it.wikipedia.org/wiki/X' }), 'effetti')).toThrow(/fonte non valida/)
  })

  it('rifiuta un testo troppo corto', () => {
    expect(() => parseCards(card({ text: 'Troppo corto.' }), 'effetti')).toThrow(/text/)
  })

  it('rifiuta un testo troppo lungo', () => {
    expect(() => parseCards(card({ text: 'a'.repeat(4001) }), 'effetti')).toThrow(/text/)
  })

  it('rifiuta una scheda senza fonti', () => {
    expect(() => parseCards(card({ fonti: '' }), 'effetti')).toThrow(/sources/)
  })

  it('rifiuta un id non valido', () => {
    expect(() => parseCards(card({ id: 'Riverbero Grande' }), 'effetti')).toThrow(/id/)
  })

  it('il messaggio di errore contiene "area/id"', () => {
    expect(() => parseCards(card({ text: 'corto' }), 'effetti')).toThrow(/effetti\/riverbero/)
    expect(() => parseCards(card({ fonti: 'Blog <https://example.com/x>' }), 'ritmo')).toThrow(/ritmo\/riverbero/)
  })
})

describe('loadCards', () => {
  const dirs: string[] = []
  afterEach(() => {
    for (const d of dirs.splice(0)) rmSync(d, { recursive: true, force: true })
  })
  const temp = () => {
    const d = mkdtempSync(join(tmpdir(), 'cards-test-'))
    dirs.push(d)
    return d
  }

  it('carica le schede di più file in ordine alfabetico, ignorando i non .md', () => {
    const d = temp()
    writeFileSync(join(d, 'b.md'), card({ id: 'delay' }))
    writeFileSync(join(d, 'a.md'), card())
    writeFileSync(join(d, 'note.txt'), 'ignorato')
    expect(loadCards(d).map((c) => `${c.area}/${c.id}`)).toEqual(['a/riverbero', 'b/delay'])
  })

  it('dà errore su id ripetuti in file diversi', () => {
    const d = temp()
    writeFileSync(join(d, 'a.md'), card())
    writeFileSync(join(d, 'b.md'), card())
    expect(() => loadCards(d)).toThrow(/Scheda ripetuta: riverbero/)
  })
})
