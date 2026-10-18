import { addEffect, moveEffect, removeEffect, updateEffect } from '../../project/ops/effects'
import type { EffectSettings, EffectType } from '../../project/types'
import { useProjectStore } from '../projectStore'

const store = () => useProjectStore.getState()

export function insertEffect(trackId: string, type: EffectType): void {
  store().commit(addEffect(store().project, trackId, type))
}

export function setEffect(trackId: string, effectId: string, changes: Partial<EffectSettings>): void {
  const key = `effect:${effectId}:${Object.keys(changes).join(',')}`
  store().commit(updateEffect(store().project, trackId, effectId, changes), key)
}

export function deleteEffect(trackId: string, effectId: string): void {
  store().commit(removeEffect(store().project, trackId, effectId))
}

export function shiftEffect(trackId: string, effectId: string, direction: -1 | 1): void {
  store().commit(moveEffect(store().project, trackId, effectId, direction))
}
