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
- Ogni sorgente sonora si collega a `getMasterInput()` (passa dal limiter), mai direttamente a `Tone.Destination`.
- Ogni file importato (progetto, preset, MIDI) va validato con zod prima dell'uso.
- Il dev server resta su `127.0.0.1`.

## Subagent
- `music-app-researcher`: ricerca su funzionalità e concetti musicali → scrive in `docs/research/`.
- `security-code-reviewer`: da eseguire prima di ogni commit significativo e quando si aggiungono dipendenze o import di file.
- `test-writer`: scrive ed esegue i test Vitest dopo ogni nuova funzionalità; tocca solo file `*.test.ts(x)` e segnala i bug invece di correggerli.
