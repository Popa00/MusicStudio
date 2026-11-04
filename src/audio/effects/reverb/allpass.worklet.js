/*
 * Passa-tutto di Schroeder in serie, calcolati campione per campione nel thread audio.
 * Con nodi nativi (ritardo dentro un anello) Chrome aggiunge 128 campioni a ogni giro e, a caso,
 * a volte salta il primo eco: il riverbero usciva diverso a ogni esecuzione. Qui i ritardi sono esatti.
 *
 * File JavaScript semplice (niente import): viene caricato così com'è da audioWorklet.addModule.
 */
class AllpassChainProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super()
    const { delaysSeconds, gain } = options.processorOptions
    // Valori sempre validi: guadagno < 1 (stabile), ritardi finiti e di almeno un campione.
    this.gain = Number.isFinite(gain) ? Math.min(0.99, Math.max(0, gain)) : 0.5
    // Al massimo 1 s: niente buffer enormi anche se un giorno i ritardi arrivassero da fuori.
    const delays = delaysSeconds.filter((s) => Number.isFinite(s) && s > 0).map((s) => Math.min(1, s))
    this.buffers = delays.map((s) => new Float32Array(Math.max(1, Math.round(s * sampleRate))))
    this.positions = this.buffers.map(() => 0)
    this.alive = true
    // Il nodo viene eliminato (Stop, traccia tolta): il processore smette di girare.
    this.port.onmessage = () => {
      this.alive = false
    }
  }

  process(inputs, outputs) {
    const input = inputs[0] && inputs[0][0]
    const output = outputs[0] && outputs[0][0]
    if (!output) return this.alive
    const g = this.gain
    const buffers = this.buffers
    const positions = this.positions
    for (let i = 0; i < output.length; i++) {
      let x = input ? input[i] : 0
      // Un NaN entrato nei ritardi girerebbe per sempre: lo si ferma qui.
      if (!Number.isFinite(x)) x = 0
      for (let k = 0; k < buffers.length; k++) {
        const buffer = buffers[k]
        const pos = positions[k]
        // w[n] = x[n] + g·w[n−D]   y[n] = w[n−D] − g·w[n]
        const delayed = buffer[pos]
        let w = x + g * delayed
        // Valori enormi (es. un effetto prima andato fuori controllo) non devono diventare Infinity/NaN nel ritardo.
        if (!Number.isFinite(w)) w = 0
        buffer[pos] = w
        positions[k] = pos + 1 === buffer.length ? 0 : pos + 1
        x = delayed - g * w
      }
      output[i] = x
    }
    return this.alive
  }
}

try {
  registerProcessor('allpass-chain', AllpassChainProcessor)
} catch {
  // Già registrato in questo contesto (es. modulo ricaricato durante lo sviluppo).
}
