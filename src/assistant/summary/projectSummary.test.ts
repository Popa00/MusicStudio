import { describe, expect, it } from 'vitest'
import { scaleChords, scaleName, scaleNoteNames } from '../../music/scaleChords'
import { createEmptyProject } from '../../project/factory'
import { TEMPLATES } from '../../project/templates'
import { TemplateBuilder } from '../../project/templates/build'
import { projectSummary, SUMMARY_MAX_CHARS } from './projectSummary'

const NO_FOCUS = { trackId: null, patternId: null }

describe.each(TEMPLATES.map((t) => [t.name, t] as const))('riassunto del modello "%s"', (_, template) => {
  const project = template.create()
  const summary = projectSummary(project, NO_FOCUS)
  const { root, type } = project.scale

  it(`sta sotto il limite di caratteri e non è troncato`, () => {
    expect(summary.length).toBeLessThanOrEqual(SUMMARY_MAX_CHARS)
    expect(summary).not.toContain('troncato')
  })
  it('contiene nome, velocità e tempo', () => {
    expect(summary).toContain(`Nome: «${project.name}». Velocità: ${project.bpm} BPM. Tempo: 4/4.`)
  })
  it('contiene la scala giusta con le sue note e i suoi accordi', () => {
    expect(summary).toContain(`Scala: ${scaleName(root, type)}; le sue note: ${scaleNoteNames(root, type).join(' ')}.`)
    expect(summary).toContain(`Accordi della scala (stanno bene insieme in questo brano): ${scaleChords(root, type).map((c) => c.name).join(' ')}.`)
  })
  it('contiene le sezioni legenda, armonia e tracce con ogni traccia', () => {
    for (const part of ['LEGENDA:', 'ARMONIA', 'TRACCE']) expect(summary).toContain(part)
    for (const track of project.tracks) expect(summary).toContain(`«${track.name}»`)
  })
})

describe('projectSummary: casi particolari', () => {
  it('il modello elettronico è in La minore con gli accordi di casa', () => {
    const electronic = TEMPLATES.find((t) => t.id === 'electronic')!.create()
    expect(projectSummary(electronic, NO_FOCUS)).toContain('Accordi della scala (stanno bene insieme in questo brano): Lam Sidim Do Rem Mim Fa Sol.')
  })
  it('senza scala non scrive gli accordi della scala', () => {
    const project = { ...createEmptyProject(), scale: { root: 0, type: 'none' as const } }
    const summary = projectSummary(project, NO_FOCUS)
    expect(summary).toContain('Scala: nessuna scelta')
    expect(summary).not.toContain('Accordi della scala')
  })
  it('con una pentatonica scrive la scala ma non gli accordi', () => {
    const project = { ...createEmptyProject(), scale: { root: 2, type: 'pentatonicMinor' as const } }
    const summary = projectSummary(project, NO_FOCUS)
    expect(summary).toContain('Scala: Re pentatonica minore')
    expect(summary).not.toContain('Accordi della scala')
  })
  it('un progetto vuoto ha 1 battuta e nessuna traccia', () => {
    const summary = projectSummary(createEmptyProject('Vuoto'), NO_FOCUS)
    expect(summary).toContain('Lunghezza: 1 battute')
    expect(summary).toContain('Nessuna traccia.')
  })
  it('un riassunto troppo lungo viene troncato con un avviso', () => {
    const b = new TemplateBuilder('Enorme', 120)
    for (let t = 0; t < 12; t++) {
      const synth = b.synth(`Traccia ${t}`, 'Piano elettrico')
      const notes = Array.from({ length: 48 }, (_, i): [number, number, number] => [48 + (i % 24), i, 1])
      b.place(b.notePattern(synth, 'Lungo', notes), 0)
    }
    const summary = projectSummary(b.project, NO_FOCUS)
    const suffix = '\n… (riassunto troncato: il brano è lungo)'
    expect(summary.endsWith(suffix)).toBe(true)
    expect(summary.length).toBe(SUMMARY_MAX_CHARS + suffix.length)
  })
})
