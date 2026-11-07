import { previewNote } from '../../audio/live'
import type { DrumVoiceId } from '../../music/drumPattern'
import { PERCUSSION_ROOT_PITCH } from '../../project/ops/percussion'
import type { PercussionTrack } from '../../project/types'
import { setPercussion } from '../../state/actions/trackActions'
import { Slider } from '../controls/Slider'
import { PERCENT, SEMITONES } from '../controls/valueUnits'
import { noFocus } from '../keepFocusOnMouseDown'
import { VoiceOptions } from '../sequencer/VoiceOptions'
import { VOICE_LABELS } from '../sequencer/voiceLabels'
import '../synth/synth.css'

/** Suono di una traccia "percussione": quale suono, quanto acuto, quanto lungo. */
export function PercussionPanel({ track }: { track: PercussionTrack }) {
  const { sound } = track
  const listen = () => previewNote(track.id, PERCUSSION_ROOT_PITCH)

  return (
    <div className="synth-panel">
      <h3>Suono</h3>
      <label className="synth-panel__preset">
        Percussione{' '}
        <select
          value={sound.voice}
          onChange={(e) => {
            setPercussion(track.id, { voice: e.target.value as DrumVoiceId })
            // Il suono nuovo si prepara in un attimo: lo si fa sentire appena pronto.
            setTimeout(listen, 150)
          }}
        >
          <VoiceOptions />
        </select>
      </label>
      <p className="hint">
        {VOICE_LABELS[sound.voice].hint}. Il Do centrale (C4) suona il suono originale: le note più in alto lo
        rendono più acuto, quelle più in basso più grave.
      </p>
      <Slider label="Intonazione" hint="Rende tutto il suono più acuto (+) o più grave (−), in semitoni" value={sound.tune} min={-12} max={12} step={1} unit={SEMITONES} onChange={(tune) => setPercussion(track.id, { tune })} />
      <Slider label="Lunghezza" hint="Quanta coda tenere: 100% = suono intero, valori bassi = colpo secco e corto" value={sound.length} min={0.05} max={1} unit={PERCENT} onChange={(length) => setPercussion(track.id, { length })} />
      <button className="button-small button-secondary" onClick={listen} {...noFocus}>
        ▶ Ascolta
      </button>
      <p className="hint">Riverbero, eco e filtri solo per questo suono: scheda "Effetti".</p>
    </div>
  )
}
