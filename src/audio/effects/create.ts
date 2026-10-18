import type { EffectSettings } from '../../project/types'
import { createDelay } from './delay'
import { createDistortion } from './distortion'
import { createEq } from './eq'
import { createFilter } from './filter'
import { createReverb } from './reverb'
import type { EffectNode } from './types'

export function createEffect(settings: EffectSettings): EffectNode {
  switch (settings.type) {
    case 'reverb':
      return createReverb(settings)
    case 'delay':
      return createDelay(settings)
    case 'filter':
      return createFilter(settings)
    case 'eq':
      return createEq(settings)
    case 'distortion':
      return createDistortion(settings)
  }
}
