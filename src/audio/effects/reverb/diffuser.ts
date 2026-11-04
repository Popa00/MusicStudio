import type * as Tone from 'tone'
import { reportOnce } from '../../safety'
// no-inline: sempre un file vero sullo stesso indirizzo dell'app (un URL data: sarebbe bloccato dalla CSP).
import moduleUrl from './allpass.worklet.js?url&no-inline'

const PROCESSOR = 'allpass-chain'

/** Contesto audio "grezzo" con il caricatore dei moduli AudioWorklet. */
interface WorkletHost {
  audioWorklet?: { addModule: (url: string) => Promise<void> }
}

/**
 * Un caricamento per contesto (dal vivo e ogni export offline hanno il proprio).
 * Non usa addAudioWorkletModule di Tone: Tone ricorda un solo modulo per contesto e
 * ignorerebbe gli altri.
 */
const loaded = new WeakMap<object, Promise<void>>()

function loadModule(ctx: Tone.BaseContext): Promise<void> {
  const raw = ctx.rawContext as unknown as WorkletHost
  let promise = loaded.get(raw)
  if (!promise) {
    if (!raw.audioWorklet) return Promise.reject(new Error('AudioWorklet non disponibile in questo browser'))
    promise = raw.audioWorklet.addModule(moduleUrl)
    loaded.set(raw, promise)
    // Un errore temporaneo non deve bloccare i riverberi creati dopo: si riproverà.
    promise.catch(() => loaded.delete(raw))
  }
  return promise
}

export interface Diffuser {
  node: AudioNode
  dispose: () => void
}

/** Catena di passa-tutto (mono) con i ritardi dati in secondi. */
export async function createDiffuser(ctx: Tone.BaseContext, delaysSeconds: number[], gain: number): Promise<Diffuser> {
  await loadModule(ctx)
  const node = ctx.createAudioWorkletNode(PROCESSOR, {
    numberOfInputs: 1,
    numberOfOutputs: 1,
    outputChannelCount: [1],
    channelCount: 1,
    channelCountMode: 'explicit',
    processorOptions: { delaysSeconds, gain },
  })
  // Un errore dentro il processore renderebbe il riverbero muto senza avvisi.
  node.onprocessorerror = (event) => reportOnce(event, 'riverbero')
  return {
    node,
    dispose: () => {
      node.port.postMessage('stop')
      node.disconnect()
    },
  }
}
