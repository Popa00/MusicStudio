import * as Tone from 'tone'
import { eventsAtStep, type PlayTarget } from '../music/schedule'
import { absoluteStepAtTicks, stepSeconds } from '../music/timing'
import type { Project } from '../project/types'
import type { AudioGraph } from './graph/graph'
import type { Metronome } from './metronome'

/** Da dove il sequencer legge cosa suonare: dallo stato (dal vivo) o da un progetto fisso (export). */
export interface SequencerSource {
  project: () => Project
  target: () => PlayTarget
  metronome: () => boolean
  onStep?: (step: number, time: number) => void
}

/**
 * Ogni sedicesimo calcola gli eventi di quello step e li fa suonare agli strumenti delle tracce.
 * Restituisce una funzione che rimuove la programmazione.
 */
export function scheduleSequencer(graph: AudioGraph, source: SequencerSource, metronome: Metronome | null): () => void {
  const transport = Tone.getTransport()

  const id = transport.scheduleRepeat(
    (time) => {
      const project = source.project()
      const step = absoluteStepAtTicks(transport.getTicksAtTime(time), transport.PPQ)
      const seconds = stepSeconds(project.bpm)
      for (const event of eventsAtStep(project, source.target(), step)) {
        graph.track(event.trackId)?.instrument.play(event, time, seconds)
      }
      if (metronome && source.metronome()) metronome.tick(step, project.timeSignature, time)
      source.onStep?.(step, time)
    },
    '16n',
    0,
  )

  return () => transport.clear(id)
}
