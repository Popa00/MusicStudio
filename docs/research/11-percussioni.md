# 11 - Più percussioni: quali servono ai generi, come sintetizzarle

Domanda: oltre ai 5 suoni attuali (kick, snare, clap, hihatClosed, hihatOpen), quali percussioni servono per pop,
hip-hop, lo-fi, house, techno, reggaeton, rock e trap? Come si sintetizzano in Tone.js? Come cambiano UI e formato progetto?
Priorità: **MVP** = indispensabile, **v2** = importante, **nice** = nice-to-have.

## Affidabilità di questo report (leggere prima)

- Le **frequenze e i tempi** nelle ricette sono **punti di partenza tipici, NON testati all'ascolto** (come in `09`).
  Verificati da fonti: solo la cowbell 808 (540 + 800 Hz) e il fatto che i piatti 808 usano 6 onde quadre inarmoniche.
- La tabella "quale genere usa cosa" è una **mia valutazione** da convenzioni diffuse, supportata solo in parte dalle
  fonti trovate (reggaeton, trap, house, lo-fi sì; rock poco). Le fonti sono blog/guide di produzione, non riferimenti accademici.
- Stato attuale letto dal codice: `src/audio/drums/kit.ts` crea 5 voci (kick = `MembraneSynth` da C1; hi-hat = `NoiseSynth`
  bianco + highpass 7 kHz, **senza** `MetalSynth` perché pesa sul processore). Il kit è un bus mono a -3 dB.

## 0. Concetti in due parole

- **Percussione**: strumento ritmico a colpo (non suona melodie): tamburi, piatti, shaker, campanacci.
- **Pitch sweep (scivolata di tono)**: l'altezza parte alta e scende in pochi millisecondi. Dà il "boom" a casse e tom.
- **Inviluppo (envelope)**: come il volume nasce e muore. `decay` = quanto dura il suono dopo il colpo.
- **Rumore (noise)**: "fruscio" (tipo radio non sintonizzata); filtrato diventa scia di piatti, shaker, battimani.
- **Inarmonico**: suono con tante frequenze "sbagliate" insieme: è ciò che fa suonare "metallico" un piatto.
- **Choke**: un suono ne spegne un altro (l'hi-hat chiuso zittisce quello aperto).

## 1. Chi usa cosa (8 generi)

Legenda: **●** tipico, **○** occasionale. Valutazione mia; fonti nelle sezioni 6 e 7.

| Voce | pop | hip-hop | lo-fi | house | techno | reggaeton | rock | trap |
|---|---|---|---|---|---|---|---|---|
| kick808 (cassa lunga/sub) | ○ | ● | ○ | | | ○ (corta) | | ● |
| rimshot (colpo sul bordo) | ● | ○ | ● | ○ | ● | ● | ○ | ○ |
| shaker | ● | ○ | ● | ● | ● | ● (güira) | ○ | ○ |
| tomLow / tomMid / tomHigh | ○ (stacchi) | | | ○ | ○ | ○ | ● | |
| crash (piatto di inizio) | ● | | | ○ | ○ | | ● | |
| ride (piatto continuo) | ○ | | ○ (jazz) | ○ | ○ | | ● | |
| tambourine (tamburello) | ● | | ● | ● | | | ○ | |
| cowbell (campanaccio) | | ○ | | ○ | ○ | ● | ○ | ○ |
| conga / bongo | | | ○ | ● | ○ | ● | | |
| snap (schiocco di dita) | ● | ○ | ● | | | | | ○ |
| clave | | | | ○ | | ○ | | |
| perc (colpetto intonato generico) | ○ | | | ● | ● | ○ | | ○ |

Note per genere (da fonti): il reggaeton vive sul **dembow** (cassa + rullante/clap sincopati) e su shaker/güira,
con conga/bongo e rulli di tom/timbales per le transizioni; la trap su **hi-hat veloci con rulli** e 808 lunghi che scivolano
(in reggaeton gli 808 sono più corti); la house su cassa in quarti, hi-hat aperto sul controtempo e **molta percussione
ausiliaria**; il lo-fi su tamburello, hi-hat in ottavi e rullante caldo; il rock su cassa 1-3, rullante 2-4, hi-hat in ottavi
(più toms e piatti: mia conoscenza, nessuna fonte forte trovata).

## 2. Ricette di sintesi (Tone.js)

Tutte le voci implementano `DrumVoice { trigger(time, velocity), dispose() }` e si collegano al `bus` del kit.
**Difficoltà** e **qualità** (mia stima): B = bassa, M = media, A = alta.

### 2.1 kick808 - cassa lunga / sub-basso (trap, hip-hop) - difficoltà B, qualità buona
- **Suono/ruolo**: un "BOOOM" grave che dura quasi un secondo; fa da basso e da cassa insieme.
- Ricetta: `MembraneSynth`, oscillatore sine, nota **F1-A1 (43-55 Hz)**, `pitchDecay` 0.03-0.06, `octaves` 2-3 (scivolata
  più breve della kick attuale che ha `octaves: 6`), envelope `attack 0.002, decay 0.9-1.4, sustain 0, release 0.3`.
- Per "sentirla" su casse piccole: `Tone.Distortion` leggera (0.2-0.3) o `WaveShaper` soft-clip dopo il sinusoide (armoniche a 100-300 Hz).
- Variante corta (reggaeton): decay 0.25-0.4.
- Limite: un 808 trap è **intonato** (segue le note del basso). Una riga della drum machine ha **un solo tono**:
  per gli 808 melodici è meglio un preset di synth su una traccia a note (piano roll). Offrire 2-3 toni fissi
  (kick808 con parametro "tono") è un compromesso per le preimpostazioni dei generi.
- Loudness: la banda sotto 60 Hz porta molta energia; partire a **-4 dB** rispetto alla kick e non farla suonare nello
  stesso step della kick (si sommano e il limiter del master schiaccia tutto). Sidechain su basso (v2) aiuta.

### 2.2 rimshot / side-stick - B, buona (pop, lo-fi, reggaeton, techno)
- **Suono**: "tac" secco di legno/metallo, il bastoncino sul bordo del rullante; alternativa discreta al rullante.
- Ricetta 808-style (valori **non verificati**): 2 `Oscillator` (triangle ~450 Hz e square ~1700 Hz, o due sine a 500 e 1800 Hz)
  con `AmplitudeEnvelope` decay 0.015-0.03 s + `NoiseSynth` white highpass 1.5 kHz, decay 0.01. Poi `Filter` bandpass ~1.5-2 kHz, Q 1-2.
- Loudness: picco alto ma energia breve; volume simile al clap (-6 dB dal kit).

### 2.3 shaker / maracas - B, accettabile (house, pop, lo-fi, reggaeton, techno)
- **Suono**: "tss-ch" di sabbia in un contenitore; dà movimento continuo. In reggaeton/house va a sedicesimi con velocity alternate.
- Ricetta: `NoiseSynth` white (o pink per più morbido), highpass ~5-6 kHz o bandpass ~7 kHz Q 1,
  envelope **attack 0.015-0.03** (l'attacco lento lo distingue dall'hi-hat, che ha 0.001), decay 0.05-0.09, sustain 0.
- Volume: **-16 dB** circa (è fruscio, copre il mix se alto). Due varianti (corta/lunga) cambiando solo `decay`.
- CPU: trascurabile (un `NoiseSynth` + filtro).

### 2.4 Tom basso / medio / alto - B, buona in stile elettronico (rock, pop, house)
- **Suono**: tamburi intonati dei "giri" di batteria (tum-tum-TUM). Tre altezze: grave/medio/acuto.
- Ricetta: `MembraneSynth` come la kick ma più alto e più lungo: note **~100 Hz (G2), ~150 Hz (D3), ~220 Hz (A3)**,
  `pitchDecay 0.04-0.08`, `octaves 2-3`, envelope `attack 0.001, decay 0.25-0.45, sustain 0`.
  Opzionale: "click" di bacchetta = `NoiseSynth` highpass 2 kHz decay 0.01.
- Una sola funzione `createTom(output, note)` con 3 chiamate: 1 file solo.
- Realismo: "pew" stile disco/808, **non** tom di rock reali (mancano pelle/risonanza: giudizio da `09`).

### 2.5 tambourine - M, accettabile (pop, lo-fi, house, rock)
- **Suono**: "tsh-chink": colpo + sonagli metallici. Ruolo: riempimento sul controtempo o sui battiti 2-4.
- Ricetta: rumore white bandpass ~9 kHz, Q 1-2, attack 0.003, decay 0.12-0.2 + "doppio colpo" (re-trigger a ~15 ms come
  nel clap) + 3 onde quadre alte inarmoniche (es. ~6.2, 8.3, 10.1 kHz, valori **inventati come esempio**) decay 0.15.
- Più convincente in stile elettronico; il tamburello vero è meglio come campione (v2).

### 2.6 cowbell - B, buona (reggaeton, trap, house, rock)
- **Suono**: "tong" metallico di campanaccio (famoso nei brani 808).
- Ricetta **verificata su 808**: **due onde quadre a 540 Hz e 800 Hz** sommate, poi **bandpass** attorno a ~800 Hz
  (Q ~1-2): la 800 domina. Envelope: attacco 0.001, decay 0.3-0.4 (si può fare "doppio": breve forte + coda sottile).
  Tone: 2 `Tone.Synth` con `oscillator.type: 'square'` → `Filter` bandpass → bus, nota 540/800 Hz.
  (Un articolo di Sound on Sound su un'altra Roland, la CR-8000, misura ~587 e ~845 Hz: la ricetta dipende dal modello.)
- Loudness: i toni quadri sono pieni di armoniche, partire a -12 dB.

### 2.7 conga / bongo - M, accettabile (house, reggaeton, lo-fi)
- **Suono**: tamburi a mano, "tum" (basso/aperto) e "tac" (schiaffo). Calore umano nei ritmi latini.
- Ricetta (valori **non verificati**): `MembraneSynth`, `pitchDecay 0.01-0.02`, `octaves 1` (scivolata piccola),
  note ~200 Hz (conga bassa), ~330 Hz (alta), bongo ~400-500 Hz; decay 0.15-0.25; + "slap" = noise bandpass 1.5 kHz decay 0.01.
- Realismo medio: il corpo ligneo/pelle è difficile; ok come "colore".

### 2.8 snap (schiocco di dita) - M, accettabile (pop, lo-fi)
- Ricetta: noise bandpass ~2-3 kHz, Q ~3, decay 0.03-0.05 + sine 1.2 kHz con rapida discesa (0.01 s); volume -8 dB.
  È un clap più corto e "secco": se serve riusare `clap.ts` con meno rimbalzi.

### 2.9 clave - B, buona (house/reggaeton occasionali)
- Due legnetti: sine/triangle ~2.5 kHz (valore **non verificato**), decay 0.03-0.05. Bitwig ha uno strumento "Claves"
  ispirato alla clave 808 (conferma che è un suono 808 classico). Quasi identico a rimshot: priorità bassa.

### 2.10 perc - colpetto intonato generico - B, buona (techno, house)
- Un "blip" breve: sine/triangle con scivolata veloce (`MembraneSynth`, `pitchDecay 0.01`, `octaves 1-2`) tra 600-1500 Hz,
  decay 0.05-0.1, bandpass; un parametro "tono" lo rende versatile (nella techno si usa molto). v2.

## 3. Cosa è difficile e richiede campioni (crash, ride)

| Voce | Perché è difficile | Sintesi possibile (solo ripiego) | Soluzione migliore |
|---|---|---|---|
| **Crash** | Il suono è migliaia di frequenze inarmoniche che si intrecciano per 1-3 s; il rumore filtrato suona "a tubo" | 6 onde quadre inarmoniche (base 200-800 Hz, **non verificato** il valore preciso) + noise white highpass 3-4 kHz, decay 1.5-2.5, attack 0.002 | Campione one-shot |
| **Ride** | Serve il "ping" iniziale + coda che scintilla e cambia | stesse onde, bandpass 4-6 kHz, decay 1-2; ping = sine 3-4 kHz decay 0.02 | Campione one-shot |

- Fonti sui piatti 808: usano **6 onde quadre** a intervalli "casuali" mixate e filtrate; un solo rumore bianco non dà
  il carattere metallico (Noise Engineering, Cherry Audio). Documentazione primaria Roland con frequenze esatte: **non trovata**.
- Per quanto ricordo, i piatti della 909 erano **campioni** a bassa risoluzione, non sintesi: **non verificato**.
- **Licenze (da `09`)**: includere nel repo solo materiale che permette ridistribuzione. Candidati verificati: **Virtuosity Drums
  (CC0)**, estraendo 2 colpi (crash, ride; la libreria intera è 1,1 GB: non includerla) e **singoli file Freesound CC0** scelti
  a mano con URL/autore annotati. Dustyroom Fake Acoustic: **da confermare**. **No**: SampleRadar (non ridistribuibile),
  Tonejs/audio (nessuna licenza), kit Hydrogen GPL/CC-BY-SA, Citizen DJ (ShareAlike).
- Implementazione: `Tone.Player` per voce (uno per piatto) con la stessa interfaccia `DrumVoice`; file in `public/samples/<kit>/`
  con `LICENSE.txt`; `await Tone.loaded()` prima del play; per `Tone.Offline` riusare i buffer già decodificati
  (da verificare). Dimensione stimata: 50-150 KB per piatto in OGG/MP3 (non misurato).
- Decisione (vedi §8): sintesi "decente" ora, campione dopo; oppure rinviare i piatti.

## 4. Volume e processore

- Il bus del kit è a -3 dB e **mono**; il master ha limiter + clipper. Il rumore di Tone è stereo: il bus mono evita il "rumore largo".
- Livelli di partenza rispetto alla kick (0 dB, da misurare): 808 -4, tom -4, rimshot -6, clap -6, cowbell -12, crash -12,
  tambourine -14, shaker -16, hi-hat -10 (attuale). **Vanno tarati con `npm run audio:check`** e con lo spettrogramma
  (agente `audio-quality-checker`): voci con molto 3-10 kHz (shaker, tambourine, crash) sembrano più forti di quanto dicono i dB.
- CPU: ogni voce = 2-5 nodi Web Audio. Con 13-18 voci sono poche decine di nodi: trascurabile. Costi veri: (a) i piatti
  sintetici (6 oscillatori + code lunghe e sovrapposte), (b) `MetalSynth` sempre acceso (già evitato nell'hi-hat),
  (c) code di 1-2 s di crash/ride/808 che si accavallano in loop. Misura di polifonia: **non fatta**.
- `monotonic()` (esistente) va usato anche per le nuove voci, come per le attuali.
- Choke: nessuna nuova voce ne ha bisogno, tranne un eventuale "tom lungo" non previsto. Crash e ride possono sovrapporsi.

## 5. Ordine consigliato: 8 voci da aggiungere per prime

| # | Voce (id) | Perché | Priorità |
|---|---|---|---|
| 1 | `kick808` | Rende credibili trap/hip-hop/reggaeton (3 generi su 8) con un solo `MembraneSynth`; ricetta nota | MVP |
| 2 | `rimshot` | Usato da quasi tutti i generi (pop, lo-fi, techno, reggaeton): il "secondo rullante" più utile | MVP |
| 3 | `shaker` | Dà "vita" e movimento a pop, house, techno, reggaeton, lo-fi; costo zero (rumore) | MVP |
| 4-6 | `tomLow`, `tomMid`, `tomHigh` | Indispensabili per il rock e per gli stacchi di ogni genere; una funzione, 3 note | MVP/v2 |
| 7 | `tambourine` | Pop, lo-fi, house, rock: riempie il controtempo; sintesi accettabile | v2 |
| 8 | `crash` | Segna l'inizio delle sezioni in rock/pop (stacco); **in versione sintetica "decente"**, campione dopo | v2 |

Dopo: `cowbell` (reggaeton/trap, facile e verificato), `snap` (lo-fi/pop), `conga` alta/bassa e `perc` (house/techno/reggaeton),
`ride` (solo con campione), `clave` (nice). Questo porta da 5 a 13 righe nelle prime 8 aggiunte e a ~19 con tutte.
Nota: **non serve** una riga in più per "hi-hat aperto/chiuso variazioni": basta velocity e un parametro `decay`.

## 6. Impatto sull'interfaccia (step sequencer)

Oggi `StepSequencer.tsx` e `DrumVelocityLane.tsx` ciclano `DRUM_VOICES`: una riga per voce.
- **Limite righe**: 13 righe a ~24-28 px stanno in ~350 px; 19 righe (~500 px) cominciano a spingere fuori lo schermo
  in un layout con piano roll/mixer. Valutazione mia, da provare nel browser (screenshot con Playwright).
- **Raccomandazione: raggruppare e nascondere le righe vuote.**
  1. Gruppi con etichetta colorata: *Bassi* (kick, kick808), *Rullanti* (snare, rimshot, clap, snap), *Charleston/Piatti*
     (hihatClosed, hihatOpen, crash, ride), *Tom* (low/mid/high), *Percussioni* (shaker, tambourine, cowbell, conga, perc, clave).
  2. Per un principiante: mostrare **le 5 base + le righe che hanno già colpi**; un pulsante "+ Aggiungi suono" apre un menu
     con descrizione di una riga ("Shaker: sonaglio, dà movimento"). I pattern per genere accendono da soli le righe necessarie.
  3. Gruppi comprimibili (clic sul titolo) e un'unica barra di scorrimento verticale per il sequencer.
- Stato "righe visibili": nello store UI (`uiStore`), **non** nel progetto; si calcola da "righe con colpi" + "righe scelte".
- Nome leggibile per voce (italiano + breve spiegazione) in una tabella `DRUM_VOICE_INFO` in `src/music`.
- `DRUM_VOICES` diventa la **lista unica** e ordinata (è già usata da UI, pattern, hitsAt): aggiungere le voci **in fondo**
  per non cambiare l'ordine di quelle attuali; il raggruppamento visivo viene da una mappa gruppo→voci, non dall'ordine.

## 7. Impatto sul formato progetto (compatibilità)

Stato verificato nel codice: `drumStepsSchema` in `src/project/schema/pattern.ts` è `z.object({kick, snare, clap, hihatClosed,
hihatOpen})` con **tutte le chiavi obbligatorie**; `hitsAt` fa `pattern[voice][step]`; esiste già `src/io/migrate.ts` con
`formatVersion` (oggi 2, migrazione 1→2).
- **Problema**: un file vecchio senza le nuove chiavi, se lo schema le richiede, **non si apre**; se le richiede opzionali ma
  il codice fa `pattern[voice][step]`, **va in errore** a runtime su `undefined`.
- **Soluzione consigliata**:
  1. Costruire lo schema dalla lista unica: le 5 voci base **obbligatorie**, le nuove `.optional()` (o con `.default()` della lunghezza giusta).
     Così i file vecchi restano validi senza migrazione e **senza bump** di `formatVersion` (si aggiungono solo campi opzionali).
  2. In `loadProject`/dopo la validazione, una funzione pura `normalizeDrumPattern(pattern, steps)` riempie le righe mancanti
     con zeri della lunghezza `lengthBars * stepsPerBar` (stessa logica di `createEmptyPattern`): da qui in poi il resto del codice
     lavora sul tipo completo `Record<DrumVoiceId, number[]>`. Aggiungere test: file con 5 chiavi → 13 righe, e righe di lunghezza diversa rifiutate.
  3. Difesa in profondità: `hitsAt` e le operazioni usano `pattern[voice]?.[step]`.
  4. **Salvare solo le righe non vuote** (opzionale) per tenere piccoli i file e rendere ininfluente aggiungerne altre in futuro.
  5. Se invece si cambiasse il significato di voci esistenti o si rinominassero id: allora serve `formatVersion: 3` + migrazione in `migrate.ts`.
- **Avanti-compatibilità (file nuovo in app vecchia)**: `z.object` di default **scarta** le chiavi sconosciute: l'app vecchia aprirebbe
  il file perdendo in silenzio le percussioni nuove (e riscrivendolo al salvataggio). Per un'app locale personale è accettabile;
  se importasse, si può usare `.passthrough()` o un bump di versione che rifiuti file troppo nuovi. (Comportamento zod: da verificare nella versione in uso.)
- Template e pattern per genere: `drumPattern(track, name, hits: Partial<Record<DrumVoiceId, DrumHitSpec[]>>)` in
  `src/project/templates/build.ts` accetta già un sottoinsieme: nessun cambio necessario per scrivere i pattern dei generi.
- **Export MIDI (v2)**: mappa General MIDI canale 10 (da memoria, **da verificare** sulla specifica): cassa 36, side stick 37,
  rullante 38, clap 39, hat chiuso 42, hat aperto 46, tom basso 45, tom medio 47-48, tom alto 50, crash 49, ride 51, tamburello 54,
  cowbell 56, claves 75, maracas 70, bongo alto 60, conga bassa 64. Lo snap e il perc non hanno nota GM standard.
- Kit a campioni futuri: stesso id voce, implementazione diversa (`DrumVoice`), quindi il formato non cambia (vedi `09` §4).

## 8. Decisioni per l'utente

1. Accettare **crash/ride sintetici "decenti" ora** (sezione 3) o aspettare campioni CC0 (Virtuosity/Freesound) con più lavoro?
2. Il **kick808** ha un tono fisso (2-3 scelte) o si fa l'808 intonato su una traccia a note? (consigliato: fisso in batteria + preset di synth per il basso)
3. Per i principianti: righe nascoste con menu "+ Aggiungi suono" (consigliato) o tutte sempre visibili?
4. Una riga per tom (3 righe) o una riga "tom" con tono scelto per step (più compatta, ma richiede un formato diverso, cioè NON `number[]`)?
   Consigliato: 3 righe, perché non cambia il formato.
5. Procedere con `formatVersion` invariato e campi opzionali (consigliato)?

## 9. Come verificare (prima di fidarsi dei numeri)

- Prototipare le voci 1-8, ascoltarle e regolare; `npm run audio:check` per livelli e spettrogrammi; non aggiornare `baseline.json`
  senza approvazione dell'utente (CLAUDE.md).
- Controllare nel browser che 13+ righe non rompano il layout.
- Verificare il comportamento di `z.object`/`optional` nella versione di zod in uso e i test di migrazione.

## Fonti

- Tone.js docs (MembraneSynth, NoiseSynth, MetalSynth, Filter, Player): https://tonejs.github.io/docs/
- Sound on Sound, "Synthesizing Cowbells & Claves" (cowbell 808, toni ~587/845 Hz sulla CR-8000): https://www.soundonsound.com/techniques/synthesizing-cowbells-claves
- Cowbell 808, due onde quadre 800 e 540 Hz + filtri: https://hn.jakechampion.name/reader/http://outputchannel.com/post/tr-808-cowbell-web-audio ; https://frisnit.com/?p=919 ; https://www.ctrl-mod.com/products/tiptop-audio-cb808
- Piatti/hi-hat 808 (6 onde quadre): https://noiseengineering.us/blogs/loquelic-literitas-the-blog/creating-fm-hats/ ; https://docs.cherryaudio.com/misfit-audio/transistor-808-cymbal
- Bitwig, strumento Claves ispirato all'808: https://www.bitwig.com/userguide/latest/percussion
- Reggaeton (dembow, güira, conga): https://www.musicradar.com/news/beat-building-how-to-produce-a-reggaeton-beat
- Pattern di batteria elettronici/generi (LANDR, NI): https://blog.landr.com/drum-programming ; https://www.native-instruments.com/de/blogs/blog/drum-patterns
- Trap (hi-hat rulli, 808): https://emastered.com/blog/trap-drum-patterns
- Guida ai generi (lo-fi, house; fonte secondaria): https://beatkey.pages.dev/genre-production-guide
- Sintesi di percussioni (CCRMA): https://ccrma.stanford.edu/~sdill/220A-project/drums.html
- Licenze campioni e librerie: report `09-drum-sounds.md` (Virtuosity Drums https://versilian-studios.com/virtuosity-drums/ , Freesound https://freesound.org)
