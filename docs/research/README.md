# Ricerca: funzionalità dell'app di creazione musicale

Indice dei report e roadmap. Stack deciso: **TypeScript + React + Vite + Tone.js (Web Audio API) + Zustand**,
nessun backend. Tutti i report sono scritti per chi **non è un musicista** (ogni termine è spiegato).

Riferimento classi: Tone.js v15 (https://tonejs.github.io/docs/). La versione esatta più recente su npm
non è stata confermata (verificare con `npm view tone version`).

## Report

| File | Contenuto |
|---|---|
| [01-sound-generation.md](01-sound-generation.md) | oscillatori, sintesi sottrattiva/FM/wavetable, ADSR, filtri, LFO, polifonia, sampler, drum machine |
| [02-notes-composition.md](02-notes-composition.md) | BPM e metrica, step sequencer, piano roll, pattern, scale/accordi, quantizzazione, swing, velocity, MIDI |
| [03-arrangement.md](03-arrangement.md) | modelli di DAW, tracce, timeline, clip, copia/incolla, undo/redo |
| [04-effects.md](04-effects.md) | riverbero, delay, EQ, distorsione, compressore, limiter, chorus/flanger/phaser, sidechain, catene |
| [05-mixer-automation.md](05-mixer-automation.md) | channel strip, meter, bus/send, master; automazione |
| [06-recording-audio.md](06-recording-audio.md) | import audio, waveform, editing clip audio, registrazione da microfono, latenza |
| [07-export-projects.md](07-export-projects.md) | export WAV/MP3/MIDI, formato e salvataggio progetto, packaging |
| [08-ux.md](08-ux.md) | metronomo, tastiera virtuale, scorciatoie, preset, onboarding, controlli UI |
| [09-drum-sounds.md](09-drum-sounds.md) | batteria sintetizzata vs campioni: qualità per strumento, librerie gratuite e licenze, raccomandazione MVP |

## Mini-glossario

- **BPM**: velocità del brano (battiti al minuto). **Battuta**: gruppo di battiti (di solito 4).
- **MIDI**: "spartito digitale" (quali note, quando, quanto forte) — non è audio.
- **Synth**: strumento che genera il suono da zero. **Sampler**: strumento che suona registrazioni.
- **ADSR**: come il volume di una nota nasce, si assesta e si spegne.
- **Filtro / cutoff**: rende il suono più scuro o più sottile. **LFO**: "mano invisibile" che muove un parametro ciclicamente.
- **Piano roll**: editor di note a griglia. **Step sequencer**: griglia a 16 caselle per i ritmi.
- **dB**: unità del volume. **Pan**: posizione sinistra/destra. **Clipping**: distorsione per volume eccessivo.
- **Wet/Dry**: quanto effetto vs suono originale. **Send**: invio di una parte del suono a un effetto condiviso.

---

## Roadmap

### MVP — "fare un beat con melodia ed esportarlo"
Generazione suono
- Synth polifonico (`PolySynth` di `Synth`/`FMSynth`/`AMSynth`, `MonoSynth` per bassi) con forma d'onda, ADSR, filtro.
- Drum machine sintetizzata (`MembraneSynth`, `NoiseSynth`, `MetalSynth`); dettagli e motivazione in `09`.
- Preset con nomi chiari per strumenti, kit ed effetti.

Composizione e arrangiamento
- Transport: play/stop, BPM, loop di una regione, solo 4/4 (`Tone.getTransport()`).
- Step sequencer 16 step per la batteria.
- Piano roll base (disegna/sposta/allunga/cancella, snap, ascolto nota, selezione multipla).
- Evidenziazione della scala nel piano roll (tonalità + maggiore/minore/pentatonica).
- Tracce strumento + clip/pattern su timeline lineare, copia/incolla/duplica.
- Undo/redo (es. `zundo`).

Effetti e mixer
- Effetti insert in lista: Reverb, FeedbackDelay, Filter, EQ3, Distortion; Compressor + Limiter sul master.
- Per traccia: volume (dB), pan, mute, solo, meter (`Tone.Channel`, `Tone.Meter`); volume master.

Progetto ed export
- Autosalvataggio in IndexedDB, Salva/Apri file JSON (con `formatVersion` e validazione).
- Export WAV con rendering offline (`Tone.Offline`).

UX
- Sblocco audio al primo click (`Tone.start()`), metronomo, tastiera virtuale (tasti PC + a schermo).
- Scorciatoie base, tooltip esplicativi, template iniziali, controlli manopola/fader con scale corrette.

### v2 — "come una DAW vera"
- Sampler (`Sampler`) e kit di batteria a campioni (`Players`); libreria suoni. Solo campioni con licenza verificata (vedi `09`).
- Import file audio, tracce audio, waveform, fade, trim/split.
- Registrazione da microfono (`UserMedia` + `Recorder` o AudioWorklet) con compensazione latenza; registrazione MIDI live.
- Input da tastiera MIDI (Web MIDI API), import/export `.mid` (`@tonejs/midi`).
- Quantizzazione, swing, editor velocity, accordi a un click, arpeggiatore (`Pattern`), "adatta alla scala".
- LFO assegnabile, glide/portamento, editing completo FM.
- Effetti: Chorus, Phaser, Flanger (via Chorus+feedback), Tremolo, Vibrato, BitCrusher, AutoPanner; EQ parametrico; ordine libero.
- Sidechain (finto a tempo, poi `Follower`), compressore per traccia.
- Bus/gruppi e send/return (`Channel.send/receive`), vista mixer completa, analizzatore `FFT`.
- Automazione con curve a punti (volume, pan, cutoff, wet).
- Export MP3 (lamejs / mp3-encoder WASM), salvataggio diretto su file (File System Access, solo Chromium), progetti `.zip` con audio.
- Altre metriche (3/4, 6/8), preset utente, tutorial guidato, glossario, modalità semplice/avanzata, count-in, tap tempo.

### Nice-to-have
- Sintesi wavetable (AudioWorklet), time-stretch di qualità, pitch shift clip.
- Clip launcher stile Ableton Session View.
- Export stems, multibanda, gate, auto-wah, stereo widener, convoluzione con impulsi reali.
- Automazione registrata dal vivo, cambi di tempo nel brano, marker di sezione, template di struttura.
- MIDI learn, scorciatoie personalizzabili, randomizzatore di suoni, generatore di idee, temi, humanize.
- App desktop (Tauri/Electron).

---

## Decisioni aperte per l'utente

1. **Browser supportati:** solo Chrome/Edge (Web MIDI e File System Access completi) o anche Firefox/Safari?
2. **Packaging:** web app su `localhost`/PWA oppure app desktop (Tauri/Electron)? (vedi `07` §7.7)
3. **Modello di arrangiamento:** timeline lineare con pattern collegati (consigliato), stile FL Studio puro, o clip launcher?
4. **Batteria MVP:** sintetizzata (zero file, consigliato; vedi `09`) o a campioni? Se campioni: quali, con quale licenza?
5. **MP3 nell'MVP** o solo WAV (consigliato: WAV in MVP)?
6. **Registrazione audio da microfono:** serve presto (alza molto la complessità) o va bene in v2?
7. **Formato progetto:** JSON semplice ora e `.zip` quando arriva l'audio? Estensione del file?
8. **Lingua UI e nomi note:** italiano/inglese; Do-Re-Mi o C-D-E?
9. **Livello di dettaglio dei synth:** solo preset + poche manopole "amiche" o tutti i parametri?
10. **Metrica:** basta il 4/4 per l'MVP?

## Cose non verificate (da controllare in prototipo)
- Versione npm più recente di Tone.js e default di `PolySynth.maxPolyphony`.
- Comportamento di `Tone.SyncedSignal` con loop/seek per l'automazione.
- Librerie terze citate ma non analizzate: `tonal`, `wavesurfer.js`, `audiobuffer-to-wav`, `JSZip`, `idb`, encoder MP3 (licenze/manutenzione).
- Supporto Web MIDI e File System Access in Firefox/Safari (controllare le tabelle MDN aggiornate).
- Qualità reale dei suoni di batteria sintetizzati (ascolto in prototipo) e licenze dei kit a campioni (vedi `09` §5).
