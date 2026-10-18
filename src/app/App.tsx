import { useState } from 'react'
import { isAudioRunning, startAudio } from '../audio/engine'
import { playTestNote } from '../audio/testTone'

type AudioStatus = 'idle' | 'starting' | 'ready' | 'error'

export function App() {
  const [status, setStatus] = useState<AudioStatus>('idle')

  async function handleStart() {
    setStatus('starting')
    try {
      await startAudio()
      setStatus(isAudioRunning() ? 'ready' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <main className="app">
      <h1>Music Studio</h1>
      {status === 'ready' ? (
        <button onClick={() => playTestNote()}>Suona un Do</button>
      ) : (
        <button onClick={handleStart} disabled={status === 'starting'}>
          Avvia audio
        </button>
      )}
      {status === 'error' && (
        <p role="alert">Impossibile avviare l'audio: controlla che ci sia un'uscita audio e riprova.</p>
      )}
    </main>
  )
}
