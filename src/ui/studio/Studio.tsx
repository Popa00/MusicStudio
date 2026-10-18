import { Arrangement } from '../arrangement/Arrangement'
import { BottomPanel } from '../editor/BottomPanel'
import { useComputerKeyboard } from '../keyboard/useComputerKeyboard'
import { TopBar } from '../project/TopBar'
import { TransportBar } from '../transport/TransportBar'
import { useAutosave } from './useAutosave'
import { useGlobalShortcuts } from './useGlobalShortcuts'

/** Schermata principale: progetto, trasporto, linea del tempo e pannello di modifica. */
export function Studio() {
  const autosaveFailed = useAutosave()
  useGlobalShortcuts()
  useComputerKeyboard()

  return (
    <>
      <TopBar autosaveFailed={autosaveFailed} />
      <TransportBar />
      <Arrangement />
      <BottomPanel />
    </>
  )
}
