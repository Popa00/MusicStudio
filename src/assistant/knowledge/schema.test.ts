import { describe, expect, it } from 'vitest'
import { knowledgeIndexSchema } from './schema.ts'
import { encodeVector } from './vectors.ts'

const DIMS = 8
const vector = encodeVector(new Float32Array(DIMS).fill(0.5))

function chunk(over: Record<string, unknown> = {}) {
  return {
    card: 'riverbero',
    area: 'effetti',
    title: 'Riverbero',
    text: 'Il riverbero simula una stanza.',
    keywords: ['riverbero'],
    sources: [{ title: 'Wiki', url: 'https://it.wikipedia.org/wiki/Riverbero', license: 'CC BY-SA 4.0' }],
    vector,
    ...over,
  }
}

function index(over: Record<string, unknown> = {}, chunkOver: Record<string, unknown> = {}) {
  return { version: 1, model: 'modello', dims: DIMS, license: 'CC BY-SA 4.0', chunks: [chunk(chunkOver)], ...over }
}

describe('knowledgeIndexSchema', () => {
  // Un vettore Float32 di 8 valori (32 byte = 44 caratteri base64) e' accettato (bug del refine gia' corretto).
  it('accetta un indice valido con vettori Float32 di lunghezza coerente con dims', () => {
    expect(knowledgeIndexSchema.safeParse(index()).success).toBe(true)
  })

  it('accetta un indice senza pezzi', () => {
    expect(knowledgeIndexSchema.safeParse(index({ chunks: [] })).success).toBe(true)
  })

  it('rifiuta una versione diversa da 1', () => {
    expect(knowledgeIndexSchema.safeParse(index({ version: 2 })).success).toBe(false)
  })

  it.each(['http://it.wikipedia.org/x', 'https://a b.org', 'https://a.org/"x"', 'ftp://a.org', 'javascript:alert(1)'])(
    "rifiuta l'URL di fonte non ammesso %s",
    (url) => {
      const sources = [{ title: 'T', url, license: 'L' }]
      expect(knowledgeIndexSchema.safeParse(index({}, { sources })).success).toBe(false)
    },
  )

  it.each(['Riverbero', 'a b', 'a_b', '', 'x'.repeat(61), '../x'])("rifiuta l'id scheda %j", (card) => {
    expect(knowledgeIndexSchema.safeParse(index({}, { card })).success).toBe(false)
  })

  it('rifiuta un testo troppo lungo', () => {
    expect(knowledgeIndexSchema.safeParse(index({}, { text: 'a'.repeat(4001) })).success).toBe(false)
  })

  it('rifiuta troppi pezzi', () => {
    const chunks = Array.from({ length: 5001 }, () => chunk())
    expect(knowledgeIndexSchema.safeParse(index({ chunks })).success).toBe(false)
  })

  it('rifiuta un vettore la cui lunghezza non corrisponde a dims', () => {
    const short = encodeVector(new Float32Array(2))
    expect(knowledgeIndexSchema.safeParse(index({}, { vector: short })).success).toBe(false)
  })

  it('rifiuta dims fuori range', () => {
    expect(knowledgeIndexSchema.safeParse(index({ dims: 4 })).success).toBe(false)
    expect(knowledgeIndexSchema.safeParse(index({ dims: 5000 })).success).toBe(false)
  })
})
