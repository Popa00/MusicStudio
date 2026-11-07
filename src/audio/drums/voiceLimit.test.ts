import { describe, expect, it } from 'vitest'
import { createVoiceLimit } from './voiceLimit'

describe('createVoiceLimit', () => {
  it('spegne il colpo più vecchio oltre il massimo', () => {
    const released: number[] = []
    const limit = createVoiceLimit<number>((n) => released.push(n), 2)
    limit.add(1)
    limit.add(2)
    limit.add(3)
    expect(released).toEqual([1])
  })

  it('un colpo finito non conta più', () => {
    const released: number[] = []
    const limit = createVoiceLimit<number>((n) => released.push(n), 2)
    limit.add(1)
    limit.remove(1)
    limit.add(2)
    limit.add(3)
    expect(released).toEqual([])
  })

  it('clear spegne tutti i colpi rimasti', () => {
    const limit = createVoiceLimit<number>(() => {}, 4)
    limit.add(1)
    limit.add(2)
    const cleared: number[] = []
    limit.clear((n) => cleared.push(n))
    expect(cleared).toEqual([1, 2])
  })
})
