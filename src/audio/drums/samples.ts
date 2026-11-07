/**
 * Suoni registrati (piatti): file in `public/samples/`, scaricati e decodificati una volta sola
 * e condivisi da tutte le batterie, dal vivo e nell'export (un AudioBuffer va bene in ogni contesto).
 */
const loading = new Map<string, Promise<AudioBuffer>>()
const loaded = new Map<string, AudioBuffer>()

export function sampleUrl(file: string): string {
  return `${import.meta.env.BASE_URL}samples/${file}`
}

async function fetchAndDecode(url: string): Promise<AudioBuffer> {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Suono non trovato: ${url}`)
  // Contesto "di servizio" solo per decodificare: il risultato si usa in qualsiasi contesto audio.
  const decoder = new OfflineAudioContext(1, 1, 44100)
  return decoder.decodeAudioData(await response.arrayBuffer())
}

/** Carica il file (una volta sola); se fallisce, il prossimo tentativo riprova da capo. */
export function loadSample(url: string): Promise<AudioBuffer> {
  let promise = loading.get(url)
  if (!promise) {
    promise = fetchAndDecode(url).then((buffer) => {
      loaded.set(url, buffer)
      return buffer
    })
    loading.set(url, promise)
    promise.catch(() => loading.delete(url))
  }
  return promise
}

/** Il suono già pronto, oppure undefined se non è ancora arrivato (quel colpo non suona). */
export function loadedSample(url: string): AudioBuffer | undefined {
  return loaded.get(url)
}
