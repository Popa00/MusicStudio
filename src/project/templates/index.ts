import type { Project } from '../types'
import { TemplateBuilder } from './build'
import { electronicBeat } from './electronicBeat'
import { lofi } from './lofi'

export interface ProjectTemplate {
  id: string
  name: string
  description: string
  create: () => Project
}

/** Progetto vuoto ma pronto: una batteria e uno strumento, ciascuno con un pattern sulla prima battuta. */
function blank(): Project {
  const b = new TemplateBuilder('Nuovo progetto', 110)
  const drums = b.drums('Batteria')
  b.place(b.drumPattern(drums, 'Pattern 1', {}), 0)
  const synth = b.synth('Strumento', 'Piano elettrico')
  b.place(b.notePattern(synth, 'Pattern 1', []), 0)
  return b.project
}

export const TEMPLATES: ProjectTemplate[] = [
  { id: 'electronic', name: 'Beat elettronico', description: 'Batteria, basso, accordi e melodia già pronti: ascolta e modifica', create: electronicBeat },
  { id: 'lofi', name: 'Lo-fi tranquillo', description: 'Ritmo lento e accordi morbidi', create: lofi },
  { id: 'blank', name: 'Vuoto', description: 'Una batteria e uno strumento senza note: parti da zero', create: blank },
]
