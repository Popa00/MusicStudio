# Music Studio

App locale per creare musica, pensata per chi non è musicista.

## Funzionalità

- **Brano**: tracce (batteria o strumento) e blocchi di pattern su una linea del tempo; trascina per spostare, duplica, elimina.
- **Batteria**: 5 suoni sintetizzati (cassa, rullante, battimani, charleston chiuso/aperto) su griglia a step.
- **Strumenti**: sintetizzatore con 6 preset e poche manopole chiare (+ "avanzate").
- **Piano roll**: disegna, sposta, allunga e cancella note; la scala scelta è evidenziata.
- **Tastiera del PC** come pianoforte (A-K, Z/X per l'ottava).
- **Effetti** per traccia: riverbero, delay, filtro, equalizzatore, distorsione.
- **Mixer**: volume, pan, muto, solo e indicatori di livello; volume master protetto da limiter.
- **Annulla/Ripeti**, metronomo, modalità "Solo pattern".
- **Salvataggio automatico** nel browser, **Salva/Apri** file `.msproj`, **Esporta WAV**.
- **Progetti di partenza** e **Guida** con glossario e scorciatoie.

## Avvio

```bash
npm ci          # installa esattamente le versioni di package-lock.json
npm run dev     # http://127.0.0.1:5173
npm test        # test
npm run build   # build di produzione in dist/
```

Stack: TypeScript, React, Vite, Tone.js, Zustand, zod, Vitest.
