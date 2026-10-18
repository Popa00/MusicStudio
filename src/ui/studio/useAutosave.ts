import { useEffect, useState } from 'react'
import { createDebouncedSaver } from '../../io/autosave'
import { useProjectStore } from '../../state/projectStore'

/** Salva il progetto nel browser a ogni modifica. Restituisce true se il salvataggio non riesce. */
export function useAutosave(): boolean {
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const saver = createDebouncedSaver(() => setFailed(true))
    const unsubscribe = useProjectStore.subscribe((state, prev) => {
      if (state.project !== prev.project) saver.save(state.project)
    })
    // Alla chiusura o quando la scheda viene nascosta, salva subito l'ultima modifica.
    const onHide = () => {
      if (document.visibilityState === 'hidden') saver.flush()
    }
    window.addEventListener('pagehide', saver.flush)
    document.addEventListener('visibilitychange', onHide)
    return () => {
      saver.flush()
      unsubscribe()
      window.removeEventListener('pagehide', saver.flush)
      document.removeEventListener('visibilitychange', onHide)
    }
  }, [])

  return failed
}
