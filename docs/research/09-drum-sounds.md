# 09 - Suoni di batteria: sintesi o campioni?

Domanda: per la drum machine dell'MVP bastano i suoni sintetizzati con Tone.js o conviene usare campioni gratuiti?
Priorità: **MVP** = indispensabile, **v2** = importante, **nice** = nice-to-have.

Nota sull'affidabilità: i giudizi di "qualità" nella sezione 1 sono **valutazioni mie** basate su come funziona la
sintesi di batteria in generale, **non misurate** con un ascolto in questo progetto. Vanno confermate con un prototipo
(vedi sezione 5). Le licenze nella sezione 2 sono verificate dove indicato; il resto è segnato "non verificato".

## 0. Concetti in due parole

- **Sintesi**: il suono è calcolato dal computer (es. un "sinusoide che scende di tono" = cassa elettronica). Zero file, peso 0.
- **Campione (sample)**: la registrazione di un colpo vero (o di una drum machine vera), salvata in un file audio (WAV/MP3).
- **One-shot**: campione di un singolo colpo (un colpo di rullante).
- **Round robin / layer di velocity**: più registrazioni dello stesso colpo (piano, forte) per evitare l'effetto "mitragliatrice"
  identica. Un kit semplice ha 1 sola registrazione per strumento.
- **808 / 909**: drum machine storiche (Roland TR-808 / TR-909), alla base di hip-hop, trap, house, techno. Suono "elettronico".

## 1. Cosa si sintetizza bene con Tone.js

Classi (docs: https://tonejs.github.io/docs/):
- `MembraneSynth`: un oscillatore la cui altezza scende rapidamente (pitch decay); fatto per casse e tom.
  Parametri chiave: `pitchDecay`, `octaves`, `envelope`.
- `NoiseSynth`: rumore (white/pink/brown) con inviluppo di volume; base per rullante, clap, hi-hat.
  Il filtro interno è stato rimosso nelle versioni recenti (note release r7:
  https://newreleases.io/project/github/Tonejs/Tone.js/release/r7): va aggiunto un `Filter` esterno in catena.
- `MetalSynth`: più oscillatori FM inarmonici (suono "metallico") per hi-hat, piatti, cowbell.
- Combinazioni: `NoiseSynth` + `Filter` (highpass/bandpass) + `Distortion`; layer di più voci per un solo strumento
  (es. rullante = tono `MembraneSynth` + rumore filtrato); `Tone.Oscillator` con inviluppo per rimshot/cowbell.
- Esempio base kick/snare/hi-hat con MembraneSynth e NoiseSynth (pitchDecay 0.05, 4 ottave; snare = noise decay 0.15 s;
  hat = noise decay 0.04 s): https://app.cinevva.com/tutorials/tone-js-game-audio (tutorial di terzi, non ufficiale).

| Strumento | Come si fa | Qualità (mia stima) | Stile in cui funziona |
|---|---|---|---|
| Cassa (kick) | `MembraneSynth`, nota ~40-60 Hz, pitchDecay 0.03-0.08, 3-6 ottave, decay 0.3-0.6 s; click iniziale opzionale (noise brevissimo) | **Buona** | Elettronico 808/909 ottimo. Acustico: scarsa (manca corpo/pelle) |
| Rullante (snare) | `MembraneSynth` (tono ~180 Hz, corto) + `NoiseSynth` filtrato highpass ~1-2 kHz | **Accettabile/buona** | 909/electro ok; acustico poco convincente |
| Clap (battito di mani) | `NoiseSynth` + bandpass ~1-2 kHz, inviluppo con 3-4 "rimbalzi" ravvicinati (re-trigger a pochi ms) + coda | **Accettabile** | Elettronico (house, trap). Le mani vere: no |
| Hi-hat chiuso | `MetalSynth` (frequenza ~200-400, resonance alta, decay ~0.05 s) o noise highpass | **Buona** | Elettronico ottimo; acustico accettabile |
| Hi-hat aperto | come sopra, decay ~0.3-0.5 s; deve **spegnere** il chiuso (choke) | **Buona** | Elettronico |
| Tom | `MembraneSynth` con pitch più alto e pitchDecay più lungo, 3 altezze | **Buona** | Elettronico (tom "pew" stile disco/808). Acustico: scarsa |
| Crash | `MetalSynth` + noise, decay 1-2 s | **Scarsa/accettabile** | Si sente "sintetico/metallico a tubo" |
| Ride | `MetalSynth` con decay lungo + ping iniziale | **Scarsa** | Poco credibile |
| Cowbell | 2 oscillatori quadri ~540 e ~800 Hz + bandpass (ricetta 808) o `MetalSynth` | **Buona** | 808 |
| Rimshot / claves | oscillatore corto + noise brevissimo | **Buona** | 808 |
| Shaker / maracas | `NoiseSynth` + bandpass, attack lento ~20-40 ms | **Accettabile** | Elettronico/latin leggero |

Sintesi:
- Per **elettronica (808/909, house, hip-hop, trap)**: la sintesi è **adeguata** per kick, snare, hat, tom, clap, cowbell, rim.
- Per **batteria acustica realistica** e per **piatti (crash/ride)**: la sintesi è **debole**; servono campioni.
- Vantaggi della sintesi: zero byte da scaricare, nessun problema di licenza, parametri regolabili (tono, decadimento),
  avvio istantaneo, `Tone.Offline` la renderizza senza problemi. Svantaggi: bisogna "disegnare" i preset a orecchio.
- **Non verificato**: le impostazioni numeriche sopra sono punti di partenza tipici, da rifinire ascoltando.
- Difficoltà: bassa per kick/tom/hat/cowbell; media per snare/clap; alta se si vuole realismo acustico.

## 2. Librerie di campioni gratuite (stato delle licenze)

"Includibile nel repo" = la licenza permette di mettere i file nel repository/app e ridistribuirli.

| Libreria | URL | Licenza (verifica) | Formato / dimensione | Stile | Nel repo? |
|---|---|---|---|---|---|
| **Virtuosity Drums** (Versilian Studios) | https://versilian-studios.com/virtuosity-drums/ | **CC0** (dichiarato sulla pagina ufficiale e su KVR) | SFZ + WAV/FLAC; **1,1 GB** (+1,1 GB installer) | Batteria acustica jazz, 6 microfoni | Sì legalmente, ma **troppo grande**: servirebbe estrarre pochi colpi |
| **Dustyroom Fake Acoustic Drum Kit** | https://dustyroom.itch.io/fake-acoustic-drum-kit | **CC0 riportato solo da articolo terzo** (https://rekkerd.org/?p=117148); la pagina itch.io **non** riporta licenza | 504 WAV 24-bit/48 kHz; zip 159 MB | "Finta acustica" generata con synth FM8 | Probabilmente sì, **da confermare con l'autore** |
| **Dustyroom Static Kit** | https://soundpacks.com/free-sound-packs/dustyroom-static-kit/ | **CC BY 4.0** (secondo la fonte) | WAV | Elettronico | Sì con attribuzione (non CC0) |
| **Hydrogen - Audiophob kit** | elenco Debian: https://metadata.ftp-master.debian.org/changelogs/main/h/hydrogen-drumkits/stable_copyright | **CC0** | `.h2drumkit` (archivio con WAV/FLAC), dimensione non verificata | Non verificato | Sì (CC0) |
| **Hydrogen - altri kit** | stesso elenco Debian | Misti: GPL-2/GPL-2+ (Artemio, Millo, Glen MacArthur...), CC-BY-SA-3.0 (circAfrique, BJA_Pacific), CC-BY-3.0 (rumpf) | `.h2drumkit` | Vari | **Sconsigliati**: GPL/SA = obblighi "copyleft" che si estenderebbero all'app o ai brani; il feed ufficiale contiene anche kit non commerciali |
| **Hydrogen - GMRockKit, TR808EmulationKit** | incluse in Hydrogen | **Licenza non verificata** (non trovata) | - | Rock / 808 | Non usare senza leggere `drumkit.xml` |
| **MusicRadar SampleRadar** | https://www.musicradar.com/news/sampleradar-378-free-808-drum-samples | "Royalty-free: usali nella tua musica, ma **non ridistribuirli**" (testo di articoli SampleRadar; termini ufficiali non letti) | WAV in zip | 808 e molti altri | **No**: ridistribuzione vietata, quindi non nel repo/app |
| **Tone.js `Tonejs/audio` (drum-samples)** | https://github.com/Tonejs/audio/tree/master/drum-samples | **Nessuna licenza trovata** nel repo; il README dice che i file vengono da `cwilso/web-audio-samples`, anch'esso senza licenza visibile | WAV/MP3; cartelle: CR78, KPR77, LINN, R8, Stark, Techno, 4OP-FM, acoustic-kit, Kit3, Kit8, Bongos... | Drum machine storiche (campionate) | **No / non sicuro**: ok solo per prove personali locali |
| **Citizen DJ (Library of Congress)** | https://citizen-dj.labs.loc.gov/loc-fma/remix/ | Derivati **CC BY-SA 4.0** (kit originali CC BY-SA 3.0) | WAV/MP3 | Vari | Solo se si accetta lo ShareAlike; sconsigliato |
| **Freesound.org (filtro CC0)** | https://freesound.org | Licenza **per singolo file** (CC0, CC BY, CC BY-NC...). Nessun pack CC0 808 specifico verificato | WAV/FLAC/MP3 | Qualsiasi | Sì per i file CC0 scelti uno a uno (richiede tempo e login per scaricare) |

Altre note:
- **Salamander** (citata nella richiesta) è un pianoforte, non una batteria: non pertinente.
- Nessun kit 808/909 in pubblico dominio verificato: la ricerca non ne ha trovati con licenza esplicita. I suoni originali
  Roland sono un marchio/prodotto commerciale; molti "kit 808 gratis" sono solo "royalty-free" e **non** CC0.
- Per i kit "royalty-free" vale la regola: puoi usarli per **fare musica** (anche pubblicarla), ma non puoi **ridistribuire i file**
  dentro un'app. Per un uso strettamente locale e personale va bene, ma se un giorno l'app fosse pubblicata no.

## 3. Cosa comporta usare i campioni (tecnica)

| Aspetto | Dettaglio |
|---|---|
| Classe | `Tone.Players` (un file per strumento: kick.wav, snare.wav...) è la scelta giusta per i kit; `Tone.Sampler` serve per strumenti intonati (una nota, ripitchata) |
| Caricamento | asincrono; `await Tone.loaded()` prima di suonare. Mostrare "caricamento..." |
| Peso | One-shot WAV mono 16 bit 44,1 kHz: ~20-100 KB ciascuno. Un kit da 10-12 strumenti = ~0,3-1 MB. In MP3/OGG ancora meno ma con piccola perdita |
| Dove metterli | `public/samples/<kit>/*.wav` e URL relativi (`/samples/kit/kick.wav`). Il dev server è su 127.0.0.1 |
| CSP `'self'` | Vanno bene: `connect-src 'self'` (fetch dei file) e nessun dominio esterno. **Non** caricare campioni da CDN/GitHub raw: richiederebbe di allargare la CSP. `Tone.Players` usa `fetch` + `decodeAudioData`, non `<audio>`, quindi non serve `media-src` (da verificare nel prototipo) |
| Validazione | I file del kit incluso nell'app sono fidati. Se in futuro l'utente importa sample suoi: limite di dimensione/durata, decodifica in `try/catch`, validazione zod dei metadati del kit (nome, mapping) |
| Export WAV | `Tone.Offline` deve ricaricare/riusare i buffer: usare `Tone.ToneAudioBuffers`/buffer già decodificati per evitare attese nel render (da verificare) |
| Progetto | Salvare nel progetto solo l'**id del kit** (es. `"kit":"808-synth"`), non i campioni |
| Licenza | Tenere un file `public/samples/<kit>/LICENSE.txt` con fonte, URL, licenza e data di verifica |
| Difficoltà | Bassa (Players) / media (gestione caricamento, choke dell'hi-hat, kit selezionabili) |

## 4. Raccomandazione per l'MVP

1. **MVP (consigliato): solo sintesi.** Un kit elettronico "808-style" e uno "909-style" realizzati con
   `MembraneSynth`/`NoiseSynth`/`MetalSynth` + filtri: kick, snare, clap, closed hat, open hat, 3 tom, cowbell, rimshot, shaker.
   Motivi: nessun peso né licenza, avvio immediato, suoni regolabili con 2-3 manopole semplici
   (es. "Tono", "Durata", "Secco/Punch"), perfetto per l'utente non musicista che vuole un beat subito;
   la CSP `'self'` resta intatta.
2. **Piatti (crash/ride)**: nell'MVP includerli sintetizzati ma segnalarli come "stile elettronico"; non promettere realismo.
3. **v2: kit a campioni opzionale.** Aggiungere un'interfaccia comune `DrumVoice` (trigger(time, velocity)) con due
   implementazioni (sintetica e `Players`), così il sequencer non cambia. Fonti candidate, in ordine:
   - Audiophob (Hydrogen, CC0) per un kit elettronico (da ascoltare prima: qualità non verificata);
   - singoli file **CC0 da Freesound** scelti a mano per crash/ride/acustica;
   - Dustyroom Fake Acoustic, **solo dopo** conferma esplicita della licenza CC0 dall'autore;
   - Virtuosity Drums (CC0) estraendo ~10-20 colpi (kick, snare, hat, tom, crash, ride): la qualità acustica migliore,
     ma richiede lavoro di conversione dal formato SFZ e controllo del peso.
4. **Da evitare nel repo**: SampleRadar (non ridistribuibile), Tonejs/audio e web-audio-samples (licenza assente),
   kit Hydrogen GPL/CC-BY-SA, Citizen DJ (SA).
5. **Uso solo locale**: per prove personali si può usare qualunque kit "royalty-free", ma tenerlo **fuori dal repo** (gitignore)
   se non ha licenza di ridistribuzione.

## 5. Dubbi / passi di verifica

- Prototipare i 6 suoni base (kick, snare, clap, hat chiuso/aperto, tom) e **ascoltarli**: la mia stima di qualità non è testata.
- Confermare la licenza CC0 di Dustyroom Fake Acoustic (contattare l'autore o trovare un file LICENSE nello zip).
- Leggere il campo license in `drumkit.xml` di Audiophob e dei kit Hydrogen che interessano.
- Se si userà Freesound: annotare per ogni file URL dell'autore e licenza (CC0 non richiede attribuzione, ma è buona pratica).
- Decisione per l'utente: accettare "MVP solo sintesi" (consigliato) oppure ritardare l'MVP per i campioni?

## Fonti

- Tone.js docs: https://tonejs.github.io/docs/ ; release r7: https://newreleases.io/project/github/Tonejs/Tone.js/release/r7
- Tutorial kick/snare/hat: https://app.cinevva.com/tutorials/tone-js-game-audio
- Virtuosity Drums: https://versilian-studios.com/virtuosity-drums/
- Dustyroom: https://dustyroom.itch.io/fake-acoustic-drum-kit , https://rekkerd.org/?p=117148
- Licenze kit Hydrogen (copyright Debian): https://metadata.ftp-master.debian.org/changelogs/main/h/hydrogen-drumkits/stable_copyright
- Licenze Hydrogen (manuale): https://hydrogen-music.org/documentation/manual/manual_en_chunked/ch20s02.html
- Tonejs/audio: https://github.com/Tonejs/audio/tree/master/drum-samples ; web-audio-samples: https://github.com/cwilso/web-audio-samples
- SampleRadar: https://www.musicradar.com/news/sampleradar-378-free-808-drum-samples ; Citizen DJ: https://citizen-dj.labs.loc.gov/loc-fma/remix/
