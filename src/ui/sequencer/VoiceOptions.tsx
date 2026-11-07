import type { DrumVoiceId } from '../../music/drumPattern'
import { VOICE_GROUPS, VOICE_LABELS } from './voiceLabels'

/** Le voci di un menu dei suoni di batteria, divise per famiglia (casse, piatti, tom...). */
export function VoiceOptions({ include = () => true }: { include?: (voice: DrumVoiceId) => boolean }) {
  return VOICE_GROUPS.map((g) => ({ ...g, voices: g.voices.filter(include) }))
    .filter((g) => g.voices.length > 0)
    .map((g) => (
      <optgroup key={g.name} label={g.name}>
        {g.voices.map((v) => (
          <option key={v} value={v} title={VOICE_LABELS[v].hint}>
            {VOICE_LABELS[v].name}
          </option>
        ))}
      </optgroup>
    ))
}
