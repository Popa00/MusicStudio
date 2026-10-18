import type { DrumVoiceId } from '../../music/drumPattern'

/** Nome e breve spiegazione di ogni suono, per chi non conosce la batteria. */
export const VOICE_LABELS: Record<DrumVoiceId, { name: string; hint: string }> = {
  kick: { name: 'Cassa', hint: 'Il colpo grave e profondo che dà la spinta al ritmo' },
  snare: { name: 'Rullante', hint: 'Il colpo secco, di solito sul 2° e 4° battito' },
  clap: { name: 'Battimani', hint: 'Un battito di mani, alternativa più leggera al rullante' },
  hihatClosed: { name: 'Charleston chiuso', hint: 'Il "tic" breve che scandisce il tempo' },
  hihatOpen: { name: 'Charleston aperto', hint: 'Il "tsss" più lungo, per dare respiro' },
}
