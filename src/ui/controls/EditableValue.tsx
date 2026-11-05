import { useRef, useState, type KeyboardEvent } from 'react'
import type { ValueUnit } from './valueUnits'

interface EditableValueProps {
  value: number
  min: number
  max: number
  unit: ValueUnit
  /** Nome del valore per i lettori di schermo (es. "Velocità"). */
  label: string
  /** Arrotondamento del valore scritto (es. a un numero "leggibile" sui cursori logaritmici). */
  round?: (value: number) => number
  className?: string
  onChange: (value: number) => void
}

/**
 * Il valore accanto a un cursore: un clic lo trasforma in un campo dove scriverlo.
 * Invio (o clic altrove) conferma, Esc annulla. Un valore fuori scala si ferma al limite.
 */
export function EditableValue({ value, min, max, unit, label, round, className = '', onChange }: EditableValueProps) {
  const [editing, setEditing] = useState(false)
  const cancelled = useRef(false)

  function commit(text: string) {
    setEditing(false)
    if (cancelled.current) return
    const parsed = unit.parse(text, value)
    if (parsed === null || Number.isNaN(parsed)) return
    const clamped = Math.min(max, Math.max(min, parsed))
    onChange(round ? round(clamped) : clamped)
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') e.currentTarget.blur()
    if (e.key === 'Escape') {
      cancelled.current = true
      e.currentTarget.blur()
    }
  }

  if (editing) {
    return (
      <input
        type="text"
        className={`editable-value editable-value--editing ${className}`}
        aria-label={label}
        defaultValue={unit.format(value)}
        autoFocus
        onFocus={(e) => e.currentTarget.select()}
        onKeyDown={onKeyDown}
        onBlur={(e) => commit(e.currentTarget.value)}
      />
    )
  }
  return (
    <button
      type="button"
      className={`editable-value ${className}`}
      aria-label={`${label}: ${unit.format(value)}, clic per scrivere il valore`}
      title="Clic per scrivere il valore"
      onClick={() => {
        cancelled.current = false
        setEditing(true)
      }}
    >
      {unit.format(value)}
    </button>
  )
}
