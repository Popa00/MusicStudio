# 5. Mixer e automazione

Il **mixer** è il "banco" dove si bilanciano tutte le tracce. L'**automazione** fa cambiare i parametri
da soli durante il brano.

---

## Parte A — Mixer

### A.1 Channel strip (canale) — `MVP`, difficoltà bassa

Ogni traccia ha un canale verticale con:
- **Volume / fader** in **dB** (decibel). 0 dB = volume originale, -6 dB ≈ metà percepita, -∞ = silenzio.
  Usare i dB e non una scala lineare: è come l'orecchio percepisce il volume.
- **Pan** (panorama): posizione sinistra/destra (-1 … +1). Esempio: chitarra un po' a sinistra, synth un
  po' a destra = mix più spazioso. Basso e cassa di solito al centro.
- **Mute** (M): spegne la traccia. **Solo** (S): ascolta solo quella traccia (e le altre in solo).

**Tone.js:** `Tone.Channel` fa tutto questo in un solo nodo: `volume` (dB), `pan`, `mute`, `solo`,
`muted` (sola lettura, vero se silenziato anche a causa del solo di un'altra traccia). Più `send(name)` /
`receive(name)` per i bus (vedi A.3). Alternative a pezzi: `Tone.Volume`, `Tone.Panner`, `Tone.PanVol`, `Tone.Solo`.
**Web Audio:** `GainNode` + `StereoPannerNode`.

### A.2 Meter (indicatore di livello) — `MVP`, difficoltà bassa

Barra che si muove col volume: verde ok, giallo forte, **rosso = clipping** (sopra 0 dB → distorsione).
Insegna al principiante a non "andare in rosso".
- **Tone.js:** `Tone.Meter` (`getValue()` in dB, `smoothing`; opzione `channelCount: 2` per stereo),
  `Tone.DCMeter`. **Web Audio:** `AnalyserNode`.
- Lettura in un loop `requestAnimationFrame` **fuori** da React state (aggiornare direttamente il DOM/canvas
  o via ref): 60 aggiornamenti/s nello store Zustand provocherebbero re-render inutili.
- Indicatore di "peak hold" (picco che resta qualche secondo) e LED di clip: `v2`.

### A.3 Bus, send e return — `v2`, difficoltà media

- **Send:** una "copia" del segnale di una traccia mandata, con un certo livello, a un canale effetti
  condiviso (**return**). Esempio: tutte le tracce mandano un po' al canale "Riverbero" → un solo
  riverbero per tutto, suono più coeso e meno CPU.
- **Bus/gruppo:** più tracce che confluiscono in un canale unico (es. tutte le percussioni in "Batteria")
  per regolarle insieme.
- **Tone.js:** `channel.send("reverb", -12)` sulla traccia e `returnChannel.receive("reverb")` sul canale
  effetti: collegamento per nome, senza riferimenti diretti tra moduli (comodo con l'architettura a file piccoli).
  I gruppi si fanno collegando i `Channel` delle tracce a un `Channel` intermedio invece che al master.

### A.4 Master — `MVP`, difficoltà bassa

Il canale finale dove arriva tutto: volume generale, meter, **limiter** sempre attivo (vedi effetti §4.6).
**Tone.js:** `Tone.getDestination()` (ha `volume` e `mute`); catena master con
`Tone.getDestination().chain(compressor, limiter)`.

### A.5 Analizzatori visivi — `v2` / `nice`

- Oscilloscopio (forma d'onda in tempo reale): `Tone.Waveform`.
- Analizzatore di spettro (quanta energia su bassi/medi/acuti): `Tone.FFT`. Utile abbinato all'EQ.

### A.6 UI del mixer
- Vista mixer separata (stile Ableton/Logic) **o** controlli compatti nella testata di ogni traccia
  (stile BandLab/GarageBand). Per l'MVP basta la testata traccia (volume, pan, M, S, meter piccolo);
  la vista mixer completa è `v2`.
- Doppio click su fader = ritorno a 0 dB; Alt/Shift+drag = regolazione fine.

---

## Parte B — Automazione

### B.1 Cos'è — `v2`, difficoltà media/alta

Una **curva disegnata sulla timeline** che muove un parametro nel tempo. Esempi tipici:
- fade-in/out del volume all'inizio/fine brano;
- filtro low-pass che si apre lentamente prima del ritornello ("build-up");
- riverbero che aumenta solo sull'ultima nota.

Tutte le DAW (Ableton, FL "automation clip", Logic, BandLab) la mostrano come una linea con **punti**
(*breakpoint*) collegati sotto/sopra la traccia.

### B.2 Implementazione con Tone.js / Web Audio

- Ogni parametro audio è un `AudioParam` (Web Audio) / `Tone.Param` o `Tone.Signal` con metodi di
  scheduling: `setValueAtTime`, `linearRampToValueAtTime`, `exponentialRampToValueAtTime`,
  `setTargetAtTime`, `cancelScheduledValues`, e in Tone `rampTo(valore, durata, tempo)`.
- Problema: questi metodi usano il tempo **assoluto** dell'AudioContext, mentre l'automazione è in
  **battute** e deve seguire loop, pausa e spostamenti del cursore.
- Soluzioni:
  1. Ad ogni `start`/loop: `cancelScheduledValues` e ri-schedulare le rampe dei punti dalla posizione attuale
     (dentro `transport.schedule`/`Tone.Part`, usando il parametro `time` che Tone passa al callback).
  2. Callback a intervallo regolare (`transport.scheduleRepeat(cb, "32n")`) che calcola il valore della curva
     e fa un `rampTo` breve: più semplice da tenere corretto con loop e seek, leggermente meno preciso.
  3. `Tone.SyncedSignal`: segnale le cui automazioni sono legate al Transport (presente nelle API; da
     verificare in prototipo con loop e seek).
- Dati: `{ trackId, paramId, points: [{ tick, value, curve: "linear"|"exp" }] }`.

### B.3 Cosa rendere automatizzabile
- `v2`: volume e pan di traccia, cutoff filtro, wet di reverb/delay, BPM? (cambi di tempo: `transport.bpm.rampTo` —
  complicato per la timeline, `nice`).
- "Registrazione" dell'automazione muovendo la manopola durante il play: `nice`.

### B.4 Alternative più semplici per l'MVP
- **Fade-in/out** sulle clip (maniglie agli angoli, come GarageBand/BandLab) — copre il caso più comune.
- **LFO sincronizzato** (vedi `01-sound-generation.md`) per movimenti ciclici senza disegnare curve.

---

## Fonti
- Tone.js Channel: https://tonejs.github.io/docs/15.1.22/classes/Channel.html
- Tone.js Meter / FFT / Waveform / Param / SyncedSignal: https://tonejs.github.io/docs/
- MDN AudioParam (scheduling): https://developer.mozilla.org/en-US/docs/Web/API/AudioParam
- MDN StereoPannerNode: https://developer.mozilla.org/en-US/docs/Web/API/StereoPannerNode
- Ableton Live Manual, Mixing / Automation: https://www.ableton.com/en/manual/mixing/ , https://www.ableton.com/en/manual/automation-and-editing-envelopes/
