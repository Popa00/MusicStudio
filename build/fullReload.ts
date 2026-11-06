import type { Plugin } from 'vite'

/**
 * Cartelle che contengono stato o motore audio: l'aggiornamento "a caldo" di Vite ne creerebbe una
 * seconda copia (es. un secondo store del progetto) mentre il motore resta legato alla prima,
 * e le modifiche fatte nell'interfaccia non si sentirebbero più.
 */
const STATEFUL = /[\\/]src[\\/](audio|state|project|music|io)[\\/]/

/**
 * Solo in sviluppo: se cambia un file di quelle cartelle, ricarica tutta la pagina.
 * Il progetto è salvato in automatico (anche alla chiusura), quindi non si perde nulla.
 * I componenti dell'interfaccia continuano ad aggiornarsi senza ricaricare.
 */
export function fullReloadPlugin(): Plugin {
  return {
    name: 'music-studio-full-reload',
    apply: 'serve',
    handleHotUpdate({ file, server }) {
      if (!STATEFUL.test(file) || /\.test\.tsx?$/.test(file)) return
      server.ws.send({ type: 'full-reload' })
      return []
    },
  }
}
