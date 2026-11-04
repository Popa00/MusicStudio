import type * as Tone from 'tone'
import { reportOnce } from '../../safety'
import { createDiffuser, type Diffuser } from './diffuser'
import { ALLPASS_GAIN, diffuserDelays, STEREO_SPREAD } from './network'

export interface Tail {
  /** Si risolve sempre (anche se il worklet non si carica): l'export può partire. */
  ready: Promise<void>
  dispose: () => void
}

/**
 * Collega la somma dei pettini di ogni lato al suo canale di `merge` passando dai passa-tutto
 * (AudioWorklet, caricato in modo asincrono: la coda entra appena è pronto).
 * Se il worklet non è disponibile, i pettini vanno direttamente a `merge`: riverbero meno "diffuso".
 */
export function attachDiffusers(ctx: Tone.BaseContext, sums: AudioNode[], merge: AudioNode): Tail {
  let disposed = false
  let diffusers: Diffuser[] = []

  function fallback(error: unknown, created: Diffuser[]): void {
    created.forEach((d, channel) => {
      sums[channel].disconnect(d.node)
      d.dispose()
    })
    reportOnce(error, 'riverbero')
    sums.forEach((sum, channel) => sum.connect(merge, 0, channel))
  }

  const spreads = [0, STEREO_SPREAD]
  const ready = Promise.allSettled(spreads.map((s) => createDiffuser(ctx, diffuserDelays(s), ALLPASS_GAIN))).then((results) => {
    const created = results.flatMap((r) => (r.status === 'fulfilled' ? [r.value] : []))
    const failed = results.find((r) => r.status === 'rejected')
    if (disposed) return created.forEach((d) => d.dispose())
    if (failed) return fallback(failed.reason, created)
    try {
      created.forEach((d, channel) => {
        sums[channel].connect(d.node)
        d.node.connect(merge, 0, channel)
      })
      diffusers = created
    } catch (error) {
      fallback(error, created)
    }
  })

  return {
    ready,
    dispose: () => {
      disposed = true
      diffusers.forEach((d) => d.dispose())
      diffusers = []
    },
  }
}
