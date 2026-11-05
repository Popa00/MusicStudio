import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createEmptyProject } from '../../project/factory'
import { useProjectStore } from '../projectStore'
import { useUiStore } from '../uiStore'

vi.mock('../../audio/export/exportWav', () => ({ exportWav: vi.fn() }))

import { newProject } from './projectActions'
import { selectPattern } from './patternActions'
import { selectTrack } from './trackActions'

const uiInitial = useUiStore.getState()
const ui = () => useUiStore.getState()

beforeEach(() => {
  useUiStore.setState({ ...uiInitial, selectedNoteIds: ['a', 'b'] }, true)
})

describe('azzeramento della selezione note', () => {
  it('selectPattern azzera le note selezionate', () => {
    selectPattern('t1', 'p1')
    expect(ui().selectedNoteIds).toEqual([])
    expect(ui().selectedPatternId).toBe('p1')
  })
  it('selectTrack azzera le note selezionate', () => {
    selectTrack('t1')
    expect(ui().selectedNoteIds).toEqual([])
  })
  it('newProject azzera le note selezionate', () => {
    newProject({ create: () => createEmptyProject() } as Parameters<typeof newProject>[0])
    expect(ui().selectedNoteIds).toEqual([])
    expect(useProjectStore.getState().project.tracks).toEqual([])
  })
})
