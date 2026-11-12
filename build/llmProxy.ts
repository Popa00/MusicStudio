import type { ProxyOptions } from 'vite'

/**
 * L'assistente parla con LM Studio (server locale, porta 1234) passando dal dev server: il browser
 * resta sullo stesso indirizzo dell'app, quindi niente permessi CORS e la Content-Security-Policy
 * può restare `connect-src 'self'`. Il proxy inoltra solo a questo PC e solo le due richieste che servono:
 * qualsiasi altro percorso (es. le API di gestione dei modelli di LM Studio) riceve 404.
 */
const ALLOWED = new Set(['GET /api/llm/models', 'POST /api/llm/chat/completions'])

export const LLM_PROXY: Record<string, ProxyOptions> = {
  '^/api/llm/': {
    target: 'http://127.0.0.1:1234',
    changeOrigin: true,
    // false = Vite risponde 404 senza inoltrare.
    bypass: (req) => (ALLOWED.has(`${req.method} ${req.url}`) ? undefined : false),
    rewrite: (path) => path.replace(/^\/api\/llm/, '/v1'),
  },
}
