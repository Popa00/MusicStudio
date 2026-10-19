import * as Tone from 'tone'
import { usePlaybackStore } from '../state/playbackStore'
import { useProjectStore } from '../state/projectStore'
import { currentPlayTarget } from '../state/playTarget'
import { useUiStore } from '../state/uiStore'
import { bindStoresToEngine } from './bindings'
import { createGraph, type AudioGraph } from './graph/graph'
import { createMetronome } from './metronome'
import { configureAudioContext } from './context'
import { safely } from './safety'
import { scheduleSequencer } from './sequencer'
import { stopTransport } from './transport'

interface LiveEngine {
  graph: AudioGraph
  teardown: () => void
}

let live: LiveEngine | null = null

/** Il browser permette l'audio solo dopo un gesto dell'utente (click, tasto). */
export async function startAudio(): Promise<void> {
  configureAudioContext()
  await Tone.start()
  live ??= initEngine()
}

/** Ferma il motore e libera tutte le risorse audio. */
export function stopAudioEngine(): void {
  live?.teardown()
  live = null
}

export function isAudioRunning(): boolean {
  return Tone.getContext().state === 'running'
}

/** Il motore dal vivo, se avviato (per suonare note di prova e leggere i livelli). */
export function liveGraph(): AudioGraph | null {
  return live?.graph ?? null
}

function onStep(step: number, time: number): void {
  // La grafica si aggiorna quando il suono esce davvero; con la scheda nascosta non si disegna.
  if (document.hidden) return
  Tone.getDraw().schedule(() => safely(() => usePlaybackStore.getState().setCurrentStep(step), 'aggiornamento grafico'), time)
}

/** Se qualcosa fallisce a metà, libera quanto già creato: un nuovo tentativo riparte da zero. */
function initEngine(): LiveEngine {
  const cleanups: Array<() => void> = []
  const teardown = () => {
    for (const cleanup of cleanups.reverse()) cleanup()
  }
  try {
    const graph = createGraph(useProjectStore.getState().project)
    cleanups.push(graph.dispose)
    const metronome = createMetronome(graph.master.input)
    cleanups.push(metronome.dispose)
    const source = {
      project: () => useProjectStore.getState().project,
      target: currentPlayTarget,
      metronome: () => useUiStore.getState().metronome,
      onStep,
    }
    cleanups.push(scheduleSequencer(graph, source, metronome))
    cleanups.push(bindStoresToEngine(graph))
    cleanups.push(stopTransport)
    return { graph, teardown }
  } catch (error) {
    teardown()
    throw error
  }
}

// Sviluppo: quando Vite ricarica questo modulo (o gli store), ricollega il motore da capo.
if (import.meta.hot) {
  import.meta.hot.dispose((data) => {
    data.wasRunning = live !== null
    stopAudioEngine()
  })
  if (import.meta.hot.data.wasRunning) live = initEngine()
}
