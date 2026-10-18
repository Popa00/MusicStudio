import type { Plugin } from 'vite'

// Applicata solo alla build: in sviluppo il React refresh di Vite usa script inline.
const POLICY = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "media-src 'self' blob:",
  "worker-src 'self' blob:",
  "connect-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
].join('; ')

export function cspPlugin(): Plugin {
  return {
    name: 'music-studio-csp',
    apply: 'build',
    transformIndexHtml: () => [
      {
        tag: 'meta',
        attrs: { 'http-equiv': 'Content-Security-Policy', content: POLICY },
        injectTo: 'head-prepend',
      },
    ],
  }
}
