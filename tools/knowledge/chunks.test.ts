import { describe, expect, it } from 'vitest'
import { chunkEmbeddingText, MIN_CHUNK_CHARS, splitCard } from './chunks.ts'

const long = (word: string) => `${word} `.repeat(Math.ceil(MIN_CHUNK_CHARS / (word.length + 1)) + 5).trim()

describe('splitCard', () => {
  it('una scheda senza sotto-sezioni resta un pezzo solo', () => {
    expect(splitCard('Testo semplice.\nSeconda riga.')).toEqual([{ heading: null, text: 'Testo semplice.\nSeconda riga.' }])
  })
  it('divide alle righe "### " e tiene la riga del titolo nel pezzo', () => {
    const text = `${long('intro')}\n\n### Come si usa\n${long('uso')}\n\n### Errori comuni\n${long('errore')}`
    const chunks = splitCard(text)
    expect(chunks.map((c) => c.heading)).toEqual([null, 'Come si usa', 'Errori comuni'])
    expect(chunks[1].text.startsWith('### Come si usa\n')).toBe(true)
  })
  it('i pezzi uniti con una riga vuota ridanno la scheda', () => {
    const text = `${long('intro')}\n\n### A\n${long('a')}\n\n### B\n${long('b')}`
    expect(splitCard(text).map((c) => c.text).join('\n\n')).toBe(text)
  })
  it('un pezzo troppo corto si unisce a quello dopo', () => {
    const chunks = splitCard(`Breve.\n\n### A\n${long('a')}\n\n### B\n${long('b')}`)
    expect(chunks.map((c) => c.heading)).toEqual([null, 'B'])
    expect(chunks[0].text).toContain('### A')
  })
})

describe('chunkEmbeddingText', () => {
  it('mette titolo, sotto-sezione e parole chiave prima del testo', () => {
    expect(chunkEmbeddingText({ title: 'Riverbero', keywords: ['reverb', 'eco'] }, { heading: 'Errori comuni', text: 'x' })).toBe(
      'Riverbero — Errori comuni\nreverb, eco\nx',
    )
    expect(chunkEmbeddingText({ title: 'Riverbero', keywords: [] }, { heading: null, text: 'x' })).toBe('Riverbero\n\nx')
  })
})
