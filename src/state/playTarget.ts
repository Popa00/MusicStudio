import type { PlayTarget } from '../music/schedule'
import { useProjectStore } from './projectStore'
import { resolvePlayTarget } from './selection'
import { useUiStore } from './uiStore'

/** Cosa suonare adesso, in base a modalità (brano/pattern) e selezione. */
export function currentPlayTarget(): PlayTarget {
  const { project } = useProjectStore.getState()
  const ui = useUiStore.getState()
  return resolvePlayTarget(project, ui.playMode, ui.selectedTrackId, ui.selectedPatternId)
}
