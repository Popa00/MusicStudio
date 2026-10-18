import { useProjectStore } from '../../state/projectStore'
import { ChannelStrip } from './ChannelStrip'
import { MasterStrip } from './MasterStrip'
import './mixer.css'

export function Mixer() {
  const tracks = useProjectStore((s) => s.project.tracks)

  return (
    <div className="mixer">
      <p className="hint">
        Bilancia i volumi delle tracce. Muto (M) silenzia una traccia, Solo (S) fa sentire solo quella. Doppio clic su un
        cursore per riportarlo al valore iniziale.
      </p>
      <div className="mixer__strips">
        {tracks.map((track) => (
          <ChannelStrip key={track.id} track={track} />
        ))}
        <MasterStrip />
      </div>
    </div>
  )
}
