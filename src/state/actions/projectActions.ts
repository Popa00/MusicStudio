import { exportWav } from '../../audio/export/exportWav'
import { downloadBlob, readTextFile } from '../../io/files'
import { parseProject, projectFileName, serializeProject } from '../../io/projectFile'
import { LIMITS } from '../../project/limits'
import { setBpm, setMasterVolume, setScale } from '../../project/ops/song'
import type { ProjectTemplate } from '../../project/templates'
import type { ScaleType } from '../../music/scales'
import { usePlaybackStore } from '../playbackStore'
import { useProjectStore } from '../projectStore'
import { useUiStore } from '../uiStore'

const store = () => useProjectStore.getState()

function resetUi(): void {
  usePlaybackStore.getState().setPlaying(false)
  useUiStore.getState().set({ selectedTrackId: null, selectedPatternId: null, selectedClipId: null })
}

export function newProject(template: ProjectTemplate): void {
  resetUi()
  store().replace(template.create())
}

/** Apre un file di progetto. Restituisce un messaggio di errore, o null se tutto è andato bene. */
export async function openProjectFile(file: File): Promise<string | null> {
  try {
    const result = parseProject(await readTextFile(file, LIMITS.fileChars))
    if (!result.ok) return result.error
    resetUi()
    store().replace(result.project)
    return null
  } catch (error) {
    return error instanceof Error ? error.message : 'Impossibile leggere il file.'
  }
}

export function saveProjectFile(): void {
  const { project } = store()
  downloadBlob(new Blob([serializeProject(project)], { type: 'application/json' }), projectFileName(project.name))
}

export async function exportProjectWav(): Promise<void> {
  usePlaybackStore.getState().setPlaying(false)
  const { project } = store()
  const blob = await exportWav(project)
  downloadBlob(blob, projectFileName(project.name).replace(/\.msproj$/, '.wav'))
}

export function changeBpm(bpm: number): void {
  store().commit(setBpm(store().project, bpm), 'bpm')
}

export function changeScale(root: number, type: ScaleType): void {
  store().commit(setScale(store().project, root, type))
}

export function changeMasterVolume(db: number): void {
  store().commit(setMasterVolume(store().project, db), 'master-volume')
}
