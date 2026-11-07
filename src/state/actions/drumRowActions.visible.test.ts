import { describe, expect, it } from 'vitest'
import { BASE_DRUM_VOICES, createEmptyPattern } from '../../music/drumPattern'
import type { DrumPatternData } from '../../project/types'
import { visibleDrumVoices } from './drumRowActions'

const pattern = (steps = createEmptyPattern(16)): DrumPatternData => ({
  id: 'p', trackId: 't', name: 'P', lengthBars: 1, kind: 'drums', steps,
})

describe('visibleDrumVoices', () => {
  it('senza righe aggiunte né colpi mostra solo i 5 suoni di base', () => {
    expect(visibleDrumVoices(pattern(), [])).toEqual([...BASE_DRUM_VOICES])
  })
  it("aggiunge le righe richieste nell'ordine di DRUM_VOICES, non in quello di aggiunta", () => {
    expect(visibleDrumVoices(pattern(), ['perc', 'kick808'])).toEqual([...BASE_DRUM_VOICES, 'kick808', 'perc'])
  })
  it('mostra una riga extra che ha colpi anche se non è stata aggiunta', () => {
    const steps = createEmptyPattern(16)
    steps.cowbell[4] = 0.8
    expect(visibleDrumVoices(pattern(steps), [])).toEqual([...BASE_DRUM_VOICES, 'cowbell'])
  })
  it('non duplica una riga aggiunta che ha anche colpi', () => {
    const steps = createEmptyPattern(16)
    steps.snap[0] = 1
    expect(visibleDrumVoices(pattern(steps), ['snap', 'snap'])).toEqual([...BASE_DRUM_VOICES, 'snap'])
  })
  it('con pattern di lunghezza zero mostra comunque le righe di base', () => {
    expect(visibleDrumVoices(pattern(createEmptyPattern(0)), [])).toEqual([...BASE_DRUM_VOICES])
  })
})
