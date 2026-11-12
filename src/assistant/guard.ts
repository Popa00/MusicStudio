import { FEATURES_TITLE, RULES } from './prompt'
import { SUMMARY_TITLE } from './summary/projectSummary'

/** Risposta mostrata al posto di una che stava ricopiando le istruzioni riservate. */
export const BLOCKED_ANSWER =
  'Le mie istruzioni sono riservate e non posso mostrarle. Posso però aiutarti con il tuo brano o rispondere a domande sulla musica.'

/** Lunghezza dei pezzi di regola cercati nelle risposte, e passo con cui si fanno scorrere. */
const WINDOW = 40
const STEP = 20
/** Quante regole diverse devono comparire pari pari: una sola può essere una frase normale. */
const MIN_RULES = 2

/** Titoli delle sezioni riservate, cercati con maiuscole e minuscole esatte. */
const MARKERS = [FEATURES_TITLE, "L'APP NON HA (ancora)", SUMMARY_TITLE.slice(0, 28), 'LEGENDA: posizione']

/** Apostrofi e virgolette tipografiche diventano quelle semplici. */
const plainQuotes = (text: string) => text.replace(/[’‘`]/g, "'")

const normalize = (text: string) =>
  plainQuotes(text)
    .toLowerCase()
    .replace(/[*_`#>"«»“”]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

/** Per ogni regola, i suoi pezzi da WINDOW caratteri (sovrapposti). */
function ruleFragments(): string[][] {
  return RULES.split('\n')
    .map((line) => normalize(line.replace(/^-\s*/, '')))
    .filter((line) => line.length >= WINDOW)
    .map((line) => {
      const parts: string[] = []
      for (let i = 0; i + WINDOW <= line.length; i += STEP) parts.push(line.slice(i, i + WINDOW))
      return parts
    })
}

const FRAGMENTS = ruleFragments()

/**
 * Vero se la risposta sta ricopiando le istruzioni riservate: un titolo di sezione,
 * oppure pezzi identici di almeno due regole diverse. Parafrasi e frasi normali passano.
 */
export function leaksInstructions(answer: string): boolean {
  const plain = plainQuotes(answer)
  if (MARKERS.some((marker) => plain.includes(marker))) return true
  const text = normalize(answer)
  let rules = 0
  for (const parts of FRAGMENTS) {
    if (parts.some((part) => text.includes(part)) && ++rules >= MIN_RULES) return true
  }
  return false
}
