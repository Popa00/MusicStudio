import { beforeEach, describe, expect, it, vi } from 'vitest'
import { errorKey, guardContextTimeouts, reportOnce, resetReported, safely } from './safety'

beforeEach(() => {
  resetReported()
  vi.restoreAllMocks()
})

describe('errorKey', () => {
  it('sostituisce numeri interi, decimali, negativi ed esponenziali con #', () => {
    expect(errorKey(new Error('a 5 b 0.31 c -2 d 1e-7 e 2.5E+3'))).toBe('Error: a # b # c # d # e #')
  })

  it('include il nome dell\'errore', () => {
    expect(errorKey(new RangeError('x'))).toBe('RangeError: x')
  })

  it('accetta valori non Error', () => {
    expect(errorKey('valore 12')).toBe('valore #')
  })

  it('limita la lunghezza a 200 caratteri', () => {
    expect(errorKey(new Error('a'.repeat(500)))).toHaveLength(200)
  })
})

describe('reportOnce', () => {
  it('segnala una sola volta messaggi che differiscono solo per i numeri', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    reportOnce(new Error('valore 1'), 'x')
    reportOnce(new Error('valore 2.5'), 'x')
    expect(warn).toHaveBeenCalledTimes(1)
  })

  it('segnala separatamente messaggi diversi', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    reportOnce(new Error('uno'), 'x')
    reportOnce(new Error('due'), 'x')
    expect(warn).toHaveBeenCalledTimes(2)
  })

  it('ricorda al massimo 50 chiavi: oltre, non segnala più', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    for (let i = 0; i < 60; i++) reportOnce(new Error(`errore-${'a'.repeat(i)}`), 'x')
    expect(warn).toHaveBeenCalledTimes(50)
  })

  it('resetReported permette di segnalare di nuovo', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    reportOnce(new Error('uno'), 'x')
    resetReported()
    reportOnce(new Error('uno'), 'x')
    expect(warn).toHaveBeenCalledTimes(2)
  })

  it('resetReported libera anche il limite di 50', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    for (let i = 0; i < 60; i++) reportOnce(new Error('e' + 'a'.repeat(i)), 'x')
    resetReported()
    warn.mockClear()
    reportOnce(new Error('nuovo'), 'x')
    expect(warn).toHaveBeenCalledTimes(1)
  })
})

describe('safely', () => {
  it('esegue la funzione', () => {
    const fn = vi.fn()
    safely(fn)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('non propaga l\'errore e lo segnala con il contesto', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(() =>
      safely(() => {
        throw new Error('boom')
      }, 'mio punto'),
    ).not.toThrow()
    expect(warn).toHaveBeenCalledTimes(1)
    expect(String(warn.mock.calls[0][0])).toContain('mio punto')
  })

  it('segnala una sola volta lo stesso errore ripetuto', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    for (let i = 0; i < 3; i++) {
      safely(() => {
        throw new Error('boom')
      })
    }
    expect(warn).toHaveBeenCalledTimes(1)
  })
})

describe('guardContextTimeouts', () => {
  function host() {
    const setTimeout = vi.fn((_fn: (...args: unknown[]) => void, _t: number) => 42)
    const context = { setTimeout }
    guardContextTimeouts(context)
    return { context, original: setTimeout }
  }

  it('restituisce l\'id del timer originale', () => {
    const { context } = host()
    expect(context.setTimeout(() => {}, 10)).toBe(42)
  })

  it('inoltra il timeout all\'originale', () => {
    const { context, original } = host()
    context.setTimeout(() => {}, 123)
    expect(original.mock.calls[0][1]).toBe(123)
  })

  it('il callback avvolto non lancia anche se quello originale lancia', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { context, original } = host()
    context.setTimeout(() => {
      throw new Error('rilascio fallito')
    }, 1)
    const wrapped = original.mock.calls[0][0]
    expect(() => wrapped()).not.toThrow()
  })

  it('il callback avvolto inoltra gli argomenti', () => {
    const { context, original } = host()
    const fn = vi.fn()
    context.setTimeout(fn, 1)
    original.mock.calls[0][0]('a', 2)
    expect(fn).toHaveBeenCalledWith('a', 2)
  })
})
