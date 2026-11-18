import { assistantEmbeddings } from '../provider'
import { loadLibrary } from './loadLibrary'
import { createRetriever } from './retrieve'

/** La ricerca usata dall'app: indice in `public/knowledge/`, vettori delle domande da LM Studio. */
export const assistantRetriever = createRetriever({ library: () => loadLibrary(), embeddings: assistantEmbeddings })
