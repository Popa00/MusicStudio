import { describe, expect, it } from 'vitest'
import { LIBRARY_TITLE, librarySection, sourcesOf } from './libraryPrompt'
import type { KnowledgeChunk, KnowledgeSource } from './schema'

const src = (name: string): KnowledgeSource => ({ title: name, url: `https://en.wikipedia.org/wiki/${name}`, license: 'CC BY-SA 4.0' })
const chunk = (title: string, text: string, sources: KnowledgeSource[] = []): KnowledgeChunk =>
  ({ card: title.toLowerCase(), area: 'a', title, text, keywords: [], sources, vector: '' })

describe('librarySection', () => {
  it('è vuota senza schede', () => {
    expect(librarySection([])).toBe('')
  })
  it('inizia con il titolo della biblioteca', () => {
    expect(librarySection([chunk('Uno', 'testo uno')]).startsWith(LIBRARY_TITLE)).toBe(true)
  })
  it('numera le schede [1], [2] con titolo e testo', () => {
    const section = librarySection([chunk('Uno', 'testo uno'), chunk('Due', 'testo due')])
    expect(section).toContain('[1] Uno\ntesto uno')
    expect(section).toContain('[2] Due\ntesto due')
    expect(section.indexOf('[1]')).toBeLessThan(section.indexOf('[2]'))
    expect(section).not.toContain('[3]')
  })
})

describe('sourcesOf', () => {
  it('è vuoto senza schede o senza fonti', () => {
    expect(sourcesOf([])).toEqual([])
    expect(sourcesOf([chunk('a', 't')])).toEqual([])
  })
  it('deduplica per url mantenendo l ordine di prima comparsa', () => {
    const [a, b, c] = [src('A'), src('B'), src('C')]
    const out = sourcesOf([chunk('x', 't', [b, a]), chunk('y', 't', [a, c, b])])
    expect(out).toEqual([b, a, c])
  })
  it('deduplica per url anche se il titolo differisce', () => {
    const out = sourcesOf([chunk('x', 't', [src('A')]), chunk('y', 't', [{ ...src('A'), title: 'Altro titolo' }])])
    expect(out).toHaveLength(1)
    expect(out[0].title).toBe('A')
  })
})
