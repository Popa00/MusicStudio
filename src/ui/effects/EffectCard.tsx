import { EFFECT_INFO } from '../../project/effectDefaults'
import type { EffectSettings } from '../../project/types'
import { deleteEffect, setEffect, shiftEffect } from '../../state/actions/effectActions'
import { noFocus } from '../keepFocusOnMouseDown'
import { EffectControls } from './EffectControls'

interface Props {
  trackId: string
  effect: EffectSettings
  isFirst: boolean
  isLast: boolean
}

export function EffectCard({ trackId, effect, isFirst, isLast }: Props) {
  const info = EFFECT_INFO[effect.type]

  return (
    <div className={`effect-card${effect.enabled ? '' : ' effect-card--off'}`}>
      <header className="effect-card__header">
        <button className="toggle button-small" aria-pressed={effect.enabled} onClick={() => setEffect(trackId, effect.id, { enabled: !effect.enabled })} title="Accendi / spegni l'effetto per confrontare il suono" {...noFocus}>
          {effect.enabled ? 'Acceso' : 'Spento'}
        </button>
        <strong title={info.description}>{info.name}</strong>
        <span className="effect-card__actions">
          <button className="button-small button-secondary" disabled={isFirst} onClick={() => shiftEffect(trackId, effect.id, -1)} aria-label="Sposta su" {...noFocus}>
            ↑
          </button>
          <button className="button-small button-secondary" disabled={isLast} onClick={() => shiftEffect(trackId, effect.id, 1)} aria-label="Sposta giù" {...noFocus}>
            ↓
          </button>
          <button className="button-small button-secondary" onClick={() => deleteEffect(trackId, effect.id)} aria-label="Elimina effetto" {...noFocus}>
            ✕
          </button>
        </span>
      </header>
      <p className="hint">{info.description}</p>
      <EffectControls effect={effect} onChange={(changes) => setEffect(trackId, effect.id, changes)} />
    </div>
  )
}
