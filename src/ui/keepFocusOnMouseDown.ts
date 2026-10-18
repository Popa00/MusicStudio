import type { MouseEvent } from 'react'

/**
 * Impedisce che un click del mouse sposti il focus sul pulsante.
 * Così la barra spaziatrice resta Play/Stop invece di "ripremere" l'ultimo pulsante cliccato.
 * La navigazione da tastiera (Tab) continua a funzionare.
 */
export function keepFocusOnMouseDown(e: MouseEvent<HTMLElement>): void {
  e.preventDefault()
}

/** Props da aggiungere ai pulsanti dell'app. */
export const noFocus = { onMouseDown: keepFocusOnMouseDown }
