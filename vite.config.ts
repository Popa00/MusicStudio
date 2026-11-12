/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { cspPlugin } from './build/csp.ts'
import { fullReloadPlugin } from './build/fullReload.ts'
import { LLM_PROXY } from './build/llmProxy.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), cspPlugin(), fullReloadPlugin()],
  server: {
    // Solo questo PC: il dev server non è raggiungibile dalla rete locale.
    host: '127.0.0.1',
    strictPort: true,
    proxy: LLM_PROXY,
  },
  preview: {
    host: '127.0.0.1',
    proxy: LLM_PROXY,
  },
  test: {
    environment: 'node',
  },
})
