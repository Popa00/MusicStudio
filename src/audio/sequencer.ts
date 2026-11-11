import * as Tone from 'tone'
import { sustainedNotesAt } from '../music/chase'
import { eventsAtStep, type PlayTarget } from '../music/schedule'
import { absoluteStepAtTicks, stepSeconds } from '../music/timing'
import type { Project } from '../project/types'
import type { AudioGraph } from './graph/graph'
import type { Metronome } from './metronome'
import { safely } from './safety'

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
  // Il trasporto emette "start" sia al Play sia a ogni salto: il primo step dopo recupera le note in corso.
  let resumed = true
  const markResumed = () => {
    resumed = true
  }
  transport.on('start', markResumed)

  function playStep(time: number): void {
    const project = source.project()
    const step = absoluteStepAtTicks(transport.getTicksAtTime(time), transport.PPQ)
    const seconds = stepSeconds(project.bpm)
    const events = eventsAtStep(project, source.target(), step)
    if (resumed) {
      resumed = false
      safely(() => events.push(...sustainedNotesAt(project, source.target(), step)), 'note in corso')
    }
    // Un errore di un singolo strumento non deve mai fermare il resto della riproduzione.
    for (const event of events) {
      safely(() => graph.track(event.trackId)?.instrument.play(event, time, seconds))
    }
    if (metronome && source.metronome()) safely(() => metronome.tick(step, project.timeSignature, time))
    safely(() => source.onStep?.(step, time))
  }

  const id = transport.scheduleRepeat((time) => safely(() => playStep(time), 'passo del sequencer'), '16n', 0)

  return () => {
    transport.clear(id)
    transport.off('start', markResumed)
  }
}
