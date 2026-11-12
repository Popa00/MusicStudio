import { useEffect, useRef } from 'react'
import { visibleAnswer } from '../../assistant/conversation'
import { askAssistant } from '../../state/actions/assistantActions'
import { useAssistantStore, type AssistantMessage } from '../../state/assistantStore'
import { noFocus } from '../keepFocusOnMouseDown'
import { MessageText } from './MessageText'

const SUGGESTIONS = [
  "Il mio brano suona un po' piatto: cosa potrei provare?",
  'Da quali note mi conviene partire per scrivere una melodia?',
  'Spiegami in modo semplice gli accordi del mio brano.',
]

function Message({ message, answering }: { message: AssistantMessage; answering: boolean }) {
  const className = `assistant__msg assistant__msg--${message.role}${message.error ? ' assistant__msg--error' : ''}`
  if (message.role === 'user') return <div className={className}>{message.content}</div>
  const text = visibleAnswer(message.content)
  return <div className={className}>{text ? <MessageText text={text} /> : <p className="assistant__wait">{answering ? 'Sto pensando…' : '(nessuna risposta)'}</p>}</div>
}

/** I messaggi della chat; si scorre da sola verso il basso, a meno che tu non stia rileggendo più su. */
export function MessageList() {
  const messages = useAssistantStore((s) => s.messages)
  const answering = useAssistantStore((s) => s.answering)
  const ref = useRef<HTMLDivElement>(null)
  const stickToBottom = useRef(true)

  useEffect(() => {
    const el = ref.current
    if (el && stickToBottom.current) el.scrollTop = el.scrollHeight
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="assistant__messages assistant__empty">
        <p>Chiedimi qualcosa sulla musica o sul tuo brano: lo vedo mentre lo crei. Ti spiego e ti do idee, ma la musica la fai tu.</p>
        {SUGGESTIONS.map((s) => (
          <button key={s} className="button-small button-secondary assistant__suggestion" onClick={() => void askAssistant(s)} {...noFocus}>
            {s}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className="assistant__messages"
      aria-live="polite"
      onScroll={(e) => {
        const el = e.currentTarget
        stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 60
      }}
    >
      {messages.map((m, i) => (
        <Message key={m.id} message={m} answering={answering && i === messages.length - 1} />
      ))}
    </div>
  )
}
