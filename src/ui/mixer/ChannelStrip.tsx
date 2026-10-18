import { useCallback } from 'react'
import { trackLevelDb } from '../../audio/live'
import type { Track } from '../../project/types'
import { selectTrack, setMixer } from '../../state/actions/trackActions'
import { formatDb, formatPan } from '../controls/format'
import { noFocus } from '../keepFocusOnMouseDown'
import { MeterBar } from './MeterBar'

/** Una "striscia" del mixer: volume, posizione destra/sinistra, muto e solo di una traccia. */
export function ChannelStrip({ track }: { track: Track }) {
  const { mixer } = track
  const level = useCallback(() => trackLevelDb(track.id), [track.id])

  return (
    <div className="strip">
      <button className="strip__name button-small button-secondary" onClick={() => selectTrack(track.id)} title={track.name} {...noFocus}>
        {track.name}
      </button>
      <div className="strip__fader">
        <MeterBar getLevelDb={level} />
        <input
          type="range"
          className="strip__volume"
          min={-60}
          max={6}
          step={0.5}
          value={mixer.volumeDb}
          onChange={(e) => setMixer(track.id, { volumeDb: Number(e.target.value) })}
          onDoubleClick={() => setMixer(track.id, { volumeDb: 0 })}
          aria-label="Volume"
          title="Volume della traccia (doppio clic: torna a 0 dB)"
        />
      </div>
      <output className="strip__value">{formatDb(mixer.volumeDb)}</output>
      <input type="range" min={-1} max={1} step={0.05} value={mixer.pan} onChange={(e) => setMixer(track.id, { pan: Number(e.target.value) })} onDoubleClick={() => setMixer(track.id, { pan: 0 })} aria-label="Pan" title="Pan: sposta il suono verso la cassa sinistra o destra (doppio clic: centro)" />
      <output className="strip__value">{formatPan(mixer.pan)}</output>
      <div className="strip__buttons">
        <button className="toggle button-small" aria-pressed={mixer.mute} onClick={() => setMixer(track.id, { mute: !mixer.mute })} title="Muto" {...noFocus}>
          M
        </button>
        <button className="toggle button-small" aria-pressed={mixer.solo} onClick={() => setMixer(track.id, { solo: !mixer.solo })} title="Solo" {...noFocus}>
          S
        </button>
      </div>
    </div>
  )
}
