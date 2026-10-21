/**
 * Controllo qualità del suono: esporta i suoni di prova dall'app e li analizza.
 *
 * Uso:  npm run audio:check                       (tutti i suoni)
 *       npm run audio:check -- --only batteria    (solo gli scenari che contengono "batteria")
 *       npm run audio:check -- --update-baseline  (salva i risultati come nuovo riferimento)
 *
 * Risultato in tools/audio-check/out/: report.md, metrics.json, spettrogrammi PNG.
 */
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { startDevServer } from './lib/devServer.mjs'
import { renderAll } from './lib/renderAll.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '..', '..')
const outDir = path.join(here, 'out')
const python = path.join(here, '.venv', process.platform === 'win32' ? 'Scripts/python.exe' : 'bin/python')

const args = process.argv.slice(2)
const onlyIndex = args.indexOf('--only')
const only = onlyIndex >= 0 ? args[onlyIndex + 1] : undefined
const updateBaseline = args.includes('--update-baseline')

if (onlyIndex >= 0 && (!only || only.startsWith('--'))) {
  console.error('Uso: npm run audio:check -- --only <parte del nome>   (es. --only batteria)')
  process.exit(1)
}

if (!fs.existsSync(python)) {
  console.error('Ambiente Python mancante: vedi tools/audio-check/README.md (installazione).')
  process.exit(1)
}

fs.rmSync(outDir, { recursive: true, force: true })
console.log('Avvio del server e del browser…')
const stop = await startDevServer(root)
let scenarios
try {
  console.log('Esportazione dei suoni di prova:')
  scenarios = await renderAll(path.join(outDir, 'wav'), only)
} catch (error) {
  console.error(`Esportazione non riuscita: ${error.message}`)
  process.exitCode = 1
} finally {
  stop()
}
if (!scenarios) process.exit(1)
fs.writeFileSync(path.join(outDir, 'scenarios.json'), JSON.stringify(scenarios, null, 2))

console.log('Analisi…')
const analyzer = path.join(here, 'analysis', 'analyze.py')
const pyArgs = ['-I', analyzer, outDir, path.join(here, 'baseline.json'), ...(updateBaseline ? ['--update-baseline'] : [])]
const result = spawnSync(python, pyArgs, { stdio: 'inherit' })
if (result.error) console.error(`Impossibile avviare Python: ${result.error.message}`)
process.exit(result.status ?? 1)
