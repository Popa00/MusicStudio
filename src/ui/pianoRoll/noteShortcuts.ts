import { scaleIntervals } from '../../music/scales'
import { stepsPerBeat } from '../../music/timing'
import {
  copySelectedNotes,
  cutSelectedNotes,
  deleteSelectedNotes,
  duplicateSelectedNotes,
  nudgeSelected,
  pasteNotes,
  selectAllNotes,
  selectedNotes,
  setNoteSelection,
} from '../../state/actions/noteSelectionActions'
import { lockedScale, nudgeSelectedInScale } from '../../state/actions/scaleLockActions'
import { useProjectStore } from '../../state/projectStore'
import { resolveSelection } from '../../state/selection'
import { useUiStore } from '../../state/uiStore'
import { noteDrag } from './dragState'
import { PIANO_RANGE } from './geometry'

/** Il pattern di note aperto nel piano roll, se il piano roll è visibile. */
function openNotePatternId(): string | null {
  const ui = useUiStore.getState()
  if (ui.panel !== 'editor') return null
  const { pattern } = resolveSelection(useProjectStore.getState().project, ui.selectedTrackId, ui.selectedPatternId)
  return pattern?.kind === 'notes' ? pattern.id : null
}

const hasSelection = (patternId: string) => selectedNotes(patternId).length > 0
/** Testo selezionato nella pagina (es. nella guida): Ctrl+C deve copiare quello. */
const hasTextSelection = () => typeof window !== 'undefined' && !(window.getSelection()?.isCollapsed ?? true)
/** Una finestra della pagina aperta (es. la guida). */
const dialogOpen = () => typeof document !== 'undefined' && document.querySelector('dialog[open]') !== null

/** Ogni azione restituisce true se ha fatto qualcosa (solo allora si blocca il tasto del browser). */
const CTRL_ACTIONS: Record<string, (patternId: string) => boolean> = {
  KeyA: (id) => (selectAllNotes(id), true),
  KeyC: (id) => hasSelection(id) && !hasTextSelection() && (copySelectedNotes(id), true),
  KeyX: (id) => hasSelection(id) && !hasTextSelection() && (cutSelectedNotes(id), true),
  KeyV: (id) => useUiStore.getState().noteClipboard !== null && (pasteNotes(id), true),
  KeyD: (id) => hasSelection(id) && (duplicateSelectedNotes(id), true),
}

/** Frecce: [step, semitoni] per un tocco; con Shift un battito o un'ottava. */
function arrowDelta(code: string, shift: boolean, beat: number): [number, number] | null {
  const steps = shift ? beat : 1
  const semis = shift ? 12 : 1
  if (code === 'ArrowLeft') return [-steps, 0]
  if (code === 'ArrowRight') return [steps, 0]
  if (code === 'ArrowUp') return [0, semis]
  if (code === 'ArrowDown') return [0, -semis]
  return null
}

/**
 * Scorciatoie del piano roll. Restituisce true se il tasto è stato usato (il chiamante blocca
 * l'azione predefinita del browser, es. Ctrl+D = segnalibro).
 */
export function handleNoteShortcut(e: KeyboardEvent): boolean {
  // Con una finestra aperta (es. la guida) i tasti sono suoi: Esc la chiude, Ctrl+C copia il testo.
  if (dialogOpen()) return false
  const patternId = openNotePatternId()
  if (!patternId) return false
  const ctrl = e.ctrlKey || e.metaKey
  // Annulla durante un trascinamento verrebbe subito rifatto dal movimento successivo: lo si ignora.
  if (noteDrag.active && ctrl && (e.code === 'KeyZ' || e.code === 'KeyY')) return true
  const ctrlAction = ctrl && !e.shiftKey ? CTRL_ACTIONS[e.code] : undefined
  if (ctrlAction) return ctrlAction(patternId)
  if (ctrl || selectedNotes(patternId).length === 0) return false
  if (e.code === 'Delete' || e.code === 'Backspace') {
    deleteSelectedNotes(patternId)
    return true
  }
  if (e.code === 'Escape') {
    setNoteSelection([])
    return true
  }
  const delta = arrowDelta(e.code, e.shiftKey, stepsPerBeat(useProjectStore.getState().project.timeSignature))
  if (!delta) return false
  // Con "Blocca sulla scala", su/giù vanno di una nota della scala (con Shift, un'ottava intera).
  const scale = lockedScale()
  if (scale && delta[1] !== 0) {
    const degrees = Math.sign(delta[1]) * (e.shiftKey ? scaleIntervals(scale.type).length : 1)
    nudgeSelectedInScale(patternId, degrees, PIANO_RANGE)
    return true
  }
  nudgeSelected(patternId, delta[0], delta[1], PIANO_RANGE)
  return true
}
