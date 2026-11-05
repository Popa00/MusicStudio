import { EditableValue } from './EditableValue'
import { logToPosition, positionToLog, RESOLUTION, roundSignificant } from './sliderScale'
import { PLAIN, type ValueUnit } from './valueUnits'
import './controls.css'

interface SliderProps {
  label: string
  /** Spiegazione mostrata passando il mouse. */
  hint?: string
  value: number
  min: number
  max: number
  step?: number
  /** "log" per frequenze e tempi. */
  scale?: 'linear' | 'log'
  /** Come mostrare il valore e leggere quello scritto a mano (predefinito: numero con un decimale). */
  unit?: ValueUnit
  onChange: (value: number) => void
}

export function Slider({ label, hint, value, min, max, step = 0.01, scale = 'linear', unit = PLAIN, onChange }: SliderProps) {
  const isLog = scale === 'log'
  const position = isLog ? logToPosition(value, min, max) : value

  function handleChange(raw: number) {
    onChange(isLog ? roundSignificant(positionToLog(raw, min, max)) : raw)
  }

  return (
    <label className="slider" title={hint}>
      <span className="slider__label">{label}</span>
      <input
        type="range"
        min={isLog ? 0 : min}
        max={isLog ? RESOLUTION : max}
        step={isLog ? 1 : step}
        value={position}
        onChange={(e) => handleChange(Number(e.target.value))}
      />
      <EditableValue className="slider__value" value={value} min={min} max={max} unit={unit} label={label} round={isLog ? roundSignificant : undefined} onChange={onChange} />
    </label>
  )
}
