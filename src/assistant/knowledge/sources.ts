/**
 * Siti da cui la biblioteca può prendere testi, con la loro licenza. Una fonte con un indirizzo diverso
 * viene rifiutata sia quando si costruisce l'indice sia quando l'app lo legge: così nella chat non può
 * comparire un link "Fonte" verso un sito qualsiasi. Questo file non importa nulla (lo usa anche Node).
 */

export const SOURCE_LICENSES = ['CC BY-SA 4.0'] as const
export type SourceLicense = (typeof SOURCE_LICENSES)[number]

interface SourceSite {
  host: string
  /** Inizio obbligatorio del percorso: su alcuni siti solo certi libri hanno una licenza compatibile. */
  path: RegExp
  license: SourceLicense
}

const SITES: SourceSite[] = [
  { host: 'en.wikipedia.org', path: /^\/wiki\//, license: 'CC BY-SA 4.0' },
  { host: 'it.wikipedia.org', path: /^\/wiki\//, license: 'CC BY-SA 4.0' },
  { host: 'en.wikibooks.org', path: /^\/wiki\//, license: 'CC BY-SA 4.0' },
  { host: 'it.wikibooks.org', path: /^\/wiki\//, license: 'CC BY-SA 4.0' },
  { host: 'viva.pressbooks.pub', path: /^\/openmusictheory\//, license: 'CC BY-SA 4.0' },
  // Su LibreTexts la licenza cambia da libro a libro: solo Open Music Theory 2e è CC BY-SA 4.0.
  {
    host: 'human.libretexts.org',
    path: /^\/Bookshelves\/Music\/Music_Theory\/Open_Music_Theory_2e_\(Gotham_et_al\.\)\//,
    license: 'CC BY-SA 4.0',
  },
]

/** Solo caratteri "normali" di un indirizzo: niente spazi, virgolette, barre rovesciate o parentesi angolari. */
const SAFE_URL = /^https:\/\/[A-Za-z0-9._~/?#@!$&()*+,;=%:-]+$/

/** La licenza della fonte, o null se l'indirizzo non è di un sito ammesso. */
export function sourceLicense(url: string): SourceLicense | null {
  if (url.length > 500 || !SAFE_URL.test(url)) return null
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return null
  }
  if (parsed.protocol !== 'https:' || parsed.port || parsed.username || parsed.password) return null
  const site = SITES.find((s) => s.host === parsed.hostname && s.path.test(parsed.pathname))
  return site ? site.license : null
}
