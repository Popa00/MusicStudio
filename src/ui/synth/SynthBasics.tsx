import type { SynthSettings } from '../../project/types'
import { HERTZ, SECONDS } from '../controls/valueUnits'
import { Slider } from '../controls/Slider'

const WAVEFORMS: { value: SynthSettings['waveform']; label: string; hint: string }[] = [
  { value: 'sine', label: 'Sinusoide', hint: 'Puro e morbido, come un fischio' },
  { value: 'triangle', label: 'Triangolo', hint: 'Dolce, simile a un flauto' },
  { value: 'square', label: 'Quadra', hint: 'Vuoto e "da videogioco"' },
  { value: 'sawtooth', label: 'Dente di sega', hint: 'Ricco e brillante, il più usato per bassi e pad' },
]

interface Props {
  settings: SynthSettings
  /** Nota: cambiare una manopola rende il suono "Personalizzato". */
  onChange: (changes: Partial<SynthSettings>) => void
}

export function SynthBasics({ settings, onChange }: Props) {
  const edit = (changes: Partial<SynthSettings>) => onChange({ ...changes, preset: 'Personalizzato' })

  return (
    <div>
      <label className="slider" title="La forma d'onda è il 'colore' di base del suono">
        <span className="slider__label">Forma d'onda</span>
        <select value={settings.waveform} onChange={(e) => edit({ waveform: e.target.value as SynthSettings['waveform'] })}>
          {WAVEFORMS.map((w) => (
            <option key={w.value} value={w.value} title={w.hint}>
              {w.label}
            </option>
          ))}
        </select>
      </label>
      <Slider label="Brillantezza" hint="Filtro: più basso = suono più scuro e ovattato, più alto = più brillante" value={settings.cutoff} min={50} max={18000} scale="log" unit={HERTZ} onChange={(cutoff) => edit({ cutoff })} />
      <Slider label="Attacco" hint="Quanto tempo impiega la nota a raggiungere il volume pieno: corto = colpo secco, lungo = entra piano" value={settings.attack} min={0.001} max={4} scale="log" unit={SECONDS} onChange={(attack) => edit({ attack })} />
      <Slider label="Rilascio" hint="Quanto la nota continua a suonare dopo averla lasciata" value={settings.release} min={0.01} max={8} scale="log" unit={SECONDS} onChange={(release) => edit({ release })} />
    </div>
  )
}
