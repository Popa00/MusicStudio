import type { Project } from '../../project/types'
import { createMaster, type Master } from './master'
import { createTrackNode, disposeTrackNode, updateTrackNode, type TrackNode } from './trackNode'

/** Tutto il suono del progetto: una catena per traccia, tutte verso il master. */
export interface AudioGraph {
  master: Master
  /** Allinea il motore al progetto: crea, aggiorna o elimina le tracce. */
  sync: (project: Project) => void
  track: (trackId: string) => TrackNode | undefined
  /** Attende che tutti gli effetti siano pronti (serve per l'export). */
  ready: () => Promise<void>
  dispose: () => void
}

export function createGraph(project: Project): AudioGraph {
  const master = createMaster()
  const nodes = new Map<string, TrackNode>()

  function sync(next: Project): void {
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

  sync(project)

  return {
    master,
    sync,
    track: (id) => nodes.get(id),
    ready: async () => {
      await Promise.all([...nodes.values()].flatMap((n) => n.effects.map((e) => e.ready)))
    },
    dispose: () => {
      for (const node of nodes.values()) disposeTrackNode(node)
      nodes.clear()
      master.dispose()
    },
  }
}
