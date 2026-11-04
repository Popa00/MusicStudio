import { isBlackKey } from '../../music/notes'
import { isInScale } from '../../music/scales'
import { stepsPerBar, stepsPerBeat } from '../../music/timing'
import { formatVelocity } from '../../music/velocity'
import { patternSteps } from '../../project/ops/patternLength'
import type { NotePatternData } from '../../project/types'
import { useProjectStore } from '../../state/projectStore'
import { usePlayingStep } from '../editor/usePlayingStep'
import { PITCHES, pitchToY, ROW_HEIGHT, STEP_WIDTH } from './geometry'
import { useNoteEditing } from './useNoteEditing'

function rowClass(pitch: number, root: number, inScale: boolean): string {
  const classes = ['note-grid__row']
  if (!inScale) classes.push('note-grid__row--out')
  else if (isBlackKey(pitch)) classes.push('note-grid__row--black')
  if ((pitch - root) % 12 === 0) classes.push('note-grid__row--root')
  return classes.join(' ')
}

export function NoteGrid({ trackId, pattern }: { trackId: string; pattern: NotePatternData }) {
  const project = useProjectStore((s) => s.project)
  const { scale, timeSignature: ts } = project
  const total = patternSteps(pattern, ts)
  const playingStep = usePlayingStep(pattern.id)
  const handlers = useNoteEditing(trackId, pattern, total)
  const beatWidth = stepsPerBeat(ts) * STEP_WIDTH
  const barWidth = stepsPerBar(ts) * STEP_WIDTH

  return (
    <div
      className="note-grid"
      style={{ width: total * STEP_WIDTH, height: PITCHES.length * ROW_HEIGHT, ['--beat' as string]: `${beatWidth}px`, ['--bar' as string]: `${barWidth}px` }}
      {...handlers}
      onContextMenu={(e) => e.preventDefault()}
    >
      {PITCHES.map((pitch) => (
        <div key={pitch} className={rowClass(pitch, scale.root, isInScale(pitch, scale.root, scale.type))} style={{ height: ROW_HEIGHT }} />
      ))}
      <div className="note-grid__lines" />
      {pattern.notes.map((note) => (
        <div
          key={note.id}
          data-note-id={note.id}
          className="note-grid__note"
          title={`Intensità ${formatVelocity(note.velocity)}`}
          // Le note più leggere sono più chiare: si vedono subito gli accenti.
          style={{ left: note.start * STEP_WIDTH, top: pitchToY(note.pitch), width: note.duration * STEP_WIDTH - 1, height: ROW_HEIGHT - 1, opacity: 0.35 + 0.65 * note.velocity }}
        />
      ))}
      {playingStep !== null && <div className="note-grid__playhead" style={{ left: playingStep * STEP_WIDTH }} />}
    </div>
  )
}
