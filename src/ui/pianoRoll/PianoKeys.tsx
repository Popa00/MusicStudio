import { previewNoteOff, previewNoteOn } from '../../audio/live'
import { isBlackKey, noteName } from '../../music/notes'
import { PITCHES, ROW_HEIGHT } from './geometry'

/** Tastiera verticale a sinistra: tenendo premuto un tasto si sente la nota. */
export function PianoKeys({ trackId }: { trackId: string }) {
  return (
    <div className="piano-keys">
      {PITCHES.map((pitch) => (
        <div
          key={pitch}
          className={`piano-keys__key${isBlackKey(pitch) ? ' piano-keys__key--black' : ''}`}
          style={{ height: ROW_HEIGHT }}
          title={noteName(pitch)}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId)
            previewNoteOn(trackId, pitch)
          }}
          onPointerUp={() => previewNoteOff(trackId, pitch)}
          onPointerCancel={() => previewNoteOff(trackId, pitch)}
        >
          {pitch % 12 === 0 ? noteName(pitch).split(' ')[0] : ''}
        </div>
      ))}
    </div>
  )
}
