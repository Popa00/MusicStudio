import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => {
  // Simula Tone: getContext() restituisce l'ultimo contesto impostato con setContext().
  const state = { current: { id: 'default' } as Record<string, unknown> }
  return {
    state,
    setContext: vi.fn((ctx: Record<string, unknown>, _disposeOld?: boolean) => {
      state.current = ctx
    }),
    getContext: vi.fn(() => state.current),
    // `function` (non freccia): viene chiamato con `new`.
    Context: vi.fn(function (this: Record<string, unknown>, options: unknown) {
      this.options = options
    }),
    guard: vi.fn(),
  }
})

vi.mock('tone', () => ({
  setContext: mocks.setContext,
  getContext: mocks.getContext,
  Context: mocks.Context,
}))
vi.mock('./safety', () => ({ guardContextTimeouts: mocks.guard }))

describe('configureAudioContext', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
    mocks.state.current = { id: 'default' }
  })

  it('crea il contesto una sola volta anche se invocata più volte', async () => {
    const { configureAudioContext } = await import('./context')
    configureAudioContext()
    configureAudioContext()
    configureAudioContext()
    expect(mocks.setContext).toHaveBeenCalledTimes(1)
    expect(mocks.guard).toHaveBeenCalledTimes(1)
  })

  it('crea il contesto con latencyHint "balanced" e chiude quello precedente', async () => {
    const { configureAudioContext } = await import('./context')
    configureAudioContext()
    expect(mocks.Context.mock.calls[0][0]).toMatchObject({ latencyHint: 'balanced' })
    expect(mocks.setContext.mock.calls[0][1]).toBe(true)
  })

  it('applica guardContextTimeouts al nuovo contesto e lo segna come configurato', async () => {
    const { configureAudioContext } = await import('./context')
    configureAudioContext()
    expect(mocks.guard).toHaveBeenCalledWith(mocks.state.current)
    expect(mocks.state.current.musicStudioConfigured).toBe(true)
  })

  it('dopo una ricarica del modulo (HMR) non ricrea il contesto già configurato', async () => {
    const first = await import('./context')
    first.configureAudioContext()
    vi.resetModules()
    const reloaded = await import('./context')
    reloaded.configureAudioContext()
    expect(mocks.setContext).toHaveBeenCalledTimes(1)
  })
})
