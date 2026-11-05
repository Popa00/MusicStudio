import * as Tone from 'tone'
import type { Track } from '../../project/types'
import { createEffect } from '../effects/create'
import type { EffectNode } from '../effects/types'
import { createInstrument } from '../instruments/create'
import type { Instrument } from '../instruments/types'
import { createBalance, type Balance } from './balance'

/**
 * Una traccia nel motore: strumento → effetti → bilanciamento (pan) → canale (volume, muto, solo).
 * Tutto in stereo: il canale di Tone di default riduceva a mono e il riverbero perdeva l'ampiezza.
 * Il pan è il nostro (vedi balance.ts): quello di Tone con ingresso stereo cambiava i volumi.
 */
export interface TrackNode {
  track: Track
  instrument: Instrument
  effects: EffectNode[]
  balance: Balance
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
  previous.connect(node.balance.input)
}

function applyMixer(node: Pick<TrackNode, 'channel' | 'balance'>, track: Track): void {
  const { channel } = node
  channel.volume.rampTo(track.mixer.volumeDb, 0.05)
  node.balance.setPan(track.mixer.pan)
  channel.mute = track.mixer.mute
  channel.solo = track.mixer.solo
}

export function createTrackNode(track: Track, destination: Tone.InputNode): TrackNode {
  const channel = new Tone.Channel({ channelCount: 2 }).connect(destination)
  const balance = createBalance(track.mixer.pan)
  balance.output.connect(channel)
  const meter = new Tone.Meter({ smoothing: 0.8 })
  channel.connect(meter)
  const node: TrackNode = { track, instrument: createInstrument(track), effects: [], balance, channel, meter }
  applyMixer(node, track)
  buildChain(node)
  return node
}

export function updateTrackNode(node: TrackNode, track: Track): void {
  const previous = node.track
  if (track === previous) return
  node.track = track
  node.instrument.update(track)
  if (track.mixer !== previous.mixer) applyMixer(node, track)
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
  node.balance.dispose()
  node.channel.dispose()
  node.meter.dispose()
}
