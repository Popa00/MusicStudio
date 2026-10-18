import { useEffect } from 'react'
import { usePlaybackStore } from '../../state/playbackStore'

/** Elementi in cui la barra spaziatrice ha già un significato proprio. */
const INTERACTIVE = new Set(['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'])

export function useSpaceToTogglePlay(): void {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.code !== 'Space' || e.repeat) return
      const target = e.target as HTMLElement | null
      if (target && (INTERACTIVE.has(target.tagName) || target.isContentEditable)) return
      e.preventDefault()
      const { isPlaying, setPlaying } = usePlaybackStore.getState()
      setPlaying(!isPlaying)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])
}
