/**
 * Standalone MDX lesson checker. Run with `npm run check:mdx` (after
 * `npm install`). Verifies, for every packs/<pack>/lessons/*.mdx:
 *
 *   1. frontmatter exists and carries schema/slug/title/sources
 *   2. the body contains no import/export statements (auditability)
 *   3. the body compiles as MDX
 *   4. every capitalized JSX tag is in the components/index.ts catalog
 *   5. no <script>/<style>/<iframe>, no on*= handlers, no external src=
 *   6. pack.yaml lessons: entries match files on disk, both directions
 *   7. contested packs: every lesson frontmatter has perspectives:
 *
 * This is a fast structural gate, not the app's full content validator.
 */
import { compile } from '@mdx-js/mdx';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const fail = (file, msg) => errors.push(`${file}: ${msg}`);

// --- catalog from components/index.ts ---
const indexSrc = readFileSync(join(root, 'components/index.ts'), 'utf8');
const mapMatch = indexSrc.match(/export const mdxComponents = \{([\s\S]*?)\}/);
if (!mapMatch) {
  console.error('components/index.ts: could not find mdxComponents map');
  process.exit(2);
}
const catalog = new Set(
  [...mapMatch[1].matchAll(/^\s*([A-Z][A-Za-z0-9]*),?\s*$/gm)].map((m) => m[1]),
);

// --- helpers ---
function splitFrontmatter(src, file) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) {
    fail(file, 'missing YAML frontmatter');
    return { fm: '', body: src };
  }
  return { fm: m[1], body: src.slice(m[0].length) };
}

function stripCodeFences(body) {
  return body.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '');
}

// --- walk packs ---
const packsDir = join(root, 'packs');
let lessonCount = 0;
for (const pack of readdirSync(packsDir).sort()) {
  const packDir = join(packsDir, pack);
  const packYamlPath = join(packDir, 'pack.yaml');
  if (!existsSync(packYamlPath)) continue;
  const packYaml = readFileSync(packYamlPath, 'utf8');
  const contested = /^contested:\s*true\s*$/m.test(packYaml);
  const listed = [...packYaml.matchAll(/^\s*-\s+([\w.-]+\.mdx?)\s*$/gm)].map((m) => m[1]);

  const lessonsDir = join(packDir, 'lessons');
  const onDisk = existsSync(lessonsDir)
    ? readdirSync(lessonsDir).filter((f) => /\.mdx?$/.test(f))
    : [];

  for (const f of listed) {
    if (!onDisk.includes(f)) fail(`packs/${pack}/pack.yaml`, `lists missing lesson ${f}`);
    if (f.endsWith('.md')) fail(`packs/${pack}/pack.yaml`, `lesson ${f} not converted to .mdx`);
  }
  for (const f of onDisk) {
    if (!listed.includes(f)) fail(`packs/${pack}/lessons/${f}`, 'not listed in pack.yaml');
  }

  for (const f of onDisk) {
    const file = `packs/${pack}/lessons/${f}`;
    const src = readFileSync(join(lessonsDir, f), 'utf8');
    const { fm, body } = splitFrontmatter(src, file);
    lessonCount++;

    for (const key of ['schema:', 'slug:', 'title:', 'sources:']) {
      if (!fm.includes(key)) fail(file, `frontmatter missing ${key}`);
    }
    if (contested && !fm.includes('perspectives:')) {
      fail(file, 'contested pack lesson missing perspectives:');
    }

    const prose = stripCodeFences(body);
    if (/^\s{0,3}(import|export)\s/m.test(prose)) {
      fail(file, 'import/export statements are not allowed in lessons');
    }
    if (/<(script|style|iframe)\b/i.test(prose)) fail(file, 'forbidden tag (script/style/iframe)');
    if (/\son[A-Z][a-zA-Z]*\s*=/.test(prose)) fail(file, 'event-handler attribute (on*=) found');
    if (/\ssrc\s*=\s*["']https?:/i.test(prose)) fail(file, 'external src= URL found');

    for (const m of prose.matchAll(/<([A-Z][A-Za-z0-9]*)[\s/>]/g)) {
      if (!catalog.has(m[1])) fail(file, `unknown component <${m[1]}> (not in COMPONENTS.md catalog)`);
    }

    try {
      await compile(body, { format: 'mdx' });
    } catch (e) {
      fail(file, `MDX compile error: ${e.message}`);
    }
  }
}

if (errors.length) {
  console.error(`✗ ${errors.length} problem(s) across ${lessonCount} lessons:\n`);
  for (const e of errors) console.error('  ' + e);
  process.exit(1);
}
console.log(`✓ ${lessonCount} MDX lessons compile and conform`);
