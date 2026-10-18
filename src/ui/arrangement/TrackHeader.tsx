import type { Track } from '../../project/types'
import { deleteTrack, selectTrack, setMixer, setTrackName } from '../../state/actions/trackActions'
import { useSelection } from '../../state/useSelection'
import { noFocus } from '../keepFocusOnMouseDown'

export function TrackHeader({ track }: { track: Track }) {
  const { track: selected } = useSelection()
  const isSelected = selected?.id === track.id

  function handleDelete() {
    if (window.confirm(`Eliminare la traccia "${track.name}" con tutti i suoi pattern?`)) deleteTrack(track.id)
  }

  return (
    <div className={`track-header${isSelected ? ' track-header--selected' : ''}`} onClick={() => selectTrack(track.id)}>
      <span className="track-header__icon" title={track.kind === 'drums' ? 'Batteria' : 'Strumento'}>
        {track.kind === 'drums' ? '🥁' : '🎹'}
      </span>
      <input type="text" value={track.name} aria-label="Nome traccia" onChange={(e) => setTrackName(track.id, e.target.value)} />
      <button className="toggle button-small" aria-pressed={track.mixer.mute} onClick={() => setMixer(track.id, { mute: !track.mixer.mute })} title="Muto: silenzia questa traccia" {...noFocus}>
        M
      </button>
      <button className="toggle button-small" aria-pressed={track.mixer.solo} onClick={() => setMixer(track.id, { solo: !track.mixer.solo })} title="Solo: ascolta solo questa traccia" {...noFocus}>
        S
      </button>
      <button className="button-small button-secondary" onClick={handleDelete} title="Elimina traccia" aria-label="Elimina traccia" {...noFocus}>
        ✕
      </button>
    </div>
  )
}
