/** Lunghezza massima di un nome nel riassunto (lo schema ne ammette già al massimo 40). */
const MAX_NAME = 40

/**
 * I nomi scelti dall'utente (o arrivati con un file scaricato) finiscono nelle istruzioni del modello:
 * si tolgono a capo, caratteri di controllo e i simboli usati dal riassunto, così un nome non può
 * fingersi una sezione o una regola ("REGOLE: ...").
 */
export function safeName(name: string): string {
  const cleaned = name
    .replace(/[\p{Cc}\p{Cf}\p{Zl}\p{Zp}]/gu, ' ')
    .replace(/[«»#`<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_NAME)
  return cleaned || '(senza nome)'
}
