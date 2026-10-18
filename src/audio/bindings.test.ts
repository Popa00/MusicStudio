import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { usePlaybackStore } from '../state/playbackStore'
import { useProjectStore } from '../state/projectStore'
import { bindStoresToEngine } from './bindings'
import * as transport from './transport'

vi.mock('./transport', () => ({
  applyTempo: vi.fn(),
  applyTimeSignature: vi.fn(),
  startTransport: vi.fn(),
  stopTransport: vi.fn(),
}))

const initialProject = useProjectStore.getState()
const initialPlayback = usePlaybackStore.getState()
let unbind: () => void

beforeEach(() => {
  useProjectStore.setState(initialProject, true)
  usePlaybackStore.setState(initialPlayback, true)
  vi.clearAllMocks()
  unbind = bindStoresToEngine()
})
afterEach(() => unbind())

describe('bindStoresToEngine', () => {
  it('applica subito tempo e indicazione di tempo dello stato iniziale', () => {
    expect(transport.applyTempo).toHaveBeenCalledWith(initialProject.bpm)
    expect(transport.applyTimeSignature).toHaveBeenCalledWith(initialProject.timeSignature)
  })
  it('applica il tempo quando cambia il BPM', () => {
    useProjectStore.getState().setBpm(150)
    expect(transport.applyTempo).toHaveBeenLastCalledWith(150)
  })
  it("applica la nuova indicazione di tempo quando cambia", () => {
    const ts = { beatsPerBar: 3, beatUnit: 4 } as const
    useProjectStore.setState({ timeSignature: ts })
    expect(transport.applyTimeSignature).toHaveBeenLastCalledWith(ts)
  })
  it('non riapplica il tempo se cambia altro nel progetto', () => {
    vi.clearAllMocks()
    useProjectStore.getState().toggleDrumStep('kick', 1)
    expect(transport.applyTempo).not.toHaveBeenCalled()
    expect(transport.applyTimeSignature).not.toHaveBeenCalled()
  })
  it('avvia il trasporto quando isPlaying diventa true', () => {
    usePlaybackStore.getState().setPlaying(true)
    expect(transport.startTransport).toHaveBeenCalledTimes(1)
    expect(transport.stopTransport).not.toHaveBeenCalled()
  })
  it('ferma il trasporto e azzera lo step quando isPlaying diventa false', () => {
    usePlaybackStore.getState().setPlaying(true)
    usePlaybackStore.getState().setCurrentStep(7)
    usePlaybackStore.getState().setPlaying(false)
    expect(transport.stopTransport).toHaveBeenCalledTimes(1)
    expect(usePlaybackStore.getState().currentStep).toBeNull()
  })
  it('non fa nulla se cambia solo currentStep', () => {
    usePlaybackStore.getState().setCurrentStep(2)
    expect(transport.startTransport).not.toHaveBeenCalled()
    expect(transport.stopTransport).not.toHaveBeenCalled()
  })
  it('dopo lo scollegamento non reagisce più ai cambiamenti', () => {
    unbind()
    vi.clearAllMocks()
    useProjectStore.getState().setBpm(200)
    usePlaybackStore.getState().setPlaying(true)
    expect(transport.applyTempo).not.toHaveBeenCalled()
    expect(transport.startTransport).not.toHaveBeenCalled()
  })
})
