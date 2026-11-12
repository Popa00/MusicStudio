import { Component, type ReactNode } from 'react'
import { clearAssistant } from '../../state/actions/assistantActions'
import { useUiStore } from '../../state/uiStore'

type Props = { children: ReactNode }
type State = { failed: boolean }

/**
 * Se il pannello dell'assistente si rompe mentre si disegna, si rompe solo lui:
 * il resto dell'app (brano, riproduzione, salvataggio) continua a funzionare.
 */
export class AssistantBoundary extends Component<Props, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  componentDidCatch(error: unknown) {
    console.error('Assistente:', error)
  }

  private reset = () => {
    clearAssistant()
    this.setState({ failed: false })
  }

  private close = () => {
    clearAssistant()
    useUiStore.getState().set({ assistantOpen: false })
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <aside className="assistant" aria-label="Assistente">
        <p className="assistant__note">L'assistente ha avuto un problema. Il tuo brano non è stato toccato.</p>
        <button className="button-small" onClick={this.reset}>Ricomincia la chat</button>
        <button className="button-small button-secondary" onClick={this.close}>Chiudi</button>
      </aside>
    )
  }
}
