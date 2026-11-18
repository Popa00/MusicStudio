import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import type { KnowledgeSource } from '../../assistant/knowledge/schema'
import { MessageSources } from './MessageSources'

const wiki = (n: string): KnowledgeSource => ({ title: n, url: `https://en.wikipedia.org/wiki/${n}`, license: 'CC BY-SA 4.0' })
const html = (sources: KnowledgeSource[]) => renderToStaticMarkup(<MessageSources sources={sources} />)

describe('MessageSources', () => {
  it('non mostra nulla senza fonti', () => {
    expect(html([])).toBe('')
  })
  it('mostra link con target _blank e rel noopener noreferrer', () => {
    const out = html([wiki('Reverberation')])
    expect(out).toContain('href="https://en.wikipedia.org/wiki/Reverberation"')
    expect(out).toContain('target="_blank"')
    expect(out).toContain('rel="noopener noreferrer"')
    expect(out).toContain('>Reverberation</a>')
  })
  it('scarta fonti con url non ammesso', () => {
    const bad = [
      { ...wiki('X'), url: 'https://evil.example/wiki/X' },
      { ...wiki('Y'), url: 'javascript:alert(1)' },
      { ...wiki('Z'), url: 'http://en.wikipedia.org/wiki/Z' },
    ]
    expect(html(bad)).toBe('')
    const mixed = html([...bad, wiki('Delay')])
    expect(mixed).toContain('Delay')
    expect(mixed).not.toContain('evil')
    expect(mixed).not.toContain('javascript')
  })
  it('separa più fonti', () => {
    const out = html([wiki('A'), wiki('B')])
    expect(out.match(/<a /g)).toHaveLength(2)
    expect(out).toContain(' · ')
  })
})
