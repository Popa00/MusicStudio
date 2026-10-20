import type { Project } from '../../project/types'
import { createMaster, STOP_FADE_SECONDS, type Master } from './master'
import { createTrackNode, disposeTrackNode, updateTrackNode, type TrackNode } from './trackNode'

/** Attesa dopo la dissolvenza dello Stop prima di ricreare le tracce (margine sul fade). */
const RESET_DELAY_MS = (STOP_FADE_SECONDS + 0.03) * 1000

/** Tutto il suono del progetto: una catena per traccia, tutte verso il master. */
export interface AudioGraph {
  master: Master
  /** Allinea il motore al progetto: crea, aggiorna o elimina le tracce. */
  sync: (project: Project) => void
  track: (trackId: string) => TrackNode | undefined
  /**
   * Stop "secco": dissolvenza rapida, poi strumenti ed effetti ricreati da zero (niente code di
   * note, riverbero o eco che continuano a suonare), poi il volume torna normale.
   */
  silence: () => void
  /** Se uno Stop è ancora in corso, lo completa subito (prima di ripartire con Play). */
  finishSilence: () => void
  /** Attende che tutti gli effetti siano pronti (serve per l'export). */
  ready: () => Promise<void>
  dispose: () => void
}

export function createGraph(project: Project): AudioGraph {
  const master = createMaster()
  const nodes = new Map<string, TrackNode>()
  let current = project
  let resetTimer: ReturnType<typeof setTimeout> | null = null

  function sync(next: Project): void {
    current = next
    master.setVolume(next.master.volumeDb)
    const ids = new Set(next.tracks.map((t) => t.id))
    let removed = false
    for (const [id, node] of nodes) {
      if (!ids.has(id)) {
        disposeTrackNode(node)
        nodes.delete(id)
        removed = true
      }
    }
    // Tone non ricalcola il "solo" quando si elimina un canale: se la traccia in solo è sparita,
    // le altre resterebbero mute. Riapplicarlo aggiorna tutti i canali.
    if (removed) for (const node of nodes.values()) node.channel.solo = node.track.mixer.solo
    for (const track of next.tracks) {
      const node = nodes.get(track.id)
      if (node) updateTrackNode(node, track)
      else nodes.set(track.id, createTrackNode(track, master.input))
    }
  }

  function rebuildAndOpen(): void {
    resetTimer = null
    for (const node of nodes.values()) disposeTrackNode(node)
    nodes.clear()
    sync(current)
    master.open()
  }

  sync(project)

  return {
    master,
    sync,
    track: (id) => nodes.get(id),
    silence: () => {
      master.close()
      if (resetTimer) clearTimeout(resetTimer)
      resetTimer = setTimeout(rebuildAndOpen, RESET_DELAY_MS)
    },
    finishSilence: () => {
      if (!resetTimer) return
      clearTimeout(resetTimer)
      rebuildAndOpen()
    },
    ready: async () => {
      await Promise.all([...nodes.values()].flatMap((n) => n.effects.map((e) => e.ready)))
    },
    dispose: () => {
      if (resetTimer) clearTimeout(resetTimer)
      for (const node of nodes.values()) disposeTrackNode(node)
      nodes.clear()
      master.dispose()
    },
  }
}
