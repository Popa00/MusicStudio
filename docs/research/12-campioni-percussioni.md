# Campioni di percussioni CC0 (one-shot, scaricabili con curl senza login)

Ricerca del 2026-11-07. Elenchi di file letti dall'API GitHub (`/contents/...`): i nomi e le dimensioni sono reali. Nessun file audio e' stato scaricato o ascoltato: durata, frequenza, bit e canali sono NON verificati; il timbro e' dedotto dai nomi file e dalle dimensioni (dove scritto "ipotesi").

## Licenze (prova)

- **VCSL** (https://github.com/sgossner/VCSL): il README dice "This collection is under a Creative Commons 0 license" e "whatever you want with these sounds ... no royalties, no credit, no special terms". Il file `LICENSE` (https://raw.githubusercontent.com/sgossner/VCSL/master/LICENSE) inizia con "Creative Commons Legal Code - CC0 1.0 Universal".
- **Virtuosity Drums** (https://github.com/sfzinstruments/virtuosity_drums): `LICENSE` = CC0 1.0 Universal (gia' verificato in `11b-campioni-piatti.md`). Vale per tutta la cartella `Samples/`, percussioni comprese.
- Prefisso URL da usare sotto:
  - `V = https://raw.githubusercontent.com/sgossner/VCSL/master/`
  - `D = https://raw.githubusercontent.com/sfzinstruments/virtuosity_drums/master/`
  - Gli spazi nei percorsi VCSL vanno scritti `%20`, la virgola `%2C`.

## Risposta breve

Una sola fonte copre quasi tutto: **VCSL** (tamburello, shaker, conga, bongo, clave, cowbell, piatti orchestrali, battito di mani). Mancano: **schiocco di dita**, **china**, **splash** (nessuna fonte CC0 diretta trovata). Virtuosity ha anche una cartella `perc/close` (microfono vicino) con gli stessi strumenti, in file piu' corti e piu' "asciutti".

Differenza utile: nei file VCSL il suffisso `_Mid` o `_Sum` indica il microfono (ipotesi: `Mid` = microfono medio/di stanza, `Sum` = somma dei microfoni); nei file Virtuosity `_Close` e' il microfono vicino, quindi meno ambiente. Per una drum machine il "close" e' di solito meglio (meno coda, piu' attacco).

## 1) Schiocco di dita (finger snap) - NESSUN CANDIDATO VALIDO

- Cercato su GitHub, VCSL, Virtuosity, archive.org: nessun file CC0 scaricabile senza login.
- Scartati: "Finger Snaps" soundfont su Polyphone (https://www.polyphone.io/en/soundfonts/unpitched-percussion/529-finger-snaps): licenza "public domain" ma download solo per iscritti, ed e' un .sf2. "CySnaps" e "Hands Make Sounds" (99sounds): licenza CC0 non verificata/richiede credito.
- Alternativa CC0 piu' vicina: **battito di mani singolo** di VCSL (non e' uno schiocco, ma e' breve e secco):
  - `V Idiophones/Struck%20Idiophones/Claps/SoloClap_vl2.wav` (95.536 byte, mano singola, velocity media)
  - `V Idiophones/Struck%20Idiophones/Claps/SoloClap_vl1.wav` (81.214 byte, piu' piano)
- Consiglio: tenere lo schiocco sintetizzato (gia' in `src/audio/drums/snap.ts`) oppure chiedere all'utente di registrare/scegliere un file da Freesound a mano (account gratuito).

## 2) Tamburello (tambourine)

- **Consigliato, colpo: VCSL Tambourine 1** `V Idiophones/Struck%20Idiophones/Tambourine%201/Tamb1_Hit_v2_rr1_Mid.wav` (293.256 byte). Colpo singolo con sonagli. Anche `Tamb1_Hit_v1_rr1_Mid.wav` (338.496 byte). Evitare i file `Roll` (1,7-1,9 MB, sono rullii).
- **Consigliato, scuotimento: Virtuosity** `D Samples/perc/close/tambourine/Tamb1_Shake_rr3_Close.wav` (106.336 byte, microfono vicino, secco). Ci sono rr1-rr10 (98-145 KB); sono quelli piu' brevi e puliti. In alternativa VCSL `Tamb1_Shake_rr1_Mid.wav` (258.948 byte).
- Cartelle VCSL "Tambourine 2" esiste (non elencata a fondo); "Tambourine 3-5" sono "Legacy" (scartare).
- Nota: nel Virtuosity `close` c'e' solo lo scuotimento, il colpo secco solo in VCSL.

## 3) Shaker / maracas

- **Consigliato: Virtuosity** `D Samples/perc/close/shaker/LShaker_Shake1D_rr3_Close.wav` (118.624 byte; "1D" = scuotimento in giu', ipotesi) e `LShaker_Shake1U_rr3_Close.wav` (120.886 byte, in su). Alternando D e U si ottiene un ritmo naturale da shaker "16esimi".
- **Alternativa piu' corta: VCSL Shaker, Small** `V Idiophones/Struck%20Idiophones/Shaker%2C%20Small/Mid_ShakerLowFaster_Up_rr2.wav` (14.620 byte, un colpetto brevissimo) o `Mid_ShakerHighFaster_Down_rr2.wav` (24.012 byte). Sono i file piu' piccoli di tutta la ricerca: ottimi per un hi-hat da shaker.
- Maracas vere: nessun file trovato con questo nome (lo "Shaker, Large" di VCSL e' un uovo/shaker generico, ipotesi). Evitare `*_Roll_*` (450-775 KB).

## 4) Conga

Nomi (ipotesi, non documentati): `HitN` = colpo normale/aperto; `HitFM`/`HitHM` = colpo di tipo diverso (forse "muted/fingers", da ascoltare); `22`/`17` = diametro in pollici. Lo slap vero e proprio NON e' identificato in modo certo.

- **Consigliato: Virtuosity close** (conga da 22", colpi normali per tre fasce di forza):
  - `D Samples/perc/close/conga/Conga_22_HitN_51_100_rr1_Close.wav` (70.002 byte, forza media)
  - `D Samples/perc/close/conga/Conga_22_HitN_101_127_rr1_Close.wav` (115.558 byte, forte)
  - Quinto/piu' acuto (17"): `D Samples/perc/close/conga/Conga_17_HitHM1_71_127_rr1_Close.wav` (66.154 byte; tipo di colpo da ascoltare).
- **Alternativa: VCSL** `V Membranophones/Struck%20Membranophones/Conga/Conga_HitN_v2_rr1_Sum.wav` (140.012 byte), `Quinto_HitN_v2_rr1_Sum.wav` (141.228 byte, acuta), `Tumba_HitN_v2_rr1_Sum.wav` (149.288 byte, grave). VCSL offre tre taglie (conga, quinto, tumba): utile per fare 3 note diverse.
- Per lo "slap": provare `Conga_HitFM_v2_rr1_Sum.wav` (159.004 byte); da ascoltare prima di usarlo.

## 5) Bongo (alto e basso)

- **Consigliato: Virtuosity close** (file piccoli, secchi; v = velocity 1-3, rr = variante):
  - Alto: `D Samples/perc/close/bongoh/BongoH_Hit1_v2_rr1_Close.wav` (104.730 byte)
  - Basso: `D Samples/perc/close/bongol/BongoL_Hit1_v2_rr1_Close.wav` (84.412 byte)
- **Alternativa: VCSL** `V Membranophones/Struck%20Membranophones/Bongos/BongoH_Hit1_v2_rr1_Mid.wav` (209.356 byte) e `BongoL_Hit1_v2_rr1_Mid.wav` (168.720 byte). Esistono anche i colpi smorzati `*_HitMuted*` (utili per un secondo suono "tac").

## 6) Piatti piu' brillanti

Nessuna china ne' splash CC0 verificata (Salamander drumkit ha china/splash ma e' CC BY-SA 3.0, scartato; Voxengo ha licenza propria).

- **Opzione A: VCSL piatto sospeso (orchestrale, brillante e lungo)**. Cartella `V Idiophones/Struck%20Idiophones/Suspended%20Cymbal%201/` e `.../Suspended%20Cymbal%202/`:
  - Crash brillante: `Suspended%20Cymbal%201/susCymb1_hit_fff1.wav` (2,29 MB) e `Suspended%20Cymbal%202/susCymb2_hit_f1.wav` (2,61 MB). Colpo con battente morbido: suono "shhhh" ampio, molto brillante, lungo (ipotesi: piu' di 5 s; va tagliato e sfumato). Per un crash piu' vicino al rock/pop.
  - Colpo con bacchetta (piu' ticchettante, quasi un ride/crash corto): `susCymb1_hit_stick_f1.wav` (1,21 MB) e `susCymb2_hit_stick_mf1.wav` (2,40 MB).
  - Campana: `susCymb1_hit_bell_mf1.wav` (1,28 MB). Evitare `*_roll_*`, `*_cresc_*`, `*_bowed*`, `*_scrape*` (non sono colpi singoli).
- **Opzione B: Virtuosity flat ride** (stesso kit jazz, ma e' un piatto piatto, piu' "pulito" e secco): `D Samples/oh/flatride/oh_flatride_crash_vl3.flac` (2,22 MB, usato come crash) e `oh_flatride_ride_vl3_rr1.flac` (1,51 MB, ride). Probabilmente resta scuro/jazz come gli altri Virtuosity (ipotesi).
- **Consiglio**: provare `susCymb1_hit_fff1.wav` come crash e `susCymb1_hit_stick_f1.wav` come ride brillante; confrontare con il flat ride all'ascolto. Per china/splash: usare un piatto sintetizzato o scegliere a mano da Freesound (account gratuito).
- Attenzione: i file VCSL dei piatti sono grandi (1-3 MB in WAV): convertire in mp3/ogg corti o tagliare a 2-3 s con dissolvenza.

## 7) Facoltativi

- **Clave** - Virtuosity close: `D Samples/perc/close/claves/Claves1_Hit_v2_rr1_Close.wav` (95.958 byte). Alternativa VCSL: `V Idiophones/Struck%20Idiophones/Claves/Claves1_Hit_v2_rr1_Mid.wav` (191.812 byte).
- **Cowbell (campanaccio)** - Virtuosity close: `D Samples/perc/close/cowbell/Cowbell1_Normal_v2_rr1_Close.wav` (87.536 byte). Alternativa VCSL: `V Idiophones/Struck%20Idiophones/Cowbells/Cowbell1_Normal_v3_rr1_Mid.wav` (165.900 byte); versione smorzata: `Cowbell1_Muted_v2_rr1_Mid.wav` (186.792 byte).
- **Tom acustici**: VCSL ha `Tom 1` e `Tom 2` in `V Membranophones/Struck%20Membranophones/` (nomi file non elencati: da leggere con l'API se servono). Virtuosity ha le cartelle `Samples/oh/htom` e `ltom` (tom alto e basso, FLAC, nomi non elencati).

## Cosa NON e' stato verificato

- Frequenza, profondita' di bit, canali, durata e rumore di fondo di tutti i file (da misurare dopo il download).
- Il significato esatto di `HitFM`, `HitHM1`, `Sum`, `Mid`, `1D/1U`.
- Il file `LICENSE` non e' ripetuto dentro `Samples/`: la licenza e' quella del repository.
- Eventuali file `.sfz`/mappe: non servono, sono solo i WAV/FLAC.

## Lista URL consigliati (da scaricare con curl)

Pronti da incollare (V = VCSL, D = Virtuosity):

- Tamburello colpo: `https://raw.githubusercontent.com/sgossner/VCSL/master/Idiophones/Struck%20Idiophones/Tambourine%201/Tamb1_Hit_v2_rr1_Mid.wav`
- Tamburello scuotimento: `https://raw.githubusercontent.com/sfzinstruments/virtuosity_drums/master/Samples/perc/close/tambourine/Tamb1_Shake_rr3_Close.wav`
- Shaker giu': `https://raw.githubusercontent.com/sfzinstruments/virtuosity_drums/master/Samples/perc/close/shaker/LShaker_Shake1D_rr3_Close.wav`
- Shaker su: `https://raw.githubusercontent.com/sfzinstruments/virtuosity_drums/master/Samples/perc/close/shaker/LShaker_Shake1U_rr3_Close.wav`
- Conga aperta: `https://raw.githubusercontent.com/sfzinstruments/virtuosity_drums/master/Samples/perc/close/conga/Conga_22_HitN_51_100_rr1_Close.wav`
- Conga (altro colpo, da ascoltare): `https://raw.githubusercontent.com/sgossner/VCSL/master/Membranophones/Struck%20Membranophones/Conga/Conga_HitFM_v2_rr1_Sum.wav`
- Bongo alto: `https://raw.githubusercontent.com/sfzinstruments/virtuosity_drums/master/Samples/perc/close/bongoh/BongoH_Hit1_v2_rr1_Close.wav`
- Bongo basso: `https://raw.githubusercontent.com/sfzinstruments/virtuosity_drums/master/Samples/perc/close/bongol/BongoL_Hit1_v2_rr1_Close.wav`
- Crash brillante: `https://raw.githubusercontent.com/sgossner/VCSL/master/Idiophones/Struck%20Idiophones/Suspended%20Cymbal%201/susCymb1_hit_fff1.wav`
- Ride brillante (bacchetta): `https://raw.githubusercontent.com/sgossner/VCSL/master/Idiophones/Struck%20Idiophones/Suspended%20Cymbal%201/susCymb1_hit_stick_f1.wav`
- Clave: `https://raw.githubusercontent.com/sfzinstruments/virtuosity_drums/master/Samples/perc/close/claves/Claves1_Hit_v2_rr1_Close.wav`
- Cowbell: `https://raw.githubusercontent.com/sfzinstruments/virtuosity_drums/master/Samples/perc/close/cowbell/Cowbell1_Normal_v2_rr1_Close.wav`
- Battito di mani singolo (al posto dello schiocco): `https://raw.githubusercontent.com/sgossner/VCSL/master/Idiophones/Struck%20Idiophones/Claps/SoloClap_vl2.wav`

## Fonti

- https://github.com/sgossner/VCSL (README, CC0) e https://raw.githubusercontent.com/sgossner/VCSL/master/LICENSE
- https://api.github.com/repos/sgossner/VCSL/contents/ (cartelle Idiophones/Membranophones)
- https://github.com/sfzinstruments/virtuosity_drums e https://api.github.com/repos/sfzinstruments/virtuosity_drums/contents/Samples
- https://www.polyphone.io/en/soundfonts/unpitched-percussion/529-finger-snaps (scartato: login)
- https://github.com/studiorack/salamander-drumkit (scartato: CC BY-SA 3.0)
