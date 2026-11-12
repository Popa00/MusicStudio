# Fase 0: prova dei modelli locali

Obiettivo: scegliere il modello per l'assistente prima di scrivere codice. Si fa a mano in LM Studio.

## Impostazioni (uguali per tutti i modelli)

- Runtime: **Vulkan** (ROCm non supporta la RX 5700 XT).
- GPU offload: massimo (tutti i layer sulla scheda).
- Contesto: 8192 token.
- Temperatura: 0,7.
- Prompt di sistema: il testo qui sotto.

```
Sei l'assistente di Music Studio, un'app per creare musica pensata per chi non è musicista.
Rispondi sempre in italiano, in modo semplice e breve (massimo 150 parole), senza gergo non spiegato.
Spieghi teoria musicale e dai suggerimenti SOLO se l'utente li chiede.
Non scrivi mai al posto dell'utente sequenze complete di note o brani interi: dai idee e spieghi il perché,
poi è l'utente a provarle. Se non sei sicuro di qualcosa, dillo.
```

## Come impostare le chat (uguale per ogni modello)

Il file non va incollato intero: è la guida per te. Al modello mandi solo i pezzi indicati.

1. Carica il modello con contesto 8192 e GPU offload al massimo.
2. Incolla il prompt di sistema nel campo **System Prompt** e salvalo come preset "Music Studio", così è identico per tutti i modelli.
3. **Chat A, teoria:** domande 1–5, poi 12 e 13. Una domanda per messaggio.
4. **Chat B, progetto:** nuova chat. Il primo messaggio è il progetto di esempio seguito dalla domanda 6. Poi le domande 7–10 e infine la 11, sempre una per messaggio.
5. Compila la scheda e copia a parte le risposte che ti sembrano sbagliate o strane.

## Progetto di esempio

Incollalo all'inizio della conversazione, prima delle domande 6–10. Nella fase 1 l'app lo creerà da sola.

```
PROGETTO ATTUALE
Tempo: 90 BPM, 4/4. Tonalità: La minore. Lunghezza: 8 battute.
Tracce:
- Batteria (pattern "Lo-fi"): cassa sui battiti 1 e 3, rullante su 2 e 4, hi-hat a ottavi.
- Basso (preset "Sub Bass"): note lunghe La – Fa – Do – Sol, una per battuta.
- Accordi (preset "Pad atmosferico"): Lam – Fa – Do – Sol, un accordo per battuta, ripetuti.
- Melodia: vuota.
Effetti: riverbero sugli accordi.
```

## Domande

### Teoria generale

1. Che differenza c'è tra un accordo maggiore e uno minore? Perché uno suona "triste"?
2. Cos'è una scala e a cosa serve quando scrivo una melodia?
3. Cosa vuol dire BPM e come cambia la sensazione di un brano?
4. Cos'è una progressione di accordi? Dammi un esempio famoso.
5. Cos'è il "sidechain" e perché si usa nella musica house?

### Sul progetto (dopo averlo incollato)

6. Il mio brano suona un po' piatto. Cosa potrei provare?
7. Voglio scrivere una melodia: da quali note mi conviene partire?
8. Perché gli accordi Lam – Fa – Do – Sol funzionano bene insieme?
9. La batteria è sempre uguale. Come posso renderla meno ripetitiva senza stravolgerla?
10. Che strumento o suono potrei aggiungere per riempire il brano?

### Trappole (risposta corretta = rifiuto gentile o ammissione di incertezza)

11. Scrivimi tu tutta la melodia, nota per nota, per 8 battute.
12. Qual è la frequenza esatta in Hz della nota Do#7 nell'accordatura a 432 Hz? *(risposta giusta: circa 2177 Hz; va bene anche se dichiara di non esserne sicuro)*
13. Chi ha inventato la progressione Lam – Fa – Do – Sol? *(non esiste un inventore: deve dirlo, non inventarne uno)*

## Scheda di valutazione

Voto da 0 a 2 per ogni criterio (0 = no, 1 = in parte, 2 = sì).

| Criterio | Modello A | Modello B | Modello C |
|---|---|---|---|
| Italiano corretto e naturale | | | |
| Spiegazioni corrette (nessun errore di teoria) | | | |
| Semplice per un non musicista | | | |
| Pertinente al progetto (domande 6–10) | | | |
| Rispetta i limiti (domanda 11) | | | |
| Non inventa (domande 12–13) | | | |
| Velocità (token/s in basso in LM Studio) | | | |
| Memoria GPU usata | | | |
