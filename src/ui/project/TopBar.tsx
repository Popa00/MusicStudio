import { useState } from 'react'
import { hasAutosaveBackup } from '../../io/autosave'
import { renameProject } from '../../project/ops/song'
import { useProjectStore } from '../../state/projectStore'
import { noFocus } from '../keepFocusOnMouseDown'
import { HelpDialog } from '../help/HelpDialog'
import { ProjectMenu } from './ProjectMenu'
import './project.css'

export function TopBar({ autosaveFailed }: { autosaveFailed: boolean }) {
  const name = useProjectStore((s) => s.project.name)
  const canUndo = useProjectStore((s) => s.history.past.length > 0)
  const canRedo = useProjectStore((s) => s.history.future.length > 0)
  const { undo, redo, apply } = useProjectStore.getState()
  const [helpOpen, setHelpOpen] = useState(false)

  return (
    <header className="top-bar">
      <h1>Music Studio</h1>
      <input type="text" className="top-bar__name" value={name} aria-label="Nome del progetto" onChange={(e) => apply((p) => renameProject(p, e.target.value), 'project-name')} />
      <ProjectMenu />
      <button className="button-small button-secondary" disabled={!canUndo} onClick={undo} title="Annulla l'ultima modifica (Ctrl+Z)" {...noFocus}>
        ↶ Annulla
      </button>
      <button className="button-small button-secondary" disabled={!canRedo} onClick={redo} title="Ripeti la modifica annullata (Ctrl+Y)" {...noFocus}>
        ↷ Ripeti
      </button>
      {autosaveFailed && <span className="top-bar__warning">Salvataggio automatico non riuscito: usa "Salva su file"</span>}
      {hasAutosaveBackup() && (
        <span className="top-bar__warning" title="Il testo originale è conservato nel browser con la chiave music-studio:autosave-backup">
          L'ultimo salvataggio automatico non era leggibile: ne è stata conservata una copia
        </span>
      )}
      <button className="button-small top-bar__help" onClick={() => setHelpOpen(true)} {...noFocus}>
        ? Guida
      </button>
      <HelpDialog open={helpOpen} onClose={() => setHelpOpen(false)} />
    </header>
  )
}
