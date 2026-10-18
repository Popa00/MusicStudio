import type { SynthSettings } from '../../project/types'
import { formatPercent, formatSeconds } from '../controls/format'
import { Slider } from '../controls/Slider'

interface Props {
  settings: SynthSettings
  onChange: (changes: Partial<SynthSettings>) => void
}

/** Parametri meno intuitivi: decadimento, sostegno e risonanza del filtro. */
export function SynthAdvanced({ settings, onChange }: Props) {
  const edit = (changes: Partial<SynthSettings>) => onChange({ ...changes, preset: 'Personalizzato' })

  return (
    <div className="synth-panel__advanced">
      <p className="hint">
        Attacco, Decadimento, Sostegno e Rilascio (ADSR) descrivono come il volume di una nota nasce, si assesta e si spegne.
      </p>
      <Slider label="Decadimento" hint="Dopo l'attacco, quanto tempo impiega il volume a scendere fino al livello di sostegno" value={settings.decay} min={0.01} max={4} scale="log" format={formatSeconds} onChange={(decay) => edit({ decay })} />
      <Slider label="Sostegno" hint="Volume che la nota mantiene finché il tasto resta premuto (0% = la nota si spegne da sola)" value={settings.sustain} min={0} max={1} format={formatPercent} onChange={(sustain) => edit({ sustain })} />
      <Slider label="Risonanza" hint="Enfatizza le frequenze vicino al punto del filtro: valori alti danno un suono 'fischiante'" value={settings.resonance} min={0.1} max={15} step={0.1} format={(v) => v.toFixed(1)} onChange={(resonance) => edit({ resonance })} />
    </div>
  )
}
