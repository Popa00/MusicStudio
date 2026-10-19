import type * as Tone from 'tone'

/** Ritardi dei filtri "a pettine" e "passa-tutto" di Freeverb (in campioni a 44,1 kHz). */
const COMB_SAMPLES = [1557, 1422, 1277, 1116]
const ALLPASS_SAMPLES = [556, 441]
/** Ritardo extra del canale destro: rende il riverbero più ampio (stereo). */
export const STEREO_SPREAD = 23
const ALLPASS_GAIN = 0.5
const DAMPING_HZ = 5000
/**
 * Nel Web Audio la Q del passa-basso è in dB: il valore predefinito (1 dB) crea un picco sopra 1
 * vicino al taglio. Dentro un anello di ritorno quel picco fa crescere l'eco all'infinito
 * (suono saturato, poi il filtro "esplode" e tace). -3 dB = nessun picco.
 */
const DAMPING_Q_DB = -3
/** Ritorno massimo dei pettini (code fino a ~10 s); con lo smorzamento senza picco l'anello resta < 1. */
const MAX_FEEDBACK = 0.98
/** Livello complessivo della coda. */
const TAIL_LEVEL = 0.4

const toSeconds = (samples: number) => samples / 44100

/** Guadagno di ritorno per far scendere l'eco di 60 dB in `decay` secondi. */
export function combFeedback(delaySeconds: number, decay: number): number {
  return Math.min(MAX_FEEDBACK, Math.pow(10, (-3 * delaySeconds) / Math.max(0.1, decay)))
}

/**
 * Livello d'ingresso di un pettine. Con √(1 − ritorno) l'energia di un colpo (es. batteria)
 * resta circa la stessa per ogni durata: le code lunghe durano di più ma non sono molto più forti.
 */
export function combInputGain(feedback: number): number {
  return TAIL_LEVEL * Math.sqrt(1 - feedback)
}

export interface Comb {
  input: GainNode
  feedback: GainNode
  delaySeconds: number
}

/*
 * Tutti nodi nativi del browser (non componenti Tone): i componenti Tone portano con sé
 * segnali di controllo sempre attivi che, moltiplicati per decine di nodi, pesano sul processore.
 */

function buildComb(ctx: Tone.BaseContext, source: AudioNode, sum: AudioNode, delaySeconds: number, nodes: AudioNode[]): Comb {
  const input = ctx.createGain()
  const delay = ctx.createDelay(1)
  const damp = ctx.createBiquadFilter()
  const feedback = ctx.createGain()
  delay.delayTime.value = delaySeconds
  damp.type = 'lowpass'
  damp.frequency.value = DAMPING_HZ
  damp.Q.value = DAMPING_Q_DB
  // Volumi a zero finché setDecay non imposta quelli giusti: niente "botta" all'avvio.
  input.gain.value = 0
  feedback.gain.value = 0
  source.connect(input)
  input.connect(delay)
  delay.connect(damp)
  damp.connect(feedback)
  feedback.connect(delay)
  delay.connect(sum)
  nodes.push(input, delay, damp, feedback)
  return { input, feedback, delaySeconds }
}

/** Passa-tutto di Schroeder: sparpaglia gli echi senza cambiare il timbro. */
function buildAllpass(ctx: Tone.BaseContext, source: AudioNode, delaySeconds: number, nodes: AudioNode[]): AudioNode {
  const w = ctx.createGain()
  const delay = ctx.createDelay(1)
  const feedback = ctx.createGain()
  const forward = ctx.createGain()
  const out = ctx.createGain()
  delay.delayTime.value = delaySeconds
  feedback.gain.value = ALLPASS_GAIN
  forward.gain.value = -ALLPASS_GAIN
  source.connect(w)
  w.connect(delay)
  delay.connect(feedback)
  feedback.connect(w)
  w.connect(forward)
  forward.connect(out)
  delay.connect(out)
  nodes.push(w, delay, feedback, forward, out)
  return out
}

/** Un lato (sinistro o destro): 4 pettini in parallelo, poi 2 passa-tutto in serie. */
export function buildSide(ctx: Tone.BaseContext, source: AudioNode, spread: number, nodes: AudioNode[]) {
  const sum = ctx.createGain()
  nodes.push(sum)
  const combs = COMB_SAMPLES.map((samples) => buildComb(ctx, source, sum, toSeconds(samples + spread), nodes))
  let output: AudioNode = sum
  for (const samples of ALLPASS_SAMPLES) output = buildAllpass(ctx, output, toSeconds(samples + spread), nodes)
  return { output, combs }
}

/**
 * Imposta la durata della coda su tutti i pettini. `immediate` alla creazione;
 * altrimenti una breve rampa per evitare "click" mentre si gira la manopola.
 */
export function setDecay(ctx: Tone.BaseContext, combs: Comb[], decay: number, immediate = false): void {
  for (const comb of combs) {
    const g = combFeedback(comb.delaySeconds, decay)
    const input = combInputGain(g)
    if (immediate) {
      comb.feedback.gain.value = g
      comb.input.gain.value = input
    } else {
      comb.feedback.gain.setTargetAtTime(g, ctx.currentTime, 0.02)
      comb.input.gain.setTargetAtTime(input, ctx.currentTime, 0.02)
    }
  }
}
