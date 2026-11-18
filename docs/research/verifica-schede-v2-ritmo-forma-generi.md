# Verifica schede v2: ritmo, forma, generi

Schede controllate: 38 (14 in `ritmo.md`, 12 in `forma.md`, 12 in `generi.md`). Le schede non elencate sotto non hanno problemi trovati.

## Riepilogo

- Schede con almeno un problema: 17 su 38. Schede con errori veri: 3 (`ritmo`, `rullante-clap`, `hook`). Il resto sono imprecisioni o stile.
- Tutte le griglie di batteria sono corrette e coerenti con il testo: tresillo 3+3+2 (posizioni 0, 3, 6), rullante half-time sul 3 (posizione 8), double-time (rullante sul levare di ogni battito: è il backbeat a velocità doppia), cassa dritta, dembow (rullante sulle posizioni 3 e 6, cioè le ultime due note del tresillo). Le griglie dei ritmi pronti (Pop, Hip-hop, Lo-fi, House, Techno, Reggaeton, Rock, Trap) coincidono con `src/project/rhythms/genres.ts`. Le intensità citate (ghost 35%, leggero 50%) coincidono con `V` in `build.ts`.
- Esempi inventati (funk, drum and bass, disco): plausibili e coerenti con le fonti. Il drum and bass è lo schema classico "two-step": cassa su 1 e sul levare del 3, rullante su 2 e 4. Il funk ha cassa sincopata, ghost note e charleston a sedicesimi (le fonti confermano ghost note e sedicesimi). Il disco ha charleston aperto in levare e sedicesimi (confermati da Wikipedia Disco).
- Fatti e BPM: corretti rispetto alle fonti che ho aperto. Confermati: house 115-130 (e 120-130), techno 120-150, drum and bass 160-180 (170-180 dal 1996), trap 50-88 sentiti (100-176), origini di house, techno, disco, reggaeton, drum and bass, rock; Belleville Three, Knuckles, Amen break, Eno e Music for Airports, AABA e "I Want to Hold Your Hand", pre-ritornello La minore + Re7, 8-24 battute e 2-4 frasi (OMT 7.04), hook radio di 8-12 battute, "breakout chorus", rapporti di swing 1:1/2:1/3:1. I BPM non verificati (boom bap, lo-fi, reggaeton, funk, disco, rock) sono già presentati come indicativi o come "non dati dalle fonti": va bene.
- Funzioni citate nell'app: esistono tutte, con due eccezioni (vedi `ritmo` e `rullante-clap`). Verificati: "Ritmo pronto" (Base/Ricco), "+ Aggiungi suono" con i suoni citati, "Duplica", "Ripeti parte", "Intensità", "Blocca sulla scala", frecce sul piano roll (sinistra = 1 sedicesimo, Shift+su = ottava), pattern da 1 a 8 battute, 128 battute, BPM 40-240, modello "Lo-fi tranquillo", tutti i suoni pronti nominati e gli effetti (Riverbero, Delay, Filtro, Equalizzatore, Distorsione).
- Fonti: ho aperto Wikipedia (Trap, Hook, House, Disco, Drum and bass, Song structure, Ghost note, Swing time, Tresillo, Dembow, Half-time, Reggaeton, Lofi hip-hop, Rock, Boom bap, Funk, Techno, Verse-chorus form) e OMT 7.01, 7.02, 7.04, 7.05. Tutte esistono. Non ho riaperto le altre (Tuplet, Fill, Crash, Ride, Phrase, ecc.).
- Contraddizione tra schede: `cassa` consiglia di far partire il basso insieme alla cassa, mentre `backbeat-four-on-floor`, `genere-house` e `genere-disco` lo indicano come errore.

## Schede con problemi

### ritmo
1. Gravità: errore (riferimento all'app).
   - Frase: "Con il tasto "Assolo" del mixer ascolti uno strumento alla volta".
   - Perché: nel mixer i tasti sono "M" (titolo "Muto") e "S" (titolo "Solo"); "Assolo" non compare nell'interfaccia (solo in `featureList`).
   - Correzione: "Con il tasto "S" (Solo) del mixer ascolti una traccia alla volta".
2. Gravità: impreciso (non verificato).
   - Frase: "Un ritmo ripetuto si ricorda meglio se anche la melodia sopra ripete un profilo simile".
   - Perché: nessuna delle fonti indicate lo afferma.
   - Correzione: sostituire con "La ripetizione aiuta l'orecchio a orientarsi: un ritmo che torna uguale si riconosce subito."

### groove
- Gravità: impreciso.
  - Frase: "la cassa ha un colpo in più subito dopo il terzo battito".
  - Perché: nella griglia (`x... .... x.x. ....`) il colpo extra è alla posizione 10, cioè a metà del terzo battito (due sedicesimi dopo), non "subito dopo".
  - Correzione: "la cassa ha un colpo in più a metà del terzo battito".

### cassa
- Gravità: impreciso (contraddizione con altre schede).
  - Frase: "Due soluzioni: accorciare le note del basso, oppure farle partire esattamente insieme alla cassa."
  - Perché: `backbeat-four-on-floor`, `genere-house` e `genere-disco` dicono invece che basso e cassa insieme sul battito sono un errore.
  - Correzione: "Due soluzioni: accorciare le note del basso, oppure metterle nei vuoti tra un colpo di cassa e l'altro."

### rullante-clap
- Gravità: errore (riferimento all'app).
  - Frase: "prova "Battimani", "Rimshot" o "Snap" al posto del "Rullante" (li trovi in "+ Aggiungi suono")".
  - Perché: "Battimani" è uno dei 5 suoni di base già presenti nella griglia (`BASE_DRUM_VOICES`); solo Rimshot e Snap stanno in "+ Aggiungi suono".
  - Correzione: "prova il "Battimani" (già nella griglia) oppure "Rimshot" o "Snap" (li trovi in "+ Aggiungi suono") al posto del "Rullante"."

### backbeat-four-on-floor
- Gravità: impreciso (contraddizione con `cassa`, vedi sopra).
  - Frase: "Un errore comune con la cassa dritta è far suonare il basso sempre insieme alla cassa: meglio metterlo nei vuoti tra un colpo e l'altro."
  - Perché: è un consiglio di gusto, non un errore; va attenuato.
  - Correzione: "Un consiglio con la cassa dritta: se il basso suona sempre insieme alla cassa, i bassi si impastano; provalo anche nei vuoti tra un colpo e l'altro."

### sincope
- Gravità: impreciso.
  - Frase: "nel pop e nel rock una nota della melodia arriva spesso un sedicesimo prima del battito: è un anticipo".
  - Perché: OMT 7.01 parla di sincope come spostamento anticipato di metà del valore delle note (un ottavo su note da quarto); "un sedicesimo" non è confermato.
  - Correzione: "nel pop e nel rock una nota della melodia arriva spesso un po' prima del battito (un ottavo o un sedicesimo): è un anticipo."

### ghost-note
- Gravità: stile.
  - Frase: "arrivano poco prima o poco dopo i colpi principali".
  - Perché: nella griglia entrambe le ghost note (posizioni 3 e 10) cadono prima del rullante principale (4 e 12).
  - Correzione: "arrivano poco prima dei colpi principali del rullante e danno una sensazione di sedicesimi attorno al backbeat, senza coprirlo."

### half-time-double-time
- Gravità: stile.
  - Frase: "Double-time (rullante su ogni metà battito, charleston a sedicesimi)".
  - Perché: "ogni metà battito" fa pensare a 8 colpi; la griglia ha 4 colpi, sul levare di ogni battito.
  - Correzione: "Double-time (rullante sul levare di ogni battito, cioè 4 colpi per battuta invece di 2; charleston a sedicesimi)".

### tresillo-dembow e genere-reggaeton
- Gravità: impreciso (stessa frase in entrambe).
  - Frase: "il rullante segue la seconda parte del tresillo" (tresillo-dembow); "il rullante segue la seconda metà del tresillo" (genere-reggaeton).
  - Perché: OMT 7.02 dice che il rullante suona le ultime due note del tresillo (3+3+2): posizioni 3 e 6, che sono la seconda e la terza nota.
  - Correzione: "il rullante suona le ultime due note del tresillo e cade nei contrattempi."

### strofa-ritornello
- Gravità: impreciso.
  - Frase: "un breve post-ritornello che chiude il giro".
  - Perché: Wikipedia (Song structure) lo descrive come una sezione che mantiene o aumenta l'energia e contiene un gancio melodico, non come una chiusura.
  - Correzione: "un breve post-ritornello, che mantiene l'energia del ritornello con un'idea ripetuta".
- Gravità: stile.
  - Frase: "Il ritornello è la parte che torna uguale".
  - Correzione: "Il ritornello è la parte che torna, di solito con la stessa musica e le stesse parole."

### pre-ritornello
- Gravità: impreciso.
  - Frase: "Chiude il giro senza annunciare la sezione successiva: è come una coda del ritornello, spesso con un'idea ripetuta o solo strumentale."
  - Perché: la fonte dice che mantiene o aumenta l'energia e contiene un gancio melodico; "solo strumentale" non è confermato.
  - Correzione: "È una breve sezione dopo il ritornello che ne mantiene l'energia, di solito con un gancio melodico, spesso ripetendo l'idea del ritornello."

### hook
- Gravità: errore.
  - Frase: "in "Be My Baby" l'hook è il giro di accordi I-vi-IV-V del ritornello".
  - Perché: Wikipedia dice che l'hook è la frase del titolo cantata sopra il giro I-vi-IV-V; il giro da solo non è l'hook.
  - Correzione: "in "Be My Baby" l'hook è la frase del titolo cantata sopra un giro di accordi semplicissimo (I-vi-IV-V)."

### genere-hiphop
- Gravità: impreciso.
  - Frase: "È un loop in 4/4 con la cassa su 1 e 3 e il rullante su 2 e 4" seguita dal ritmo pronto "Hip-hop" con cassa `x... ...x ..x. ....`.
  - Perché: il ritmo pronto è etichettato "Boom bap" ma la cassa non cade sul 3: i colpi sono alle posizioni 0, 7 e 10 (il 10 è a metà del 3).
  - Correzione: aggiungere dopo la griglia: "Nel ritmo pronto la cassa non cade proprio sul 3 ma a metà del 3: è una versione sincopata del boom bap classico."

### genere-house e genere-disco
- Gravità: impreciso (contraddizione con `cassa`).
  - Frase (house): "Un errore comune nella house è far suonare il basso sul battito, insieme alla cassa e a tutto volume".
  - Frase (disco): "Un errore comune nella disco è un basso fermo sul battito insieme alla cassa".
  - Perché: il testo di `cassa` suggerisce di farli partire insieme; in disco le fonti non dicono nulla sul basso ("a orecchio").
  - Correzione: uniformare a `cassa` (basso nei vuoti oppure note corte) e togliere "errore comune" dove è solo un gusto personale.

### genere-dnb
- Gravità: impreciso (non verificato).
  - Frase: "A questa velocità il rullante sul 2 e sul 4 sembra già frenetico."
  - Perché: Wikipedia (Drum and bass) non lo dice; con la griglia proposta, a 170 BPM il rullante cade come un backbeat a circa 85 BPM (ma non c'è una fonte).
  - Correzione: "A 170 BPM anche un semplice rullante sul 2 e sul 4 suona già molto veloce."

## Note sulla gravità

- Errore: `ritmo` (Assolo), `rullante-clap` (Battimani), `hook` (Be My Baby).
- Impreciso: `ritmo`, `groove`, `cassa`, `backbeat-four-on-floor`, `sincope`, `tresillo-dembow`, `genere-reggaeton`, `strofa-ritornello`, `pre-ritornello`, `genere-hiphop`, `genere-house`, `genere-disco`, `genere-dnb`.
- Solo stile: `ghost-note`, `half-time-double-time`.
- Non verificate al 100%: il "rullante sul 3 di solito nella trap" (la fonte Half-time non nomina la trap; è comunque pratica diffusa); "shuffle tipico di blues, boogie-woogie e rock and roll" (non ritrovato nelle pagine aperte).
