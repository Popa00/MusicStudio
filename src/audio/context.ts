import * as Tone from 'tone'
import { guardContextTimeouts } from './safety'

/**
 * Il segno sta sul contesto stesso (non in una variabile del modulo): se Vite ricarica questo
 * file durante lo sviluppo, non si crea un secondo contesto chiudendo quello in uso.
 */
type MarkedContext = Tone.BaseContext & { musicStudioConfigured?: boolean }

/**
 * Prepara il contesto audio una volta sola, prima di creare qualsiasi suono.
 * "balanced" usa un buffer un po' più grande del minimo: qualche millisecondo di ritardo in più
 * sulla tastiera, ma molta più resistenza ai sovraccarichi (niente gracchiare con tante tracce).
 */
export function configureAudioContext(): void {
  if ((Tone.getContext() as MarkedContext).musicStudioConfigured) return
  Tone.setContext(new Tone.Context({ latencyHint: 'balanced', lookAhead: 0.1 }), true)
  const context = Tone.getContext() as MarkedContext
  context.musicStudioConfigured = true
  guardContextTimeouts(context)
}
