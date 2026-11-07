import { previewDrum } from '../../audio/live'
import type { DrumVoiceId } from '../../music/drumPattern'
import { showDrumRow } from '../../state/actions/drumRowActions'
import { VoiceOptions } from './VoiceOptions'

/** Menu "+ Aggiungi suono": mostra nella griglia una percussione nascosta e la fa sentire. */
export function AddDrumVoice({ trackId, visible }: { trackId: string; visible: DrumVoiceId[] }) {
  const include = (v: DrumVoiceId) => !visible.includes(v)
  if (!VoiceOptions({ include }).length) return null

  return (
    <select
      className="sequencer__add"
      value=""
      aria-label="Aggiungi un suono alla batteria"
      onChange={(e) => {
        const voice = e.target.value as DrumVoiceId
        showDrumRow(trackId, voice)
        previewDrum(trackId, voice)
      }}
    >
      <option value="">+ Aggiungi suono</option>
      <VoiceOptions include={include} />
    </select>
  )
}
