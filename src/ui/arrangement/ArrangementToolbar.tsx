import { copyClip, deleteClip } from '../../state/actions/clipActions'
import type { DrumVoiceId } from '../../music/drumPattern'
import { createPercussionTrack, createTrack } from '../../state/actions/trackActions'
import { useUiStore } from '../../state/uiStore'
import { noFocus } from '../keepFocusOnMouseDown'
import { VoiceOptions } from '../sequencer/VoiceOptions'
import { VOICE_LABELS } from '../sequencer/voiceLabels'

export function ArrangementToolbar() {
  const selectedClipId = useUiStore((s) => s.selectedClipId)

  return (
    <header className="arrangement__toolbar">
      <h2>Brano</h2>
      <button className="button-small" onClick={() => createTrack('drums')} title="Nuova traccia di batteria" {...noFocus}>
        + Batteria
      </button>
      <button className="button-small" onClick={() => createTrack('synth')} title="Nuova traccia con un sintetizzatore per melodie, accordi o bassi" {...noFocus}>
        + Strumento
      </button>
      <select
        className="button-small"
        value=""
        aria-label="Nuova traccia con un solo suono di batteria"
        title="Nuova traccia con un solo suono (es. il charleston), con effetti e volume tutti suoi, da suonare anche più acuto o più grave"
        onChange={(e) => {
          const voice = e.target.value as DrumVoiceId
          createPercussionTrack(voice, VOICE_LABELS[voice].name)
        }}
      >
        <option value="">+ Percussione</option>
        <VoiceOptions />
      </select>
      {selectedClipId && (
        <>
          <button className="button-small button-secondary" onClick={() => copyClip(selectedClipId)} title="Copia il blocco subito dopo" {...noFocus}>
            Duplica blocco
          </button>
          <button className="button-small button-secondary" onClick={() => deleteClip(selectedClipId)} title="Elimina il blocco (tasto Canc)" {...noFocus}>
            Elimina blocco
          </button>
        </>
      )}
      <span className="hint">
        Clicca una casella vuota per inserire il pattern scelto · trascina i blocchi per spostarli · clic destro per toglierli
      </span>
    </header>
  )
}
