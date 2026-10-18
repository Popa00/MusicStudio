import { useProjectStore } from './projectStore'
import { resolveSelection, type Selection } from './selection'
import { useUiStore } from './uiStore'

/** Traccia e pattern su cui l'utente sta lavorando. */
export function useSelection(): Selection {
  const project = useProjectStore((s) => s.project)
  const trackId = useUiStore((s) => s.selectedTrackId)
  const patternId = useUiStore((s) => s.selectedPatternId)
  return resolveSelection(project, trackId, patternId)
}
