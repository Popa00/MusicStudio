import { BASE_DRUM_VOICES, DRUM_VOICES, type DrumVoiceId } from '../../music/drumPattern'
import { clearDrumRow } from '../../project/ops/drums'
import { moveDrumRowToTrack } from '../../project/ops/percussion'
import type { DrumPatternData } from '../../project/types'
import { useProjectStore } from '../projectStore'
import { useUiStore } from '../uiStore'
import { selectTrack } from './trackActions'

const isBase = (voice: DrumVoiceId) => (BASE_DRUM_VOICES as readonly DrumVoiceId[]).includes(voice)

/**
 * Righe da mostrare nella griglia: i 5 suoni di base, quelli aggiunti con "+ Aggiungi suono"
 * e qualunque suono abbia colpi nel pattern (così un colpo non resta mai nascosto).
 */
export function visibleDrumVoices(pattern: DrumPatternData, added: DrumVoiceId[]): DrumVoiceId[] {
  return DRUM_VOICES.filter((v) => isBase(v) || added.includes(v) || pattern.steps[v].some((s) => s > 0))
}

export function addedDrumRows(trackId: string): DrumVoiceId[] {
  return useUiStore.getState().drumRows[trackId] ?? []
}

export function showDrumRow(trackId: string, voice: DrumVoiceId): void {
  const rows = addedDrumRows(trackId)
  if (isBase(voice) || rows.includes(voice)) return
  useUiStore.getState().set({ drumRows: { ...useUiStore.getState().drumRows, [trackId]: [...rows, voice] } })
}

/** Nasconde una percussione aggiunta; se ha colpi nel pattern, li spegne (Ctrl+Z li riporta). */
export function hideDrumRow(trackId: string, patternId: string, voice: DrumVoiceId): void {
  if (isBase(voice)) return
  const store = useProjectStore.getState()
  store.commit(clearDrumRow(store.project, patternId, voice))
  const rows = addedDrumRows(trackId).filter((v) => v !== voice)
  useUiStore.getState().set({ drumRows: { ...useUiStore.getState().drumRows, [trackId]: rows } })
}

/**
 * Sposta un suono della batteria su una traccia tutta sua (con effetti e mixer propri).
 * Restituisce false se il progetto è pieno (troppe tracce, pattern o blocchi).
 */
export function moveDrumRowToOwnTrack(trackId: string, patternId: string, voice: DrumVoiceId, label: string): boolean {
  const store = useProjectStore.getState()
  const result = moveDrumRowToTrack(store.project, patternId, voice, label)
  if (!result.trackId) return false
  store.commit(result.project)
  const rows = addedDrumRows(trackId).filter((v) => v !== voice)
  useUiStore.getState().set({ drumRows: { ...useUiStore.getState().drumRows, [trackId]: rows } })
  selectTrack(result.trackId)
  return true
}
