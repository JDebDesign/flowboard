import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { parseDesignSystemMarkdown, renderTokensCss, renderTokensTs } from './scripts/design-tokens-lib.mjs'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const mdPath = path.resolve(dirname, 'design-system.md')
const cssOutPath = path.resolve(dirname, 'src/styles/tokens.css')
const tsOutPath = path.resolve(dirname, 'src/design-system/tokens.generated.ts')

function syncDesignTokens(): void {
  try {
    const tokens = parseDesignSystemMarkdown(readFileSync(mdPath, 'utf8'))
    mkdirSync(path.dirname(cssOutPath), { recursive: true })
    mkdirSync(path.dirname(tsOutPath), { recursive: true })
    writeFileSync(cssOutPath, renderTokensCss(tokens))
    writeFileSync(tsOutPath, renderTokensTs(tokens))
  } catch (err) {
    // Keep the last-good generated files during dev rather than crashing the server.
    console.error('\n[design-tokens] Failed to sync design-system.md:\n', err instanceof Error ? err.message : err, '\n')
  }
}

function designTokensPlugin(): Plugin {
  return {
    name: 'design-tokens-sync',
    buildStart() {
      syncDesignTokens()
    },
    configureServer(server) {
      server.watcher.add(mdPath)
      server.watcher.on('change', (changedPath) => {
        if (path.normalize(changedPath) === path.normalize(mdPath)) {
          syncDesignTokens()
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), designTokensPlugin()],
})
