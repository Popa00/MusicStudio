import { useState } from 'react'
import { isAudioRunning, startAudio } from '../audio/engine'

interface StartScreenProps {
  onReady: () => void
}

/** Il browser attiva l'audio solo dopo un click: questa schermata lo chiede all'utente. */
export function StartScreen({ onReady }: StartScreenProps) {
  const [status, setStatus] = useState<'idle' | 'starting' | 'error'>('idle')

  async function handleStart() {
    setStatus('starting')
    try {
      await startAudio()
      if (isAudioRunning()) onReady()
      else setStatus('error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="start-screen">
      <h1>Music Studio</h1>
      <p className="hint">Crea musica con batteria, strumenti ed effetti. Il tuo lavoro viene salvato automaticamente.</p>
      <button onClick={handleStart} disabled={status === 'starting'}>
        Inizia
      </button>
      {status === 'error' && <p role="alert">Impossibile avviare l'audio: controlla che ci sia un'uscita audio e riprova.</p>}
    </div>
  )
}
