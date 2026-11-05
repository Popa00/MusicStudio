import { beforeEach, describe, expect, it } from 'vitest'
import { createEmptyProject } from '../../project/factory'
import { patternsOfTrack } from '../../project/ops/helpers'
import { addTrack } from '../../project/ops/tracks'
import { emptyHistory } from '../history'
import { useProjectStore } from '../projectStore'
import { useUiStore } from '../uiStore'
import { copyClip, placeClip, selectClip } from './clipActions'

const projectInitial = useProjectStore.getState()
const uiInitial = useUiStore.getState()
const ui = () => useUiStore.getState()

function setup() {
  const t = addTrack(createEmptyProject(), 'synth')
  const trackId = t.trackId ?? ''
  useProjectStore.setState({ ...projectInitial, project: t.project, history: emptyHistory() }, true)
  useUiStore.setState({ ...uiInitial, selectedTrackId: trackId, selectedPatternId: patternsOfTrack(t.project, trackId)[0].id }, true)
  return trackId
}

beforeEach(() => useUiStore.setState({ ...uiInitial }, true))

describe('selezione dei blocchi e note selezionate', () => {
  it('placeClip azzera la selezione delle note', () => {
    const trackId = setup()
    ui().set({ selectedNoteIds: ['a', 'b'] })
    placeClip(trackId, 0)
    expect(ui().selectedClipId).not.toBeNull()
    expect(ui().selectedNoteIds).toEqual([])
  })
  it('selectClip azzera la selezione delle note e apre l\'editor', () => {
    const trackId = setup()
    placeClip(trackId, 0)
    const clipId = ui().selectedClipId ?? ''
    ui().set({ selectedNoteIds: ['a'], selectedClipId: null, panel: 'mixer' })
    selectClip(clipId)
    expect(ui().selectedClipId).toBe(clipId)
    expect(ui().selectedNoteIds).toEqual([])
    expect(ui().panel).toBe('editor')
  })
  it('selectClip con un id inesistente non cambia la selezione delle note', () => {
    setup()
    ui().set({ selectedNoteIds: ['a'] })
    selectClip('manca')
    expect(ui().selectedNoteIds).toEqual(['a'])
  })
  it('copyClip azzera la selezione delle note', () => {
    const trackId = setup()
    placeClip(trackId, 0)
    ui().set({ selectedNoteIds: ['a'] })
    copyClip(ui().selectedClipId ?? '')
    expect(ui().selectedNoteIds).toEqual([])
  })
})
