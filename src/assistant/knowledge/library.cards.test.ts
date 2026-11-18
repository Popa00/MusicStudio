import { describe, expect, it } from 'vitest'
import { parseLibrary } from './library'
import { encodeVector, normalizeVector } from './vectors'

const DIMS = 8
const SOURCE = { title: 'Reverberation', url: 'https://en.wikipedia.org/wiki/Reverberation', license: 'CC BY-SA 4.0' }
const unit = (i: number) => normalizeVector(Array.from({ length: DIMS }, (_, k) => (k === i ? 1 : 0)))
const piece = (card: string, text: string, i: number) =>
  ({ card, area: 'effetti', title: card, text, keywords: [], sources: [SOURCE], vector: encodeVector(unit(i)) })

const library = () =>
  parseLibrary(
    JSON.stringify({
      version: 1, model: 'm', dims: DIMS, license: 'CC BY-SA 4.0',
      chunks: [piece('riverbero', 'Inizio.', 0), piece('delay', 'Eco.', 1), piece('riverbero', '### Errori comuni\nTroppo.', 2)],
    }),
  )

describe('parseLibrary: schede divise in pezzi', () => {
  it('cardOf ricompone la scheda intera, nell ordine dei pezzi', () => {
    const lib = library()
    expect(lib.cardOf(lib.chunks[2])).toEqual({ card: 'riverbero', title: 'riverbero', text: 'Inizio.\n\n### Errori comuni\nTroppo.', sources: [SOURCE] })
    expect(lib.cardOf(lib.chunks[1]).text).toBe('Eco.')
  })
  it('similarity confronta il vettore del pezzo', () => {
    const lib = library()
    expect(lib.similarity(lib.chunks[2], unit(2))).toBeCloseTo(1)
    expect(lib.similarity(lib.chunks[2], unit(0))).toBeCloseTo(0)
  })
  it('la ricerca restituisce un solo pezzo per scheda', () => {
    const lib = library()
    const found = lib.search('', normalizeVector([1, 0, 1, 0, 0, 0, 0, 0]))
    expect(found.filter((c) => c.card === 'riverbero')).toHaveLength(1)
  })
})
