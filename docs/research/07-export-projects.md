# 7. Esportazione e progetti

Come **salvare il lavoro** e come **ottenere un file audio** da ascoltare/condividere.

---

## 7.1 Export WAV — `MVP`, difficoltà media

**Cos'è:** WAV è audio **non compresso**: massima qualità, file grande (~10 MB al minuto in stereo 44.1 kHz,
16 bit). È il formato "master" da cui si ricava tutto il resto.

- **Rendering offline** (più veloce del tempo reale, nessun rischio di "scatti"):
  `Tone.Offline(async (context) => { /* ricostruisci strumenti, effetti e Transport */ }, durata)`
  → `Promise<ToneAudioBuffer>`. Web Audio sottostante: `OfflineAudioContext`.
  Implicazione architetturale importante: il motore audio deve poter **ricostruire l'intero grafo
  (strumenti, effetti, mixer, eventi) a partire dallo stato del progetto**, in un contesto diverso da quello
  live. Progettarlo così fin dall'inizio evita una riscrittura dopo.
  Attenzione a `Tone.Reverb`: la generazione dell'impulso è asincrona, va attesa anche nel contesto offline.
- **Codifica WAV:** scrivere l'header RIFF + campioni PCM 16 bit (≈ 50 righe di TS, nessuna dipendenza),
  oppure una libreria (es. `audiobuffer-to-wav`, non verificata).
- **Durata:** fine dell'ultima clip + coda (es. +2 s) per non tagliare riverbero/delay.
- **Alternativa più semplice** (meno consigliata): `Tone.Recorder` sul master mentre il brano suona in tempo
  reale → dura quanto il brano e produce WebM, non WAV.
- Opzioni `v2`: esportare solo la regione di loop; normalizzazione; 24 bit; sample rate 48 kHz.

## 7.2 Export MP3 — `v2`, difficoltà media

MP3 = audio **compresso** (circa 1/10 del WAV), ideale per mandarlo su WhatsApp/email.
I browser **non** hanno un encoder MP3 integrato → serve una libreria:
- `lamejs` (JS puro, fork vari: zhuker/lamejs, beatboxjs/lamejs, km-lamejs) — diffuso ma poco mantenuto;
- `@mediabunny/mp3-encoder` (LAME compilato in WASM, mantenuto attivamente, legato all'ecosistema Mediabunny);
- `higuma/mp3-lame-encoder-js` (Emscripten, solo CBR).
Licenze e date dell'ultimo commit **non verificate**: controllarle prima di scegliere.
Codifica in un **Web Worker** per non bloccare l'interfaccia.
Alternativa senza dipendenze: OGG/Opus o WebM via `MediaRecorder` (supporto diverso per browser).

## 7.3 Export MIDI — `v2`, difficoltà bassa

Esporta le note (non l'audio) in un file `.mid` da aprire in altre DAW (GarageBand, Ableton, MuseScore).
`@tonejs/midi`: `new Midi()` → `addTrack()` → `track.addNote({ midi, time, duration, velocity })` →
`midi.toArray()` → download. Le stesse funzioni servono per l'**import** (vedi `02-notes-composition.md`).

## 7.4 Export "stems" (una traccia per file) — `nice`

Un WAV per ogni traccia: si fa ripetendo il rendering offline mettendo in solo una traccia alla volta.

## 7.5 Salvataggio progetto — `MVP`, difficoltà media

**Cos'è:** salvare tutto (tracce, note, strumenti, effetti, mixer, BPM) per riaprirlo dopo.

**Formato consigliato:**
- Un oggetto **JSON** serializzato dallo store Zustand, con:
  - `formatVersion` (numero) per poter **migrare** i progetti quando il formato cambia;
  - solo dati, mai oggetti Tone.js (questi si ricostruiscono dal JSON);
  - riferimenti agli audio tramite id (`sampleId`).
- Se ci sono file audio (v2): un archivio **`.zip`** con `project.json` + cartella `audio/` (es. con JSZip;
  libreria non verificata in questa ricerca). Estensione personalizzata possibile (es. `.homecloud` → da decidere).
- **Validazione all'apertura** (input non fidato): schema con es. `zod`, limiti di dimensione, nessun
  `eval`. Coinvolgere `security-code-reviewer`.

**Dove salvare (nessun backend):**

| Metodo | Supporto | Uso consigliato |
|---|---|---|
| **IndexedDB** | tutti i browser moderni | **autosalvataggio** continuo + elenco "progetti recenti" — `MVP` |
| Download file + `<input type="file">` | tutti | "Salva come…/Apri…" universale — `MVP` |
| File System Access API (`showSaveFilePicker`, `showOpenFilePicker`) | solo Chromium (Chrome/Edge); non Firefox/Safari secondo MDN/conoscenza attuale | "Salva" sullo stesso file senza ri-scaricarlo — `v2` con fallback |
| OPFS (Origin Private File System) | Chrome, Edge, Firefox, Safari recenti | archivio interno per audio pesanti — `v2` |

Librerie utili per IndexedDB: `idb` o `idb-keyval` (wrapper minimali; non verificati in dettaglio).
Autosave: salvare con *debounce* (es. 1–2 s dopo l'ultima modifica), non a ogni movimento del mouse.
Chiedere `navigator.storage.persist()` per ridurre il rischio che il browser cancelli i dati.

## 7.6 Gestione progetti — `MVP` (base)

- Nuovo / Apri / Salva / Salva come / Duplica / Elimina; "progetti recenti" in home.
- Avviso "modifiche non salvate" (`beforeunload`).
- Nome del progetto, BPM, tonalità salvati nel progetto.

## 7.7 Packaging dell'app (influisce su salvataggio) — decisione aperta

"Locale" può significare:
1. **Web app in browser** su `localhost` (o PWA installabile): zero installazioni, ma dipende dalle API del browser.
2. **App desktop** con Tauri o Electron: accesso pieno al file system (salvataggi veri, cartelle di campioni)
   e nessuna differenza tra browser. Più lavoro di build.
Raccomandazione: partire come web app (Vite) tenendo il salvataggio dietro un'interfaccia
(`ProjectStorage`) così si può aggiungere Tauri/Electron dopo senza toccare il resto.

---

## Fonti
- Tone.js Offline: https://tonejs.github.io/docs/15.1.22/functions/Offline.html
- MDN OfflineAudioContext: https://developer.mozilla.org/en-US/docs/Web/API/OfflineAudioContext
- @tonejs/midi: https://github.com/Tonejs/Midi
- MDN File System API: https://developer.mozilla.org/en-US/docs/Web/API/File_System_API
- MDN IndexedDB: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
- MDN StorageManager.persist: https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/persist
- lamejs: https://github.com/zhuker/lamejs , https://github.com/beatboxjs/lamejs
- mp3-lame-encoder-js: https://github.com/higuma/mp3-lame-encoder-js
