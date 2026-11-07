import { useState } from 'react'
import { BASE_DRUM_VOICES, type DrumVoiceId } from '../../music/drumPattern'
import { stepsPerBeat } from '../../music/timing'
import type { DrumPatternData } from '../../project/types'
import { visibleDrumVoices } from '../../state/actions/drumRowActions'
import { useProjectStore } from '../../state/projectStore'
import { useUiStore } from '../../state/uiStore'
import { usePlayingStep } from '../editor/usePlayingStep'
import { AddDrumVoice } from './AddDrumVoice'
import { DrumVelocityLane } from './DrumVelocityLane'
import { RhythmPicker } from './RhythmPicker'
import { StepRow } from './StepRow'
import { VOICE_GROUPS } from './voiceLabels'
import './sequencer.css'

/** Griglia della batteria: ogni riga è un suono, ogni casella un sedicesimo di battuta. */
export function StepSequencer({ pattern }: { pattern: DrumPatternData }) {
  const ts = useProjectStore((s) => s.project.timeSignature)
  const playingStep = usePlayingStep(pattern.id)
  const perBeat = stepsPerBeat(ts)
  const [laneVoice, setLaneVoice] = useState<DrumVoiceId>('hihatClosed')
  const added = useUiStore((s) => s.drumRows[pattern.trackId])
  const shown = visibleDrumVoices(pattern, added ?? [])
  // Righe nell'ordine dei gruppi: la cassa 808 sotto la cassa, il rimshot vicino al rullante...
  const rows = VOICE_GROUPS.flatMap((g) => g.voices).filter((v) => shown.includes(v))

  return (
    <div className="sequencer">
      <RhythmPicker key={pattern.id} patternId={pattern.id} />
      <p className="hint">
        Clicca le caselle per accendere un colpo. Ogni gruppo di {perBeat} caselle è un battito. Nella striscia in basso
        trascina le barrette per rendere un colpo più forte o più leggero. Clicca il nome di un suono per ascoltarlo;
        "+ Aggiungi suono" porta altre percussioni nella griglia. Puoi suonare la batteria anche con i tasti A S D F G
        H J (e W E T Y U per alcune percussioni).
      </p>
      <div className="sequencer__grid">
        {rows.map((voice) => (
          <StepRow
            key={voice}
            trackId={pattern.trackId}
            removable={!(BASE_DRUM_VOICES as readonly DrumVoiceId[]).includes(voice)}
            patternId={pattern.id}
            voice={voice}
            steps={pattern.steps[voice]}
            stepsPerBeat={perBeat}
            playingStep={playingStep}
            onEdit={setLaneVoice}
          />
        ))}
        <AddDrumVoice trackId={pattern.trackId} visible={rows} />
        <DrumVelocityLane pattern={pattern} voice={laneVoice} voices={rows} onVoiceChange={setLaneVoice} />
      </div>
    </div>
  )
}
