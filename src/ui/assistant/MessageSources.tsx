import { sourceLicense } from '../../assistant/knowledge/sources'
import type { KnowledgeSource } from '../../assistant/knowledge/schema'

/**
 * Le fonti delle schede della biblioteca consultate per la risposta. I link si aprono in una nuova scheda
 * del browser, senza dare alla pagina aperta accesso all'app; per sicurezza l'indirizzo si ricontrolla qui.
 */
export function MessageSources({ sources }: { sources: readonly KnowledgeSource[] }) {
  const safe = sources.filter((s) => sourceLicense(s.url) !== null)
  if (safe.length === 0) return null
  return (
    <p className="assistant__sources">
      <span title="Le schede della biblioteca che l'assistente ha letto prima di rispondere">Fonti consultate:</span>{' '}
      {safe.map((s, i) => (
        <span key={s.url}>
          {i > 0 && ' · '}
          <a href={s.url} target="_blank" rel="noopener noreferrer" title={`${s.url} (licenza ${s.license})`}>
            {s.title}
          </a>
        </span>
      ))}
    </p>
  )
}
