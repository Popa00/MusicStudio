import { spawn } from 'node:child_process'
import path from 'node:path'

/** Porta diversa da quella dell'app (5173): l'analisi può girare anche con l'app aperta. */
export const PORT = 5174
export const URL = `http://127.0.0.1:${PORT}/`
/** Un file che esiste solo in questo progetto: conferma che a rispondere è il nostro server. */
const PROBE = `${URL}tools/audio-check/browser/render.ts`

async function waitUntilUp(child, timeoutMs) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    // Se Vite è già uscito (porta occupata, errore), inutile aspettare: un altro server non va usato.
    if (child.exitCode !== null) throw new Error(`Vite si è chiuso subito (porta ${PORT} occupata?)`)
    try {
      if ((await fetch(PROBE)).ok) return
    } catch {
      // non ancora pronto
    }
    await new Promise((r) => setTimeout(r, 300))
  }
  throw new Error(`Il server di Vite non risponde su ${URL}`)
}

/** Avvia il dev server di Vite del progetto solo su 127.0.0.1. Restituisce la funzione per fermarlo. */
export async function startDevServer(projectRoot) {
  const vite = path.join(projectRoot, 'node_modules', 'vite', 'bin', 'vite.js')
  const child = spawn(process.execPath, [vite, '--host', '127.0.0.1', '--port', String(PORT), '--strictPort'], {
    cwd: projectRoot,
    stdio: ['ignore', 'ignore', 'pipe'],
  })
  let stderr = ''
  child.stderr.on('data', (d) => (stderr += d))
  const stop = () => {
    if (child.exitCode === null) child.kill()
  }
  // Chiude Vite anche se lo script viene interrotto (Ctrl+C, chiusura del terminale).
  process.on('exit', stop)
  for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => process.exit(130))
  try {
    await waitUntilUp(child, 30000)
  } catch (error) {
    stop()
    throw new Error(`${error.message}\n${stderr}`)
  }
  return stop
}
