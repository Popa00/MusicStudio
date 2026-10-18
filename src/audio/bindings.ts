import { loopLengthBars } from '../music/schedule'
import { usePlaybackStore } from '../state/playbackStore'
import { useProjectStore } from '../state/projectStore'
import { currentPlayTarget } from '../state/playTarget'
import { useUiStore } from '../state/uiStore'
import type { AudioGraph } from './graph/graph'
import { applyLoop, applyTempo, applyTimeSignature, startTransport, stopTransport } from './transport'

let loopBars = 0

/** Aggiorna la lunghezza del loop solo se è cambiata (lo stato UI cambia spesso). */
function refreshLoop(force = false): void {
  const bars = loopLengthBars(useProjectStore.getState().project, currentPlayTarget())
  if (bars === loopBars && !force) return
  loopBars = bars
  applyLoop(bars)
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
    if (state.isPlaying === prev.isPlaying) return
    if (state.isPlaying) {
      startTransport()
    } else {
      stopTransport()
      state.setCurrentStep(null)
    }
  })

  return () => {
    unsubscribeProject()
    unsubscribeUi()
    unsubscribePlayback()
  }
}
