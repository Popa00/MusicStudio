import { usePlaybackStore } from '../state/playbackStore'
import { useProjectStore } from '../state/projectStore'
import { applyTempo, applyTimeSignature, startTransport, stopTransport } from './transport'

/**
 * Collega lo stato al motore audio: la UI cambia lo stato, qui il motore reagisce.
 * Restituisce una funzione per scollegare.
 */
export function bindStoresToEngine(): () => void {
  const project = useProjectStore.getState()
  applyTempo(project.bpm)
  applyTimeSignature(project.timeSignature)

  const unsubscribeProject = useProjectStore.subscribe((state, prev) => {
    if (state.bpm !== prev.bpm) applyTempo(state.bpm)
    if (state.timeSignature !== prev.timeSignature) applyTimeSignature(state.timeSignature)
  })

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
    unsubscribePlayback()
  }
}
