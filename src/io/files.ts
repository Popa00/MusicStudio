/** Fa scaricare al browser un file generato dall'app. */
export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/** Legge un file scelto dall'utente come testo, rifiutando quelli troppo grandi. */
export async function readTextFile(file: File, maxBytes: number): Promise<string> {
  if (file.size > maxBytes) throw new Error('Il file è troppo grande.')
  return file.text()
}
