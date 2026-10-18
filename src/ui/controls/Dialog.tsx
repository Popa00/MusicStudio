import { useEffect, useRef, type ReactNode } from 'react'

interface DialogProps {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

/** Finestra modale basata su <dialog>: Esc la chiude, il resto della pagina resta bloccato. */
export function Dialog({ open, title, onClose, children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (open && !el.open) el.showModal()
    if (!open && el.open) el.close()
  }, [open])

  return (
    <dialog ref={ref} className="dialog" onClose={onClose} aria-label={title}>
      <header className="dialog__header">
        <h2>{title}</h2>
        <button className="button-small button-secondary" onClick={onClose} aria-label="Chiudi">
          ✕
        </button>
      </header>
      {open && children}
    </dialog>
  )
}
