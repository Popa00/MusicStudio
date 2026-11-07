## Campioni scelti per piatti

(Sezione da incollare in fondo a `11-percussioni.md`, prima di "Fonti": gli strumenti di modifica non erano disponibili e il file supera già 200 righe.)

Ricerca del 2026-11-06. Verificato leggendo le pagine web; i file audio NON sono stati scaricati né ascoltati: durate, rumore e canali reali dei file Virtuosity sono da misurare (dove scritto "stima" è dedotto dalla dimensione).

### Crash

**1. Virtuosity Drums, crash normale, microfono overhead (CC0, senza login, consigliato)**
- File diretti (GitHub raw, nessun login). 3 livelli di velocity (vl1 piano, vl2, vl3 forte) x 4 round robin (rr1-4):
  - `https://raw.githubusercontent.com/sfzinstruments/virtuosity_drums/master/Samples/oh/crash/oh_crash_crash_vl2_rr1.flac` (1,43 MB)
  - stessa cartella: `oh_crash_crash_vl3_rr1.flac` (1,63 MB), `oh_crash_crash_vl1_rr3.flac` (1,22 MB); tutti `oh_crash_crash_vl{1-3}_rr{1-4}.flac` pesano 1,2-1,6 MB.
  - Variante "sizzle" (con rivetti, sfrigolante): `.../Samples/oh/crash/oh_crash_sizzle_vl2_rr1.flac` (1,25 MB).
- Prova licenza: repo https://github.com/sfzinstruments/virtuosity_drums (etichetta "CC0-1.0 license"); file https://raw.githubusercontent.com/sfzinstruments/virtuosity_drums/master/LICENSE , che inizia con "Creative Commons Legal Code - CC0 1.0 Universal". Il produttore scrive "open source (Creative Commons 0)": https://versilian-studios.com/virtuosity-drums/ . La licenza vale per tutta la libreria, quindi per il singolo file.
- Formato: FLAC. 48 kHz / 24 bit riportato da una fonte secondaria (articolo su KVR/freekontaktina), NON verificato sul file; stereo probabile, non verificato. Durata non misurata: stima 7-10 s (coda lunga, da tagliare e dissolvere).
- Qualità: batteria "house kit" jazz suonata con bacchette (Austin McMahon). Overhead = coppia Blue Hummingbird, "extremely low noise" (manuale PDF). NON è un microfono ravvicinato: suono arioso con un po' di ambiente. Timbro jazz, più scuro/secco di un crash rock. Le cartelle `mid`, `room`, `kickmic`, `lofi` hanno la stessa struttura e licenza.

**2. ankealtd, Meinl Byzance 16" Extra Dry Thin Crash (CC0, Freesound: serve account)**
- Pagina: https://freesound.org/people/ankealtd/sounds/696210/ ; download (login): `https://freesound.org/people/ankealtd/sounds/696210/download/696210__ankealtd__meinl_byzance_16__extra_dry_thin_crash_h_4.wav`
- Licenza (pagina del file): "Creative Commons 0"; si può "copy, modify, distribute and perform the sound" senza chiedere permesso.
- WAV mono, 96 kHz, 32 bit, 900 KB, 2,4 s (coda già sfumata dall'autore, che se ne rammarica).
- Qualità: un solo colpo, nessun layer; microfono dinamico vicino al bordo + AKG più lontano (quindi ravvicinato); registrazione ~2010; rumore non valutato. Versione 18" Medium Thin (7,2 s, 2,6 MB): https://freesound.org/people/ankealtd/sounds/696226/
- Da segnalare: l'autore chiede di non ridistribuire i suoni "come propri senza modifiche". Non è una restrizione della CC0, ma conviene trimmare/convertire e citarlo comunque nei crediti.

### Ride

**1. Virtuosity Drums, ride normale (CC0, senza login, consigliato)**
- `https://raw.githubusercontent.com/sfzinstruments/virtuosity_drums/master/Samples/oh/ride/oh_ride_ride_vl2_rr2.flac` (0,97 MB); tutti `oh_ride_ride_vl{1-3}_rr{1-4}.flac` pesano 0,80-1,11 MB.
- Ride bell (campana, opzionale): `.../Samples/oh/ride/oh_ride_bell_vl2_rr1.flac` (0,66 MB); 3 velocity x 3 round robin, 0,5-1,0 MB.
- Licenza, formato, qualità: come per il crash (CC0-1.0, FLAC 48/24 non verificato, overhead, rumore bassissimo secondo il manuale). Durata non misurata.
- Esiste anche un "flat ride" (usato anche come crash): mappa `Programs/mappings/oh/flatride_ride_map.sfz`; nome file non verificato.

**2. ankealtd, Meinl Byzance 20" Extra Dry Medium Ride (CC0, Freesound: serve account)**
- Pagina: https://freesound.org/people/ankealtd/sounds/696239/ (download con login, stesso schema URL del crash).
- Licenza: "Creative Commons 0". WAV mono 96 kHz 32 bit, 1,8 MB, 4,8 s. Microfono vicino al bordo, un solo colpo, stesso avviso dell'autore.
- Alternativa: pjcohen, K Zildjian Istanbul 20" ride, https://freesound.org/people/pjcohen/sounds/93907/ , CC0 ("copy, modify, distribute and perform the sound, even for commercial purposes"); WAV stereo 44,1 kHz 16 bit, 1,6 MB, 9,4 s; colpo con il fusto della bacchetta sul bow ("wash"), non un ping netto; microfoni stereo.

### Splash
Nessuno splash acustico CC0 trovato/verificato. Non usare lo "splash hit" di Virtuosity: è un hi-hat.

### Scartati
- https://freesound.org/s/222932 (NoiseCollector): CC BY 3.0, batteria giocattolo.
- https://freesound.org/s/135994 (quartertone, Paiste 24" crash-ride vintage): CC BY 4.0 (fallback possibile, richiede attribuzione): 4,2 s, 24 bit/48 kHz, 1,1 MB, microfono ravvicinato + XY.

### Raccomandazione e dubbi
- Usare Virtuosity per crash + ride (una sola fonte CC0, scaricabile con curl senza login, velocity layer disponibili); tenere ankealtd come alternativa più ravvicinata/rock.
- Prima di includere: scaricare un file, misurare frequenza/bit/durata/canali, ascoltarlo (non possibile in questa sessione). Nessuna attribuzione richiesta per la CC0; un file crediti è comunque buona pratica.
- Dubbio: il timbro jazz di Virtuosity con overhead potrebbe non adattarsi a rock/pop.
