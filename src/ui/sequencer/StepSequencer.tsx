import { useState } from 'react'
import { DRUM_VOICES, type DrumVoiceId } from '../../music/drumPattern'
import { stepsPerBeat } from '../../music/timing'
import type { DrumPatternData } from '../../project/types'
import { useProjectStore } from '../../state/projectStore'
import { usePlayingStep } from '../editor/usePlayingStep'
import { DrumVelocityLane } from './DrumVelocityLane'
import { RhythmPicker } from './RhythmPicker'
import { StepRow } from './StepRow'
import './sequencer.css'

/** Griglia della batteria: ogni riga è un suono, ogni casella un sedicesimo di battuta. */
export function StepSequencer({ pattern }: { pattern: DrumPatternData }) {
  const ts = useProjectStore((s) => s.project.timeSignature)
  const playingStep = usePlayingStep(pattern.id)
  const perBeat = stepsPerBeat(ts)
  const [laneVoice, setLaneVoice] = useState<DrumVoiceId>('hihatClosed')

  return (
    <div className="sequencer">
      <RhythmPicker key={pattern.id} patternId={pattern.id} />
      <p className="hint">
        Clicca le caselle per accendere un colpo. Ogni gruppo di {perBeat} caselle è un battito. Nella striscia in basso
        trascina le barrette per rendere un colpo più forte o più leggero. Puoi suonare la batteria anche con i tasti A S
        D F G.
      </p>
      <div className="sequencer__grid">
        {DRUM_VOICES.map((voice) => (
          <StepRow
            key={voice}
            patternId={pattern.id}
            voice={voice}
            steps={pattern.steps[voice]}
            stepsPerBeat={perBeat}
            playingStep={playingStep}
            onEdit={setLaneVoice}
          />
        ))}
        <DrumVelocityLane pattern={pattern} voice={laneVoice} onVoiceChange={setLaneVoice} />
      </div>
    </div>
  )
}
