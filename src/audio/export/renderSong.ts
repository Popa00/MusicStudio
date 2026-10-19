import * as Tone from 'tone'
import { songLengthBars } from '../../project/ops/clips'
import { LIMITS } from '../../project/limits'
import type { Project } from '../../project/types'
import { barSeconds } from '../../music/timing'
import { createGraph, type AudioGraph } from '../graph/graph'
import { guardContextTimeouts } from '../safety'
import { scheduleSequencer } from '../sequencer'

/** Frequenza fissa: con schede audio a 96/192 kHz la memoria dell'export esploderebbe. */
const EXPORT_SAMPLE_RATE = 44100
const MIN_TAIL_SECONDS = 2
const MAX_TAIL_SECONDS = 10

/** Secondi in più alla fine, per far sfumare riverberi e rilasci delle note. */
export function tailSeconds(project: Project): number {
  const tails = project.tracks.flatMap((t) => [
    ...t.effects.filter((e) => e.enabled && e.type === 'reverb').map((e) => (e.type === 'reverb' ? e.decay : 0)),
    t.kind === 'synth' ? t.synth.release : 0,
  ])
  return Math.min(MAX_TAIL_SECONDS, Math.max(MIN_TAIL_SECONDS, ...tails))
}

export function exportDurationSeconds(project: Project): number {
  return songLengthBars(project) * barSeconds(project.bpm, project.timeSignature) + tailSeconds(project)
}

/**
 * Costruisce il motore in un contesto offline. Il contesto globale di Tone viene scambiato solo
 * per questa parte sincrona e sempre ripristinato: l'app dal vivo non viene mai toccata.
 */
function buildOffline(project: Project, ctx: Tone.OfflineContext): { graph: AudioGraph; unschedule: () => void } {
  const original = Tone.getContext()
  Tone.setContext(ctx)
  try {
    const graph = createGraph(project)
    const transport = ctx.transport
    transport.bpm.value = project.bpm
    transport.timeSignature = [project.timeSignature.beatsPerBar, project.timeSignature.beatUnit]
    const unschedule = scheduleSequencer(graph, { project: () => project, target: () => ({ mode: 'song' }), metronome: () => false }, null)
    transport.start(0)
    return { graph, unschedule }
  } finally {
    Tone.setContext(original)
  }
}

/** Suona tutto il brano "in silenzio" (più veloce del tempo reale) e restituisce l'audio. */
export async function renderSong(project: Project): Promise<AudioBuffer> {
  const seconds = exportDurationSeconds(project)
  if (seconds > LIMITS.exportSeconds) {
    throw new Error(`Il brano è troppo lungo da esportare (massimo ${LIMITS.exportSeconds / 60} minuti).`)
  }
  const ctx = new Tone.OfflineContext(2, seconds, EXPORT_SAMPLE_RATE)
  guardContextTimeouts(ctx)
  const { graph, unschedule } = buildOffline(project, ctx)
  try {
    await graph.ready()
    const audio = (await ctx.render()).get()
    if (!audio) throw new Error('Esportazione non riuscita.')
    return audio
  } finally {
    unschedule()
    graph.dispose()
    ctx.dispose()
  }
}
