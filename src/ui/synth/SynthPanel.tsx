import { useState } from 'react'
import { findPreset, PRESET_CATEGORIES, SYNTH_PRESETS } from '../../project/synthPresets'
import type { SynthTrack } from '../../project/types'
import { applyPreset, setSynth } from '../../state/actions/trackActions'
import { noFocus } from '../keepFocusOnMouseDown'
import { SynthAdvanced } from './SynthAdvanced'
import { SynthBasics } from './SynthBasics'
import './synth.css'

/** Suono dello strumento: un preset di partenza e poche manopole, con le altre in "Avanzate". */
export function SynthPanel({ track }: { track: SynthTrack }) {
  const [advanced, setAdvanced] = useState(false)
  const settings = track.synth
  const change = (changes: Partial<typeof settings>) => setSynth(track.id, changes)

  return (
    <div className="synth-panel">
      <h3>Suono</h3>
      <label className="synth-panel__preset">
        Preset{' '}
        <select value={findPreset(settings.preset) ? settings.preset : ''} onChange={(e) => applyPreset(track.id, e.target.value)}>
          {!findPreset(settings.preset) && <option value="">Personalizzato</option>}
          {PRESET_CATEGORIES.map((category) => (
            <optgroup key={category} label={category}>
              {SYNTH_PRESETS.filter((p) => p.category === category).map((p) => (
                <option key={p.name} value={p.name} title={p.description}>
                  {p.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </label>
      <p className="hint">{findPreset(settings.preset)?.description}</p>
      <SynthBasics settings={settings} onChange={change} />
      <button className="button-small button-secondary" onClick={() => setAdvanced(!advanced)} {...noFocus}>
        {advanced ? 'Nascondi avanzate' : 'Mostra avanzate'}
      </button>
      {advanced && <SynthAdvanced settings={settings} onChange={change} />}
    </div>
  )
}
