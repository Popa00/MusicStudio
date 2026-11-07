import type { DrumVoiceId } from '../../../src/music/drumPattern'
import { DEFAULT_DRUM_VELOCITY } from '../../../src/music/velocity'
import { addPercussionTrack, PERCUSSION_ROOT_PITCH, updatePercussion } from '../../../src/project/ops/percussion'
import { TemplateBuilder } from '../../../src/project/templates/build'
import type { PercussionSound, Project } from '../../../src/project/types'
import type { Scenario } from './scenarios'

/** Un colpo su una traccia "percussione singola" (il suono di batteria suonato come strumento). */
function percussionHit(voice: DrumVoiceId, pitch = PERCUSSION_ROOT_PITCH, changes: Partial<PercussionSound> = {}): Project {
  const b = new TemplateBuilder('prova', 120)
  const added = addPercussionTrack(b.project, voice, 'Percussione')
  const trackId = added.trackId as string
  const project = updatePercussion(added.project, trackId, changes)
  const pattern = project.patterns.find((p) => p.trackId === trackId)
  if (pattern?.kind !== 'notes') throw new Error('pattern mancante')
  const note = { id: 'n1', pitch, start: 0, duration: 1, velocity: DEFAULT_DRUM_VELOCITY }
  return {
    ...project,
    patterns: project.patterns.map((p) => (p.id === pattern.id ? { ...pattern, notes: [note] } : p)),
    clips: [{ id: 'c1', trackId, patternId: pattern.id, startBar: 0 }],
  }
}

/**
 * Tracce percussione: al Do centrale devono suonare come lo stesso suono nella batteria
 * (confronta con batteria-hihatClosed e batteria-crash); intonazione e lunghezza li cambiano.
 */
export const PERCUSSION_SCENARIOS: Scenario[] = [
  {
    name: 'percussione-hihatClosed', category: 'batteria', description: 'Traccia percussione: charleston chiuso al Do centrale',
    expect: { singleHit: true, centroidMinHz: 5000 }, build: () => percussionHit('hihatClosed'),
  },
  {
    name: 'percussione-crash', category: 'batteria', description: 'Traccia percussione: crash registrato al Do centrale',
    expect: { singleHit: true, centroidMinHz: 2000 }, build: () => percussionHit('crash'),
  },
  {
    name: 'percussione-tomLow-acuto', category: 'batteria', description: 'Traccia percussione: tom basso 7 semitoni più acuto',
    expect: { singleHit: true }, build: () => percussionHit('tomLow', PERCUSSION_ROOT_PITCH + 7),
  },
  {
    name: 'percussione-crash-corto', category: 'batteria', description: 'Traccia percussione: crash con lunghezza 15% (colpo tagliato con dissolvenza)',
    expect: { singleHit: true, centroidMinHz: 2000 }, build: () => percussionHit('crash', PERCUSSION_ROOT_PITCH, { length: 0.15 }),
  },
]
