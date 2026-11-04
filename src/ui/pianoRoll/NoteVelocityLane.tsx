import { patternSteps } from '../../project/ops/patternLength'
import type { NotePatternData } from '../../project/types'
import { changeNotesVelocity } from '../../state/actions/noteActions'
import { useProjectStore } from '../../state/projectStore'
import { VelocityLane } from '../velocity/VelocityLane'
import { STEP_WIDTH } from './geometry'

/** Intensità delle note, sotto la griglia: le note che partono insieme (accordi) cambiano insieme. */
export function NoteVelocityLane({ pattern }: { pattern: NotePatternData }) {
  const ts = useProjectStore((s) => s.project.timeSignature)
  const items = pattern.notes.map((n) => ({ id: n.id, step: n.start, velocity: n.velocity }))

  return (
    <div className="piano-roll__velocity">
      <span className="velocity-label piano-roll__velocity-label" title="Quanto forte suona ogni nota: trascina le barrette su o giù">
        Intensità
      </span>
      <VelocityLane
        items={items}
        totalSteps={patternSteps(pattern, ts)}
        stepWidth={STEP_WIDTH}
        barWidth={STEP_WIDTH - 6}
        onChange={(ids, velocity, key) => changeNotesVelocity(pattern.id, ids, velocity, key)}
      />
    </div>
  )
}
