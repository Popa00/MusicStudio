import { beforeEach, describe, expect, it, vi } from 'vitest'

const transport = vi.hoisted(() => ({
  callback: null as ((time: number) => void) | null,
  handlers: [] as (() => void)[],
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
import { eventsAtStep } from '../music/schedule'
import { scheduleSequencer } from './sequencer'
import type { AudioGraph } from './graph/graph'
import type { Project } from '../project/types'

const project = { bpm: 120, timeSignature: { beatsPerBar: 4, beatUnit: 4 } } as unknown as Project
const chased = { kind: 'note', trackId: 'chase', pitch: 60, durationSteps: 5, velocity: 1 } as const
const normal = { kind: 'note', trackId: 'normale', pitch: 40, durationSteps: 1, velocity: 1 } as const

function setup() {
  const played: string[] = []
  const graph = {
    track: (id: string) => ({ instrument: { play: () => played.push(id) } }),
  } as unknown as AudioGraph
  const source = { project: () => project, target: () => ({ mode: 'song' as const }), metronome: () => false }
  const stop = scheduleSequencer(graph, source, null)
  const start = () => transport.handlers.forEach((h) => h())
  return { played, stop, start, tick: () => transport.callback!(0) }
}

describe('scheduleSequencer: recupero delle note in corso', () => {
  beforeEach(() => {
    transport.handlers = []
    transport.on.mockReset().mockImplementation((name: string, h: () => void) => {
      if (name === 'start') transport.handlers.push(h)
    })
    transport.off.mockReset()
    transport.clear.mockReset()
    transport.scheduleRepeat.mockImplementation((cb: (time: number) => void) => {
      transport.callback = cb
      return 1
    })
    vi.mocked(sustainedNotesAt).mockReset().mockReturnValue([chased])
    vi.mocked(eventsAtStep).mockReset().mockImplementation(() => [])
  })

  it('si iscrive all\'evento start del trasporto', () => {
    setup()
    expect(transport.on).toHaveBeenCalledWith('start', expect.any(Function))
  })
  it('il primo step recupera le note in corso, gli step successivi no', () => {
    const { played, tick } = setup()
    tick()
    expect(played).toEqual(['chase'])
    tick()
    tick()
    expect(sustainedNotesAt).toHaveBeenCalledTimes(1)
    expect(played).toHaveLength(1)
  })
  it('dopo un nuovo start (salto) recupera di nuovo, una sola volta', () => {
    const { played, tick, start } = setup()
    tick()
    tick()
    start()
    tick()
    tick()
    expect(sustainedNotesAt).toHaveBeenCalledTimes(2)
    expect(played).toHaveLength(2)
  })
  it('le note in corso si aggiungono a quelle che iniziano nello step', () => {
    vi.mocked(eventsAtStep).mockImplementation(() => [normal])
    const { played, tick } = setup()
    tick()
    expect(played).toEqual(['normale', 'chase'])
  })
  it('se il recupero lancia un errore gli eventi dello step suonano comunque', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.mocked(eventsAtStep).mockImplementation(() => [normal])
    vi.mocked(sustainedNotesAt).mockImplementation(() => {
      throw new Error('recupero rotto')
    })
    const { played, tick } = setup()
    expect(() => tick()).not.toThrow()
    expect(played).toEqual(['normale'])
  })
  it('la funzione di pulizia chiama transport.off con lo stesso handler', () => {
    const { stop } = setup()
    const handler = transport.on.mock.calls[0][1]
    stop()
    expect(transport.off).toHaveBeenCalledWith('start', handler)
    expect(transport.clear).toHaveBeenCalledWith(1)
  })
})
