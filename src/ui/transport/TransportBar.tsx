import { usePlaybackStore } from '../../state/playbackStore'
import { useProjectStore } from '../../state/projectStore'
import { useUiStore } from '../../state/uiStore'
import { noFocus } from '../keepFocusOnMouseDown'
import { BpmControl } from './BpmControl'
import './transport.css'

export function TransportBar() {
  const isPlaying = usePlaybackStore((s) => s.isPlaying)
  const setPlaying = usePlaybackStore((s) => s.setPlaying)
  const ts = useProjectStore((s) => s.project.timeSignature)
  const playMode = useUiStore((s) => s.playMode)
  const metronome = useUiStore((s) => s.metronome)
  const setUi = useUiStore((s) => s.set)

  return (
    <div className="transport">
      <button className="transport__play" onClick={() => setPlaying(!isPlaying)} aria-pressed={isPlaying} title="Avvia o ferma (barra spaziatrice)" {...noFocus}>
        {isPlaying ? '■ Stop' : '▶ Play'}
      </button>
      <div className="transport__mode" role="group" aria-label="Cosa suonare">
        <button className="toggle" aria-pressed={playMode === 'song'} onClick={() => setUi({ playMode: 'song' })} title="Suona tutto il brano dalla linea del tempo" {...noFocus}>
          Brano
        </button>
        <button className="toggle" aria-pressed={playMode === 'pattern'} onClick={() => setUi({ playMode: 'pattern' })} title="Suona in loop solo il pattern che stai modificando" {...noFocus}>
          Solo pattern
        </button>
      </div>
      <BpmControl />
      <button className="toggle" aria-pressed={metronome} onClick={() => setUi({ metronome: !metronome })} title="Metronomo: un 'tic' su ogni battito per andare a tempo" {...noFocus}>
        Metronomo
      </button>
      <span className="transport__meter" title="Tempo musicale: battiti per battuta">
        {ts.beatsPerBar}/{ts.beatUnit}
      </span>
    </div>
  )
}
