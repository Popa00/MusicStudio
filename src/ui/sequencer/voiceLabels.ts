import type { DrumVoiceId } from '../../music/drumPattern'

/** Nome e breve spiegazione di ogni suono, per chi non conosce la batteria. */
export const VOICE_LABELS: Record<DrumVoiceId, { name: string; hint: string }> = {
  kick: { name: 'Cassa', hint: 'Il colpo grave e profondo che dà la spinta al ritmo' },
  snare: { name: 'Rullante', hint: 'Il colpo secco, di solito sul 2° e 4° battito' },
  clap: { name: 'Battimani', hint: 'Un battito di mani, alternativa più leggera al rullante' },
  hihatClosed: { name: 'Charleston chiuso', hint: 'Il "tic" breve che scandisce il tempo' },
  hihatOpen: { name: 'Charleston aperto', hint: 'Il "tsss" più lungo, per dare respiro' },
  kick808: { name: 'Cassa 808', hint: 'Un "boom" lungo e profondo che fa anche da basso: tipico di trap e hip-hop' },
  rimshot: { name: 'Rimshot', hint: 'Il "tac" della bacchetta sul bordo del rullante: più discreto del rullante' },
  snap: { name: 'Snap', hint: 'Un colpo secco e acuto da drum machine, al posto o insieme al rullante (pop, trap, lo-fi)' },
  tomLow: { name: 'Tom basso', hint: 'Tamburo grave, per i "giri" di batteria prima di un cambio' },
  tomMid: { name: 'Tom medio', hint: 'Tamburo medio, per i "giri" di batteria' },
  tomHigh: { name: 'Tom alto', hint: 'Tamburo acuto, di solito il primo di un giro (alto → medio → basso)' },
  shaker: { name: 'Shaker', hint: 'Una maraca: fruscio morbido che dà movimento, spesso su ogni casella (suono registrato)' },
  tambourine: { name: 'Tamburello', hint: 'Colpo con sonagli metallici, spesso sul 2° e 4° battito (pop, lo-fi; suono registrato)' },
  conga: { name: 'Conga', hint: 'Tamburo a mano dal suono caldo, tipico dei ritmi latini e della house (suono registrato)' },
  bongo: { name: 'Bongo', hint: 'Tamburo a mano piccolo e acuto, insieme alla conga nei ritmi latini (suono registrato)' },
  cowbell: { name: 'Campanaccio', hint: 'Il "tong" metallico della cowbell, famoso nella musica latina e nella 808' },
  clave: { name: 'Clave', hint: 'Due legnetti battuti: un "toc" acuto, per ritmi latini' },
  perc: { name: 'Perc', hint: 'Un "blip" breve e intonato, molto usato in techno e house' },
  crash: { name: 'Crash', hint: "Il piatto che \"esplode\": segna l'inizio di una parte nuova del brano (suono registrato)" },
  ride: { name: 'Ride', hint: 'Piatto grande dal suono continuo, al posto del charleston nei momenti più aperti (suono registrato)' },
  rideBell: { name: 'Campana del ride', hint: 'Il centro del ride: un "ding" squillante che taglia il mix (suono registrato)' },
}

/** Gruppi del menu "+ Aggiungi suono", nell'ordine in cui compaiono. */
export const VOICE_GROUPS: { name: string; voices: DrumVoiceId[] }[] = [
  { name: 'Casse', voices: ['kick', 'kick808'] },
  { name: 'Rullanti e schiocchi', voices: ['snare', 'clap', 'rimshot', 'snap'] },
  { name: 'Charleston e piatti', voices: ['hihatClosed', 'hihatOpen', 'crash', 'ride', 'rideBell'] },
  { name: 'Tom', voices: ['tomHigh', 'tomMid', 'tomLow'] },
  { name: 'Percussioni', voices: ['shaker', 'tambourine', 'conga', 'bongo', 'cowbell', 'clave', 'perc'] },
]
