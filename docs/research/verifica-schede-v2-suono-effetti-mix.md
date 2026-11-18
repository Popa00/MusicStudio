# Verifica schede v2: suono, effetti, mix

Data: 2026-11-18. Schede controllate: 27 (9 in `suono.md`, 8 in `effetti.md`, 10 in `mix.md`, escluse le intestazioni dei file). Nessuna scheda e' stata modificata.

## Riepilogo

- Schede con errori veri: 1 (`pan`). L'errore e' di tipo "app": propone una cosa che nell'app non si puo' fare come descritta.
- Schede con imprecisioni: 2 (`equalizzatore`, `mix`).
- Schede con solo rilievi di stile o coerenza tra schede: 3 (`pad`, `filtro-effetto`, `ordine-effetti`).
- Le altre 21 schede non hanno problemi trovati.

Cosa e' stato verificato e risulta corretto:

- Tutti i numeri dell'interfaccia coincidono con il codice: Attacco 0,001-4 s, Decadimento 0,01-4 s, Sostegno 0-100%, Rilascio 0,01-8 s, Brillantezza 50-18000 Hz, Risonanza 0,1-15, filtro del synth a 12 dB/ottava, polifonia 16 voci, riverbero Durata 0,2-10 s (iniziale 2,5) e Quantita' 30%, delay (4 tempi, Ripetizioni max 85%, Quantita' 25%), filtro (20-20000 Hz, iniziale 2000 Hz, Risonanza iniziale 1), EQ -24/+12 dB con bande sotto 400 Hz, 400-2500 Hz, sopra 2500 Hz (valori predefiniti di Tone.EQ3, usati senza modifiche), distorsione (Intensita' 30%, Quantita' 50%), fino a 6 effetti per traccia, fader da -60 a +6 dB con doppio clic a 0 dB, pan "sx/dx" con doppio clic al centro, pan a potenza costante (-3 dB per lato al centro), indicatore rosso sopra -3 dB, M/S sia nell'intestazione traccia sia nel Mixer, "Esporta WAV" costruito dal progetto con muto/solo attuali, riverbero con taglio dei bassi a 150 Hz e smorzamento acuti a 5 kHz, limiter a -1 dB seguito da clipper.
- Nomi dei preset citati (Pad atmosferico, Archi, Tappeto scuro, Basso, Sub basso, Basso acido, Lead, Pluck, Flauto, Fiati synth, Chiptune, Campanella, Corda pizzicata, Piano elettrico) e relativi gruppi: tutti esistono. Valori citati (Basso acido Risonanza 10 e 900 Hz; Pad atmosferico 0,8 s / 2,5 s; Tappeto scuro rilascio 4 s) corretti.
- Tempi: 1/16 = 15000/BPM ms (125 ms a 120 BPM, 107 ms a 140 BPM), 1/8 puntato = 375 ms a 120 BPM, battito = 60000/BPM: corretti.
- Limiter di Tone: compressore con rapporto 20:1, attacco 3 ms, rilascio 10 ms, knee 30 dB (letto in `node_modules/tone`): coerente con "abbassa i picchi, ma quelli rapidissimi possono sfuggire e arrivare al clipper".
- Nessuna scheda cita funzioni inesistenti (bus/mandate, compressore, sidechain, automazione, registrazione, ping pong): dove ne parlano e' per dire che mancano.
- Fonti: tutte le URL sono pagine esistenti (Wikipedia/Wikibooks). Aperte e confrontate quelle dei punti dubbi: Delay (slapback 60-250 ms con poco feedback; sotto 50 ms nessun'eco percepita), Roland TR-808 (cassa = oscillatore sinusoidale + passa-basso + VCA; Rick Rubin e il decadimento allungato), Roland TB-303 (dente di sega o quadra, passa-basso risonante; Phuture "Acid Tracks" 1987), Sub-bass (sotto circa 70 Hz, "felt more than heard"), Missing fundamental (voce maschile al telefono, MaxxBass), Square wave (solo armonici dispari, "hollow", usata per fiati), Wikibooks Bass Mixdown (3-4 dB di headroom per il mastering; EQ sottrattivo; kick/basso). Non riaperte una per una le altre pagine Wikipedia generiche (Decibel, Headroom, Clipping, ecc.): le affermazioni sono standard e coerenti con la conoscenza comune, ma non riverificate riga per riga.

---

## Schede con problemi

### pan (mix.md)

- **Frase**: "Un punto di partenza indicativo: un pan tra 20 e 50 su un lato di solito basta, per esempio charleston un po' a destra e shaker un po' a sinistra."
- **Perche'**: il pan nell'app e' per traccia. Charleston e shaker di norma stanno nella stessa traccia Batteria (un solo pan per tutta la batteria; la scheda `riverbero` dice giustamente che l'effetto vale per tutti i suoni della batteria). Per separarli servirebbero tracce "Percussione singola" distinte, cosa che la scheda non dice.
- **Correzione proposta** (sostituire la frase): "Un punto di partenza indicativo: un pan tra 20 e 50 su un lato di solito basta. Attenzione: il pan vale per tutta la traccia, quindi per spostare un suono della batteria (per esempio lo shaker) da solo serve una traccia 'Percussione singola' con quel suono; se invece i suoni stanno tutti nella traccia Batteria si spostano tutti insieme. Con due tracce simili, per esempio due melodie, si puo' mettere una un po' a sinistra e l'altra un po' a destra."
- **Gravita'**: errore (descrive qualcosa che nell'app, cosi' com'e', non si puo' fare).

### equalizzatore (effetti.md)

- **Frase**: "se il basso copre la cassa, abbassare Bassi di 3-6 dB sulla traccia del pad o del basso".
- **Perche'**: confusa. Se e' il basso a coprire la cassa, il pad non c'entra. La banda "Bassi" dell'app arriva fino a circa 400 Hz e abbassarla di 3-6 dB sul basso lo rende molto piu' sottile. Inoltre la cassa di norma sta nella traccia Batteria, che e' un'altra traccia: l'EQ sul basso non puo' "fare spazio" a un punto preciso. Va anche in conflitto con la scheda `spazio-frequenze`, che parla di abbassare i Bassi "sul pad".
- **Correzione proposta**: "Punti di partenza indicativi: se un pad o degli accordi rendono il mix pesante e confuso, abbassare Bassi di 3-6 dB su quella traccia; se un suono e' troppo aspro, abbassare Acuti di 3-5 dB. Abbassare Bassi sul basso lo rende piu' sottile: farlo solo per qualche dB e ascoltando il risultato insieme alla cassa."
- **Gravita'**: impreciso.

### mix (mix.md)

- **Frase**: "Un manuale di mixaggio consiglia di finire il mix qualche dB sotto il massimo (3-4 dB), per lasciare margine."
- **Perche'**: la fonte (Wikibooks Bass Mixdown) lo dice per chi consegna il mix a un tecnico del mastering ("A Mastering Engineer will want 3 or 4 dB of headroom"). Qui e' presentato come regola generale, senza il contesto, mentre la scheda `headroom-livelli` lo ridimensiona giustamente ("indicazione, non regola"). Inoltre nell'app il Master e' protetto da limiter e clipper a -1 dB, quindi per l'uso locale conta soprattutto che l'indicatore Master non resti rosso.
- **Correzione proposta**: "Se il brano deve andare a qualcuno per il mastering (la rifinitura finale), un manuale di mixaggio consiglia di lasciare 3-4 dB di margine sotto il massimo. Per un uso personale basta evitare che l'indicatore del Master resti rosso."
- **Gravita'**: impreciso.

### pad (suono.md)

- **Frase**: "Per togliere i bassi inutili si puo' aggiungere l'effetto Filtro in modalita' passa-alto, con Frequenza indicativa intorno a 150-250 Hz. Per allontanarlo un po' basta un riverbero leggero, per esempio Quantita' 20-30% come punto di partenza."
- **Perche'**: nessun errore di fatto, ma i numeri non coincidono con le altre schede: `filtro-effetto` suggerisce passa-alto a 100-200 Hz sui pad; `riverbero` suggerisce Quantita' 25-40% sui pad. Un principiante che legge entrambe vede valori diversi per la stessa situazione.
- **Correzione proposta**: "Per togliere i bassi inutili si puo' aggiungere l'effetto Filtro in modalita' passa-alto, con Frequenza indicativa intorno a 100-200 Hz. Per allontanarlo un po' basta un riverbero, per esempio Quantita' 25-40% come punto di partenza."
- **Gravita'**: stile (coerenza).

### filtro-effetto (effetti.md)

- **Frase**: "passa-basso a 1-3 kHz per un effetto lo-fi."
- **Perche'**: la scheda `filtro-synth` dice "Brillantezza intorno a 1-2 kHz" per lo stesso scopo. Stessa idea, intervalli diversi; inoltre il lo-fi vero ha anche altri ingredienti (rumore, instabilita') che l'app non ha, quindi meglio dirlo come "assomiglia a".
- **Correzione proposta**: "passa-basso a 1-2 kHz per un suono che ricorda il lo-fi (ovattato)."
- **Gravita'**: stile (coerenza).

### ordine-effetti (effetti.md)

- **Frase**: "aggiungere due effetti uguali in fila senza motivo."
- **Perche'**: la scheda `filtro-effetto` spiega l'effetto "telefono" con un passa-alto piu' un passa-basso, che nell'app richiede due effetti Filtro in fila. Il "senza motivo" salva la coerenza, ma un principiante puo' leggerla come un divieto.
- **Correzione proposta**: "aggiungere due effetti uguali in fila senza un motivo preciso (un'eccezione utile: due Filtri, uno passa-alto e uno passa-basso, per l'effetto telefono)."
- **Gravita'**: stile.

---

## Note senza gravita' (nessuna azione richiesta)

- `distorsione` dice di non distorcere i bassi molto profondi, mentre `suono-basso` e `armonici-fondamentale` consigliano un po' di distorsione sul sub. Non e' una contraddizione (valori bassi: Intensita' 10-20%), ma si potrebbe aggiungere "se esagerata" nella frase di `distorsione`.
- `frequenze`: "un adulto di solito arriva intorno ai 16 kHz" e' un ordine di grandezza usuale ma non e' stato confermato riga per riga sulla fonte.
- `equalizzatore` spiega shelving e peaking in generale; l'EQ dell'app e' a tre bande fisse (Tone.EQ3). La scheda non afferma il contrario, quindi nessun errore.
