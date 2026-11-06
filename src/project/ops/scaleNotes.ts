import { snapToScale, stepInScale, type ScaleRef } from '../../music/scaleLock'
import type { Note, Project } from '../types'
import { findPattern, mapPattern, sameItems } from './helpers'
import { moveNotes, type PitchRange } from './noteGroup'

/** Cambia l'altezza delle note indicate (le altre restano identiche, stesso riferimento). */
function setPitches(project: Project, patternId: string, pitches: Map<string, number>): Project {
  return mapPattern(project, patternId, (p) => {
    if (p.kind !== 'notes') return p
    const notes = p.notes.map((n) => {
      const pitch = pitches.get(n.id)
      return pitch === undefined || pitch === n.pitch ? n : { ...n, pitch }
    })
    return sameItems(notes, p.notes) ? p : { ...p, notes }
  })
}

/** Altezze dopo `degrees` passi nella scala; se qualcuna esce dall'intervallo, il passo si riduce. */
function shiftedPitches(originals: Note[], degrees: number, scale: ScaleRef, range: PitchRange): Map<string, number> {
  const direction = Math.sign(degrees)
  for (let d = degrees; ; d -= direction) {
    const pitches = originals.map((n) => stepInScale(snapToScale(n.pitch, scale), scale, d))
    // Passo zero: solo l'aggancio alla scala, anche per note già fuori dall'intervallo visibile.
    if (d === 0 || pitches.every((p) => p >= range.min && p <= range.max)) return new Map(originals.map((n, i) => [n.id, pitches[i]]))
  }
}

/**
 * Come `moveNotes`, ma in verticale si sposta di gradi della scala invece che di semitoni:
 * ogni nota resta nella scala e la "forma" della melodia si conserva.
 * Non toglie le note diventate doppie: durante un trascinamento potrebbero ancora separarsi
 * (vedi `removeDuplicateNotes`, da usare a fine gesto).
 */
export function moveNotesInScale(
  project: Project,
  patternId: string,
  originals: Note[],
  dStep: number,
  degrees: number,
  scale: ScaleRef,
  range: PitchRange,
): Project {
  // Un passo non valido (NaN, infinito) bloccherebbe il ciclo in shiftedPitches.
  if (originals.length === 0 || !Number.isFinite(degrees)) return project
  const moved = moveNotes(project, patternId, originals, dStep, 0, range)
  return setPitches(moved, patternId, shiftedPitches(originals, Math.round(degrees), scale, range))
}

/** Tra le note `ids`, quelle identiche a un'altra (stessa altezza e stesso inizio) spariscono: resta la più lunga. */
function withoutDuplicates(notes: Note[], ids: Set<string>): Note[] {
  const longest = new Map<string, Note>()
  for (const n of notes) {
    const key = `${n.pitch}:${n.start}`
    const kept = longest.get(key)
    if (!kept || n.duration > kept.duration) longest.set(key, n)
  }
  // Si scartano solo note tra quelle indicate: le altre non si toccano mai.
  return notes.filter((n) => !ids.has(n.id) || longest.get(`${n.pitch}:${n.start}`) === n)
}

/**
 * Note diverse agganciate alla scala possono diventare identiche (es. Do e Do# che partono insieme):
 * si vedrebbe una nota sola ma ne suonerebbero due. Qui le doppie tra `noteIds` vengono tolte.
 */
export function removeDuplicateNotes(project: Project, patternId: string, noteIds: string[]): Project {
  const ids = new Set(noteIds)
  return mapPattern(project, patternId, (p) => {
    if (p.kind !== 'notes') return p
    const notes = withoutDuplicates(p.notes, ids)
    return notes.length === p.notes.length ? p : { ...p, notes }
  })
}

/**
 * "Adatta alla scala": porta ogni nota indicata sulla nota della scala più vicina.
 * Se una nota adattata finisce identica a un'altra (stessa altezza e stesso inizio), resta la più lunga.
 */
export function fitNotesToScale(project: Project, patternId: string, noteIds: string[], scale: ScaleRef): Project {
  const pattern = findPattern(project, patternId)
  if (pattern?.kind !== 'notes') return project
  const ids = new Set(noteIds)
  const pitches = new Map(pattern.notes.filter((n) => ids.has(n.id)).map((n) => [n.id, snapToScale(n.pitch, scale)]))
  return removeDuplicateNotes(setPitches(project, patternId, pitches), patternId, noteIds)
}
