import { loopLengthBars } from '../music/schedule'
import { stepsPerBar } from '../music/timing'
import { usePlaybackStore } from '../state/playbackStore'
import { useProjectStore } from '../state/projectStore'
import { currentPlayTarget } from '../state/playTarget'
import type { AudioGraph } from './graph/graph'
import { seekTransport } from './transport'

/**
 * Da dove far partire la musica: il punto scelto sulla riga delle battute, solo in modalità
 * "Brano" e solo se è dentro il brano (altrimenti dall'inizio).
 */
export function playbackStartStep(): number {
  const target = currentPlayTarget()
  if (target.mode !== 'song') return 0
  const { project } = useProjectStore.getState()
  const total = loopLengthBars(project, target) * stepsPerBar(project.timeSignature)
  const { startStep } = usePlaybackStore.getState()
  return startStep < total ? startStep : 0
}

/** Mentre la musica suona, ogni richiesta di salto (`seekTo`) la porta al punto di partenza scelto. */
export function bindSeek(graph: AudioGraph): () => void {
  return usePlaybackStore.subscribe((state, prev) => {
    if (state.seekRequest === prev.seekRequest || !state.isPlaying) return
    const step = playbackStartStep()
    // Le note lunghe (accordi, pad) del punto lasciato non devono continuare nel punto nuovo.
    for (const track of useProjectStore.getState().project.tracks) graph.track(track.id)?.instrument.releaseAll()
    seekTransport(step)
    state.setCurrentStep(step)
  })
}
