import { describe, expect, it } from 'vitest'
import { TemplateBuilder, type NoteSpec } from '../../project/templates/build'
import type { Project } from '../../project/types'
import { chordsPerBar, describeHarmony } from './harmony'

const DO: NoteSpec[] = [[60, 0, 16], [64, 0, 16], [67, 0, 16]]
const FA: NoteSpec[] = [[53, 0, 16], [57, 0, 16], [60, 0, 16]]
const SOL: NoteSpec[] = [[55, 0, 16], [59, 0, 16], [62, 0, 16]]

/** Un brano con una traccia strumento e un blocco di un'battuta per ogni accordo, nelle battute indicate. */
function song(parts: [NoteSpec[], number[]][], mute = false): Project {
  const b = new TemplateBuilder('t', 100)
  const synth = b.synth('Accordi', 'Piano elettrico')
  parts.forEach(([notes, bars], i) => b.place(b.notePattern(synth, `P${i}`, notes), ...bars))
  return mute ? { ...b.project, tracks: b.project.tracks.map((t) => ({ ...t, mixer: { ...t.mixer, mute: true } })) } : b.project
}

describe('describeHarmony: giro che si ripete', () => {
  const project = song([[DO, [0, 2]], [FA, [1, 3]]])
  it('riconosce il giro più corto e lo scrive una volta', () => {
    expect(describeHarmony(project)[0]).toBe('Giro di accordi (una casella = una battuta): Do | Fa, ripetuto per tutte le 4 battute.')
  })
  it('spiega le note di ogni accordo', () => {
    expect(describeHarmony(project)[1]).toBe('Note di ogni accordo: Do (maggiore) = Do Mi Sol · Fa (maggiore) = Fa La Do')
  })
  it('calcola le note in comune anche dall\'ultimo accordo al primo', () => {
    expect(describeHarmony(project)[2]).toBe('Note in comune tra accordi vicini: Do→Fa: Do · Fa→Do: Do')
  })
})

describe('describeHarmony: brano che non si ripete', () => {
  it('elenca gli accordi battuta per battuta', () => {
    const lines = describeHarmony(song([[DO, [0]], [FA, [1]], [SOL, [2]]]))
    expect(lines[0]).toBe('Accordi per battuta ("–" = nessun accordo nuovo): 1: Do | 2: Fa | 3: Sol')
  })
  it('non chiude il giro: niente passaggio dall\'ultimo al primo', () => {
    const lines = describeHarmony(song([[DO, [0]], [FA, [1]], [SOL, [2]]]))
    expect(lines[2]).toBe('Note in comune tra accordi vicini: Do→Fa: Do · Fa→Sol: nessuna')
  })
  it('una battuta senza accordi è un trattino', () => {
    expect(describeHarmony(song([[DO, [0]], [FA, [2]]]))[0]).toContain('1: Do | 2: – | 3: Fa')
  })
  it('una sola battuta non è un giro', () => {
    expect(describeHarmony(song([[DO, [0]]]))[0]).toContain('1: Do')
  })
  it('oltre 32 battute mette i puntini', () => {
    const lines = describeHarmony(song([[DO, [0]], [FA, [40]]]))
    expect(lines[0].endsWith(' | …')).toBe(true)
  })
})

describe('chordsPerBar e tracce', () => {
  it('ignora le tracce mute', () => {
    const project = song([[DO, [0, 1]]], true)
    expect(chordsPerBar(project).flat()).toEqual([])
    expect(describeHarmony(project)).toEqual(['Nessun accordo nel brano (un accordo = 3 o più note suonate insieme).'])
  })
  it('ignora la batteria e i pattern di sole note singole', () => {
    const b = new TemplateBuilder('t', 100)
    b.place(b.drumPattern(b.drums('Batteria'), 'D', { kick: [0] }), 0)
    b.place(b.notePattern(b.synth('Melodia', 'Piano elettrico'), 'M', [[60, 0, 4], [62, 4, 4]]), 0)
    expect(describeHarmony(b.project)[0]).toContain('Nessun accordo')
  })
  it('due tracce con lo stesso accordo nello stesso istante lo contano una volta', () => {
    const b = new TemplateBuilder('t', 100)
    for (const name of ['A', 'B']) b.place(b.notePattern(b.synth(name, 'Piano elettrico'), 'P', DO), 0)
    expect(chordsPerBar(b.project)).toEqual([[expect.objectContaining({ name: 'Do' })]])
  })
  it('due accordi in istanti diversi della stessa battuta restano due', () => {
    const b = new TemplateBuilder('t', 100)
    b.place(b.notePattern(b.synth('A', 'Piano elettrico'), 'P', [[60, 0, 8], [64, 0, 8], [67, 0, 8], [53, 8, 8], [57, 8, 8], [60, 8, 8]]), 0)
    expect(chordsPerBar(b.project)[0].map((c) => c.name)).toEqual(['Do', 'Fa'])
  })
  it('conta gli accordi di un blocco messo dopo la prima battuta nella battuta giusta', () => {
    const bars = chordsPerBar(song([[FA, [3]]]))
    expect(bars.map((c) => c.length)).toEqual([0, 0, 0, 1])
  })
})
