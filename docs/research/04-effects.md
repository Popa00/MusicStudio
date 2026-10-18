# 4. Effetti

Un **effetto** trasforma un suono già esistente (lo rende più ampio, più sporco, più compatto…).
Gli effetti si mettono **in catena** (*effect chain*): l'uscita di uno entra nel successivo, e l'ordine conta.

Parametro comune quasi ovunque: **Dry/Wet (`wet` in Tone.js, 0–1)** = quanto suono "originale" (dry)
e quanto suono "effettato" (wet). Tutte le classi effetto di Tone.js hanno `wet`.

---

## 4.1 Tabella riassuntiva

| Effetto | Come suona | Classe Tone.js | Priorità | Diff. |
|---|---|---|---|---|
| Riverbero | "stanza", spazio, eco diffusa | `Reverb`, `Freeverb`, `JCReverb` | MVP | bassa |
| Delay (eco) | ripetizioni distinte | `FeedbackDelay`, `PingPongDelay` | MVP | bassa |
| Filtro | più scuro/sottile | `Filter`, `AutoFilter` | MVP | bassa |
| EQ | regola bassi/medi/acuti | `EQ3` | MVP | bassa |
| Distorsione | sporco, aggressivo | `Distortion`, `Chebyshev` | MVP | bassa |
| Compressore | volume più uniforme, "punch" | `Compressor` | MVP (sul master) / v2 (per traccia) | media |
| Limiter | impedisce la distorsione digitale sul master | `Limiter` | MVP (master) | bassa |
| Chorus | più largo, "doppio" | `Chorus` | v2 | bassa |
| Phaser | "vortice" che sale e scende | `Phaser` | v2 | bassa |
| Flanger | "aereo a reazione" | nessuna classe dedicata: `Chorus` con feedback | v2 | media |
| Tremolo / Vibrato | volume / intonazione che ondeggia | `Tremolo`, `Vibrato` | v2 | bassa |
| Bitcrusher | suono "8-bit", digitale | `BitCrusher` | v2 | bassa |
| Auto-pan | suono che va da sx a dx | `AutoPanner` | v2 | bassa |
| Auto-wah | "wah-wah" chitarra funk | `AutoWah` | nice | bassa |
| Pitch shift | più acuto/grave senza cambiare velocità | `PitchShift` | nice | bassa |
| Stereo width | allarga/stringe lo stereo | `StereoWidener` | nice | bassa |
| Sidechain | il volume "pompa" a tempo con la cassa | non nativo (vedi 4.10) | v2 | media/alta |
| Gate | taglia il suono sotto una soglia | `Gate` | nice | bassa |
| Compressore multibanda | compressione separata per bassi/medi/acuti | `MultibandCompressor` | nice | media |

## 4.2 Riverbero (reverb) — `MVP`

Simula la riflessione del suono in un ambiente (stanza piccola, sala da concerto, cattedrale).
- `Tone.Reverb`: convoluzione con risposta all'impulso **generata** (rumore che decade). Parametri:
  `decay` (durata coda, s: 1 = stanza, 4+ = cattedrale), `preDelay` (s), `wet`. Attenzione: la generazione
  è asincrona → attendere `await reverb.ready` (o `generate()`) prima dell'uso. Più pesante in CPU.
- `Tone.Freeverb` (`roomSize`, `dampening`) e `Tone.JCReverb` (`roomSize`): algoritmici, più leggeri.
- **Web Audio:** `ConvolverNode` (accetta anche impulsi reali registrati, file `.wav`) — `nice`.

## 4.3 Delay (eco) — `MVP`

Ripete il suono dopo un certo tempo. `Tone.FeedbackDelay(delayTime, feedback)`:
`delayTime` (es. `"8n"` = sincronizzato al BPM, molto musicale), `feedback` 0–1 (quante ripetizioni;
vicino a 1 = infinite, pericoloso), `wet`. `Tone.PingPongDelay` = le ripetizioni rimbalzano sx/dx.
**Web Audio:** `DelayNode` + `GainNode` in retroazione.

## 4.4 Filtro come effetto e EQ — `MVP`

- **EQ (equalizzatore):** alza/abbassa fasce di frequenza. `Tone.EQ3` con `low`, `mid`, `high` (in dB) e
  `lowFrequency`, `highFrequency` (confini delle bande). Esempio: togliere bassi a un pad per non
  "impastare" con il basso. Un EQ parametrico multi-banda con grafico (stile Ableton EQ Eight / Pro-Q)
  si costruisce con più `BiquadFilter` (tipo `peaking`, `lowshelf`, `highshelf`) — `v2`, media.
- **Filtro:** vedi `01-sound-generation.md` §1.6; come effetto è il classico "sweep" (apertura graduale
  del low-pass) nelle build-up EDM, da automatizzare (vedi automazione).

## 4.5 Distorsione e saturazione — `MVP`

Aggiunge armoniche "sporcando" il segnale: da calore leggero (saturazione) a chitarra metal.
`Tone.Distortion(distortion 0–1)` con `oversample` (`"none"`/`"2x"`/`"4x"`: più alto = meno artefatti
digitali, più CPU). `Tone.Chebyshev(order)` = distorsione armonica più "colorata".
**Web Audio:** `WaveShaperNode`.

## 4.6 Compressore e limiter — `MVP` (sul master)

- **Compressore:** quando il volume supera una soglia, lo abbassa. Risultato: volume più uniforme e
  "compatto"; usato su voce, batteria, master. Parametri (`Tone.Compressor`, basato su
  `DynamicsCompressorNode`): `threshold` (dB, soglia, es. -24), `ratio` (quanto comprime, 4 = 4:1),
  `attack` (s, quanto in fretta interviene), `release` (s, quanto in fretta smette), `knee` (morbidezza).
- **Limiter:** compressore "estremo" (ratio altissimo) che non fa superare mai una soglia.
  `Tone.Limiter(threshold)`; sul master con soglia ~ -1 dB evita il **clipping** (distorsione digitale
  quando il volume supera 0 dBFS). Consigliato sempre attivo sul master nell'MVP.

## 4.7 Chorus, flanger, phaser — `v2`

Effetti di **modulazione**: copiano il suono, lo ritardano di pochi millisecondi e fanno oscillare quel
ritardo con un LFO.
- **Chorus** (`Tone.Chorus(frequency, delayTime, depth)`, più `feedback`, `spread`): "tanti strumenti che
  suonano insieme", allarga lo stereo. Ritardo tipico 2–20 ms. **Serve `.start()`** per avviare l'LFO interno.
- **Flanger:** come il chorus ma con ritardo più breve (≈1–5 ms) e **feedback alto** → suono "a jet".
  Tone.js non ha una classe `Flanger` (verificato sull'elenco classi); la doc di `Chorus` dice che
  `feedback > 0` dà effetti tipo flanger → implementarlo come preset di `Chorus` o con
  `FeedbackDelay` + `LFO` collegato a `delayTime`.
- **Phaser** (`Tone.Phaser`: `frequency`, `octaves`, `baseFrequency`, `Q`): "swoosh" rotante, stile anni '70.

## 4.8 Tremolo, vibrato, auto-pan, bitcrusher — `v2`

- `Tone.Tremolo(frequency, depth)` → volume che pulsa; serve `.start()`.
- `Tone.Vibrato(frequency, depth)` → intonazione che oscilla (voce/violino).
- `Tone.AutoPanner(frequency)` → il suono gira tra le casse; serve `.start()`.
- `Tone.BitCrusher(bits)` → riduce la risoluzione: suono da vecchia console (4 bit = molto sporco).

## 4.9 Catene di effetti (insert) — `MVP` (lista fissa) / `v2` (ordine libero)

- **Insert:** effetti inseriti direttamente su una traccia: strumento → effetto1 → effetto2 → canale mixer.
  In Tone.js: `synth.chain(fx1, fx2, channel)`. Per riordinare/aggiungere a runtime: `disconnect()` e
  ricollegare tutta la catena (operazione semplice ma va centralizzata in un modulo `fxChain.ts`).
- **Send:** effetto condiviso su un canale separato (es. un solo riverbero per tutte le tracce) → vedi
  `05-mixer-automation.md`. Risparmia CPU ed è la pratica standard per reverb/delay.
- UI: lista verticale/orizzontale di "card" con bypass (on/off) per effetto, come Ableton Device View e
  GarageBand "Plug-ins". Bypass in Tone.js: `wet.value = 0` oppure scollegare.
- Ogni effetto nel suo file (`src/audio/effects/reverb.ts` ecc.), con una descrizione JSON dei parametri
  (nome, min, max, unità, default) da cui la UI genera automaticamente le manopole.

## 4.10 Sidechain — `v2`, difficoltà media/alta

**Cos'è:** il volume di una traccia (es. pad o basso) si abbassa automaticamente **ogni volta che suona
la cassa**, poi risale. Crea l'effetto "pompante" tipico della house/EDM e fa spazio alla cassa.
- La Web Audio API **non ha** un ingresso sidechain nel `DynamicsCompressorNode`, quindi neanche
  `Tone.Compressor` (che lo usa internamente).
- Soluzioni:
  1. **"Finto" sidechain a tempo** (consigliato, semplice): a ogni nota della cassa schedulata, applicare
     una rampa al `Gain`/volume della traccia (`gain.setValueAtTime(0.2, t); gain.linearRampToValueAtTime(1, t+0.2)`).
     Molti produttori usano già questo approccio (plugin "volume shaper" tipo LFOTool/Kickstart).
  2. **Sidechain vero:** `Tone.Follower` (segue il volume della cassa) → `Tone.Scale`/`Tone.Subtract` →
     controlla il `Gain` della traccia. Più flessibile, più delicato da tarare.

## 4.11 Preset effetti — `MVP`

Come per gli strumenti: preset con nomi chiari ("Stanza piccola", "Sala grande", "Eco a tempo",
"Radio vecchia") valgono più di 6 manopole. Ableton, GarageBand e BandLab ne fanno largo uso.

## Note di prestazione
- Ogni effetto costa CPU; `Reverb` e `PitchShift` sono tra i più pesanti. Usare reverb/delay in **send**.
- Effetti con LFO (`Chorus`, `Tremolo`, `AutoPanner`, `AutoFilter`) vanno avviati con `.start()`.
- Ricordarsi `dispose()` quando un effetto viene rimosso (evita perdite di memoria).

## Fonti
- Tone.js API (sezioni Effect/Component): https://tonejs.github.io/docs/
- Tone.js Chorus: https://tonejs.github.io/docs/15.1.22/classes/Chorus.html
- MDN DynamicsCompressorNode: https://developer.mozilla.org/en-US/docs/Web/API/DynamicsCompressorNode
- MDN ConvolverNode: https://developer.mozilla.org/en-US/docs/Web/API/ConvolverNode
- Ableton Live Manual, Audio Effect Reference: https://www.ableton.com/en/manual/live-audio-effect-reference/
