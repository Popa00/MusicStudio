import { useState } from 'react'
import { findGenre, GENRE_RHYTHMS } from '../../project/rhythms/genres'
import type { RhythmVariant } from '../../project/rhythms/build'
import { applyGenreRhythm, applyGenreTempo } from '../../state/actions/rhythmActions'
import { useProjectStore } from '../../state/projectStore'
import { noFocus } from '../keepFocusOnMouseDown'

type VariantName = RhythmVariant['name']

/**
 * Ritmi pronti per genere: scegliendo il genere il pattern si riempie subito con la versione Base;
 * i pulsanti passano da Base a Ricco. Sostituisce i colpi del pattern (Ctrl+Z per tornare indietro).
 */
export function RhythmPicker({ patternId }: { patternId: string }) {
  const [genreId, setGenreId] = useState('')
  const [variant, setVariant] = useState<VariantName | null>(null)
  const bpm = useProjectStore((s) => s.project.bpm)
  const genre = findGenre(genreId)

  function apply(id: string, name: VariantName) {
    setGenreId(id)
    setVariant(name)
    applyGenreRhythm(patternId, id, name)
  }

  return (
    <div className="rhythm-picker">
      <label>
        Ritmo pronto{' '}
        <select value={genreId} onChange={(e) => apply(e.target.value, 'Base')}>
          {!genre && <option value="">Scegli un genere…</option>}
          {GENRE_RHYTHMS.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </label>
      {genre && (
        <>
          {genre.variants.map((v) => (
            <button
              key={v.name}
              className="toggle button-small"
              aria-pressed={variant === v.name}
              onClick={() => apply(genre.id, v.name)}
              title={`Ritmo ${genre.name} ${v.name === 'Base' ? 'essenziale' : 'con più colpi'}. Sostituisce i colpi attuali: Ctrl+Z per tornare indietro`}
              {...noFocus}
            >
              {v.name}
            </button>
          ))}
          <span className="rhythm-picker__tempo">
            Velocità tipica: {genre.bpm} BPM
            {bpm !== genre.bpm && (
              <button className="button-small button-secondary" onClick={() => applyGenreTempo(genre.id)} {...noFocus}>
                Usala
              </button>
            )}
          </span>
        </>
      )}
      <p className="hint rhythm-picker__description">
        {genre ? genre.description : 'Scegli un genere: la griglia si riempie con un ritmo tipico, da modificare come vuoi.'}
      </p>
    </div>
  )
}
