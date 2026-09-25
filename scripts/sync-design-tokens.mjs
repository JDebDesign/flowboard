#!/usr/bin/env node
// Reads design-system.md and regenerates src/styles/tokens.css and
// src/design-system/tokens.generated.ts. Run automatically by `npm run build`
// and by the Vite dev-server plugin (see vite.config.ts) — you shouldn't
// normally need to run this by hand, but you can: `node scripts/sync-design-tokens.mjs`.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { parseDesignSystemMarkdown, renderTokensCss, renderTokensTs } from './design-tokens-lib.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const mdPath = path.join(root, 'design-system.md');
const cssOutPath = path.join(root, 'src/styles/tokens.css');
const tsOutPath = path.join(root, 'src/design-system/tokens.generated.ts');

try {
  const tokens = parseDesignSystemMarkdown(readFileSync(mdPath, 'utf8'));
  mkdirSync(path.dirname(cssOutPath), { recursive: true });
  mkdirSync(path.dirname(tsOutPath), { recursive: true });
  writeFileSync(cssOutPath, renderTokensCss(tokens));
  writeFileSync(tsOutPath, renderTokensTs(tokens));
  console.log('[design-tokens] synced tokens.css + tokens.generated.ts from design-system.md');
} catch (err) {
  console.error('\n[design-tokens] FAILED to sync design-system.md:\n', err.message, '\n');
  process.exit(1);
}
