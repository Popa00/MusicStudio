import { useEffect } from 'react'
import { deleteClip } from '../../state/actions/clipActions'
import { usePlaybackStore } from '../../state/playbackStore'
import { useProjectStore } from '../../state/projectStore'
import { useUiStore } from '../../state/uiStore'
import { isTypingTarget } from '../keyboard/keyMap'

/** Elementi in cui la barra spaziatrice ha già un significato proprio. */
function spaceHasOwnMeaning(target: EventTarget | null): boolean {
  return isTypingTarget(target) || (target instanceof HTMLElement && target.tagName === 'BUTTON')
}

function togglePlay(): void {
  const { isPlaying, setPlaying } = usePlaybackStore.getState()
  setPlaying(!isPlaying)
}

/** Spazio = Play/Stop, Ctrl+Z = annulla, Ctrl+Y / Ctrl+Shift+Z = ripeti, Canc = elimina blocco selezionato. */
export function useGlobalShortcuts(): void {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const ctrl = e.ctrlKey || e.metaKey
      if (e.code === 'Space' && !e.repeat && !spaceHasOwnMeaning(e.target)) {
        e.preventDefault()
        togglePlay()
        return
      }
      if (isTypingTarget(e.target)) return
      if (ctrl && e.code === 'KeyZ') {
        e.preventDefault()
        if (e.shiftKey) useProjectStore.getState().redo()
        else useProjectStore.getState().undo()
      } else if (ctrl && e.code === 'KeyY') {
        e.preventDefault()
        useProjectStore.getState().redo()
      } else if (e.code === 'Delete') {
        const clipId = useUiStore.getState().selectedClipId
        if (clipId) deleteClip(clipId)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])
}
