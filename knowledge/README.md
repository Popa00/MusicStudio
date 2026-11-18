# Biblioteca dell'assistente

Le schede in `cards/` sono la conoscenza musicale da cui l'assistente di Music Studio prende le informazioni per rispondere. Sono testi brevi in italiano, uno per concetto, scritti per chi non è musicista.

## Formato di una scheda

Un file per area (`basi.md`, `armonia.md`, `ritmo.md`…). Ogni scheda:

```markdown
## riverbero | Riverbero
parole: riverbero, reverb, stanza, sala, spazio
fonti: Reverberation (Wikipedia) <https://en.wikipedia.org/wiki/Reverberation>

Testo della scheda…

### Errori comuni
Una sotto-sezione…
```

- `riverbero` è l'identificativo (minuscole, numeri e trattini), poi c'è il titolo.
- `parole`: parole chiave separate da virgole, comprese le espressioni che userebbe un principiante (per esempio "il suono gracchia").
- `fonti`: le pagine da cui vengono le informazioni, nel formato `Titolo <https://…>`, separate da `;`. Sono ammessi solo siti con licenza compatibile: Wikipedia, Wikibooks, Open Music Theory.
- Sotto-sezioni (`### Titolo`, facoltative): una scheda lunga (fino a ~2500 caratteri) si divide in sotto-sezioni, ognuna su un aspetto (come si usa, errori comuni, esempi…). Ogni sotto-sezione diventa un "pezzo" con il suo vettore, così una domanda precisa trova la parte giusta; all'assistente arriva poi la scheda intera. Le sotto-sezioni più corte di 200 caratteri si uniscono a quella prima.

Dopo ogni modifica:

```bash
npm run knowledge:build   # ricostruisce public/knowledge/index.json (serve LM Studio con bge-m3)
npm run knowledge:eval    # misura quanto bene la ricerca trova le schede giuste
```

## Licenza

I testi di questa cartella e l'indice generato (`public/knowledge/index.json`) sono distribuiti con licenza **Creative Commons Attribuzione – Condividi allo stesso modo 4.0 Internazionale (CC BY-SA 4.0)**: <https://creativecommons.org/licenses/by-sa/4.0/deed.it>.
Puoi copiarli e modificarli, anche per scopi commerciali, citando la fonte e distribuendo le versioni modificate con la stessa licenza.

La licenza vale solo per questa biblioteca: il codice dell'app non è coperto (vedi il README principale).

## Crediti

Le schede sono scritte per Music Studio, riassumendo e semplificando le pagine indicate in `fonti:` di ogni scheda. Per ora l'unica fonte è **Wikipedia** (contributori vari, CC BY-SA 4.0): ogni scheda cita le voci usate, con il link. Quando si aggiungeranno testi da altre fonti (per esempio Open Music Theory), vanno elencati qui con autori, link e licenza.

Il controllo dei fatti è riportato in `docs/research/verifica-schede.md`. Le schede semplificano, ma non devono dire cose false: se trovi un errore, correggilo e ricostruisci l'indice.
