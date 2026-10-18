import { useEffect } from 'react'
import { previewNoteOff, previewNoteOn } from '../../audio/live'
import { useProjectStore } from '../../state/projectStore'
import { resolveSelection } from '../../state/selection'
import { useUiStore } from '../../state/uiStore'
import { isTypingTarget, MAX_OCTAVE, MIN_OCTAVE, OCTAVE_DOWN_KEY, OCTAVE_UP_KEY, pitchForKey } from './keyMap'

function selectedTrackId(): string | null {
  const ui = useUiStore.getState()
  return resolveSelection(useProjectStore.getState().project, ui.selectedTrackId, ui.selectedPatternId).track?.id ?? null
}

/** Suona la traccia selezionata con la tastiera del PC. Z / X cambiano ottava. */
export function useComputerKeyboard(): void {
  useEffect(() => {
    // Nota suonata da ogni tasto premuto, per spegnere quella giusta anche se nel frattempo cambia l'ottava.
    const held = new Map<string, { trackId: string; pitch: number }>()

    function onKeyDown(e: KeyboardEvent) {
      if (e.repeat || e.ctrlKey || e.metaKey || e.altKey || isTypingTarget(e.target)) return
      const ui = useUiStore.getState()
      if (e.code === OCTAVE_DOWN_KEY || e.code === OCTAVE_UP_KEY) {
        const octave = ui.octave + (e.code === OCTAVE_UP_KEY ? 1 : -1)
        ui.set({ octave: Math.min(MAX_OCTAVE, Math.max(MIN_OCTAVE, octave)) })
        return
      }
      const pitch = pitchForKey(e.code, ui.octave)
      const trackId = selectedTrackId()
      if (pitch === null || !trackId || held.has(e.code)) return
      held.set(e.code, { trackId, pitch })
      previewNoteOn(trackId, pitch)
    }

    function onKeyUp(e: KeyboardEvent) {
      const note = held.get(e.code)
      if (!note) return
      held.delete(e.code)
      previewNoteOff(note.trackId, note.pitch)
    }

    function releaseAll() {
      for (const note of held.values()) previewNoteOff(note.trackId, note.pitch)
      held.clear()
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', releaseAll)
    return () => {
      releaseAll()
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', releaseAll)
    }
  }, [])
}
