# Music Studio

Music Studio è un'app per creare musica che gira nel browser, direttamente sul tuo computer. È pensata per chi **non è musicista**: i comandi sono pochi e chiari, i termini tecnici sono spiegati nella guida interna e molte cose sono già pronte da ascoltare e modificare.

Non serve un account, non serve internet (dopo l'installazione) e nessun dato lascia il tuo PC.

## Cosa puoi fare

**Comporre**
- **Linea del tempo del brano**: ogni riga è una traccia (uno strumento), ogni blocco è un pezzo di musica riutilizzabile (un *pattern*). I blocchi si trascinano, si duplicano e si eliminano.
- **Batteria a griglia**: accendi le caselle per creare un ritmo. Ci sono 21 suoni: cassa, rullante, charleston, tom, 808, campanaccio e altri. Piatti, shaker, tamburello, conga e bongo sono registrazioni vere.
- **Ritmi pronti** per 8 generi (pop, hip-hop, lo-fi, house, techno, reggaeton, rock, trap), ognuno in versione *Base* e *Ricco*.
- **Piano roll** per melodie e accordi: disegni, sposti e allunghi le note con il mouse. Le note della scala scelta sono evidenziate.
- **Blocca sulla scala**: le note restano sempre "intonate" con il resto del brano, anche se non conosci la teoria.
- **Intensità** di ogni nota e di ogni colpo, per un suono meno meccanico.
- **Tracce percussione**: un singolo suono di batteria suonato come uno strumento, con effetti e volume tutti suoi.

**Suonare**
- **Sintetizzatore** con 16 suoni pronti (piano elettrico, bassi, archi, pad, chiptune…) e poche manopole comprensibili, più quelle "avanzate" per chi vuole.
- **Tastiera del PC come pianoforte**: tasti `A S D F G H J K` per le note, `Z`/`X` per cambiare ottava.

**Rifinire**
- **Effetti** per ogni traccia: riverbero, eco (delay), filtro, equalizzatore e distorsione.
- **Mixer** con volume, posizione sinistra/destra (pan), muto, solo e indicatori di livello. Un limiter sul volume generale evita le distorsioni.

**Lavorare comodi**
- Annulla e ripeti, copia e incolla, selezione di più note, metronomo e modalità "Solo pattern" per ascoltare in loop solo quello che stai modificando.
- **Ripeti parte**: ascolta in loop sempre le stesse battute del brano, con tutte le tracce. Trascini i bordi della fascia colorata sui numeri delle battute per scegliere da dove a dove, oppure selezioni un blocco e premi **Ripeti blocco**.
- **Salvataggio automatico** nel browser, più **Salva/Apri** su file `.msproj` per conservare i progetti.
- **Esporta WAV** per ottenere il file audio della canzone.
- **Progetti di partenza** (beat elettronico, lo-fi, progetto vuoto) e una **Guida** con primi passi, glossario e scorciatoie da tastiera.

**Imparare**
- **Assistente** (facoltativo): una chat a cui fare domande di teoria musicale o chiedere idee sul tuo brano. Vede il brano mentre lo crei, ma non lo modifica mai: spiega e consiglia, la musica la fai tu. Prima di rispondere consulta una **biblioteca** di 90 schede di teoria verificate e sotto la risposta mostra le **fonti** (pagine di Wikipedia) da cui sono state ricavate. Funziona con un modello di intelligenza artificiale che gira sul tuo PC (vedi [Assistente](#assistente-facoltativo)).

## Requisiti

| Cosa | Dettagli |
|---|---|
| **Node.js** | Versione 22.12 o successiva (consigliata l'ultima LTS). Si scarica da [nodejs.org](https://nodejs.org). |
| **Browser** | Una versione recente di **Google Chrome** o **Microsoft Edge**: l'app è sviluppata e provata su questi. |
| **Sistema operativo** | Windows per l'avvio con doppio clic. Su macOS e Linux funziona da terminale. |
| **Spazio** | Circa 150 MB per le dipendenze installate da npm. |

## Installazione e avvio

### Il modo più semplice (Windows)

1. Scarica il progetto: pulsante verde **Code → Download ZIP** su GitHub, poi estrai la cartella. Oppure `git clone`.
2. Installa [Node.js](https://nodejs.org) se non ce l'hai.
3. Fai doppio clic su **`avvia.bat`**.

La prima volta installa le dipendenze, e ci vogliono alcuni minuti. Poi l'app si apre da sola nel browser all'indirizzo `http://127.0.0.1:5173`.
Lascia aperta la finestra nera mentre usi l'app: chiudendola, l'app si spegne. I tuoi progetti restano salvati.

### Da terminale (tutti i sistemi)

```bash
npm ci          # installa le dipendenze (una volta sola)
npm run dev     # avvia l'app su http://127.0.0.1:5173
```

Apri l'indirizzo nel browser e premi **Inizia**.

## Assistente (facoltativo)

L'assistente usa [LM Studio](https://lmstudio.ai), un programma gratuito che fa girare un modello di intelligenza artificiale sul tuo computer. Senza LM Studio l'app funziona lo stesso: solo la chat non risponde.

1. Installa LM Studio e scarica **Gemma 4 E4B** (versione Q4_K_M), consigliato con una scheda video da 8 GB: l'app lo sceglie da sola se è disponibile.
2. Consigliato: scarica anche **bge-m3** (`gpustack/bge-m3-GGUF`, versione Q8_0, circa 600 MB). È un piccolo modello che serve all'assistente per cercare nella biblioteca le schede giuste "per significato", anche quando usi parole diverse da quelle delle schede. Senza bge-m3 l'assistente cerca solo per parole chiave: funziona, ma trova un po' meno.
3. Avvia il server locale di LM Studio sulla porta 1234 e carica i due modelli. Il modo più sicuro, valido per ogni versione, è da terminale:
   ```bash
   lms server start
   lms load google/gemma-4-e4b --context-length 16384 --gpu max
   lms load text-embedding-bge-m3
   ```
   Se `lms` non viene trovato, su Windows si trova in `%USERPROFILE%\.lmstudio\bin\lms.exe`. Con `lms ps` vedi i modelli caricati e il loro contesto. Lascia disattivata l'opzione per servire il modello sulla rete locale.
4. **Per risposte veloci** (10–20 secondi invece di 2 minuti):
   - usa una **lunghezza del contesto di 16384**. Il valore proposto da LM Studio (oltre 100 000) non entra nella memoria di una scheda video da 8 GB e rallenta tutto di circa 4 volte; 16384 basta e avanza per la chat;
   - **carica entrambi i modelli** come sopra. Se li lasci caricare "al volo" da LM Studio, ne tiene in memoria uno alla volta e a ogni domanda li scambia, ricaricando Gemma ogni volta.
5. Avvia l'app come sempre e apri **💬 Assistente**.

Le risposte sono generate da un modello piccolo e possono contenere errori. I nomi di note, accordi e scale del tuo brano invece li calcola l'app e glieli passa già pronti.

**Come usa la biblioteca.** A ogni domanda l'app cerca le 3 schede più adatte (per parole chiave e, con bge-m3, per significato, tenendo conto anche della domanda precedente) e le passa al modello insieme alla domanda: così il modello spiega partendo da testi controllati invece che "a memoria". Sotto la risposta compare **Fonti consultate**, con i link alle pagine originali (si aprono in una nuova scheda). La biblioteca si scarica dall'app solo alla prima domanda e viene controllata prima dell'uso; se manca o non è valida, l'assistente risponde comunque, senza schede.

L'assistente parla solo di musica e di come usare l'app: alle domande su altri argomenti risponde che non può aiutare. Non mostra le sue istruzioni interne, e l'app blocca le risposte che provano a ricopiarle. Se il pannello della chat ha un problema, il resto dell'app continua a funzionare.

## Privacy e sicurezza

- Il server di sviluppo ascolta solo su `127.0.0.1`: l'app è raggiungibile soltanto dal tuo computer, non dagli altri dispositivi della rete.
- Non ci sono account, analisi d'uso o chiamate a servizi esterni. L'assistente parla solo con LM Studio sul tuo computer, passando dall'app (`/api/llm`): il tuo brano e le tue domande non escono dal PC.
- I progetti si salvano nel browser e nei file `.msproj` che scegli tu. Ogni file aperto viene controllato prima dell'uso: se è danneggiato o non valido viene rifiutato con un messaggio, e il progetto aperto resta com'era.

## Per sviluppatori

Stack: **TypeScript**, **React**, **Vite**, **Tone.js** (audio), **Zustand** (stato), **zod** (validazione), **Vitest** (test).

```bash
npm test             # test automatici
npm run typecheck    # controllo dei tipi
npm run lint         # controllo dello stile del codice
npm run build        # versione di produzione in dist/
npm run audio:check  # misura il suono e crea spettrogrammi (vedi tools/audio-check/README.md)
npm run knowledge:build  # ricostruisce la biblioteca dell'assistente (serve LM Studio, vedi knowledge/README.md)
npm run knowledge:eval   # misura quanto bene l'assistente trova le schede giuste
```

Organizzazione del codice:

| Cartella | Contenuto |
|---|---|
| `src/project/` | Modello dei dati del progetto, operazioni, preset, ritmi e progetti di partenza |
| `src/music/` | Logica musicale pura: tempi, scale, note, cosa suonare a ogni step |
| `src/state/` | Stato dell'app (con annulla/ripeti) e azioni |
| `src/audio/` | Motore audio: strumenti, batteria, effetti, mixer, export WAV |
| `src/assistant/` | Assistente: riassunto del brano, regole, protezioni, collegamento a LM Studio, ricerca nella biblioteca (`knowledge/`) |
| `src/io/` | Salvataggio automatico, file di progetto, download |
| `src/ui/` | Interfaccia React, divisa per area |
| `tools/audio-check/` | Controllo oggettivo della qualità del suono |
| `knowledge/` | Biblioteca dell'assistente: schede di teoria musicale in italiano (licenza CC BY-SA 4.0) |
| `tools/knowledge/` | Costruzione e misura della biblioteca |
| `docs/research/` | Note di ricerca su funzionalità e concetti musicali |

## Crediti dei suoni

I suoni registrati in `public/samples/` sono di pubblico dominio (**CC0 1.0**) e sono stati leggermente modificati: mono, accorciati e normalizzati.

- **Virtuosity Drums** di Versilian Studios: crash, ride, campana del ride, shaker, conga, bongo. [github.com/sfzinstruments/virtuosity_drums](https://github.com/sfzinstruments/virtuosity_drums)
- **VCSL – Versilian Community Sample Library**: tamburello. [github.com/sgossner/VCSL](https://github.com/sgossner/VCSL)

Ogni cartella contiene un `LICENSE.txt` con il file originale da cui viene ogni suono. Tutti gli altri suoni sono sintetizzati dal codice dell'app.

## Licenza

Per ora il codice di questo progetto non ha una licenza open source. Puoi guardarlo e provarlo, ma per riutilizzarne delle parti contatta l'autore.
I suoni in `public/samples/` restano CC0 e le librerie usate mantengono le loro licenze (MIT e 0BSD).
La biblioteca dell'assistente (`knowledge/` e `public/knowledge/`) è distribuita con licenza CC BY-SA 4.0: vedi `knowledge/README.md`.
