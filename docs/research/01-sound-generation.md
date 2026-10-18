# 1. Generazione del suono

Questa parte spiega **da dove nasce il suono** nell'app: sintetizzatori, campionatori e drum machine.
Stack: Tone.js v15 (sopra la Web Audio API). Elenco delle classi verificato sulla documentazione ufficiale
(https://tonejs.github.io/docs/).

Legenda priorità: `MVP` = prima versione, `v2` = importante dopo, `nice` = nice-to-have.

---

## 1.1 Oscillatori e forme d'onda — `MVP`, difficoltà bassa

**Cos'è:** un oscillatore è un generatore di "vibrazione" ripetuta. Più vibra veloce, più la nota è acuta
(la frequenza si misura in Hz: il La centrale è 440 Hz). La **forma d'onda** decide il "colore" del suono:

| Forma | Come suona | Esempio d'uso |
|---|---|---|
| `sine` (sinusoide) | puro, morbido, quasi un fischio | bassi profondi (sub-bass), flauti |
| `triangle` (triangolo) | morbido ma un po' più "vivo" | melodie dolci, stile videogiochi |
| `square` (quadra) | vuoto, nasale, "8-bit" | chiptune, clarinetto |
| `sawtooth` (dente di sega) | brillante, ronzante, ricco | archi sintetici, lead, bassi EDM |

- **Tone.js:** `Tone.Oscillator` (tipi `sine`/`square`/`sawtooth`/`triangle`), `Tone.OmniOscillator`
  (accetta anche `fatsawtooth`, `fmsine`, `amsquare`, `pulse`, `pwm`), `Tone.FatOscillator` (più voci
  leggermente stonate tra loro = suono "grosso", detto *unison/detune*), `Tone.PulseOscillator`, `Tone.PWMOscillator`.
- **Web Audio:** `OscillatorNode`; forme personalizzate con `createPeriodicWave()`.
- **Rumore:** `Tone.Noise` (`white`/`pink`/`brown`) — utile per piatti, rullante, effetti "vento".

## 1.2 Sintesi sottrattiva — `MVP`, difficoltà bassa

**Cos'è:** si parte da un'onda ricca (es. sawtooth) e si "toglie" qualcosa con un **filtro** (vedi 1.6).
È il modo classico dei synth analogici (Minimoog, Roland Juno) ed è il più facile da capire.

- **Tone.js:** `Tone.Synth` (oscillatore + inviluppo), `Tone.MonoSynth` (oscillatore + filtro + 2 inviluppi:
  il synth sottrattivo "completo"), `Tone.DuoSynth` (due MonoSynth sovrapposti).
- Suggerimento: per l'MVP un unico "Synth" con: forma d'onda, ADSR, filtro (cutoff + resonance), volume.

## 1.3 Sintesi FM e AM — `MVP` (come preset) / `v2` (editing completo), difficoltà bassa

**Cos'è:** un oscillatore ne "modula" un altro. In **FM** (modulazione di frequenza) nasce un suono
metallico/cristallino: campane, piano elettrico tipo Yamaha DX7, bassi "growl". In **AM** (modulazione
di ampiezza) il suono diventa più "tremolante"/campanaccio.

- **Tone.js:** `Tone.FMSynth` (parametri chiave: `harmonicity` = rapporto tra le due frequenze,
  `modulationIndex` = quanto è forte la modulazione), `Tone.AMSynth`, `Tone.FMOscillator`, `Tone.AMOscillator`.
- Per un non musicista: esporre solo 2 manopole ("Carattere" = harmonicity, "Brillantezza" = modulationIndex) + preset.

## 1.4 Sintesi wavetable — `nice`, difficoltà alta

**Cos'è:** l'oscillatore legge una "tabella" di molte forme d'onda e può **scorrere** dall'una all'altra,
creando suoni che si evolvono (synth moderni come Serum, Ableton Wavetable, Bitwig Polymer).

- **Web Audio:** `PeriodicWave` crea una forma d'onda personalizzata ma **statica**: non c'è il "morphing"
  tra forme. Un vero wavetable richiede un `AudioWorkletProcessor` scritto a mano (codice DSP in JS/WASM).
- **Tone.js:** nessuna classe wavetable dedicata (verificato sull'elenco classi).
- Ripiego economico: `OmniOscillator` con `partials` (lista di armoniche) modificati nel tempo.

## 1.5 Inviluppo ADSR — `MVP`, difficoltà bassa

**Cos'è:** descrive **come cambia il volume di una nota nel tempo**, dal tasto premuto al rilascio.

- **A**ttack: quanto ci mette ad arrivare al massimo (0 s = colpo secco tipo piano; 1 s = entra piano tipo archi).
- **D**ecay: quanto ci mette a scendere dal picco al livello di "mantenimento".
- **S**ustain: il livello (0–1) che resta finché tieni premuto (0 = suono che si spegne da solo, tipo pizzicato).
- **R**elease: quanto dura la "coda" dopo che lasci il tasto.

Esempi: piano ≈ A 0.005 / D 1 / S 0.2 / R 1; pad (tappeto) ≈ A 1 / D 0.5 / S 0.8 / R 2; pluck ≈ A 0 / D 0.2 / S 0 / R 0.2.

- **Tone.js:** `Tone.Envelope`, `Tone.AmplitudeEnvelope` (sul volume), `Tone.FrequencyEnvelope` (sul filtro:
  la "wah" all'inizio della nota). Già integrati in `Synth`/`MonoSynth` (proprietà `envelope`, `filterEnvelope`).
- **UI:** mostrare il grafico dell'inviluppo trascinabile (come Ableton e Vital) è molto più chiaro di 4 numeri.

## 1.6 Filtri — `MVP`, difficoltà bassa

**Cos'è:** un filtro lascia passare alcune frequenze e ne attenua altre.
- **Low-pass** (passa-basso): taglia gli acuti → suono più scuro/ovattato (come sentire la musica dalla stanza accanto).
- **High-pass** (passa-alto): taglia i bassi → suono più sottile (effetto "radio").
- **Band-pass**: lascia solo una fascia centrale (effetto "telefono").
- **Cutoff** = frequenza dove inizia il taglio; **Resonance / Q** = enfasi vicino al cutoff (suono "fischiante").
- **Rolloff** (-12/-24/-48 dB/oct) = quanto è ripido il taglio.

- **Tone.js:** `Tone.Filter` (type, frequency, Q, rolloff), `Tone.BiquadFilter`, `Tone.OnePoleFilter`,
  `Tone.AutoFilter` (filtro mosso da un LFO). **Web Audio:** `BiquadFilterNode`.

## 1.7 LFO (Low Frequency Oscillator) — `v2`, difficoltà media

**Cos'è:** un oscillatore lentissimo (es. 0.1–20 Hz) che non si sente direttamente ma **muove un altro
parametro** in modo ciclico. Collegato al volume → tremolo; al pitch → vibrato; al cutoff del filtro →
effetto "wobble" della dubstep.

- **Tone.js:** `Tone.LFO` (frequency, min, max, type) da collegare con `.connect(param)`; frequenza
  sincronizzabile al tempo con `lfo.sync()` e valori come `"8n"`. Effetti già pronti che usano un LFO
  interno: `Tremolo`, `Vibrato`, `AutoFilter`, `AutoPanner`, `AutoWah`.
- La parte difficile è la UI di "routing" (scegliere quale parametro modulare): in v2 basta 1 LFO per synth
  con destinazione a tendina (pitch / filtro / volume / pan).

## 1.8 Polifonia — `MVP`, difficoltà bassa

**Cos'è:** quante note possono suonare **insieme**. *Monofonico* = una nota alla volta (bassi, lead);
*polifonico* = accordi (piano, pad).

- **Tone.js:** `new Tone.PolySynth(Tone.Synth, opzioni)` crea automaticamente più voci; `maxPolyphony`
  limita il numero (default 32 secondo la doc; valore da verificare sulla versione installata). Opzione
  "Mono/Poly" nell'UI. Attenzione: tante voci + tanti effetti = più CPU.
- *Glide/portamento* (nota che "scivola" nella successiva): proprietà `portamento` di `Synth`/`MonoSynth` — `v2`.

## 1.9 Campionatore (Sampler) — `v2`, difficoltà media

**Cos'è:** invece di generare l'onda, riproduce **registrazioni reali** (un pianoforte vero, una voce,
una chitarra). Suonando note diverse il campione viene accelerato/rallentato.

- **Tone.js:** `Tone.Sampler` — gli dai pochi campioni (es. un Do ogni ottava) e lui "riempie" le note
  mancanti cambiando l'intonazione. Ha `attack`/`release`. `Tone.Player` / `Tone.Players` per suonare un file
  così com'è; `Tone.GrainPlayer` per cambiare velocità senza cambiare intonazione (qualità limitata).
- **Web Audio:** `AudioBufferSourceNode` + `decodeAudioData()`.
- Decisione aperta: **da dove prendere i campioni** (licenza libera, es. CC0) e quanto pesano nel progetto.

## 1.10 Drum machine — `MVP`, difficoltà bassa/media

**Cos'è:** strumento per batteria elettronica: cassa (kick), rullante (snare), charleston (hi-hat chiuso/aperto),
clap, tom, piatti. Si programma tipicamente con lo step sequencer (vedi `02-notes-composition.md`).
Riferimenti: Roland TR-808/909, FL Studio Channel Rack, GarageBand Drummer, Ableton Drum Rack.

Due approcci, entrambi validi in Tone.js:
1. **Batteria sintetizzata** (nessun file da caricare, ottima per l'MVP):
   - kick → `Tone.MembraneSynth`; snare/clap → `Tone.NoiseSynth` (+ filtro); hi-hat/piatti → `Tone.MetalSynth`.
2. **Batteria a campioni** (suono più realistico): `Tone.Players` con un file per pezzo (kit). Serve una libreria di suoni.

Suggerimento: MVP con kit sintetizzato (zero problemi di licenze/peso), kit a campioni in v2.

## 1.11 Altri strumenti pronti in Tone.js

- `Tone.PluckSynth` — corda pizzicata (algoritmo Karplus-Strong): chitarra/arpa semplice. `MVP` come preset.
- `Tone.MetalSynth`, `Tone.MembraneSynth`, `Tone.NoiseSynth` — vedi drum machine.

## 1.12 Preset strumenti — `MVP`, difficoltà bassa

Per chi non è musicista è più importante avere **buoni preset con nomi chiari** ("Piano elettrico",
"Basso profondo", "Pad spaziale", "Lead 8-bit") che tante manopole. Ogni preset = oggetto JSON di
opzioni passato al costruttore Tone.js (`synth.set(opzioni)`). GarageBand e BandLab puntano proprio su questo.

---

## Note tecniche

- **Sblocco audio:** i browser bloccano l'audio finché l'utente non clicca. Chiamare `await Tone.start()`
  al primo click (es. pulsante "Inizia"). Fonte: https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay
- **Latenza:** `new Tone.Context({ latencyHint: "interactive" })` per suonare dal vivo; `"playback"` per
  riproduzione più stabile. Tone usa un `lookAhead` (default ~0.1 s) che aggiunge ritardo: per la tastiera
  dal vivo valutare di ridurlo.
- **Separazione motore/UI** (CLAUDE.md): un file per strumento in `src/audio/instruments/`, la UI legge/scrive
  solo lo stato Zustand.

## Fonti
- Tone.js API: https://tonejs.github.io/docs/
- MDN Web Audio API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
- MDN BiquadFilterNode: https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode
- MDN PeriodicWave: https://developer.mozilla.org/en-US/docs/Web/API/PeriodicWave
- Ableton "Learning Synths" (introduzione interattiva ai synth): https://learningsynths.ableton.com/
