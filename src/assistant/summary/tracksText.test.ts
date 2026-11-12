import { describe, expect, it } from 'vitest'
import { createTrack } from '../../project/factory'
import { TemplateBuilder } from '../../project/templates/build'
import type { Project } from '../../project/types'
import { describeTracks, type Focus } from './tracksText'

const NO_FOCUS: Focus = { trackId: null, patternId: null }
const text = (project: Project, focus = NO_FOCUS) => describeTracks(project, focus).join('\n')

function base() {
  const b = new TemplateBuilder('t', 100)
  const synth = b.synth('Basso', 'Piano elettrico')
  return { b, synth }
}

describe('describeTracks: posizione nel brano', () => {
  it('senza tracce lo dice', () => {
    expect(describeTracks(new TemplateBuilder('t', 100).project, NO_FOCUS)).toEqual(['Nessuna traccia.'])
  })
  it('unisce i blocchi uguali e attaccati: "(×3)"', () => {
    const { b, synth } = base()
    b.place(b.notePattern(synth, 'Groove', [[60, 0, 4]]), 0, 1, 2)
    expect(text(b.project)).toContain('suona nelle battute 1–3 «Groove» (×3)')
  })
  it('non unisce pattern diversi, e li separa con la virgola', () => {
    const { b, synth } = base()
    b.place(b.notePattern(synth, 'Groove', [[60, 0, 4]]), 0, 1, 2)
    b.place(b.notePattern(synth, 'Variante', [[62, 0, 4]]), 3)
    expect(text(b.project)).toContain('1–3 «Groove» (×3), 4 «Variante»')
  })
  it('non unisce blocchi uguali separati da un vuoto', () => {
    const { b, synth } = base()
    b.place(b.notePattern(synth, 'Groove', [[60, 0, 4]]), 0, 2)
    expect(text(b.project)).toContain('1 «Groove», 3 «Groove»')
  })
  it('un pattern lungo più battute occupa il suo intervallo', () => {
    const { b, synth } = base()
    b.place(b.notePattern(synth, 'Lungo', [[60, 0, 4]], 2), 0, 2)
    expect(text(b.project)).toContain('1–4 «Lungo» (×2)')
  })
  it('una traccia che non è nella linea del tempo lo dice e non elenca i suoi pattern', () => {
    const { b, synth } = base()
    b.notePattern(synth, 'Nascosto', [[60, 0, 4]])
    const out = text(b.project)
    expect(out).toContain('non è ancora nella linea del tempo (non suona nel brano)')
    expect(out).not.toContain('Pattern «Nascosto»')
  })
})

describe('describeTracks: segnalazioni e contenuto', () => {
  it('segna la traccia SELEZIONATA e il pattern APERTO', () => {
    const { b, synth } = base()
    const pattern = b.notePattern(synth, 'Groove', [[60, 0, 4]])
    b.place(pattern, 0)
    const out = text(b.project, { trackId: synth.id, patternId: pattern.id })
    expect(out).toContain('«Basso» — SELEZIONATA:')
    expect(out).toContain("Pattern «Groove» (1 battuta) — APERTO ORA NELL'EDITOR:")
    expect(text(b.project)).not.toMatch(/SELEZIONATA|APERTO/)
  })
  it('un pattern aperto ma fuori dalla linea del tempo viene comunque descritto', () => {
    const { b, synth } = base()
    const pattern = b.notePattern(synth, 'Bozza', [[60, 0, 4]], 2)
    expect(text(b.project, { trackId: synth.id, patternId: pattern.id })).toContain('Pattern «Bozza» (2 battute) — APERTO')
  })
  it('descrive batteria e strumento con il loro contenuto', () => {
    const { b, synth } = base()
    b.place(b.notePattern(synth, 'Groove', [[60, 0, 4]]), 0)
    b.place(b.drumPattern(b.drums('Drum'), 'Beat', { kick: [0] }), 0)
    const out = text(b.project)
    expect(out).toContain('batteria')
    expect(out).toContain('Cassa: x... .... .... ....')
    expect(out).toContain('strumento, suono "Piano elettrico"')
    expect(out).toContain('Note: 1.1 Do4 (1 battito)')
  })
  it('una traccia percussione non elenca estremi di scala e spiega l\'intonazione', () => {
    const { b } = base()
    const perc = createTrack('percussion', 'Shaker')
    b.project = { ...b.project, tracks: [...b.project.tracks, perc] }
    b.place(b.notePattern(perc, 'Perc', [[61, 0, 4]]), 0)
    const out = text(b.project)
    expect(out).toContain('percussione singola')
    expect(out).not.toContain('Dalla più grave')
    expect(out).not.toContain('fuori dalla scala')
  })
  it('descrive mixer: muto, volume, panning ed effetti', () => {
    const { b, synth } = base()
    b.project = {
      ...b.project,
      tracks: b.project.tracks.map((t) => ({ ...t, mixer: { volumeDb: 3.2, pan: -0.5, mute: true, solo: false } })),
    }
    b.place(b.notePattern(synth, 'G', []), 0)
    const out = text(b.project)
    expect(out).toContain('SILENZIATA (muto), volume +3 dB, spostata a sinistra, nessun effetto')
  })
})
