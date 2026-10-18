# 3. Arrangiamento

**Arrangiare** = decidere *cosa suona quando* lungo tutto il brano (intro, strofa, ritornello, finale).

---

## 3.1 Due modelli di DAW: quale scegliere

| Modello | App | Come funziona | Pro / contro |
|---|---|---|---|
| **Timeline lineare** | Logic, GarageBand, BandLab, Bitwig, Ableton (Arrangement View) | tracce orizzontali, il tempo scorre da sinistra a destra, le clip si posizionano sulla linea | intuitivo ("come un video editor"); standard |
| **Pattern + playlist** | FL Studio, LMMS (Song Editor) | si creano pattern e li si "dipinge" in una playlist | ottimo per beat/elettronica; un pattern modificato si aggiorna ovunque |
| **Clip launcher (Session View)** | Ableton, Bitwig | griglia di clip lanciabili dal vivo, senza una timeline | ottimo per improvvisare/live; difficile per principianti |

**Raccomandazione:** timeline lineare dove ogni clip è un **riferimento a un pattern** (stile FL Studio /
"linked clips"): modifichi il pattern e cambiano tutte le sue copie; con "Rendi unico" si sgancia una copia.
Il clip launcher è `nice`. → **Decisione aperta per l'utente.**

## 3.2 Tracce — `MVP`, difficoltà media

**Cos'è:** una "corsia" orizzontale, ognuna con il suo strumento e il suo canale nel mixer.
Tipi:
- **Traccia strumento / MIDI** (note + synth o drum machine) — `MVP`.
- **Traccia audio** (file audio o registrazione) — `v2` (vedi `06-recording-audio.md`).
- **Traccia di gruppo / bus** — `v2` (vedi `05-mixer-automation.md`).

Operazioni: aggiungi/elimina, rinomina, colore, riordina (drag), duplica (`v2`), altezza traccia.
Stato: array di tracce nello store Zustand; ogni traccia → un'istanza di strumento + un `Tone.Channel`.

## 3.3 Timeline e righello — `MVP`, difficoltà media

- Righello in **battute** (1, 2, 3…), griglia con snap (1 battuta / 1/4 / 1/16), **playhead** (cursore
  di riproduzione) che si muove durante il play, click sul righello = sposta il cursore.
- **Regione di loop**: si trascina sul righello un intervallo che si ripete all'infinito
  (`transport.loop = true; transport.loopStart / loopEnd`). Fondamentale per lavorare su 4 battute.
- Zoom orizzontale (Ctrl+rotella), scroll.
- Sincronizzazione grafica: aggiornare il playhead con `requestAnimationFrame` leggendo
  `transport.seconds`/`transport.progress`; per eventi grafici legati alle note usare `Tone.getDraw().schedule()`
  (esegue il callback nel momento giusto a livello visivo, non audio).

## 3.4 Clip — `MVP`, difficoltà media

**Cos'è:** un blocco rettangolare sulla timeline che contiene note (o audio). Operazioni:
- creare (doppio click), spostare (drag con snap), ridimensionare, eliminare;
- **loop della clip**: allungando il bordo il contenuto si ripete (Ableton/BandLab) — `v2`;
- dividere (*split*) in due nel punto del cursore — `v2`;
- aprire la clip nel piano roll / step sequencer con doppio click.

Riproduzione: al play il motore converte l'arrangiamento in eventi (`Tone.Part` per traccia, o un
unico scheduler `transport.scheduleRepeat(cb, "16n")` che legge lo stato). Per modifiche durante il play
la seconda strada è più robusta. Difficoltà: tenere sincronizzati stato ↔ eventi schedulati senza
"note appese" (usare `triggerRelease`/`releaseAll()` allo stop).

## 3.5 Copia, incolla, duplica — `MVP`, difficoltà bassa

- Ctrl+C / Ctrl+V / Ctrl+D (duplica subito dopo, come Ableton/FL) su note e clip.
- Clipboard interna (stato in memoria), non serve la clipboard di sistema.

## 3.6 Undo / Redo — `MVP`, difficoltà media

**Perché è MVP:** chi sta imparando sbaglia spesso; senza "annulla" l'app diventa frustrante.
- Approccio con Zustand: middleware **`zundo`** (aggiunge undo/redo basato su snapshot dello stato;
  da verificare compatibilità con la versione di Zustand scelta) oppure stack manuale di snapshot
  creati con **Immer** (`produceWithPatches` per salvare solo le differenze).
- Regole: lo storico include solo i **dati del progetto** (note, clip, tracce, parametri), non lo stato UI
  (zoom, selezione, posizione playhead). Raggruppare i drag in un'unica azione (salvare allo "mouseup").
- Scorciatoie: Ctrl+Z / Ctrl+Shift+Z (o Ctrl+Y).

## 3.7 Marker e sezioni — `nice`

Etichette sul righello ("Intro", "Ritornello") per orientarsi; poter duplicare un'intera sezione.

## 3.8 Struttura tipica di un brano (aiuto per principianti) — `nice`

Template di struttura: Intro (8 battute) → Strofa (16) → Ritornello (16) → Strofa → Ritornello → Outro.
Un "template di progetto" con tracce già pronte (batteria, basso, accordi, melodia) aiuta molto l'onboarding
(GarageBand e BandLab partono con template di genere).

---

## Fonti
- Ableton Live Manual, Arrangement View / Session View: https://www.ableton.com/en/manual/arrangement-view/
- FL Studio Manual, Playlist e Pattern: https://www.image-line.com/fl-studio-learning/fl-studio-online-manual/html/playlist.htm
- LMMS Song Editor: https://docs.lmms.io/user-manual/
- Tone.js Transport, Part, Draw: https://tonejs.github.io/docs/
- zundo (undo/redo per Zustand): https://github.com/charkour/zundo
