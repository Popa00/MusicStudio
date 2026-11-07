import type { DrumVoiceId } from '../../music/drumPattern'
import { createClap } from './clap'
import { createClave } from './clave'
import { createCowbell } from './cowbell'
import { createHihat } from './hihat'
import { createKick } from './kick'
import { createKick808 } from './kick808'
import { createPerc } from './perc'
import { createRimshot } from './rimshot'
import { createSampleVoice, SAMPLE_FILES, type SampledVoiceId } from './sampleVoice'
import { createSnap } from './snap'
import { createSnare } from './snare'
import { createTom } from './tom'
import type { AudioOutput, DrumVoice } from './types'

/**
 * Volume dei suoni registrati (i file sono normalizzati a -3 dB di picco). Il ride è un "ping"
 * con poca energia rispetto al picco: serve più volume per sentirlo quanto il crash.
 */
export const SAMPLE_LEVEL_DB: Record<SampledVoiceId, number> = {
  crash: -4,
  ride: -2,
  rideBell: -2,
  tambourine: -6,
  shaker: -6,
  conga: -4,
  bongo: -1,
}

const sampled = (voice: SampledVoiceId) => (out: AudioOutput) => createSampleVoice(out, SAMPLE_FILES[voice], SAMPLE_LEVEL_DB[voice])

/** Come si costruisce ogni suono della batteria: sintetizzato, oppure registrato (piatti, tamburi a mano...). */
export const VOICE_FACTORIES: Record<DrumVoiceId, (output: AudioOutput) => DrumVoice> = {
  kick: createKick,
  snare: createSnare,
  clap: createClap,
  hihatClosed: (out) => createHihat(out, 0.05, -4),
  hihatOpen: (out) => createHihat(out, 0.3, -10),
  kick808: createKick808,
  rimshot: createRimshot,
  snap: createSnap,
  tomLow: (out) => createTom(out, 'G2', 0.45),
  tomMid: (out) => createTom(out, 'D3', 0.35),
  tomHigh: (out) => createTom(out, 'A3', 0.28),
  shaker: sampled('shaker'),
  tambourine: sampled('tambourine'),
  conga: sampled('conga'),
  bongo: sampled('bongo'),
  cowbell: createCowbell,
  clave: createClave,
  perc: createPerc,
  crash: sampled('crash'),
  ride: sampled('ride'),
  rideBell: sampled('rideBell'),
}
