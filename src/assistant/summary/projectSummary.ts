import type { Chord } from '../../music/chords'
import { scaleChords, scaleName, scaleNoteNames } from '../../music/scaleChords'
import { barSeconds } from '../../music/timing'
import { songLengthBars } from '../../project/ops/clips'
import type { Project } from '../../project/types'
import { describeHarmony } from './harmony'
import { safeName } from './safeName'
import { describeTracks, type Focus } from './tracksText'

/**
 * Limite del riassunto in caratteri (~2000 token). Con regole, storico, ragionamento e risposta il totale arriva a ~6500 token:
 * in LM Studio serve un contesto di almeno 8192.
 */
export const SUMMARY_MAX_CHARS = 7000

const LEGEND =
  'LEGENDA: posizione = battuta.battito (2.3 = battuta 2, battito 3; "+½" = a metà battito), contata dall\'inizio del pattern. ' +
  'Note con ottava: Do4 = Do centrale del pianoforte. ' +
  'Batteria: un simbolo per sedicesimo, uno spazio tra un battito e l\'altro; x = colpo, o = colpo leggero, . = silenzio.'

function scaleLines(project: Project): string[] {
  const { root, type } = project.scale
  if (type === 'none') return ['Scala: nessuna scelta (tutte le note sono permesse).']
  const lines = [`Scala: ${scaleName(root, type)}; le sue note: ${scaleNoteNames(root, type).join(' ')}.`]
  const chords = scaleChords(root, type)
  if (chords.length > 0) {
    lines.push(`Accordi della scala (stanno bene insieme in questo brano): ${chords.map((c) => c.name).join(' ')}.`)
    lines.push(`Gli stessi accordi per tipo: ${chordsByQuality(chords)}.`)
  }
  return lines
}

/**
 * Es. "minori: Lam Rem Mim · maggiori: Do Fa Sol · diminuiti: Sidim". Scritto dall'app perché un modello
 * piccolo, a memoria, a volte sbaglia il tipo (per esempio chiama minore il Fa di La minore).
 */
function chordsByQuality(chords: readonly Chord[]): string {
  const groups = new Map<string, string[]>()
  for (const chord of chords) groups.set(chord.quality, [...(groups.get(chord.quality) ?? []), chord.name])
  const plural = (quality: string) => quality.replace(/o$/, 'i').replace(/e$/, 'i')
  return [...groups].map(([quality, names]) => `${plural(quality)}: ${names.join(' ')}`).join(' · ')
}

export const SUMMARY_TITLE = "PROGETTO ATTUALE DELL'UTENTE (descritto dall'app: nomi di note e accordi sono esatti)"

/**
 * Il brano descritto a parole per il modello. Tutto ciò che si può calcolare (nomi delle note, accordi,
 * note in comune, note fuori scala) lo calcola l'app: un modello piccolo su questi conti sbaglia spesso.
 */
export function projectSummary(project: Project, focus: Focus): string {
  const { beatsPerBar, beatUnit } = project.timeSignature
  const bars = songLengthBars(project)
  const seconds = Math.round(bars * barSeconds(project.bpm, project.timeSignature))
  const lines = [
    SUMMARY_TITLE,
    `Nome: «${safeName(project.name)}». Velocità: ${project.bpm} BPM. Tempo: ${beatsPerBar}/${beatUnit}. Lunghezza: ${bars} battute (circa ${seconds} secondi).`,
    ...scaleLines(project),
    LEGEND,
    '',
    'ARMONIA',
    ...describeHarmony(project),
    '',
    'TRACCE',
    ...describeTracks(project, focus),
  ]
  const text = lines.join('\n')
  return text.length <= SUMMARY_MAX_CHARS ? text : `${text.slice(0, SUMMARY_MAX_CHARS)}\n… (riassunto troncato: il brano è lungo)`
}
