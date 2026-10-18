import { usePlaybackStore } from '../../state/playbackStore'
import { useProjectStore } from '../../state/projectStore'
import { keepFocusOnMouseDown } from '../keepFocusOnMouseDown'
import { BpmControl } from './BpmControl'
import { useSpaceToTogglePlay } from './useSpaceToTogglePlay'
import './transport.css'

export function TransportBar() {
  const isPlaying = usePlaybackStore((s) => s.isPlaying)
  const setPlaying = usePlaybackStore((s) => s.setPlaying)
  const ts = useProjectStore((s) => s.timeSignature)
  useSpaceToTogglePlay()

  return (
    <div className="transport">
      <button
        className="transport__play"
        onClick={() => setPlaying(!isPlaying)}
        onMouseDown={keepFocusOnMouseDown}
        aria-pressed={isPlaying}
        title="Avvia o ferma (barra spaziatrice)"
      >
        {isPlaying ? '■ Stop' : '▶ Play'}
      </button>
      <BpmControl />
      <span className="transport__meter" title="Tempo musicale: battiti per battuta">
        {ts.beatsPerBar}/{ts.beatUnit}
      </span>
    </div>
  )
}
