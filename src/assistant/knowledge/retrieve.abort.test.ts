import { describe, expect, it, vi } from 'vitest'
import type { KnowledgeLibrary } from './library'
import { createRetriever } from './retrieve'

describe('createRetriever: "Stop" mentre la biblioteca si carica', () => {
  it('smette di aspettare subito e restituisce []', async () => {
    const embed = vi.fn()
    // Un caricamento che non finisce mai.
    const retrieve = createRetriever({ library: () => new Promise<KnowledgeLibrary>(() => {}), embeddings: { embed } })
    const controller = new AbortController()
    const result = retrieve('riverbero', null, controller.signal)
    controller.abort()
    expect(await result).toEqual([])
    expect(embed).not.toHaveBeenCalled()
  })
})
