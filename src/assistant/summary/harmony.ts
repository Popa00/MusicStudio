import { commonNotes, type Chord } from '../../music/chords'
import { stepsPerBar } from '../../music/timing'
import { songLengthBars } from '../../project/ops/clips'
import { findPattern } from '../../project/ops/helpers'
import type { Project } from '../../project/types'
import { noteGroups } from './noteGroups'

const MAX_BARS_LISTED = 32
const MAX_PAIRS = 8

/** Gli accordi che partono in ogni battuta del brano (tracce strumento non mute), in ordine di tempo. */
export function chordsPerBar(project: Project): Chord[][] {
  const barSteps = stepsPerBar(project.timeSignature)
  const bars: Chord[][] = Array.from({ length: songLengthBars(project) }, () => [])
  const seen = new Set<number>()
  const found: { step: number; chord: Chord }[] = []
  for (const clip of project.clips) {
    const track = project.tracks.find((t) => t.id === clip.trackId)
    const pattern = findPattern(project, clip.patternId)
    if (track?.kind !== 'synth' || track.mixer.mute || pattern?.kind !== 'notes') continue
    for (const group of noteGroups(pattern.notes)) {
      if (group.chord) found.push({ step: clip.startBar * barSteps + group.start, chord: group.chord })
    }
  }
  for (const { step, chord } of found.sort((a, b) => a.step - b.step)) {
    const bar = Math.floor(step / barSteps)
    // Due tracce che suonano un accordo nello stesso istante contano una volta sola.
    if (bar >= bars.length || seen.has(step)) continue
    seen.add(step)
    bars[bar].push(chord)
  }
  return bars
}

/** Il giro più corto che, ripetuto, dà tutta la sequenza (es. 4 battute ripetute 2 volte), o null. */
function repeatingCycle(labels: string[]): number | null {
  for (let period = 1; period < labels.length; period++) {
    if (labels.every((label, i) => label === labels[i % period])) return period
  }
  return null
}

function transitions(sequence: Chord[], wrap: boolean): string {
  const pairs: string[] = []
  const count = wrap ? sequence.length : sequence.length - 1
  for (let i = 0; i < count && pairs.length < MAX_PAIRS; i++) {
    const [a, b] = [sequence[i], sequence[(i + 1) % sequence.length]]
    if (a.name === b.name) continue
    const shared = commonNotes(a, b)
    pairs.push(`${a.name}→${b.name}: ${shared.length > 0 ? shared.join(' ') : 'nessuna'}`)
  }
  return pairs.join(' · ')
}

/** Gli accordi del brano già riconosciuti e spiegati: nomi, note, giro che si ripete, note in comune. */
export function describeHarmony(project: Project): string[] {
  const bars = chordsPerBar(project)
  const all = bars.flat()
  if (all.length === 0) return ['Nessun accordo nel brano (un accordo = 3 o più note suonate insieme).']
  const labels = bars.map((chords) => (chords.length > 0 ? chords.map((c) => c.name).join(' ') : '–'))
  const period = repeatingCycle(labels)
  const lines: string[] = []
  if (period !== null) {
    lines.push(`Giro di accordi (una casella = una battuta): ${labels.slice(0, period).join(' | ')}, ripetuto per tutte le ${labels.length} battute.`)
  } else {
    const shown = labels.slice(0, MAX_BARS_LISTED).map((label, i) => `${i + 1}: ${label}`)
    lines.push(`Accordi per battuta ("–" = nessun accordo nuovo): ${shown.join(' | ')}${labels.length > MAX_BARS_LISTED ? ' | …' : ''}`)
  }
  const distinct = [...new Map(all.map((c) => [c.name, c])).values()]
  lines.push(`Note di ogni accordo: ${distinct.map((c) => `${c.name} (${c.quality}) = ${c.noteNames.join(' ')}`).join(' · ')}`)
  const cycle = period !== null ? bars.slice(0, period).flat() : all
  const moves = transitions(cycle, period !== null)
  if (moves) lines.push(`Note in comune tra accordi vicini: ${moves}`)
  return lines
}
