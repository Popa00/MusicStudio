import { clearAssistant, stopAssistant } from '../../state/actions/assistantActions'
import { useAssistantStore } from '../../state/assistantStore'
import { useUiStore } from '../../state/uiStore'
import { noFocus } from '../keepFocusOnMouseDown'
import { AssistantInput } from './AssistantInput'
import { MessageList } from './MessageList'
import './assistant.css'

/** Pannello laterale della chat con l'assistente: spiega e consiglia, non modifica mai il brano. */
export function AssistantPanel() {
  const model = useAssistantStore((s) => s.model)
  const hasMessages = useAssistantStore((s) => s.messages.length > 0)
  const close = () => {
    // Chiudendo si ferma anche la risposta: il modello non tiene occupata la scheda video per niente.
    stopAssistant()
    useUiStore.getState().set({ assistantOpen: false })
  }

  return (
    <aside className="assistant" aria-label="Assistente">
      <header className="assistant__header">
        <h2>Assistente</h2>
        {model && <span className="assistant__model" title="Il modello che risponde, sul tuo PC">{model}</span>}
        <button className="button-small button-secondary" onClick={clearAssistant} disabled={!hasMessages} title="Cancella la conversazione" {...noFocus}>
          Nuova chat
        </button>
        <button className="button-small button-secondary" onClick={close} aria-label="Chiudi l'assistente" {...noFocus}>
          ✕
        </button>
      </header>
      <MessageList />
      <AssistantInput />
      <p className="assistant__note">Risponde un modello che gira sul tuo PC: vede il tuo brano, ma può sbagliare.</p>
    </aside>
  )
}
