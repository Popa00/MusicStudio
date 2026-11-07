import { beforeEach, describe, expect, it } from 'vitest'
import { createEmptyProject } from '../../project/factory'
import { toggleDrumStep } from '../../project/ops/drums'
import { findPattern, patternsOfTrack } from '../../project/ops/helpers'
import { addTrack } from '../../project/ops/tracks'
import { emptyHistory } from '../history'
import { useProjectStore } from '../projectStore'
import { useUiStore } from '../uiStore'
import { addedDrumRows, hideDrumRow, showDrumRow } from './drumRowActions'

const initialProject = useProjectStore.getState()
const initialUi = useUiStore.getState()
let trackId = ''
let patternId = ''
const congaHits = () => {
  const p = findPattern(useProjectStore.getState().project, patternId)
  return p?.kind === 'drums' ? p.steps.conga.filter((v) => v > 0).length : -1
}
const hit = (step: number) => useProjectStore.getState().apply((p) => toggleDrumStep(p, patternId, 'conga', step))

beforeEach(() => {
  const t = addTrack(createEmptyProject(), 'drums')
  trackId = t.trackId ?? ''
  patternId = patternsOfTrack(t.project, trackId)[0].id
  useProjectStore.setState({ ...initialProject, project: t.project, history: emptyHistory() }, true)
  useUiStore.setState({ ...initialUi, drumRows: {} }, true)
})

describe('showDrumRow', () => {
  it('aggiunge una percussione alla traccia', () => {
    showDrumRow(trackId, 'conga')
    expect(addedDrumRows(trackId)).toEqual(['conga'])
  })
  it('ignora i suoni di base e i doppioni', () => {
    showDrumRow(trackId, 'kick')
    showDrumRow(trackId, 'conga')
    showDrumRow(trackId, 'conga')
    expect(addedDrumRows(trackId)).toEqual(['conga'])
  })
  it('tiene separate le tracce', () => {
    showDrumRow(trackId, 'conga')
    expect(addedDrumRows('altra')).toEqual([])
  })
})

describe('hideDrumRow', () => {
  it("toglie la riga dall'elenco e spegne i suoi colpi", () => {
    showDrumRow(trackId, 'conga')
    hit(2)
    hideDrumRow(trackId, patternId, 'conga')
    expect(addedDrumRows(trackId)).toEqual([])
    expect(congaHits()).toBe(0)
  })
  it('è un solo passo di annulla che riporta tutti i colpi', () => {
    showDrumRow(trackId, 'conga')
    hit(2)
    hit(6)
    hideDrumRow(trackId, patternId, 'conga')
    useProjectStore.getState().undo()
    expect(congaHits()).toBe(2)
  })
  it('su una riga vuota non aggiunge passi di annulla', () => {
    showDrumRow(trackId, 'conga')
    hideDrumRow(trackId, patternId, 'conga')
    expect(useProjectStore.getState().history.past).toHaveLength(0)
  })
  it('ignora i suoni di base: colpi e progetto restano', () => {
    useProjectStore.getState().apply((p) => toggleDrumStep(p, patternId, 'kick', 0))
    const before = useProjectStore.getState().project
    hideDrumRow(trackId, patternId, 'kick')
    expect(useProjectStore.getState().project).toBe(before)
  })
  it('lascia le altre righe aggiunte', () => {
    showDrumRow(trackId, 'conga')
    showDrumRow(trackId, 'perc')
    hideDrumRow(trackId, patternId, 'conga')
    expect(addedDrumRows(trackId)).toEqual(['perc'])
  })
})
