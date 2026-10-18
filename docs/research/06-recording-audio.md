# 6. Registrazione e audio

Fin qui tutto era **MIDI/note** (istruzioni per uno strumento). Qui si parla di **audio vero**:
registrazioni dal microfono e file audio (voce, chitarra, loop scaricati).

---

## 6.1 Import di file audio — `v2`, difficoltà media

**Cos'è:** trascinare un file (`.wav`, `.mp3`, `.ogg`…) nella timeline per creare una **clip audio**.
Esempi: un loop di batteria, una voce registrata col telefono, un campione per il sampler.

- **Web Audio:** leggere il file con `File.arrayBuffer()` → `audioContext.decodeAudioData()` → `AudioBuffer`.
  I formati decodificabili dipendono dal browser (WAV, MP3, OGG/Vorbis, AAC sono comuni; verificare FLAC/Opus
  sul browser target).
- **Tone.js:** `new Tone.ToneAudioBuffer()` / `Tone.ToneAudioBuffer.fromUrl()`, riproduzione con
  `Tone.Player` (proprietà `loop`, `playbackRate`, `reverse`, `fadeIn`, `fadeOut`); sincronizzato al
  Transport con `player.sync().start(tempo)`.
- **Sicurezza:** i file importati sono input non fidato → limite di dimensione, controllo estensione/MIME,
  gestione errori di decodifica. (Coinvolgere il subagent `security-code-reviewer`.)
- **Drag & drop**: eventi HTML5 `dragover`/`drop` sulla timeline + `<input type="file">` come alternativa.

## 6.2 Forma d'onda (waveform) — `v2`, difficoltà media

**Cos'è:** il disegno della clip audio (le "montagnette"): si vede dove sono i colpi forti e i silenzi,
indispensabile per tagliare e allineare.
- Calcolo dei **picchi**: da `AudioBuffer.getChannelData(0)` si prende max/min ogni N campioni (es. 1 valore
  per pixel) → disegno su `<canvas>`. Calcolare i picchi **una volta** all'import (eventualmente in un
  Web Worker per file lunghi) e salvarli in cache per i vari livelli di zoom.
- Libreria pronta: `wavesurfer.js` (ottima per un singolo file; per una timeline multi-traccia spesso si
  preferisce un disegno custom su canvas). Non verificata in dettaglio in questa ricerca.
- Diverso dall'oscilloscopio in tempo reale (`Tone.Waveform`, vedi mixer).

## 6.3 Editing clip audio — `v2`

- Spostare, tagliare (trim inizio/fine = `Player.start(time, offset, duration)`), dividere, **fade in/out**
  (`Player.fadeIn`/`fadeOut`), guadagno della clip, invertire (`reverse`).
- **Time-stretch** (cambiare durata senza cambiare intonazione, per adattare un loop al BPM) — `nice`,
  difficoltà alta: `Tone.GrainPlayer` lo fa in modo granulare (qualità modesta); per una buona qualità servono
  algoritmi dedicati (es. librerie tipo Rubber Band/SoundTouch compilate in WASM — non verificate).
- **Pitch shift** di una clip: `Tone.PitchShift` (effetto) — `nice`.

## 6.4 Registrazione da microfono — `v2`, difficoltà media/alta

**Cos'è:** premere "Rec" e registrare voce o strumento in una nuova clip audio sulla traccia selezionata.

- **Accesso al microfono:** `navigator.mediaDevices.getUserMedia({ audio: {...} })` (permesso richiesto,
  contesto sicuro: HTTPS o `localhost`). In Tone.js: `new Tone.UserMedia()` → `await mic.open(deviceId?)`;
  `Tone.UserMedia.enumerateDevices()` per scegliere l'ingresso (scheda audio, microfono USB…).
- **Disattivare i filtri "da videochiamata"** che rovinano la musica: `echoCancellation: false`,
  `noiseSuppression: false`, `autoGainControl: false` nei vincoli di `getUserMedia`.
- **Catturare l'audio:**
  - `Tone.Recorder` (basato su `MediaRecorder`): semplice, ma restituisce un **Blob compresso**
    (in Chrome tipicamente WebM/Opus o Vorbis), **non sample-accurate**; la doc lo dà come nativo in Chrome e
    Firefox (polyfill per altri). Va poi decodificato con `decodeAudioData`.
  - **AudioWorklet** che copia i campioni grezzi (PCM) in memoria: qualità massima e tempo preciso; più codice.
    Consigliato se la registrazione diventa una funzione centrale.
- **Allineamento / latenza:** quello che senti e quello che registri arrivano con ritardo (latenza di ingresso +
  uscita). Va compensato spostando la clip registrata indietro: stimare con `audioContext.baseLatency` +
  `outputLatency` (non disponibile ovunque) oppure con un test "loopback" di calibrazione (`nice`).
  Senza compensazione la voce risulta "in ritardo" sul ritmo.
- **Monitoraggio** (sentirsi in cuffia mentre si registra): collegare il microfono al mixer; avvisare di usare
  le **cuffie** per evitare il fischio (feedback/larsen).
- **Count-in** (conteggio prima di registrare, es. 1 battuta di metronomo) — vedi `08-ux.md`.
- Registrazione **MIDI** (suonare con la tastiera del PC/MIDI mentre gira il brano e salvare le note): `v2`,
  più semplice di quella audio — servono solo i tempi delle note rispetto a `transport.ticks`.

## 6.5 Gestione della memoria

Un minuto di audio stereo 44.1 kHz in `Float32` ≈ 21 MB in RAM. Con molte clip audio:
- caricare l'audio una volta e condividere lo stesso `AudioBuffer` tra clip che lo usano;
- salvare l'audio su disco nel formato compresso o WAV (vedi `07-export-projects.md`), non nello stato Zustand
  (che deve contenere solo **riferimenti**, es. `sampleId`).

## 6.6 Libreria di suoni / campioni — `v2`

Un pannello "Browser" (come Ableton/BandLab/GarageBand Loops) con suoni pronti da trascinare.
Decisione aperta: quali campioni includere e con quale licenza (preferire CC0 / pubblico dominio),
e quanto spazio occupano nell'app.

---

## Fonti
- Tone.js UserMedia, Recorder, Player, GrainPlayer, ToneAudioBuffer: https://tonejs.github.io/docs/
- Tone.js Recorder: https://tonejs.github.io/docs/15.1.22/classes/Recorder.html
- MDN getUserMedia: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
- MDN decodeAudioData: https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/decodeAudioData
- MDN AudioWorklet: https://developer.mozilla.org/en-US/docs/Web/API/AudioWorklet
- MDN AudioContext.outputLatency: https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/outputLatency
- wavesurfer.js: https://wavesurfer.xyz/
