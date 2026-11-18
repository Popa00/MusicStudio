# Approfondimenti per le schede: basi, armonia, melodia

Data: 2026-11-17. Coperte 40 schede (16 basi, 15 armonia, 9 melodia) + 9 schede nuove proposte. Le schede in `knowledge/cards` NON sono state modificate.

Metodo: ogni pagina citata e' stata aperta con WebFetch (tutti gli URL esistono e dicono quello che e' scritto sotto). Le note degli accordi sono state ricalcolate dalla regola "triade = fondamentale, terza, quinta della scala" e confrontate con i test dell'app (`src/music/scaleChords.test.ts`: Do maggiore = Do Rem Mim Fa Sol Lam Sidim; La minore = Lam Sidim Do Rem Mim Fa Sol). Le frasi sono riformulate. Quando un punto e' "calcolato" (derivato da fonti + aritmetica dei semitoni) o "non verificato" e' scritto.

Comportamento dell'app verificato nel codice (utile per i consigli): la tastiera del PC usa A S D F G H J K = Do Re Mi Fa Sol La Si Do e W E T Y U = tasti neri, Z/X cambiano ottava (1-7); nel piano roll ogni riga e' un semitono; con "Blocca sulla scala" acceso le frecce su/giu' spostano di UN GRADO della scala (Shift = un'ottava), a blocco spento di un semitono; le scale scelte sono maggiore, minore (naturale), pentatonica maggiore/minore, nessuna, con tonica a scelta; per le pentatoniche l'assistente non ha accordi suggeriti; l'assistente riconosce solo questi accordi: maggiore, m, dim, +, sus2, sus4, 7, maj7, m7, m7b5 (e i rivolti, scritti "Do/Mi").

## Legenda fonti (formato pronto per `fonti:`)

Wikipedia EN (https://en.wikipedia.org/wiki/...):
- MN Musical note: Musical_note | PIT Pitch_(music) | OCT Octave | SEM Semitone | INT Interval_(music) | CD Consonance_and_dissonance
- SCA Scale_(music) | DEG Degree_(music) | MAJ Major_scale | MIN Minor_scale | PEN Pentatonic_scale | KEY Key_(music) | TON Tonic_(music) | REL Relative_key | MOD Mode_(music) | LT Leading-tone | TRA Transposition_(music)
- BEAT Beat_(music) | BAR Bar_(music) | TEMPO Tempo | TS Time_signature | MET Metre_(music) | NV Note_value | DYN Dynamics_(music) | ACC Accent_(music)
- CH Chord_(music) | TRIAD Triad_(music) | HAR Harmony | MAC Major_chord | MIC Minor_chord | DC Diatonic_and_chromatic | RNA Roman_numeral_analysis | FUN Function_(music) | DOM Dominant_(music) | CP Chord_progression | AX I%E2%80%93V%E2%80%93vi%E2%80%93IV_progression | BLU Twelve-bar_blues | AND Andalusian_cadence
- CAD Cadence | RES Resolution_(music) | VL Voice_leading | INV Inversion_(music) | VOI Voicing_(music) | S7 Seventh_chord | SUS Suspended_chord | DIM Diminished_triad | AUG Augmented_triad | TRI Tritone | COF Circle_of_fifths | MODU Modulation_(music) | BOR Borrowed_chord | SEQ Sequence_(music)
- MEL Melody | MM Melodic_motion | MC Melodic_contour | MOT Motif_(music) | HOOK Hook_(music) | RIFF Riff | PHR Phrase_(music) | CAR Call_and_response_(music) | NCT Nonchord_tone | REG Register_(music) | RNG Range_(music) | ARP Arpeggio | BASS Bassline | CPT Counterpoint | CM Counter-melody
- EMO Music_and_emotion | m3 Minor_third | M3 Major_third | P5 Perfect_fifth

Wikipedia IT (https://it.wikipedia.org/wiki/...): IT-NM Nota_musicale | IT-AC Accordo_(musica) | IT-SC Scala_musicale

Open Music Theory (base: https://human.libretexts.org/Bookshelves/Music/Music_Theory/Open_Music_Theory_2e_(Gotham_et_al.)/ ), cartelle con `%3A`:
- O1.5 01%3A_Fundamentals/1.05%3A_Half_Steps_Whole_Steps_and_Accidentals
- O1.6 01%3A_Fundamentals/1.06%3A_American_Standard_Pitch_Notation_(ASPN)
- O1.9 01%3A_Fundamentals/1.09%3A_Simple_Meter_and_Time_Signatures
- O1.11 01%3A_Fundamentals/1.11%3A_Other_Rhythmic_Essentials
- O1.12 01%3A_Fundamentals/1.12%3A_Major_Scales_Scale_Degrees_and_Key_Signatures
- O1.13 01%3A_Fundamentals/1.13%3A_Minor_Scales_Scale_Degrees_and_Key_Signatures
- O1.14 01%3A_Fundamentals/1.14%3A_Introduction_to_Diatonic_Modes_and_the_Chromatic_Scale
- O1.15 01%3A_Fundamentals/1.15%3A_Intervals
- O1.16 01%3A_Fundamentals/1.16%3A_Triads
- O1.17 01%3A_Fundamentals/1.17%3A_Seventh_Chords
- O3.2 03%3A_Form/3.02%3A_The_Phrase_Archetypes_and_Unique_Forms
- O4.1 04%3A_Diatonic_Harmony_Tonicization_and_Modulation/4.01%3A_Introduction_to_Harmony_Cadences_and_Phrase_Endings
- O4.4 04%3A_Diatonic_Harmony_Tonicization_and_Modulation/4.04%3A_Embellishing_Tones
- O4.10 04%3A_Diatonic_Harmony_Tonicization_and_Modulation/4.10%3A_Plagal_Motion_as_a_Form_of_Prolongation

(Il sito viva.pressbooks.pub ha risposto 403 al fetch automatico: ho usato la copia libretexts, ammessa.)

## Errori e imprecisioni nelle schede attuali (riepilogo)

Errori veri nel contenuto: nessuno su note, semitoni, accordi, scale (ricontrollati tutti). Imprecisioni da correggere:
1. **modulazione** (consiglio per l'app): "selezionale tutte e usa le frecce" con "Blocca sulla scala" acceso sposta di un grado della scala, non di un semitono: non si cambia tonalita'. Serve spegnere il blocco.
2. **contorno**: fonte `Steps_and_skips` inesistente (gia' noto). Meglio `Melodic_motion` (verificata, pertinente). Inoltre "molte melodie fanno un arco": la fonte dice che le forme piu' comuni sono discendente e ondulata, l'arco e' una forma tra le altre. "Dopo un salto si torna indietro per gradi" e' vero ma lo dicono Voice leading e OMT, non la pagina Melody.
3. **pentatonica**: "quasi ogni combinazione suona bene" e' esagerato: la scala evita i semitoni al suo interno, ma una nota puo' stridere con l'accordo (in La minore pentatonica il Mi sopra un Fa e' a un semitono dal Fa).
4. **note-accordo**: "appoggiatura" detta di ogni nota estranea sul battito forte: l'appoggiatura vera e' raggiunta per salto e lasciata per grado; se la raggiungi per grado e' un passaggio accentato o un ritardo (NCT, O4.4).
5. **sus**: "spesso risolve": la fonte dice che nel pop spesso resta irrisolto.
6. **cadenza**: V-I e' la cadenza "autentica"; "perfetta" in senso stretto vuole accordi in stato fondamentale e tonica nella nota piu' alta. Semplificazione accettabile, da dichiarare.
7. **diminuito-aumentato**: "aumentato sospeso, misterioso, da sogno" e' un'impressione: la fonte dice molto dissonante, che puo' "sospendere" la tonalita'. Manca che il dim sta anche sul 2 grado del minore (Si dim in La minore).
8. **modi**: "molto usato nel funk e nel lo-fi" non verificato; "sognante" (lidio) e "rock" (misolidio) sono impressioni.
9. **registro-estensione**: "una melodia cantabile resta entro un'ottava o poco piu'" non verificato nelle fonti ammesse (Range non da' cifre vocali).
10. **contrappunto**: raddoppiare a terza e' armonia parallela, non contromelodia (CM distingue le due cose); "note piu' lunghe quando la melodia si muove" e' un consiglio pratico non confermato (CPT dice solo "indipendenti per ritmo e profilo").
11. **funzioni-armoniche**: il vi e' "tonica" per Caplin (FUN) ma "predominante debole" per OMT (O4.1): teoria discordante, da dire.
12. **accordo**: "tre o piu' note" (it.wikipedia: almeno tre; en.wikipedia: due o piu'): va bene per principianti.
13. **tonalita'**: "tutte le parti usano le stesse note" e' una semplificazione: le note cromatiche (fuori scala) sono ammesse ma piu' rare (KEY).
14. **suddivisione**: conferma la correzione gia' proposta: conteggio dei sedicesimi "1 e & a" ("uno-e-and-a", O1.9).
15. **melodia**: "un punto piu' alto (culmine)" non e' nella pagina Melody: vedi MM (forma ad arco) e REG (il culmine di un brano sta di solito nel registro piu' alto).
16. **battito-battuta**: manca che in 4/4 il battito 3 e' il secondo piu' forte e che nel pop si accentuano 2 e 4 (backbeat).

Causa probabile dell'errore "Fa minore in La minore": la scheda accordi-presi-in-prestito parla di "Fam" in Do maggiore e il modello lo mescola. Consiglio: scrivere in clear in accordi-della-scala, triade-maggiore-minore e accordi-presi-in-prestito "in La minore il Fa e' MAGGIORE (Fa La Do); il Fam non e' nella scala".

---

# BASI

## nota | Nota e altezza
**Aggiungere**
- Le lettere inglesi corrispondono a Do Re Mi Fa Sol La Si = C D E F G A B (it.wikipedia). In inglese "B" e' il Si; nei paesi tedeschi "B" e' il Si bemolle e "H" il Si (MN).
- Sulla tastiera: 7 tasti bianchi + 5 neri = 12 note diverse; i tasti neri hanno due nomi (Do♯/Re♭). Tra Mi-Fa e Si-Do non c'e' tasto nero (O1.5, MN).
- Il numero dell'ottava cambia sul Do, non sul La: dopo il Si3 viene il Do4. Do4 e' il "Do centrale" (circa 261,6 Hz); La4 = 440 Hz (O1.6, MN). Nell'app il MIDI 60 e' Do4 (verificato nel codice).
- L'orecchio sente le distanze come rapporti: La3 (220 Hz) -> La4 (440) -> La5 (880) suonano "ugualmente distanti" (PIT).
- Altezza (acuto/grave) non e' volume (forte/piano): sono cose diverse (PIT).
**Errori comuni**: dire "piu' alto" intendendo "piu' forte"; credere che Do♯ e Re♭ siano tasti diversi (sono lo stesso tasto); far cambiare l'ottava dal La.
**App**: l'app mostra le note come "Do4 (C4)"; con la tastiera del PC (A S D F G H J K = Do...Do) si trovano le note a orecchio.
**Fonti**: MN, PIT, O1.5, O1.6, IT-NM.

## ottava | Ottava
**Aggiungere**
- Rapporto 2:1: 440 Hz -> 880 Hz (sopra) o 220 Hz (sotto); in equal temperament sono 12 semitoni (OCT).
- Si chiama "ottava" perche' in una scala di 7 note l'ottava nota ripete la prima (MAJ, SCA).
- Note a distanza di ottava si fondono e portano lo stesso nome; chi canta "all'unisono" spesso canta in realta' a un'ottava di distanza (OCT). Raddoppiare una melodia un'ottava sopra la rende piena senza cambiare le note.
- Spostare di un'ottava una nota di un accordo non cambia il nome dell'accordo (INV: conta solo quale nota e' la piu' bassa).
- Do4 e' il Do centrale (O1.6).
**Errori comuni**: credere che l'ottava sia 8 semitoni (sono 12, le note della scala sono 8 contando la ripetizione); spostare di ottava la nota piu' bassa di un accordo e non accorgersi che cambia il rivolto.
**App**: Z/X cambiano ottava della tastiera PC; Shift+freccia su/giu' sposta le note selezionate di un'ottava (verificato).
**Fonti**: OCT, INV, O1.6, MAJ.

## semitono-tono | Semitono e tono
**Aggiungere**
- Sulla tastiera: semitono = tasto subito accanto (bianco o nero), tono = due tasti piu' in la'. Mi-Fa e Si-Do sono semitoni senza tasto nero in mezzo (O1.5, SEM): per questo i due semitoni della scala di Do maggiore cadono li'.
- Il semitono e' l'intervallo usato piu' piccolo; suonato insieme e' molto dissonante (SEM).
- 12 semitoni = un'ottava; la scala cromatica e' fatta solo di semitoni (DC, SEM).
- La scala diatonica ha cinque toni e due semitoni, con i semitoni il piu' lontano possibile (DC, IT-SC).
- Esempio: Do -> Re e' un tono (in mezzo il Do♯); Mi -> Fa e' un semitono.
**Errori comuni**: pensare che due tasti bianchi vicini siano sempre un tono (Mi-Fa e Si-Do no); contare anche la nota di partenza ("Do-Re sono 2 semitoni", non 3).
**App**: ogni riga del piano roll e' un semitono; due righe = un tono. Con "Blocca sulla scala" le frecce vanno di un grado (a volte tono, a volte semitono).
**Fonti**: SEM, O1.5, DC, IT-SC.

## intervallo | Intervallo
**Aggiungere**
- Il numero si conta includendo la nota di partenza: Do -> Mi e' una terza (Do Re Mi). La qualita' (giusta, maggiore, minore, aumentata, diminuita) dice la misura esatta (INT, O1.15).
- Da Do, in semitoni (INT): 1 seconda minore (Re♭), 2 seconda maggiore (Re), 3 terza minore (Mi♭), 4 terza maggiore (Mi), 5 quarta giusta (Fa), 6 tritono (Fa♯), 7 quinta giusta (Sol), 8 sesta minore (La♭), 9 sesta maggiore (La), 10 settima minore (Si♭), 11 settima maggiore (Si), 12 ottava.
- Melodico = note una dopo l'altra; armonico = note insieme (INT).
- Consonanza e dissonanza sono un gradiente e cambiano con epoca e cultura. La quarta giusta e' ambigua: oggi consonante, nel Rinascimento trattata come dissonanza (CD).
- Tradizionalmente dissonanti: seconde, settime, tritono; consonanti: unisono, ottava, quarte e quinte giuste, terze e seste (CD).
- La quinta giusta (7 semitoni) e' l'intervallo piu' stabile dopo unisono e ottava (P5); senza terza non dice se e' maggiore o minore (P5).
- I compositori usano spesso la terza minore per esprimere tristezza (m3).
**Errori comuni**: scambiare "terza" con "3 semitoni" (3 = terza minore, 4 = terza maggiore); "quarta" = 5 semitoni, non 4; pensare che dissonante = sbagliato.
**App**: nel piano roll conta le righe: 3 sopra = terza minore, 4 = terza maggiore, 7 = quinta.
**Fonti**: INT, O1.15, CD, P5, m3, TRI.
**Scheda attuale**: la lista dei consonanti omette la quarta giusta (CD).

## scala | Scala
**Aggiungere**
- Una scala e' una serie di note da una nota alla sua ottava; il nome viene da "scala" (a pioli) (SCA).
- Si classifica per numero di note: 12 cromatica, 7 eptatonica (la piu' comune), 5 pentatonica (SCA).
- E' definita dal "disegno" di toni e semitoni: lo stesso disegno puo' partire da note diverse (SCA).
- Gradi: si numerano dalla tonica; nomi in inglese: tonic, supertonic, mediant, subdominant, dominant, submediant, leading tone (DEG). Nomi italiani standard (sopratonica, mediante, sopradominante, sensibile): non verificati nelle fonti ammesse.
- Le note fuori scala (cromatiche) sono ammesse ma piu' rare (DC, KEY): la scala e' una tavolozza, non un obbligo.
- Nell'app: maggiore, minore, pentatoniche, "nessuna" (tutte le 12 note), con tonica a scelta (verificato nel codice).
**Errori comuni**: pensare che le note fuori scala siano "sbagliate"; pensare che tutte le scale abbiano 7 note; confondere scala e tonalita'.
**App**: le righe chiare sono la scala; "Blocca sulla scala" le impone; "Adatta alla scala" corregge le note gia' scritte (help).
**Fonti**: SCA, DEG, DC, KEY, IT-SC.

## scala-maggiore | Scala maggiore
**Aggiungere**
- Sequenza W-W-H-W-W-W-H (tono tono semitono tono tono tono semitono) (MAJ, O1.12). Do maggiore e' l'unica maggiore senza diesis ne' bemolli: solo tasti bianchi (MAJ).
- Sono due blocchi uguali di 4 note (tono-tono-semitono) uniti da un tono: Do Re Mi Fa | Sol La Si Do (MAJ).
- Stessa sequenza da un'altra nota = un'altra maggiore: Sol maggiore = Sol La Si Do Re Mi Fa♯ (1 diesis, MAJ; calcolato).
- Il settimo grado (Si in Do) e' la "sensibile": mezzo tono sotto la tonica, tira verso di essa (O1.12, LT).
- Triadi sui gradi: maggiori su I, IV, V; minori su ii, iii, vi; diminuita su vii (MAJ).
- Le minori "sono considerate spesso piu' tristi o scure" (KEY); l'associazione maggiore = positivo e' diffusa ma in parte appresa, e il tempo conta di piu' (EMO).
**Errori comuni**: credere che maggiore = sempre allegro (un brano lento e maggiore puo' dare emozioni miste, EMO); partire da una nota sbagliata e ottenere un modo.
**App**: scegli "Do maggiore" e usa le righe chiare; per cambiare tonalita' cambia la tonica.
**Fonti**: MAJ, O1.12, LT, KEY, EMO.

## scala-minore | Scala minore
**Aggiungere**
- Naturale: W-H-W-W-H-W-W; La minore = La Si Do Re Mi Fa Sol (MIN, O1.13).
- Rispetto alla maggiore con la stessa tonica abbassa 3a, 6a e 7a (O1.13): La maggiore = La Si Do♯ Re Mi Fa♯ Sol♯; La minore = La Si Do Re Mi Fa Sol.
- Armonica: alza il 7o (Sol♯), cosi' torna la sensibile (Sol♯ -> La) e tra Fa e Sol♯ nasce un salto di 3 semitoni (seconda aumentata) (MIN, O1.13).
- Melodica: salendo alza 6o e 7o (La Si Do Re Mi Fa♯ Sol♯), scendendo e' uguale alla naturale (MIN, O1.13).
- Nella naturale manca la sensibile, quindi le cadenze sono piu' deboli (MIN): per questo si usa Mi maggiore (Mi Sol♯ Si) invece di Mim prima di Lam.
- Accordi di La minore naturale: Lam, Si dim, Do, Rem, Mim, Fa, Sol (calcolato e verificato nei test dell'app).
**Errori comuni**: dire che in La minore c'e' il Fa minore (e' Fa MAGGIORE); pensare che l'app abbia armonica e melodica (ha solo la naturale).
**App**: per scrivere il Sol♯ si spegne "Blocca sulla scala".
**Fonti**: MIN, O1.13, LT.

## pentatonica | Scala pentatonica
**Aggiungere**
- Maggiore in Do: Do Re Mi Sol La (via Fa e Si); minore in La: La Do Re Mi Sol: sono le stesse note, partendo da La (PEN).
- Non ha semitoni ne' tritono: per questo e' facile (PEN). In Do evita il Fa, che sopra un accordo di Do stride col Mi (PEN).
- I 5 tasti neri del pianoforte formano una pentatonica (Fa♯ maggiore) (PEN): sulla tastiera PC sono W E T Y U.
- Si usa in culture di tutto il mondo (cinese, celtica, andina, blues...) (PEN). La scala blues deriva soprattutto dalla pentatonica minore (PEN).
- Attenzione: evita i semitoni DENTRO la scala, ma una nota puo' stridere con l'accordo che suona (Mi sopra Fa, calcolato).
**Errori comuni**: pensare che "con la pentatonica non si sbaglia mai": note lunghe sul battito forte che urtano l'accordo si sentono; credere che serva solo a rock e blues.
**App**: con le pentatoniche l'assistente non vede accordi suggeriti: per un giro di accordi scegli maggiore/minore e per la melodia usa solo le 5 note (a mano). Shift+freccia con blocco acceso sale di 5 gradi = un'ottava (verificato).
**Fonti**: PEN, KEY.
**Scheda attuale**: "quasi ogni combinazione suona bene" e' esagerato (vedi riepilogo).

## tonalita | Tonalita'
**Aggiungere**
- Ci sono 24 tonalita': 12 toniche per 2 modi (maggiore/minore); se non si dice il modo si intende maggiore (KEY).
- La tonica e' la nota su cui il brano finisce quasi sempre e il suo accordo ha la tensione piu' bassa (KEY, TON).
- Sette note sono "diatoniche" (della scala) e cinque "cromatiche" (fuori scala, ammesse ma piu' rare) (KEY).
- Trasporre = spostare tutte le note dello stesso numero di semitoni: gli intervalli restano uguali (TRA). Esempio: Do-Mi-Sol alzato di 4 semitoni = Mi-Sol♯-Si (TRA).
- Si trasporta spesso per adattare il brano alla voce di chi canta (TRA).
- Indizi per riconoscerla: prima e ultima nota tendono a essere la tonica; un 7o grado alzato (Sol♯ in La minore) suggerisce il minore (REL).
- Alcuni brani non hanno tonalita' chiara (KEY).
**Errori comuni**: credere che in Do maggiore si usino SOLO tasti bianchi; trasporre solo una traccia e lasciare le altre; confondere "tono" (2 semitoni) e "tonalita'".
**App**: per trasporre: Ctrl+A nel pattern, spegni "Blocca sulla scala", frecce su/giu' = un semitono; ripeti in ogni pattern di strumento (la batteria non va trasposta).
**Fonti**: KEY, TON, TRA, REL.

## relativa | Tonalita' relative
**Aggiungere**
- Stesse note, stessa armatura, tonica diversa (REL). La relativa minore parte dal 6o grado = 3 semitoni sotto la tonica maggiore (REL, O1.13): Do-La, Sol-Mi, Fa-Re.
- Hanno gli stessi accordi (REL): per questo e' facile confondere a orecchio maggiore e relativa. Indizi: dove inizia e finisce la melodia; il Sol♯ indica La minore (REL).
- Non confonderle con le parallele: stessa tonica, modo diverso (Do maggiore / Do minore) (REL, TON). Le parallele cambiano tre note (base degli accordi presi in prestito).
- Passare alla relativa e' una modulazione morbida (KEY, MODU).
- Esempio: Do Sol Lam Fa (I-V-vi-IV in Do) e Lam Fa Do Sol sono gli stessi 4 accordi con un altro punto di partenza (AX): cambia la "casa".
**Errori comuni**: confondere relativa e parallela; credere che cambiare da Do maggiore a La minore cambi le note scritte (non cambiano).
**App**: cambiando la scala tra relative (Do maggiore <-> La minore) le righe evidenziate restano le stesse (calcolato).
**Fonti**: REL, KEY, TON, O1.13, AX.

## modi | Modi (dorico, misolidio...)
**Aggiungere**
- Sette modi: ionico (Do, = maggiore), dorico (Re), frigio (Mi), lidio (Fa), misolidio (Sol), eolio (La, = minore naturale), locrio (Si) (MOD).
- Ordine dal piu' luminoso al piu' scuro: lidio, ionico, misolidio, dorico, eolio, frigio, locrio; ogni passo abbassa una nota in piu' (MOD, O1.14).
- Differenze (O1.14, MOD): lidio = maggiore con 4o alzato; misolidio = maggiore con 7o abbassato; dorico = minore con 6o alzato; frigio = minore con 2o abbassato; locrio = minore con 2o e 5o abbassati.
- Lidio, ionico, misolidio hanno la terza maggiore (luminosi); dorico, eolio, frigio, locrio la terza minore (scuri) (O1.14).
- Il locrio ha la triade di tonica diminuita ed e' piu' teorico che pratico (MOD).
- Esempio pratico: Re dorico = Re Mi Fa Sol La Si Do (stesse note di Do maggiore); alternare Rem e Sol con "casa" Re. La nota caratteristica e' il Si naturale (calcolato).
**Errori comuni**: credere che bastino le note giuste (serve che la "casa" sia percepita come tale); chiamare dorico ogni minore.
**App**: nessun modo tra le scale: trucco = scala maggiore con le stesse note e brano che gira attorno a un'altra nota.
**Fonti**: MOD, O1.14.
**Scheda attuale**: "funk e lo-fi", "sognante", "rock" non verificati (impressioni).

## battito-battuta | Battito e battuta
**Aggiungere**
- Il battito e' l'unita' di tempo di base, la pulsazione su cui si batte il piede; non e' il ritmo (durate) ne' il metro (raggruppamento) (BEAT).
- In 4/4: battito 1 il piu' forte, 3 il secondo, 2 e 4 deboli (BEAT). Nel pop il rullante batte spesso su 2 e 4 (backbeat: accento sui tempi deboli) (BEAT).
- Il primo battito della battuta e' il "downbeat"; l'ultimo battito della battuta prima puo' lanciare il successivo (levare, anacrusi) (BEAT).
- La battuta e' lo spazio tra due stanghette; la sua durata e' decisa dal tempo musicale; la numerazione parte dalla prima battuta completa (BAR).
- Conteggio di ottavi e sedicesimi: "1 e & a 2 e & a" (O1.9).
- Le frasi sono spesso di 4 battute; 4, 8, 16 sono frequenti (PHR, O3.2).
**Errori comuni**: confondere "beat" (battito) con "beat" nel senso di base/ritmo (BEAT); accentuare 2 e 4 con tutti gli strumenti.
**App**: nella griglia della batteria (16 caselle per battuta in 4/4) i battiti sono le caselle 1, 5, 9, 13 (calcolato): rullante su 2 e 4 = caselle 5 e 13.
**Fonti**: BEAT, BAR, O1.9, PHR, O3.2.

## tempo-bpm | Velocita' (BPM)
**Aggiungere**
- 60 BPM = un battito al secondo, 120 = due (TEMPO). 120 BPM in 4/4 = 30 battute al minuto (calcolato).
- Termini classici con BPM approssimativi (TEMPO): Largo 40-66, Adagio 44-66, Andante 56-108, Moderato 108-120, Allegro 120-156, Presto 168-200 (valori molto variabili).
- Accelerando = piu' veloce, ritardando = piu' lento (TEMPO). L'app non elenca cambi di tempo graduali (featureList).
- Il tempo e' di solito il fattore piu' importante per l'emozione, piu' del modo maggiore/minore; maggiore + lento da' emozioni miste (EMO).
- Il metronomo ha reso popolare la misura in BPM (TEMPO).
**Errori comuni**: scegliere il BPM senza pensare al genere; confondere BPM e battute al minuto; credere che pochi BPM in piu' cambino il carattere (120 -> 124 poco, 120 -> 150 molto).
**App**: BPM accanto a Play; il metronomo aiuta a sentire i battiti.
**Fonti**: TEMPO, EMO.
**Scheda attuale**: i BPM per genere non vengono da Wikipedia Tempo: lasciarli "indicativi".

## tempo-musicale | Tempo musicale (4/4, 3/4)
**Aggiungere**
- Numero in alto = battiti per battuta; in basso = quale valore si conta (4 = quarto, 8 = ottavo); non e' una frazione (TS, O1.9).
- Semplice: ogni battito si divide in 2 (2/4, 3/4, 4/4); composto: in 3 (6/8, 9/8, 12/8) (TS, MET).
- 4/4 ("common time") e' il piu' diffuso; 3/4 triplo con un forte e due deboli (valzer, minuetto); 2/4 marce e polke (TS).
- 6/8 si sente a DUE battiti da tre ottavi ciascuno (TS).
- 5/4 e 7/8 sono metri irregolari, meno comuni (TS).
- Il 4/4 e' spesso sentito "in due" (quadruplo = due doppi) (MET).
**Errori comuni**: scambiare 6/8 con 3/4 (stesse 6 crome, ma 2 gruppi da 3 contro 3 gruppi da 2); contare in 4 un brano in 3.
**App**: il tempo e' nella barra in alto; se si possa cambiare non e' verificato.
**Fonti**: TS, MET, O1.9.

## suddivisione | Suddivisioni (ottavi e sedicesimi)
**Aggiungere**
- Ogni valore e' la meta' del precedente: intero, 1/2, 1/4, 1/8, 1/16 (NV). Nomi italiani (semibreve, minima, semiminima, croma, semicroma): non verificati nelle fonti ammesse.
- Il puntino aggiunge meta' del valore (x1,5); le terzine dividono in 3 invece che in 2 (NV, O1.11).
- Si conta "1 e & a": gli ottavi sono le "&", i sedicesimi aggiungono "e" e "a" (O1.9). Le terzine: "1-la-li" (O1.11).
- La sincope sposta gli accenti fuori dai tempi forti con legature, pause, puntini (O1.11, ACC).
- Esempio: in 4/4 un charleston sugli ottavi suona ogni 2 caselle (8 colpi), sui sedicesimi in tutte e 16 (calcolato).
**Errori comuni**: pensare che "sedicesimi" siano 16 battiti (sono 16 parti della battuta); confondere terzine in 4/4 e ottavi del 6/8.
**App**: la griglia della batteria e' a sedicesimi, quindi senza terzine (dedotto dalla featureList).
**Fonti**: NV, MET, O1.9, O1.11, ACC.
**Scheda attuale**: sostituire "uno-e-e-a" con "uno-e-and-a" (1 e & a).

## dinamica | Dinamica e intensita'
**Aggiungere**
- Segni: pp molto piano, p piano, mp mezzo piano, mf mezzo forte, f forte, ff molto forte; sono relativi, non volumi fissi (DYN).
- Crescendo = sempre piu' forte, diminuendo = sempre piu' piano (DYN).
- La velocity MIDI va da 0 a 127 (quanto in fretta si preme il tasto); i programmi associano valori diversi ai segni (es. in Logic 9: p = 48, f = 96) (DYN).
- Tre tipi di accento (ACC): dinamico (piu' forte), tonico (piu' acuto), agogico (piu' lungo): in un piano roll si puo' accentare con velocity alta, nota piu' alta o piu' lunga.
- Gli accenti cadono di solito sui tempi forti; accenti sui deboli (2, 4 in 4/4) = sincope, tipica di blues, jazz, funk, disco, musica latina (ACC).
**Errori comuni**: tutte le velocity al massimo (suono duro e meccanico); confondere dinamica con volume della traccia (la velocity cambia ogni nota, il fader l'intera traccia); variare a caso senza logica.
**App**: la velocity si regola nella striscia sotto il piano roll/griglia.
**Fonti**: DYN, ACC.

---

# ARMONIA

## accordo | Accordo
**Aggiungere**
- Per en.wikipedia e' un insieme di due o piu' note; per it.wikipedia almeno tre; la triade (tre note) e' il tipo piu' comune (CH, IT-AC): per un principiante "tre o piu'" va bene.
- Triade = fondamentale + terza + quinta, a terze sovrapposte; 4 tipi: maggiore (0-4-7 semitoni), minore (0-3-7), diminuito (0-3-6), aumentato (0-4-8) (TRIAD, O1.16).
- Maggiore e minore si distinguono dalla terza; diminuito e aumentato dalla quinta (CH).
- Continuando per terze: settime, none, undicesime, tredicesime (CH).
- Armonia = dimensione "verticale" (note insieme) e "orizzontale" (come gli accordi si susseguono) (HAR).
- Esempi: Do = Do-Mi-Sol; Lam = La-Do-Mi (nella scala di La minore: La, [Si], Do, [Re], Mi).
**Errori comuni**: pensare che sia una nota sola; confondere accordo e arpeggio (l'arpeggio e' un accordo "spezzato", ARP).
**App**: l'assistente riconosce maggiore, m, dim, +, sus2, sus4, 7, maj7, m7, m7b5 e i rivolti (codice).
**Fonti**: CH, TRIAD, O1.16, HAR, IT-AC.

## triade-maggiore-minore | Accordi maggiori e minori
**Aggiungere**
- Maggiore = terza maggiore (4 semitoni) + terza minore (3) sopra = quinta giusta (7); minore = 3 + 4 (TRIAD, MAC, MIC). La quinta e' uguale: cambia solo la nota di mezzo, un semitono piu' bassa nel minore.
- Carattere: il maggiore e' "piu' luminoso", il minore "piu' scuro" (MAC, MIC); l'associazione triste/allegro e' in parte appresa (EMO).
- Come riconoscerli: conta i semitoni tra fondamentale e nota di mezzo: 4 = maggiore, 3 = minore. Fa-La = 4 -> Fa maggiore; La-Do = 3 -> Lam; Re-Fa = 3 -> Rem; Sol-Si = 4 -> Sol; Mi-Sol = 3 -> Mim (calcolato).
- Si scrive: nome solo = maggiore; "m", "mi", "-" = minore (MIC, O1.16, IT-AC).
- In una scala maggiore: maggiori su I, IV, V; minori su ii, iii, vi (MAJ, MAC, MIC).
**Errori comuni**: credere che in La minore tutti gli accordi siano minori: Lam, Rem, Mim sono minori; Do, Fa, Sol maggiori. In particolare Fa in La minore e' MAGGIORE (Fa La Do). Confondere maj7 con m7.
**App**: conta le righe del piano roll: 4 = maggiore, 3 = minore.
**Fonti**: MAC, MIC, TRIAD, O1.16, IT-AC, EMO.

## accordi-della-scala | Gli accordi di una scala
**Aggiungere** (tabelle calcolate e verificate sui test dell'app)
- Do maggiore: I Do (Do Mi Sol), ii Rem (Re Fa La), iii Mim (Mi Sol Si), IV Fa (Fa La Do), V Sol (Sol Si Re), vi Lam (La Do Mi), vii° Si dim (Si Re Fa).
- La minore naturale: i Lam (La Do Mi), ii° Si dim (Si Re Fa), III Do (Do Mi Sol), iv Rem (Re Fa La), v Mim (Mi Sol Si), VI Fa (Fa La Do), VII Sol (Sol Si Re).
- Sono gli STESSI sette accordi, in ordine diverso, perche' le due scale sono relative (REL).
- Numeri romani: maiuscolo maggiore, minuscolo minore, ° diminuito, + aumentato; ♭ davanti per accordi alterati (♭VII); il vantaggio e' che si trasportano in ogni tonalita' (RNA).
- Settime della scala maggiore: maj7 su I e IV, 7 su V, m7 su ii, iii, vi, semidiminuita su vii (MAJ, S7).
- In minore naturale il v e' minore (Mim); alzando il 7o (Sol♯) diventa maggiore (Mi Sol♯ Si) (DOM).
- "Diatonico" = solo note della scala; un accordo con una nota fuori e' cromatico (es. Re-Fa♯-La in Do maggiore) (DC).
- I, IV, V sono le triadi "primarie" (TRIAD).
**Errori comuni**: scrivere "Fa minore" in La minore; usare il Si dim come accordo di riposo (e' instabile); confondere iii e III.
**App**: l'assistente vede gli accordi della scala scelta (non per le pentatoniche).
**Fonti**: MAJ, MIN, RNA, DC, DOM, S7, O1.16, TRIAD, REL.

## funzioni-armoniche | Tonica, sottodominante e dominante
**Aggiungere**
- Modello di frase: tonica (riposo) -> predominante (si allontana) -> dominante (urgenza di tornare) -> tonica; le funzioni di norma procedono in questo ordine (O4.1).
- In Do maggiore: tonica I Do; predominante IV Fa e ii Rem; dominante V Sol e vii° Si dim (FUN, O4.1).
- Il vi (Lam) e' tonica per Caplin (FUN), predominante debole per OMT (O4.1): la teoria non e' unanime. Si capisce comunque perche' somiglia alla tonica: Lam e Do hanno in comune Do e Mi (calcolato).
- Perche' il V attira: contiene la sensibile (Si in Sol); con la settima (Sol7 = Sol Si Re Fa) il tritono Si-Fa si scioglie in Do-Mi (TRI, RES).
- Cadenza plagale IV-I (Fa -> Do): spesso allunga la tonica piu' che chiudere (O4.10).
- In La minore: Lam -> Rem (o Si dim) -> Mi (con Sol♯) o Mim -> Lam (O4.1, MIN). Mim ha meno tensione, perche' manca la sensibile (MIN).
**Errori comuni**: credere che il V debba sempre andare al I (puo' andare al vi, CAD); trattare le funzioni come leggi: sono tendenze.
**App**: prova Do-Fa-Sol-Do con un accordo per battuta in un pattern di 4 battute.
**Fonti**: FUN, O4.1, DOM, TRI, RES, O4.10, CAD, MIN.

## giro-di-accordi | Giro di accordi (progressione)
**Aggiungere** (accordi calcolati e verificati)
- La funzione di un accordo dipende dal posto nel giro (CP). Con i numeri romani un giro si trasporta ovunque (CP, RNA).
- I-V-vi-IV in Do = Do Sol Lam Fa; vi-IV-I-V = Lam Fa Do Sol (stessi accordi, altro inizio) (AX).
- I-vi-IV-V (il "giro degli anni 50") = Do Lam Fa Sol (CP).
- Lam Fa Do Sol in La minore e' i-VI-III-VII: gli stessi accordi di vi-IV-I-V in Do (AX, calcolato).
- Blues a 12 battute in Do: Do Do Do Do / Fa Fa Do Do / Sol Fa Do Do (variante diffusa), di solito con settime di dominante (BLU).
- ii-V-I (jazz) in Do = Rem Sol Do (CP). Giro "andaluso" in La minore: Lam Sol Fa Mi (con Mi maggiore = Sol♯) (AND, CP).
- Molti brani usano solo I, IV, V; il funk puo' usare un accordo solo (CP). Un giro a 3 accordi si scrive spesso a 4 (I-IV-V-V) per riempire 4 battute (CP).
- Variare: sostituisci un accordo con uno della stessa funzione (Fa -> Rem, FUN).
**Errori comuni**: cambiare tutti gli accordi insieme; aspettarsi che un giro famoso faccia da solo un bel brano; accordi fuori scala senza volerlo.
**App**: pattern di 4 battute con un accordo per battuta; Ctrl+D per duplicare e ritoccare.
**Fonti**: CP, AX, BLU, AND, RNA, FUN.

## cadenza | Cadenza
**Aggiungere**
- Autentica V-I (la piu' forte; "perfetta" se i due accordi sono in stato fondamentale e la tonica e' la nota piu' alta); plagale IV-I ("Amen"); semicadenza = qualunque finale su V (debole, chiede di continuare); d'inganno V-vi (CAD).
- Forza: autentica perfetta > imperfetta > semicadenza (O4.1).
- Do maggiore: Sol -> Do autentica; Fa -> Do plagale; ... -> Sol semicadenza; Sol -> Lam d'inganno. La minore: Mi -> Lam autentica (Mi con Sol♯), Rem -> Lam plagale, Mi -> Fa d'inganno (calcolato).
- Cadenza picarda: un finale in minore su accordo maggiore (Lam -> La maggiore, con Do♯) (CAD).
- La frase finisce con una cadenza, che una fonte chiama "punteggiatura musicale" (PHR).
- Nel pop la plagale serve spesso a prolungare la tonica (O4.10).
**Errori comuni**: lasciare il brano su un accordo di dominante senza volerlo; usare l'inganno a ogni frase; confondere cadenza e fine del brano (c'e' una cadenza a ogni frase).
**App**: nel loop di 4 battute l'ultima battuta decide se "chiude" (tonica) o "sospende" (dominante); ascolta con "Ripeti parte".
**Fonti**: CAD, O4.1, O4.10, PHR.

## tensione-risoluzione | Tensione e risoluzione
**Aggiungere**
- Risoluzione = passaggio da un suono instabile (dissonante) a uno stabile (consonante) (RES).
- Esempio verificato: Sol7 (Sol Si Re Fa) -> Do (Do Mi Sol): il Fa scende al Mi, il Si sale al Do (RES, CD). Si-Fa e' il tritono, 6 semitoni (TRI).
- Una nota a un semitono sotto la tonica (sensibile: Si in Do, Sol♯ in La) tende a salire (LT).
- Ritardare o deviare la risoluzione crea suspense (RES): e' il caso della cadenza d'inganno.
- L'emozione nasce anche dall'attesa confermata, ritardata o tradita (EMO).
- La dissonanza dipende da cultura ed epoca: in pop e jazz un accordo "teso" puo' chiudere un brano senza problemi (RES, CD).
**Errori comuni**: eliminare ogni dissonanza (brano piatto); risolvere sempre subito.
**App**: prova Sol7 (Sol Si Re Fa) -> Do: tutte note di Do maggiore, il blocco sulla scala lo permette.
**Fonti**: RES, CD, TRI, LT, EMO.

## note-in-comune | Note in comune tra accordi
**Aggiungere** (calcolati sulle triadi di Do maggiore)
- Voice leading: ogni voce si muove il meno possibile e si tengono le note comuni (VL).
- Do -> Lam: restano Do e Mi; Sol sale a La. Lam -> Fa: restano La e Do; Mi sale a Fa. Do -> Fa: resta Do; Mi -> Fa e Sol -> La. Sol -> Lam: nessuna in comune, ogni nota sale di un grado.
- Regola pratica: fondamentali a distanza di terza (Do-Lam, Do-Mim) = 2 note in comune; di quinta/quarta (Do-Sol, Do-Fa) = 1; di seconda (Do-Rem) = 0.
- Senza note comuni: muovi le altre voci in senso contrario al basso (VL).
- Rivolti e voicing diversi danno passaggi piu' lisci (VL, INV).
- In classica si evitano quinte e ottave parallele (VL).
**Errori comuni**: far saltare tutte le note a ogni accordo (suono a scatti); farne una regola ferrea.
**App**: tieni le note comuni sulla stessa riga e sposta solo quelle che cambiano.
**Fonti**: VL, INV.

## rivolti | Rivolti degli accordi
**Aggiungere**
- Triade: posizione fondamentale (fondamentale in basso), 1o rivolto (terza in basso), 2o rivolto (quinta in basso) (INV, IT-AC).
- Do: Do-Mi-Sol; 1o Mi-Sol-Do (Do/Mi); 2o Sol-Do-Mi (Do/Sol). Lam: Lam, Lam/Do (Do Mi La), Lam/Mi (Mi La Do) (calcolato).
- Le settime hanno 3 rivolti (INV). Rameau: gli accordi in rivolto hanno la stessa funzione (INV).
- Voicing: stretto (close) o largo (open); una nota raddoppiata in ottave diverse (VOI).
**Errori comuni**: credere che il rivolto cambi il nome (cambia solo il basso); spostare una nota di ottava e crederlo un errore.
**App**: sposta una nota di ottava (Shift+freccia); l'assistente scrive "Do/Mi".
**Fonti**: INV, VOI, IT-AC, O1.16.

## settima | Accordi di settima
**Aggiungere**
- Da Do (S7): maj7 Do Mi Sol Si; 7 (dominante) Do Mi Sol Si♭; m7 Do Mi♭ Sol Si♭; semidiminuito m7♭5 Do Mi♭ Sol♭ Si♭. "Settima" senza altro = di dominante (S7).
- Nella scala di Do (calcolato): Domaj7, Rem7 (Re Fa La Do), Mim7 (Mi Sol Si Re), Famaj7 (Fa La Do Mi), Sol7 (Sol Si Re Fa), Lam7 (La Do Mi Sol), Si m7♭5 (Si Re Fa La). In La minore: Lam7, Si m7♭5, Domaj7, Rem7, Mim7, Famaj7, Sol7.
- Sol7 e' l'unico accordo di dominante della scala: ha il tritono Si-Fa e spinge verso Do (S7, TRI).
- Si usano in jazz e generi moderni; il blues usa settime di dominante su tutti gli accordi: Do7 Fa7 Sol7 (S7, BLU; Do7 ha il Si♭, fuori scala).
- Il maj7 "puo' suonare dissonante a seconda della disposizione" (S7): non e' sempre morbido.
**Errori comuni**: confondere Do7 (con Si♭) e Domaj7 (con Si); mettere "la settima" sbagliata (Si♭ invece di Si).
**App**: maj7/m7 delle triadi della scala restano nella scala; Do7 richiede il Si♭ (blocco spento).
**Fonti**: S7, O1.17, MAJ, TRI, BLU.

## sus | Accordi sospesi (sus2, sus4)
**Aggiungere**
- Sostituisce la terza con la quarta giusta o la seconda maggiore (SUS): Dosus2 = Do Re Sol; Dosus4 = Do Fa Sol; Lasus4 = La Re Mi (calcolato).
- Senza terza: suono "ambiguo e aperto" (SUS).
- Viene dal contrappunto: una nota dell'accordo precedente trattenuta che poi scende alla terza (4 -> 3: Fa -> Mi) (SUS, NCT).
- Spesso si risolve sulla terza, ma nel pop e nel rock molto spesso resta irrisolto (SUS). Comune in folk, pop, rock, jazz modale (SUS).
- Lo stesso gruppo di note puo' avere due nomi: Dosus2 (Do Re Sol) = Solsus4 (Sol Do Re) (calcolato).
**Errori comuni**: aspettarsi un suono maggiore o minore; aggiungere anche la terza: Do Mi Fa Sol ha Mi-Fa a un semitono e stride.
**App**: l'assistente riconosce sus2 e sus4 (codice).
**Fonti**: SUS, NCT, INT.
**Scheda attuale**: "risolve" va attenuato: spesso non risolve.

## diminuito-aumentato | Accordi diminuiti e aumentati
**Aggiungere**
- Diminuito: due terze minori, Si Re Fa; la quinta e' diminuita = tritono, 6 semitoni (DIM, TRIAD, TRI).
- Sta sul vii della maggiore (Si dim in Do) e sul ii del minore naturale (Si dim in La minore) (DIM).
- E' dissonante per il tritono; in rock e pop il ii° e' descritto come "malinconico e abbattuto" (DIM). Di solito si usa in 1o rivolto (DIM).
- "dim" nei libri pop indica spesso la settima diminuita (DIM); l'app riconosce "dim" come triade e m7♭5 come semidiminuito (codice).
- Aumentato: due terze maggiori, Do Mi Sol♯; e' simmetrico: Do+ = Mi+ = Sol♯+ (stesse note) (AUG, TRIAD).
- Non e' diatonico: non sta nella maggiore ne' nella minore naturale; molto dissonante, puo' "sospendere" la tonalita' (AUG).
- Usi: passaggio cromatico, sostituto di dominante, collegamento (I - I+ - vi: Do -> Do+ -> Lam, con Sol -> Sol♯ -> La) (AUG).
**Errori comuni**: usare il Si dim come accordo di arrivo; scrivere Do+ con il blocco sulla scala acceso (Sol♯ e' fuori scala).
**App**: per Do+ spegni "Blocca sulla scala".
**Fonti**: DIM, AUG, TRIAD, TRI.
**Scheda attuale**: "aumentato sospeso, da sogno" e' un'impressione; la fonte: molto dissonante.

## circolo-quinte | Circolo delle quinte
**Aggiungere**
- Ordine (COF): Do, Sol, Re, La, Mi, Si, Fa♯/Sol♭, Do♯/Re♭, La♭, Mi♭, Si♭, Fa. Girando in senso opposto si sale di quarte (COF).
- Un passo avanti = un diesis in piu' (Sol 1, Re 2); un passo indietro = un bemolle in piu' (Fa 1, Si♭ 2) (COF). Ordine dei diesis: Fa♯ Do♯ Sol♯ Re♯ La♯ Mi♯ Si♯; bemolli: Si♭ Mi♭ La♭ Re♭ Sol♭ Do♭ Fa♭ (MAJ).
- Anello interno = relative minori (COF): Do-Lam, Sol-Mim, Re-Sim, La-Fa♯m, Fa-Rem, Si♭-Solm (REL, calcolato).
- Tonalita' vicine = armatura che differisce di un solo diesis o bemolle: le modulazioni piu' facili (COF). Vicine di La minore: Mim (Fa♯) e Rem (Si♭) (calcolato).
- Cadute di quinta tra accordi sono comuni: ii-V-I = Rem Sol Do; catena Lam Rem Sol Do Fa (COF, SEQ).
**Errori comuni**: credere che siano accordi (sono tonalita'); sbagliare il verso (destra = diesis).
**App**: per modulare senza scossoni scegli una tonalita' adiacente.
**Fonti**: COF, MAJ, REL, SEQ.

## modulazione | Cambiare tonalita' (modulazione)
**Aggiungere**
- Modulare = cambiare tonica, modo o entrambi (MODU). Mete piu' comuni: V (la piu' frequente), IV, vi, iii, ii; in minore anche la relativa maggiore (MODU).
- Tecniche: accordo pivot (comune a entrambe: Sol e Re maggiore condividono 4 triadi), nota comune, modulazione diretta (MODU).
- "Truck driver's gear change": salto verso l'alto, di solito di un tono o semitono, verso la fine, tipico del pop (MODU).
- Verso la dominante la tensione cresce, verso la sottodominante cala (DOM).
- Esempio: Do maggiore -> Re maggiore: cambiano solo Fa -> Fa♯ e Do -> Do♯ (5 note su 7 in comune); Do -> Sol: una sola (calcolato).
**Errori comuni**: alzare la melodia e dimenticare basso e accordi; modulare troppo presto o di molto senza preparazione; melodia che esce dalla zona cantabile (registro).
**App**: Ctrl+A nel pattern, spegni "Blocca sulla scala" (con il blocco le frecce vanno di un grado, non di un semitono e non si cambia tonalita'), freccia su: 1 volta = semitono, 2 = un tono. La scala del brano e' una sola: nel ritornello modulato lascia il blocco spento.
**Fonti**: MODU, DOM, TRA, COF.
**Scheda attuale**: aggiungere "spegni Blocca sulla scala" (consiglio sbagliato se il blocco e' acceso).

## accordi-presi-in-prestito | Accordi presi in prestito
**Aggiungere**
- Vengono dalla tonalita' parallela (stessa tonica, modo opposto); si chiama anche modal mixture. L'accordo e' breve, quindi non si perde la tonica (BOR).
- In Do maggiore i piu' comuni usano il La♭: iv Fam (Fa La♭ Do), ♭VI La♭ (La♭ Do Mi♭), ii° Re dim (Re Fa La♭); poi ♭III Mi♭ (Mi♭ Sol Si♭) e ♭VII Si♭ (Si♭ Re Fa) (BOR; accordi calcolati).
- Rock: I-♭VII-♭VI-♭VII (Do Si♭ La♭ Si♭) e I-♭VI-IV (Do La♭ Fa) (BOR). La cadenza ♭VII-I (Si♭ -> Do) e' comune; il ♭VI di solito va al V o V7 (La♭ -> Sol) (BOR).
- Il contrario: la terza picarda, finale maggiore in un brano minore (BOR, CAD).
- In La minore il V maggiore (Mi Sol♯ Si) e' di fatto un accordo "preso" dalla parallela maggiore, diventato normale (DOM).
**Errori comuni**: confondere il Fam di Do maggiore con il Fa di La minore (che e' maggiore!); tenere nella melodia un La naturale mentre suona Fam (La♭): si urtano.
**App**: per queste note disattiva "Blocca sulla scala".
**Fonti**: BOR, CAD, DOM.
**Scheda attuale**: "trionfale", "rock" sono impressioni; verificato solo che ♭VII-I e' comune nel rock.

---

# MELODIA

## melodia | Melodia
**Aggiungere**
- Successione di suoni percepita come un'unica entita', unione di altezza e ritmo, in primo piano rispetto all'accompagnamento (MEL).
- Si descrive con: tipo di moto (gradi o salti), estensione, tensione e rilascio, continuita', cadenza, forma (MEL).
- Spesso e' fatta di una o piu' frasi o motivi (MEL); rock, pop e folk usano una o due melodie (strofa, ritornello, a volte ponte) (MEL).
- Esempio verificato in La minore (giro Lam-Fa-Do-Sol, una battuta ciascuno): note forti sui battiti 1 e 3 = La e Do (su Lam), La e Fa (su Fa), Mi e Sol (su Do), Re e Si (su Sol); sono tutte note dell'accordo. Si riempie con note di passaggio per grado (BEAT, NCT).
- Finire sulla tonica (La) da' chiusura (TON).
**Errori comuni**: tante note tutte diverse e nessuna ripetizione; stesso registro degli accordi; ritmo sempre uguale; nota lunga estranea sul battito forte.
**App**: "Blocca sulla scala"; velocity piu' alta sulle note importanti; "Ripeti parte" su 2-4 battute; tastiera PC per trovare le note a orecchio.
**Fonti**: MEL, BEAT, NCT, TON.
**Scheda attuale**: "culmine" non e' in Melody (vedi MM, REG).

## contorno | Contorno: gradi congiunti e salti
**Aggiungere**
- Congiunto = passi di al massimo un tono; disgiunto = salti piu' grandi di un tono (MM, MC).
- Nel pop il ritornello spesso ha un salto che lo distingue dalle strofe e tiene l'attenzione (MM).
- Forme (Nettl): ascendente, discendente, ondulata (su e giu', spesso finisce scendendo), a pendolo (ampia, a grandi salti), ad arco (sale a un culmine e ridiscende) (MM, MC). Discendenti e ondulate sono piu' comuni delle ascendenti (MM).
- Dopo un salto conviene cambiare direzione (VL): la stessa idea e' dietro all'appoggiatura (salto + passo in senso opposto) (O4.4).
- Esempio: La-Do-Mi (salto di terza) e poi Re-Do (passi indietro); oppure salto d'ottava La3 -> La4 e discesa Sol-Fa-Mi (calcolato).
**Errori comuni**: salti continui (difficile da cantare); tutto per gradi (piatta); salire sempre senza scendere.
**App**: nel piano roll il contorno si vede; le frecce con blocco muovono di un grado, utile per cambiare il profilo.
**Fonti**: MM, MC, VL, O4.4.
**Scheda attuale**: sostituire la fonte inesistente `Steps_and_skips` con `Melodic_motion` (verificata).

## motivo | Motivo, ripetizione e variazione
**Aggiungere**
- Motivo = figura breve, saliente e ricorrente; "l'unita' piu' piccola con identita' tematica", per esempio le 4 note iniziali della Quinta di Beethoven (MOT, MEL).
- Puo' generare melodie, temi e brani interi; e' la parte piu' breve di una frase che mantiene la sua identita' (MOT).
- Si sviluppa alterandolo, ripetendolo o in sequenza (MOT). Sequenza = lo stesso gesto piu' alto o piu' basso: reale (trasposizione esatta) o tonale/diatonica (adattata alla scala) (SEQ). Esempio: Do-Re-Mi, poi Re-Mi-Fa (SEQ, calcolato).
- Hook = idea breve che cattura l'orecchio; puo' essere melodica, ritmica, un testo o un suono; spesso nel ritornello; non serve nulla di strano (HOOK). Riff = frase breve ripetuta, spesso il "main hook" (RIFF).
**Errori comuni**: variare prima che l'idea si fissi; ripetere identico per 16 battute; confondere motivo (poche note) e frase (2-4 battute con cadenza) (PHR).
**App**: scrivi il motivo, Ctrl+D, poi con il blocco acceso freccia su = sequenza diatonica di un grado (verificato).
**Fonti**: MOT, SEQ, HOOK, RIFF, PHR.

## domanda-risposta | Domanda e risposta (frasi)
**Aggiungere**
- Una frase e' un'unita' con senso compiuto che termina con una cadenza; spesso 4 battute, anche 8 o 16 (PHR, O3.2).
- Periodo = due frasi: antecedente (domanda, finale debole: di solito semicadenza) e conseguente (risposta, uguale o piu' lunga, finale forte: autentica) (O3.2, PHR). In un periodo "parallelo" la risposta comincia come la domanda (O3.2).
- In Do maggiore la domanda finisce sull'accordo di Sol (melodia su Sol, Si o Re), la risposta su Do. In La minore: domanda su Mi, risposta su Lam (calcolato).
- Call and response: due frasi di musicisti diversi; origine africana; ha influenzato blues, gospel, jazz, rock, funk, hip hop (CAR). Nel blues la parte B spesso va da dominante a tonica (CAR).
- L'analogia con il linguaggio e' "una delle piu' ambigue" in musica (PHR): e' un'immagine, non una legge.
**Errori comuni**: due frasi uguali (noia); entrambe chiuse sulla tonica (niente domanda); lunghezze irregolari involontarie.
**App**: un pattern di 4 battute per la domanda, uno per la risposta; copia con Ctrl+D e cambia l'ultima nota.
**Fonti**: PHR, O3.2, CAR, CAD.

## note-accordo | Note dell'accordo e note di passaggio
**Aggiungere**
- Nota estranea = non fa parte dell'accordo che suona: su Do (Do Mi Sol) il Fa♯ ma anche il Fa sono estranei (NCT). Dipende dall'accordo, non dalla scala sola.
- Tipi (NCT, O4.4): passaggio (per gradi nella stessa direzione tra due note dell'accordo), bordatura (passo via e ritorno), anticipazione, scappata (passo e salto opposto), appoggiatura (raggiunta per salto, lasciata per grado, di solito sul tempo forte), ritardo (nota tenuta che scende).
- Di solito si risolvono per grado su una nota dell'accordo (NCT). Quelle sul tempo forte creano piu' tensione (NCT).
- Note dell'accordo in La minore: Lam La Do Mi; Rem Re Fa La; Mim Mi Sol Si; Do Do Mi Sol; Fa Fa La Do; Sol Sol Si Re (calcolato).
- Esempio: il Mi va bene su Lam, Do, Mim, ma su Fa e' a un semitono dal Fa: lungo sul battito forte stride, come passaggio va bene (calcolato).
- In 4/4 il battito 1 e' il piu' forte, il 3 il secondo (BEAT): li' vanno le note dell'accordo.
**Errori comuni**: nota lunga estranea sul battito forte e mai risolta; pensare che le note estranee siano sbagliate.
**App**: "Ripeti parte"; se stride, sostituisci con una nota dell'accordo.
**Fonti**: NCT, O4.4, BEAT.
**Scheda attuale**: "appoggiatura" detta di ogni nota estranea sul forte: imprecisa.

## registro-estensione | Registro ed estensione
**Aggiungere**
- Registro = zona dell'altezza in cui suona una parte (grave, media, acuta); cambia anche il timbro (REG). Estensione = distanza tra la nota piu' bassa e la piu' alta (RNG).
- Il culmine di un brano sta di solito nel registro piu' acuto; allargare il registro verso l'alto e il basso da' un senso di intensificazione (REG): utile per build e ritornelli.
- Un basso sta di solito almeno un'ottava e mezza sotto il Do centrale (BASS): sotto circa Fa♯2 (60 - 18 = 42, calcolato); le ottave 1-2 dell'app sono coerenti.
- Il pianoforte va da La0 a Do8 (MN).
- Spostare una parte di 12 semitoni non cambia le note (OCT).
**Errori comuni**: tutto nella stessa zona; melodia sempre acutissima dopo una modulazione.
**App**: la tastiera PC copre le ottave 1-7 (codice).
**Fonti**: REG, RNG, MN, BASS, OCT.
**Scheda attuale**: "entro un'ottava o poco piu'" non verificato.

## arpeggio | Arpeggio
**Aggiungere**
- Le note di un accordo una dopo l'altra, in ordine ascendente o discendente; servono almeno 3 note diverse (2 sono un trillo o tremolo) (ARP).
- Do maggiore su due ottave: Do Mi Sol Do Mi Sol Do (ARP). Parola da "arpeggiare" = suonare l'arpa (ARP).
- Funzioni: ritmo, ornamento, e far sentire un accordo su strumenti che suonano una nota alla volta (ARP). I synth hanno spesso un arpeggiatore (ARP): l'app NO.
- Esempi (La minore, schema su-giu'): Lam La Do Mi Do; Fa Fa La Do La; Do Do Mi Sol Mi; Sol Sol Si Re Si (calcolato).
- Con il blocco acceso, spostare l'arpeggio di 3 gradi con le frecce lo porta sull'accordo della scala 3 gradi sopra: Lam (La Do Mi) -> Rem (Re Fa La) (calcolato).
**Errori comuni**: note fuori accordo; velocity tutte uguali (meccanico); non cambiare le note al cambio accordo.
**App**: disegna le note in fila, copia e incolla lo schema, sposta con le frecce.
**Fonti**: ARP, CH.

## linea-di-basso | Linea di basso
**Aggiungere**
- Il basso lega ritmo e armonia: "tiene il tempo e delinea la tonalita'" (BASS). Di solito enfatizza fondamentale, terza o quinta (BASS).
- Esempio in La minore (Lam Fa Do Sol): fondamentali La Fa Do Sol; con la quinta: La-Mi, Fa-Do, Do-Sol, Sol-Re (calcolato).
- Pedale = una nota tenuta (di solito tonica o dominante) mentre gli accordi cambiano; walking bass = note regolari che salgono o scendono per grado o arpeggio (BASS).
- Si allinea o sincopa con la cassa; nella musica elettronica basso di synth + cassa (BASS).
- Si colloca almeno un'ottava e mezza sotto il Do centrale (BASS).
**Errori comuni**: troppe note veloci acute; note troppo corte che non danno peso; basso e cassa che non coincidono sui battiti principali.
**App**: ottave 1-2 (indicativo); suono pieno, senza acuti.
**Fonti**: BASS, CH.

## contrappunto | Due melodie insieme (contromelodia)
**Aggiungere**
- Contrappunto = due o piu' linee simultanee dipendenti armonicamente ma indipendenti per ritmo e profilo; da "punctus contra punctum", nota contro nota (CPT).
- Il moto contrario (una sale, l'altra scende) deve prevalere; quinte e ottave giuste si raggiungono per moto contrario o obliquo; evitare quinte e ottave parallele, terze e seste parallele vanno bene (CPT).
- Contromelodia = linea secondaria subordinata, percepita come melodia a se' (CM). Una voce che raddoppia in terze fa armonia, non contromelodia (CM).
- Raddoppiare in terze nella scala di Do alterna terze maggiori e minori: Do-Mi (M), Re-Fa (m), Mi-Sol (m), Fa-La (M), Sol-Si (M), La-Do (m), Si-Re (m) (calcolato).
- Nelle marce la contromelodia e' spesso ai tromboni o ai corni (CM).
**Errori comuni**: due linee con lo stesso ritmo e lo stesso registro; contromelodia che salta insieme alla principale.
**App**: usa tracce Strumento con suoni diversi e un po' di pan (mixer).
**Fonti**: CPT, CM.
**Scheda attuale**: "note piu' lunghe quando la melodia e' mossa" e' un consiglio non confermato.

---

# SCHEDE NUOVE PROPOSTE

## accordi-do-maggiore-la-minore | Accordi in Do maggiore e in La minore (tabella)
Perche': e' la scheda che avrebbe evitato l'errore sul Fa.
- Do maggiore: Do, Rem, Mim, Fa, Sol, Lam, Si dim; La minore: Lam, Si dim, Do, Rem, Mim, Fa, Sol (note come in accordi-della-scala).
- Funzioni: tonica Do/Lam; predominante Fa, Rem; dominante Sol, Si dim (FUN).
- "In La minore Fa e' maggiore, Rem minore, Sol maggiore, Do maggiore, Mim minore, Lam minore, Si diminuito".
- Il Mi maggiore (Mi Sol♯ Si) e il Sol♯ non sono nella scala: si usano per la cadenza (DOM, MIN); servono con blocco spento.
- Errori: "Fa minore in La minore": no; "la minore = accordi tutti minori": no.
- Fonti: MAJ, MIN, RNA, FUN, O1.16, DOM.

## riconoscere-accordi | Come riconoscere un accordo (maggiore, minore e altri)
- Conta i semitoni dalla fondamentale: 0-4-7 maggiore; 0-3-7 minore; 0-3-6 dim; 0-4-8 aumentato; 0-5-7 sus4; 0-2-7 sus2; 0-4-7-10 settima; 0-4-7-11 maj7; 0-3-7-10 m7; 0-3-6-10 m7♭5 (TRIAD, S7, SUS; elenco coincide con quello dell'app).
- Con le note in ordine: Fa La Do = 4+3 maggiore; Re Fa La = 3+4 minore; Si Re Fa = 3+3 dim.
- Rivolti: riordina le note finche' sono a terze (Mi Sol Do -> Do Mi Sol = Do/Mi) (INV).
- Errori: guardare il colore dei tasti; credere che il nome della tonalita' decida il tipo di ogni accordo.
- Fonti: TRIAD, MAC, MIC, S7, SUS, INV, IT-AC.

## emozioni-maggiore-minore | Tonalita' ed emozioni: perche' un accordo suona triste
- Maggiore e' percepito come positivo, minore come negativo (EMO); anche bambini di 3 anni ne sono in grado, ma l'origine e' discussa e probabilmente in parte appresa (EMO).
- Il minore e' "piu' scuro" (MIC); la terza minore e' usata dai compositori per la tristezza e collegata al parlato triste (m3); le triadi minori sono giudicate un po' piu' dissonanti (EMO).
- Il tempo e' il fattore piu' importante; veloce e acuto = piu' energia, lento e grave = piu' triste; segnali misti (maggiore + lento) = emozioni miste (EMO).
- Aspettativa: tensione confermata, ritardata o tradita fa emozionare (EMO).
- Ricette (derivate): triste = minore, lento, note lunghe, registro basso; energico = maggiore, veloce, registro alto.
- Errori: pensare che il modo basti; ignorare tempo e ritmo.
- App: scala, BPM, ottave, velocity.
- Fonti: EMO, KEY, MIC, m3.

## colori-accordi | Che effetto fa ogni tipo di accordo
- Maggiore "piu' luminoso" (MAC); minore "piu' scuro" (MIC); quinta vuota (solo fondamentale e quinta) ne' maggiore ne' minore (P5); sus aperto e ambiguo (SUS); dim molto teso per il tritono (DIM); aumentato molto dissonante (AUG); settima di dominante instabile, vuole risolvere (S7, TRI); maj7 puo' suonare dissonante secondo la disposizione (S7).
- Prestiti dalla parallela (Fam, La♭, Si♭ in Do) colorano senza cambiare tonalita' (BOR); terza picarda = finale maggiore in minore (BOR).
- Sono descrizioni di tendenza, non regole.
- Fonti: MAC, MIC, P5, SUS, DIM, AUG, S7, TRI, BOR.

## minore-armonica-melodica | Le tre scale minori e il Sol♯
- La minore naturale: La Si Do Re Mi Fa Sol; armonica: La Si Do Re Mi Fa Sol♯; melodica: su La Si Do Re Mi Fa♯ Sol♯, giu' come la naturale (MIN, O1.13).
- Perche': il Sol♯ e' la sensibile e fa funzionare la cadenza Mi -> Lam; nel V la naturale ha Mim (minore), con Sol♯ diventa Mi maggiore (DOM, MIN).
- Tra Fa e Sol♯ ci sono 3 semitoni (seconda aumentata) (MIN).
- Giro "andaluso" Lam Sol Fa Mi usa il Sol♯ nell'ultimo accordo (AND).
- App: scala minore = naturale; il Sol♯ richiede il blocco spento.
- Fonti: MIN, O1.13, DOM, LT, AND.

## gradi-sensibile-tritono | Nomi dei gradi, sensibile e tritono
- Gradi in Do: I Do tonica, II Re sopratonica, III Mi mediante, IV Fa sottodominante, V Sol dominante, VI La sopradominante, VII Si sensibile (DEG, MAJ; nomi italiani non verificati nelle fonti ammesse).
- Sensibile = mezzo tono sotto la tonica, tende a salire; se la distanza e' un tono si chiama "sottotonica" (Sol in La minore naturale) (DEG, LT).
- Tritono = 6 semitoni, mezza ottava; in Do maggiore Fa-Si (4o e 7o grado); e' dentro Sol7 e Si dim (TRI).
- Il tritono e' "un intervallo inquieto" che chiede di risolversi (TRI); il soprannome "diabolus in musica" e' una leggenda poco documentata (TRI).
- Fonti: DEG, MAJ, O1.12, LT, TRI.

## intervalli-in-semitoni | Tabella degli intervalli
- 0 unisono, 1 seconda minore, 2 seconda maggiore, 3 terza minore, 4 terza maggiore, 5 quarta giusta, 6 tritono, 7 quinta giusta, 8 sesta minore, 9 sesta maggiore, 10 settima minore, 11 settima maggiore, 12 ottava (INT).
- Inversione: i numeri sommano 9 (terza <-> sesta, quarta <-> quinta, seconda <-> settima); giusto resta giusto, maggiore <-> minore (INV, O1.15). Esempio: Do-Mi (terza maggiore, 4) capovolto = Mi-Do (sesta minore, 8): 4 + 8 = 12 (calcolato).
- Qualita': giusti unisono, quarta, quinta, ottava; maggiori o minori seconda, terza, sesta, settima (O1.15).
- Consonanti: unisono, ottava, quinta, quarta (ambigua), terze, seste; dissonanti: seconde, settime, tritono (CD).
- Fonti: INT, O1.15, INV, CD.

## giri-con-nomi | Giri di accordi pronti in Do maggiore e in La minore
- Do maggiore: I-V-vi-IV = Do Sol Lam Fa (AX); vi-IV-I-V = Lam Fa Do Sol (AX); I-vi-IV-V = Do Lam Fa Sol (CP); I-IV-V-I = Do Fa Sol Do (FUN, CAD); ii-V-I = Rem Sol Do (CP); blues 12 battute = Do Do Do Do / Fa Fa Do Do / Sol Fa Do Do (BLU).
- La minore: i-VI-III-VII = Lam Fa Do Sol (AX); i-VII-VI-V = Lam Sol Fa Mi, "andaluso" (AND); i-iv-V-i = Lam Rem Mi Lam (Mi con Sol♯, DOM, O4.1).
- Un accordo per battuta = 4 battute; Ctrl+D per ripetere.
- Errori: Fa minore in La minore; dimenticare che Mi maggiore ha il Sol♯.
- Fonti: AX, CP, BLU, AND, FUN, O4.1, DOM.

## melodia-passo-passo | Come costruire una melodia sopra un giro di accordi
1. Scegli scala e giro (es. La minore: Lam Fa Do Sol, una battuta ciascuno).
2. Scrivi il ritmo (poche note, ripetute) (MEL).
3. Sui battiti 1 e 3 usa note dell'accordo: La/Do su Lam, La/Fa su Fa, Mi/Sol su Do, Re/Si su Sol (NCT, BEAT; calcolato).
4. Riempi con note di passaggio per grado (Si tra La e Do) (NCT, O4.4).
5. Dopo un salto torna per gradi (VL). Chiudi sulla tonica La (TON).
6. Prima frase = domanda (finale sospeso su Sol/Mi), seconda = risposta (finale su La) (O3.2).
7. Ripeti il motivo con piccole variazioni (MOT). Ascolta con "Ripeti parte".
- Fonti: MEL, NCT, O4.4, BEAT, VL, TON, O3.2, MOT.
