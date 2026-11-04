import { describe, expect, it } from 'vitest'
import { TemplateBuilder } from './build'

describe('TemplateBuilder.drumPattern', () => {
  it("uno step numerico usa l'intensità predefinita (0,9)", () => {
    const b = new TemplateBuilder('T', 100)
    const p = b.drumPattern(b.drums('D'), 'P', { kick: [0, 4] })
    expect(p.kind === 'drums' && p.steps.kick.slice(0, 5)).toEqual([0.9, 0, 0, 0, 0.9])
  })
  it('accetta [step, intensità] mescolato a step semplici', () => {
    const b = new TemplateBuilder('T', 100)
    const p = b.drumPattern(b.drums('D'), 'P', { hihatClosed: [0, [2, 0.55], [15, 0.3]] })
    if (p.kind !== 'drums') throw new Error('atteso batteria')
    expect(p.steps.hihatClosed[0]).toBe(0.9)
    expect(p.steps.hihatClosed[2]).toBe(0.55)
    expect(p.steps.hihatClosed[15]).toBe(0.3)
    expect(p.steps.kick.every((x) => x === 0)).toBe(true)
  })
})

describe('TemplateBuilder.notePattern', () => {
  it("senza intensità usa 0,8, con il 4° elemento usa quella indicata", () => {
    const b = new TemplateBuilder('T', 100)
    const p = b.notePattern(b.synth('S', 'Pad'), 'N', [[60, 0, 4], [64, 4, 4, 0.5]])
    expect(p.kind === 'notes' && p.notes.map((n) => n.velocity)).toEqual([0.8, 0.5])
  })
})
