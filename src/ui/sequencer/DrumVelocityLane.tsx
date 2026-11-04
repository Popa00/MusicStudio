import { DRUM_VOICES, type DrumVoiceId } from '../../music/drumPattern'
import type { DrumPatternData } from '../../project/types'
import { setStepVelocity } from '../../state/actions/patternActions'
import { VelocityLane } from '../velocity/VelocityLane'
import { VOICE_LABELS } from './voiceLabels'

/** Le caselle della griglia: 32 px di larghezza più 4 px di spazio (vedi sequencer.css). */
const STEP_SIZE = 32
const STEP_GAP = 4

interface DrumVelocityLaneProps {
  pattern: DrumPatternData
  voice: DrumVoiceId
  onVoiceChange: (voice: DrumVoiceId) => void
}

/** Intensità dei colpi di un suono della batteria, allineata alle caselle della griglia. */
export function DrumVelocityLane({ pattern, voice, onVoiceChange }: DrumVelocityLaneProps) {
  const row = pattern.steps[voice]
  const items = row.flatMap((velocity, step) => (velocity > 0 ? [{ id: String(step), step, velocity }] : []))

  return (
    <div className="sequencer__row sequencer__velocity">
      <label className="sequencer__label velocity-label" title="Quanto forte suona ogni colpo: trascina le barrette su o giù">
        Intensità di
        <select value={voice} onChange={(e) => onVoiceChange(e.target.value as DrumVoiceId)}>
          {DRUM_VOICES.map((v) => (
            <option key={v} value={v}>
              {VOICE_LABELS[v].name}
            </option>
          ))}
        </select>
      </label>
      <VelocityLane
        items={items}
        totalSteps={row.length}
        stepWidth={STEP_SIZE + STEP_GAP}
        barWidth={STEP_SIZE}
        onChange={(ids, velocity, key) => {
          for (const id of ids) setStepVelocity(pattern.id, voice, Number(id), velocity, key)
        }}
      />
    </div>
  )
}
