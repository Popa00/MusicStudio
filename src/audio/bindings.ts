import { activeLoop } from '../music/loopRegion'
import { activeLoopRange, usePlaybackStore } from '../state/playbackStore'
import { useProjectStore } from '../state/projectStore'
import { currentPlayTarget } from '../state/playTarget'
import { useUiStore } from '../state/uiStore'
import type { AudioGraph } from './graph/graph'
import { resetReported } from './safety'
import { bindSeek, playbackStartStep } from './seek'
import { applyLoop, applyTempo, applyTimeSignature, startTransport, stopTransport } from './transport'

let loopKey = ''

/** Aggiorna il loop solo se è cambiato (lo stato UI e quello della riproduzione cambiano spesso). */
function refreshLoop(force = false): void {
  const loop = activeLoop(useProjectStore.getState().project, currentPlayTarget(), activeLoopRange(usePlaybackStore.getState()))
  const key = `${loop.start}-${loop.end}`
  if (key === loopKey && !force) return
  loopKey = key
  applyLoop(loop)
}

/**
 * Collega lo stato al motore audio: la UI cambia lo stato, qui il motore reagisce.
 * Restituisce una funzione per scollegare.
 */
export function bindStoresToEngine(graph: AudioGraph): () => void {
  const { project } = useProjectStore.getState()
  applyTempo(project.bpm)
  applyTimeSignature(project.timeSignature)
  refreshLoop(true)

  const unsubscribeProject = useProjectStore.subscribe((state, prev) => {
    if (state.project === prev.project) return
    graph.sync(state.project)
    if (state.project.bpm !== prev.project.bpm) applyTempo(state.project.bpm)
    const tsChanged = state.project.timeSignature !== prev.project.timeSignature
    if (tsChanged) applyTimeSignature(state.project.timeSignature)
    refreshLoop(tsChanged)
  })

  const unsubscribeUi = useUiStore.subscribe(() => refreshLoop())

  const unsubscribePlayback = usePlaybackStore.subscribe((state, prev) => {
    if (state.loopOn !== prev.loopOn || state.loopRange !== prev.loopRange) refreshLoop()
    if (state.isPlaying === prev.isPlaying) return
    if (state.isPlaying) {
      graph.finishSilence()
      resetReported()
      startTransport(playbackStartStep())
    } else {
      stopTransport()
      graph.silence()
      state.setCurrentStep(null)
    }
  })

  const unsubscribeSeek = bindSeek(graph)

  return () => {
    unsubscribeSeek()
    unsubscribeProject()
    unsubscribeUi()
    unsubscribePlayback()
  }
}
