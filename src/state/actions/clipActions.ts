import { addClip, duplicateClip, moveClip, removeClip } from '../../project/ops/clips'
import { useProjectStore } from '../projectStore'
import { resolveSelection } from '../selection'
import { useUiStore } from '../uiStore'

const store = () => useProjectStore.getState()
const ui = () => useUiStore.getState()

/** Mette sulla linea del tempo il pattern selezionato di quella traccia. */
export function placeClip(trackId: string, startBar: number): void {
  const { pattern } = resolveSelection(store().project, trackId, ui().selectedPatternId)
  if (!pattern) return
  const result = addClip(store().project, trackId, pattern.id, startBar)
  if (!result.clipId) return
  store().commit(result.project)
  ui().set({ selectedTrackId: trackId, selectedPatternId: pattern.id, selectedClipId: result.clipId, selectedNoteIds: [] })
}

/** Selezionare un blocco apre il suo pattern nell'editor. */
export function selectClip(clipId: string): void {
  const clip = store().project.clips.find((c) => c.id === clipId)
  if (!clip) return
  ui().set({ selectedTrackId: clip.trackId, selectedPatternId: clip.patternId, selectedClipId: clipId, selectedNoteIds: [], panel: 'editor' })
}

export function moveClipTo(clipId: string, startBar: number, dragId: string): void {
  store().commit(moveClip(store().project, clipId, startBar), dragId)
}

export function deleteClip(clipId: string): void {
  store().commit(removeClip(store().project, clipId))
  if (ui().selectedClipId === clipId) ui().set({ selectedClipId: null })
}

export function copyClip(clipId: string): void {
  const result = duplicateClip(store().project, clipId)
  if (!result.clipId) return
  store().commit(result.project)
  ui().set({ selectedClipId: result.clipId, selectedNoteIds: [] })
}
