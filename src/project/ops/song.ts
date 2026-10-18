import { clampBpm } from '../../music/timing'
import type { ScaleType } from '../../music/scales'
import type { Project } from '../types'
import { clampNumber } from './helpers'

export function setBpm(project: Project, bpm: number): Project {
  return { ...project, bpm: clampBpm(bpm) }
}

export function setScale(project: Project, root: number, type: ScaleType): Project {
  return { ...project, scale: { root: Math.round(clampNumber(root, 0, 11)), type } }
}

export function setMasterVolume(project: Project, volumeDb: number): Project {
  return { ...project, master: { volumeDb: clampNumber(volumeDb, -60, 6) } }
}

export function renameProject(project: Project, name: string): Project {
  return { ...project, name: name.slice(0, 40) }
}
