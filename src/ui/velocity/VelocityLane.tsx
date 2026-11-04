import { useRef, type PointerEvent } from 'react'
import { clampVelocity, formatVelocity } from '../../music/velocity'
import './velocity.css'

/** Altezza della striscia in pixel: una barretta alta tutta la striscia = intensità 100%. */
export const LANE_HEIGHT = 56

export interface VelocityItem {
  id: string
  step: number
  velocity: number
}

interface VelocityLaneProps {
  items: VelocityItem[]
  totalSteps: number
  /** Distanza tra l'inizio di uno step e il successivo. */
  stepWidth: number
  /** Larghezza della barretta (può essere minore di stepWidth se la griglia ha spazi). */
  barWidth: number
  /** `gestureKey` unisce tutto un trascinamento in un solo "annulla". */
  onChange: (ids: string[], velocity: number, gestureKey: string) => void
}

/**
 * Striscia delle intensità: una barretta per nota o colpo, più alta = più forte.
 * Clicca o trascina in verticale per cambiarla; trascinando in orizzontale si "dipinge" su più barrette.
 */
export function VelocityLane({ items, totalSteps, stepWidth, barWidth, onChange }: VelocityLaneProps) {
  const gesture = useRef<string | null>(null)

  function apply(e: PointerEvent<HTMLDivElement>, key: string) {
    const rect = e.currentTarget.getBoundingClientRect()
    const step = Math.floor((e.clientX - rect.left) / stepWidth)
    const ids = items.filter((item) => item.step === step).map((item) => item.id)
    if (ids.length === 0) return
    onChange(ids, clampVelocity(1 - (e.clientY - rect.top) / LANE_HEIGHT), key)
  }

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (e.button !== 0) return
    e.currentTarget.setPointerCapture(e.pointerId)
    gesture.current = `gesture:velocity:${crypto.randomUUID()}`
    apply(e, gesture.current)
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (gesture.current) apply(e, gesture.current)
  }

  function onPointerUp() {
    gesture.current = null
  }

  return (
    <div
      className="velocity-lane"
      style={{ width: totalSteps * stepWidth, height: LANE_HEIGHT }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {items.map((item) => (
        <div
          key={item.id}
          className="velocity-lane__bar"
          title={`Intensità ${formatVelocity(item.velocity)}`}
          style={{ left: item.step * stepWidth, width: barWidth, height: item.velocity * LANE_HEIGHT }}
        />
      ))}
    </div>
  )
}
