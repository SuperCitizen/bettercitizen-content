#!/usr/bin/env node
// Generates pack covers from covers/prompts.yaml with OpenAI's image API.
//
// A set is every topic's cover in one style, in covers/sets/<style>/<topic>.jpg. The apps read
// covers/<topic>.jpg, which is a copy of the `active` set.
//
//   npm run covers                          the active style's topics that have no cover yet
//   npm run covers -- --style airy          the same for another style's set
//   npm run covers -- --only a,b            just these topics (replacing their covers)
//   npm run covers -- --force               every topic of the style, replacing every cover
//   npm run covers -- --dry-run             print what would be generated, call nothing
//   npm run covers -- --use airy            make airy the active set: copy it to covers/<topic>.jpg
//   npm run covers -- --list-models         the image models this API key can use
//   npm run check:covers                    every set complete, the active copy matching its set
//
// Needs OPENAI_API_KEY in this repo's .env (see .env.example). OPENAI_IMAGE_MODEL picks the model.
// Decisions: docs/adr/0004-pack-covers.md, docs/adr/0005-airy-cover-set.md.

import { readFileSync, readdirSync, existsSync, writeFileSync, mkdirSync, copyFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const COVERS = join(ROOT, 'covers');
const SETS = join(COVERS, 'sets');
const PROMPTS = join(COVERS, 'prompts.yaml');
const PACKS = join(ROOT, 'packs');

// What every app and the web receive. 3:2, large enough for a 600-point-wide card at 2x.
export const COVER_WIDTH = 1200;
export const COVER_HEIGHT = 800;
const JPEG_QUALITY = 80;
// The API is asked for its 3:2 landscape size; sharp scales it to the size above.
const REQUEST_SIZE = '1536x1024';
const CONCURRENCY = 3;

function loadEnv() {
  const file = join(ROOT, '.env');
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (!m || process.env[m[1]] !== undefined) continue;
    process.env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2');
  }
}

/** Every topic in packs/: a pack's `topic:`, or its own slug when it names none. */
function topics() {
  const set = new Set();
  for (const dir of readdirSync(PACKS, { withFileTypes: true })) {
    if (!dir.isDirectory()) continue;
    const manifest = join(PACKS, dir.name, 'pack.yaml');
    if (!existsSync(manifest)) continue;
    const doc = parse(readFileSync(manifest, 'utf8'));
    set.add(typeof doc.topic === 'string' && doc.topic ? doc.topic : doc.slug ?? dir.name);
  }
  return [...set].sort();
}

function loadPrompts() {
  const doc = parse(readFileSync(PROMPTS, 'utf8'));
  if (typeof doc?.styles !== 'object' || typeof doc?.covers !== 'object' || !doc.styles[doc.active]) {
    throw new Error('covers/prompts.yaml needs `active:` naming one of its `styles:`, and a `covers:` map');
  }
  return doc;
}

const setDir = (style) => join(SETS, style);
const sameBytes = (a, b) => existsSync(a) && existsSync(b) && readFileSync(a).equals(readFileSync(b));

async function checkImage(file, label, out) {
  const meta = await sharp(file).metadata();
  if (meta.width !== COVER_WIDTH || meta.height !== COVER_HEIGHT || meta.format !== 'jpeg') {
    out.push(`${label}: ${meta.format} ${meta.width}x${meta.height}, expected jpeg ${COVER_WIDTH}x${COVER_HEIGHT}`);
  }
}

/** Problems with the covers as they stand. `requireImages`: every set and the active copy complete. */
async function problems({ requireImages }) {
  const out = [];
  const all = topics();
  const { active, styles, covers } = loadPrompts();
  for (const t of all) if (!covers[t]) out.push(`${t}: no subject in covers/prompts.yaml`);
  for (const t of Object.keys(covers)) if (!all.includes(t)) out.push(`${t}: in covers/prompts.yaml but no pack has this topic`);

  // covers/: the active copy, the prompts and the sets, nothing else.
  for (const f of readdirSync(COVERS)) {
    if (f === 'prompts.yaml' || f === 'sets' || f.startsWith('.')) continue;
    const m = f.match(/^(.+)\.jpg$/);
    if (!m) { out.push(`covers/${f}: only <topic>.jpg, prompts.yaml and sets/ belong here`); continue; }
    if (!all.includes(m[1])) { out.push(`covers/${f}: no pack has the topic ${m[1]}`); continue; }
    await checkImage(join(COVERS, f), `covers/${f}`, out);
    if (!sameBytes(join(COVERS, f), join(setDir(active), f))) {
      out.push(`covers/${f}: differs from covers/sets/${active}/${f} (run npm run covers -- --use ${active})`);
    }
  }
  // covers/sets/<style>/: one per style, holding only that style's topics.
  const setNames = existsSync(SETS) ? readdirSync(SETS).filter((d) => !d.startsWith('.')) : [];
  for (const name of setNames) {
    if (!styles[name]) { out.push(`covers/sets/${name}: no style of that name in covers/prompts.yaml`); continue; }
    for (const f of readdirSync(setDir(name))) {
      if (f.startsWith('.')) continue;
      const m = f.match(/^(.+)\.jpg$/);
      if (!m || !all.includes(m[1])) { out.push(`covers/sets/${name}/${f}: not a <topic>.jpg for a pack's topic`); continue; }
      await checkImage(join(setDir(name), f), `covers/sets/${name}/${f}`, out);
    }
  }
  if (requireImages) {
    for (const name of Object.keys(styles)) {
      for (const t of all) if (!existsSync(join(setDir(name), `${t}.jpg`))) out.push(`${t}: no covers/sets/${name}/${t}.jpg`);
    }
    for (const t of all) if (!existsSync(join(COVERS, `${t}.jpg`))) out.push(`${t}: no covers/${t}.jpg (run npm run covers -- --use ${active})`);
  }
  return out;
}

async function listModels(key) {
  const res = await fetch('https://api.openai.com/v1/models', { headers: { Authorization: `Bearer ${key}` } });
  if (!res.ok) throw new Error(`models: ${res.status} ${await res.text()}`);
  const { data } = await res.json();
  for (const m of data.map((d) => d.id).filter((id) => /image|dall-e/i.test(id)).sort()) console.log(m);
}

async function generate(key, model, prompt) {
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, prompt, size: REQUEST_SIZE, quality: 'high', n: 1 }),
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  const { data } = await res.json();
  if (!data?.[0]?.b64_json) throw new Error('the response held no image');
  return Buffer.from(data[0].b64_json, 'base64');
}

async function toCover(png) {
  return sharp(png)
    .resize(COVER_WIDTH, COVER_HEIGHT, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: JPEG_QUALITY, mozjpeg: true, progressive: true })
    .toBuffer();
}

/** Makes `style` the active set: copies covers/sets/<style>/*.jpg to covers/ and records it. */
function use(style) {
  const { styles } = loadPrompts();
  if (!styles[style]) throw new Error(`${style}: no such style in covers/prompts.yaml`);
  const missing = topics().filter((t) => !existsSync(join(setDir(style), `${t}.jpg`)));
  if (missing.length) throw new Error(`covers/sets/${style} has no cover for: ${missing.join(', ')}`);
  for (const t of topics()) copyFileSync(join(setDir(style), `${t}.jpg`), join(COVERS, `${t}.jpg`));
  const text = readFileSync(PROMPTS, 'utf8');
  if (!/^active: .*$/m.test(text)) throw new Error('covers/prompts.yaml has no `active:` line');
  writeFileSync(PROMPTS, text.replace(/^active: .*$/m, `active: ${style}`));
  console.log(`Active covers are now the ${style} set (${topics().length} topics).`);
}

function option(args, name) {
  const i = args.findIndex((a) => a === name || a.startsWith(`${name}=`));
  if (i < 0) return null;
  return args[i].includes('=') ? args[i].split('=')[1] : args[i + 1] ?? '';
}

async function main() {
  const args = process.argv.slice(2);
  const flag = (name) => args.includes(name);
  const onlyArg = option(args, '--only');
  const only = onlyArg ? onlyArg.split(',').filter(Boolean) : null;

  if (flag('--check')) {
    const found = await problems({ requireImages: true });
    for (const p of found) console.error(p);
    if (found.length) process.exit(1);
    const { active, styles } = loadPrompts();
    console.log(`covers: ${topics().length} topics, ${Object.keys(styles).length} complete sets (${Object.keys(styles).join(', ')}); active: ${active}`);
    return;
  }
  const useArg = option(args, '--use');
  if (useArg) return use(useArg);

  loadEnv();
  const key = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_IMAGE_MODEL || 'gpt-image-2.6-sunburst';
  if (!key && !flag('--dry-run')) throw new Error('OPENAI_API_KEY is not set. Copy .env.example to .env and fill it in.');
  if (flag('--list-models')) return listModels(key);

  const setProblems = (await problems({ requireImages: false })).filter((p) => !p.includes('differs from'));
  if (setProblems.length) {
    for (const p of setProblems) console.error(p);
    process.exit(1);
  }

  const { active, styles, covers } = loadPrompts();
  const style = option(args, '--style') || active;
  if (!styles[style]) throw new Error(`${style}: no such style in covers/prompts.yaml`);
  const dir = setDir(style);
  for (const t of only ?? []) if (!covers[t]) throw new Error(`${t}: no subject in covers/prompts.yaml`);
  const todo = (only ?? topics()).filter((t) => only || flag('--force') || !existsSync(join(dir, `${t}.jpg`)));
  if (todo.length === 0) return console.log(`The ${style} set already has every cover. Pass --only or --force to replace some.`);

  console.log(`${todo.length} ${style} cover${todo.length === 1 ? '' : 's'} with ${model}: ${todo.join(', ')}`);
  if (flag('--dry-run')) {
    console.log(`\nPrompt for ${todo[0]}:\n\n${styles[style]}\n\nSubject: ${covers[todo[0]]}`);
    return;
  }

  mkdirSync(dir, { recursive: true });
  const failed = [];
  const queue = [...todo];
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, queue.length) }, async () => {
      for (let t = queue.shift(); t; t = queue.shift()) {
        try {
          const png = await generate(key, model, `${styles[style]}\n\nSubject: ${covers[t]}`);
          writeFileSync(join(dir, `${t}.jpg`), await toCover(png));
          console.log(`✓ ${t}`);
        } catch (e) {
          failed.push(t);
          console.error(`✗ ${t}: ${e.message}`);
        }
      }
    }),
  );
  if (style === active) console.log(`\nThe ${style} set is active: run npm run covers -- --use ${style} to copy it to covers/.`);
  if (failed.length) {
    console.error(`\n${failed.length} failed. Retry with: npm run covers -- --style ${style} --only ${failed.join(',')}`);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
