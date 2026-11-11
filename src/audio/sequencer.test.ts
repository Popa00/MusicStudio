import { beforeEach, describe, expect, it, vi } from 'vitest'

const transport = vi.hoisted(() => ({
  callback: null as ((time: number) => void) | null,
  scheduleRepeat: vi.fn(),
  getTicksAtTime: vi.fn(() => 0),
  clear: vi.fn(),
  on: vi.fn(),
  off: vi.fn(),
  PPQ: 192,
}))

vi.mock('tone', () => ({ getTransport: () => transport }))
vi.mock('../music/schedule', () => ({ eventsAtStep: vi.fn() }))
vi.mock('../music/chase', () => ({ sustainedNotesAt: vi.fn(() => []) }))

import { eventsAtStep } from '../music/schedule'
import { resetReported } from './safety'
import { scheduleSequencer } from './sequencer'
import type { AudioGraph } from './graph/graph'
import type { Project } from '../project/types'

const project = { bpm: 120, timeSignature: { beats: 4, unit: 4 } } as unknown as Project

function setup(plays: Record<string, () => void>) {
  vi.mocked(eventsAtStep).mockReturnValue(Object.keys(plays).map((trackId) => ({ trackId })) as never)
  const played: string[] = []
  const graph = {
    track: (id: string) => ({
      instrument: {
        play: () => {
          played.push(id)
          plays[id]()
        },
      },
    }),
  } as unknown as AudioGraph
  const source = { project: () => project, target: () => ({ mode: 'song' as const }), metronome: () => false }
  scheduleSequencer(graph, source, null)
  return { played, tick: () => transport.callback!(0) }
}

describe('scheduleSequencer', () => {
  beforeEach(() => {
    resetReported()
    vi.mocked(eventsAtStep).mockReset()
    transport.scheduleRepeat.mockImplementation((cb: (time: number) => void) => {
      transport.callback = cb
      return 7
    })
  })

  it('se uno strumento lancia un errore gli altri eventi dello stesso step suonano comunque', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { played, tick } = setup({
      a: () => {},
      b: () => {
        throw new Error('errore-b')
      },
      c: () => {},
    })
    expect(() => tick()).not.toThrow()
    expect(played).toEqual(['a', 'b', 'c'])
  })

  it('emette il warn una sola volta per lo stesso messaggio', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    warn.mockClear()
    const { tick } = setup({
      a: () => {
        throw new Error('errore-ripetuto')
      },
    })
    tick()
    tick()
    tick()
    expect(warn).toHaveBeenCalledTimes(1)
  })

  it('segnala separatamente messaggi diversi', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    warn.mockClear()
    const messages = ['primo guasto', 'secondo problema']
    let n = 0
    const { tick } = setup({
      a: () => {
        throw new Error(messages[n++])
      },
    })
    tick()
    tick()
    expect(warn).toHaveBeenCalledTimes(2)
  })

  it('messaggi che differiscono solo per i numeri contano come uno solo', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    warn.mockClear()
    let n = 0
    const { tick } = setup({
      a: () => {
        throw new Error(`valore ${n++}.5`)
      },
    })
    tick()
    tick()
    expect(warn).toHaveBeenCalledTimes(1)
  })

  it('se eventsAtStep lancia il callback non propaga l\'eccezione', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { tick } = setup({})
    vi.mocked(eventsAtStep).mockImplementation(() => {
      throw new Error('eventi rotti')
    })
    expect(() => tick()).not.toThrow()
  })

  it('se source.project() lancia il callback non propaga l\'eccezione', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    const graph = { track: () => undefined } as unknown as AudioGraph
    const source = {
      project: () => {
        throw new Error('progetto non disponibile')
      },
      target: () => ({ mode: 'song' as const }),
      metronome: () => false,
    }
    scheduleSequencer(graph, source, null)
    expect(() => transport.callback!(0)).not.toThrow()
  })

  it('la funzione restituita rimuove la programmazione', () => {
    const graph = { track: () => undefined } as unknown as AudioGraph
    const stop = scheduleSequencer(graph, { project: () => project, target: () => ({ mode: 'song' }), metronome: () => false }, null)
    stop()
    expect(transport.clear).toHaveBeenCalledWith(7)
  })
})
