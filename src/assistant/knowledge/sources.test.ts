import { describe, expect, it } from 'vitest'
import { sourceSchema } from './schema'
import { sourceLicense } from './sources'

describe('sourceLicense', () => {
  it.each([
    'https://en.wikipedia.org/wiki/Reverberation',
    'https://it.wikipedia.org/wiki/Accordo_(musica)',
    'https://en.wikipedia.org/wiki/Verse%E2%80%93chorus_form',
    'https://en.wikibooks.org/wiki/Music_Theory',
    'https://viva.pressbooks.pub/openmusictheory/chapter/intro/',
    'https://human.libretexts.org/Bookshelves/Music/Music_Theory/Open_Music_Theory_2e_(Gotham_et_al.)/07%3A_Popular_Music',
  ])('ammette %s', (url) => {
    expect(sourceLicense(url)).toBe('CC BY-SA 4.0')
  })

  it.each([
    ['un altro libro di LibreTexts (licenza diversa)', 'https://human.libretexts.org/Bookshelves/Music/Music_Theory/Music_Theory_(Other)/x'],
    ['un sito qualsiasi', 'https://example.com/wiki/Reverb'],
    ['un dominio che imita Wikipedia', 'https://en.wikipedia.org.example.com/wiki/Reverb'],
    ['http', 'http://en.wikipedia.org/wiki/Reverb'],
    ['una porta', 'https://en.wikipedia.org:8443/wiki/Reverb'],
    ['credenziali nell\'indirizzo', 'https://user@en.wikipedia.org/wiki/Reverb'],
    ['un percorso fuori da /wiki/', 'https://en.wikipedia.org/w/index.php?title=Reverb'],
    ['barre rovesciate', 'https://en.wikipedia.org\\@example.com/wiki/x'],
    ['virgolette', 'https://en.wikipedia.org/wiki/"x"'],
    ['javascript', 'javascript:alert(1)'],
    ['spazi', 'https://en.wikipedia.org/wiki/a b'],
  ])('rifiuta %s', (_label, url) => {
    expect(sourceLicense(url)).toBeNull()
  })

  it('rifiuta un indirizzo troppo lungo', () => {
    expect(sourceLicense(`https://en.wikipedia.org/wiki/${'a'.repeat(500)}`)).toBeNull()
  })
})

describe('sourceSchema', () => {
  it('accetta una fonte di Wikipedia con la sua licenza', () => {
    expect(sourceSchema.safeParse({ title: 'Reverb', url: 'https://en.wikipedia.org/wiki/Reverb', license: 'CC BY-SA 4.0' }).success).toBe(true)
  })
  it('rifiuta una fonte da un sito non ammesso anche con una licenza valida', () => {
    expect(sourceSchema.safeParse({ title: 'Wikipedia', url: 'https://example.com/wiki/Reverb', license: 'CC BY-SA 4.0' }).success).toBe(false)
  })
  it('rifiuta una licenza inventata', () => {
    expect(sourceSchema.safeParse({ title: 'Reverb', url: 'https://en.wikipedia.org/wiki/Reverb', license: 'CC0' }).success).toBe(false)
  })
})
