import * as Tone from 'tone'
import type { Track } from '../../project/types'
import { createEffect } from '../effects/create'
import type { EffectNode } from '../effects/types'
import { createInstrument } from '../instruments/create'
import type { Instrument } from '../instruments/types'

/** Una traccia nel motore: strumento → effetti → canale (volume, pan, muto, solo). */
export interface TrackNode {
  track: Track
  instrument: Instrument
  effects: EffectNode[]
  channel: Tone.Channel
  meter: Tone.Meter
}

/** Identifica la "forma" della catena: se cambia, gli effetti vanno ricreati. */
function chainShape(track: Track): string {
  return track.effects.filter((e) => e.enabled).map((e) => `${e.id}:${e.type}`).join('|')
}

function buildChain(node: TrackNode): void {
  for (const effect of node.effects) effect.dispose()
  node.instrument.output.disconnect()
  node.effects = node.track.effects.filter((e) => e.enabled).map(createEffect)
  let previous: Tone.ToneAudioNode = node.instrument.output
  for (const effect of node.effects) {
    previous.connect(effect.input)
    previous = effect.output
  }
  previous.connect(node.channel)
}

function applyMixer(channel: Tone.Channel, track: Track): void {
  channel.volume.rampTo(track.mixer.volumeDb, 0.05)
  channel.pan.rampTo(track.mixer.pan, 0.05)
  channel.mute = track.mixer.mute
  channel.solo = track.mixer.solo
}

export function createTrackNode(track: Track, destination: Tone.InputNode): TrackNode {
  const channel = new Tone.Channel().connect(destination)
  const meter = new Tone.Meter({ smoothing: 0.8 })
  channel.connect(meter)
  const node: TrackNode = { track, instrument: createInstrument(track), effects: [], channel, meter }
  applyMixer(channel, track)
  buildChain(node)
  return node
}

export function updateTrackNode(node: TrackNode, track: Track): void {
  const previous = node.track
  if (track === previous) return
  node.track = track
  node.instrument.update(track)
  if (track.mixer !== previous.mixer) applyMixer(node.channel, track)
  if (track.effects === previous.effects) return
  if (chainShape(track) !== chainShape(previous)) {
    buildChain(node)
    return
  }
  const enabled = track.effects.filter((e) => e.enabled)
  enabled.forEach((settings, i) => node.effects[i].update(settings))
}

export function disposeTrackNode(node: TrackNode): void {
  node.instrument.dispose()
  for (const effect of node.effects) effect.dispose()
  node.channel.dispose()
  node.meter.dispose()
}
