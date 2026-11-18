import { readCapped } from '../net/readCapped'
import { MAX_INDEX_BYTES, parseLibrary, type KnowledgeLibrary } from './library'

/** Dove l'app trova l'indice (cartella `public/`, servita insieme all'app). */
export const INDEX_URL = `${import.meta.env.BASE_URL}knowledge/index.json`
/** Oltre questo tempo il caricamento si abbandona (e si riprova alla domanda dopo). */
export const LOAD_TIMEOUT_MS = 15_000

let loading: Promise<KnowledgeLibrary> | null = null

/**
 * La biblioteca, scaricata e controllata solo la prima volta che serve (alla prima domanda).
 * Se non si riesce, il tentativo si ripete alla domanda successiva.
 */
export function loadLibrary(url = INDEX_URL): Promise<KnowledgeLibrary> {
  loading ??= (async () => {
    const response = await fetch(url, { redirect: 'error', signal: AbortSignal.timeout(LOAD_TIMEOUT_MS) })
    if (!response.ok) throw new Error(`Indice della biblioteca: errore ${response.status}`)
    return parseLibrary(await readCapped(response, MAX_INDEX_BYTES, 'Indice della biblioteca'))
  })().catch((error: unknown) => {
    loading = null
    throw error
  })
  return loading
}

/** Solo per i test: dimentica la biblioteca già caricata. */
export function forgetLibrary(): void {
  loading = null
}
