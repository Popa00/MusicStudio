import { describe, expect, it, vi } from 'vitest'
import { MIN_GAP_SECONDS, monotonic, nextTriggerTime } from './monotonic'
import type { DrumVoice } from './types'

describe('nextTriggerTime', () => {
  it('lascia invariato un tempo in avanti', () => {
    expect(nextTriggerTime(2, 1, 0)).toBe(2)
  })

  it('sposta un tempo uguale all\'ultimo a last + distacco minimo', () => {
    expect(nextTriggerTime(1, 1, 0)).toBe(1 + MIN_GAP_SECONDS)
  })

  it('sposta un tempo precedente all\'ultimo a last + distacco minimo', () => {
    expect(nextTriggerTime(0.5, 1, 0)).toBe(1 + MIN_GAP_SECONDS)
  })

  it('accetta il primo colpo con last = -Infinity a un tempo non nel passato', () => {
    expect(nextTriggerTime(0, -Infinity, 0)).toBe(0)
    expect(nextTriggerTime(-3, -Infinity, -5)).toBe(-3)
  })

  it('sposta a now un tempo nel passato rispetto a now', () => {
    expect(nextTriggerTime(1, -Infinity, 5)).toBe(5)
  })
})

describe('monotonic', () => {
  function fakeVoice() {
    const trigger = vi.fn()
    const dispose = vi.fn()
    const voice: DrumVoice = { trigger, dispose }
    return { voice, trigger, dispose }
  }
  const times = (trigger: ReturnType<typeof vi.fn>) => trigger.mock.calls.map((c) => c[0] as number)

  it('passa alla voce tempi sempre strettamente crescenti anche con colpi fuori ordine', () => {
    const { voice, trigger } = fakeVoice()
    const wrapped = monotonic(voice, () => 0)
    for (const t of [1, 0.5, 1, 1, 3, 2, 2.9]) wrapped.trigger(t, 1)
    const out = times(trigger)
    expect(out).toHaveLength(7)
    for (let i = 1; i < out.length; i++) expect(out[i]).toBeGreaterThan(out[i - 1])
  })

  it('non altera i tempi già crescenti', () => {
    const { voice, trigger } = fakeVoice()
    const wrapped = monotonic(voice, () => 0)
    wrapped.trigger(0, 1)
    wrapped.trigger(1, 1)
    expect(times(trigger)).toEqual([0, 1])
  })

  it('inoltra la velocity invariata', () => {
    const { voice, trigger } = fakeVoice()
    const wrapped = monotonic(voice, () => 0)
    wrapped.trigger(1, 0.3)
    wrapped.trigger(0, 0.9)
    expect(trigger.mock.calls.map((c) => c[1])).toEqual([0.3, 0.9])
  })

  it('inoltra dispose alla voce interna', () => {
    const { voice, dispose } = fakeVoice()
    monotonic(voice, () => 0).dispose()
    expect(dispose).toHaveBeenCalledTimes(1)
  })

  it('tiene lo stato separato per ogni voce', () => {
    const a = fakeVoice()
    const b = fakeVoice()
    monotonic(a.voice, () => 0).trigger(10, 1)
    monotonic(b.voice, () => 0).trigger(1, 1)
    expect(b.trigger.mock.calls[0][0]).toBe(1)
  })

  it('sposta a now un colpo con tempo nel passato', () => {
    const { voice, trigger } = fakeVoice()
    monotonic(voice, () => 5).trigger(1, 1)
    expect(times(trigger)).toEqual([5])
  })

  it('porta due colpi passati a now e now + distacco minimo', () => {
    const { voice, trigger } = fakeVoice()
    const wrapped = monotonic(voice, () => 5)
    wrapped.trigger(1, 1)
    wrapped.trigger(2, 1)
    expect(times(trigger)).toEqual([5, 5 + MIN_GAP_SECONDS])
  })

  it('ignora NaN e Infinity senza chiamare la voce', () => {
    const { voice, trigger } = fakeVoice()
    const wrapped = monotonic(voice, () => 0)
    wrapped.trigger(NaN, 1)
    wrapped.trigger(Infinity, 1)
    wrapped.trigger(-Infinity, 1)
    expect(trigger).not.toHaveBeenCalled()
  })

  it('non si avvelena dopo NaN o Infinity: i colpi successivi suonano normalmente', () => {
    const { voice, trigger } = fakeVoice()
    const wrapped = monotonic(voice, () => 0)
    wrapped.trigger(1, 1)
    wrapped.trigger(Infinity, 1)
    wrapped.trigger(NaN, 1)
    wrapped.trigger(2, 1)
    expect(times(trigger)).toEqual([1, 2])
  })
})
