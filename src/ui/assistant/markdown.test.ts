import { describe, expect, it } from 'vitest'
import { parseBlocks, parseInline } from './markdown'

describe('parseBlocks', () => {
  it('testo vuoto non dà blocchi', () => {
    expect(parseBlocks('')).toEqual([])
    expect(parseBlocks('\n  \n')).toEqual([])
  })
  it('le righe consecutive formano un paragrafo, la riga vuota ne apre un altro', () => {
    expect(parseBlocks('uno\ndue\n\ntre')).toEqual([
      { kind: 'p', text: 'uno\ndue' },
      { kind: 'p', text: 'tre' },
    ])
  })
  it('riconosce i titoli da # a ######', () => {
    expect(parseBlocks('# A\n### B\n###### C')).toEqual([
      { kind: 'h', text: 'A' },
      { kind: 'h', text: 'B' },
      { kind: 'h', text: 'C' },
    ])
  })
  it('sette # non sono un titolo', () => {
    expect(parseBlocks('####### x')).toEqual([{ kind: 'p', text: '####### x' }])
  })
  it('un # senza spazio non è un titolo', () => {
    expect(parseBlocks('#hashtag')).toEqual([{ kind: 'p', text: '#hashtag' }])
  })
  it('riconosce gli elenchi puntati con -, * e •', () => {
    expect(parseBlocks('- a\n* b\n• c')).toEqual([{ kind: 'ul', items: ['a', 'b', 'c'] }])
  })
  it('riconosce gli elenchi numerati con punto o parentesi', () => {
    expect(parseBlocks('1. a\n2) b\n10. c')).toEqual([{ kind: 'ol', items: ['a', 'b', 'c'] }])
  })
  it('le righe vuote dentro un elenco non lo spezzano', () => {
    expect(parseBlocks('1. a\n\n2. b\n\n\n3. c')).toEqual([{ kind: 'ol', items: ['a', 'b', 'c'] }])
    expect(parseBlocks('- a\n\n- b')).toEqual([{ kind: 'ul', items: ['a', 'b'] }])
  })
  it('un elenco puntato e uno numerato di seguito restano separati', () => {
    expect(parseBlocks('- a\n1. b')).toEqual([
      { kind: 'ul', items: ['a'] },
      { kind: 'ol', items: ['b'] },
    ])
  })
  it('un paragrafo in mezzo spezza l\'elenco', () => {
    expect(parseBlocks('- a\ntesto\n- b')).toEqual([
      { kind: 'ul', items: ['a'] },
      { kind: 'p', text: 'testo' },
      { kind: 'ul', items: ['b'] },
    ])
  })
  it('titolo, paragrafo ed elenco insieme', () => {
    expect(parseBlocks('## Titolo\nTesto\n\n- uno\n- due')).toEqual([
      { kind: 'h', text: 'Titolo' },
      { kind: 'p', text: 'Testo' },
      { kind: 'ul', items: ['uno', 'due'] },
    ])
  })
  it('una riga che comincia con il grassetto non è un elenco', () => {
    expect(parseBlocks('**Attenzione** qui')).toEqual([{ kind: 'p', text: '**Attenzione** qui' }])
  })
  it('un numero senza punto non è un elenco', () => {
    expect(parseBlocks('2024 è un anno')).toEqual([{ kind: 'p', text: '2024 è un anno' }])
  })
  it('non produce mai HTML: il testo resta com\'è', () => {
    expect(parseBlocks('<script>x</script>')).toEqual([{ kind: 'p', text: '<script>x</script>' }])
  })
})

describe('parseInline', () => {
  it('testo semplice è un solo pezzo', () => {
    expect(parseInline('ciao')).toEqual([{ kind: 'text', text: 'ciao' }])
    expect(parseInline('')).toEqual([])
  })
  it('riconosce grassetto, corsivo e codice', () => {
    expect(parseInline('a **b** c *d* e `f`')).toEqual([
      { kind: 'text', text: 'a ' },
      { kind: 'strong', text: 'b' },
      { kind: 'text', text: ' c ' },
      { kind: 'em', text: 'd' },
      { kind: 'text', text: ' e ' },
      { kind: 'code', text: 'f' },
    ])
  })
  it('il codice può contenere asterischi', () => {
    expect(parseInline('`a*b*c`')).toEqual([{ kind: 'code', text: 'a*b*c' }])
  })
  it('asterischi isolati restano testo', () => {
    expect(parseInline('2 * 3 * 4')).toEqual([{ kind: 'text', text: '2 * 3 * 4' }])
    expect(parseInline('5 * 3')).toEqual([{ kind: 'text', text: '5 * 3' }])
  })
  it('quattro asterischi di fila restano testo', () => {
    expect(parseInline('****')).toEqual([{ kind: 'text', text: '****' }])
  })
  it('un grassetto non chiuso resta testo', () => {
    expect(parseInline('**aperto')).toEqual([{ kind: 'text', text: '**aperto' }])
    expect(parseInline('`aperto')).toEqual([{ kind: 'text', text: '`aperto' }])
  })
  it('più grassetti nella stessa riga', () => {
    expect(parseInline('**a****b**').filter((p) => p.kind === 'strong').map((p) => p.text)).toEqual(['a', 'b'])
  })
  it('il testo dentro i simboli non viene interpretato come HTML', () => {
    expect(parseInline('**<b>x</b>**')).toEqual([{ kind: 'strong', text: '<b>x</b>' }])
  })
})
