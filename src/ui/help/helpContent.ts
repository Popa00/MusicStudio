export const GETTING_STARTED = [
  'Premi Play (o la barra spaziatrice) per ascoltare il brano di esempio.',
  'In alto c\'è il "Brano": ogni riga è una traccia (uno strumento), ogni blocco è un pattern che suona in quelle battute.',
  'Clicca un blocco per modificarlo nel pannello in basso: la griglia per la batteria, il piano roll per gli strumenti.',
  'Nel piano roll le righe chiare sono le note della scala: usandole è difficile stonare.',
  'Suona con la tastiera del PC (tasti A S D F G H J K) per trovare le note a orecchio, poi disegnale.',
  'Usa "Solo pattern" per ascoltare in loop solo quello che stai modificando.',
  'Quando ti piace, "Esporta WAV" crea il file audio della canzone.',
]

export const GLOSSARY: [string, string][] = [
  ['BPM', 'Battiti al minuto: la velocità del brano. 70-90 è lento, 120-130 è da ballare.'],
  ['Battuta', 'Un gruppo di battiti (qui 4). I numeri sopra la linea del tempo sono le battute.'],
  ['Pattern', 'Un pezzo di musica riutilizzabile (un ritmo, un giro di accordi). Lo puoi mettere più volte nel brano.'],
  ['Traccia', 'Una "corsia" con un solo strumento: batteria, basso, accordi, melodia…'],
  ['Scala / Tonalità', 'L\'insieme di note che "stanno bene insieme". Maggiore suona allegra, minore malinconica.'],
  ['Preset', 'Un suono già pronto dello strumento, da usare così o da ritoccare.'],
  ['Attacco / Rilascio', 'Quanto velocemente una nota entra e quanto continua a suonare dopo averla lasciata.'],
  ['Effetto', 'Trasforma il suono di una traccia: riverbero (eco di stanza), delay (eco a tempo), filtro, distorsione…'],
  ['Mixer', 'Dove si bilanciano i volumi delle tracce e la loro posizione tra cassa sinistra e destra (pan).'],
  ['dB (decibel)', 'Unità del volume. 0 dB = volume normale, valori negativi = più piano.'],
]

export const SHORTCUTS: [string, string][] = [
  ['Spazio', 'Play / Stop'],
  ['A S D F G H J K', 'Suona le note (tasti bianchi); W E T Y U O P i tasti neri'],
  ['Z / X', 'Ottava più bassa / più alta'],
  ['Ctrl+Z', 'Annulla'],
  ['Ctrl+Y (o Ctrl+Shift+Z)', 'Ripeti'],
  ['Canc', 'Elimina il blocco selezionato nel brano'],
  ['Clic destro', 'Elimina una nota o un blocco'],
  ['Doppio clic su un cursore del mixer', 'Torna al valore iniziale'],
]
