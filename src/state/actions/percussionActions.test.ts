import { beforeEach, describe, expect, it } from 'vitest'
import { createEmptyProject } from '../../project/factory'
import { toggleDrumStep } from '../../project/ops/drums'
import { patternsOfTrack } from '../../project/ops/helpers'
import { addTrack } from '../../project/ops/tracks'
import { emptyHistory } from '../history'
import { useProjectStore } from '../projectStore'
import { useUiStore } from '../uiStore'
import { addedDrumRows, moveDrumRowToOwnTrack, showDrumRow } from './drumRowActions'
import { lockedScale } from './scaleLockActions'
import { createPercussionTrack, setPercussion } from './trackActions'

const initialProject = useProjectStore.getState()
const initialUi = useUiStore.getState()
const s = () => useProjectStore.getState()
const ui = () => useUiStore.getState()
let trackId = ''
let patternId = ''

beforeEach(() => {
  const t = addTrack(createEmptyProject(), 'drums')
  trackId = t.trackId ?? ''
  patternId = patternsOfTrack(t.project, trackId)[0].id
  const p = toggleDrumStep(t.project, patternId, 'conga', 2)
  useProjectStore.setState({ ...initialProject, project: p, history: emptyHistory() }, true)
  useUiStore.setState({ ...initialUi, drumRows: {} }, true)
})

describe('moveDrumRowToOwnTrack', () => {
  it('crea la traccia, la seleziona e toglie la riga dalle righe aggiunte', () => {
    showDrumRow(trackId, 'conga')
    showDrumRow(trackId, 'perc')
    expect(moveDrumRowToOwnTrack(trackId, patternId, 'conga', 'Conga')).toBe(true)
    const created = s().project.tracks[1]
    expect(created.kind).toBe('percussion')
    expect(ui().selectedTrackId).toBe(created.id)
    expect(addedDrumRows(trackId)).toEqual(['perc'])
  })
  it('è un solo passo di annulla', () => {
    moveDrumRowToOwnTrack(trackId, patternId, 'conga', 'Conga')
    expect(s().history.past).toHaveLength(1)
    s().undo()
    expect(s().project.tracks).toHaveLength(1)
  })
  it('se non si può (pattern inesistente) restituisce false e non cambia nulla', () => {
    showDrumRow(trackId, 'conga')
    const before = s().project
    expect(moveDrumRowToOwnTrack(trackId, 'manca', 'conga', 'Conga')).toBe(false)
    expect(s().project).toBe(before)
    expect(s().history.past).toHaveLength(0)
    expect(addedDrumRows(trackId)).toEqual(['conga'])
  })
})

describe('createPercussionTrack e setPercussion', () => {
  it('crea la traccia, la seleziona e apre l\'editor', () => {
    createPercussionTrack('shaker', 'Shaker')
    const created = s().project.tracks[1]
    expect(created.name).toBe('Shaker')
    expect(ui().selectedTrackId).toBe(created.id)
    expect(ui().panel).toBe('editor')
  })
  it('setPercussion cambia i valori; fuori range non aggiunge passi di annulla', () => {
    createPercussionTrack('shaker', 'Shaker')
    const id = s().project.tracks[1].id
    const steps = s().history.past.length
    setPercussion(id, { tune: 99 })
    expect(s().history.past).toHaveLength(steps)
    setPercussion(id, { tune: 4 })
    const t = s().project.tracks[1]
    expect(t.kind === 'percussion' && t.sound.tune).toBe(4)
  })
})

describe('lockedScale con traccia percussione', () => {
  it('è null quando la traccia selezionata è una percussione', () => {
    expect(s().project.scale.type).not.toBe('none')
    createPercussionTrack('conga', 'Conga')
    expect(lockedScale()).toBeNull()
  })
  it('torna la scala quando si seleziona una traccia non percussione', () => {
    createPercussionTrack('conga', 'Conga')
    useUiStore.getState().set({ selectedTrackId: trackId })
    expect(lockedScale()).toEqual(s().project.scale)
  })
})
