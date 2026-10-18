import { playingStepOfPattern } from '../../music/schedule'
import { usePlaybackStore } from '../../state/playbackStore'
import { currentPlayTarget } from '../../state/playTarget'
import { useProjectStore } from '../../state/projectStore'

/** Step del pattern che sta suonando in questo momento (null se fermo o se il pattern non sta suonando). */
export function usePlayingStep(patternId: string): number | null {
  const step = usePlaybackStore((s) => s.currentStep)
  const project = useProjectStore((s) => s.project)
  if (step === null) return null
  return playingStepOfPattern(project, currentPlayTarget(), patternId, step)
}
