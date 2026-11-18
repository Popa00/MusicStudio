import type { EmbeddingProvider } from '../provider/types'
import type { KnowledgeLibrary, LibraryCard } from './library'
import { normalizeVector } from './vectors'

/** Una scheda trovata per la domanda, e se le sue fonti vanno mostrate sotto la risposta. */
export interface FoundCard extends LibraryCard {
  cited: boolean
}

/** Le schede adatte a una domanda (lista vuota se la biblioteca non è disponibile). */
export type Retriever = (question: string, previousQuestion: string | null, signal: AbortSignal) => Promise<FoundCard[]>

/** Quanto conta la domanda precedente nel "significato" cercato: aiuta con domande come "e sulla voce?". */
export const PREVIOUS_WEIGHT = 0.5
/** Oltre questo tempo si cerca solo per parole chiave (il primo calcolo può dover caricare il modello). */
export const EMBED_TIMEOUT_MS = 10_000
/**
 * Somiglianza minima perché le fonti di una scheda si mostrino. Misurata con bge-m3: le domande fuori tema
 * ("che tempo fa domani?") restano sotto 0,45; per quelle di seguito ("e sulla voce?") conta il significato
 * insieme alla domanda precedente, con una soglia più alta.
 */
export const CITE_MIN = 0.45
export const CITE_MIN_WITH_PREVIOUS = 0.55

interface RetrieverDeps {
  library: () => Promise<KnowledgeLibrary>
  embeddings: EmbeddingProvider
  timeoutMs?: number
}

interface QuestionVectors {
  current: Float32Array
  /** Domanda e precedente insieme (uguale a `current` se non c'è una domanda precedente). */
  combined: Float32Array
}

/** Il risultato di `work`, oppure `fallback` appena arriva l'interruzione (es. "Stop" mentre si carica). */
function unlessAborted<T>(work: Promise<T>, signal: AbortSignal, fallback: T): Promise<T> {
  if (signal.aborted) return Promise.resolve(fallback)
  return new Promise((resolve, reject) => {
    const stop = () => resolve(fallback)
    signal.addEventListener('abort', stop, { once: true })
    work.then(resolve, reject).finally(() => signal.removeEventListener('abort', stop))
  })
}

/** I vettori della domanda, da sola e mescolata con la precedente; null se il calcolo non riesce. */
async function questionVectors(deps: RetrieverDeps, model: string, texts: string[], signal: AbortSignal): Promise<QuestionVectors | null> {
  try {
    const timeout = AbortSignal.timeout(deps.timeoutMs ?? EMBED_TIMEOUT_MS)
    const [current, previous] = await deps.embeddings.embed(texts, model, AbortSignal.any([signal, timeout]))
    if (!current) return null
    if (!previous || previous.length !== current.length) return { current, combined: current }
    return { current, combined: normalizeVector(Array.from(current, (v, i) => v + PREVIOUS_WEIGHT * previous[i])) }
  } catch {
    return null
  }
}

/**
 * Cerca nella biblioteca, per parole chiave e per significato, nella domanda e (meno) in quella precedente.
 * Non fallisce mai: senza biblioteca l'assistente risponde comunque, senza LM Studio per i vettori cerca
 * solo per parole chiave (e allora le fonti si mostrano sempre: non c'è modo di misurare quanto c'entrano).
 */
export function createRetriever(deps: RetrieverDeps): Retriever {
  return async (question, previousQuestion, signal) => {
    let library: KnowledgeLibrary | null
    try {
      // Il caricamento non si annulla (serve anche alle domande dopo): si smette solo di aspettarlo.
      library = await unlessAborted(deps.library(), signal, null)
    } catch (error) {
      console.warn('Biblioteca non disponibile:', error)
      return []
    }
    if (!library || signal.aborted) return []
    const lib = library
    const texts = previousQuestion ? [question, previousQuestion] : [question]
    const vectors = await questionVectors(deps, lib.model, texts, signal)
    // Anche le parole della domanda precedente: "e quanto ne metto sulla voce?" da sola non dice di cosa si parla.
    return lib.search(texts.join(' '), vectors?.combined ?? null).map((chunk) => ({
      ...lib.cardOf(chunk),
      cited:
        !vectors ||
        lib.similarity(chunk, vectors.current) >= CITE_MIN ||
        lib.similarity(chunk, vectors.combined) >= CITE_MIN_WITH_PREVIOUS,
    }))
  }
}
