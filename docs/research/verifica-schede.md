# Verifica delle schede della biblioteca dell'assistente

Data: 2026-11-12. Schede lette: tutte quelle in `knowledge/cards/*.md` (9 file). Le schede NON sono state modificate.

Metodo: rilettura di ogni scheda (note, semitoni, scale, gradi, accordi, ritmi, effetti, BPM) e controllo degli URL con l'API di Wikipedia (esistenza della pagina, redirect, pagine di disambiguazione). Per i BPM e il dembow sono stati letti anche gli articoli citati. Le righe "Nell'app..." non sono state verificate sul web.

Limite: le pagine Wikipedia sono state controllate per esistenza e, dove serviva, per contenuto. Non ho riletto riga per riga ogni articolo: le affermazioni di teoria musicale di base (accordi, scale, intervalli) sono state verificate con la conoscenza standard della teoria, non una a una sulla pagina.

## Esito sintetico

- Errori veri (da correggere): 1 (URL inesistente).
- Imprecisioni o semplificazioni da sistemare: 5.
- Incoerenze tra schede: 2.
- Affermazioni non confermate dalla fonte citata (plausibili, ma non verificate lì): 2.
- Nessun errore di note, semitoni, sequenze di toni, gradi, accordi di settima, sus, dim/aug, circolo delle quinte, cadenze.

## Schede con problemi

| id | Problema | Correzione proposta |
|---|---|---|
| contorno | URL in `fonti:` inesistente: la pagina "Steps and skips" su en.wikipedia.org non esiste (anche "Conjunct and disjunct motion" non esiste). | Sostituire `Steps and skips (Wikipedia) <https://en.wikipedia.org/wiki/Steps_and_skips>` con `Interval (Wikipedia) <https://en.wikipedia.org/wiki/Interval_(music)>`. Nota: la pagina "Melody", già citata, nomina solo di sfuggita "conjunct or disjunct". |
| scala-minore | Imprecisione: "Rispetto alla maggiore ha la terza nota più bassa di un semitono". Nella minore naturale sono più basse di un semitono la terza, la sesta e la settima (La minore vs La maggiore: Do, Fa, Sol invece di Do♯, Fa♯, Sol♯). La terza è la più importante per il carattere, ma detta così sembra l'unica differenza. | Sostituire con: "Rispetto alla maggiore ha la terza, la sesta e la settima nota più basse di un semitono; la più importante è la terza, che la fa suonare più scura, malinconica o seria." |
| filtro-synth | Il suono "acido" con molta risonanza è nato con l'acid house (Roland TB-303); dire solo "tipico della techno" è riduttivo (esiste anche l'acid techno). | Sostituire "(tipico della techno)" con "(tipico dell'acid house e della techno)". |
| genere-techno | Stessa cosa: "Il basso 'acido' con molta risonanza è un suono storico del genere". L'acid è nato nell'acid house, poi entrato nella techno. | Sostituire con: "Il basso 'acido' con molta risonanza (nato con l'acid house) è un suono storico della techno." |
| tempo-bpm / genere-hiphop / genere-lofi | Incoerenza: tempo-bpm dà "hip-hop e lo-fi 70–95", genere-hiphop "80–100", genere-lofi "70–90". | In genere-hiphop sostituire "Velocità tipica 80–100 BPM" con "Velocità tipica 70–100 BPM" (e lasciare "hip-hop e lo-fi 70–95" in tempo-bpm, oppure portarlo a "70–100"). |
| tempo-bpm / genere-house | Incoerenza: tempo-bpm "house 120–128", genere-house "118–128". Wikipedia (House music) dice "115–130" nell'introduzione e "tra 120 e 130 BPM" nel testo. | In genere-house sostituire "118–128 BPM" con "120–128 BPM" (coerente con tempo-bpm e con la fonte). |
| genere-lofi | La fonte citata (Lo-fi music) riguarda il lo-fi in generale, non il lo-fi hip-hop. Inoltre il BPM "70–90" e gli "accordi di settima e nona" non compaiono nella fonte (la pagina del lo-fi hip-hop non dà BPM né accordi): sono valori plausibili e comuni nella pratica, ma non verificati su Wikipedia. | Aggiungere la fonte `Lofi hip-hop (Wikipedia) <https://en.wikipedia.org/wiki/Lofi_hip-hop>` (descrive suoni "poky tempos", fruscio di vinile, melodie di piano o chitarra). Tenere i BPM come "indicativi". |
| genere-reggaeton | La descrizione del dembow è corretta (cassa su ogni battito; rullante sull'ultimo sedicesimo del 1° battito e a metà del 2°, cioè lo schema 3+3+2, ripetuto per ogni mezza battuta). Ma la fonte (Reggaeton) non dà il BPM né le posizioni di cassa e rullante: dice solo "3+3+2 (tresillo) rhythm, complemented by a bass drum in 4/4". "85–100 BPM" è plausibile ma non verificato. | Aggiungere la fonte `Dembow beat (Wikipedia) <https://en.wikipedia.org/wiki/Dembow_beat>` (descrive il 3+3+2 e "boom-ch-boom-chick"). Lasciare "85–100 BPM" come valore indicativo non confermato. |
| frequenze | Piccolo buco nella scala: "tra 500 Hz e 4 kHz ... sopra i 5 kHz" lascia scoperto 4–5 kHz. | Sostituire "sopra i 5 kHz" con "sopra i 4 kHz". |
| suddivisione | Il conteggio dei sedicesimi "uno-e-e-a" è insolito: lo standard è "uno-e-e-a" solo se si legge "uno, e, ee, a"; di norma si dice "uno-e-and-a" o, in italiano, "uno-e-e-a" con una "e" ripetuta, che confonde. | Sostituire `("uno-e-e-a")` con `("uno-e-ed-a", cioè 1-e-&-a)`. Priorità bassa. |
| sincope | Nella riga `parole:` c'è "fuori tempo": la sincope NON è un ritmo fuori tempo, e un utente che cerca "fuori tempo" potrebbe ricevere la scheda come spiegazione di un errore di tempo. | Togliere "fuori tempo" dalla riga `parole:` (lasciare "off-beat, contrattempo, levare"). |
| compressione / clipping-limiter | Possibile incoerenza sull'app: compressione dice "c'è un limiter che evita le distorsioni", clipping-limiter dice "non distorce in modo brusco". Il CLAUDE.md del progetto dice che il master ha limiter + clipper (un clipper satura). Non è verificabile sul web: da controllare con chi conosce l'app. | Se c'è un clipper: in clipping-limiter sostituire "quindi non distorce in modo brusco" con "quindi distorce poco (limiter e un leggero clipper)". |

## URL da cambiare

| Scheda | URL attuale | Azione |
|---|---|---|
| contorno | https://en.wikipedia.org/wiki/Steps_and_skips (NON ESISTE) | Sostituire con https://en.wikipedia.org/wiki/Interval_(music) |
| genere-lofi | (aggiunta) | Aggiungere https://en.wikipedia.org/wiki/Lofi_hip-hop |
| genere-reggaeton | (aggiunta) | Aggiungere https://en.wikipedia.org/wiki/Dembow_beat |

URL che funzionano ma passano da un redirect (facoltativo aggiornarli):

| Scheda | URL attuale | Redirect verso |
|---|---|---|
| swing | .../Swing_(jazz_performance_style) | .../Swing_time |
| funzioni-armoniche | .../Diatonic_function | .../Function_(music) |
| suddivisione | .../Subdivision_(music) (la scheda cita Note_value, ok) | redirect a Metre_(music) |
| rullante-clap, backbeat-four-on-floor, sincope | .../Backbeat | redirect a Beat_(music)#Backbeat |
| ritmo / contrappunto | .../Countermelody | .../Counter-melody |
| genere-hiphop | .../Hip-hop_music | .../Hip-hop |
| equalizzatore | .../Equalization_(audio) | .../Audio_equalization |

Tutti gli altri URL esistono, non sono pagine di disambiguazione e sono pertinenti. Tutti i domini sono ammessi (solo en.wikipedia.org).

## Schede verificate senza problemi

basi: nota, ottava, semitono-tono, intervallo, scala, scala-maggiore, pentatonica, tonalita, relativa, modi, battito-battuta, tempo-musicale, dinamica.
(tempo-bpm: contenuto corretto, ma vedi incoerenza BPM sopra.)

armonia: accordo, triade-maggiore-minore, accordi-della-scala, funzioni-armoniche, giro-di-accordi, cadenza, tensione-risoluzione, note-in-comune, rivolti, settima, sus, diminuito-aumentato, circolo-quinte, modulazione, accordi-presi-in-prestito.

melodia: melodia, motivo, domanda-risposta, note-accordo, registro-estensione, arpeggio, linea-di-basso, contrappunto.

ritmo: ritmo, groove, cassa, rullante-clap, charleston, backbeat-four-on-floor, ghost-note, fill, swing, poliritmo-terzine.

forma: forma-canzone, strofa-ritornello, intro-outro, ponte, build-drop, arrangiamento, ripetizione-variazione, lunghezza-sezioni (calcolo battute verificato: 120 BPM in 4/4 = 30 battute al minuto, 3-4 minuti = 90-120 battute).

suono: timbro, sintetizzatore, forme-onda, inviluppo, pad, lead-pluck, suono-basso.

effetti: effetti, riverbero, delay, filtro-effetto, equalizzatore, distorsione.

mix: mix, volume-db (+6 dB circa x2 in ampiezza e +10 dB circa "il doppio" percepito: corretti), pan, spazio-frequenze, muto-solo, ascolto.

generi: genere-pop, genere-hiphop (salvo BPM), genere-trap (130-150 BPM e rullante sul terzo battito: coerente con Wikipedia, tipico 140), genere-house (salvo BPM), genere-rock.

Schede con solo i problemi minori della tabella: tempo-bpm, scala-minore, filtro-synth, genere-techno, genere-lofi, genere-reggaeton, frequenze, suddivisione, sincope, contorno, compressione, clipping-limiter.

## Coerenza delle affermazioni sull'app (non verificate sul web)

Nessuna contraddizione tra schede, salvo la nota su limiter/clipper sopra. Coerenti tra loro: griglia della batteria a sedicesimi (suddivisione, battito-battuta, poliritmo-terzine), assenza di swing automatico (groove, swing), assenza di arpeggiatore, compressore e sidechain (arpeggio, compressione).
