# Approfondimenti per le schede: ritmo, forma, generi

Data: 2026-11-17. Materiale per riscrivere le schede di `knowledge/cards/ritmo.md`, `forma.md`, `generi.md` (27 schede + proposte nuove). Le schede NON sono state modificate.

## Come leggere questo file

- Notazione batteria dell'app: 16 simboli per battuta, uno per sedicesimo, `x` = colpo, `.` = silenzio, uno spazio tra un battito e l'altro. Esempio: `x... x... x... x...` = un colpo su ogni battito. Le posizioni dei "Ritmi pronti" sono prese da `src/project/rhythms/genres.ts`.
- Ogni fatto è stato letto davvero sulla pagina citata (WebFetch, 2026-11-17). Dove la pagina NON dice una cosa, c'è scritto "non verificato" o "non è nella fonte": la cosa può essere vera nella pratica, ma non va presentata come fatto di Wikipedia.
- Funzioni dell'app usate nei consigli (verificate in `featureList` e nel codice): griglia batteria a sedicesimi, striscia "Intensità" sotto la griglia, "Ritmo pronto" (Base/Ricco), "+ Aggiungi suono", "Duplica" pattern, "Duplica blocco", pattern da 1 a 8 battute, linea del tempo fino a 128 battute, "Ripeti parte", BPM, volume/pan/muto/assolo, effetti Riverbero/Delay/Filtro/Equalizzatore/Distorsione, piano roll con "Blocca sulla scala". NON esistono: swing, terzine, arpeggiatore, sidechain, compressore, automazioni, microfono.
- Sigle fonti: OMT = Open Music Theory 2e, base URL `https://human.libretexts.org/Bookshelves/Music/Music_Theory/Open_Music_Theory_2e_(Gotham_et_al.)/` (nel testo sotto: `OMT 7.2` = `07%3A_Popular_Music/7.02%3A_Drumbeats`). Il sito viva.pressbooks.pub risponde 403 al fetch automatico e non è stato usato. Le pagine OMT 11.4 e 11.7 (swing) si sono caricate vuote: non citate.
- Priorità errori: "ERRORE" = da correggere; "IMPRECISIONE" = da sfumare; "NON VERIFICATO" = tenere solo se detto come indicativo.

URL OMT completi usati:
- 7.1 `.../07%3A_Popular_Music/7.01%3A_Rhythm_and_Meter_in_Pop_Music`
- 7.2 `.../07%3A_Popular_Music/7.02%3A_Drumbeats`
- 7.3 `.../07%3A_Popular_Music/7.03%3A_Melody_and_Phrasing`
- 7.4 `.../07%3A_Popular_Music/7.04%3A_Introduction_to_Form_in_Popular_Music`
- 7.5 `.../07%3A_Popular_Music/7.05%3A_AABA_Form_and_Strophic_Form`
- 7.6 `.../07%3A_Popular_Music/7.06%3A_Verse-Chorus_Form`

---

# PARTE 1 - RITMO

## ritmo | Ritmo
**Fatti in più**
- La parola viene dal greco *rhythmos* e indica un movimento segnato da elementi forti e deboli che si alternano. Un ritmo non è solo "suoni": anche le pause (silenzi) sono parte del ritmo, perché si sente il battito anche quando non c'è suono.
- Tre cose da non confondere: il battito (la pulsazione regolare, quella su cui batti il piede), la velocità (BPM: 60 BPM = un battito al secondo) e il ritmo vero e proprio (la figura di suoni e pause che si dispone sopra il battito).
- In 4/4 il primo battito è il più forte, il terzo è medio, il 2 e il 4 sono più deboli. Gli accenti sono ciò che rende un ritmo "riconoscibile".
- Un ritmo ripetuto si riconosce meglio se la melodia sopra ha un profilo che si ripete (la ripetizione aiuta l'orecchio).
- Esempio con la griglia: `x... x... x... x...` (solo cassa, quattro battiti uguali) è un ritmo molto stabile; `x..x ..x. x..x ..x.` ha lo stesso battito ma suona "ballerino" perché i colpi cadono tra un battito e l'altro.
**Errori comuni**
- Mettere colpi in tutte le caselle: senza pause il ritmo diventa un rumore piatto. Lasciare caselle vuote è una scelta musicale.
- Far suonare tutti gli strumenti sugli stessi punti: sembra "marciare". Meglio che basso e accordi cadano in punti diversi da quelli della cassa.
**Consigli per l'app**
- Parti dalla griglia della batteria con "Ritmo pronto", poi togli un colpo e ascolta cosa cambia.
- Ascolta un solo strumento alla volta con "Assolo" per capire che ritmo fa ciascuno.
**Fonti**: Rhythm <https://en.wikipedia.org/wiki/Rhythm>; Beat (music) <https://en.wikipedia.org/wiki/Beat_(music)>; OMT 7.1.
**Note**: "togliere una nota spesso rende più interessante che aggiungerne" è un consiglio pratico, non un fatto della fonte: presentarlo come consiglio.

## groove | Groove
**Fatti in più**
- Groove è la sensazione di "spinta" che fa muovere il corpo; la fonte lo descrive come un "feel" che avanza e invita a ballare. Nasce dall'insieme della sezione ritmica (batteria, basso, e anche chitarre o tastiere), con basso e batteria al centro.
- "In the pocket" (nella tasca) vuol dire che il ritmo è solido e preciso; se resta così a lungo si parla di "deep pocket".
- Piccoli cambi del basso (dove cade una nota) possono cambiare molto il feel di un brano.
- CONTROVERSO: molti dicono che il groove nasce da micro-ritardi/anticipi rispetto alla griglia; ma uno studio citato dalla pagina ha trovato il groove più forte proprio con batterie senza alcuna deviazione (estetica dell'esattezza). Il groove è anche in parte soggettivo, e i confini con "swing" e "flow" (rap) non sono netti.
- Esempio: `x... .... x... ....` per la cassa e `.... x... .... x...` per il rullante danno la base; il groove viene da cosa aggiungi dopo (hi-hat con forze diverse, un colpo di cassa in sincope).
**Errori comuni**
- Pensare che "groove" = "swing" o = "fuori tempo". Un ritmo perfettamente preciso può avere un ottimo groove.
- Scrivere tutti i colpi con la stessa intensità: suona da metronomo.
**Consigli per l'app**
- Nella striscia "Intensità" sotto la griglia metti i colpi del charleston a livelli diversi (battito forte, in mezzo più piano).
- Controlla che nota del basso e cassa cadano insieme sul battito 1; poi prova a spostare di un sedicesimo una nota del basso.
**Fonti**: Groove (music) <https://en.wikipedia.org/wiki/Groove_(music)>; OMT 7.2.
**Note**: la scheda attuale dice che il groove nasce anche da "piccoli spostamenti rispetto alla griglia": IMPRECISIONE, è una tesi dibattuta (vedi sopra). Meglio "dagli accenti e da come si incastrano le parti". Parole chiave: togliere "swing del ritmo" (genera confusione con la scheda swing).

## cassa | Cassa
**Fatti in più**
- La grancassa dà un suono grave tipo "boom". La "kick" è la grancassa della batteria, suonata col pedale; il pedale singolo è del primo Novecento (1900-1909 secondo la pagina).
- Nel beat rock di base la cassa suona su 1 e 3, e il rullante (backbeat) su 2 e 4. Nel four on the floor suona su tutti e quattro i battiti.
- Nella musica elettronica le kick sono molto frequenti. La Roland TR-808 (uscita nel 1980) è famosa per una cassa potente e profonda, ottenuta da un'onda sinusoidale filtrata, con un controllo per allungarla (decay).
- Nell'hip-hop e nel pop moderno la cassa è spesso sincopata (non sempre sui battiti), ma in genere entra sempre sul primo battito della battuta (esempio citato da OMT: "HUMBLE." di Kendrick Lamar).
- Esempi con la griglia: pop `x... .... x... ....`; house `x... x... x... x...`; hip-hop del preset `x... ...x ..x. ....`.
**Errori comuni**
- Cassa e basso pieni insieme negli stessi istanti: i gravi si "impastano" e il suono diventa confuso. Soluzione: nota di basso più breve, oppure cassa e basso esattamente insieme.
- Cassa troppo forte nel volume: nel mixer meglio abbassarla un po' e lasciare spazio al basso.
**Consigli per l'app**
- Per un boom lungo aggiungi "Cassa 808" con "+ Aggiungi suono" e usa pochi colpi (ha una coda lunga).
- Usa l'Equalizzatore sul basso per togliere un po' di gravi se copre la cassa.
**Fonti**: Bass drum <https://en.wikipedia.org/wiki/Bass_drum>; Roland TR-808 <https://en.wikipedia.org/wiki/Roland_TR-808>; Four on the floor <https://en.wikipedia.org/wiki/Four_on_the_floor_(music)>; OMT 7.2.
**Note**: "nell'hip-hop ha ritmi più irregolari": SEMPLIFICAZIONE. Il boom bap classico ha cassa su 1 e 3 (pagina Boom bap); la cassa sincopata è tipica dell'hip-hop moderno/trap. La pagina Bass drum non cita la TR-808, ma la pagina TR-808 sì. Nel ritmo pronto Trap l'app usa la "Cassa" normale, non la "Cassa 808": non dire che il preset "contiene" la 808.

## rullante-clap | Rullante e clap
**Fatti in più**
- Il rullante ha, sotto la pelle inferiore, dei fili (le "corde"/snares) che vibrano e danno il suono secco e frusciante. Quando colpisci la pelle superiore, quella inferiore vibra "per simpatia".
- Di solito suona sul backbeat: tempi 2 e 4 (oppure sul 3 nei brani lenti / half-time).
- Rimshot: bacchetta su pelle e cerchio insieme, colpo metallico e forte. Cross-stick (o rim click): click secco e acuto, tipico di jazz e musica latina. Molti backbeat pop/rock sono rimshot.
- Il backbeat non è sempre rullante: in "We Will Rock You" (Queen) sono piedi e mani; nell'hip-hop e nell'elettronica si usano spesso clap o schiocchi di dita (OMT 7.2).
- Esempio griglia: `.... x... .... x...` (rullante su 2 e 4). Rullante in half-time: `.... .... x... ....`.
**Errori comuni**
- Mettere rullante sul 1 e 3 invece di 2 e 4: il ritmo suona "al contrario" e perde la spinta. Il rullante risponde alla cassa, non la sovrappone.
- Rullante e clap alla stessa intensità e sullo stesso step: si impastano. Prova clap più piano sopra il rullante (come nel ritmo Pop Ricco, clap leggero sopra rullante).
**Consigli per l'app**
- Prova a sostituire "Rullante" con "Battimani", "Rimshot" o "Snap" per cambiare carattere senza cambiare il ritmo.
- Per uno stile più rilassato metti il colpo un po' più piano (striscia "Intensità").
**Fonti**: Snare drum <https://en.wikipedia.org/wiki/Snare_drum>; Beat (music) (sezione Backbeat) <https://en.wikipedia.org/wiki/Beat_(music)>; OMT 7.2.
**Note**: l'URL `.../Backbeat` è un redirect a Beat_(music)#Backbeat. La scheda attuale è corretta. La pagina Snare drum non parla di drum machine.

## charleston | Charleston (hi-hat)
**Fatti in più**
- Due piatti su un'asta; un pedale li chiude: chiuso = "chick" breve, secco e smorzato; aperto = suono più lungo e frusciante.
- Nel rock di base è su ottavi regolari (OMT 7.2); nell'hip-hop è spesso un semplice pattern di ottavi fatto da drum machine o campione. Nel jazz il piede batte l'hi-hat chiuso su 2 e 4.
- Nella disco e nella house c'è un hi-hat aperto, "sibilante", sui contrattempi (tra un battito e l'altro); in "Heart of Glass" l'hi-hat suona quasi solo sugli off-beat.
- Il ride (piatto grande, suono continuo) può fare lo stesso lavoro dell'hi-hat, tranne l'aperto/chiuso; si usa spesso nei ritornelli o nelle parti più "aperte" al posto dell'hi-hat delle strofe.
- Esempio: ottavi `x.x. x.x. x.x. x.x.`; aperto in levare (house) `..x. ..x. ..x. ..x.`; sedicesimi `xxxx xxxx xxxx xxxx`.
**Errori comuni**
- Sedicesimi tutti alla stessa forza: suonano come una mitragliatrice. Meglio battito forte, ottavi medi, sedicesimi deboli.
- Charleston aperto troppo lungo o troppo forte: copre il resto e "sporca" gli alti. Abbassa il volume del suono nel mixer.
**Consigli per l'app**
- Usa "Charleston chiuso" sulla griglia, e aggiungi un solo "Charleston aperto" a fine battuta (step 14) per respirare, come nei ritmi pronti Pop/Hip-hop Ricco.
- Per le parti calme cambia "Charleston chiuso" in "Ride" (+ Aggiungi suono).
**Fonti**: Hi-hat <https://en.wikipedia.org/wiki/Hi-hat>; Disco <https://en.wikipedia.org/wiki/Disco>; House music <https://en.wikipedia.org/wiki/House_music>; Ride cymbal <https://en.wikipedia.org/wiki/Ride_cymbal>; OMT 7.2.
**Note**: la pagina Hi-hat non parla di ottavi/sedicesimi, né di aperto in levare, né di trap: queste cose vengono da Disco, House, OMT. "Rulli ... trentaduesimi nella trap": NON VERIFICATO (la pagina Trap cita hi-hat con suddivisioni "double-time" e "triple-time"). Nell'app i rulli veloci in trap si ottengono solo con sedicesimi (e le terzine non si possono scrivere).

## backbeat-four-on-floor | Backbeat e cassa dritta
**Fatti in più**
- Backbeat = l'accento sui tempi deboli (2 e 4 in 4/4); è una forma di sincope (l'accento si sposta dal tempo forte al debole). Compare in R&B, boogie, country (Hank Williams), rockabilly; oggi lo suona di solito il rullante, a volte con battimani.
- Four on the floor = cassa su ogni battito. Si diffuse nella disco degli anni Settanta; era comune anche nel jazz fino agli anni Quaranta; alcune band garage rock degli anni Sessanta lo usarono. Può esserci backbeat di rullante sopra ("Heart of Glass"), oppure no.
- Confronto: backbeat parla del rullante/clap (dove sta l'accento); four on the floor parla della cassa. Si possono combinare.
- Esempi: backbeat `x... .... x... ....` (cassa) + `.... x... .... x...` (rullante); four on the floor `x... x... x... x...` + clap `.... x... .... x...` + charleston aperto `..x. ..x. ..x. ..x.`.
**Errori comuni**
- Pensare che sono "due alternative dello stesso tipo": sono cose diverse (rullante vs cassa).
- Cassa dritta con basso che suona sempre sul battito: manca il movimento; fai suonare il basso nei vuoti tra le casse (in levare).
**Consigli per l'app**
- Scegli "House" in "Ritmo pronto" per la cassa dritta, "Pop" o "Rock" per il backbeat, poi cambia un solo colpo.
**Fonti**: Four on the floor (music) <https://en.wikipedia.org/wiki/Four_on_the_floor_(music)>; Beat (music) <https://en.wikipedia.org/wiki/Beat_(music)>; Disco <https://en.wikipedia.org/wiki/Disco>; OMT 7.2.
**Note**: la pagina Four on the floor non dice nulla su charleston in levare né su clap su 2 e 4 (quelle vengono da Disco/House/OMT) e non dà BPM. IMPRECISIONE nella scheda: descrive il backbeat come "cassa su 1 e 3, rullante su 2 e 4": è il "beat rock di base"; il backbeat in senso stretto è solo l'accento su 2 e 4.

## sincope | Sincope e contrattempo
**Fatti in più**
- Sincope = un disturbo del flusso regolare: l'accento passa da un punto forte a uno debole. Può nascere da una nota suonata appena prima o dopo il battito, da una pausa dove ti aspetti un colpo, o da un accento su un tempo debole.
- Nella pop/rock la sincope tipica accorcia la prima nota e anticipa le successive: in pratica la nota arriva un sedicesimo (o un ottavo) prima del battito (OMT 7.1).
- Il tresillo (3+3+2) è un esempio famoso: otto sedicesimi divisi in 3+3+2, cioè colpi su `x..x ..x.`. Suona come una terzina "finta" ma resta sulla griglia.
- Usata da ragtime, jazz, rock, country, disco, rap e dance.
- Esempio griglia: basso su `x..x ..x. x..x ..x.` (due battute da 8 sedicesimi, ripetuto) = sincopato.
**Errori comuni**
- Spostare tutto: se tutto è in sincope non si capisce più dove sta il battito. Lascia una cosa (cassa o rullante) ferma sul battito e sincopa il resto.
- Chiamarla "fuori tempo": non lo è, è uno spostamento voluto e regolare.
**Consigli per l'app**
- Nella griglia del basso (piano roll) sposta una nota un sedicesimo prima del battito 3 e ascolta.
- Metti un colpo di cassa sull'ultimo sedicesimo della battuta (step 15) per anticipare la battuta dopo.
**Fonti**: Syncopation <https://en.wikipedia.org/wiki/Syncopation>; Beat (music) <https://en.wikipedia.org/wiki/Beat_(music)>; Tresillo (rhythm) <https://en.wikipedia.org/wiki/Tresillo_(rhythm)>; OMT 7.1.
**Note**: AMBIGUITÀ di terminologia da dichiarare: la pagina Beat chiama "off-beat" i battiti deboli 2 e 4 (e le suddivisioni), mentre in produzione "in levare/off-beat" è di solito il punto a metà tra due battiti (la "e"). La scheda usa il secondo significato: va bene, ma meglio dirlo. Le parole chiave "fuori tempo" sono già state tolte? Nel file attuale ci sono ancora? No: nel testo letto non c'è, ok.

## ghost-note | Ghost note (colpi leggeri)
**Fatti in più**
- Una ghost note ha valore ritmico ma quasi nessun peso sonoro; sulla batteria è un colpo molto debole, di solito di rullante, tra le note principali. Si scrive con una "x" o con le parentesi.
- Il ghosting dipende dal volume, non dalla durata. Deve restare "chiaramente udibile ma più debole delle note normali": se arriva al silenzio è una semplice pausa.
- Crea una sensazione sottile di sedicesimi attorno al backbeat (The Drummer's Bible, citata nella pagina). Tipica di jazz, funk, R&B; esempi citati: Clyde Stubblefield in "Cold Sweat" (James Brown), Jeff Porcaro in "Rosanna" (Toto).
- Esistono anche per basso e chitarra (corda smorzata, effetto percussivo).
- Esempio con la griglia (rullante): `.... x... .... x..x` -> l'ultimo colpo, a intensità bassissima, è un ghost; oppure `...g x... ..g. x...` dove `g` è un colpo al 35%.
**Errori comuni**
- Ghost troppo forti: diventano veri colpi e confondono il backbeat. Devono stare ben sotto il rullante principale.
- Metterne tanti: bastano 1-3 a battuta.
**Consigli per l'app**
- Aggiungi il colpo di rullante e poi abbassa la sua barretta nella striscia "Intensità" (il ritmo pronto usa 0,35 per i ghost e 0,5 per i "soft").
- Prova ghost anche sul charleston: tra i colpi di ottavo, sedicesimi molto piano.
**Fonti**: Ghost note <https://en.wikipedia.org/wiki/Ghost_note>; Funk <https://en.wikipedia.org/wiki/Funk>; Snare drum <https://en.wikipedia.org/wiki/Snare_drum>.
**Note**: "nella griglia compaiono come colpi soft" non verificato (non ho aperto l'interfaccia); verificare con l'app prima di scriverlo.

## fill | Fill (passaggio di batteria)
**Fatti in più**
- Un fill è una breve interruzione del groove (un mini-assolo) che riempie un vuoto e segnala la fine di una frase. Di solito è breve e semplice; dopo il pattern riparte subito, con lo stesso tempo.
- Può essere su tamburi (tom), su rullante (serie di sedicesimi) o su hi-hat. Nell'hip-hop può essere uno scratch del DJ.
- Nel rock e nel pop, dopo il fill, il crash suona spesso al posto della prima nota della battuta successiva, insieme alla cassa.
- I tom sono tamburi con intonazioni diverse: il floor tom è il più grave. L'ordine "alto-medio-basso" per i fill è una abitudine pratica, non una regola scritta nelle fonti.
- Esempio nell'ultima battuta di 4: `x... .... x... ....` (cassa) + tom `.... .... .... xxxx`: tomHigh `.... .... .... x...`, tomMid `.... .... .... .x..`, tomLow `.... .... .... ..xx`, poi crash `x...` all'inizio del pattern dopo.
**Errori comuni**
- Fill ogni 4 battute in tutti i punti: perde effetto. Mettilo solo prima dei cambi di sezione.
- Fill troppo lungo che "ferma" il brano: meglio mezza battuta o un battito.
**Consigli per l'app**
- "Duplica" il pattern di batteria, chiamalo "Fill", cambia solo l'ultima parte, e mettilo come ultimo blocco prima del ritornello sulla linea del tempo.
- Crash (+ Aggiungi suono) sul primo battito del blocco nuovo.
**Fonti**: Fill (music) <https://en.wikipedia.org/wiki/Fill_(music)>; Crash cymbal <https://en.wikipedia.org/wiki/Crash_cymbal>; Tom-tom drum <https://en.wikipedia.org/wiki/Tom-tom_drum>.
**Note**: la scheda dice "o anche un vuoto improvviso": plausibile ma NON VERIFICATO nella pagina (che parla solo di riempire i vuoti). Nessun errore grave.

## swing | Swing e shuffle
**Fatti in più**
- Swing = allungare e accorciare in modo alternato le due note di ogni coppia di suddivisioni: la prima più lunga, la seconda più corta. Si esprime con un rapporto, non una percentuale: 1:1 = dritto (senza swing), 3:2, 2:1 (stile terzina, lungo-corto), 3:1 (swing molto marcato, "hard swing").
- Il rapporto non è fisso: nel jazz va da circa 1:1 a 3:1 ed è più largo ai tempi lenti e più stretto ai tempi veloci.
- Shuffle = swing con la prima nota lunga il doppio (o più) della seconda; tipico di blues, boogie-woogie, rock and roll.
- Generi citati: jazz, blues, funk, hip hop, R&B, soul, rockabilly, ragtime e altri. Anche nel boom bap il ritmo è molto "swingato", ottenuto con ritardi o con la "quantizzazione swing" dei campionatori (MPC, SP-1200): i battiti "on" restano precisi, quelli "off" si ritardano un po'.
- Esempio: ottavi dritti `x.x.` vs swing: la seconda "x" arriva più tardi (come in una terzina: 1-2-3, colpo sull'1 e sul 3).
**Errori comuni**
- Pensare che si ottenga solo "rendendo più piano il levare": è una cosa diversa (dinamica, non tempo).
- Esagerare: troppo swing sui sedicesimi di una cassa dritta fa perdere la precisione da dance.
**Consigli per l'app**
- L'app non ha swing: ottenerlo davvero non è possibile con la griglia a sedicesimi. Si può evitare la rigidità con intensità diverse tra battito (forte) e levare (più debole) nella striscia "Intensità": risultato più "umano", ma NON è swing vero.
- Per atmosfere lo-fi/hip-hop punta su BPM bassi (70-90), batteria morbida, ghost note.
**Fonti**: Swing time <https://en.wikipedia.org/wiki/Swing_time>; Boom bap <https://en.wikipedia.org/wiki/Boom_bap>.
**Note**: la pagina Swing_time è dove porta il vecchio URL. "Ritarda le note in levare" è corretto in sostanza. La frase finale della scheda ("si può avvicinare un effetto simile...") è accettabile ma va dichiarato che è un'altra cosa.

## poliritmo-terzine | Terzine
**Fatti in più**
- Una terzina mette tre note nello spazio di due (tre crome in terzina = una semiminima). Le note valgono 2/3 di quelle normali.
- Nella pagina: i "tuplet" generali (quintine, ecc.) possono creare poliritmi o hemiola.
- Attenzione: il tresillo 3+3+2 NON è una terzina vera. È una divisione di otto sedicesimi in 3+3+2 che suona come terzina "finta" ma resta sulla griglia a 2/4/8 (OMT 7.1: "più comune delle vere terzine"). Questa è la cosa più utile per l'app.
- Nella trap gli hi-hat usano suddivisioni "double-time" e "triple-time" (pagina Trap); e il "triplet flow" (rap a terzine) è uno stile della voce, non della batteria.
- Esempio: tresillo sul charleston `x..x ..x. x..x ..x.`; rullo finale della trap con sedicesimi crescenti `.... .... .... xxxx`.
**Errori comuni**
- Provare a scrivere una terzina sulla griglia a sedicesimi: non si può (3 non divide 4). Meglio usare 3+3+2 o altri raggruppamenti.
- Confondere terzina e "tre contro due" (poliritmo): è un'altra cosa (due ritmi insieme).
**Consigli per l'app**
- Per un effetto "rotondo" usa il raggruppamento 3+3+2 con charleston o basso.
- Per i rulli trap usa un finale di battuta a sedicesimi con intensità crescente (come il ritmo Trap Ricco).
**Fonti**: Tuplet <https://en.wikipedia.org/wiki/Tuplet>; OMT 7.1; Trap music <https://en.wikipedia.org/wiki/Trap_music>.
**Note**: ERRORE di struttura: l'id si chiama "poliritmo-terzine" ma il testo spiega solo le terzine (nessuna spiegazione del poliritmo): togliere "poliritmo" dall'id o aggiungere la spiegazione. IMPRECISIONE: "creare una sensazione simile alternando gruppi di colpi irregolari" è vago: meglio "raggruppamento 3+3+2". Per "tre contro due" la pagina Tuplet non dà esempi musicali.

## half-time-double-time | Half-time e double-time (SCHEDA NUOVA PROPOSTA)
**Fatti in più**
- Half-time: il backbeat si sposta dal 2 e 4 al solo 3 (la distanza tra i colpi di rullante raddoppia): il brano sembra a metà velocità anche se i BPM non cambiano; due battute di 4/4 si sentono come una.
- Double-time: il backbeat si sente a velocità doppia, il rullante cade sulle "e" e l'hi-hat suddivide in sedicesimi.
- Esempi citati: "Take Me Home" (Phil Collins, 1985, 119 BPM) con clap che sostituisce il rullante, sentito come 60 BPM; "Trapped Under Ice" (Metallica, 1984), double-time sentito come 320 contro 160.
- Griglia: normale `x... .... x... ....` + rullante `.... x... .... x...`; half-time rullante `.... .... x... ....` (come il ritmo pronto Trap).
**Errori comuni**
- Dimezzare i BPM invece di spostare il rullante: cambia tutto il resto. Meglio lasciare il tempo e spostare solo il backbeat.
**Consigli per l'app**
- In "Ritmo pronto" metti Hip-hop o Pop, poi sposta il rullante dal 2 e 4 al solo 3 e ascolta come cambia la sensazione.
**Fonti**: Half-time (music) <https://en.wikipedia.org/wiki/Half-time_(music)>; OMT 7.2.

## tresillo-dembow | Tresillo (SCHEDA NUOVA PROPOSTA, opzionale)
**Fatti in più**: ritmo 3+3+2 (otto impulsi divisi in 3+3+2), molto diffuso nella musica latinoamericana e caraibica, nelle tradizioni dell'Africa sub-sahariana, nel jazz delle origini (St. Louis Blues), in R&B e rock and roll (Hound Dog, 1956). Il dembow ne usa la seconda metà per il rullante. Esempio `x..x ..x.`.
**Fonti**: Tresillo (rhythm) <https://en.wikipedia.org/wiki/Tresillo_(rhythm)>; OMT 7.1, 7.2. **Note**: la pagina Tresillo NON nomina il reggaeton: il legame viene da OMT 7.2 e dalla pagina Reggaeton.

## piatti | Crash, ride e campana (SCHEDA NUOVA PROPOSTA, opzionale)
**Fatti in più**: il crash è un piatto per accenti occasionali, suono forte e secco; spesso segue un fill, al posto della prima nota della battuta dopo. Il ride tiene un pattern continuo con suono "shimmering"; la campana (bell) dà un "ping" più brillante e meno sostenuto. Il ride può rimpiazzare l'hi-hat (es. strofa su hi-hat, ritornello su ride). L'app ha Crash, Ride e Campana del ride tra i suoni.
**Fonti**: Crash cymbal <https://en.wikipedia.org/wiki/Crash_cymbal>; Ride cymbal <https://en.wikipedia.org/wiki/Ride_cymbal>. **Consiglio**: usa un crash all'inizio di ogni sezione nuova e togli l'hi-hat in favore del ride nel ritornello.

---

# PARTE 2 - FORMA

## forma-canzone | Struttura di un brano
**Fatti in più**
- Sezioni tipiche: intro, strofa (verse), pre-ritornello (opzionale), ritornello (chorus), post-ritornello (opzionale), ponte (bridge), outro. Ordine tipico del pop/rock moderno: intro - strofa - pre - ritornello - strofa - pre - ritornello - ponte - ritornello (outro opzionale). Strofa e ritornello tornano; intro, ponte e outro compaiono di solito una volta.
- Una sezione pop/rock dura di solito 8-24 battute e contiene 2-4 frasi (OMT 7.4); una frase è tipicamente di 4 battute (OMT 7.3).
- Forma AABA (o "32 battute"): quattro sezioni da 8 battute: A-A-B-A (la B è il ponte). Forma strofica: la stessa musica con testi diversi (blues, primo hip hop).
- Come si riconosce un cambio di sezione: cambia il testo, cambia l'armonia, entrano o escono strumenti, il volume e l'energia salgono o scendono, torna materiale già sentito.
- Esempio: `intro 4 battute / strofa 8 / ritornello 8 / strofa 8 / ritornello 8 / ponte 8 / ritornello 8 / outro 4` = 56 battute (a 120 BPM sono circa 1 minuto e 52 secondi).
**Errori comuni**
- Fare una sola sezione lunghissima: non si capisce dove si è. Cambia qualcosa ogni 8 battute.
- Mettere tutto in pieno dall'inizio: il ritornello non ha più effetto.
**Consigli per l'app**
- Crea 2-3 pattern per strumento ("Strofa", "Ritornello") e metti i blocchi sulla linea del tempo, poi usa "Ripeti parte" per riascoltare una sezione.
**Fonti**: Song structure <https://en.wikipedia.org/wiki/Song_structure>; Verse-chorus form <https://en.wikipedia.org/wiki/Verse%E2%80%93chorus_form>; OMT 7.4, 7.5, 7.6.
**Note**: "le sezioni durano di solito 8 o 16 battute": IMPRECISIONE lieve, la fonte dice 8-24 (8 e 16 restano i valori più comuni in pratica, non confermati come "più comuni" dalla fonte). Wikipedia Song structure non dà durate in battute (solo le 8 battute della forma a 32).

## strofa-ritornello | Strofa e ritornello
**Fatti in più**
- La strofa ha testo che cambia (spesso racconta); il ritornello ha testo che resta uguale e contiene il titolo/gancio (hook). Il ritornello ha più energia: strumentazione più densa, voce più acuta, cori (OMT 7.6).
- Il ritornello contrasta con la strofa per melodia, ritmo, armonia e dinamica, ed è detto "breakout chorus" quando l'energia sale molto.
- Pre-ritornello: aumenta l'energia prima del ritornello (accordi che si allontanano dalla tonica, ritmo armonico più veloce). Post-ritornello: breve coda che chiude il ciclo.
- Refrain vs chorus: spesso usati come sinonimi; per alcuni "refrain" è un verso che si ripete dentro una strofa, "chorus" una sezione a sé.
- Forma verse-chorus: nata nell'Ottocento, domina il rock dagli anni '60.
- Esempio: strofa con solo cassa+basso+voce; ritornello con tutta la batteria, pad e melodia più alta.
**Errori comuni**
- Strofa e ritornello identici nell'arrangiamento: sembrano una sezione sola.
- Ritornello troppo lungo: 8 battute bastano.
**Consigli per l'app**
- Ritornello = aggiungi il charleston chiuso a sedicesimi e un pad; strofa = togli il charleston e lascia solo cassa+basso.
- Usa "Duplica" sul pattern di melodia e alzala di un'ottava per il ritornello.
**Fonti**: Verse-chorus form <https://en.wikipedia.org/wiki/Verse%E2%80%93chorus_form>; Refrain <https://en.wikipedia.org/wiki/Refrain>; Hook (music) <https://en.wikipedia.org/wiki/Hook_(music)>; OMT 7.6.
**Note**: la scheda dice "melodia più alta": confermato da OMT 7.6. "cambiare il giro di accordi o partire da un accordo diverso": plausibile, non in fonte.

## intro-outro | Intro e finale
**Fatti in più**
- L'intro è di solito solo musica, crea attesa e stabilisce tonalità e genere. Può essere basata su accordi del brano, su un riff o solo su batteria. Può anche avere un ostinato (una figura ripetuta) che poi ritorna.
- Intro comune in un brano lento: un accordo di dominante con una "corona" (fermata). Intro blues: un chorus intero.
- Outro/coda: chiude il brano; di solito non introduce melodie nuove. Può usare fade-out (volume che scende), ritardando o un "tag". Esempio nella pagina Coda: "Hey Jude" (1968) ha una coda di quasi 4 minuti e il brano supera i 7.
- Segnali di "sta per finire" (OMT 7.4): ripetizioni, trama che si assottiglia, intensificazione finale o fadeout.
- Nei brani da DJ, versioni club di 7-8 minuti (house) contro 3,5 minuti per la radio; i formati 12 pollici della disco permisero brani lunghi.
- Esempio: outro per sottrazione: ultime 8 battute togli prima melodia, poi accordi, poi charleston; resta solo la cassa per 2 battute.
**Errori comuni**
- Finale tagliato di colpo (il file finisce con il tempo ancora in corsa): suona come un errore.
- Intro troppo lunga in un brano pop: l'ascoltatore si annoia.
**Consigli per l'app**
- Finale: togli i blocchi traccia per traccia sulle ultime battute; ultimo accordo lungo sul grado I (tonica).
- L'app non ha fade-out automatico né automazioni: simula la sfumatura togliendo blocchi uno a uno, non abbassando il volume nel tempo.
**Fonti**: Introduction (music) <https://en.wikipedia.org/wiki/Introduction_(music)>; Coda (music) <https://en.wikipedia.org/wiki/Coda_(music)>; Song structure <https://en.wikipedia.org/wiki/Song_structure>; House music <https://en.wikipedia.org/wiki/House_music>; OMT 7.4.
**Note**: la pagina Coda non parla del fade-out; la pagina Introduction non parla di intro con batteria sola né di dance (vengono da Song structure e House). Fade-out è definito altrove (Wikipedia "Fade (audio engineering)" non letta).

## ponte | Ponte (bridge)
**Fatti in più**
- Il ponte è una sezione contrastante che prepara il ritorno del materiale originale: aggiunge progressione e può dare tensione; chiamato anche "release". Nella forma AABA è la B (terza sezione da 8 battute).
- In AABA il ponte di solito evita l'accordo di tonica e termina sulla dominante, creando attesa per il ritorno (OMT 7.5). Nella forma verse-chorus il ponte è più libero.
- In verse-chorus il ponte compare in genere una volta sola, prima dell'ultimo ritornello, e sostituisce strofa e/o pre-ritornello; un brano può non averlo.
- Il "middle eight" (ponte di 8 battute) di solito compare dopo il secondo ritornello.
- Nel 2011, l'80% delle prime 20 canzoni della classifica Billboard Year-End Hot 100 aveva una struttura con bridge (Wikipedia).
- Esempio: ritornello in Do maggiore; ponte che parte da La minore (vi), arriva a Sol (V): tonica evitata e attesa creata.
**Errori comuni**
- Ponte troppo simile alla strofa: non porta novità.
- Ponte troppo lungo: 8 battute bastano.
**Consigli per l'app**
- Fai un pattern di accordi diverso (altro giro) e toglie la batteria per 4 battute prima dell'ultimo ritornello; rientra con tutto.
**Fonti**: Bridge (music) <https://en.wikipedia.org/wiki/Bridge_(music)>; OMT 7.5, 7.6.
**Note**: "parte da IV o vi e finisce sulla dominante": confermato SOLO per il ponte AABA (OMT 7.5: evita la tonica, finisce sulla dominante); l'affermazione "parte da IV o vi" è NON VERIFICATA nelle fonti. Va detto "spesso" e "nella forma AABA".

## build-drop | Build-up e drop
**Fatti in più**
- Drop: punto in cui cambiano di colpo ritmo o linea di basso; preceduto da build-up e break. Nella EDM è la parte più intensa; in house/trance è il "climax".
- Build-up: passaggio con suoni ripetuti, batteria più veloce, volume in crescita (il rullante accelera, i synth salgono). Alcuni build-up finiscono con una battuta di silenzio.
- Breakdown: la sezione si svuota: spariscono gli strumenti intonati e spesso la percussione, resta rumore/effetti con tanto riverbero che sale di tono; poi un breve silenzio; poi il drop. Nei brani lunghi ce ne sono due o tre; ai DJ serve per mixare.
- Il contrasto della sezione spogliata rende più forte l'arrivo del drop.
- Nei brani solo strumentali il climax compare spesso nell'ultimo quarto del brano.
- Esempio: 8 battute di build: cassa tolta; rullante `.... x... .... x...` nelle prime 4, poi `x.x. x.x. x.x. x.x.`, poi `xxxx xxxx xxxx xxxx`; battuta di silenzio; drop con cassa e basso insieme.
**Errori comuni**
- Build-up senza silenzio/stacco: il drop arriva "morbido".
- Drop che non è più forte del resto: se tutto suona già a pieno nelle strofe, non c'è contrasto.
**Consigli per l'app**
- Fai un pattern "Build" (1-2 battute, ripetuto) con rullante sempre più fitto, e un pattern "Drop" con tutto; lascia una battuta vuota (nessun blocco) tra i due.
- Per l'effetto "filtro che si apre" l'app non ha automazioni: usa invece due versioni dello strumento con Filtro diverso ("scuro" nel build, "aperto" nel drop).
**Fonti**: Drop (music) <https://en.wikipedia.org/wiki/Drop_(music)>; Breakdown (music) <https://en.wikipedia.org/wiki/Breakdown_(music)>; House music <https://en.wikipedia.org/wiki/House_music>.
**Note**: "8 o 16 battute" NON VERIFICATO (la pagina non dà battute: dire "tipicamente"). "la cassa sparisce" e "il filtro si apre": NON nella pagina Drop (la pagina Breakdown dice che spariscono strumenti intonati e spesso percussioni); la pagina Drop non cita riser né filtri. Va bene come prassi, da non attribuire alla fonte.

## arrangiamento | Arrangiamento a strati
**Fatti in più**
- La pagina Wikipedia "Arrangement" definisce l'arrangiamento in senso più ampio: adattare una composizione esistente (armonia, melodia, strumenti, forma, tempo). Il significato "decidere chi suona quando" è quello da produzione, più pratico.
- Le tecniche di base: aggiungere (nuovo materiale, transizioni, fiati/archi), togliere (parti o strumenti) e trasformare (riarmonizzare, cambiare tempo o tonalità).
- OMT 7.4: nel pop il ritornello di solito ha più energia della strofa; segnali tipici sono trama strumentale più densa, volume più alto, voce più acuta.
- Sezioni "svuotate" come il breakdown rendono più forte l'ingresso successivo.
- Esempio di ordine di ingresso: batteria (4 battute) - basso (4) - accordi (8) - melodia (8) - togli la batteria per 2 battute - rientra tutto.
**Errori comuni**
- Tutte le tracce suonano per tutto il brano: nessun contrasto, "suona piatto".
- Troppi strumenti negli stessi acuti o gravi: confusione (si risolve togliendo, non alzando i volumi).
**Consigli per l'app**
- Guarda la linea del tempo: se ogni riga ha blocchi in tutte le battute, togli qualcosa nelle strofe.
- Usa "Muto" per provare cosa succede togliendo uno strumento prima di cancellare i blocchi.
**Fonti**: Arrangement <https://en.wikipedia.org/wiki/Arrangement>; Breakdown (music) <https://en.wikipedia.org/wiki/Breakdown_(music)>; OMT 7.4, 7.6.
**Note**: IMPRECISIONE di fonte: la pagina Arrangement non parla di "strati" né di densità in senso pop (solo di tessitura e organici). Conviene aggiungere OMT 7.4 come fonte per il contrasto di energia tra sezioni, e dichiarare che "strati" è linguaggio di produzione.

## ripetizione-variazione | Ripetizione e variazione nel brano
**Fatti in più**
- La ripetizione aiuta l'orecchiabilità, ma troppa annoia (Miller, citato). Un alto livello di ripetizione è considerato un tratto della musica popolare. Si distingue la ripetizione di piccole figure (riff) da quella di frasi/sezioni intere.
- Variazione: ripetere con una modifica di melodia, ritmo, armonia, timbro o strumentazione. Nella musica elettronica la variazione serve a mantenere l'attenzione, bilanciando ripetizione e novità.
- Loop: una sezione che si ripete, spesso 1-4 battute; con più loop che si ripetono possono nascere ostinati. Un loop è diverso da un campione "one-shot" suonato una volta.
- Tipi di ripetizione: esatta (aaa), con digressione (aba), nessuna (abcd).
- Esempio: batteria base 3 volte, alla quarta aggiungi un colpo di cassa o un fill.
**Errori comuni**
- Loop da 1 battuta identico per 64 battute: stanca. Cambia qualcosa ogni 4 o 8 battute.
- Cambiare troppo: se ogni battuta è diversa, l'orecchio non riconosce più nulla.
**Consigli per l'app**
- "Duplica" il pattern, chiamalo "Variante", cambia un dettaglio, alternalo all'originale sulla linea del tempo.
- Aggiungi un effetto (Riverbero o Delay) su una sola traccia solo in una sezione.
**Fonti**: Variation (music) <https://en.wikipedia.org/wiki/Variation_(music)>; Repetition (music) <https://en.wikipedia.org/wiki/Repetition_(music)>; Loop (music) <https://en.wikipedia.org/wiki/Loop_(music)>.
**Note**: la pagina Loop non parla di rischio di monotonia; la scheda lo afferma in base a Repetition/Variation, ok. "un colpo di batteria in più ogni 4 battute" è un consiglio pratico.

## lunghezza-sezioni | Frasi da 4, 8 e 16 battute
**Fatti in più**
- Nella musica comune le frasi sono spesso di 4 battute con una cadenza (un "punto") alla fine; non è una regola assoluta (la pagina cita anche frasi di 5 battute). Il termine "frase" in questo senso risale a Hugo Riemann (1903).
- Nel pop/rock una frase di 4 battute corrisponde a una riga di testo; una sezione ha 2-4 frasi: due frasi = 8 battute, tre frasi = 12 (blues), quattro = 16 (OMT 7.3, 7.4).
- Due frasi uguali con finale diverso formano un "antecedente-conseguente" (domanda-risposta).
- Calcolo durata: battute al minuto = BPM / 4 (in 4/4). 120 BPM = 30 battute al minuto; un brano di 3 minuti = circa 90 battute; con 105 BPM (preset Pop) 26 battute/minuto.
- Tipico pop: 2,5-3,5 minuti (pagina Pop music), non 3-4.
- Esempio: blues a 12 battute = 3 frasi da 4 battute (I I I I / IV IV I I / V IV I V).
**Errori comuni**
- Sezioni di lunghezza "strana" (7 o 9 battute) senza accorgersene: l'orecchio sente qualcosa di sbagliato. Controlla la linea del tempo.
- Cambiare strumento a metà frase: il cambio va all'inizio del blocco di 4 o 8 battute.
**Consigli per l'app**
- Fai i pattern di 4 o 8 battute (l'app permette da 1 a 8) e allinea i blocchi sulla linea del tempo.
**Fonti**: Phrase (music) <https://en.wikipedia.org/wiki/Phrase_(music)>; Song structure <https://en.wikipedia.org/wiki/Song_structure>; Twelve-bar blues <https://en.wikipedia.org/wiki/Twelve-bar_blues>; OMT 7.3, 7.4.
**Note**: la pagina Phrase cita solo 4 battute (non 8): "4, 8, 16" è la prassi comune per sezioni e frasi doppie, ma NON VERIFICATO come "quasi sempre". La scheda dice "3-4 minuti, circa 90-120 battute": a 120 BPM, 3-4 minuti = 90-120, calcolo giusto; ma la fonte (Pop music) dà 2,5-3,5 minuti (75-105 battute): IMPRECISIONE da correggere in "circa 3 minuti".

## pre-ritornello | Pre-ritornello (SCHEDA NUOVA PROPOSTA)
**Fatti in più**: sezione opzionale tra strofa e ritornello (detta anche "build" o "transitional bridge"), spesso con accordi di transizione (IV o ii) e una nuova progressione che prepara il ritornello; è "armonicamente esplorativa" (si allontana dalla tonica); l'energia aumenta. Esempio nella pagina: 2 battute (La minore, poi Re7) che preparano un ritornello in Sol. Post-ritornello: breve sezione che chiude il ciclo senza introdurre il successivo. **Errore comune**: pre-ritornello più forte del ritornello. **Consiglio app**: 2-4 battute di pattern con accordi diversi e rullante più fitto. **Fonti**: Song structure (sezione Pre-chorus; l'URL /Pre-chorus è un redirect) <https://en.wikipedia.org/wiki/Song_structure>; OMT 7.6.

## blues-12-battute | Blues a 12 battute (SCHEDA NUOVA PROPOSTA)
**Fatti in più**: tre gruppi di 4 battute; accordi I-IV-V. Base: battute 1-4 I I I I; 5-8 IV IV I I; 9-12 V IV I V. Variante "quick change": il IV già alla battuta 2. Tipicamente si usano accordi di settima. La melodia segue spesso A-A'-B. Sezioni di 8 o 16 battute esistono come varianti. Esempio in Do: Do Do Do Do / Fa Fa Do Do / Sol Fa Do Sol. Nell'app: scala maggiore o pentatonica + "Blocca sulla scala"; un pattern da 8 battute + 4. **Fonti**: Twelve-bar blues <https://en.wikipedia.org/wiki/Twelve-bar_blues>; OMT 7.3.

## aaba-32 | Forma AABA (32 battute) e strofica (SCHEDA NUOVA PROPOSTA)
**Fatti in più**: quattro sezioni da 8 battute: due strofe (AA), ponte contrastante (B), ritorno (A); tipica del primo rock and roll (esempio: "I Want to Hold Your Hand", 1963). Forma strofica (AAA): stessa musica, testi diversi (blues, primo hip hop, "School Day", 1957). Differenza dalla verse-chorus: qui c'è una sola idea principale. **Fonti**: OMT 7.5; Song structure.

## hook | Gancio (hook) (SCHEDA NUOVA PROPOSTA)
**Fatti in più**: idea musicale breve (riff, frase, passaggio) che cattura l'orecchio, di solito nel ritornello; può essere melodica o ritmica (anche con sincope) o venire da un timbro o un suono; nell'hip-hop "hook" indica in genere il ritornello. Nelle ricerche radiofoniche l'hook riprodotto dura tipicamente 8-12 battute. Esempio: in "Be My Baby" l'hook è la progressione I-vi-IV-V del ritornello. **Fonti**: Hook (music) <https://en.wikipedia.org/wiki/Hook_(music)>. **Consiglio app**: ripeti 2-4 note in un pattern di melodia e rendilo il centro del ritornello.

---

# PARTE 3 - GENERI

## genere-pop | Pop
**Fatti in più**
- Durata tipica 2,5-3,5 minuti. Struttura più comune: strofa-ritornello (e la variante a 32 battute); il ritornello contrasta con la strofa (melodia, ritmo, armonia), ed è pensato per restare in mente grazie alla ripetizione.
- Ritmi e melodie sono semplici, con accompagnamento armonico limitato; l'armonia viene dalla tonalità europea, semplificata. Il pop enfatizza registrazione, produzione e tecnologia più che l'esecuzione dal vivo (multitraccia dagli anni '60, campionamento digitale dagli anni '80).
- "Pop" nasce come abbreviazione di "popular"; la fonte data il termine alla metà degli anni '50 in Gran Bretagna (come descrizione del rock and roll), con una discrepanza (infobox: anni '40).
- Il 4/4 è il tempo più comune in rock, blues, country, funk e pop (pagina Time signature).
- Preset app Pop (105 BPM, Base): kick `x... .... x... ....`, snare `.... x... .... x...`, hat chiuso `x.x. x.x. x.x. x.x.`.
**Errori comuni**
- Tutti i ritornelli lunghi e complicati: l'idea semplice e ripetuta funziona meglio.
- Strofa e ritornello con la stessa intensità: cambia la densità.
**Consigli per l'app**
- Parti dal "Ritmo pronto" Pop (Base nella strofa, Ricco nel ritornello) con un giro di 4 accordi ripetuto.
**Fonti**: Pop music <https://en.wikipedia.org/wiki/Pop_music>; Time signature <https://en.wikipedia.org/wiki/Time_signature>; OMT 7.4, 7.6.
**Note**: ERRORE lieve: "brani di 3-4 minuti" -> la fonte dice 2,5-3,5. NON VERIFICATO: "90-130 BPM" (la pagina non cita BPM; accettabile come "indicativo") e "giri di 4 accordi" (non nella pagina Pop music; il tema dei "Four-Chord Schemas" è in OMT 7.9, non letta).

## genere-hiphop | Hip-hop
**Fatti in più**
- Nasce nel Bronx (New York) all'inizio degli anni '70, dai block party: i DJ allungavano le parti strumentali ("break") dei dischi funk/disco, usando due copie dello stesso disco; sopra i break gli MC iniziarono a rappare. Data simbolo: 11 agosto 1973 (pagina avverte che è un'attribuzione molto promossa: non certa).
- Boom bap: onomatopea ("boom" = cassa, "bap" = rullante); loop di 4/4 con cassa su 1 e 3 e rullante su 2 e 4, suono asciutto, spesso molto swingato (MPC, SP-1200 con quantizzazione swing); campioni brevi da registrazioni precedenti; il termine compare nel 1984 ("It's Yours", T La Rock); epoca d'oro dal 1986 a metà anni '90.
- La drum machine TR-808 (1980) ha dato la cassa profonda al "new school"; sampler come E-mu SP-1200 e Akai S900 resero i break producibili in pochi secondi.
- Preset app Hip-hop (90 BPM, Base): kick `x... ...x ..x. ....`, snare `.... x... .... x...`, hat `x.x. x.x. x.x. x.x.`; il Ricco aggiunge un ghost di rullante su step 15 e un charleston aperto.
**Errori comuni**
- Riempire ogni spazio: il beat deve lasciare spazio alla voce (se c'è rap).
- Rullante troppo morbido: nel boom bap deve essere secco e in primo piano.
**Consigli per l'app**
- Usa "Ritmo pronto" Hip-hop e poi abbassa le note del charleston con la striscia "Intensità" per un feel meno rigido; BPM tra 80 e 95.
**Fonti**: Hip-hop <https://en.wikipedia.org/wiki/Hip-hop>; Boom bap <https://en.wikipedia.org/wiki/Boom_bap>; Roland TR-808 <https://en.wikipedia.org/wiki/Roland_TR-808>; OMT 7.2.
**Note**: NON VERIFICATO: "70-100 BPM" (nessuna pagina letta cita BPM per l'hip-hop; i valori sono indicativi). NON VERIFICATO: "campionamenti di soul, jazz o funk" (la pagina Hip-hop cita break funk/disco; "soul/jazz" non confermati) e "accordi con colori di settima". IMPRECISIONE: "nasce come musica per il rap" -> nasce dal lavoro dei DJ sui break; il rap è venuto sopra. La scheda non nomina swing: l'app non lo ha.

## genere-trap | Trap
**Fatti in più**
- Nasce nel Sud degli Stati Uniti, ad Atlanta; il nome viene da "trap house" (casa di spaccio). Il suono moderno emerge nel 1999 (pagina); Lex Luger produce più di 200 brani nel 2010-2011.
- 808: kick profonde, derivate dalla TR-808, con decay lungo per le basse frequenze; hi-hat complessi con suddivisioni "double-time" e "triple-time"; snare descritto come "crisp, grimy, and rhythmic".
- Tempo: la pagina dà da 50 (100) a 88 (176) BPM, "spesso programmato in half-time", tipico circa 70 (140). L'half-time (rullante/clap solo sul 3) è descritto nella pagina Half-time.
- Melodie: drone monofonici multistrato, archi/ottoni/fiati sintetizzati; stile cinematico.
- Preset app Trap (140 BPM, Base): kick `x... .... ..x. ....`, clap e rullante `.... .... x... ....`, hat `x.x. x.x. x.x. x.x.`; Ricco aggiunge una raffica di sedicesimi a fine battuta (step 12-15) crescente.
**Errori comuni**
- Cassa 808 e basso insieme: coprono tutto; usa una sola cassa lunga come basso.
- Hi-hat tutti uguali: usa intensità diverse e raffiche solo a fine battuta.
**Consigli per l'app**
- Il ritmo pronto Trap usa la "Cassa" normale: per l'808 aggiungi "Cassa 808" con "+ Aggiungi suono" e togli la cassa normale.
**Fonti**: Trap music <https://en.wikipedia.org/wiki/Trap_music>; Half-time (music) <https://en.wikipedia.org/wiki/Half-time_(music)>; Roland TR-808 <https://en.wikipedia.org/wiki/Roland_TR-808>.
**Note**: IMPRECISIONE: la scheda dice 130-150 BPM; la fonte dà 100-176 con tipico 140 (misurati in "double", 70 in half-time): va bene "intorno a 140, ma si può scrivere anche a 70". La pagina Trap NON menziona il rullante sul 3, NON la scala minore, NON "terzine nelle hi-hat" (dice "triple-time"): il lavoro di verifica precedente la citava come coerente; la parte "rullante sul 3" è confermata solo dalla pagina Half-time, non da Trap. "atmosfere scure in minore": NON VERIFICATO.

## genere-lofi | Lo-fi hip-hop
**Fatti in più**
- "Lo-fi" = bassa fedeltà: produzione volutamente grezza, con imperfezioni e attrezzatura modesta. Tempo descritto da Pitchfork come "downtempo, fuzzed-out atmospheric beats".
- Suoni: melodie di piano o chitarra, fruscio di vinile artificiale, campioni da videogiochi retrò, cartoni, programmi tv.
- Origini: scena underground dei beatmaker negli anni 2000, dopo i sampler Roland SP-303 e SP-404 (effetto lo-fi dedicato); riferimenti: Madvillainy (2004), Nujabes ("godfather") e J Dilla; dal 2013 le live stream YouTube 24 ore su 24; popolarità dal 2015, crescita durante il 2020.
- Preset app Lo-fi (80 BPM, Base): kick `x... .... .x.. ....`, snare `.... x... .... x...`, hat piano (0,5-0,35) `x.x. x.x. x.x. x.x.`; Ricco aggiunge ghost e un charleston aperto leggero. Modello "Lo-fi tranquillo" con ritmo lento e accordi morbidi.
**Errori comuni**
- Troppi suoni: il lo-fi vive di pochi elementi. Troppo riverbero impasta.
- Dimenticare il filtro: senza filtro passa-basso resta troppo brillante.
**Consigli per l'app**
- Usa l'effetto Filtro per scurire il suono e un po' di Distorsione leggera, Riverbero poco; BPM 70-85.
**Fonti**: Lofi hip-hop <https://en.wikipedia.org/wiki/Lofi_hip-hop>; Lo-fi music <https://en.wikipedia.org/wiki/Lo-fi_music>.
**Note**: la pagina NON dà BPM, NON parla di accordi di settima/nona, NON di swing né di quantizzazione imperfetta, NON di filtro passa-basso: tenere quei dettagli come "tipico, indicativo". L'app non ha swing: dire solo "batteria morbida e piano".

## genere-house | House
**Fatti in più**
- Nasce a Chicago all'inizio degli anni '80 (Warehouse, DJ Frankie Knuckles considerato "padrino"), dai DJ che modificavano i brani disco rendendoli più meccanici. Date di apertura/chiusura del Warehouse non coincidono nelle pagine; entro il 1988 era mainstream.
- Caratteristiche: cassa su ogni battito (four on the floor), 4/4; BPM tipicamente 115-130 (altrove 120-130); clap/snap su 2 e 4; hi-hat in levare; basso profondo e prominente (il registro grave conta più della melodia); riff di synth ripetuti; voci facoltative (cantate, parlate o campionate, frasi semplici ripetute).
- Drum machine tipiche: Roland TR-909 (la più citata), TR-808, TR-707; il TB-303 (basso) è alla base dell'acid house ("Acid Tracks" dei Phuture, 1987). Deep house: più morbida, soul/jazz (Larry Heard, 1985-86).
- Struttura: intro, ritornello, strofe, parte centrale, outro; sezioni spesso da 8 battute ripetute; si costruisce aggiungendo strati e alzando il volume; versioni club 7-8 minuti, radio 3,5.
- Preset app House (124 BPM, Base): kick `x... x... x... x...`, clap `.... x... .... x...`, charleston aperto `..x. ..x. ..x. ..x.`.
**Errori comuni**
- Basso che suona sul battito insieme alla cassa a tutto volume: occupa lo stesso spazio; meglio basso tra le casse (levare).
- Sezioni troppo corte: la house ha bisogno di ripetere per 16-32 battute.
**Consigli per l'app**
- Ogni 8 battute aggiungi o togli qualcosa (charleston chiuso, accordi, melodia); BPM 120-126.
**Fonti**: House music <https://en.wikipedia.org/wiki/House_music>; Four on the floor <https://en.wikipedia.org/wiki/Four_on_the_floor_(music)>; Roland TR-808 <https://en.wikipedia.org/wiki/Roland_TR-808>.
**Note**: IMPRECISIONE: BPM in scheda 120-128 (fonte: 115-130, o 120-130). "Voci soul" e "basso funky e sincopato": NON VERIFICATI (la pagina dice voci facoltative, basso profondo). "Accordi di piano": la pagina lo cita solo per garage/"Jersey sound". "Sezioni di 16 o 32 battute": la fonte dice sezioni da 8 battute ripetute; 16/32 è prassi non verificata.

## genere-techno | Techno
**Fatti in più**
- Nasce a Detroit (Michigan) a metà anni '80; "No UFO's" di Model 500 (Juan Atkins, 1985) è considerato la prima produzione techno; i "Belleville Three" sono Atkins, Derrick May e Kevin Saunderson. Il nome diventò noto nel 1988 con la compilation "Techno! The New Dance Sound of Detroit". Era vista come variante di Detroit della house di Chicago.
- BPM 120-150 (la scheda dice 125-140), 4/4 con cassa four on the floor; drum machine e sintetizzatori (TR-808/909), sequencer, DAW. Voci e melodie rare; contano il timbro e la sintesi; le convenzioni armoniche sono spesso ignorate a favore di sequenze ripetitive.
- Prodotta per essere usata nei set DJ.
- Acid techno è un sottogenere della techno; il TB-303 fu centrale nell'acid house britannico del 1988.
- Preset app Techno (130 BPM, Base): kick `x... x... x... x...`, charleston aperto `..x. ..x. ..x. ..x.`, charleston chiuso ghost su tutte le altre caselle.
**Errori comuni**
- Troppi elementi insieme: la techno cresce lentamente; aggiungi un solo elemento ogni 8 battute.
- Melodia troppo ricca: basta una figura ripetuta.
**Consigli per l'app**
- Una sola riga di basso (ripetuta) e filtro che cambia tra pattern diversi ("scuro" e "aperto") invece di molte note.
**Fonti**: Techno <https://en.wikipedia.org/wiki/Techno>; Roland TR-808 <https://en.wikipedia.org/wiki/Roland_TR-808>; House music <https://en.wikipedia.org/wiki/House_music>.
**Note**: la scheda dice "nasce con l'acid house, molto usato anche nella techno": coerente con le fonti (ok, già corretta). IMPRECISIONE: BPM 125-140 vs 120-150. "Piccoli cambiamenti ogni 8 o 16 battute": prassi, NON VERIFICATA nella pagina (che non descrive la struttura).

## genere-reggaeton | Reggaeton
**Fatti in più**
- Nasce a Panama alla fine degli anni '80, da reggae in spagnolo; si consolida a Porto Rico nei primi anni '90 (nome); 1994 (Daddy Yankee, "Playero 34") o 1995 sono date citate; la forma moderna dal 1998.
- Il dembow è un riddim creato da produttori di dancehall giamaicani tra fine anni '80 e inizio '90 (Steely & Clevie, "Fish Market"/"Poco Man Jam", 1989); prende il nome da "Dem Bow" di Shabba Ranks (1990 per la pagina Dembow beat, 1991 per la pagina Reggaeton: le due pagine non coincidono sull'anno). L'onomatopea è "boom-ch-boom-chick".
- Cuore ritmico: il tresillo 3+3+2 accompagnato da una cassa in 4/4. OMT 7.2: la cassa suona su tutti e quattro i battiti, il rullante segue la seconda metà del tresillo (esempio: "Moscow Mule" di Bad Bunny).
- Testi per lo più in spagnolo; struttura strofa-ritornello-bridge come l'hip-hop.
- Preset app Reggaeton (95 BPM): kick `x... x... x... x...`, rullante `...x ..x. ...x ..x.`: sono 3, 6, 11, 14 (verificato in `genres.ts`).
**Errori comuni**
- Rullante sul 2 e 4 (backbeat classico): perde il dembow; il rullante è nei contrattempi.
- Basso che segue il rullante: meglio che segua la cassa.
**Consigli per l'app**
- "Ritmo pronto" Reggaeton, poi aggiungi Conga/Bongo/Campanaccio (+ Aggiungi suono) per le percussioni latine e un giro di accordi minori.
**Fonti**: Reggaeton <https://en.wikipedia.org/wiki/Reggaeton>; Dembow beat <https://en.wikipedia.org/wiki/Dembow_beat>; OMT 7.2.
**Note**: 85-100 BPM NON VERIFICATO (la pagina dà solo un esempio di bozza a 118 BPM in La minore: non è un range tipico). Descrizione delle posizioni di rullante: coerente con 3+3+2 e con il preset, ma le posizioni sedicesimo per sedicesimo NON sono scritte sulla pagina Dembow beat (che dà solo "3+3+2" e "boom-ch-boom-chick"). "Giri di accordi minori ripetuti": NON VERIFICATO.

## genere-rock | Rock
**Fatti in più**
- Chitarra elettrica amplificata al centro, basso elettrico e batteria; spesso tastiere. Band da 3 a 5 persone. Base in 4/4 con rullante in backbeat su 2 e 4. Forma strofa-ritornello (dalla metà degli anni '60), derivata da blues e folk.
- Origini: USA, fine anni '40-inizio '50 (rock and roll), da rhythm and blues, gospel e country. Alan Freed usò l'espressione nel 1951 (Cleveland); "Rock Around the Clock" (1954) fu il primo rock and roll al numero 1 Billboard. Il primo disco rock è dibattuto.
- Power chord: fondamentale + quinta (a volte con ottave), senza terza: né maggiore né minore. Con la distorsione suona più "coerente" (le frequenze generate restano vicine alle armoniche); si diffuse con Link Wray ("Rumble", 1958); riff in power chord in "You Really Got Me" (Kinks, 1964).
- Beat rock di base: cassa 1 e 3, rullante 2 e 4, hi-hat ottavi (OMT 7.2).
- Preset app Rock (120 BPM, Base): kick `x... .... x... ....`, rullante forte `.... x... .... x...`, charleston chiuso ottavi con battiti forti.
**Errori comuni**
- Distorsione troppo forte su accordi pieni: fangoso. Meglio due note (power chord) o quinte.
- Rullante debole: nel rock è il colpo più forte.
**Consigli per l'app**
- Strumento con suono distorto + Distorsione; nel piano roll suona solo fondamentale e quinta (es. Do e Sol); "Ritmo pronto" Rock.
**Fonti**: Rock music <https://en.wikipedia.org/wiki/Rock_music>; Power chord <https://en.wikipedia.org/wiki/Power_chord>; OMT 7.2.
**Note**: la pagina Rock dice che è "impossibile" dare una definizione musicale precisa. NON VERIFICATO: "90-160 BPM" (nessun BPM nella fonte) e "I, IV, V e bVII" (non letto). "Chitarre spesso distorte": la distorsione fu portata al successo da Chuck Berry a metà anni '50 (pagina).

## genere-disco | Disco (SCHEDA NUOVA PROPOSTA)
**Fatti in più**: nasce tra fine anni '60 e inizio '70 nella vita notturna di Philadelphia, Baltimora e New York (Brooklyn). Cassa su ogni battito, hi-hat aperto sibilante sui contrattempi, pattern di ottavi o sedicesimi, percussioni afro-latine e batterie elettroniche, suddivisione in sedicesimi. I brani si allungarono grazie ai dischi da 12 pollici (Tom Moulton). Nessun BPM nella pagina. Preset: usare "House" come punto di partenza (è simile come schema); non esiste ritmo pronto Disco. **Fonti**: Disco <https://en.wikipedia.org/wiki/Disco>; Four on the floor <https://en.wikipedia.org/wiki/Four_on_the_floor_(music)>.

## genere-funk | Funk (SCHEDA NUOVA PROPOSTA)
**Fatti in più**: nasce a metà anni '60 nelle comunità afroamericane; James Brown (Cold Sweat, 1967) è figura chiave; "the one": accento sul primo tempo della battuta più che sul backbeat; sedicesimi con ghost note, hi-hat in sedicesimi, cassa attutita; basso protagonista (ottavi o sedicesimi sincopati, ostinati); poche armonie: spesso un solo accordo o un vamp di due accordi (es. La minore - Re7), accordi estesi (9, 11, 13) e settime minori; modi dorico o misolidio. Nessun BPM nella pagina (dice solo "più lento della disco" e quella frase è segnata "citation needed"). App: usa Basso e ghost note sulla striscia "Intensità". **Fonti**: Funk <https://en.wikipedia.org/wiki/Funk>; Ghost note <https://en.wikipedia.org/wiki/Ghost_note>.

## genere-dnb | Drum and bass (SCHEDA NUOVA PROPOSTA)
**Fatti in più**: nasce nel Regno Unito all'inizio degli anni '90 dalla scena jungle e breakbeat hardcore; BPM 160-180 (introduzione della pagina 165-185; "dal 1996 circa soprattutto 170-180"); breakbeat famoso: l'Amen break (da "Amen, Brother" dei The Winstons); bassi profondi pensati per i sound system. L'app ha BPM da 40 a 240, quindi si può scrivere (170); le terzine e i break complessi non sono rappresentabili con precisione. Nessun ritmo pronto. **Fonti**: Drum and bass <https://en.wikipedia.org/wiki/Drum_and_bass>; Ghost note.

## genere-ambient | Ambient (SCHEDA NUOVA PROPOSTA)
**Fatti in più**: privilegia timbro e atmosfera rispetto a struttura e ritmo; di solito pacata, spesso senza beat o melodia strutturata, a strati; note lunghe o ripetute (stile drone); termine attribuito a Brian Eno (metà anni '70; "Ambient 1: Music for Airports", 1978; scrisse che deve essere "ignorabile quanto interessante"); usa sintetizzatori e loop; effetti come riverbero e delay (citati nella pagina in un contesto particolare). App: pad lunghi con rilascio lungo, Riverbero e Delay abbondanti, nessuna batteria. **Fonti**: Ambient music <https://en.wikipedia.org/wiki/Ambient_music>.

---

# Riepilogo (stesso testo della risposta finale)

- Schede coperte: 27 (11 ritmo, 8 forma, 8 generi) più 14 proposte di schede nuove.
- Errori/imprecisioni principali nelle schede attuali:
  - generi: "pop 3-4 minuti" (fonte 2,5-3,5); BPM techno 125-140 (fonte 120-150); BPM house 120-128 (fonte 115-130); BPM trap 130-150 (fonte 100-176, tipico 140); la scheda trap non è confermata sul "rullante sul 3" dalla pagina Trap (solo da Half-time); BPM di hip-hop, lo-fi, reggaeton, rock, pop NON VERIFICATI; house "voci soul/basso funky/sezioni 16-32" non verificati.
  - ritmo: "poliritmo-terzine" spiega solo le terzine; il consiglio "alternando gruppi irregolari" è vago (meglio 3+3+2); "backbeat" descritto come schema di cassa+rullante (in senso stretto è solo l'accento 2-4); groove con "micro-spostamenti" è controverso; "off-beat" ha due significati.
  - forma: "ponte: parte da IV o vi" non verificato (vale solo la regola "evita la tonica, finisce sulla dominante" per AABA); "build-up 8 o 16 battute", "filtro si apre", "cassa sparisce" non sono nella fonte; Arrangement: la fonte ha un'altra definizione; "4, 8, 16 battute quasi sempre": Phrase dice solo 4.
  - app: il ritmo pronto Trap usa la cassa normale, non la 808.
