/** Legge la risposta fermandosi appena supera `maxBytes`, anche se il server non dichiara la dimensione. */
export async function readCapped(response: Response, maxBytes: number, what: string): Promise<string> {
  const declared = Number(response.headers.get('Content-Length'))
  if (declared > maxBytes) throw new Error(`${what}: risposta troppo grande.`)
  if (!response.body) throw new Error(`${what}: risposta vuota.`)
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let text = ''
  let bytes = 0
  for (;;) {
    const { value, done } = await reader.read()
    if (done) return text + decoder.decode()
    bytes += value.byteLength
    if (bytes > maxBytes) {
      await reader.cancel().catch(() => {})
      throw new Error(`${what}: risposta troppo grande.`)
    }
    text += decoder.decode(value, { stream: true })
  }
}
