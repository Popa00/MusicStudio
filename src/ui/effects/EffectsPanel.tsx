import { EFFECT_INFO, EFFECT_TYPES } from '../../project/effectDefaults'
import { LIMITS } from '../../project/limits'
import type { EffectType, Track } from '../../project/types'
import { insertEffect } from '../../state/actions/effectActions'
import { EffectCard } from './EffectCard'
import './effects.css'

/** Catena di effetti della traccia: il suono passa da un effetto al successivo, dall'alto in basso. */
export function EffectsPanel({ track }: { track: Track }) {
  const full = track.effects.length >= LIMITS.effectsPerTrack

  return (
    <div className="effects-panel">
      <div className="effects-panel__add">
        <label>
          Aggiungi effetto{' '}
          <select value="" disabled={full} onChange={(e) => insertEffect(track.id, e.target.value as EffectType)}>
            <option value="" disabled>
              {full ? `Massimo ${LIMITS.effectsPerTrack} effetti` : 'Scegli…'}
            </option>
            {EFFECT_TYPES.map((type) => (
              <option key={type} value={type} title={EFFECT_INFO[type].description}>
                {EFFECT_INFO[type].name}
              </option>
            ))}
          </select>
        </label>
        <span className="hint">Il suono passa dagli effetti nell'ordine in cui sono elencati: l'ordine cambia il risultato.</span>
      </div>
      {track.effects.length === 0 && <p className="hint">Nessun effetto su questa traccia.</p>}
      <div className="effects-panel__list">
        {track.effects.map((effect, i) => (
          <EffectCard key={effect.id} trackId={track.id} effect={effect} isFirst={i === 0} isLast={i === track.effects.length - 1} />
        ))}
      </div>
    </div>
  )
}
