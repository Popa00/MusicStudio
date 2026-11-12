import { describe, expect, it } from 'vitest'
import type { DrumVoiceId } from '../../music/drumPattern'
import type { TimeSignature } from '../../music/timing'
import { TemplateBuilder, type DrumHitSpec } from '../../project/templates/build'
import type { DrumPatternData } from '../../project/types'
import { describeDrumPattern } from './drumsText'

const T44: TimeSignature = { beatsPerBar: 4, beatUnit: 4 }
const T68: TimeSignature = { beatsPerBar: 6, beatUnit: 8 }

function make(hits: Partial<Record<DrumVoiceId, DrumHitSpec[]>>, bars = 1, ts = T44): DrumPatternData {
  const b = new TemplateBuilder('t', 100)
  b.project = { ...b.project, timeSignature: ts }
  return b.drumPattern(b.drums('Batteria'), 'P', hits, bars) as DrumPatternData
}

describe('describeDrumPattern', () => {
  it('disegna una griglia con x per i colpi e un punto per il silenzio', () => {
    expect(describeDrumPattern(make({ kick: [0, 4, 8, 12] }), T44)).toEqual(['Cassa: x... x... x... x...'])
  })
  it('un colpo leggero (sotto 0,5) è "o", da 0,5 in su è "x"', () => {
    const lines = describeDrumPattern(make({ hihatClosed: [[0, 0.49], [4, 0.5], [8, 1], [12, 0.01]] }), T44)
    expect(lines).toEqual(['Charleston chiuso: o... x... x... o...'])
  })
  it("elenca solo i suoni con almeno un colpo, nell'ordine della batteria", () => {
    const lines = describeDrumPattern(make({ snare: [4], kick: [0] }), T44)
    expect(lines).toEqual(['Cassa: x... .... .... ....', 'Rullante: .... x... .... ....'])
  })
  it('un pattern senza colpi lo dice', () => {
    expect(describeDrumPattern(make({}), T44)).toEqual(['(nessun colpo)'])
  })
  it('battute uguali si riassumono', () => {
    const lines = describeDrumPattern(make({ kick: [0, 16] }, 2), T44)
    expect(lines).toEqual(['Cassa: x... .... .... .... (uguale in tutte le 2 battute)'])
  })
  it('battute diverse si mostrano separate da una barra', () => {
    const lines = describeDrumPattern(make({ kick: [0, 20] }, 2), T44)
    expect(lines).toEqual(['Cassa: x... .... .... .... | .... x... .... ....'])
  })
  it('oltre 4 battute diverse mostra le prime 4 e i puntini', () => {
    const lines = describeDrumPattern(make({ kick: [0, 20, 40, 60, 80, 96] }, 6), T44)
    expect(lines[0].split(' | ')).toHaveLength(5)
    expect(lines[0].endsWith(' | …')).toBe(true)
  })
  it('con esattamente 4 battute diverse non mette i puntini', () => {
    const lines = describeDrumPattern(make({ kick: [0, 20, 40, 60] }, 4), T44)
    expect(lines[0]).not.toContain('…')
  })
  it('in 6/8 ci sono 2 step per battito e 6 battiti', () => {
    expect(describeDrumPattern(make({ kick: [0, 6] }, 1, T68), T68)).toEqual(['Cassa: x. .. .. x. .. ..'])
  })
  it('una riga più corta del pattern conta come silenzio', () => {
    const pattern = make({ kick: [0] }, 2)
    pattern.steps.kick = pattern.steps.kick.slice(0, 16)
    expect(describeDrumPattern(pattern, T44)[0]).toBe('Cassa: x... .... .... .... | .... .... .... ....')
  })
})
