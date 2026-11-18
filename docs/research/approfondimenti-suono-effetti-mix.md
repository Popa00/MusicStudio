# Approfondimenti per le schede: suono, effetti, mix

Data: 2026-11-17. Aree coperte: `suono.md` (9 schede), `effetti.md` (7), `mix.md` (6) = 22 schede, più 4 schede nuove proposte in fondo. Le schede in `knowledge/cards` NON sono state modificate.

Come leggere: per ogni scheda ci sono "Più dettagli" (fatti da aggiungere), "Errori comuni", "Nell'app" (solo funzioni che esistono), "Fonti" (URL controllati con WebFetch: la pagina esiste e dice quello che è scritto) e, se serve, "Correzioni".
Etichette: **[F]** = verificato su una delle fonti elencate; **[P]** = pratica comune di produzione, NON scritta nelle fonti ammesse (usare come "punto di partenza indicativo"); **[C]** = verificato leggendo il codice dell'app, non il web.

## Cosa fa davvero l'app (dal codice, utile a tutte le schede)

- Suono dello Strumento: una forma d'onda (sine/triangle/sawtooth/square) + un solo filtro passa-basso per traccia, pendenza 12 dB per ottava (`synthOptions.ts`) + inviluppo ADSR. Fino a 16 note insieme. Nomi sull'interfaccia: Brillantezza (il taglio, 50-18000 Hz), Attacco 0,001-4 s, Rilascio 0,01-8 s, Decadimento 0,01-4 s, Sostegno 0-100%, Risonanza 0,1-15. Nelle schede si dice "Filtro" ma sul pannello c'è scritto "Brillantezza": nominarla così.
- Effetti per traccia: massimo 6, si possono riordinare (su/giù) e accendere/spegnere. Riverbero: Durata 0,2-10 s (di default 2,5 s) e Quantità (30%). Delay: Tempo (solo quarto, ottavo, ottavo puntato, sedicesimo), Ripetizioni 0-85% (35%), Quantità (25%). Filtro: passa-basso o passa-alto, Frequenza 20-20000 Hz (2000), Risonanza 0,1-15 (1). Equalizzatore: Bassi/Medi/Acuti da -24 a +12 dB (0). Distorsione: Intensità (30%), Quantità (50%).
- Nel riverbero, nel delay e nella distorsione "Quantità" è un mescolatore: a 0% si sente solo il suono originale, a 100% non si sente più l'originale, solo l'effetto [C: `dry = 1 - wet`].
- Il riverbero dell'app: Durata = tempo in cui la coda scende di 60 dB (come l'RT60 di Wikipedia) [C]; toglie da sé i bassi sotto circa 150 Hz e smorza gli acuti sopra circa 5 kHz, quindi è "scuro" e non gonfia i bassi [C].
- Equalizzatore: i tre controlli lavorano su Bassi sotto 400 Hz, Medi 400-2500 Hz, Acuti sopra 2500 Hz (valori predefiniti della libreria Tone.js, l'app non li cambia) [C].
- Mixer: volume traccia e master da -60 a +6 dB; pan da -1 a +1 con legge "a potenza costante" (al centro ogni lato è a -3 dB) [C]; muto e solo (il solo silenzia le altre tracce) [C]. Master: volume, limiter (soglia -1 dB, senza anticipo) e poi un clipper che taglia netto i picchi rimasti [C: `master.ts`].
- NON ci sono: compressore, sidechain, mandate (send/bus), automazioni, chorus/flanger/phaser, ping-pong, interruttore mono. Su una traccia Batteria gli effetti valgono per tutta la batteria; per dare riverbero solo al rullante serve una traccia "Percussione singola" con quel suono.

---

# SUONO

## timbro | Timbro
**Più dettagli**
- Il timbro dipende soprattutto dallo spettro (quali armonici ci sono e quanto forti) ma anche dall'inviluppo e dall'attacco della nota [F]. Togliendo l'attacco a un pianoforte o a una tromba diventa più difficile riconoscere lo strumento [F].
- Gli armonici sono multipli interi della frequenza base: se la nota è 100 Hz, ci sono anche 200, 300, 400 Hz... [F: la pagina usa 50 Hz come esempio]. Campane e piatti hanno parziali "inarmonici" (non multipli interi), per questo il loro suono è meno "intonato" [F].
- "Brillante" = tanta energia sulle frequenze alte; "scuro/ovattato" = poca. È una delle differenze che l'orecchio nota di più [F].
- Per descrivere un suono i musicisti usano parole come caldo, aspro, brillante, scuro [F: Timbre elenca bright, dark, warm, harsh].
**Errori comuni**: pensare che per cambiare timbro serva cambiare nota o volume (non cambiano il timbro); scegliere tre suoni molto simili per tutte le parti, così il brano suona piatto (poca differenza di timbro tra le parti).
**Nell'app**: provare lo stesso accordo con "Piano elettrico" (morbido) e con "Fiati synth" (squillante) per sentire la differenza di timbro; poi girare "Brillantezza" per scurire o schiarire lo stesso suono.
**Fonti**: https://en.wikipedia.org/wiki/Timbre ; https://en.wikipedia.org/wiki/Harmonic
**Correzioni**: nessun errore. Il testo dice "dipende dagli armonici e da come il suono nasce e si spegne": giusto.

## sintetizzatore | Sintetizzatore
**Più dettagli**
- Nella sintesi sottrattiva si parte da un'onda ricca di armonici e si "toglie" con un filtro; poi un inviluppo comanda il volume [F]. Per questo si usano onde ricche (dente di sega, quadra) e non solo la sinusoide, che non avrebbe niente da togliere [F: serve materiale con armonici].
- Un sintetizzatore può essere monofonico (una nota alla volta, tipico di bassi e melodie solisti) o polifonico (più note insieme, per accordi) [F]. Lo "Strumento" dell'app è polifonico (fino a 16 note insieme [C]).
- I "suoni pronti" si chiamano preset o patch: sono impostazioni salvate delle manopole [F: la pagina parla di patch memory e preset].
- Esistono altri tipi di sintesi che l'app NON ha: additiva (somma di sinusoidi), FM (suono più "vitreo/metallico"), wavetable, campionamento [F].
**Errori comuni**: pensare che il synth "contenga" suoni registrati (qui il suono è calcolato); toccare tutte le manopole insieme: meglio cambiarne una alla volta.
**Nell'app**: partire da un suono pronto simile a quello che si cerca e ritoccare solo Brillantezza e Attacco.
**Fonti**: https://en.wikipedia.org/wiki/Synthesizer ; https://en.wikipedia.org/wiki/Subtractive_synthesis
**Correzioni**: nessun errore. Nota: la scheda dice "è lo schema dell'app" ma non cita il volume finale (l'amplificatore): è incluso nell'inviluppo, ok.

## forme-onda | Forme d'onda
**Più dettagli**
- Sinusoidale: una sola frequenza, niente armonici, suono "puro" [F: Sine wave].
- Triangolare: solo armonici dispari che si indeboliscono rapidamente (calo di 12 dB per ottava), quindi poco brillante [F: Triangle wave, Waveform]. Il confronto con il flauto è un'analogia comune, non scritta nelle fonti [P].
- Quadra: solo armonici dispari, che calano più lentamente (6 dB per ottava): suono "vuoto" (hollow) [F: Square wave (waveform)]. Il clarinetto produce armonici dispari simili a quelli di un'onda quadra [F].
- Dente di sega: armonici pari e dispari, calo di 6 dB per ottava; suono "aspro e chiaro", molto usata nella sintesi sottrattiva e adatta a imitare gli archi (violino, violoncello) [F: Sawtooth wave].
- Onda pulse: se la quadra viene "stretta" (duty cycle diverso dal 50%) diventa più sottile e nasale [F: Pulse wave]. L'app non ha questa regolazione, ma il suono "Chiptune" è una quadra.
- Nei chip dei videogiochi anni '80 si usavano proprio onde quadre/pulse, triangolari e rumore [F: Chiptune].
**Errori comuni**: scegliere la dente di sega per un sub basso (troppi armonici, "sporca" i medi: meglio sinusoidale); usare la sinusoidale per una melodia che deve emergere (resta molle).
**Nell'app**: se un suono è "troppo graffiante", prima abbassare Brillantezza, poi provare una forma più morbida (triangolare). Regola pratica [P]: sub basso = sinusoidale; basso che si senta ovunque = dente di sega filtrato.
**Fonti**: https://en.wikipedia.org/wiki/Waveform ; https://en.wikipedia.org/wiki/Sawtooth_wave ; https://en.wikipedia.org/wiki/Square_wave_(waveform) ; https://en.wikipedia.org/wiki/Triangle_wave ; https://en.wikipedia.org/wiki/Sine_wave ; https://en.wikipedia.org/wiki/Pulse_wave
**Correzioni**: **ERRORE nell'URL**: `https://en.wikipedia.org/wiki/Square_wave` è una pagina di disambiguazione (rimanda a "cross seas"); la voce giusta è `https://en.wikipedia.org/wiki/Square_wave_(waveform)`. Inoltre "tipico degli organi" per la quadra non è confermato dalle fonti (è vero che il preset "Organo" dell'app usa una quadra, ma non è una regola generale): meglio "ricorda i fiati ad ancia come il clarinetto".

## inviluppo | Inviluppo (attacco, decadimento, sostegno, rilascio)
**Più dettagli**
- L'inviluppo può controllare il volume, ma anche il filtro o l'intonazione [F: Envelope (music)]; nell'app agisce solo sul volume [C].
- Il pianoforte è l'esempio classico: colpo quasi immediato, poi il suono cala piano piano finché si spegne, anche tenendo il tasto [F].
- Sostegno è un LIVELLO (0-100%), le altre tre sono TEMPI. Con Sostegno a 0% la nota si spegne da sola dopo il decadimento, anche se la nota disegnata è lunga [F + hint dell'app].
- Attacco molto corto (sotto circa 10 ms) = colpo secco, quasi "click"; attacco di mezzo secondo o più = nota che "sale" come un archetto [P].
- Il rilascio lungo fa continuare la nota dopo il suo fine: con note molto vicine e rilascio lungo si accavallano e il suono diventa confuso/impastato [P].
**Errori comuni**: attacco lungo su un basso o una cassa (le note perdono ritmo e "arrivano in ritardo"); rilascio molto lungo su melodie veloci; sostegno a 0% e poi chiedersi perché le note lunghe si spengono.
**Nell'app**: ritmo secco = Attacco corto + Rilascio breve; tappeto = Attacco e Rilascio lunghi. Il preset "Pad atmosferico" ha attacco 0,8 s e rilascio 2,5 s [C].
**Fonti**: https://en.wikipedia.org/wiki/Envelope_(music) ; https://en.wikipedia.org/wiki/Timbre
**Correzioni**: nessun errore. Le fasi sono descritte bene.

## filtro-synth | Filtro e risonanza
**Più dettagli**
- Il passa-basso lascia passare le frequenze sotto il taglio; alla frequenza di taglio il suono è già calato di 3 dB (metà potenza) e poi cala via via [F: Low-pass filter]. La pendenza dello Strumento dell'app è di 12 dB per ottava [C]: il taglio è dolce, non netto. Nei filtri dei synth la pendenza può essere 6, 12, 18 o 24 dB per ottava [F: Voltage-controlled filter].
- La risonanza crea un picco proprio alla frequenza di taglio (nei filtri storici con un "ritorno" del segnale); più è alta, più il picco è stretto e acuto [F: VCF e Q factor]. Alcuni filtri con molta risonanza possono arrivare a "suonare da soli" come una sinusoide [F].
- Il taglio di solito si muove nel tempo (con inviluppo o LFO): il classico "wow" di un suono che si apre [F: VCF dice che può essere guidato da un inviluppo]. L'app NON ha questo movimento automatico (nessuna automazione): il taglio resta fisso.
- Il suono "acid" nasce dal Roland TB-303: oscillatore dente di sega o quadra, filtro passa-basso risonante a 24 dB/ottava; il gruppo Phuture con "Acid Tracks" (1987) è citato come primo brano acid house [F: Roland TB-303].
**Errori comuni**: Brillantezza troppo bassa su un lead (sparisce nel mix); Risonanza alta e Brillantezza bassa insieme su basso: il picco è molto forte (nel motore del browser la risonanza del passa-basso è espressa in dB, quindi 10 vuol dire un picco di circa 10 dB [C: commento in `network.ts`]) e fa gracchiare il master; dimenticare che un suono con taglio basso è anche più piano.
**Nell'app**: "Basso acido" ha Risonanza 10 e Brillantezza 900 Hz: alzare Brillantezza di poco alla volta dà l'effetto "miao" (senza automazione bisogna farlo a mano). Per un suono lo-fi provare Brillantezza intorno a 1-2 kHz [P].
**Fonti**: https://en.wikipedia.org/wiki/Low-pass_filter ; https://en.wikipedia.org/wiki/Voltage-controlled_filter ; https://en.wikipedia.org/wiki/Q_factor ; https://en.wikipedia.org/wiki/Roland_TB-303
**Correzioni**: nessun errore sostanziale (già sistemato "acid house e techno"). Nomi: sul pannello si chiama "Brillantezza", non "Filtro/cutoff". Attenzione: la scheda dice "poca [risonanza] dà calore": è un'impressione soggettiva, non verificata.

## pad | Pad (tappeto)
**Più dettagli**
- Il pad è un ruolo, non una forma d'onda: nelle fonti ammesse "pad" non compare come termine [F: assente da Synthesizer], quindi la definizione è di pratica musicale [P]. Ciò che lo rende "pad" è l'inviluppo (attacco e rilascio lunghi [F: Envelope spiega le fasi]) e le note lunghe.
- Suona bene con onde ricche (dente di sega) poi scurite dal filtro: ricche per essere piene, filtrate per non essere stridule [P].
- Occupa i medi: in un brano con basso, voce/melodia e pad, i tre si contendono gli stessi punti (vedi mascheramento) [F: Auditory masking].
**Errori comuni**: pad troppo forte che copre la melodia; pad con troppi bassi che si sommano al basso (fango); accordi che cambiano continuamente con rilascio lungo, che mescolano due accordi insieme (suono "sporco").
**Nell'app**: tenere il pad più basso della melodia (provare -6/-9 dB sul fader [P]); mettere un filtro passa-alto come effetto a 150-250 Hz [P]; per allontanarlo, un po' di riverbero (Quantità 20-30% [P]).
**Fonti**: https://en.wikipedia.org/wiki/Envelope_(music) ; https://en.wikipedia.org/wiki/Sawtooth_wave ; https://en.wikipedia.org/wiki/Auditory_masking
**Correzioni**: la fonte "Synthesizer" non parla di pad: la scheda è corretta ma la fonte non la conferma. Consigliato aggiungere Envelope (già c'è) e dire che è una convenzione.

## lead-pluck | Lead e pluck
**Più dettagli**
- "Lead" è il ruolo di chi porta la melodia [F: Synthesizer nomina il lead per melodie e assoli]; un synth monofonico (una nota alla volta) è tipico per assoli e basse [F].
- Per farlo emergere servono più energia sulle frequenze medio-alte (dove l'orecchio è più sensibile, 2-5 kHz [F: Equal-loudness contour]) e un attacco netto [P].
- Il pluck imita una corda pizzicata: nella sintesi sottrattiva il suono "pizzicato" si ottiene con decadimento e sostegno bassi e un filtro che si chiude [F: Subtractive synthesis descrive proprio l'esempio della corda pizzicata: cutoff alto, decay più lungo, sustain basso, release corto].
- Il delay a tempo (ottavi o ottavi puntati) fa sembrare un pluck più ricco senza renderlo più lungo [P].
**Errori comuni**: due lead che suonano insieme nella stessa zona di note; lead con rilascio troppo lungo (le note si impastano); troppo riverbero (il lead si allontana e non emerge più).
**Nell'app**: provare "Pluck" con delay "Ottavo puntato", Ripetizioni 25-35%, Quantità 15-25% [P]; per i videogiochi anni '80 usare "Chiptune".
**Fonti**: https://en.wikipedia.org/wiki/Synthesizer ; https://en.wikipedia.org/wiki/Subtractive_synthesis ; https://en.wikipedia.org/wiki/Chiptune ; https://en.wikipedia.org/wiki/Equal-loudness_contour
**Correzioni**: nessun errore. La scheda cita "Pluck" come suono in cui "il decadimento è breve": nell'app il preset ha Sostegno 15%, "Corda pizzicata" 0%.

## suono-basso | Suoni di basso e sub
**Più dettagli**
- Il sub-basso sta sotto circa 70 Hz, fino al limite dell'udito (circa 20 Hz): "si sente più di quanto si ascolti" [F: Sub-bass]. Hip hop, house, drum and bass, dubstep lo usano molto [F].
- Il basso (linea di basso) ha due compiti: tenere il tempo e indicare la tonalità, di solito suonando le note dell'accordo (fondamentale, terza, quinta) [F: Bassline].
- Nella musica elettronica le linee di basso sono quasi sempre di synth [F: Bassline]. La 808 è nata come cassa lunga e sinusoidale (oscillatore sinusoidale + filtro passa-basso); Rick Rubin ha reso famoso allungarne il decadimento e accordarla su note diverse per farne un basso [F: Roland TR-808, Bassline].
- Perché un basso sinusoidale "sparisce" su casse piccole: gli altoparlanti piccoli non riproducono le frequenze molto gravi. Però il cervello può ricostruire l'altezza della nota dagli armonici più alti, anche se manca la fondamentale ("fondamentale mancante"): per questo un basso con armonici si sente anche sul telefono [F: Missing fundamental].
**Errori comuni**: sub basso e cassa sulle stesse note nello stesso momento (si coprono); basso troppo forte "perché si sente poco su cuffie piccole", poi troppo su un impianto grande; note di basso troppo basse (sotto circa 40 Hz non servono nella maggior parte degli ascolti [P]).
**Nell'app**: provare "Basso" (ricco) oltre a "Sub basso" (puro); una soluzione è usare entrambi su due tracce [P]. Aggiungere un po' di Distorsione (Intensità 10-20%, Quantità 30-40% [P]) al sub basso crea armonici che lo rendono udibile sui piccoli altoparlanti.
**Fonti**: https://en.wikipedia.org/wiki/Sub-bass ; https://en.wikipedia.org/wiki/Bassline ; https://en.wikipedia.org/wiki/Roland_TR-808 ; https://en.wikipedia.org/wiki/Missing_fundamental ; https://en.wikipedia.org/wiki/Distortion_(music)
**Correzioni**: la consiglio "alza di un'ottava la linea" è valida (spostare la nota di una ottava moltiplica per 2 la frequenza), ma conviene dirlo insieme all'alternativa "dare armonici". La scheda ha già "Cassa 808"; la fonte Sub-bass non cita "808" [F: non c'è], quindi la fonte da affiancare è Roland TR-808.

## frequenze | Frequenze: bassi, medi, acuti
**Più dettagli**
- Un hertz è un ciclo al secondo; 1 kHz = 1000 Hz [F: Hertz]. L'intervallo udibile standard è 20 Hz-20 kHz, ma un adulto medio arriva a circa 16 kHz e il limite alto scende con l'età [F: Hertz, Audio frequency, Equal-loudness contour].
- Sensibilità massima dell'orecchio: tra circa 2 e 5 kHz [F: Equal-loudness contour; Loudness dice 2-4 kHz].
- Tabella orientativa dei punti utili in un mix (Wikibooks "Bass Mixdown", pagina informale con alcuni refusi): sotto 60 Hz sub (solo sensazione fisica); 80-120 Hz "pancia" e impatto di cassa e basso; 150-400 Hz suono "scatolato" (boxy) se in eccesso; 800 Hz-4 kHz chiarezza e durezza; 4-9 kHz presenza, sibilanti; sopra 6-15 kHz "aria" [F con cautela].
- Ogni nota ha una frequenza (la "fondamentale") più gli armonici sopra di lei: un basso a 50 Hz ha armonici a 100, 150, 200 Hz...: quindi occupa più zone, non solo i bassi [F: Harmonic, Fundamental frequency].
**Errori comuni**: pensare "alzo i bassi" e basta (un po' di bassi in più su tutto = fango); tagliare gli acuti da tutto (suono spento); dimenticare che gli armonici arrivano nei medi.
**Nell'app**: usare l'Equalizzatore: Bassi (sotto 400 Hz), Medi (400-2500 Hz), Acuti (sopra 2500 Hz) [C]; un passa-alto sul pad a 150-250 Hz [P].
**Fonti**: https://en.wikipedia.org/wiki/Hertz ; https://en.wikipedia.org/wiki/Audio_frequency ; https://en.wikipedia.org/wiki/Equal-loudness_contour ; https://en.wikipedia.org/wiki/Loudness ; https://en.wikibooks.org/wiki/Mixing_and_Mastering/Bass_Mixdown
**Correzioni**: **IMPRECISIONE**: "tra 500 Hz e 4 kHz la parte su cui l'orecchio è più sensibile" non è confermata: le fonti dicono 2-5 kHz (Equal-loudness contour) o 2-4 kHz (Loudness). Proposta: "intorno a 2-5 kHz l'orecchio è più sensibile (per questo un po' di energia lì rende un suono molto 'presente')". La suddivisione "sotto 100 Hz / 100-500 / 500-4k / sopra 4k" è una convenzione di pratica, non di fonte [P]: le fonti ammesse non danno bande "ufficiali" (anche le tabelle degli studi variano); dirlo con "a grandi linee", come già fa. "Si sentono nel petto" è coerente con "si sente più di quanto si ascolti" [F: Sub-bass], ma vale sotto circa 70 Hz, non sotto 100.

---

# EFFETTI

## effetti | Effetti audio
**Più dettagli**
- Gli effetti si dividono per famiglia [F: Effects unit]: distorsione (overdrive, fuzz), dinamica (compressore, gate), filtro/EQ, modulazione (chorus, flanger, phaser), intonazione, e "a tempo" (delay e riverbero). L'app ha: distorsione, filtro, equalizzatore, delay, riverbero.
- Suono "dry" = non elaborato, "wet" = elaborato [F]. Un effetto spento si dice in "bypass" [F].
- Con gli effetti in catena il segnale passa da uno all'altro; la convenzione (per i pedali) è: distorsione e compressione all'inizio, modulazioni al centro, delay e riverbero in fondo [F: Effects unit]. Così il riverbero "avvolge" anche la distorsione e non il contrario.
- Un riverbero prima di una distorsione suona sporco e confuso perché la distorsione sporca anche la coda [P].
**Errori comuni**: troppi effetti su ogni traccia (spesso bastano 1-2); effetti a Quantità alta su tutte le tracce, che le fanno "sciogliere" tutte nello stesso spazio; accendere un effetto e non ricordarsi di confrontarlo con l'effetto spento (dimenticare l'interruttore).
**Nell'app**: ogni traccia ha fino a 6 effetti, riordinabili con le frecce su/giù e con interruttore on/off per il confronto. Ordine consigliato [P]: Distorsione, Filtro/Equalizzatore, Delay, Riverbero.
**Fonti**: https://en.wikipedia.org/wiki/Effects_unit
**Correzioni**: la frase "distorcere e poi aggiungere riverbero suona diverso dal contrario" è vera. Parole chiave: "mandata" è nella lista `parole` ma l'app NON ha mandate (send): chi cerca "mandata" otterrebbe una scheda che non risponde; meglio toglierla o spiegare che l'app mette gli effetti direttamente sulla traccia.

## riverbero | Riverbero
**Più dettagli**
- Il riverbero è la persistenza del suono dopo che la sorgente si ferma: tante riflessioni contro le pareti, che poi si spengono per assorbimento [F: Reverberation].
- Si misura con l'RT60: il tempo che serve al suono per scendere di 60 dB [F]. L'app usa lo stesso significato per "Durata" [C].
- Dipende dalla dimensione dell'ambiente e dai materiali: stanze grandi e superfici dure = coda lunga; tende e divani = coda corta [F: formula di Sabine]. La pagina NON dà durate tipiche in numeri: i valori seguenti sono indicativi [P]: stanza 0,3-0,8 s; sala 1,5-2,5 s; chiesa/cattedrale 4 s o più.
- Riflessioni ravvicinate (entro circa 50 ms) si sentono come un unico suono "con coda"; oltre 50-100 ms si sentono come eco distinte [F: Reverberation].
- Riverbero e canto: già nel X secolo la musica sacra ne faceva uso, e il canto gregoriano potrebbe essere nato per le grandi cattedrali con molto riverbero (ipotesi citata) [F].
- Esistono tipi storici: camera d'eco, a molla (spring), a piastra (plate), digitale, a convoluzione, "gated" (coda tagliata, famoso nella batteria anni '80) [F: Reverb effect].
- Quello dell'app è algoritmico, con coda stereo, bassi sotto 150 Hz già tolti e acuti smorzati sopra 5 kHz [C]: "lontano" e morbido più che brillante.
**Errori comuni**: troppo riverbero su tutto (il brano sembra suonato in un bagno e perde ritmo); durata lunga con tempo veloce (la coda dura più di una battuta e copre le note successive); riverbero sul basso o sulla cassa (ma il riverbero dell'app già non gonfia i bassi); usare lo stesso tempo di coda per tutto: così tutto sembra nella stessa stanza.
**Nell'app**: Quantità 10-25% per rullante e melodie, 25-40% per pad e suoni lontani [P]; Durata 0,5-1,2 s per ritmi veloci, 2-4 s per atmosfere lente [P]; con 100% di Quantità si sente solo la coda (a volte utile come effetto speciale, ma di solito è un errore). Per la batteria: il riverbero vale per tutta la traccia batteria; per il solo rullante usare una traccia Percussione singola.
**Fonti**: https://en.wikipedia.org/wiki/Reverberation ; https://en.wikipedia.org/wiki/Reverb_effect ; https://en.wikipedia.org/wiki/Audio_mixing_(recorded_music)
**Correzioni**: nessun errore. La scheda dice "corta per una stanza, lunga per una cattedrale": coerente con Sabine. Attenzione: la scheda afferma "di solito si usa di più su pad, melodie e rullante": è convenzione [P], non in fonte; la fonte Audio mixing dice solo che il riverbero "aggiunge profondità" e aiuta a raggruppare suoni con lo stesso carattere [F].

## delay | Delay (eco)
**Più dettagli**
- L'eco "slapback" (un solo rimbalzo veloce) ha ritardo di 60-250 ms e poco o nessun feedback [F: Delay (audio effect)]. Con ritardi sotto circa 50 ms il suono non viene più sentito come eco ma "ingrassa" il suono (effetto Haas) [F: Delay, Precedence effect]: l'app non scende sotto 107 ms.
- Un'eco si percepisce come tale oltre 50 ms per parlato e impulsi, oltre circa 100 ms per la musica [F: Precedence effect].
- Il feedback rimanda l'uscita all'ingresso: con valore basso ogni ripetizione è più debole; con valore molto alto cresce fino a "suonare da sola" [F: Delay]. Per questo l'app ferma "Ripetizioni" a 85% [C].
- Durata in millisecondi dei tempi dell'app [calcolo, 60.000 ms / BPM = quarto]: a 120 BPM quarto 500 ms, ottavo 250 ms, ottavo puntato 375 ms, sedicesimo 125 ms; a 90 BPM: 667, 333, 500, 167 ms; a 140 BPM: 429, 214, 321, 107 ms. L'ottavo puntato = 3/4 di battito: crea l'effetto "rimbalzo sincopato" tipico degli arpeggi [P].
- Molti delay si sincronizzano con il tempo del brano; il ping-pong rimbalza tra sinistra e destra [F: Delay].
**Errori comuni**: Ripetizioni troppo alte (la coda continua nelle battute successive e crea caos); delay su tutto (tutto "rimbalza"); delay sul basso (le ripetizioni ingrossano i bassi); tempo non adatto al ritmo (ottavo puntato su un ritmo dove non entra nel groove).
**Nell'app**: Quantità 15-30%, Ripetizioni 25-40% come punto di partenza [P]; Sedicesimo per effetto "slapback" sul rullante (traccia Percussione singola); Ottavo per melodie; Quarto per pad lenti.
**Fonti**: https://en.wikipedia.org/wiki/Delay_(audio_effect) ; https://en.wikipedia.org/wiki/Precedence_effect ; https://en.wikipedia.org/wiki/Reverberation
**Correzioni**: **IMPRECISIONE sull'app**: nelle `parole` c'è "ping pong": l'app NON ha il ping-pong; togliere o spiegare che non c'è. Il tempo non è libero: solo 4 valori (quarto, ottavo, ottavo puntato, sedicesimo). Il feedback nell'interfaccia si chiama "Ripetizioni". La frase "senza impastare come il riverbero" è una generalizzazione [P]: un delay lungo e alto di feedback impasta eccome.

## filtro-effetto | Filtro come effetto
**Più dettagli**
- Passa-alto (taglia i bassi, "low cut") lascia passare solo sopra il taglio; si usa nei mixer per eliminare il "rumble" cioè rumori molto gravi (passi, motori) [F: High-pass filter]. Nei mixer professionali molti canali hanno il passa-alto a 80-100 Hz, ma di solito non su cassa, basso e pianoforte [F: High-pass filter, che cita Bruce Main].
- Il passa-basso, in audio, è detto anche "high cut" o "treble cut" [F]; tolti gli acuti il suono sembra "dietro una porta". Il tasto "tono" della chitarra elettrica è un passa-basso [F].
- Passa-alto + passa-basso insieme = passa-banda: effetto "telefono" [F: Audio mixing dice "band-pass: telephone effect"].
- In un mix i filtri servono a "sgombrare" (declutter) il suono per migliorare la chiarezza [F: Audio mixing].
- La Risonanza alza il volume attorno alla frequenza di taglio [F: Q factor, VCF]: attenzione al volume. Nell'app la Risonanza è in dB [C], quindi 15 è un picco molto forte.
**Errori comuni**: passa-alto troppo alto su basso/cassa (spariscono); passa-basso con risonanza alta lasciata ferma (un fischio fisso); passa-alto a 20 kHz per sbaglio (tace tutto: il cursore va fino a 20000 Hz).
**Nell'app**: Passa-alto a 100-200 Hz con Risonanza 1 sui pad e sugli accordi per liberare spazio al basso [P]; Passa-basso a 1-3 kHz per un effetto "lo-fi" o "da un'altra stanza" [P]. Non c'è automazione, quindi il "filtro che si apre" nelle introduzioni si fa dalle impostazioni a mano, non mentre suona.
**Fonti**: https://en.wikipedia.org/wiki/Low-pass_filter ; https://en.wikipedia.org/wiki/High-pass_filter ; https://en.wikipedia.org/wiki/Audio_mixing_(recorded_music) ; https://en.wikipedia.org/wiki/Q_factor
**Correzioni**: nessun errore. "Filtro che si apre" nelle `parole` fa pensare a una funzione che l'app non ha (automazione): spiegare che si può solo regolare a mano.

## equalizzatore | Equalizzatore (EQ)
**Più dettagli**
- L'EQ regola il volume di zone di frequenza diverse [F: Audio equalization]. Due modi: "shelving" (alza/abbassa tutto sopra o sotto un punto: i controlli bassi/acuti di uno stereo) e "peaking" (un picco/avvallamento attorno a una frequenza, con larghezza regolabile) [F].
- L'EQ dell'app ha tre zone fisse (sotto 400 Hz, 400-2500 Hz, sopra 2500 Hz) e guadagno da -24 a +12 dB [C]: più potere di taglio che di aumento.
- "Meglio tagliare che alzare": lo conferma un manuale di mixaggio (Wikibooks: "EQ cuts sound much better than boosts") [F, fonte informale]. Ragione pratica [P]: alzare una zona aumenta anche il volume totale e può far gracchiare (clipping), mentre tagliare dà spazio.
- Ritocchi piccoli bastano: 1-3 dB si sentono già (1 dB è circa la differenza minima percepibile [F: Decibel, JND]).
**Errori comuni**: alzare Bassi e Acuti insieme su tutto ("curva a sorriso") fino a far gracchiare il master; usare l'EQ per correggere un suono sbagliato alla radice (meglio cambiare suono); toccare troppo senza confrontare con "spento".
**Nell'app**: se il basso copre la cassa, abbassare "Bassi" sulla traccia del basso di 3-6 dB, o su quella del pad [P]; per un suono troppo aspro abbassare "Acuti" di 3-5 dB [P]. Nota: lo stesso suono si scurisce anche con Brillantezza (suono) o con il filtro passa-basso: scegliere quello che serve.
**Fonti**: https://en.wikipedia.org/wiki/Audio_equalization ; https://en.wikibooks.org/wiki/Mixing_and_Mastering/Bass_Mixdown ; https://en.wikipedia.org/wiki/Decibel
**Correzioni**: nessun errore. L'URL `Equalization_(audio)` funziona solo con redirect: meglio `https://en.wikipedia.org/wiki/Audio_equalization`.

## distorsione | Distorsione e saturazione
**Più dettagli**
- Distorsione, overdrive e fuzz sono parenti: overdrive = morbida (simula un amplificatore a valvole spinto), distorsione = più forte, fuzz = estrema, vicina a un'onda quadra [F: Distortion (music)].
- Nasce dal "clipping": i picchi dell'onda vengono tagliati e si creano armonici nuovi [F: Clipping, Distortion]. Clipping morbido = armonici più "musicali" e caldi (pari); clipping duro = timbro più aspro (dispari) [F].
- Più distorsione = suono più compresso e più forte percepito [F: Distortion dice "compressed"; Clipping dice che l'onda tagliata porta più energia].
- Si usa su chitarra, basso, tastiere elettriche e synth [F]; su una batteria o un basso aggiunge armonici che li rendono più presenti [P].
**Errori comuni**: Intensità e Quantità alte insieme su un suono già forte (gracchia e stanca); distorcere i bassi profondi (diventano un rumore); alzare la Quantità e non abbassare il volume (la distorsione "alza" il suono).
**Nell'app**: provare Quantità 20-40% e Intensità 10-30% come saturazione leggera [P]; sul basso mettere la distorsione PRIMA di un eventuale Equalizzatore per addolcire gli acuti aggiunti. Attenzione al limiter del master: se tutto è distorto e forte, interviene di continuo.
**Fonti**: https://en.wikipedia.org/wiki/Distortion_(music) ; https://en.wikipedia.org/wiki/Clipping_(audio)
**Correzioni**: nessun errore. "Poca [distorsione] lo rende più caldo" corrisponde alla descrizione di clipping morbido con armonici pari "warm" [F]; "su una batteria le dà grinta" è pratica [P].

## compressione | Compressione
**Più dettagli**
- Il compressore riduce il volume dei suoni sopra una "soglia" di un certo rapporto (es. 4:1: 4 dB sopra la soglia diventano 1 dB) e poi si rialza il volume complessivo con il "guadagno di compensazione" [F: Dynamic range compression].
- Parametri principali: soglia, rapporto, attacco, rilascio, ginocchio, guadagno finale [F].
- Il limiter è un compressore con rapporto altissimo (da 10:1 e oltre) e attacco rapidissimo: "muro di mattoni" quando il rapporto è 20:1 o infinito [F].
- Sidechain: il compressore si comanda con un'altra traccia; nell'EDM il basso si abbassa a ogni colpo di cassa per far posto alla cassa e creare il "pompare" [F: Dynamic range compression, Wikibooks Sidechaining].
- Troppa compressione e limiting riduce la differenza tra parti forti e piano, e può stancare l'ascolto ("loudness war") [F: Loudness war].
**Errori comuni** (da spiegare anche se l'app non ha l'effetto): usare compressione per fare "più forte" invece che più uniforme; non riconoscere che gran parte dell'energia del master viene dal limiter.
**Nell'app**: il compressore e il sidechain NON ci sono [C: featureList]. Per sentire il "pompare" si possono scrivere le note del pad/accordi in modo che nei punti della cassa non suonino (note più corte): è un'imitazione grossolana, perché crea buchi netti anziché abbassamenti morbidi [P].
**Fonti**: https://en.wikipedia.org/wiki/Dynamic_range_compression ; https://en.wikibooks.org/wiki/Mixing_and_Mastering/Sidechaining ; https://en.wikipedia.org/wiki/Loudness_war
**Correzioni**: **IMPRECISIONE**: "sul volume generale c'è un limiter che evita le distorsioni": dietro il limiter c'è un clipper che taglia netto i picchi rimasti [C: `master.ts`], quindi il master PUÒ distorcere (e il limiter di Tone non ha anticipo, quindi lascia passare i picchi veloci). Proposta: "sul volume generale c'è un limiter con una protezione finale che taglia i picchi: se tutto è molto forte può comunque gracchiare". Inoltre "pompare" e "sidechain" nelle `parole` ok, ma la scheda dovrebbe dire chiaramente "non disponibile" nella prima riga, perché un modello piccolo potrebbe promettere la funzione.

---

# MIX

## mix | Mixaggio
**Più dettagli**
- Mixare = ottimizzare e combinare più tracce in una versione finale mono, stereo o surround: si regolano livelli e bilanciamento; EQ e compressione agiscono su singole tracce e sul totale [F: Audio mixing].
- Quattro "leve" del mix [F: Audio mixing]: livelli (fader), frequenze (EQ, filtri), spazio (pan), tempo/profondità (riverbero e delay).
- Il riverbero dà profondità a tracce "asciutte" e aiuta a raggruppare suoni dello stesso carattere [F].
- Errori tipici citati: clipping e "clashing" (scontro tra elementi) [F].
- Metodo pratico: partire da cassa e basso (le basi), aggiungere una traccia per volta [P]; lasciare spazio sul volume totale: un manuale consiglia di finire 3-4 dB sotto il massimo [F: Wikibooks Bass Mixdown "mix to 3 to 4 dB below unity"].
**Errori comuni**: alzare tutto finché "suona forte"; effetti per risolvere ciò che si risolve col volume; lavorare solo con una traccia in solo (nel brano intero suona diverso); non fare pause.
**Nell'app**: alzare un fader per volta, partendo con tutto abbassato (-12 dB) [P]; controllare gli indicatori di livello del master: non devono toccare sempre il massimo [P].
**Fonti**: https://en.wikipedia.org/wiki/Audio_mixing_(recorded_music) ; https://en.wikibooks.org/wiki/Mixing_and_Mastering/Bass_Mixdown
**Correzioni**: nessun errore. La scheda cita il pan, il volume ecc.: manca l'EQ (che l'app ha). Aggiungere "Equalizzatore e filtro".

## volume-db | Volume e decibel
**Più dettagli**
- Il decibel è una scala logaritmica: confronta due livelli con un rapporto; +6 dB circa raddoppia l'ampiezza (×1,995), -6 dB la dimezza (×0,501), +20 dB la moltiplica per 10 [F: Decibel, tabella]. +3 dB raddoppia la POTENZA (e moltiplica l'ampiezza per 1,41) [F].
- Il "doppio volume percepito" a +10 dB è una regola empirica: ogni 10 phon (10 dB a 1 kHz) il suono sembra circa il doppio più forte, valida sopra i 40 phon e per toni singoli [F: Sone]. La fonte della scheda ("Decibel") non lo dice: aggiungere Sone o Loudness.
- La differenza minima che si nota è circa 1 dB [F: Decibel, JND]: quindi i ritocchi sul fader di 0,5 dB (il passo dell'app) sono quasi invisibili, meglio usare passi da 1-3 dB.
- 0 dBFS è il massimo del digitale: sopra c'è il clipping [F: Decibel dBFS; Clipping]. Nell'app il limiter ferma i picchi a -1 dB [C].
**Errori comuni**: fader di tutte le tracce vicino al massimo (il master satura); regolare a orecchio mentre si passa da suoni forti a deboli senza pause; pensare che +6 dB sia "poco".
**Nell'app**: i fader vanno da -60 a +6 dB; il valore standard è 0 dB. Si può scrivere il valore esatto cliccandolo (es. -6). Abbassare di 6 dB tutte le tracce e il master dà più margine [P].
**Fonti**: https://en.wikipedia.org/wiki/Decibel ; https://en.wikipedia.org/wiki/Sone ; https://en.wikipedia.org/wiki/Headroom_(audio_signal_processing)
**Correzioni**: affermazioni numeriche corrette (+6 dB = x2 ampiezza; +10 dB ~ doppio volume percepito). Segnalo solo che la regola dei +10 dB è semplificata (vale per toni singoli a 1 kHz sopra 40 phon) e che la fonte citata non la contiene.

## pan | Pan (sinistra e destra)
**Più dettagli**
- Il pan distribuisce il segnale tra sinistra e destra con una "legge": al centro il segnale si abbassa un po' per non sembrare più forte che a lato; sono usati -3 dB (se resta stereo), -6 dB (se sommato in mono) o -4,5 dB (compromesso) [F: Panning (audio)]. L'app usa -3 dB [C].
- Il suono al centro sembra provenire da un punto fra le casse ("centro fantasma") [F: Panning].
- Il pan "vero" cambia solo il volume tra i due canali; per un movimento realistico servono anche differenze di tempo, filtro e riverbero [F: Panning, Stereophonic sound].
- In cuffia ogni canale va a un orecchio senza mescolarsi; con le casse ogni orecchio sente entrambe: lo stesso pan suona più "largo" in cuffia [F: Stereophonic sound].
- Convenzione di mix [P]: cassa, basso, rullante e voce/melodia principale al centro (energie forti e basse sul centro); charleston, percussioni, accordi e seconde melodie a lato.
**Errori comuni**: tutto al centro (suono stretto) o tutto ai lati (buco al centro); un solo suono completamente a sinistra (100%) che in cuffia è fastidioso; due suoni importanti spostati dalla stessa parte.
**Nell'app**: tenere basso e cassa a 0 (doppio clic sul cursore riporta al centro [C]); charleston 20-40% a destra, shaker 20-40% a sinistra, pad e accordi un po' di lato [P]; pan tra 20 e 50% di solito basta.
**Fonti**: https://en.wikipedia.org/wiki/Panning_(audio) ; https://en.wikipedia.org/wiki/Stereophonic_sound ; https://en.wikipedia.org/wiki/Audio_mixing_(recorded_music)
**Correzioni**: nessun errore. "Larghezza" nelle `parole`: il pan di una traccia mono sposta la posizione, non la larghezza (quella la dà, ad esempio, il riverbero stereo); la scheda dice "allarga il mix": giusto nel senso di spazio fra le tracce. La regola su cosa va al centro è convenzione [P].

## spazio-frequenze | Cassa e basso, e strumenti che si coprono
**Più dettagli**
- Il mascheramento è massimo quando i due suoni hanno la stessa frequenza e diminuisce man mano che si allontanano; suoni vicini cadono nella stessa "banda critica" e si coprono di più [F: Auditory masking].
- I suoni gravi coprono gli acuti più di quanto gli acuti coprano i gravi ("upward spread of masking") [F]: un basso troppo forte copre i medi, ma non il contrario.
- Il mascheramento vale anche nel tempo: un suono forte copre per circa 20 ms prima e fino a circa 100 ms dopo [F: Auditory masking, temporal masking].
- Cassa e basso: soluzioni a scelta [F per l'idea di sidechain; resto P]: farli suonare in momenti diversi; dare al basso le note lunghe e alla cassa i colpi; tagliare con EQ in una traccia ciò che l'altra occupa (es. alzare un po' i bassi alla cassa e tagliarli al basso, o viceversa); un manuale consiglia taglio sotto 80 Hz della cassa per togliere "rumble" e boost 80-125 Hz per il basso [F: Wikibooks Bass Mixdown, fonte informale].
- Nella musica elettronica si usa il sidechain: il basso si abbassa ad ogni colpo di cassa [F: Dynamic range compression] (l'app non ce l'ha).
**Errori comuni**: basso e cassa 808 sulle stesse note nello stesso istante; pad e accordi con tanti bassi; aggiungere un sub e non togliere i bassi dal resto; non ascoltare su casse piccole.
**Nell'app**: se cassa e basso si coprono, provare "Sub basso" con note diverse dai colpi della cassa [P]; usare il solo e il muto per sentire quale dei due manca; abbassare di 3-6 dB "Bassi" (EQ) dal pad [P]. "Cassa 808" fa già da basso: in tal caso non aggiungere un secondo basso nelle stesse note.
**Fonti**: https://en.wikipedia.org/wiki/Auditory_masking ; https://en.wikibooks.org/wiki/Mixing_and_Mastering/Bass_Mixdown ; https://en.wikipedia.org/wiki/Dynamic_range_compression ; https://en.wikipedia.org/wiki/Audio_mixing_(recorded_music)
**Correzioni**: nessun errore. La fonte Audio mixing non spiega il "mascheramento" (parla di "clashing" e di EQ); la fonte Auditory masking non tratta il mix musicale: la scheda mette insieme le due cose (ragionevole, ma è una sintesi).

## clipping-limiter | Distorsione da volume (clipping) e limiter
**Più dettagli**
- Clipping = i picchi vengono tagliati perché il segnale supera il massimo: l'onda diventa "quadrata" e si aggiungono armonici alti aspri [F: Clipping (audio)]. Nel digitale ogni valore oltre il massimo viene fissato al massimo [F].
- Si evita abbassando il livello o con un limiter [F]. Un segnale tagliato in modo netto non si ripara del tutto [F].
- Il margine tra il livello normale e il massimo è l'"headroom": serve a far passare i picchi senza tagli [F: Headroom (audio signal processing)].
- Il limiter è un compressore con rapporto alto e attacco rapido [F: Dynamic range compression]. Troppo limiting riduce la dinamica e stanca (loudness war) [F: Loudness war].
- Nell'app: la catena del master è volume, limiter (soglia -1 dB) e poi clipper che taglia netto [C]. Il limiter non ha "anticipo" e quindi lascia passare picchi molto rapidi, che finiscono nel clipper [C].
**Errori comuni**: tutti i fader a 0 dB o più; Quantità di distorsione alta + Risonanza alta + volume alto; non accorgersene e dare la colpa all'esportazione; alzare il master per recuperare volume.
**Nell'app**: se il suono gracchia, abbassare per primo il volume delle tracce più forti (di solito cassa/basso e suoni con molta risonanza), non il master; abbassare Risonanza/Intensità; riascoltare anche a Esporta WAV (il limiter e il clipper lavorano uguale nel file).
**Fonti**: https://en.wikipedia.org/wiki/Clipping_(audio) ; https://en.wikipedia.org/wiki/Headroom_(audio_signal_processing) ; https://en.wikipedia.org/wiki/Dynamic_range_compression ; https://en.wikipedia.org/wiki/Loudness_war
**Correzioni**: **INCOERENZA INTERNA**: "quindi non distorce in modo brusco" contraddice "protezione finale che taglia i picchi rimasti" (quella è un taglio netto, cioè clipping vero). Proposta: "il limiter abbassa i picchi con dolcezza e un taglio finale ferma quelli che restano: se il suono è molto forte, quel taglio distorce". Il termine "rosso" nelle `parole` presuppone un indicatore rosso: da verificare nell'interfaccia.

## muto-solo | Muto e solo
**Più dettagli**
- Muto silenzia la traccia; Solo silenzia tutte le altre ("solo in place") e cambia ciò che si ascolta [F: Mixing console]. Nei mixer veri esistono anche ascolti "di servizio" (PFL/AFL) che non toccano il mix; nell'app il solo agisce sull'uscita vera [C].
- Con il solo si sentono ancora gli effetti della traccia (riverbero, delay) [C].
- Usi: sentire un suono da solo per decidere il suono; capire se una traccia è indispensabile; cercare un click o un rumore [P].
**Errori comuni**: lasciare una traccia in solo e poi esportare (nell'esportazione verrà usato lo stato attuale: da verificare); mixare solo con "solo" (una traccia sembra buona da sola e pessima insieme alle altre); dimenticare un muto attivo e cercare un guasto.
**Nell'app**: il solo si può dare a più tracce insieme (ascoltare basso+cassa insieme per bilanciarli) [C: dal codice il solo è per canale]; pulsanti M e S accanto al nome della traccia.
**Fonti**: https://en.wikipedia.org/wiki/Mixing_console
**Correzioni**: nessun errore. La scheda dice "Solo (S) fa ascoltare solo quella traccia (o quelle in solo)": giusto [F].

## ascolto | Come ascoltare il proprio brano
**Più dettagli**
- L'orecchio non sente tutte le frequenze alla stessa maniera: è più sensibile fra circa 2 e 5 kHz e meno ai suoni gravi, soprattutto a basso volume [F: Equal-loudness contour, Loudness]. Per questo a basso volume i bassi sembrano più deboli e ci sono "compensazioni di volume" negli stereo [F: Loudness].
- Un mix che si sente bene a volume basso e a volume moderato di solito regge anche in alto [P, deduzione dal punto precedente].
- La differenza tra cuffie e casse è reale: in cuffia ogni canale arriva a un solo orecchio; con le casse si mescolano e il realismo dipende anche dalla stanza [F: Stereophonic sound].
- Ascoltare brani troppo compressi stanca l'ascolto; troppo volume per molto tempo può danneggiare l'udito (rischio indicato da ricercatori) [F: Loudness war].
- Controllare su più sistemi (cuffie, casse, telefono) è una buona pratica diffusa [P].
**Errori comuni**: lavorare solo a volume alto; ascoltare lo stesso passaggio 30 volte di fila; correggere i bassi guardando solo il telefono; confrontare con un brano commerciale a volume diverso (sembra "meglio" solo perché più forte).
**Nell'app**: ascoltare con "Ripeti parte" una zona di 4-8 battute per regolare; confrontare spegnendo e accendendo un effetto; esportare il WAV e ascoltarlo sul telefono [P].
**Fonti**: https://en.wikipedia.org/wiki/Equal-loudness_contour ; https://en.wikipedia.org/wiki/Loudness ; https://en.wikipedia.org/wiki/Stereophonic_sound ; https://en.wikipedia.org/wiki/Loudness_war
**Correzioni**: "a volume alto tutto sembra più bello e con più bassi" è compatibile con le curve di uguale sonorità ma la fonte Equal-loudness contour non lo dice esplicitamente [F: la voce nota solo che la sensibilità cambia con frequenza e livello]; la voce Loudness lo dice per i bassi a basso volume (si usa per la compensazione). Suggerisco di aggiungere Loudness tra le fonti.

---

# SCHEDE NUOVE PROPOSTE

## armonici-fondamentale | Fondamentale e armonici (perché un basso si sente anche su casse piccole)
**Testo base**: ogni nota ha una frequenza di base (fondamentale) più armonici, cioè multipli interi (200, 300, 400 Hz... per una nota di 100 Hz) [F: Harmonic, Fundamental frequency]. Il cervello ricava l'altezza della nota dagli armonici anche se la fondamentale manca: è la "fondamentale mancante", per questo la voce maschile si sente al telefono anche se il telefono non riproduce sotto circa 300 Hz [F: Missing fundamental]. Si usa anche in prodotti per "creare" basso su altoparlanti piccoli aggiungendo armonici [F].
**Errori comuni**: sub basso puro senza armonici su casse piccole (sparisce).
**Nell'app**: usare "Basso" (dente di sega filtrato) invece di "Sub basso", o aggiungere un po' di Distorsione al sub.
**Parole**: fondamentale, armonici, basso non si sente, cassa piccola, telefono, fondamentale mancante.
**Fonti**: https://en.wikipedia.org/wiki/Harmonic ; https://en.wikipedia.org/wiki/Fundamental_frequency ; https://en.wikipedia.org/wiki/Missing_fundamental

## headroom-livelli | Margine di volume (headroom) e livelli
**Testo base**: l'headroom è il margine tra il livello normale e il massimo prima del taglio; serve a far passare i picchi [F: Headroom]. Nel digitale il massimo è 0 dBFS [F: Decibel]; nell'app il limiter parte a -1 dB [C]. Un manuale consiglia di finire il mix 3-4 dB sotto il massimo [F: Wikibooks Bass Mixdown, fonte informale]. Consigli: partire da fader bassi (es. -12 dB) e alzare solo dove serve [P]; un limiter che lavora sempre toglie dinamica [F: Loudness war].
**Parole**: margine, headroom, livelli, troppo forte, volume del master, 0 dB, dbfs.
**Fonti**: https://en.wikipedia.org/wiki/Headroom_(audio_signal_processing) ; https://en.wikipedia.org/wiki/Decibel ; https://en.wikibooks.org/wiki/Mixing_and_Mastering/Bass_Mixdown ; https://en.wikipedia.org/wiki/Loudness_war

## ordine-effetti | Ordine degli effetti
**Testo base**: nelle catene di effetti l'ordine cambia il suono. Convenzione per i pedali: distorsione e dinamica all'inizio, modulazioni al centro, delay e riverbero alla fine [F: Effects unit]. Se si riverbera e poi si distorce, la coda viene sporcata; se si distorce e poi si riverbera, la coda resta pulita [P]. Nell'app si possono riordinare gli effetti con le frecce (massimo 6) [C]. Provare e confrontare spegnendo e accendendo l'effetto.
**Parole**: ordine effetti, catena, prima o dopo, riverbero e distorsione, cambia il suono.
**Fonti**: https://en.wikipedia.org/wiki/Effects_unit

## polifonia | Una nota o più note insieme (polifonia)
**Testo base**: un synth monofonico suona una nota alla volta (basso, assolo), uno polifonico più note insieme (accordi) [F: Synthesizer]. Lo Strumento dell'app è polifonico, fino a 16 note insieme [C]: se si superano, le note più vecchie si interrompono [P, comportamento tipico non verificato]. Con rilascio lungo le note si sovrappongono e consumano più voci.
**Parole**: polifonia, monofonico, quante note insieme, note che si interrompono, voci.
**Fonti**: https://en.wikipedia.org/wiki/Synthesizer

---

## Fonti usate (tutte controllate con WebFetch)

Wikipedia EN: Timbre, Harmonic, Fundamental_frequency, Missing_fundamental, Synthesizer, Subtractive_synthesis, Waveform, Sine_wave, Triangle_wave, Square_wave_(waveform), Pulse_wave, Sawtooth_wave, Chiptune, Envelope_(music), Low-pass_filter, High-pass_filter, Voltage-controlled_filter, Q_factor, Roland_TB-303, Roland_TR-808, Sub-bass, Bassline, Audio_frequency, Hertz, Effects_unit, Reverberation, Reverb_effect, Delay_(audio_effect), Precedence_effect, Audio_equalization, Distortion_(music), Dynamic_range_compression, Loudness_war, Audio_mixing_(recorded_music), Decibel, Sone, Headroom_(audio_signal_processing), Loudness, Equal-loudness_contour, Panning_(audio), Stereophonic_sound, Auditory_masking, Clipping_(audio), Mixing_console.
Wikibooks EN: Mixing_and_Mastering/Bass_Mixdown (pagina informale con refusi: usata solo per "meglio tagliare che alzare" e il margine di 3-4 dB), Mixing_and_Mastering/Sidechaining, Sound_Synthesis_Theory/Oscillators_and_Wavetables (descrive le forme d'onda: sinusoide liscia, dente di sega "buzzy", triangolare con soli armonici dispari).
Non verificabile con le fonti ammesse: durate tipiche del riverbero, percentuali "di partenza", ruolo di pad/lead, convenzioni di pan: tutte marcate [P].
