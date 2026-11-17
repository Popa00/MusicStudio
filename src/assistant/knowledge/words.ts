/**
 * Parole per la ricerca per parole chiave: minuscole, senza accenti, senza parole vuote ("il", "come"…)
 * e con una radice molto semplice ("accordi" e "accordo" → "accord"), così singolare e plurale coincidono.
 */

const STOPWORDS = new Set(
  (
    'il lo la i gli le un uno una di a da in con su per tra fra e ed o od ma se che chi cui non ne ci si mi ti vi ' +
    'del dello della dei degli delle al allo alla ai agli alle dal dallo dalla dai dagli dalle nel nello nella nei negli nelle ' +
    'sul sullo sulla sui sugli sulle col coi come cosa cos quale quali quanto quanti perche quando dove mio mia miei mie ' +
    'tuo tua suo sua questo questa questi queste quello quella quelli quelle sono sei e era essere ho hai ha abbiamo hanno ' +
    'fare faccio fa puo posso devo voglio vorrei mi mio io tu lui lei noi voi loro piu meno molto poco anche ancora gia ' +
    'solo tutto tutti tutte ogni qualche serve servono usa usare uso brano mio pezzo the of and to an is are what how why'
  ).split(' '),
)

export function stripAccents(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '')
}

/** Radice semplice: toglie l'ultima vocale alle parole lunghe (plurale/singolare, maschile/femminile). */
export function stem(word: string): string {
  return word.length > 4 ? word.replace(/[aeio]$/, '') : word
}

/** Le parole utili di un testo, già ridotte alla radice. */
export function words(text: string): string[] {
  return stripAccents(text.toLowerCase())
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w))
    .map(stem)
}
