# 2. Note e composizione

Come l'utente **scrive la musica**: dove mette le note, come si gestisce il tempo, come lo si aiuta se
non conosce la teoria musicale.

---

## 2.1 Tempo, BPM e metrica — `MVP`, difficoltà bassa

- **BPM** (battiti per minuto): la velocità del brano. 70 = lento (ballad), 120 = pop/house, 170 = drum&bass.
- **Metrica (time signature):** quanti battiti per **battuta** (*bar/measure*). `4/4` = 4 battiti per battuta
  (quasi tutta la musica pop/elettronica); `3/4` = valzer; `6/8` = andamento "dondolante".
- **Suddivisioni:** una battuta 4/4 contiene 4 semiminime (quarti), 8 crome (ottavi), 16 semicrome (sedicesimi).
  La griglia standard della musica elettronica è il **sedicesimo**.

**Tone.js:** il "Transport" è l'orologio musicale globale: `Tone.getTransport()` (in v15 `Tone.Transport` è
ancora accessibile ma la forma consigliata è il getter). Proprietà: `bpm.value`, `timeSignature`, `loop`,
`loopStart`, `loopEnd`, `swing`, `swingSubdivision`, `position`; metodi `start()`, `stop()`, `pause()`.
Notazione del tempo di Tone.js molto comoda: `"4n"` (un quarto), `"8n"`, `"16n"`, `"1m"` (una battuta),
`"2:1:0"` (battuta:quarto:sedicesimo).

Suggerimento: MVP solo 4/4 (più semplice per griglie e UI), metriche diverse in v2.

## 2.2 Step sequencer — `MVP`, difficoltà bassa

**Cos'è:** una griglia di caselle (di solito 16 = una battuta in sedicesimi); ogni riga è un suono
(kick, snare, hat...), ogni casella accesa = "suona qui". È il modo più immediato per fare un ritmo
anche senza saper suonare. Riferimenti: FL Studio Channel Rack, Roland TR-808, BandLab "Beat Maker".

- **Tone.js:** `Tone.Sequence(callback, eventi, "16n")` oppure `Tone.Loop` / `Transport.scheduleRepeat`
  che a ogni sedicesimo legge lo stato. Approccio consigliato: lo store Zustand contiene la griglia
  (`boolean[righe][16]`), il motore legge lo stato nel callback (così le modifiche si sentono subito).
- Extra `v2`: velocity per step, probabilità, lunghezza pattern variabile (8/16/32/64 step), "accent".

## 2.3 Piano roll — `MVP`, difficoltà media/alta (è la UI più complessa dell'MVP)

**Cos'è:** l'editor principale delle melodie. Asse verticale = altezza della nota (con una tastiera di
pianoforte disegnata a sinistra), asse orizzontale = tempo. Ogni nota è un rettangolo: posizione =
quando suona, lunghezza = quanto dura. Presente in tutte le DAW (Ableton "MIDI Note Editor",
FL Studio "Piano roll", Logic, GarageBand, BandLab).

Funzioni minime (MVP):
- disegnare (click), spostare (drag), allungare (drag sul bordo destro), cancellare (click destro / Canc);
- **snap alla griglia** (le note si "agganciano" ai sedicesimi);
- ascoltare la nota quando la si crea/clicca;
- zoom orizzontale e scroll verticale; selezione multipla con rettangolo; copia/incolla.

Implementazione: Canvas 2D o SVG in React (Canvas consigliato se le note sono tante). Le note sono dati
`{ pitch: numeroMIDI, start: tick, duration: tick, velocity: 0–1 }`, riprodotte con `Tone.Part`.

## 2.4 Pattern e clip — `MVP`, difficoltà media

**Cos'è:** un **pattern** è un "pezzetto" riutilizzabile (es. 1–4 battute di batteria o di basso). Si crea
una volta e lo si ripete/posiziona nella timeline (vedi `03-arrangement.md`). FL Studio è costruito
interamente attorno ai pattern; Ableton li chiama "clip".
- **Tone.js:** `Tone.Part` (lista di eventi con tempo) con `loop = true` e `loopEnd = "1m"`, oppure un
  unico scheduler che legge l'arrangiamento dallo stato (più facile da sincronizzare con undo/redo).

## 2.5 Scale e accordi: aiuti per chi non conosce la teoria — `MVP` (scala) / `v2` (accordi)

**Scala:** un sottoinsieme di 7 note (su 12) che "stanno bene insieme". Se si usano solo quelle, è
difficile suonare "stonato". Le più utili: **Maggiore** (allegra), **Minore naturale** (malinconica),
**Pentatonica** (5 note, impossibile sbagliare: è quella dei tasti neri del piano), Blues, Dorica.
La **tonalità** (*key*) è la nota di partenza (Do, Re…).

Aiuti da prevedere:
- **Evidenziare nel piano roll le righe della scala** scelta (`MVP`) e opzione "nascondi le note fuori
  scala" (`v2`). Ableton Live 12 ha introdotto proprio questo ("Scale Mode"/"scale awareness").
- **"Adatta alla scala"** (*fit/fold to scale*): sposta le note esistenti nella scala più vicina (`v2`).
- **Accordi a un click** (`v2`): **accordo** = 3+ note insieme. Inserire triadi (maggiore/minore) già
  pronte e **progressioni** comuni (es. I–V–vi–IV, la progressione di centinaia di canzoni pop).
  FL Studio ha uno "stamp" di accordi nel piano roll; Logic ha i "Chord Trigger".
- **Arpeggiatore** (`v2`): suona le note di un accordo una dopo l'altra automaticamente. Si implementa
  con `Tone.Pattern(callback, note, "upDown")`.
- **Tastiera virtuale in scala** (`v2`): i tasti del PC suonano solo note della scala.

Implementazione: tabelle di intervalli (es. maggiore = `[0,2,4,5,7,9,11]`) in un modulo puro TS
(`src/music/scales.ts`). Libreria opzionale: `tonal` (teoria musicale in JS) — non verificata in questa ricerca.

## 2.6 Quantizzazione — `v2`, difficoltà bassa

**Cos'è:** "raddrizza" le note suonate a mano spostandole sulla griglia più vicina (es. al sedicesimo).
Utile quando si registra dalla tastiera e non si è precisi. Varianti: quantizzazione al 50% (sposta
solo a metà strada = più naturale), quantizzazione dell'inizio e/o della fine.
- Si fa sui dati (matematica sui tick), non serve audio. Tone.js ha `Tone.Time(t).quantize("16n", percent)`.
- Se le note si disegnano solo nel piano roll con snap attivo, la quantizzazione serve solo dopo
  l'introduzione della registrazione live → per questo è `v2`.

## 2.7 Swing / groove — `v2`, difficoltà bassa

**Cos'è:** ritarda leggermente le note "in levare" (i sedicesimi pari) per un feeling meno robotico, più
"umano" (hip-hop, funk, house). **Tone.js:** `transport.swing` (0–1) e `transport.swingSubdivision`.
"Humanize" (piccole variazioni casuali di tempo/velocity): `nice`.

## 2.8 Velocity — `MVP` (valore per nota) / `v2` (editor grafico)

**Cos'è:** la "forza" con cui è suonata la nota (0–127 in MIDI, 0–1 in Tone.js). Più forte = più
volume, spesso anche più brillante. Varia la velocity del charleston e il ritmo diventa molto più vivo.
- **Tone.js:** terzo/quarto argomento di `triggerAttackRelease(nota, durata, tempo, velocity)`.
- UI v2: pannello sotto il piano roll con "barrette" (come tutte le DAW).

## 2.9 MIDI — input da tastiera, import/export — `v2`, difficoltà media

**Cos'è:** MIDI non è audio: è un **protocollo di messaggi** ("nota 60 premuta con forza 100", "nota 60
rilasciata"). Serve per (a) collegare una tastiera musicale USB, (b) scambiare le note con altre app.
- **Input da tastiera MIDI:** Web MIDI API (`navigator.requestMIDIAccess()`). Richiede contesto sicuro
  (HTTPS o `localhost`) e permesso dell'utente. Supporto browser **limitato** (MDN la segna "Limited
  availability"): sicuro in Chrome/Edge; Firefox/Safari da verificare sulla tabella MDN.
- **Import/export file `.mid`:** libreria `@tonejs/midi` (legge e scrive; `new Midi(arrayBuffer)`,
  `midi.tracks[i].notes`, `addTrack()`, `addNote()`, `toArray()`). Converte bene nel nostro formato note.
- Conversioni nome/numero nota: `Tone.Frequency("C4").toMidi()`, `Tone.Frequency(60, "midi").toNote()`.

## 2.10 Note numeriche e nomi — riferimento

- Numero MIDI 60 = **C4** = Do centrale. +12 = un'ottava sopra. Nomi inglesi: C D E F G A B = Do Re Mi Fa Sol La Si.
- Decisione UI: mostrare nomi italiani (Do, Re…) o inglesi (C, D…)? Le DAW usano quasi sempre quelli inglesi.

---

## Fonti
- Tone.js Transport / Part / Sequence / Pattern: https://tonejs.github.io/docs/
- @tonejs/midi: https://github.com/Tonejs/Midi
- MDN Web MIDI API: https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API
- Ableton, Keys and Scales in Live 12 FAQ: https://help.ableton.com/hc/articles/11425083250972
- Ableton "Learning Music" (corso interattivo gratuito su ritmo, melodie, accordi): https://learningmusic.ableton.com/
