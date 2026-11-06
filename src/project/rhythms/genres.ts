import { eighths, sixteenths, V, type GenreRhythm } from './build'

/**
 * Ritmi pronti per genere (una battuta da 16 step; nei pattern più lunghi si ripete).
 * Base = l'essenziale del genere; Ricco = più colpi e dinamica.
 */
export const GENRE_RHYTHMS: GenreRhythm[] = [
  {
    id: 'pop', name: 'Pop', bpm: 105, description: 'Semplice e regolare: cassa sui battiti 1 e 3, rullante su 2 e 4',
    variants: [
      { name: 'Base', hits: { kick: [0, 8], snare: [4, 12], hihatClosed: eighths(V.normal, V.soft) } },
      { name: 'Ricco', hits: {
        kick: [0, [7, V.mid], 8, [10, V.mid]], snare: [4, 12], clap: [[4, V.soft], [12, V.soft]],
        hihatClosed: sixteenths(V.normal, V.mid, V.ghost, [14]), hihatOpen: [[14, V.mid]],
      } },
    ],
  },
  {
    id: 'hiphop', name: 'Hip-hop', bpm: 90, description: 'Boom bap: cassa che "rimbalza" e rullante secco su 2 e 4',
    variants: [
      { name: 'Base', hits: { kick: [0, [7, V.normal], 10], snare: [4, 12], hihatClosed: eighths(V.normal, V.soft) } },
      { name: 'Ricco', hits: {
        kick: [0, [3, V.mid], [7, V.normal], 10], snare: [4, 12, [15, V.ghost]],
        hihatClosed: eighths(V.normal, V.soft, [14]), hihatOpen: [[14, V.soft]],
      } },
    ],
  },
  {
    id: 'lofi', name: 'Lo-fi', bpm: 80, description: 'Lento e morbido, colpi leggeri: per studiare o rilassarsi',
    variants: [
      { name: 'Base', hits: { kick: [0, [9, V.normal]], snare: [[4, V.normal], [12, V.normal]], hihatClosed: eighths(V.soft, V.ghost) } },
      { name: 'Ricco', hits: {
        kick: [0, [7, V.soft], [9, V.normal]], snare: [[4, V.normal], [12, V.normal], [14, V.ghost]],
        hihatClosed: [...eighths(V.soft, V.ghost, [6]), [3, V.ghost], [11, V.ghost]], hihatOpen: [[6, V.ghost]],
      } },
    ],
  },
  {
    id: 'house', name: 'House', bpm: 124, description: 'Cassa su ogni battito ("four on the floor") e charleston aperto in levare',
    variants: [
      { name: 'Base', hits: { kick: [0, 4, 8, 12], clap: [4, 12], hihatOpen: [[2, V.mid], [6, V.mid], [10, V.mid], [14, V.mid]] } },
      { name: 'Ricco', hits: {
        kick: [0, 4, 8, 12], clap: [4, 12], hihatOpen: [[2, V.mid], [6, V.mid], [10, V.mid], [14, V.mid]],
        hihatClosed: sixteenths(V.soft, V.soft, V.ghost, [2, 6, 10, 14]), snare: [[15, V.ghost]],
      } },
    ],
  },
  {
    id: 'techno', name: 'Techno', bpm: 130, description: 'Cassa martellante e charleston fitti: ipnotico e ripetitivo',
    variants: [
      { name: 'Base', hits: {
        kick: [0, 4, 8, 12], hihatOpen: [[2, V.mid], [6, V.mid], [10, V.mid], [14, V.mid]],
        hihatClosed: sixteenths(V.ghost, V.ghost, V.ghost, [2, 6, 10, 14]),
      } },
      { name: 'Ricco', hits: {
        kick: [0, 4, 8, 12, [14, V.ghost]], clap: [[4, V.normal], [12, V.normal]], snare: [[7, V.ghost], [15, V.ghost]],
        hihatOpen: [[2, V.mid], [6, V.mid], [10, V.mid], [14, V.mid]], hihatClosed: sixteenths(V.soft, V.ghost, V.ghost, [2, 6, 10, 14]),
      } },
    ],
  },
  {
    id: 'reggaeton', name: 'Reggaeton', bpm: 95, description: 'Il "dembow": cassa regolare e rullante che salta in contrattempo',
    variants: [
      { name: 'Base', hits: { kick: [0, 4, 8, 12], snare: [3, 6, 11, 14] } },
      { name: 'Ricco', hits: {
        kick: [0, 4, 8, 12], snare: [3, 6, 11, 14], clap: [[6, V.soft], [14, V.soft]], hihatClosed: eighths(V.soft, V.ghost),
      } },
    ],
  },
  {
    id: 'rock', name: 'Rock', bpm: 120, description: 'Deciso, come una batteria vera: charleston forti e rullante pieno',
    variants: [
      { name: 'Base', hits: { kick: [0, 8], snare: [[4, V.strong], [12, V.strong]], hihatClosed: eighths(V.normal, V.mid) } },
      { name: 'Ricco', hits: {
        kick: [0, [6, V.mid], 8, [10, V.normal]], snare: [[4, V.strong], [12, V.strong]],
        hihatClosed: eighths(V.normal, V.mid, [14]), hihatOpen: [[14, V.normal]],
      } },
    ],
  },
  {
    id: 'trap', name: 'Trap', bpm: 140, description: 'Veloce ma "a metà tempo": rullante sul 3, charleston fitti a raffica',
    variants: [
      { name: 'Base', hits: { kick: [0, [10, V.normal]], clap: [8], snare: [[8, V.mid]], hihatClosed: eighths(V.mid, V.soft) } },
      { name: 'Ricco', hits: {
        kick: [0, [3, V.mid], [10, V.normal], [11, V.mid]], clap: [8], snare: [[8, V.mid]], hihatOpen: [[6, V.soft]],
        hihatClosed: [...sixteenths(V.mid, V.soft, V.ghost, [6, 12, 13, 14, 15]), [12, V.ghost], [13, V.soft], [14, V.mid], [15, V.normal]],
      } },
    ],
  },
]

export function findGenre(id: string): GenreRhythm | undefined {
  return GENRE_RHYTHMS.find((g) => g.id === id)
}
