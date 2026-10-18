import { logToPosition, positionToLog, RESOLUTION, roundSignificant } from './sliderScale'
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
  format?: (value: number) => string
  onChange: (value: number) => void
}

export function Slider({ label, hint, value, min, max, step = 0.01, scale = 'linear', format, onChange }: SliderProps) {
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
      <output className="slider__value">{format ? format(value) : value}</output>
    </label>
  )
}
