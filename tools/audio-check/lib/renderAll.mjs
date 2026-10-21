import fs from 'node:fs'
import path from 'node:path'
import puppeteer from 'puppeteer-core'
import { URL } from './devServer.mjs'

const SAFE_NAME = /^[A-Za-z0-9-]+$/

const BROWSERS = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].filter(Boolean)

function findBrowser() {
  const found = BROWSERS.find((p) => fs.existsSync(p))
  if (!found) throw new Error('Chrome o Edge non trovati: imposta CHROME_PATH con il percorso del browser.')
  return found
}

/**
 * Apre l'app in Chrome senza finestra, esporta ogni suono di prova e salva i WAV in `wavDir`.
 * Restituisce l'elenco degli scenari (nome, categoria, descrizione, aspettative).
 */
export async function renderAll(wavDir, only) {
  fs.mkdirSync(wavDir, { recursive: true })
  const browser = await puppeteer.launch({ executablePath: findBrowser(), headless: true })
  try {
    const page = await browser.newPage()
    const errors = []
    page.on('pageerror', (e) => errors.push(e.message))
    await page.goto(URL, { waitUntil: 'networkidle0' })
    const modulePath = '/tools/audio-check/browser/render.ts'
    const all = await page.evaluate(async (m) => (await import(m)).listScenarios(), modulePath)
    const scenarios = only ? all.filter((s) => s.name.includes(only)) : all
    if (scenarios.length === 0) throw new Error(`Nessuno scenario corrisponde a "${only}"`)
    for (const s of scenarios) {
      // Il nome diventa un nome di file: solo lettere, cifre e trattini (niente "../").
      if (!SAFE_NAME.test(s.name)) throw new Error(`Nome di scenario non valido: ${s.name}`)
      process.stdout.write(`  · ${s.name}\n`)
      const base64 = await page.evaluate(async (m, name) => (await import(m)).renderScenario(name), modulePath, s.name)
      fs.writeFileSync(path.join(wavDir, `${s.name}.wav`), Buffer.from(base64, 'base64'))
    }
    if (errors.length) throw new Error(`Errori nella pagina:\n${errors.join('\n')}`)
    return scenarios
  } finally {
    await browser.close()
  }
}
