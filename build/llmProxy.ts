import type { ProxyOptions } from 'vite'

type ProxyRequest = Parameters<NonNullable<ProxyOptions['bypass']>>[0]

/**
 * L'assistente parla con LM Studio (server locale, porta 1234) passando dal dev server: il browser
 * resta sullo stesso indirizzo dell'app, quindi niente permessi CORS e la Content-Security-Policy
 * può restare `connect-src 'self'`. Il proxy inoltra solo a questo PC e solo le richieste che servono
 * (modelli, risposte, vettori per la biblioteca): qualsiasi altro percorso riceve 404.
 */
const ALLOWED = new Set(['GET /api/llm/models', 'POST /api/llm/chat/completions', 'POST /api/llm/embeddings'])

/**
 * Le richieste POST devono venire dall'app stessa e in JSON: così un altro sito aperto nel browser
 * non può far lavorare il modello mandando richieste "semplici" (senza permesso CORS) a questo indirizzo.
 */
function fromApp(req: ProxyRequest): boolean {
  if (req.method !== 'POST') return true
  const json = (req.headers['content-type'] ?? '').startsWith('application/json')
  const origin = req.headers.origin
  return json && (origin === undefined || origin === `http://${req.headers.host}`)
}

export const LLM_PROXY: Record<string, ProxyOptions> = {
  '^/api/llm/': {
    target: 'http://127.0.0.1:1234',
    changeOrigin: true,
    // false = Vite risponde 404 senza inoltrare.
    bypass: (req) => (ALLOWED.has(`${req.method} ${req.url}`) && fromApp(req) ? undefined : false),
    rewrite: (path) => path.replace(/^\/api\/llm/, '/v1'),
  },
}
