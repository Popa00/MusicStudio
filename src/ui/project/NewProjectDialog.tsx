import { TEMPLATES, type ProjectTemplate } from '../../project/templates'
import { newProject } from '../../state/actions/projectActions'
import { Dialog } from '../controls/Dialog'

/** Scelta del punto di partenza per un nuovo progetto. */
export function NewProjectDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  function choose(template: ProjectTemplate) {
    if (!window.confirm('Iniziare un nuovo progetto? Quello attuale verrà sostituito (salvalo prima su file se vuoi tenerlo).')) return
    newProject(template)
    onClose()
  }

  return (
    <Dialog open={open} title="Nuovo progetto" onClose={onClose}>
      <p className="hint">Scegli da dove partire. Ascoltare e modificare un esempio è il modo più rapido per imparare.</p>
      <div className="templates">
        {TEMPLATES.map((t) => (
          <button key={t.id} className="templates__item button-secondary" onClick={() => choose(t)}>
            <strong>{t.name}</strong>
            <span>{t.description}</span>
          </button>
        ))}
      </div>
    </Dialog>
  )
}
