import { clearPattern, setDrumStepVelocity, toggleDrumStep } from '../../project/ops/drums'
import { addPattern, duplicatePattern, removePattern, renamePattern } from '../../project/ops/patterns'
import { setPatternLength } from '../../project/ops/patternLength'
import type { DrumVoiceId } from '../../music/drumPattern'
import { useProjectStore } from '../projectStore'
import { useUiStore } from '../uiStore'
import { showAlert } from '../browserDialogs'

const store = () => useProjectStore.getState()

export function selectPattern(trackId: string, patternId: string): void {
  useUiStore.getState().set({ selectedTrackId: trackId, selectedPatternId: patternId, selectedNoteIds: [] })
}

export function newPattern(trackId: string): void {
  const result = addPattern(store().project, trackId)
  if (!result.patternId) return
  store().commit(result.project)
  selectPattern(trackId, result.patternId)
}

export function copyPattern(trackId: string, patternId: string): void {
  const result = duplicatePattern(store().project, patternId)
  if (!result.patternId) return
  store().commit(result.project)
  selectPattern(trackId, result.patternId)
}

export function setPatternName(patternId: string, name: string): void {
  store().commit(renamePattern(store().project, patternId, name), `pattern-name:${patternId}`)
}

export function setPatternBars(patternId: string, bars: number): void {
  const current = store().project
  const next = setPatternLength(current, patternId, bars)
  if (next === current) {
    showAlert('Non c\'è spazio: allungando il pattern i suoi blocchi finirebbero sopra altri blocchi del brano. Sposta prima i blocchi successivi.')
    return
  }
  store().commit(next)
}

export function emptyPattern(patternId: string): void {
  store().commit(clearPattern(store().project, patternId))
}

export function deletePattern(patternId: string): void {
  store().commit(removePattern(store().project, patternId))
}

export function toggleStep(patternId: string, voice: DrumVoiceId, step: number): void {
  store().commit(toggleDrumStep(store().project, patternId, voice, step))
}

/** `dragId` unisce in un solo "annulla" tutto il trascinamento sulla striscia delle intensità. */
export function setStepVelocity(patternId: string, voice: DrumVoiceId, step: number, velocity: number, dragId?: string): void {
  store().commit(setDrumStepVelocity(store().project, patternId, voice, step, velocity), dragId)
}
