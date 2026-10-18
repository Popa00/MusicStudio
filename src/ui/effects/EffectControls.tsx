import type { EffectSettings } from '../../project/types'
import { formatDb, formatHz, formatPercent, formatSeconds } from '../controls/format'
import { Slider } from '../controls/Slider'

type Change = (changes: Partial<EffectSettings>) => void

const WET_HINT = "Quanto effetto si sente rispetto al suono originale ('mix')"
const DELAY_TIMES = [
  { value: '4n', label: '1/4 (un battito)' },
  { value: '8n', label: '1/8 (mezzo battito)' },
  { value: '8n.', label: '1/8 puntato (effetto "saltellante")' },
  { value: '16n', label: '1/16 (un quarto di battito)' },
] as const

/** Manopole specifiche per ogni tipo di effetto. */
export function EffectControls({ effect, onChange }: { effect: EffectSettings; onChange: Change }) {
  switch (effect.type) {
    case 'reverb':
      return (
        <>
          <Slider label="Durata" hint="Quanto dura la coda del riverbero: corto = stanza, lungo = cattedrale" value={effect.decay} min={0.2} max={10} scale="log" format={formatSeconds} onChange={(decay) => onChange({ decay })} />
          <Slider label="Quantità" hint={WET_HINT} value={effect.wet} min={0} max={1} format={formatPercent} onChange={(wet) => onChange({ wet })} />
        </>
      )
    case 'delay':
      return (
        <>
          <label className="slider" title="Distanza tra una ripetizione e l'altra, a tempo con il brano">
            <span className="slider__label">Tempo</span>
            <select value={effect.time} onChange={(e) => onChange({ time: e.target.value as typeof effect.time })}>
              {DELAY_TIMES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
          <Slider label="Ripetizioni" hint="Quante volte si ripete l'eco prima di sparire" value={effect.feedback} min={0} max={0.85} format={formatPercent} onChange={(feedback) => onChange({ feedback })} />
          <Slider label="Quantità" hint={WET_HINT} value={effect.wet} min={0} max={1} format={formatPercent} onChange={(wet) => onChange({ wet })} />
        </>
      )
    case 'filter':
      return (
        <>
          <label className="slider" title="Passa-basso toglie gli acuti; passa-alto toglie i bassi">
            <span className="slider__label">Tipo</span>
            <select value={effect.mode} onChange={(e) => onChange({ mode: e.target.value as typeof effect.mode })}>
              <option value="lowpass">Passa-basso (più scuro)</option>
              <option value="highpass">Passa-alto (più sottile)</option>
            </select>
          </label>
          <Slider label="Frequenza" hint="Il punto in cui il filtro inizia a tagliare" value={effect.frequency} min={20} max={20000} scale="log" format={formatHz} onChange={(frequency) => onChange({ frequency })} />
          <Slider label="Risonanza" hint="Enfatizza le frequenze vicino al taglio" value={effect.resonance} min={0.1} max={15} step={0.1} format={(v) => v.toFixed(1)} onChange={(resonance) => onChange({ resonance })} />
        </>
      )
    case 'eq':
      return (
        <>
          <Slider label="Bassi" value={effect.low} min={-24} max={12} step={0.5} format={formatDb} onChange={(low) => onChange({ low })} />
          <Slider label="Medi" value={effect.mid} min={-24} max={12} step={0.5} format={formatDb} onChange={(mid) => onChange({ mid })} />
          <Slider label="Acuti" value={effect.high} min={-24} max={12} step={0.5} format={formatDb} onChange={(high) => onChange({ high })} />
        </>
      )
    case 'distortion':
      return (
        <>
          <Slider label="Intensità" hint="Quanto viene 'sporcato' il suono" value={effect.amount} min={0} max={1} format={formatPercent} onChange={(amount) => onChange({ amount })} />
          <Slider label="Quantità" hint={WET_HINT} value={effect.wet} min={0} max={1} format={formatPercent} onChange={(wet) => onChange({ wet })} />
        </>
      )
  }
}
