import { applyRhythm } from '../../project/ops/drumRhythm'
import { findGenre } from '../../project/rhythms/genres'
import type { RhythmVariant } from '../../project/rhythms/build'
import { useProjectStore } from '../projectStore'
import { changeBpm } from './projectActions'

const store = () => useProjectStore.getState()

/** Mette un ritmo pronto nel pattern di batteria (sostituisce i colpi: Ctrl+Z per tornare indietro). */
export function applyGenreRhythm(patternId: string, genreId: string, variant: RhythmVariant['name']): void {
  const hits = findGenre(genreId)?.variants.find((v) => v.name === variant)?.hits
  if (hits) store().commit(applyRhythm(store().project, patternId, hits))
}

/** Porta il brano alla velocità tipica del genere. */
export function applyGenreTempo(genreId: string): void {
  const genre = findGenre(genreId)
  if (genre) changeBpm(genre.bpm)
}
