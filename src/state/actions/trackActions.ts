import type { DrumVoiceId } from '../../music/drumPattern'
import { addPercussionTrack, updatePercussion } from '../../project/ops/percussion'
import { findPreset } from '../../project/synthPresets'
import { addTrack, removeTrack, renameTrack, updateMixer, updateSynth } from '../../project/ops/tracks'
import type { MixerSettings, PercussionSound, SynthSettings, TrackKind } from '../../project/types'
import { useProjectStore } from '../projectStore'
import { useUiStore } from '../uiStore'

const store = () => useProjectStore.getState()

export function selectTrack(trackId: string): void {
  useUiStore.getState().set({ selectedTrackId: trackId, selectedPatternId: null, selectedClipId: null, selectedNoteIds: [] })
}

export function createTrack(kind: TrackKind): void {
  const result = addTrack(store().project, kind)
  if (!result.trackId) return
  store().commit(result.project)
  selectTrack(result.trackId)
  useUiStore.getState().set({ panel: 'editor' })
}

export function deleteTrack(trackId: string): void {
  store().commit(removeTrack(store().project, trackId))
}

export function setTrackName(trackId: string, name: string): void {
  store().commit(renameTrack(store().project, trackId, name), `name:${trackId}`)
}

export function setMixer(trackId: string, changes: Partial<MixerSettings>): void {
  // Solo i cursori (volume, pan) uniscono le modifiche rapide; muto e solo sono un passo ciascuno.
  const continuous = 'volumeDb' in changes || 'pan' in changes
  const key = continuous ? `mixer:${trackId}:${Object.keys(changes).join(',')}` : undefined
  store().commit(updateMixer(store().project, trackId, changes), key)
}

export function setSynth(trackId: string, changes: Partial<SynthSettings>): void {
  const key = `synth:${trackId}:${Object.keys(changes).join(',')}`
  store().commit(updateSynth(store().project, trackId, changes), key)
}

export function applyPreset(trackId: string, presetName: string): void {
  const preset = findPreset(presetName)
  if (preset) store().commit(updateSynth(store().project, trackId, preset.settings))
}

export function setPercussion(trackId: string, changes: Partial<PercussionSound>): void {
  const key = `percussion:${trackId}:${Object.keys(changes).join(',')}`
  store().commit(updatePercussion(store().project, trackId, changes), key)
}

/** Nuova traccia con un solo suono di batteria, da suonare come uno strumento. */
export function createPercussionTrack(voice: DrumVoiceId, label: string): void {
  const result = addPercussionTrack(store().project, voice, label)
  if (!result.trackId) return
  store().commit(result.project)
  selectTrack(result.trackId)
  useUiStore.getState().set({ panel: 'editor' })
}
