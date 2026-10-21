# Music Studio: app di creazione musicale (uso locale)

L'utente non è un musicista: spiegare i concetti musicali in modo semplice.

## Stack e comandi
TypeScript, React, Vite, Tone.js, Zustand (stato), zod (validazione file importati), Vitest.
- `npm run dev` · `npm test` · `npm run typecheck` · `npm run lint` · `npm run build`

## Convenzioni di codice
- File piccoli e focalizzati: un componente / modulo / effetto per file. Obiettivo ≤ ~150 righe per file, mai oltre ~200: se si supera, dividere.
- Funzioni ≤ ~50 righe.
- Raggruppare per funzionalità (es. `src/audio/effects/reverb.ts`, `src/ui/mixer/ChannelStrip.tsx`), non per tipo di file.
- Il motore audio (`src/audio/`) non dipende dalla UI: la UI legge/scrive lo stato, il motore audio reagisce.
- Ogni sorgente sonora passa da `master.input` del grafo (`src/audio/graph/master.ts`: limiter + clipper), mai direttamente a `Tone.Destination`.
- Il motore si ricostruisce dal solo progetto (`createGraph(project)`): lo usa anche l'export WAV offline.
- Ogni file importato (progetto, preset, MIDI) va validato con zod prima dell'uso (`src/io/projectFile.ts`).

## Struttura
- `src/project/`: modello dati (schema zod = fonte dei tipi), operazioni pure (`ops/`), modelli di partenza.
- `src/music/`: logica musicale pura (tempi, scale, note, cosa suonare a ogni step).
- `src/state/`: store Zustand (progetto con annulla/ripeti, UI, riproduzione) e azioni.
- `src/audio/`: motore Tone.js (grafo, strumenti, effetti, sequencer, export).
- `src/io/`: salvataggio automatico, file di progetto, download.
- `src/ui/`: componenti React raggruppati per area.
- Il dev server resta su `127.0.0.1`.

## Verifica nel browser
- MCP `playwright` (`.mcp.json`): Chrome headless, profilo temporaneo, solo `127.0.0.1:5173` (dev) e `:4173` (preview).
- Dopo modifiche all'interfaccia: avvia `npm run dev`, apri l'app, controlla con screenshot e console che non ci siano errori.
- L'audio non si può ascoltare: si verifica con `npm run audio:check` (vedi `tools/audio-check/README.md`).

## Subagent
- `music-app-researcher`: ricerca su funzionalità e concetti musicali → scrive in `docs/research/`.
- `security-code-reviewer`: da eseguire prima di ogni commit significativo e quando si aggiungono dipendenze o import di file.
- `test-writer`: scrive ed esegue i test Vitest dopo ogni nuova funzionalità; tocca solo file `*.test.ts(x)` e segnala i bug invece di correggerli.
- `audio-quality-checker`: dopo ogni modifica che può cambiare il suono (`src/audio/**`, preset, modelli, effetti); misura, guarda gli spettrogrammi, confronta con `tools/audio-check/baseline.json`. Il riferimento si aggiorna solo quando l'utente approva il nuovo suono.
