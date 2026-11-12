import { parseBlocks, parseInline } from './markdown'

function InlineText({ text }: { text: string }) {
  return (
    <>
      {parseInline(text).map((part, i) => {
        if (part.kind === 'strong') return <strong key={i}>{part.text}</strong>
        if (part.kind === 'em') return <em key={i}>{part.text}</em>
        if (part.kind === 'code') return <code key={i}>{part.text}</code>
        return <span key={i}>{part.text}</span>
      })}
    </>
  )
}

/** Il testo di una risposta, con titoli, elenchi e grassetti (React li mostra come testo: niente HTML). */
export function MessageText({ text }: { text: string }) {
  return (
    <>
      {parseBlocks(text).map((block, i) => {
        if (!('items' in block)) {
          return <p key={i} className={block.kind === 'h' ? 'assistant__heading' : undefined}><InlineText text={block.text} /></p>
        }
        const items = block.items.map((item, j) => <li key={j}><InlineText text={item} /></li>)
        return block.kind === 'ul' ? <ul key={i}>{items}</ul> : <ol key={i}>{items}</ol>
      })}
    </>
  )
}
