# Verifica schede v2: basi, armonia, melodia (49 schede)

Data: 2026-11-18. Controllate: knowledge/cards/basi.md (19), armonia.md (20), melodia.md (10). Nessun file di knowledge/cards è stato modificato.

## Riepilogo

- **Fatti musicali: nessun errore.** Ho ricalcolato ogni triade, settima, scala, rivolto, intervallo, conteggio di semitoni, i giri (Do Sol Lam Fa, Lam Fa Do Sol, blues a 12 battute, andaluso, ii-V-I), le note in comune tra accordi, il circolo delle quinte e i modi: tutto corretto. In La minore il Fa è sempre maggiore (Fa La Do), mai presentato come minore.
- **Fonti:** tutti gli URL indicati esistono (verificati con WebFetch: 14 pagine Open Music Theory, 3 pagine it.wikipedia, le pagine en.wikipedia dubbie; "Melodic contour" è un redirect a "Melodic motion", valido). Confermate dalle fonti: bambini di 3 anni e maggiore/minore, tempo "most important" nelle emozioni, termini di velocità, arpeggio (min. 3 note; due note = trillo/tremolo), "undulating and descending more common" (Nettl), basso "un'ottava e mezza sotto il Do centrale", controcanto ai tromboni/corni, diabolus in musica (leggenda del divieto: "likely fanciful"), ritardo vs sospensione, prestiti in Do maggiore, truck driver's gear change.
- **Funzioni dell'app citate:** esistono (tasti A-K/W E T Y U O P, Z/X ottave 1-7, Shift+frecce, Blocca/Adatta alla scala, Ripeti parte/blocco, Ctrl+A/C/X/V/D, striscia intensità per note e batteria, BPM nella barra, metronomo, 4 scale + nessuna, riconoscimento accordi 3+ note con rivolti, note in comune nel riassunto, nota più grave/acuta, categoria Bassi, Delay (eco)). Un problema vero sull'uso di Ctrl+D (sotto).
- **Schede con errori veri (4):** `melodia-passo-passo`, `giro-di-accordi`, `giri-con-nomi`, `domanda-risposta`.
- **Schede solo imprecise (8):** `melodia`, `accordi-presi-in-prestito`, `modulazione`, `battito-battuta`, `suddivisione`, `tempo-bpm`, `tonalita`, `intervallo`.
- **Stile trasversale** (vedi in fondo): "Si dim" nelle schede vs "Sidim" dell'app; "Sol♯" vs "Sol#" nelle sezioni "Nell'app".

---

## melodia-passo-passo — gravità: errore

**Frase 1** (Passi 4-5): "Chiudi la melodia sulla tonica, il La, possibilmente con una nota lunga sopra Lam: suona conclusa."
Perché: l'esempio è un pattern di 4 battute Lam Fa Do Sol, un accordo per battuta. Lam suona solo nella battuta 1: alla fine del pattern c'è Sol, e il La sopra Sol è una nona che stride (contraddice la scheda `note-accordo`).
Correzione: "Per un finale che suoni concluso, arriva sul La (la tonica) con una nota lunga mentre suona Lam. Nel giro Lam Fa Do Sol, Lam c'è solo nella prima battuta: per chiudere in modo netto aggiungi una quinta battuta con Lam (pattern da 5 battute), oppure lascia che la chiusura arrivi alla ripartenza del giro, quando la melodia ricomincia sul La."

**Frase 2** (Passi 6-7): "la prima è la "domanda" e finisce sospesa, per esempio su Sol o su Mi; la seconda è la "risposta" e finisce sul La."
Perché: con due frasi da due battute la domanda finisce nella battuta 2, sull'accordo di Fa (Fa La Do): Sol (nona) e soprattutto Mi (a un semitono dal Fa) sono note estranee che stridono. La risposta finisce nella battuta 4, su Sol, dove il La non è dell'accordo.
Correzione: "6. Fai due frasi di due battute. La prima (Lam, Fa) è la "domanda" e finisce in sospeso su una nota dell'accordo di Fa, per esempio il Do o il La. La seconda (Do, Sol) è la "risposta" e si ferma su una nota dell'accordo di Sol (Sol, Si o Re): la chiusura piena arriva quando il giro riparte su Lam."

## giro-di-accordi — gravità: errore (funzione dell'app)

**Frase:** "In Music Studio scrivi un pattern di 4 battute con un accordo per battuta, poi duplicalo con Ctrl+D e ritocca la copia."
Perché: Ctrl+D copia le note selezionate e le incolla subito dopo l'ultima nota selezionata (`duplicateSelectedNotes` / `pasteNotes`). `insertNotes` scarta le note che cadono oltre la lunghezza del pattern: in un pattern di 4 battute pieno la copia non entra e non succede nulla.
Correzione: "In Music Studio scrivi un pattern di 4 battute con un accordo per battuta; per provare una variante copia il pattern e ritocca la copia. (Ctrl+D incolla le note subito dopo l'ultima: dentro un pattern di 4 battute pieno la copia non entra, servirebbe un pattern di 8 battute.)"

## giri-con-nomi — gravità: errore (funzione dell'app)

**Frase:** "Disegna il giro in un pattern di 4 battute, ascoltalo con "Ripeti parte" e usa Ctrl+D per duplicare le note e provare una variante."
Perché: stesso problema di `giro-di-accordi`.
Correzione: "Disegna il giro in un pattern di 4 battute e ascoltalo con "Ripeti parte". Per provare una variante copia il pattern e cambia un accordo nella copia (Ctrl+D non basta: in un pattern di 4 battute pieno la copia non entra)."

## domanda-risposta — gravità: errore (funzione dell'app)

**Frase:** "In Music Studio scrivi la domanda in 4 battute, duplicala con Ctrl+D e cambia l'ultima parte per farne la risposta."
Perché: la copia va dopo le 4 battute: il pattern deve essere lungo almeno 8 battute (il massimo), altrimenti la copia viene scartata.
Correzione: "In Music Studio crea un pattern di 8 battute, scrivi la domanda nelle prime 4, selezionala con Ctrl+A e premi Ctrl+D: la copia finisce nelle battute 5-8, dove cambi la parte finale per farne la risposta."

## melodia — gravità: impreciso

**Frase 1:** "Per finire, una nota La lunga sopra Lam suona conclusa." (nell'esempio Lam Fa Do Sol, un accordo per battuta)
Perché: stesso problema di `melodia-passo-passo`: Lam è solo nella battuta 1.
Correzione: "Una nota La lunga sopra Lam suona conclusa: nel giro Lam Fa Do Sol succede nella prima battuta, cioè alla ripartenza del giro."

**Frase 2** (Nell'app): ""Ripeti parte" fa ascoltare in loop 2-4 battute mentre si corregge la melodia."
Perché: la parte si sceglie liberamente (trascinando i bordi); di default sono le battute del blocco selezionato oppure 4 battute dalla posizione di partenza.
Correzione: ""Ripeti parte" fa ascoltare in loop le battute che scegli (di solito il blocco selezionato) mentre si corregge la melodia."

## accordi-presi-in-prestito — gravità: impreciso

**Frase:** "il Mi maggiore (Mi Sol♯ Si) è di fatto un accordo preso dalla parallela maggiore, così comune da essere considerato normale."
Perché: il Mi maggiore in La minore è il V della minore armonica (lo dice la scheda `minore-armonica-melodica`); la pagina Borrowed chord cita come prestito la terza piccarda ma non il V maggiore in minore. Le due schede si contraddicono.
Correzione: "In La minore succede l'opposto: il Mi maggiore (Mi Sol♯ Si) ha una nota fuori dalla scala naturale (il Sol♯), ma è così comune che lo si considera normale: è il V della minore armonica (vedi la scheda sulle tre scale minori)."

## modulazione — gravità: impreciso (non verificato)

**Frase:** "Modulare verso la dominante tende ad aumentare la tensione, verso la sottodominante a calarla."
Perché: la pagina Modulation (Wikipedia) dice solo che dominante e sottodominante sono le mete più semplici perché adiacenti nel circolo delle quinte (e la dominante è la più frequente); non parla di aumento/calo di tensione.
Correzione: "Modulare verso la dominante o la sottodominante è relativamente semplice, perché sono tonalità adiacenti nel circolo delle quinte. Si dice spesso che la dominante dia più energia e la sottodominante più calma: è un'impressione diffusa, non verificata."

**Frase 2** (Nell'app): "Ripeti in ogni pattern di strumento (la batteria no)."
Perché: esiste anche la traccia Percussione (un suono di batteria intonato con le note): spostarne le note ne cambia l'intonazione, quindi anche lì non va trasposta.
Correzione: "Ripeti in ogni pattern di strumento (la batteria e le tracce Percussione no)." Stessa modifica nella scheda `tonalita` (sezione "Errori comuni").

## battito-battuta — gravità: impreciso

**Frase 1:** "Una nota che arriva prima del primo battito per lanciarlo si chiama levare (o anacrusi)."
Perché: "anacrusi" è il termine per le note che precedono il primo battito; "levare" in italiano indica di solito la parte debole di un battito (il "+" di "1 e 2 e"), opposto a "battere". Non verificato nelle fonti indicate.
Correzione: "Una nota (o un gruppo di note) che arriva prima del primo battito per lanciarlo si chiama anacrusi. Il «battere» è il momento in cui il piede va giù, il «levare» quello in cui risale (la parte debole del battito)."

**Frase 2:** "Per contare anche le suddivisioni si usa "1 e & a 2 e & a…", dove "&" si legge "and"."
Perché: vedi `suddivisione`: lì gli ottavi si contano "1 e 2 e", e la "e" ha un altro significato.
Correzione: "Per contare anche le suddivisioni: ottavi "1 & 2 & 3 & 4 &", sedicesimi "1 e & a 2 e & a…", dove "&" si legge "and" (o "e")."

## suddivisione — gravità: impreciso

**Frase:** "Per gli ottavi si aggiunge "e" a metà di ogni battito: "1 e 2 e 3 e 4 e". Per i sedicesimi si usa "1 e & a 2 e & a…", dove "&" si legge "and""
Perché: la stessa posizione (metà battito) è scritta "e" negli ottavi e "&" nei sedicesimi: per un principiante è ambiguo.
Correzione: "Per gli ottavi si aggiunge "&" (si dice "e" o "and") a metà di ogni battito: "1 & 2 & 3 & 4 &". Per i sedicesimi si dice "1 e & a 2 e & a…": ogni battito diventa quattro sillabe e il "&" resta a metà battito."

## tempo-bpm — gravità: impreciso

**Frase 1:** "Velocità per genere (indicativa): hip-hop circa 70–100 (il lo-fi spesso 70–90), pop 90–130, house 120–128, techno 125–140, trap 130–150 … drum and bass circa 170."
Perché: le fonti indicate (Tempo, Music and emotion) non contengono intervalli per genere; sono valori correnti ma non verificati. La scheda li dice già "indicativi".
Correzione: aggiungere in coda alla frase introduttiva: "Questi intervalli sono ordini di grandezza diffusi tra i produttori, non presi da una fonte precisa."

**Frase 2:** "Largo circa 40–66 BPM, Adagio 44–66, Andante 56–108"
Perché: i valori coincidono con la pagina Wikipedia Tempo, ma altre fonti danno Adagio più veloce (circa 66–76) e Largo circa 40–60: gli intervalli si sovrappongono.
Correzione: "Valori indicativi, molto variabili e diversi da fonte a fonte (i termini si sovrappongono): Largo circa 40–66 BPM, Adagio 44–66, …"

## tonalita — gravità: impreciso

**Frase:** "tutte le tracce di strumento vanno spostate insieme (la batteria no)."
Perché: vedi `modulazione`: anche le tracce Percussione vanno escluse.
Correzione: "tutte le tracce di strumento vanno spostate insieme (la batteria e le tracce Percussione no)."

## intervallo — gravità: stile

**Frase:** "Gli intervalli che suonano riposanti si dicono consonanti: unisono, ottava, quinte e quarte giuste, terze e seste."
Perché: elenca la quarta giusta tra i consonanti e poche righe dopo la dichiara ambigua; la scheda `intervalli-in-semitoni` la tratta come ambigua.
Correzione: "…si dicono consonanti: unisono, ottava, quinta giusta, terze e seste (la quarta giusta è un caso ambiguo)."

---

## Note trasversali (stile)

1. **"Si dim" vs "Sidim".** L'app e il riassunto del progetto scrivono "Sidim" e "Sim7b5". Quasi tutte le schede usano "Si dim" (scala-maggiore, scala-minore, accordi-della-scala, accordi-do-maggiore-la-minore, funzioni-armoniche, gradi-sensibile-tritono, tensione-risoluzione, diminuito-aumentato...) e solo alcune dicono che l'app scrive "Sidim". L'assistente potrebbe rispondere "Si dim" mentre l'utente vede "Sidim". Proposta: dopo la prima comparsa in ogni scheda aggiungere "(nell'app: Sidim)", oppure scrivere ovunque "Sidim".
2. **Diesis nelle sezioni "Nell'app".** L'app scrive solo diesis (Do#, Sol#, La#, Re#). Le sezioni "Nell'app" di scala-minore, minore-armonica-melodica, accordi-do-maggiore-la-minore, giri-con-nomi, giro-di-accordi, diminuito-aumentato usano "Sol♯": meglio "Sol#" dove si parla di cosa vede l'utente.
3. **Scheda `nota`.** Aggiungere in "Nell'app": "L'app scrive i tasti neri sempre con il diesis: il Si♭ appare come La#, il Mi♭ come Re#." (oggi lo dice solo `accordi-presi-in-prestito`).
4. **Struttura.** `intervalli-in-semitoni`, `colori-accordi` non hanno la sezione "### Nell'app" (le altre sì): non è un errore, ma è incoerente.
5. **`settima`:** "tipici di jazz, soul e di generi moderni come il lo-fi" è plausibile ma la fonte (Seventh chord) non cita il lo-fi: non verificato, gravità minima.
