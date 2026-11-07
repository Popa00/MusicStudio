/** Colpi che possono suonare insieme sullo stesso suono (code dei piatti comprese). */
export const MAX_RINGING = 24

/**
 * Tiene il conto dei colpi che stanno ancora suonando. Oltre il massimo il più vecchio viene
 * spento (con una breve dissolvenza, a cura di `release`): tanti colpi lunghi e ravvicinati
 * (es. un crash grave su ogni sedicesimo) altrimenti saturerebbero il processore.
 */
export function createVoiceLimit<T>(release: (item: T) => void, max = MAX_RINGING) {
  const active: T[] = []
  return {
    add(item: T): void {
      active.push(item)
      while (active.length > max) release(active.shift() as T)
    },
    remove(item: T): void {
      const i = active.indexOf(item)
      if (i >= 0) active.splice(i, 1)
    },
    clear(release: (item: T) => void): void {
      for (const item of active.splice(0)) release(item)
    },
  }
}
