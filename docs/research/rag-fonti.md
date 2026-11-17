# RAG musicale (fase 2): fonti libere, embedding, ricerca

Data della ricerca: 2026-11-12. Le licenze sono state lette sulle pagine ufficiali o su copie che le citano; dove non è stato possibile è scritto. Non è consulenza legale.

Cos'è un RAG, in breve: prima di rispondere, l'assistente cerca in una raccolta di testi (il "corpus") i pezzi più pertinenti alla domanda e li passa al modello, che risponde basandosi su quelli. Ogni pezzo ("chunk") ha un "embedding": una lista di numeri che ne rappresenta il significato. Si confrontano i numeri della domanda con quelli dei pezzi e si prendono i più vicini.

## 1. Fonti con licenza libera

Sigle: BY = serve citare l'autore. SA (share-alike) = se modifichi il testo e lo ridistribuisci, la tua versione deve avere la stessa licenza.

| Fonte | Licenza (verificata) | Lingua | Formato | Dimensione | Uso |
|---|---|---|---|---|---|
| Open Music Theory v2 (Gotham et al., 2021) | CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/). Letta sulla copia LibreTexts ("shared under a CC BY-SA 4.0 license", adattata da viva.pressbooks.pub); il sito Pressbooks ha risposto 403 al mio strumento, quindi non l'ho letta lì | EN | Pressbooks (HTML), mirror LibreTexts per pagina | circa 1000 pagine stampate (Scribd); la parte utile ne è una frazione | **MVP** |
| Wikipedia EN | CC BY-SA 4.0 (testo; nuovi contributi dal 2023) | EN | HTML / API / dump | circa 120 voci scelte, vedi sotto | **MVP** |
| Wikipedia IT | CC BY-SA 4.0 (letta nel piè di pagina di it.wikipedia) | IT | idem | Molte voci sono brevi o "abbozzi" (es. "Progressione armonica": circa 300 parole, senza fonti) | **MVP** (solo voci decenti) |
| Wikibooks EN "Music Theory" | CC BY-SA 4.0 (piè di pagina) | EN | wikitesto / HTML | Molti capitoli incompleti; sviluppati: Blues, Metal, Scales and Intervals | v2 (selezione) |
| Wikibooks EN "Sound Synthesis Theory" (D. Karras) | CC BY-SA 4.0 (letta sulla pagina) | EN | wikitesto | Incompleto: Subtractive Synthesis 0%, FM 0%, Oscillators 75%, Modulation 75% | v2 (solo capitoli >50%) |
| Wikibooks IT "Teoria musicale" | CC BY-SA 4.0 (piè di pagina) | IT | wikitesto | "Libro abbandonato"; "Armonia" circa 5400 parole, capitoli su note, scale, durate | v2 |
| Music Theory for the 21st-Century Classroom (R. Hutchinson, Puget Sound) | **GNU FDL 1.2 o successiva**, senza sezioni invarianti (colophon). Il catalogo Open Textbook Library la elenca come "Free Documentation License (GNU)" | EN | HTML (PreTeXt) | Corso universitario di 4 semestri, molto di più del necessario | Sconsigliata (vedi sotto) |

Fonti NON utilizzabili (NC):
- "Music Theory 21c" di Toby Rush (tobyrush.com/book): CC BY-NC-SA 4.0. Nome simile al libro di Hutchinson, non confonderli.
- "Fisica, onde, musica" (Unimore, fisicaondemusica.unimore.it, in italiano, acustica/scale/armonia): CC BY-NC-SA 2.5 Italia. Peccato: sarebbe stata la fonte italiana ideale.
- "Music Theory (LibreTexts)" generico: CC BY-NC-SA 3.0 (secondo i risultati di ricerca, non verificato sulla pagina).
- Booklet Sonic Pi della MagPi: CC BY-NC-SA 3.0.
- Il manuale FLOSS di Csound: licenza non verificata, non usare finché non la si legge.

### Cosa copre Open Music Theory v2 (indice LibreTexts verificato)
Capitoli: 1 Fundamentals, 2 Counterpoint, 3 Form, 4 Diatonic Harmony, 5 Chromaticism, 6 Jazz, 7 Popular Music, 8 Techniques 20th/21st c., 9 Twelve-Tone, 10 Orchestration, 11 Rhythm and Meter, 12 Anthology, 13 Workbook, 14 Ear Training.
Il cap. 7 (14 pagine) è il più utile: Rhythm and Meter in Pop, Drumbeats, Melody and Phrasing, forma pop (AABA, strofa-ritornello), schemi armonici (Four-Chord, Blues, Modali, Pentatonici...). Da prendere: 1 (scale, intervalli, accordi, ritmo), 3 (parti sulla forma), 7 intero, 11. Da saltare: 2, 5, 8, 9, 10, 12, 13.

Mappa argomenti -> fonti:
- Scale, accordi, progressioni, ritmo, forma, melodia: Open Music Theory (EN), Wikipedia, Wikibooks.
- Arrangiamento, generi: Wikipedia (voci sui generi) e OMT cap. 7 (solo pop post-1950).
- Sound design/sintesi, effetti, mixaggio: **non ho trovato nessun libro aperto adatto** (ricerca fatta su testi di produzione/mixing: tutti commerciali). Restano le voci Wikipedia e "Sound Synthesis Theory" (incompleto). Qui il corpus sarà debole: vedi sezione 3.

### Voci Wikipedia suggerite (circa 120; i titoli vanno controllati uno a uno, non li ho verificati tutti)
- Teoria: Scale, Chord progression, Circle of fifths, Interval, Mode, Tempo, Time signature, Syncopation, Rhythm, Melody, Song structure, Key signature.
- Sintesi e suono: Subtractive synthesis, Wavetable synthesis, Frequency modulation synthesis, Envelope (music), Low-frequency oscillation, Sampler, Drum machine, Music sequencer, MIDI, Quantization (music), Polyphony.
- Effetti e mix: Reverberation, Delay (audio effect), Chorus effect, Flanging, Phaser (effect), Distortion (music), Dynamic range compression, Equalization (audio), Limiter, Sidechain, Audio mixing (recorded music), Panning (audio).
- Generi: House, Techno, Trance, Drum and bass, Hip hop, Synth-pop, Pop music.
Stima (da misurare): una voce lunga dà 15-30 chunk da circa 300 parole.

### Obblighi di licenza e conseguenze per il repo
- **CC BY-SA 4.0** (OMT, Wikipedia, Wikibooks): obbligo di citare autore/fonte, linkare la licenza, **indicare che il testo è stato modificato** (qui: diviso in pezzi, eventualmente tradotto/riassunto). Il pezzo di testo salvato nel repo è un'opera derivata: va ridistribuito sotto CC BY-SA 4.0 (o licenza compatibile elencata da CC).
- Il codice **non** è contagiato. Secondo le FAQ di Creative Commons, la clausola SA scatta solo se si adatta un'opera; una raccolta può avere una licenza propria e ogni opera resta con la sua (https://creativecommons.org/faq/). Quindi: cartella dati CC BY-SA 4.0, resto del repo senza licenza (tutti i diritti riservati, che è il default). Il repo non dichiara una licenza per il codice: va bene, ma la cartella dati deve dichiarare la sua, altrimenti i riutilizzatori non sanno cosa possono fare.
- Gli **embedding** (liste di numeri calcolate dai pezzi): se siano "derivati" è giuridicamente incerto. Soluzione prudente e a costo zero: mettere anche loro nella cartella CC BY-SA.
- Wikipedia (Termini d'uso 7.7, https://foundation.wikimedia.org/wiki/Policy:Terms_of_Use): per citare basta un link alla pagina riusata, o un link a una copia stabile che elenchi gli autori, o l'elenco degli autori. Il link alla singola voce è la strada più semplice. Il testo solo-GFDL non è importabile in Wikipedia: segnale che GFDL e CC BY-SA non si mescolano bene.
- **GFDL** (Hutchinson): copyleft più pesante (testo della licenza da includere, regole sulle copie). Va tenuta in una cartella a parte con la sua licenza, e non unita ai pezzi CC BY-SA. Dato che OMT copre già il bisogno, la scarterei.
- Le immagini/spartiti delle fonti hanno licenze proprie: **estrarre solo il testo**.

## 2. Modelli di embedding multilingue (GGUF)

Cosa serve sapere: a runtime si calcola l'embedding solo della domanda (breve): va bene anche su CPU. Gli embedding dei pezzi si precalcolano una volta e si salvano nel repo, quindi **in costruzione e a runtime si deve usare lo stesso file GGUF** (anche la quantizzazione cambia leggermente i numeri). Il prefisso è un'etichetta che il modello si aspetta davanti al testo: dimenticarlo peggiora i risultati.

| Modello | GGUF (MB) | Dim. | Prefissi | Licenza | Note e qualità verificata |
|---|---|---|---|---|---|
| **bge-m3** (BAAI, circa 0.6B) | Q4_K_M 438, Q6_K 499, Q8_0 635 (gpustack, non ufficiale) | 1024 | nessuno | MIT | Contesto 8192 token, "100+ lingue". Nessun punteggio MIRACL numerico sulla scheda (solo un grafico). Entra in 1,5 GB anche in Q8 |
| **nomic-embed-text-v2-moe** (475M tot., 305M attivi) | Q4_K_M 328, Q8_0 488 (MiB, repo ufficiale nomic-ai) | 768 (riducibile a 256) | `search_query: ` e `search_document: ` obbligatori | Apache-2.0 | **MIRACL 65,80, BEIR 52,86** vs mE5-base 62,30 / 48,88 (scheda ufficiale). Contesto 512 token. LM Studio è citato come supportato, ma non ho verificato la versione minima |
| multilingual-e5-small | Q8_0 circa 126 | 384 (non verificato) | `query: ` / `passage: ` | MIT | GGUF non ufficiali; dimensione dichiarata dall'autore del caricamento |
| multilingual-e5-base | Q8_0 circa 303 | 768 (non verificato) | `query: ` / `passage: ` | MIT | MIRACL 62,30 (citato dalla scheda nomic) |
| multilingual-e5-large | non verificata | 1024 | `query: ` / `passage: ` | MIT | Scheda ufficiale: Mr.TyDi 70,5 MRR@10; nessun MIRACL |
| **Qwen3-Embedding-0.6B** (non nella tua lista) | Q8_0 639 (ufficiale Qwen) | fino a 1024 (32-1024) | istruzione facoltativa in inglese (+1-5% dichiarato) | Apache-2.0 | MTEB multilingue 64,33 (media task). Contesto 32K. Compatibilità LM Studio non verificata |
| EmbeddingGemma-300M (non nella lista) | Q8_0 334 | 768 | `task: search result \| query: ...` e `title: none \| text: ...` | **Licenza Gemma** (con accettazione dei termini Google, non OSI) | MTEB multilingue 61,15. Contesto 2048. Ridistribuire dati derivati: dubbio, meglio evitare |
| snowflake-arctic-embed-l-v2.0 (568M) | solo GGUF di terzi (limcheekin) | 1024 (256 con MIRACL 54,3) | non verificato | Apache-2.0 | MIRACL medio 55,8 sulla loro tabella (metodo diverso, non confrontabile) |
| granite-embedding-278m-multilingual | non verificato | 768 | non verificato | non letta sulla pagina (ricordo Apache-2.0: da verificare) | MIRACL medio 58,3 su 18 lingue; contesto 512 |
| **jina-embeddings-v3** | - | 1024 | task | **CC BY-NC 4.0** | **Non utilizzabile**: licenza non commerciale (l'uso commerciale richiede licenza a pagamento) |

Avvertenze oneste:
- I numeri MIRACL/MTEB di schede diverse **non sono confrontabili** tra loro (lingue e metodi diversi). L'unico confronto diretto verificato è nomic v2 (65,8) contro mE5-base (62,3).
- Non ho trovato punteggi specifici per la coppia italiano-inglese per nessun modello. L'unico modo serio è misurarlo (sezione 4).
- VRAM: con circa 1,5 GB liberi entrano tutti quelli sotto 650 MB, ma l'embedding può girare su CPU senza problemi (una frase breve = decine di ms). Così non si contende la VRAM con Gemma.
- Se Gemma e il modello di embedding sono caricati insieme in LM Studio, controllare che LM Studio non scarichi uno dei due.

## 3. Alternative e complementi

| Opzione | Pro | Contro | Giudizio |
|---|---|---|---|
| Tradurre la domanda in inglese con Gemma prima della ricerca | Cerca inglese contro inglese: il caso più facile per ogni modello. Semplice (un prompt) | +1 chiamata al LLM (secondi), possibili errori sui termini ("cassa" = kick, "battuta" = measure/bar), ulteriore carico sulla VRAM | **Sì, ma come aggiunta**: cercare con domanda originale + traduzione e unire i risultati |
| Ricerca per parole chiave (BM25) + embedding ("ibrida") | Un termine esatto come "sidechain", "ADSR", "LFO" si trova sempre; non dipende dal modello. Libreria JS leggera (MiniSearch, Orama) e unione con Reciprocal Rank Fusion (k=60 è il valore classico) | BM25 non attraversa le lingue: una domanda italiana non trova testi inglesi. Serve un campo "parole chiave italiane" per ogni pezzo | **Sì**, a patto di avere le parole chiave italiane |
| Corpus in italiano | Elimina il problema cross-lingua alla radice; risposte più naturali | Fonti libere italiane scarse e brevi (Wikipedia IT, Wikibooks IT abbandonato); la fonte migliore (Unimore) è NC. Tradurre i pezzi con Gemma E4B può introdurre errori e la traduzione è comunque un derivato CC BY-SA | **Sì, ma piccolo**: schede scritte da noi (vedi sotto) |

Idea concreta a più alto rendimento: **schede in italiano scritte da noi**, circa 80-150 voci brevi (100-200 parole), una per concetto dell'app (ADSR, filtro, riverbero, compressore, sidechain, velocity, quantizzazione, scale, accordi di quattro note, progressioni pop, struttura strofa/ritornello...), ciascuna con "come suona / a cosa serve", parole chiave italiane e inglesi e il nome del controllo nell'app. Se sono originali, nostre; se riassumono una fonte CC BY-SA, vanno marcate come derivate con la fonte. Coprono proprio il buco di sintesi/effetti/mix dove non ci sono libri aperti, e fanno da ancora italiana per la ricerca.

## 4. Raccomandazione finale

**Fonti, in ordine**
1. Schede italiane proprie (100-150 pezzi): MVP. Copertura di effetti, mixer, sintesi e linguaggio dell'app.
2. Open Music Theory v2, parti selezionate (cap. 1, 3 parziale, 7, 11): circa 60-80 pagine, indicativamente 600-900 pezzi. Scale, accordi, progressioni, ritmo, forma pop, melodia.
3. Wikipedia EN (circa 80-100 voci) e Wikipedia IT (voci di qualità): circa 2000-3000 pezzi. Effetti, sintesi, generi.
4. v2: Wikibooks (Music Theory, solo capitoli sviluppati; Sound Synthesis Theory capitoli >50%).
Stime di spazio, da confermare: 3000 pezzi x 1024 numeri in float32 sono circa 12 MB (in float16 circa 6 MB); testo circa 3-5 MB.

**Embedding**: partire da **bge-m3 Q8_0** (635 MB, MIT, nessun prefisso, contesto lungo, progettato per il multilingue) e confrontarlo con **nomic-embed-text-v2-moe Q8_0** (488 MiB, unico con vantaggio MIRACL verificato su mE5, stessa dimensione 768 del modello attuale). Decidere con un test: 40-50 domande italiane reali con il pezzo giusto indicato, misurando se il pezzo giusto è tra i primi 3. Il test attuale (5 domande) è troppo piccolo per scegliere.

**Pipeline consigliata**: domanda -> (a) embedding della domanda italiana, (b) traduzione inglese con Gemma ed embedding, (c) BM25 sulle parole chiave -> unione con RRF -> primi 3-4 pezzi al modello. Il modello risponde in italiano e il pezzo di sorgente inglese serve solo da contesto.

**Attribuzione nel repo**
- `knowledge/` con licenza propria: `knowledge/LICENSE-DATA.md` (CC BY-SA 4.0 con link), più eventuali cartelle separate per licenze diverse. Un file `CREDITS.md` che elenca ogni fonte: titolo, autori, URL, licenza, data di prelievo.
- Per ogni pezzo nel file JSON: `sourceTitle`, `sourceUrl`, `authors`, `license` (es. "CC BY-SA 4.0"), `licenseUrl`, `revision` (per Wikipedia: l'oldid), `retrievedAt`, `modified` ("diviso in pezzi/tradotto"), `embeddingModel` (nome file e hash).
- UI: sotto ogni risposta una riga "Fonti: Titolo, Autori, CC BY-SA 4.0 (link)", cliccabile. Costa poco e rispetta l'obbligo di citazione.
- Script di build in `tools/` che scarica il testo (API Wikipedia, mirror LibreTexts per OMT: il sito Pressbooks blocca i client automatici con 403) e produce pezzi e metadati in modo ripetibile.
- Testare con un validatore zod anche il file del corpus (come per gli altri file importati).

## Dubbi aperti per l'utente
1. Il repo sarà anche usato commercialmente? Se sì, le fonti NC restano escluse (lo sono già); se no, resterebbero comunque da escludere perché non ridistribuibili.
2. Accettare che la cartella `knowledge/` sia CC BY-SA 4.0 mentre il codice resta senza licenza?
3. Scrivere noi le schede italiane (consigliato) o farle generare a Gemma e poi rivederle?
4. Quale versione di LM Studio è installata? Serve per sapere se nomic v2 MoE e Qwen3-Embedding sono caricabili (non verificato).

## Fonti consultate
- Open Music Theory 2e su LibreTexts: https://human.libretexts.org/Bookshelves/Music/Music_Theory/Open_Music_Theory_2e_(Gotham_et_al.)
- Open Music Theory (Pressbooks; non raggiungibile dal mio strumento): https://viva.pressbooks.pub/openmusictheory/
- Capitolo 7 su LibreTexts: https://human.libretexts.org/Bookshelves/Music/Music_Theory/Open_Music_Theory_2e_(Gotham_et_al.)/07%3A_Popular_Music
- Hutchinson (colophon GFDL): https://musictheory.pugetsound.edu/mt21c/frontmatter-3.html ; catalogo: https://open.umn.edu/opentextbooks/textbooks/music-theory-for-the-21st-century-classroom
- Music Theory 21c (NC): https://tobyrush.com/book/
- Fisica, onde, musica (NC): https://fisicaondemusica.unimore.it/Copyrights.html
- Wikimedia Terms of Use: https://foundation.wikimedia.org/wiki/Policy:Terms_of_Use
- CC BY-SA 4.0: https://creativecommons.org/licenses/by-sa/4.0/ ; FAQ: https://creativecommons.org/faq/
- Wikibooks: https://en.wikibooks.org/wiki/Music_Theory , https://en.wikibooks.org/wiki/Sound_Synthesis_Theory , https://it.wikibooks.org/wiki/Teoria_musicale
- it.wikipedia esempio: https://it.wikipedia.org/wiki/Progressione_armonica
- Modelli: https://huggingface.co/BAAI/bge-m3 , https://huggingface.co/gpustack/bge-m3-GGUF , https://huggingface.co/nomic-ai/nomic-embed-text-v2-moe , https://huggingface.co/nomic-ai/nomic-embed-text-v2-moe-GGUF , https://huggingface.co/intfloat/multilingual-e5-large , https://huggingface.co/Qwen/Qwen3-Embedding-0.6B-GGUF , https://huggingface.co/google/embeddinggemma-300m , https://huggingface.co/ggml-org/embeddinggemma-300M-GGUF , https://huggingface.co/Snowflake/snowflake-arctic-embed-l-v2.0 , https://huggingface.co/jinaai/jina-embeddings-v3 (licenza CC BY-NC 4.0 da risultati di ricerca), https://arxiv.org/pdf/2502.20204 (Granite)
