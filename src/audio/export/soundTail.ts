import type { DrumVoiceId } from '../../music/drumPattern'
import { PERCUSSION_ROOT_PITCH } from '../../project/ops/percussion'
import type { Project, Track } from '../../project/types'

/** Durata dei piatti registrati (i file più lunghi): un crash sull'ultimo battito deve sfumare. */
const CYMBAL_SECONDS = 4
const CYMBALS: DrumVoiceId[] = ['crash', 'ride', 'rideBell']
/** Gli altri suoni durano al massimo così (la cassa 808 è il più lungo). */
const OTHER_SECONDS = 1.2

function drumTail(project: Project, track: Track): number {
  const hasCymbal = project.patterns.some(
    (p) => p.trackId === track.id && p.kind === 'drums' && CYMBALS.some((v) => p.steps[v].some((s) => s > 0)),
  )
  return hasCymbal ? CYMBAL_SECONDS : 0
}

/** Un suono suonato più grave dura di più (va più lento): la nota più bassa decide la coda. */
function percussionTail(project: Project, track: Track): number {
  if (track.kind !== 'percussion') return 0
  const pitches = project.patterns.flatMap((p) => (p.trackId === track.id && p.kind === 'notes' ? p.notes.map((n) => n.pitch) : []))
  if (pitches.length === 0) return 0
  const lowest = Math.max(-24, Math.min(...pitches) - PERCUSSION_ROOT_PITCH + track.sound.tune)
  const base = CYMBALS.includes(track.sound.voice) ? CYMBAL_SECONDS : OTHER_SECONDS
  return (base * track.sound.length) / 2 ** (lowest / 12)
}

/** Secondi che servono ai suoni di batteria e percussione per spegnersi da soli dopo l'ultimo colpo. */
export function soundTailSeconds(project: Project): number {
  return Math.max(
    0,
    ...project.tracks.map((t) => (t.kind === 'drums' ? drumTail(project, t) : percussionTail(project, t))),
  )
}
