import type { DrumVoiceId } from '../../../src/music/drumPattern'
import { DEFAULT_DRUM_VELOCITY, DEFAULT_NOTE_VELOCITY } from '../../../src/music/velocity'
import { createEffectSettings } from '../../../src/project/effectDefaults'
import { GENRE_RHYTHMS } from '../../../src/project/rhythms/genres'
import type { GenreRhythm } from '../../../src/project/rhythms/build'
import { SYNTH_PRESETS } from '../../../src/project/synthPresets'
import { TEMPLATES } from '../../../src/project/templates'
import { TemplateBuilder } from '../../../src/project/templates/build'
import { PERCUSSION_SCENARIOS } from './percussionScenarios'
import type { EffectSettings, Project } from '../../../src/project/types'

export type Category = 'batteria' | 'strumenti' | 'effetti' | 'brani' | 'bilanciamento'

/** Cosa ci si aspetta da un suono: l'analisi segnala quando non è così. */
export interface Expectation {
  /** Un singolo colpo o nota: alla fine deve tornare il silenzio. */
  singleHit?: boolean
  /** Brano completo: si controlla il volume percepito (LUFS). */
  mix?: boolean
  centroidMinHz?: number
  centroidMaxHz?: number
}

export interface Scenario {
  name: string
  category: Category
  description: string
  expect: Expectation
  build: () => Project
}

const DRUMS: { voice: DrumVoiceId; label: string; expect: Expectation }[] = [
  { voice: 'kick', label: 'Cassa', expect: { centroidMaxHz: 400 } },
  { voice: 'snare', label: 'Rullante', expect: { centroidMinHz: 800, centroidMaxHz: 7000 } },
  { voice: 'clap', label: 'Battimani', expect: { centroidMinHz: 700, centroidMaxHz: 5000 } },
  { voice: 'hihatClosed', label: 'Charleston chiuso', expect: { centroidMinHz: 5000 } },
  { voice: 'hihatOpen', label: 'Charleston aperto', expect: { centroidMinHz: 5000 } },
  { voice: 'kick808', label: 'Cassa 808', expect: { centroidMaxHz: 400 } },
  { voice: 'rimshot', label: 'Rimshot', expect: { centroidMinHz: 700 } },
  { voice: 'snap', label: 'Snap', expect: { centroidMinHz: 1000 } },
  { voice: 'tomLow', label: 'Tom basso', expect: { centroidMaxHz: 1000 } },
  { voice: 'tomMid', label: 'Tom medio', expect: { centroidMaxHz: 1200 } },
  { voice: 'tomHigh', label: 'Tom alto', expect: { centroidMaxHz: 1500 } },
  { voice: 'shaker', label: 'Shaker (registrato)', expect: { centroidMinHz: 5000 } },
  { voice: 'tambourine', label: 'Tamburello (registrato)', expect: { centroidMinHz: 5000 } },
  { voice: 'conga', label: 'Conga (registrata)', expect: {} },
  { voice: 'bongo', label: 'Bongo (registrato)', expect: {} },
  { voice: 'cowbell', label: 'Campanaccio', expect: { centroidMinHz: 500 } },
  { voice: 'clave', label: 'Clave', expect: { centroidMinHz: 1500 } },
  { voice: 'perc', label: 'Perc', expect: {} },
  { voice: 'crash', label: 'Crash (registrato)', expect: { centroidMinHz: 2000 } },
  { voice: 'ride', label: 'Ride (registrato)', expect: { centroidMinHz: 2000 } },
  { voice: 'rideBell', label: 'Campana del ride (registrato)', expect: { centroidMinHz: 1500 } },
]

function drumHit(voice: DrumVoiceId, effects: EffectSettings[] = [], velocity = DEFAULT_DRUM_VELOCITY): Project {
  const b = new TemplateBuilder('prova', 120)
  const track = b.drums('Batteria')
  b.project = { ...b.project, tracks: b.project.tracks.map((t) => ({ ...t, effects })) }
  b.place(b.drumPattern(track, 'colpo', { [voice]: [[0, velocity]] }), 0)
  return b.project
}

function synthNote(presetName: string, pitches: number[], velocity = DEFAULT_NOTE_VELOCITY, pan = 0): Project {
  const b = new TemplateBuilder('prova', 120)
  const track = b.synth('Strumento', presetName)
  b.project = { ...b.project, tracks: b.project.tracks.map((t) => ({ ...t, mixer: { ...t.mixer, pan } })) }
  b.place(b.notePattern(track, 'nota', pitches.map((p) => [p, 0, 8, velocity])), 0)
  return b.project
}

function withEffect(type: EffectSettings['type'], changes: Partial<EffectSettings>): EffectSettings {
  return { ...createEffectSettings(type), ...changes } as EffectSettings
}

/** Ritmo pronto (versione Ricca) alla velocità tipica del genere, per due battute. */
function genreRhythm(genre: GenreRhythm): Project {
  const b = new TemplateBuilder('prova', genre.bpm)
  const track = b.drums('Batteria')
  b.place(b.drumPattern(track, genre.name, genre.variants[1].hits), 0, 1)
  return b.project
}

/** Brano di esempio con una sola traccia in "solo": per misurare il volume di ogni strumento. */
function soloTrack(index: number): Project {
  const project = TEMPLATES[0].create()
  return { ...project, tracks: project.tracks.map((t, i) => ({ ...t, mixer: { ...t.mixer, solo: i === index } })) }
}

export const SCENARIOS: Scenario[] = [
  ...DRUMS.map(({ voice, label, expect }) => ({
    name: `batteria-${voice}`, category: 'batteria' as const, description: `${label}, un colpo`,
    expect: { singleHit: true, ...expect }, build: () => drumHit(voice),
  })),
  ...SYNTH_PRESETS.map((preset) => ({
    name: `strumento-${preset.name.toLowerCase().replace(/\s+/g, '-')}`, category: 'strumenti' as const,
    description: `Preset "${preset.name}", accordo di Do`,
    expect: { singleHit: true, ...(preset.category === 'Bassi' ? { centroidMaxHz: 1200 } : {}) },
    build: () => synthNote(preset.name, preset.category === 'Bassi' ? [36] : [60, 64, 67]),
  })),
  ...PERCUSSION_SCENARIOS,
  // Intensità: stessi suoni suonati piano (30%). Rispetto a batteria-kick (90%) e strumento-pluck (80%)
  // il picco deve scendere di circa 9,5 dB e 8,5 dB, e il suono restare pulito.
  {
    name: 'batteria-kick-piano', category: 'batteria', description: 'Cassa, un colpo leggero (intensità 30%)',
    expect: { singleHit: true, centroidMaxHz: 400 }, build: () => drumHit('kick', [], 0.3),
  },
  {
    name: 'strumento-pluck-piano', category: 'strumenti', description: 'Preset "Pluck", accordo di Do suonato piano (intensità 30%)',
    expect: { singleHit: true }, build: () => synthNote('Pluck', [60, 64, 67], 0.3),
  },
  // Pan: traccia spostata a destra. Legge a potenza costante: stesso volume percepito di strumento-pluck.
  {
    name: 'strumento-pluck-pan', category: 'strumenti', description: 'Preset "Pluck", accordo di Do con pan a destra (0,5)',
    expect: { singleHit: true }, build: () => synthNote('Pluck', [60, 64, 67], DEFAULT_NOTE_VELOCITY, 0.5),
  },
  ...[1, 3, 8].map((decay) => ({
    name: `effetto-riverbero-${decay}s`, category: 'effetti' as const, description: `Battimani con riverbero di ${decay} s`,
    expect: { singleHit: true }, build: () => drumHit('clap', [withEffect('reverb', { decay, wet: 0.5 })]),
  })),
  {
    name: 'effetto-delay', category: 'effetti', description: 'Battimani con eco (1/8, ripetizioni 40%)',
    expect: { singleHit: true }, build: () => drumHit('clap', [withEffect('delay', { time: '8n', feedback: 0.4, wet: 0.5 })]),
  },
  ...GENRE_RHYTHMS.map((genre) => ({
    name: `ritmo-${genre.id}`, category: 'brani' as const, description: `Ritmo pronto "${genre.name}" (Ricco), ${genre.bpm} BPM`,
    expect: { mix: true }, build: () => genreRhythm(genre),
  })),
  ...TEMPLATES.filter((t) => t.id !== 'blank').map((t) => ({
    name: `brano-${t.id}`, category: 'brani' as const, description: `Brano completo "${t.name}"`,
    expect: { mix: true }, build: t.create,
  })),
  ...TEMPLATES[0].create().tracks.map((track, i) => ({
    name: `bilanciamento-${i + 1}-${track.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, category: 'bilanciamento' as const,
    description: `"Beat elettronico", solo la traccia ${track.name}`, expect: { mix: true }, build: () => soloTrack(i),
  })),
]
