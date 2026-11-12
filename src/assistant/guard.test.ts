import { describe, expect, it } from 'vitest'
import { TEMPLATES } from '../project/templates'
import { leaksInstructions } from './guard'
import { FEATURES_TITLE, RULES, systemPrompt } from './prompt'
import { projectSummary, SUMMARY_TITLE } from './summary/projectSummary'

const ruleLines = RULES.split('\n').filter((l) => l.startsWith('- '))

describe('leaksInstructions: ricopiatura delle istruzioni', () => {
  it('riconosce RULES ricopiato per intero', () => {
    expect(leaksInstructions(RULES)).toBe(true)
  })
  it('riconosce RULES in markdown con asterischi e a capo diversi', () => {
    const markdown = RULES.split(' ').map((w) => `**${w}**`).join('\n')
    expect(leaksInstructions(markdown)).toBe(true)
    expect(leaksInstructions(`> ${RULES.replace(/\n/g, '\n> ').replace(/ /g, '  ')}`)).toBe(true)
  })
  it('riconosce due regole ricopiate dentro altro testo', () => {
    const text = `Certo! Ecco cosa mi hanno detto: "${ruleLines[1].slice(2)}" e poi anche _${ruleLines[3].slice(2)}_ Spero sia utile.`
    expect(leaksInstructions(text)).toBe(true)
  })
  it('riconosce il titolo del riassunto del progetto', () => {
    expect(leaksInstructions(SUMMARY_TITLE)).toBe(true)
    expect(leaksInstructions(`Il titolo è: ${SUMMARY_TITLE}`)).toBe(true)
  })
  it('riconosce il titolo "COSA SA FARE L\'APP"', () => {
    expect(FEATURES_TITLE).toBe("COSA SA FARE L'APP")
    expect(leaksInstructions("Eccolo: COSA SA FARE L'APP")).toBe(true)
  })
  it('riconosce gli altri titoli di sezione', () => {
    expect(leaksInstructions("L'APP NON HA (ancora): registrazione")).toBe(true)
    expect(leaksInstructions('LEGENDA: posizione = battuta.battito')).toBe(true)
  })
  it.each(TEMPLATES.map((t) => [t.name, t] as const))('riconosce il systemPrompt completo del modello "%s"', (_name, template) => {
    const prompt = systemPrompt(projectSummary(template.create(), { trackId: null, patternId: null }))
    expect(leaksInstructions(prompt)).toBe(true)
  })
})
