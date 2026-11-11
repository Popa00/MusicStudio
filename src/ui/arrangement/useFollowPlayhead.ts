import { useEffect, type RefObject } from 'react'
import { stepsPerBar } from '../../music/timing'
import { usePlaybackStore } from '../../state/playbackStore'
import { useProjectStore } from '../../state/projectStore'
import { useUiStore } from '../../state/uiStore'
import { BAR_WIDTH, scrollToShow } from './layout'

/**
 * Durante la riproduzione del brano la linea del tempo scorre da sola per seguire l'indicatore:
 * con un brano lungo la parte che suona resta sempre visibile.
 * Ascolta lo store senza far ridisegnare React: a ogni sedicesimo cambia solo lo scorrimento.
 */
export function useFollowPlayhead(scrollRef: RefObject<HTMLDivElement | null>): void {
  useEffect(() => {
    return usePlaybackStore.subscribe((state, prev) => {
      const el = scrollRef.current
      const step = state.currentStep
      if (!el || step === null || step === prev.currentStep || useUiStore.getState().playMode !== 'song') return
      // Le intestazioni delle tracce restano fisse a sinistra e coprono parte della vista.
      const headerWidth = el.querySelector<HTMLElement>('.arrangement__corner')?.offsetWidth ?? 0
      const x = (step / stepsPerBar(useProjectStore.getState().project.timeSignature)) * BAR_WIDTH
      const target = scrollToShow(x, el.scrollLeft, el.clientWidth - headerWidth, BAR_WIDTH)
      if (target !== null) el.scrollLeft = target
    })
  }, [scrollRef])
}
