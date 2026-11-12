import { useState } from 'react'
import { QUESTION_MAX_CHARS } from '../../assistant/conversation'
import { askAssistant, stopAssistant } from '../../state/actions/assistantActions'
import { useAssistantStore } from '../../state/assistantStore'

/** Casella della domanda: Invio manda, Maiusc+Invio va a capo. Mentre risponde, "Ferma" la interrompe. */
export function AssistantInput() {
  const [text, setText] = useState('')
  const answering = useAssistantStore((s) => s.answering)

  function send(): void {
    if (!text.trim() || answering) return
    void askAssistant(text)
    setText('')
  }

  return (
    <form
      className="assistant__input"
      onSubmit={(e) => {
        e.preventDefault()
        send()
      }}
    >
      <textarea
        value={text}
        rows={2}
        maxLength={QUESTION_MAX_CHARS}
        placeholder="Fai una domanda… (Invio per mandare)"
        aria-label="Domanda per l'assistente"
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            send()
          }
        }}
      />
      {answering ? (
        <button type="button" className="button-small button-secondary" onClick={stopAssistant}>
          ■ Ferma
        </button>
      ) : (
        <button type="submit" className="button-small" disabled={!text.trim()}>
          Invia
        </button>
      )}
    </form>
  )
}
