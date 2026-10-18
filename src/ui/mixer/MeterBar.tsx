import { useEffect, useRef } from 'react'
import { meterFraction } from './meterScale'

/**
 * Indicatore di livello: si aggiorna a ogni fotogramma scrivendo direttamente sullo stile,
 * senza far ridisegnare React 60 volte al secondo.
 */
export function MeterBar({ getLevelDb }: { getLevelDb: () => number }) {
  const fill = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let frame = 0
    const update = () => {
      const db = getLevelDb()
      const el = fill.current
      if (el) {
        el.style.transform = `scaleY(${meterFraction(db)})`
        el.dataset.hot = db > -3 ? 'true' : 'false'
      }
      frame = requestAnimationFrame(update)
    }
    frame = requestAnimationFrame(update)
    return () => cancelAnimationFrame(frame)
  }, [getLevelDb])

  return (
    <div className="meter" title="Livello del suono: se diventa rosso è vicino al massimo">
      <div className="meter__fill" ref={fill} />
    </div>
  )
}
