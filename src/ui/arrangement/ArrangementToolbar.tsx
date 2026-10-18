import { copyClip, deleteClip } from '../../state/actions/clipActions'
import { createTrack } from '../../state/actions/trackActions'
import { useUiStore } from '../../state/uiStore'
import { noFocus } from '../keepFocusOnMouseDown'

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
