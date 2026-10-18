import { useRef, useState } from 'react'
import { PROJECT_EXTENSION } from '../../io/projectFile'
import { exportProjectWav, openProjectFile, saveProjectFile } from '../../state/actions/projectActions'
import { noFocus } from '../keepFocusOnMouseDown'
import { NewProjectDialog } from './NewProjectDialog'

/** Nuovo, Apri, Salva su file, Esporta WAV. */
export function ProjectMenu() {
  const fileInput = useRef<HTMLInputElement>(null)
  const [newOpen, setNewOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function handleOpen(file: File | undefined) {
    if (!file) return
    if (!window.confirm('Aprire un altro progetto? Le modifiche non salvate su file di quello attuale andranno perse.')) return
    setMessage(await openProjectFile(file))
  }

  async function handleExport() {
    setBusy(true)
    setMessage(null)
    try {
      await exportProjectWav()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Esportazione non riuscita.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="project-menu">
      <button className="button-small" onClick={() => setNewOpen(true)} {...noFocus}>Nuovo</button>
      <button className="button-small" onClick={() => fileInput.current?.click()} title={`Apri un progetto salvato (${PROJECT_EXTENSION})`} {...noFocus}>Apri</button>
      <button className="button-small" onClick={saveProjectFile} title="Scarica il progetto come file, per tenerne una copia o spostarlo su un altro PC" {...noFocus}>Salva su file</button>
      <button className="button-small" onClick={handleExport} disabled={busy} title="Crea un file audio WAV del brano intero, ascoltabile ovunque" {...noFocus}>
        {busy ? 'Esportazione…' : 'Esporta WAV'}
      </button>
      <input
        ref={fileInput}
        type="file"
        accept={`${PROJECT_EXTENSION},application/json`}
        hidden
        onChange={(e) => {
          void handleOpen(e.target.files?.[0])
          e.target.value = ''
        }}
      />
      {message && (
        <span className="project-menu__error" role="alert">
          {message}
        </span>
      )}
      <NewProjectDialog open={newOpen} onClose={() => setNewOpen(false)} />
    </div>
  )
}
