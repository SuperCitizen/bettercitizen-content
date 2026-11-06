/**
 * Render smoke test: server-renders every lesson with the REAL component
 * library. Catches what compile checks cannot — style-string attributes,
 * invalid prop shapes that throw in component code, broken JSX nesting.
 *
 * Run with `npm run check:render` (after `npm install`).
 */
import { evaluate } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import { renderToString } from 'react-dom/server';
import { createElement } from 'react';
import { build } from 'esbuild';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// Bundle the TSX component library to an ESM module node can import.
// Must live under the repo so the externalized 'react' import resolves.
const outfile = join(root, 'node_modules', '.cache', 'sc-render-smoke', 'components.mjs');
await build({
  entryPoints: [join(root, 'components/index.ts')],
  bundle: true,
  format: 'esm',
  outfile,
  jsx: 'automatic',
  external: ['react', 'react-dom', 'react/jsx-runtime'],
  logLevel: 'silent',
});
const { mdxComponents } = await import(pathToFileURL(outfile).href);

const errors = [];
let count = 0;
const packsDir = join(root, 'packs');
for (const pack of readdirSync(packsDir).sort()) {
  const lessonsDir = join(packsDir, pack, 'lessons');
  if (!existsSync(lessonsDir)) continue;
  for (const f of readdirSync(lessonsDir).filter((f) => f.endsWith('.mdx')).sort()) {
    const file = `packs/${pack}/lessons/${f}`;
    count++;
    const src = readFileSync(join(lessonsDir, f), 'utf8');
    const body = src.replace(/^---\n[\s\S]*?\n---\n?/, '');
    // React dev-build warnings (invalid DOM props, nesting violations, missing
    // keys) arrive via console.error — trap them and fail the file.
    const warnings = [];
    const realError = console.error;
    console.error = (...args) => warnings.push(String(args[0]));
    try {
      const { default: MDXContent } = await evaluate(body, { ...runtime, format: 'mdx' });
      const html = renderToString(createElement(MDXContent, { components: mdxComponents }));
      if (!html || html.length < 200) errors.push(`${file}: rendered suspiciously little HTML (${html.length} chars)`);
    } catch (e) {
      errors.push(`${file}: ${e.message}`);
    } finally {
      console.error = realError;
    }
    for (const w of [...new Set(warnings)]) errors.push(`${file}: React warning: ${w.slice(0, 160)}`);
  }
}

if (errors.length) {
  console.error(`✗ ${errors.length} render failure(s) across ${count} lessons:\n`);
  for (const e of errors) console.error('  ' + e);
  process.exit(1);
}
console.log(`✓ ${count} MDX lessons server-render cleanly with the real component library`);
