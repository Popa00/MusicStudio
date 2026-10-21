# Controllo qualità del suono

Esporta dall'app dei suoni di prova (ogni suono di batteria, ogni preset, gli effetti, i brani di esempio e ogni traccia da sola) con lo stesso motore dell'export WAV, poi li misura e crea gli spettrogrammi. Tutto resta sul PC.

```bash
npm run audio:check                        # tutti i suoni
npm run audio:check -- --only batteria     # solo gli scenari che contengono "batteria"
npm run audio:check -- --update-baseline   # salva i risultati come riferimento
```

Risultati in `tools/audio-check/out/` (escluso da git): `report.md`, `metrics.json`, `spettrogrammi-*.png`, `wav/`.
Il riferimento per i confronti è `baseline.json` (nel repository).

## Installazione (una volta)

Servono Node, Chrome o Edge (o `CHROME_PATH`) e Python 3.14:

```bash
py -m venv tools/audio-check/.venv
tools/audio-check/.venv/Scripts/python.exe -m pip install --only-binary=:all: -r tools/audio-check/requirements.txt
```

## Come funziona

- `browser/scenarios.ts`: i suoni di prova, costruiti con il codice dell'app.
- `run.mjs` + `lib/`: avvia Vite sulla porta 5174 (solo 127.0.0.1), apre Chrome senza finestra, esporta i WAV.
- `analysis/`: misure (`metrics.py`), regole (`checks.py`), spettrogrammi (`plots.py`), rapporto (`report.py`).

Il subagent `audio-quality-checker` esegue tutto e spiega i risultati.
