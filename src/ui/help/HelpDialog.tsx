import { Dialog } from '../controls/Dialog'
import { GETTING_STARTED, GLOSSARY, SHORTCUTS } from './helpContent'
import './help.css'

export function HelpDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} title="Guida" onClose={onClose}>
      <div className="help">
        <h3>Come iniziare</h3>
        <ol>
          {GETTING_STARTED.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <h3>Parole da sapere</h3>
        <dl>
          {GLOSSARY.map(([term, meaning]) => (
            <div key={term}>
              <dt>{term}</dt>
              <dd>{meaning}</dd>
            </div>
          ))}
        </dl>
        <h3>Scorciatoie</h3>
        <table>
          <tbody>
            {SHORTCUTS.map(([keys, action]) => (
              <tr key={keys}>
                <td>
                  <kbd>{keys}</kbd>
                </td>
                <td>{action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Dialog>
  )
}
