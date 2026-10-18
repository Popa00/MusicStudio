import { createEffectSettings } from '../effectDefaults'
import { LIMITS } from '../limits'
import { effectSchema } from '../schema/effects'
import type { EffectSettings, EffectType, Project, Track } from '../types'
import { mapTrack, sameItems } from './helpers'

function mapEffects(project: Project, trackId: string, fn: (effects: EffectSettings[]) => EffectSettings[]): Project {
  return mapTrack(project, trackId, (t: Track) => {
    const effects = fn(t.effects)
    return sameItems(effects, t.effects) ? t : { ...t, effects }
  })
}

export function addEffect(project: Project, trackId: string, type: EffectType): Project {
  return mapEffects(project, trackId, (effects) =>
    effects.length >= LIMITS.effectsPerTrack ? effects : [...effects, createEffectSettings(type)],
  )
}

/** Cambia i parametri di un effetto. Valori fuori range vengono ignorati (lo schema li rifiuta). */
export function updateEffect(project: Project, trackId: string, effectId: string, changes: Partial<EffectSettings>): Project {
  return mapEffects(project, trackId, (effects) =>
    effects.map((e) => {
      if (e.id !== effectId) return e
      const parsed = effectSchema.safeParse({ ...e, ...changes, id: e.id, type: e.type })
      return parsed.success ? parsed.data : e
    }),
  )
}

export function removeEffect(project: Project, trackId: string, effectId: string): Project {
  return mapEffects(project, trackId, (effects) => effects.filter((e) => e.id !== effectId))
}

/** Sposta un effetto prima (-1) o dopo (+1) nella catena: l'ordine cambia il suono. */
export function moveEffect(project: Project, trackId: string, effectId: string, direction: -1 | 1): Project {
  return mapEffects(project, trackId, (effects) => {
    const i = effects.findIndex((e) => e.id === effectId)
    const j = i + direction
    if (i < 0 || j < 0 || j >= effects.length) return effects
    const next = [...effects]
    ;[next[i], next[j]] = [next[j], next[i]]
    return next
  })
}
