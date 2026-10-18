import { useState } from 'react'
import { Studio } from '../ui/studio/Studio'
import { StartScreen } from './StartScreen'

export function App() {
  const [audioReady, setAudioReady] = useState(false)

  return <main className="app">{audioReady ? <Studio /> : <StartScreen onReady={() => setAudioReady(true)} />}</main>
}
