import * as Tone from 'tone'
import { activeVoicesAt } from '../music/drumPattern'
import { stepAtTicks, stepsPerBar } from '../music/timing'
import { usePlaybackStore } from '../state/playbackStore'
import { useProjectStore } from '../state/projectStore'
import type { DrumVoices } from './drums/types'

const STEP_VELOCITY = 0.9

/**
 * Ogni sedicesimo legge il pattern attuale dallo stato e fa suonare i colpi attivi.
 * Restituisce una funzione che rimuove la programmazione.
 */
export function scheduleDrumSequencer(voices: DrumVoices): () => void {
  const transport = Tone.getTransport()

  const id = transport.scheduleRepeat(
    (time) => {
      const { drumPattern, timeSignature } = useProjectStore.getState()
      const ticks = transport.getTicksAtTime(time)
      const step = stepAtTicks(ticks, transport.PPQ, stepsPerBar(timeSignature))

      for (const voice of activeVoicesAt(drumPattern, step)) {
        voices[voice].trigger(time, STEP_VELOCITY)
      }
      // La grafica si aggiorna quando il suono esce davvero, non quando viene programmato.
      // Con la scheda nascosta non si disegna: evita di accumulare aggiornamenti inutili.
      if (!document.hidden) {
        Tone.getDraw().schedule(() => usePlaybackStore.getState().setCurrentStep(step), time)
      }
    },
    '16n',
    0,
  )

  return () => transport.clear(id)
}
