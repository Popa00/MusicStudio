import type { PointerEvent } from 'react'
import { usePlaybackStore } from '../../state/playbackStore'
import { useProjectStore } from '../../state/projectStore'
import { useUiStore } from '../../state/uiStore'
import { stepAtRulerX } from './layout'

/**
 * Clic o trascinamento sulla riga delle battute: sceglie da dove ascoltare il brano (entro la sua fine).
 * Se la musica suona salta subito lì (anche mentre si trascina); se è ferma, Play partirà da lì.
 */
export function useRulerSeek(songBars: number) {
  /** `always`: al clic si salta anche sul punto già scelto; trascinando, solo quando il battito cambia. */
  function seek(event: PointerEvent<HTMLDivElement>, always: boolean): void {
    const x = event.clientX - event.currentTarget.getBoundingClientRect().left
    const step = stepAtRulerX(x, useProjectStore.getState().project.timeSignature, songBars)
    const playback = usePlaybackStore.getState()
    if (always || step !== playback.startStep) playback.seekTo(step)
  }

  return {
    onPointerDown: (event: PointerEvent<HTMLDivElement>) => {
      if (event.button !== 0) return
      event.currentTarget.setPointerCapture(event.pointerId)
      // La riga delle battute è del brano: si passa ad ascoltare il brano intero.
      if (useUiStore.getState().playMode !== 'song') useUiStore.getState().set({ playMode: 'song' })
      seek(event, true)
    },
    onPointerMove: (event: PointerEvent<HTMLDivElement>) => {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) seek(event, false)
    },
  }
}
