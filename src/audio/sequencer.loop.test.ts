import { beforeEach, describe, expect, it, vi } from 'vitest'

const transport = vi.hoisted(() => ({
  callback: null as ((time: number) => void) | null,
  handlers: {} as Record<string, (() => void)[]>,
  scheduleRepeat: vi.fn(),
  getTicksAtTime: vi.fn(() => 0),
  clear: vi.fn(),
  on: vi.fn(),
  off: vi.fn(),
  PPQ: 192,
}))

vi.mock('tone', () => ({ getTransport: () => transport }))
vi.mock('../music/schedule', () => ({ eventsAtStep: vi.fn(() => []) }))
vi.mock('../music/chase', () => ({ sustainedNotesAt: vi.fn(() => []) }))

import { sustainedNotesAt } from '../music/chase'
import type { Project } from '../project/types'
import type { AudioGraph } from './graph/graph'
import { scheduleSequencer } from './sequencer'

const project = { bpm: 120, timeSignature: { beatsPerBar: 4, beatUnit: 4 } } as unknown as Project
const chased = { kind: 'note', trackId: 'chase', pitch: 60, durationSteps: 5, velocity: 1 } as const

function setup() {
  const played: string[] = []
  const graph = { track: (id: string) => ({ instrument: { play: () => played.push(id) } }) } as unknown as AudioGraph
  const source = { project: () => project, target: () => ({ mode: 'song' as const }), metronome: () => false }
  const stop = scheduleSequencer(graph, source, null)
  const emit = (name: string) => (transport.handlers[name] ?? []).forEach((h) => h())
  return { played, stop, emit, tick: () => transport.callback!(0) }
}

describe('scheduleSequencer: evento loop del trasporto', () => {
  beforeEach(() => {
    transport.handlers = {}
    transport.on.mockReset().mockImplementation((name: string, h: () => void) => {
      ;(transport.handlers[name] ??= []).push(h)
    })
    transport.off.mockReset()
    transport.clear.mockReset()
    transport.scheduleRepeat.mockImplementation((cb: (time: number) => void) => {
      transport.callback = cb
      return 7
    })
    vi.mocked(sustainedNotesAt).mockReset().mockReturnValue([chased])
  })

  it('si iscrive sia a start sia a loop', () => {
    setup()
    expect(transport.on).toHaveBeenCalledWith('start', expect.any(Function))
    expect(transport.on).toHaveBeenCalledWith('loop', expect.any(Function))
  })
  it('quando il giro ricomincia (loop) recupera le note in corso, una sola volta', () => {
    const { played, tick, emit } = setup()
    tick()
    tick()
    expect(sustainedNotesAt).toHaveBeenCalledTimes(1)
    emit('loop')
    tick()
    tick()
    expect(sustainedNotesAt).toHaveBeenCalledTimes(2)
    expect(played).toEqual(['chase', 'chase'])
  })
  it('la pulizia rimuove entrambi gli handler', () => {
    const { stop } = setup()
    stop()
    const names = transport.off.mock.calls.map((c) => c[0]).sort()
    expect(names).toEqual(['loop', 'start'])
    for (const [name, handler] of transport.off.mock.calls) {
      expect(transport.on).toHaveBeenCalledWith(name, handler)
    }
  })
})
