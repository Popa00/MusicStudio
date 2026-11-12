import { useUiStore } from '../../state/uiStore'
import { Arrangement } from '../arrangement/Arrangement'
import { AssistantBoundary } from '../assistant/AssistantBoundary'
import { AssistantPanel } from '../assistant/AssistantPanel'
import { BottomPanel } from '../editor/BottomPanel'
import { useComputerKeyboard } from '../keyboard/useComputerKeyboard'
import { TopBar } from '../project/TopBar'
import { TransportBar } from '../transport/TransportBar'
import { useAutosave } from './useAutosave'
import { useGlobalShortcuts } from './useGlobalShortcuts'

/** Schermata principale: progetto, trasporto, linea del tempo, pannello di modifica e (se aperto) l'assistente. */
export function Studio() {
  const autosaveFailed = useAutosave()
  useGlobalShortcuts()
  useComputerKeyboard()
  const assistantOpen = useUiStore((s) => s.assistantOpen)

  return (
    <>
      <TopBar autosaveFailed={autosaveFailed} />
      <TransportBar />
      <Arrangement />
      <BottomPanel />
      {assistantOpen && (
        <AssistantBoundary>
          <AssistantPanel />
        </AssistantBoundary>
      )}
    </>
  )
}
