import { useState } from 'react'
import { StepSequencer } from '../ui/sequencer/StepSequencer'
import { TransportBar } from '../ui/transport/TransportBar'
import { StartScreen } from './StartScreen'

export function App() {
  const [audioReady, setAudioReady] = useState(false)

  return (
    <main className="app">
      <h1>Music Studio</h1>
      {audioReady ? (
        <>
          <TransportBar />
          <StepSequencer />
        </>
      ) : (
        <StartScreen onReady={() => setAudioReady(true)} />
      )}
    </main>
  )
}
