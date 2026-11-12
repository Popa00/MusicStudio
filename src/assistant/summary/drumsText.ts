import { DRUM_VOICES } from '../../music/drumPattern'
import { stepsPerBar, stepsPerBeat, type TimeSignature } from '../../music/timing'
import type { DrumPatternData } from '../../project/types'
import { VOICE_LABELS } from '../../music/voiceLabels'

/** Le battute mostrate al massimo per ogni suono, se sono diverse tra loro. */
const MAX_BARS = 4

/** Una battuta come griglia: un simbolo per sedicesimo, uno spazio tra un battito e l'altro. */
function barGrid(row: readonly number[], bar: number, ts: TimeSignature): string {
  const perBar = stepsPerBar(ts)
  const perBeat = stepsPerBeat(ts)
  let grid = ''
  for (let i = 0; i < perBar; i++) {
    if (i > 0 && i % perBeat === 0) grid += ' '
    const velocity = row[bar * perBar + i] ?? 0
    grid += velocity === 0 ? '.' : velocity < 0.5 ? 'o' : 'x'
  }
  return grid
}

/** Una riga per ogni suono di batteria che ha almeno un colpo. */
export function describeDrumPattern(pattern: DrumPatternData, ts: TimeSignature): string[] {
  const lines: string[] = []
  for (const voice of DRUM_VOICES) {
    const row = pattern.steps[voice]
    if (!row.some((v) => v > 0)) continue
    const bars = Array.from({ length: pattern.lengthBars }, (_, bar) => barGrid(row, bar, ts))
    const allSame = bars.every((g) => g === bars[0])
    const shown = allSame
      ? `${bars[0]}${bars.length > 1 ? ` (uguale in tutte le ${bars.length} battute)` : ''}`
      : `${bars.slice(0, MAX_BARS).join(' | ')}${bars.length > MAX_BARS ? ' | …' : ''}`
    lines.push(`${VOICE_LABELS[voice].name}: ${shown}`)
  }
  return lines.length > 0 ? lines : ['(nessun colpo)']
}
