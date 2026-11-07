import * as Tone from 'tone'
import { createNoiseBurst } from './blip'
import type { AudioOutput, DrumVoice } from './types'

/**
 * Snap: colpo secco da drum machine, ispirato allo schiocco di dita (all'ascolto non sembrava
 * uno schiocco vero, quindi nell'app si chiama solo "Snap"). Tre strati: scatto acuto, "pop"
 * risonante stretto sui 2-3 kHz (25 ms), piccola coda di stanza sui medi.
 */
export function createSnap(output: AudioOutput): DrumVoice {
  const clickFilter = new Tone.Filter({ type: 'highpass', frequency: 4000, Q: 0.5 }).connect(output)
  const click = createNoiseBurst(clickFilter, 0.0003, 0.004, 2)
  const popFilter = new Tone.Filter({ type: 'bandpass', frequency: 2600, Q: 6 }).connect(output)
  const pop = createNoiseBurst(popFilter, 0.0005, 0.025, 20)
  const roomFilter = new Tone.Filter({ type: 'bandpass', frequency: 1600, Q: 1 }).connect(output)
  const room = createNoiseBurst(roomFilter, 0.004, 0.11, -4)

  return {
    trigger: (time, velocity) => {
      click.trigger(time, velocity)
      pop.trigger(time, velocity)
      room.trigger(time, velocity * 0.6)
    },
    dispose: () => {
      for (const part of [click, pop, room, clickFilter, popFilter, roomFilter]) part.dispose()
    },
  }
}
