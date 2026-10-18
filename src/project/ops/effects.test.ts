import { describe, expect, it } from 'vitest'
import { createEmptyProject } from '../factory'
import { LIMITS } from '../limits'
import type { EffectSettings, Project } from '../types'
import { addEffect, moveEffect, removeEffect, updateEffect } from './effects'
import { findTrack } from './helpers'
import { addTrack } from './tracks'

function must<T>(value: T | null | undefined): T {
  if (value === null || value === undefined) throw new Error('valore mancante')
  return value
}

function fixture() {
  const a = addTrack(createEmptyProject(), 'synth')
  const trackId = must(a.trackId)
  let project = addEffect(a.project, trackId, 'delay')
  project = addEffect(project, trackId, 'filter')
  project = addEffect(project, trackId, 'reverb')
  return { project, trackId }
}

const effects = (p: Project, trackId: string): EffectSettings[] => must(findTrack(p, trackId)).effects

describe('addEffect / removeEffect', () => {
  it('aggiunge effetti con impostazioni iniziali valide, in ordine', () => {
    const f = fixture()
    expect(effects(f.project, f.trackId).map((e) => e.type)).toEqual(['delay', 'filter', 'reverb'])
    expect(effects(f.project, f.trackId)[0]).toMatchObject({ enabled: true, time: '8n', feedback: 0.35 })
  })
  it('rispetta il numero massimo di effetti per traccia', () => {
    const f = fixture()
    let p = f.project
    for (let i = 0; i < 10; i++) p = addEffect(p, f.trackId, 'eq')
    expect(effects(p, f.trackId)).toHaveLength(LIMITS.effectsPerTrack)
  })
  it('removeEffect toglie solo quello indicato', () => {
    const f = fixture()
    const [delay, filter, reverb] = effects(f.project, f.trackId)
    expect(effects(removeEffect(f.project, f.trackId, filter.id), f.trackId)).toEqual([delay, reverb])
  })
})

describe('updateEffect', () => {
  it('applica valori validi', () => {
    const f = fixture()
    const delay = effects(f.project, f.trackId)[0]
    const p = updateEffect(f.project, f.trackId, delay.id, { feedback: 0.5, enabled: false })
    expect(effects(p, f.trackId)[0]).toMatchObject({ feedback: 0.5, enabled: false })
  })
  it('rifiuta valori fuori range, NaN e Infinity lasciando l\'effetto com\'era', () => {
    const f = fixture()
    const [delay, filter, reverb] = effects(f.project, f.trackId)
    const cases: [string, Partial<EffectSettings>][] = [
      [delay.id, { feedback: 0.9 }],
      [delay.id, { wet: -0.1 }],
      [filter.id, { frequency: 10 }],
      [filter.id, { resonance: NaN }],
      [reverb.id, { decay: Infinity }],
      [reverb.id, { wet: 2 }],
    ]
    for (const [id, changes] of cases) {
      expect(effects(updateEffect(f.project, f.trackId, id, changes), f.trackId)).toEqual([delay, filter, reverb])
    }
  })
  it('non permette di cambiare id o tipo di un effetto', () => {
    const f = fixture()
    const delay = effects(f.project, f.trackId)[0]
    const changes = { id: 'altro', type: 'reverb' } as unknown as Partial<EffectSettings>
    const p = updateEffect(f.project, f.trackId, delay.id, changes)
    expect(effects(p, f.trackId)[0]).toEqual(delay)
  })
  it('effetto sconosciuto: nessun cambiamento', () => {
    const f = fixture()
    expect(effects(updateEffect(f.project, f.trackId, 'manca', { wet: 0 }), f.trackId)).toEqual(effects(f.project, f.trackId))
  })
  // BUG: quando la modifica viene rifiutata, updateEffect (come gli altri op basati su
  // mapTrack/mapPattern) restituisce comunque un nuovo oggetto progetto. projectStore.commit
  // confronta il riferimento (`next === project`) e registra un passo di "Annulla" che non fa nulla.
  it('una modifica rifiutata restituisce lo stesso progetto (nessun annulla vuoto)', () => {
    const f = fixture()
    const delay = effects(f.project, f.trackId)[0]
    expect(updateEffect(f.project, f.trackId, delay.id, { feedback: 5 })).toBe(f.project)
  })
})

describe('moveEffect', () => {
  it('sposta un effetto prima o dopo nella catena', () => {
    const f = fixture()
    const [delay, filter, reverb] = effects(f.project, f.trackId)
    expect(effects(moveEffect(f.project, f.trackId, filter.id, -1), f.trackId)).toEqual([filter, delay, reverb])
    expect(effects(moveEffect(f.project, f.trackId, filter.id, 1), f.trackId)).toEqual([delay, reverb, filter])
  })
  it('ai bordi o con id sconosciuto non cambia l\'ordine', () => {
    const f = fixture()
    const list = effects(f.project, f.trackId)
    expect(effects(moveEffect(f.project, f.trackId, list[0].id, -1), f.trackId)).toEqual(list)
    expect(effects(moveEffect(f.project, f.trackId, list[2].id, 1), f.trackId)).toEqual(list)
    expect(effects(moveEffect(f.project, f.trackId, 'manca', 1), f.trackId)).toEqual(list)
  })
})
