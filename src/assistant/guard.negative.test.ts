import { describe, expect, it } from 'vitest'
import { EFFECT_INFO, EFFECT_TYPES } from '../project/effectDefaults'
import { TEMPLATES } from '../project/templates'
import { leaksInstructions } from './guard'
import { RULES } from './prompt'
import { projectSummary } from './summary/projectSummary'

const ruleLines = RULES.split('\n').filter((l) => l.startsWith('- '))

describe('leaksInstructions: nessun falso allarme', () => {
  it('lascia passare una normale risposta di teoria', () => {
    const answer =
      "Un accordo è un insieme di almeno tre note suonate insieme. L'accordo maggiore suona allegro, quello minore più malinconico. " +
      'Per esempio Do maggiore usa le note Do, Mi e Sol. Puoi provarlo nel piano roll del tuo brano.'
    expect(leaksInstructions(answer)).toBe(false)
  })
  it('lascia passare un rifiuto naturale', () => {
    expect(leaksInstructions('Posso parlare solo di musica e di come usare Music Studio. Vuoi una mano con il tuo brano?')).toBe(false)
  })
  it('lascia passare una sola regola citata pari pari', () => {
    for (const line of ruleLines) expect(leaksInstructions(line.slice(2)), line).toBe(false)
  })
  it('lascia passare "ecco cosa sa fare l\'app" in minuscolo', () => {
    expect(leaksInstructions("Ecco cosa sa fare l'app: batteria, strumenti e piano roll.")).toBe(false)
  })
  it('lascia passare nomi di accordi ed elenchi di effetti', () => {
    const effects = EFFECT_TYPES.map((t) => EFFECT_INFO[t].name).join(', ')
    expect(leaksInstructions(`Effetti per traccia: ${effects}.`)).toBe(false)
    expect(leaksInstructions('Effetti per traccia: Riverbero, Delay, Filtro')).toBe(false)
    expect(leaksInstructions('Il brano è in La minore: gli accordi Am F C G stanno bene insieme. Prova un Riverbero sul pad.')).toBe(false)
  })
  it('lascia passare la stringa vuota e gli spazi', () => {
    expect(leaksInstructions('')).toBe(false)
    expect(leaksInstructions('   \n ')).toBe(false)
  })
  it.each(TEMPLATES.map((t) => [t.name, t] as const))('lascia passare le singole righe del riassunto del brano "%s" (tranne titolo e legenda)', (_name, template) => {
    const lines = projectSummary(template.create(), { trackId: null, patternId: null }).split('\n').slice(1)
    for (const line of lines.filter((l) => !l.startsWith('LEGENDA'))) expect(leaksInstructions(line), line).toBe(false)
  })
})
