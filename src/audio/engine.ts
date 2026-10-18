import * as Tone from 'tone'
import { bindStoresToEngine } from './bindings'
import { createDrumKit } from './drums/kit'
import { getMasterInput } from './master'
import { scheduleDrumSequencer } from './sequencer'
import { setupLoop, stopTransport } from './transport'

let teardown: (() => void) | null = null

/** Il browser permette l'audio solo dopo un gesto dell'utente (click, tasto). */
export async function startAudio(): Promise<void> {
  await Tone.start()
  teardown ??= initEngine()
}

/** Ferma il motore e libera tutte le risorse audio. */
export function stopAudioEngine(): void {
  teardown?.()
  teardown = null
}

export function isAudioRunning(): boolean {
  return Tone.getContext().state === 'running'
}

/** Se qualcosa fallisce a metà, libera quanto già creato: un nuovo tentativo riparte da zero. */
function initEngine(): () => void {
  const cleanups: Array<() => void> = []
  const runCleanups = () => {
    for (const cleanup of cleanups.reverse()) cleanup()
  }

  try {
    const kit = createDrumKit(getMasterInput())
    cleanups.push(kit.dispose)
    setupLoop()
    cleanups.push(scheduleDrumSequencer(kit.voices))
    cleanups.push(bindStoresToEngine())
    cleanups.push(stopTransport)
  } catch (error) {
    runCleanups()
    throw error
  }
  return runCleanups
}

// Sviluppo: quando Vite ricarica questo modulo (o gli store), ricollega il motore da capo.
if (import.meta.hot) {
  import.meta.hot.dispose((data) => {
    data.wasRunning = teardown !== null
    stopAudioEngine()
  })
  if (import.meta.hot.data.wasRunning) teardown = initEngine()
}
