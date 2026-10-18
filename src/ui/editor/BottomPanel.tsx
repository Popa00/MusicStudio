import { useUiStore, type Panel } from '../../state/uiStore'
import { useSelection } from '../../state/useSelection'
import { EffectsPanel } from '../effects/EffectsPanel'
import { noFocus } from '../keepFocusOnMouseDown'
import { Mixer } from '../mixer/Mixer'
import { PatternEditor } from './PatternEditor'
import './editor.css'

const TABS: { id: Panel; label: string; hint: string }[] = [
  { id: 'editor', label: 'Note e ritmo', hint: 'Modifica il pattern della traccia selezionata' },
  { id: 'effects', label: 'Effetti', hint: 'Effetti della traccia selezionata (riverbero, eco...)' },
  { id: 'mixer', label: 'Mixer', hint: 'Volumi e posizione destra/sinistra di tutte le tracce' },
]

export function BottomPanel() {
  const panel = useUiStore((s) => s.panel)
  const setUi = useUiStore((s) => s.set)
  const { track, pattern } = useSelection()

  return (
    <section className="bottom-panel">
      <nav className="tabs" role="tablist">
        {TABS.map((tab) => (
          <button key={tab.id} role="tab" aria-selected={panel === tab.id} className="tabs__tab" onClick={() => setUi({ panel: tab.id })} title={tab.hint} {...noFocus}>
            {tab.label}
          </button>
        ))}
        {track && panel !== 'mixer' && <span className="tabs__context">Traccia: {track.name}</span>}
      </nav>
      {panel === 'mixer' && <Mixer />}
      {panel === 'effects' && (track ? <EffectsPanel track={track} /> : <p className="hint">Seleziona una traccia.</p>)}
      {panel === 'editor' && (track ? <PatternEditor track={track} pattern={pattern} /> : <p className="hint">Seleziona una traccia.</p>)}
    </section>
  )
}
