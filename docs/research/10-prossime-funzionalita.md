# 10 - Prossime funzionalità: come rendere l'app meno "spoglia" per chi non è musicista

Data ricerca: 2026-11-05. Questo report **non ripete** i dettagli di `01`-`09`: li richiama dove serve.
Già deciso e quindi escluso da qui: export MP3, swing, campioni di batteria reali, 3/4 e 6/8,
automazione, tastiera MIDI, microfono.

## 0. Il problema in una frase

Oggi l'app dà **strumenti** (piano roll, step sequencer, synth) ma chi non sa musica non sa **cosa
metterci dentro**: quali note suonano bene insieme, quale ritmo usare, come si struttura una canzone.
Le app per principianti risolvono così: ti danno **materiale già pronto e già "intonato"** da combinare
(loop, accordi, pattern) e ti **impediscono di sbagliare** (note bloccate sulla scala).

Come ragionano le app di confronto (fonti in fondo):
- **GarageBand**: Smart Instruments e Chord Strips ("suoni da professionista anche senza aver mai suonato
  una nota"), Live Loops (celle da toccare per far partire loop), Drummer (batteristi virtuali, ognuno con
  uno stile).
- **BandLab**: SongStarter (generatore di idee: genere, mood, tempo, tonalità; aggiungi/rigenera loop).
- **FL Studio**: strumenti accordi nel piano roll (Chord Stamp, Chord Progression Tool), evidenziazione
  scala, Riff Machine, arpeggiatore.
- **Incredibox**: trascini icone (loop già intonati e sincronizzati) sui personaggi; non si può sbagliare.
- **Groovepad / Looppad**: pad colorati che fanno partire loop sincronizzati e intonati, con effetti live.
- **Chrome Music Lab**: Song Maker (griglia di note), Arpeggios (tocchi una ruota e senti un accordo
  suonato nota per nota).
- **Ableton Learning Music**: lezioni interattive nel browser, dai ritmi agli accordi alla struttura.

Legenda: priorità consigliata `MVP+` (subito), `v2`, `nice`. Sforzo: **S** (piccolo, ore-1 giorno),
**M** (medio, qualche giorno), **L** (grande, una settimana o più). Stime indicative, non misurate.

---

## A. Aiuti alla composizione (il blocco più importante)

### A1. Blocca sulla scala ("lock to scale" / "adatta alla scala") - `MVP+`, sforzo S
- **Cos'è:** scegli una tonalità e una scala (es. "Do maggiore"): l'app **non ti lascia** mettere note
  fuori scala, oppure le sposta alla nota "buona" più vicina. Due modi: (1) "blocca" mentre disegni;
  (2) pulsante "Adatta alla scala" che corregge le note già scritte.
- **Perché aiuta:** una "nota sbagliata" è la ragione n.1 per cui un principiante pensa "suona male".
  L'app oggi evidenzia solo le note giuste: bloccarle è il passo successivo, senza teoria.
  Esempio: in Do maggiore sui tasti bianchi non si stona mai; il tasto nero Fa# invece suona "strano".
- **Chi ce l'ha:** FL Studio ha l'evidenziazione scala nel piano roll, ma **non** aggancia le note da
  solo (da manuale); le app mobili con "scale lock"/Smart Instruments sì (non verificato caso per caso).
- **Tecnica:** funzione pura in `src/music/` (`snapToScale(midi, root, scaleIntervals)`) usata da piano
  roll (disegno/spostamento), tastiera PC e generatori. Nessun nodo audio. Scelta di arrotondamento:
  verso l'alto, il basso o il più vicino.
- **Scelte aperte:** "blocco sempre attivo" (più semplice per chi inizia) o interruttore? Predefinito?

### A2. Accordi a un click - `MVP+`, sforzo M
- **Cos'è:** un **accordo** sono 3-4 note suonate insieme (es. Do-Mi-Sol = "Do maggiore", suona
  "allegro/stabile"; La-Do-Mi = "La minore", suona "malinconico"). Nel piano roll: scegli il tipo
  (maggiore, minore, settima...) e clicchi una nota: l'app disegna tutte le note dell'accordo.
  In modalità "scala" propone **solo gli accordi che stanno bene nella scala** (7 per scala).
- **Perché aiuta:** gli accordi sono il "pavimento" armonico di una canzone e per un principiante sono
  impossibili da costruire a mano senza conoscere gli intervalli.
- **Chi ce l'ha:** FL Studio (Chord Stamp, anche in modo automatico che sceglie un accordo adatto alla
  scala), GarageBand (Chord Strips), Chrome Music Lab (Arpeggios, versione didattica).
- **Tecnica:** tabella intervalli in `src/music/chords.ts` (maggiore [0,4,7], minore [0,3,7], ...);
  gli accordi si inseriscono come note normali (modificabili con gli strumenti esistenti). Con la libreria
  `tonal` sarebbe più veloce ma non è stata verificata (licenza/manutenzione); a mano sono ~40 righe.
- **Scelte aperte:** accordi come **note normali** (semplice, consigliato) o come "etichetta accordo"
  su una traccia accordi (più potente, più lavoro)? Nomi: "Do maggiore" o "C"? (vedi README, decisione 8).

### A3. Progressioni di accordi pronte - `MVP+`, sforzo M (dopo A2)
- **Cos'è:** una progressione è una sequenza di accordi che si ripete; le più famose suonano "da
  canzone pop". Si scrivono con numeri romani, indipendenti dalla tonalità: **I-V-vi-IV** (in Do:
  Do-Sol-La minore-Fa), **vi-IV-I-V**, **I-vi-IV-V** (anni '50), **ii-V-I** (jazz). Menu "Progressioni":
  scegli una, l'app la scrive in 4 battute nella tonalità del brano.
- **Perché aiuta:** è la scorciatoia più forte contro il foglio bianco: in un click hai una base armonica
  credibile su cui disegnare una melodia (usando A1).
- **Chi ce l'ha:** Logic Pro (traccia Accordi; progressioni predefinite con numeri romani che si adattano
  alla tonalità), Ableton Live/FL Studio (strumenti accordi), GarageBand (Chord Strips).
- **Tecnica:** dati puri (`[ [1,'maj'], [5,'maj'], [6,'min'], [4,'maj'] ]`) + generatore che produce note
  per un pattern; opzioni di "ritmo" (una nota lunga per battuta, ripetuta a 8 note, sincopata).
  Aggiungere "voice leading" semplice (inversioni che restano vicine) migliora molto il suono: sforzo +S.
- **Scelte aperte:** quante progressioni (consiglio 8-10) e se mostrarle con il nome dell'effetto
  emotivo ("allegra", "epica", "triste", "nostalgica") invece dei numeri romani.

### A4. Basso automatico dagli accordi - `v2`, sforzo M
- **Cos'è:** premi "Genera basso" su una traccia accordi: l'app scrive una linea di basso che segue le
  note fondamentali (più qualche variazione ritmica). Stessa idea per "accompagnamento" (arpeggio, ritmo).
- **Perché aiuta:** il basso è difficile da scrivere a orecchio, ma con la nota giusta sotto l'accordo
  tutto "si incolla".
- **Chi ce l'ha:** GarageBand (Smart Bass), Logic (Bass Player che segue la traccia Accordi, secondo la
  guida Apple; tonica del brano se non ci sono accordi).
- **Tecnica:** generatore puro: per ogni accordo, nota radice 1-2 ottave sotto + 3-4 schemi ritmici.
- **Scelte aperte:** da fare in una sola volta come A3 (sezione "Accordi + basso + ritmo") o separato.

### A5. Arpeggiatore - `v2`, sforzo M
- **Cos'è:** invece di suonare le note di un accordo insieme, le suona **una dopo l'altra** in ordine
  (su, giù, su-giù, casuale) a velocità regolabile (1/8, 1/16). È il suono "scintillante" tipico della
  musica elettronica e dei videogiochi anni '80.
- **Perché aiuta:** da un solo accordo tenuto si ottiene un riff che muove la canzone, zero abilità.
- **Chi ce l'ha:** FL Studio (arpeggiatore canale e di piano roll), Ableton Live (MIDI effect Arpeggiator),
  GarageBand (Arpeggiator sulle tastiere; non verificato nella ricerca), Chrome Music Lab (Arpeggios).
- **Tecnica:** due strade. (a) **Non distruttivo, in riproduzione**: interruttore sulla traccia, per
  ogni gruppo di note simultanee si generano note ritmiche a scheduling (`Tone.Pattern` con pattern
  `up`/`down`/`upDown`/`random`: è la classe più vicina a un arpeggiatore, documentata come "arpeggia tra
  le note date"). (b) **Distruttivo "Converti in note"**: genera note vere nel piano roll (più semplice da
  visualizzare ed esportare in WAV offline, perché il risultato sta nel progetto). Consiglio (a)
  con una funzione pura `arpeggiate(notes, pattern, rate)` in `src/music/`, usata anche per (b).
- **Scelte aperte:** non distruttivo (più pulito, un campo in più nel modello zod) o solo "converti"?

### A6. Pattern di batteria per genere - `MVP+`, sforzo S
- **Cos'è:** menu "Ritmo" sulla traccia batteria: Four-on-the-floor (house), Hip-hop, Trap, Rock, Funk,
  Reggaeton, Lo-fi, Drum'n'bass, Disco... Un click riempie la griglia a 16 step (con velocity). Con 2-4
  varianti per genere (base, con fill/rullata, intensa, leggera).
- **Perché aiuta:** il ritmo è la prima cosa che serve e quella dove i principianti si perdono (dove va
  la cassa? e il rullante?). Esempio: house = cassa su ogni battito, charleston aperto sul "levare".
- **Chi ce l'ha:** GarageBand (Drummer: batteristi per stile), BandLab (loop per genere), Groovepad.
- **Tecnica:** solo dati (array 5 voci x 16 step + velocity) in `src/project/drumPresets.ts`; funzione
  `applyDrumPreset(project, trackId, preset)` come operazione pura con undo. Nessuna novità audio.
  Lavoro vero = **scrivere buoni pattern** (da fonti storiche: pattern di batteria sono idee comuni non
  coperte da copyright, ma non copiare trascrizioni di brani specifici).
- **Estensione:** cursore "semplice - complesso" che aggiunge/toglie colpi (hi-hat extra, ghost note) e
  "piano - forte" che scala le velocity. Questa è l'idea del pad XY del Drummer di GarageBand (dettaglio
  dell'interfaccia **non verificato** in questa ricerca). Sforzo +S/M.
- **Scelte aperte:** quanti generi e quali (consiglio 8 che coprano i 3 template + 5 nuovi).

### A7. Libreria di pattern pronti (melodia, basso, accordi) - `v2`, sforzo M
- **Cos'è:** una finestra "Idee pronte" con pattern di 1-4 battute catalogati (per genere, mood,
  strumento), con anteprima ascolto e "Aggiungi alla traccia". Si trasportano **automaticamente nella
  tonalità del brano** (A1 lo permette gratis).
- **Perché aiuta:** è il modello Incredibox/Groovepad/BandLab: tu non scrivi, **combini**. La musica
  suona bene perché i pezzi sono già composti bene.
- **Chi ce l'ha:** BandLab (loop; SongStarter), GarageBand (Apple Loops, Live Loops), Groovepad,
  Incredibox, FL Studio (pacchetti e Riff Machine).
- **Tecnica:** JSON statico in `src/project/library/` validato con lo stesso zod del progetto, caricato a
  richiesta (code splitting). Tutto nel motore note esistente: **niente audio registrato**, quindi nessun
  problema di licenze (a differenza dei campioni, vedi `09`). Lo sforzo è creare i contenuti: 30-60
  pattern basta per sembrare ricchi.
- **Scelte aperte:** chi scrive i pattern? (io/Claude può generarli, ma serve il tuo orecchio per scartare
  quelli brutti: l'audio non si può ascoltare in automatico, vedi CLAUDE.md.)

### A8. Sezioni del brano (intro / strofa / ritornello / ponte) - `v2`, sforzo M
- **Cos'è:** sulla timeline, fasce colorate con nome ("Intro", "Strofa", "Ritornello", "Finale") e
  pulsanti "Duplica sezione", "Sposta sezione", "Ripeti x2". In più un template di struttura pronto
  (es. Intro 4 - Strofa 8 - Ritornello 8 - Strofa 8 - Ritornello 8 - Finale 4 battute).
- **Perché aiuta:** il difetto tipico dei brani dei principianti è un loop di 4 battute che non evolve.
  Sapere che una canzone è "Strofa - Ritornello - Strofa..." e vederlo disegnato guida l'arrangiamento.
  Regola pratica da suggerire in UI: il ritornello ha più strumenti/energia della strofa.
- **Chi ce l'ha:** Logic/Ableton (marker, Arrangement Markers/locators), GarageBand (sezioni A/B/C
  nell'arrangiamento, secondo documentazione Apple non verificata qui), Ableton Learning Music (capitolo
  sulla struttura).
- **Tecnica:** nuovo campo `sections: {name, startBar, lengthBars, color}[]` nel modello; operazioni pure
  in `src/project/ops/` per duplicare/spostare i blocchi in quell'intervallo (l'undo c'è già).
  Il rendering è una striscia sopra il righello. Esiste già la nota "marker di sezione" in README (nice).
- **Scelte aperte:** solo etichette visive (S) o con operazioni di gruppo (M, consigliato)?

### A9. Dado: generatore di idee casuali - `v2`, sforzo S/M
- **Cos'è:** pulsanti "Sorprendimi": (1) melodia casuale **dentro la scala** per una traccia; (2) ritmo
  casuale per la batteria (con regole: cassa sul primo battito, hi-hat regolare, rullante su 2 e 4);
  (3) "Nuovo brano a caso": genere + tonalità + BPM + accordi + ritmo; (4) "Crea variazione" di un
  pattern esistente (cambia 2-3 note, sposta un colpo).
- **Perché aiuta:** toglie la paura del foglio bianco; il "non mi piace" costa un click e riprovi.
  È più facile **scegliere** che **creare**.
- **Chi ce l'ha:** BandLab SongStarter (genere/mood/tempo/tonalità + rigenera loop), FL Studio Riff
  Machine (generatore di pattern limitato a una scala; secondo manuale e guide), Chrome Music Lab
  (nulla di casuale, ma simile logica "prova e senti").
- **Tecnica:** RNG con **seed** salvato nel progetto (così l'export offline e il "ricarica" danno lo
  stesso risultato); generatore di melodia = camminata casuale sui gradi della scala con salti piccoli
  (più musicale di note del tutto casuali) e ritmi scelti da una lista. Funzioni pure, testabili.
- **Scelte aperte:** quanto "intelligente" (random puro vs. regole semplici, consiglio regole semplici).

### A10. Humanize - `v2`, sforzo S
- **Cos'è:** sposta leggermente (pochi millisecondi) e varia un po' la velocity di ogni nota: una
  batteria che suona "umana" invece che "da metronomo". Manopola "Umanizza" 0-100% su traccia/pattern.
- **Perché aiuta:** una sequenza perfetta suona meccanica e freddissima; con un solo comando si ottiene
  calore. Si abbina allo swing già deciso.
- **Chi ce l'ha:** Logic (Humanize), Ableton Live (Groove Pool), FL Studio (Randomize/Humanize nel piano
  roll), GarageBand (non verificato).
- **Tecnica:** a tempo di scheduling, offset casuale ±X ms e ±Y velocity, deterministico (seed + indice
  step) così l'export WAV è uguale alla riproduzione. In Tone.js non c'è una classe "humanize" dedicata
  per le note (non confermato): si fa nello scheduler del sequencer.

### A11. Altri template e punti di partenza - `MVP+`, sforzo S ciascuno
- **Cos'è:** oggi 3 modelli (beat elettronico, lo-fi, vuoto). Aggiungerne 8-10 per genere: house, hip-hop,
  trap, pop, synthwave, ambient, funk, drum'n'bass, reggaeton, "colonna sonora epica", "videogioco 8-bit".
  Ognuno con strumenti, accordi, ritmo e struttura A8 già impostati e **sicuramente intonati**.
- **Perché aiuta:** è il modo più rapido per far suonare l'app "ricca" alla prima apertura: ogni
  template è anche un tutorial ("cambia il tempo, sostituisci le note").
- **Chi ce l'ha:** BandLab, GarageBand (modelli), FL Studio (template), Groovepad (pacchetti di genere).
- **Tecnica:** nuovi JSON in `src/project/templates/`; riuso A2/A3/A6/A7. Verifica con `npm run
  audio:check` per evitare clipping.
- **Scelte aperte:** quali generi ti piacciono davvero? (decisivo: i contenuti dipendono dal tuo gusto).

### A12. Crea brano guidato ("Nuovo brano in 4 domande") - `v2`, sforzo M
- **Cos'è:** procedura iniziale: "Che genere?", "Che atmosfera? (allegra/triste/epica/rilassata)",
  "Veloce o lento?" -> l'app crea un progetto già pieno (A2+A3+A6+A8) e ti dice cosa puoi cambiare.
- **Perché aiuta:** è l'onboarding migliore: risultato sonoro in 20 secondi.
- **Chi ce l'ha:** BandLab SongStarter (idea per genere/mood/tempo/tonalità), Groovepad (scegli genere).
- **Tecnica:** una schermata React + funzione `buildProject(answers)` che compone i generatori sopra.

---

## B. Suoni più interessanti (il synth oggi è "un'onda + filtro + ADSR")

Dettagli teorici in `01` (§1.6-1.7) e `04` (§4.7, §4.10); qui solo cosa aggiungere e in che ordine.

### B1. Spessore: unison/detune ("Fat") - `v2`, sforzo S
- **Cos'è:** invece di una sola onda, tre-cinque leggermente "scordate" tra loro: il suono diventa largo e
  "grosso" (tipico dei synth trance/EDM). Manopola unica "Spessore".
- **Tecnica:** Tone.js supporta nei `Synth` tipi come `fatsawtooth` / `fatsquare` con parametri `count`
  e `spread` (cent). Da verificare sulla versione installata. Costo CPU: x count voci.
- **Chi ce l'ha:** praticamente tutti i synth (Serum, Ableton Wavetable, FL Sytrus/Harmor).

### B2. Chorus (e phaser, tremolo) come effetto - `v2`, sforzo S
- **Cos'è:** il chorus copia il suono e lo fa "ondeggiare" leggermente, come tanti strumenti insieme: rende
  pad e tastiere ampi e luccicanti. Phaser = "swoosh" ruotante; tremolo = volume che pulsa.
- **Tecnica:** `Tone.Chorus` (due delay modulati da un LFO; ricordarsi di chiamare `.start()`), con
  feedback > 0 diventa un flanger secondo la documentazione. Un file per effetto in `src/audio/effects/`,
  come gli esistenti. Parametri amici: "Quantità" (wet), "Velocità", "Profondità".
- **Scelte aperte:** quali effetti aggiungere subito oltre il chorus (consiglio: compressore, tremolo/phaser).

### B3. LFO assegnabile (la "mano invisibile") - `v2`, sforzo M
- **Cos'è:** un'onda lenta che muove un parametro: sul filtro fa il "wobble/wah" (dubstep), sul volume il
  tremolo, sull'altezza il vibrato (come un cantante). Interfaccia semplificata: menu "Muovi: Luminosità /
  Volume / Altezza", manopole "Velocità" e "Quantità", sincronizzazione al tempo opzionale (1/4, 1/8).
- **Tecnica:** `Tone.LFO` collegato a un parametro/segnale (`lfo.connect(filter.frequency)`); per synth
  polifonico l'LFO può essere **condiviso** (globale, più economico, nasce una sola volta) o per voce
  (più lavoro). Con il sync al BPM usare frequenza in notazione (es. "4n"). Offline: funziona perché
  fa parte del grafo (`createGraph(project)`).
- **Chi ce l'ha:** tutti i synth DAW; i principianti lo trovano come "wobble" in Ableton/FL Studio.

### B4. Inviluppo del filtro ("pluck" e "sweep") - `v2`, sforzo M
- **Cos'è:** il filtro (cutoff) si apre e si chiude da solo all'inizio di ogni nota: suoni "pluck" (pizzico)
  e bassi che fanno "uauau". È la differenza tra un synth "piatto" e uno "vivo".
- **Tecnica:** `Tone.MonoSynth` ha già `filterEnvelope`; per polifonia: `PolySynth` di `MonoSynth` (ogni
  voce con filtro proprio, costo CPU maggiore) oppure `Tone.FrequencyEnvelope`. Ricontrollare in
  `synthInstrument.ts` come è fatto il filtro oggi (modifiche in corso nel working tree).
  Parametri amici: "Apertura" (quanto si apre) e "Velocità" (quanto dura).
- **Scelte aperte:** accorpare B1+B3+B4 in un pannello "Carattere" con 3-4 manopole facili, nascondendo
  i parametri tecnici (README, decisione 9).

### B5. Sidechain "pompa" finto sulla cassa - `v2`, sforzo M
- **Cos'è:** ogni volta che suona la cassa, gli altri suoni (basso, pad) **abbassano il volume per un
  attimo e risalgono**: la musica "respira/pulsa" a tempo (effetto tipico house/EDM). Interruttore
  "Pompa" sulla traccia + manopole "Quantità" e "Durata".
- **Perché aiuta:** rende il mix più professionale e ritmico senza capire la compressione.
- **Tecnica:** la versione "finta" è la più semplice: un `Tone.Gain` sul canale con automazione di
  volume che scende e risale a ogni battito (o a ogni colpo di cassa del pattern, letto dal progetto),
  pianificata dal sequencer; deterministica nell'export offline. Il sidechain vero (`Tone.Follower` che
  legge il segnale della cassa) è più fedele ma più complicato. Vedi `04` §4.10.
- **Chi ce l'ha:** Ableton/FL/Logic (compressore con sidechain); alcune app mobili con "pump".

### B6. Pannello suono: manopole "macro" e dado - `v2`, sforzo S
- **Cos'è:** due manopole generali al posto di 8 tecniche: "Luminosità" (cutoff+resonance) e "Morbidezza"
  (attacco/rilascio); più pulsante dado "Suono a caso" nell'intorno del preset corrente.
- **Tecnica:** mappatura pura macro -> parametri in `src/project/`; il dado = piccole variazioni
  casuali con limiti sicuri (cutoff mai troppo basso, volume pari) per non produrre suoni inascoltabili.

### B7. Glide / portamento e voci "lead" - `nice`, sforzo S
- Passaggio scivolato tra due note (suona "cantato", tipico di lead e bassi acid). Su `Tone.MonoSynth`
  la proprietà `portamento`. Utile solo con una traccia monofonica (modalità basso/lead).

### B8. Preset di effetti e "master amico" - `v2`, sforzo S
- Preset di catena ("Spazioso", "Radio vecchia", "Caldo", "Sott'acqua") per tracce; sul master un
  selettore "Più forte / più caldo / più morbido". Dettagli in `04` §4.11. Chi: GarageBand (preset),
  BandLab (Mastering con un click: sezione di aiuto di BandLab, dettagli a pagamento non verificati).

---

## C. Qualità della vita (UX)

| Idea | Cos'è | Priorità | Sforzo | Nota tecnica |
|---|---|---|---|---|
| Colora le note per ruolo | Nel piano roll: nota dell'accordo corrente = colore forte, nota di scala = medio, fuori = grigio | `v2` | S/M | Dipende da A2/A1; solo disegno |
| Nomi note Do-Re-Mi | Interruttore tra C-D-E e Do-Re-Mi | `MVP+` | S | Solo etichette (README decisione 8) |
| Trasponi | Sposta pattern/traccia/brano di N semitoni o "cambia tonalità" | `v2` | S | Operazione pura sulle note; clamp tra min/max |
| Tap tempo, count-in | Batti il tempo col mouse; 1 battuta di conto alla rovescia | `v2` | S | Media dei tempi tra i click; conteggio con metronomo |
| Loop di una regione | Ripeti solo le battute 5-8 durante il lavoro | `MVP+` | S | `Tone.Transport.loopStart/loopEnd`; in README già previsto per MVP |
| Ascolto preset | Frecce su/giù o hover che suonano un accordo per sentire il preset; preferiti; cerca | `v2` | S | Riuso `triggerAttackRelease` di anteprima |
| Suggerimenti contestuali | Piccoli fumetti "perché": "questa nota è fuori scala", "il ritornello di solito è più pieno" | `v2` | M | Regole semplici sullo stato; ispirato a Ableton Learning Music |
| Mini-lezioni interattive | 5-6 schede "ritmo, scala, accordi, melodia, struttura" con esercizi nell'app | `nice` | L | Ableton Learning Music è fatto così (10 capitoli); contenuto soprattutto testo+esempi |
| Pad / modalità performance | Una griglia di pad che fa partire pattern a tempo (stile Groovepad, Live Loops) | `nice` | L | Clip launcher: quantizza i lanci a battuta; nuovo modello di playback (README: nice) |
| Fill e transizioni | Pulsante "Rullata" per ultima battuta; "Riser" e "Impatto" tra sezioni (rumore con filtro crescente) | `v2` | M | `NoiseSynth` + automazione filtro; si appoggia ad A8 |
| Mixer semplice | Livelli consigliati ("Mix automatico": bilancia volumi per ruolo) | `nice` | M | Regole fisse (basso/cassa più forti, pad più bassi); non è una vera analisi |
| Condividi come link | Salva progetto in un URL compresso (come Song Maker di Chrome Music Lab) | `nice` | M | Lunghezza URL limitata: progetti piccoli; serve compressione. Non verificato |

---

## D. Cosa NON conviene fare ora (e perché)

- **Sintesi wavetable/FM completa, analizzatore spettro avanzato:** costo alto, i principianti non li
  notano (vedi `01`).
- **Clip launcher completo:** è il modello giusto per l'improvvisazione, ma cambia il modo in cui
  l'app riproduce e fa raddoppiare il lavoro con timeline lineare (README, decisione 3).
- **"AI" che genera brani:** BandLab ha strumenti di questo tipo, ma richiedono un servizio esterno;
  l'app è locale e senza backend. I generatori con regole (A9) danno un risultato simile per questo scopo.

---

## E. Classifica consigliata: top 8

Criterio: **massimo effetto sul "suona bene" per un non-musicista, a minor sforzo**, rispettando le
dipendenze (alcune funzioni ne sbloccano altre).

| # | Funzione | Sforzo | Perché in questa posizione |
|---|---|---|---|
| 1 | **A1 Blocca sulla scala** | S | È la base di tutto: elimina le note "sbagliate", costa poco e serve a A2, A3, A5, A9 e alla tastiera PC. |
| 2 | **A6 Pattern di batteria per genere** (+ cursore semplice/complesso) | S | Risultato immediato e udibile in un click; il ritmo è dove si blocca chi inizia; solo dati, nessun rischio audio. |
| 3 | **A2 + A3 Accordi a un click e progressioni** (+ A4 basso dopo) | M | Colma il vuoto teorico più grande. Con 1+3 si fa una canzone che regge in minuti. |
| 4 | **A11 Altri template** (8-10 generi) + **A12 creazione guidata** | S + M | Fa sembrare l'app "ricca" alla prima apertura; riusa 1-3. Va dopo perché consuma i contenuti creati prima. |
| 5 | **A9 Dado generatore di idee + A10 Humanize** | S/M | Tolgono la paura del foglio bianco e la sensazione "robotica"; piccoli ma molto efficaci. |
| 6 | **A5 Arpeggiatore** | M | Fa muovere un accordo in un riff in un click; suono "da producer", ma meno essenziale delle prime 5. |
| 7 | **Pacchetto "suono ricco": B1 Spessore + B2 Chorus + B3 LFO + B4 inviluppo filtro** (+B6 macro) | S+S+M+M | Rende ogni preset più interessante, ma non aiuta a scrivere musica: dopo gli aiuti compositivi. Ordine interno: chorus e spessore (S) prima. |
| 8 | **A8 Sezioni del brano** + **B5 pompa (sidechain finto)** | M + M | Passano da "loop" a "canzone" e rifiniscono il mix; richiedono che prima ci siano materiali da disporre. |

Subito fuori dalla top 8: libreria di pattern A7 (grande valore ma è soprattutto lavoro sui contenuti;
cresce con il resto), trasponi, tap tempo/count-in, mini-lezioni, modalità pad.

### Decisioni che servono dall'utente
1. Quali **generi** ti interessano (decide ritmi, template, preset)? Consiglio di sceglierne 6-8.
2. **Accordi:** note normali nel piano roll (semplice) o traccia accordi dedicata (più potente)?
3. **Arpeggiatore e humanize:** non distruttivi (si sentono in riproduzione) o "converti in note"?
4. **Lock alla scala:** sempre attivo per i principianti o interruttore?
5. **Nomi** di note/accordi: Do-Re-Mi o C-D-E; progressioni mostrate come numeri romani o come mood?
6. Chi crea i contenuti (pattern, progressioni, template) e chi li approva a orecchio.
7. Quanto deve restare semplice il synth: pannello "Carattere" con macro, o parametri completi?

### Non verificato in questa ricerca
- Interfaccia esatta del Drummer di GarageBand (XY pad) e dell'Arpeggiator di GarageBand.
- Funzioni specifiche del BandLab Mastering (solo sommario, con pagine di aiuto non leggibili).
- Disponibilità della libreria `tonal` e licenza/manutenzione (già nota come non analizzata nel README).
- Quali tipi `fat*` e quali proprietà (`portamento`, `filterEnvelope`) sono disponibili nella versione di
  Tone.js installata: controllare in prototipo.
- Contenuto dell'interfaccia di Ableton Learning Music (descritto solo da articoli di terze parti).

## Fonti
- GarageBand (Chord Strips, Smart Instruments, Live Loops, Drummer): https://apps.apple.com/app/id408709785
  e guida iPhone https://help.apple.com/pdf/garagebandiphone/en_US/garageband-iphone-user-guide.pdf
- Live Loops (introduzione in GarageBand 2.1): https://www.mactrast.com/2016/01/apple-launches-garageband-2-1-for-ios-ipad-pro-and-iphone-6s6s-plus-support/amp/
- Logic Pro, Session Players e traccia Accordi: https://support.apple.com/guide/logicpro-ipad/lpip87ac9913/ipados
  e https://www.soundonsound.com/techniques/logic-pro-session-players
- BandLab SongStarter: https://create.routenote.com/blog/what-is-bandlab-songstarter/ e
  https://musictech.com/news/songstarter-ai-powered-tool-will-kickstart-songwriting-process-you/ ;
  Mastering: https://help.bandlab.com/hc/en-us/sections/115000681153-Mastering
- FL Studio, piano roll, strumenti accordi, scala, Riff Machine:
  https://www.image-line.com/fl-studio-learning/fl-studio-online-manual/html/pianoroll.htm ;
  arpeggio: https://www.image-line.com/fl-studio-learning/fl-studio-online-manual/html/pianoroll_arpeggiate.htm
- Ableton Learning Music (descrizione): https://xlr8r.com/?p=27767 e https://liveforlivemusic.com/news/ableton-learning-music
- Incredibox: https://en.wikipedia.org/wiki/Incredibox
- Chrome Music Lab (Song Maker, Arpeggios, Kandinsky): https://maketecheasier.com/chrome-music-lab/
- Groovepad (scheda App Store): https://apps.apple.com/app/id1454398991
- Tone.js Pattern (arpeggio): https://tonejs.github.io/docs/14.7.30/Pattern ; Chorus: https://tonejs.github.io/docs/14.7.77/Chorus
- Ricerche precedenti: `01-sound-generation.md`, `02-notes-composition.md`, `04-effects.md`, `08-ux.md`, `README.md`.
