import { create } from 'zustand'
import { loadAutosave } from '../io/autosave'
import { electronicBeat } from '../project/templates/electronicBeat'
import type { Project } from '../project/types'
import { emptyHistory, record, redo, undo, type History } from './history'
import { usePlaybackStore } from './playbackStore'

/** Il brano (tutto ciò che viene salvato) e la cronologia per annulla/ripeti. */
interface ProjectState {
  project: Project
  history: History<Project>
  /** Applica una modifica. `mergeKey` unisce modifiche rapide in un solo "annulla". */
  commit: (next: Project, mergeKey?: string) => void
  apply: (change: (p: Project) => Project, mergeKey?: string) => void
  undo: () => void
  redo: () => void
  /** Sostituisce il progetto (nuovo/apri) e azzera la cronologia. */
  replace: (project: Project) => void
}

export const useProjectStore = create<ProjectState>()((set, get) => ({
  project: loadAutosave() ?? electronicBeat(),
  history: emptyHistory(),
  commit: (next, mergeKey) => {
    const { project, history } = get()
    if (next === project) return
    set({ project: next, history: record(history, project, mergeKey, Date.now()) })
  },
  apply: (change, mergeKey) => get().commit(change(get().project), mergeKey),
  undo: () => {
    const result = undo(get().history, get().project)
    if (result) set({ project: result.value, history: result.history })
  },
  redo: () => {
    const result = redo(get().history, get().project)
    if (result) set({ project: result.value, history: result.history })
  },
  replace: (project) => {
    // Un altro brano: il punto di partenza scelto in quello vecchio non ha più senso.
    usePlaybackStore.getState().setStartStep(0)
    set({ project, history: emptyHistory() })
  },
}))
