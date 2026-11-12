import { EFFECT_INFO } from '../../project/effectDefaults'
import { clipSpan } from '../../project/ops/clips'
import { patternsOfTrack } from '../../project/ops/helpers'
import { findPreset } from '../../project/synthPresets'
import type { Pattern, Project, Track } from '../../project/types'
import { VOICE_LABELS } from '../../music/voiceLabels'
import { describeDrumPattern } from './drumsText'
import { barRangeLabel } from './format'
import { describeNotePattern } from './notesText'
import { safeName } from './safeName'

/** Cosa l'utente ha aperto in questo momento: aiuta il modello a capire "questa traccia". */
export interface Focus {
  trackId: string | null
  patternId: string | null
}

function instrumentLabel(track: Track): string {
  if (track.kind === 'drums') return 'batteria'
  if (track.kind === 'percussion') return `percussione singola (${VOICE_LABELS[track.sound.voice].name}; le note cambiano solo l'intonazione, Do4 = suono originale)`
  const preset = findPreset(track.synth.preset)
  return `strumento, suono "${safeName(track.synth.preset)}"${preset ? `: ${preset.description.toLowerCase()}` : ''}`
}

function mixerLabel(track: Track): string {
  const { volumeDb, pan, mute, solo } = track.mixer
  const parts: string[] = []
  if (mute) parts.push('SILENZIATA (muto)')
  if (solo) parts.push('in assolo')
  if (volumeDb !== 0) parts.push(`volume ${volumeDb > 0 ? '+' : ''}${Math.round(volumeDb)} dB`)
  if (Math.abs(pan) >= 0.05) parts.push(`spostata a ${pan < 0 ? 'sinistra' : 'destra'}`)
  const effects = track.effects.filter((e) => e.enabled).map((e) => EFFECT_INFO[e.type].name)
  parts.push(effects.length > 0 ? `effetti: ${effects.join(', ')}` : 'nessun effetto')
  return parts.join(', ')
}

/** Dove suona la traccia, con i blocchi uguali e attaccati riuniti: "battute 1–3 «Groove» (×3), 4 «Variante»". */
function placementLabel(track: Track, project: Project): string {
  const clips = project.clips.filter((c) => c.trackId === track.id).sort((a, b) => a.startBar - b.startBar)
  if (clips.length === 0) return 'non è ancora nella linea del tempo (non suona nel brano)'
  const runs: { patternId: string; start: number; end: number; count: number }[] = []
  for (const clip of clips) {
    const [start, end] = clipSpan(project, clip)
    const last = runs.at(-1)
    if (last && last.patternId === clip.patternId && last.end === start) Object.assign(last, { end, count: last.count + 1 })
    else runs.push({ patternId: clip.patternId, start, end, count: 1 })
  }
  const items = runs.map((run) => {
    const name = project.patterns.find((p) => p.id === run.patternId)?.name ?? '?'
    return `${barRangeLabel(run.start, run.end - 1)} «${safeName(name)}»${run.count > 1 ? ` (×${run.count})` : ''}`
  })
  return `suona nelle battute ${items.join(', ')}`
}

function describePattern(pattern: Pattern, track: Track, project: Project, focus: Focus): string[] {
  const open = pattern.id === focus.patternId ? ' — APERTO ORA NELL\'EDITOR' : ''
  const body =
    pattern.kind === 'drums'
      ? describeDrumPattern(pattern, project.timeSignature)
      : describeNotePattern(pattern, project, track.kind === 'synth')
  return [`  Pattern «${safeName(pattern.name)}» (${pattern.lengthBars} ${pattern.lengthBars === 1 ? 'battuta' : 'battute'})${open}:`, ...body.map((l) => `    ${l}`)]
}

/** Ogni traccia con strumento, mixer, effetti, posizione nel brano e contenuto dei suoi pattern. */
export function describeTracks(project: Project, focus: Focus): string[] {
  if (project.tracks.length === 0) return ['Nessuna traccia.']
  return project.tracks.flatMap((track, i) => {
    const selected = track.id === focus.trackId ? ' — SELEZIONATA' : ''
    const used = new Set(project.clips.filter((c) => c.trackId === track.id).map((c) => c.patternId))
    const patterns = patternsOfTrack(project, track.id).filter((p) => used.has(p.id) || p.id === focus.patternId)
    return [
      `${i + 1}. «${safeName(track.name)}»${selected}: ${instrumentLabel(track)}`,
      `  ${mixerLabel(track)}; ${placementLabel(track, project)}`,
      ...patterns.flatMap((p) => describePattern(p, track, project, focus)),
    ]
  })
}
