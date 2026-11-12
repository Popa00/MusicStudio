import { beforeEach, describe, expect, it } from 'vitest'
import { stepsPerBar } from '../../music/timing'
import { createEmptyProject } from '../../project/factory'
import { addClip } from '../../project/ops/clips'
import { patternsOfTrack } from '../../project/ops/helpers'
import { setPatternLength } from '../../project/ops/patternLength'
import { addTrack } from '../../project/ops/tracks'
import { usePlaybackStore } from '../playbackStore'
import { useProjectStore } from '../projectStore'
import { useUiStore } from '../uiStore'
import { loopClip, setLoop, toggleLoop } from './loopActions'

const playbackInitial = usePlaybackStore.getState()
const uiInitial = useUiStore.getState()
let clipId = ''

beforeEach(() => {
  usePlaybackStore.setState(playbackInitial, true)
  useUiStore.setState(uiInitial, true)
  const t = addTrack(createEmptyProject(), 'drums')
  const trackId = t.trackId as string
  const patternId = patternsOfTrack(t.project, trackId)[0].id
  const added = addClip(setPatternLength(t.project, patternId, 2), trackId, patternId, 4)
  clipId = added.clipId as string
  useProjectStore.getState().replace(added.project)
})

const pb = () => usePlaybackStore.getState()

describe('toggleLoop', () => {
  it('la prima accensione sceglie la parte di default dal punto di partenza', () => {
    const bar = stepsPerBar(useProjectStore.getState().project.timeSignature)
    pb().setStartStep(bar)
    toggleLoop()
    expect(pb().loopOn).toBe(true)
    expect(pb().loopRange).toEqual({ start: 1, end: 5 })
  })
  it('con un blocco selezionato ripete le sue battute', () => {
    useUiStore.getState().set({ selectedClipId: clipId })
    toggleLoop()
    expect(pb().loopRange).toEqual({ start: 4, end: 6 })
  })
  it('premuto di nuovo si spegne ma ricorda la parte', () => {
    toggleLoop()
    toggleLoop()
    expect(pb().loopOn).toBe(false)
    expect(pb().loopRange).toEqual({ start: 0, end: 4 })
  })
  it('riacceso riusa la parte ricordata invece di sceglierne una nuova', () => {
    setLoop({ start: 2, end: 3 })
    toggleLoop()
    useUiStore.getState().set({ selectedClipId: clipId })
    toggleLoop()
    expect(pb().loopOn).toBe(true)
    expect(pb().loopRange).toEqual({ start: 2, end: 3 })
  })
  it('passa alla modalità brano', () => {
    useUiStore.getState().set({ playMode: 'pattern' })
    toggleLoop()
    expect(useUiStore.getState().playMode).toBe('song')
  })
  it('in modalità pattern con loopOn già vero lo riaccende e torna al brano', () => {
    toggleLoop()
    useUiStore.getState().set({ playMode: 'pattern' })
    toggleLoop()
    expect(pb().loopOn).toBe(true)
    expect(useUiStore.getState().playMode).toBe('song')
  })
})

describe('loopClip', () => {
  it('ripete le battute del blocco e accende la ripetizione', () => {
    loopClip(clipId)
    expect(pb().loopOn).toBe(true)
    expect(pb().loopRange).toEqual({ start: 4, end: 6 })
  })
  it('con un id inesistente non fa nulla', () => {
    loopClip('non-esiste')
    expect(pb().loopOn).toBe(false)
    expect(pb().loopRange).toBeNull()
  })
})

describe('setLoop', () => {
  it('imposta la parte, accende e passa al brano', () => {
    useUiStore.getState().set({ playMode: 'pattern' })
    setLoop({ start: 1, end: 3 })
    expect(pb().loopRange).toEqual({ start: 1, end: 3 })
    expect(pb().loopOn).toBe(true)
    expect(useUiStore.getState().playMode).toBe('song')
  })
  it('pulisce una parte non valida', () => {
    setLoop({ start: 3, end: 1 })
    expect(pb().loopRange).toEqual({ start: 3, end: 4 })
  })
  it('se era già accesa resta accesa e cambia solo la parte', () => {
    setLoop({ start: 1, end: 3 })
    setLoop({ start: 5, end: 7 })
    expect(pb().loopOn).toBe(true)
    expect(pb().loopRange).toEqual({ start: 5, end: 7 })
  })
})
