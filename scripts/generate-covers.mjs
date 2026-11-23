#!/usr/bin/env node
// Generates pack covers from covers/prompts.yaml with OpenAI's image API.
//
// A set is every topic's cover in one style, in covers/sets/<style>/<topic>.jpg. The apps read
// covers/<topic>.jpg in light appearance, a copy of the `active` set, and covers/dark/<topic>.jpg
// in dark appearance, a copy of the `active_dark` set. A derived style (airy-mono) is made from
// another set's pictures by sharp, not generated, so it needs no API key.
//
//   npm run covers                          the active style's topics that have no cover yet
//   npm run covers -- --style airy          the same for another style's set
//   npm run covers -- --only a,b            just these topics (replacing their covers)
//   npm run covers -- --force               every topic of the style, replacing every cover
//   npm run covers -- --dry-run             print what would be generated, call nothing
//   npm run covers -- --use airy            make airy the active set: copy it to covers/<topic>.jpg
//   npm run covers -- --use-dark dark       make dark the dark-appearance set: copy it to covers/dark/
//   npm run covers -- --list-models         the image models this API key can use
//   npm run check:covers                    every set complete, both copies matching their sets
//
// Generating needs OPENAI_API_KEY in this repo's .env (see .env.example). OPENAI_IMAGE_MODEL picks the
// model. Decisions: docs/adr/0004-pack-covers.md, 0005-airy-cover-set.md,
// 0006-covers-follow-appearance.md, 0007-black-and-white-covers.md.

import { readFileSync, readdirSync, existsSync, writeFileSync, mkdirSync, copyFileSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const COVERS = join(ROOT, 'covers');
const SETS = join(COVERS, 'sets');
const DARK = join(COVERS, 'dark');
const PROMPTS = join(COVERS, 'prompts.yaml');
const PACKS = join(ROOT, 'packs');

// What every app and the web receive. 3:2, large enough for a 600-point-wide card at 2x.
export const COVER_WIDTH = 1200;
export const COVER_HEIGHT = 800;
const JPEG_QUALITY = 80;
// The API is asked for its 3:2 landscape size; sharp scales it to the size above.
const REQUEST_SIZE = '1536x1024';
const CONCURRENCY = 3;

// A derived style is made from another set's pictures instead of generated: its `from:` names a
// generated style, its `treatment:` one of these. Making one calls no API (ADR 0007).
const TREATMENTS = {
  // Black and white: the color taken out, the paper pushed to white and the line-work darkened a
  // little, so a watercolor reads as a pencil drawing. Levels: gray at `black` and below becomes
  // black, at `white` and above becomes white, and the midtones take a 0.9 gamma.
  'crisp-grayscale': { black: 0.06, white: 0.92, gamma: 0.9 },
};
const isDerived = (def) => typeof def === 'object' && def !== null;

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
  if (typeof doc?.styles !== 'object' || typeof doc?.covers !== 'object' || !doc.styles[doc.active] || !doc.styles[doc.active_dark]) {
    throw new Error('covers/prompts.yaml needs `active:` and `active_dark:` each naming one of its `styles:`, and a `covers:` map');
  }
  for (const [name, def] of Object.entries(doc.styles)) {
    if (typeof def === 'string') continue;
    if (!isDerived(def) || typeof doc.styles[def.from] !== 'string' || !TREATMENTS[def.treatment]) {
      throw new Error(`covers/prompts.yaml: style ${name} is either a prompt or \`from:\` a prompt style plus \`treatment:\` (${Object.keys(TREATMENTS).join(', ')})`);
    }
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

/** Problems with the covers as they stand. `requireImages`: every set and both copies complete. */
async function problems({ requireImages }) {
  const out = [];
  const all = topics();
  const { active, active_dark: activeDark, styles, covers } = loadPrompts();
  for (const t of all) if (!covers[t]) out.push(`${t}: no subject in covers/prompts.yaml`);
  for (const t of Object.keys(covers)) if (!all.includes(t)) out.push(`${t}: in covers/prompts.yaml but no pack has this topic`);

  // covers/: the active copy, the dark-appearance copy, the prompts and the sets, nothing else.
  const copies = [
    { dir: COVERS, label: 'covers', style: active, flag: '--use', skip: ['prompts.yaml', 'sets', 'dark'] },
    { dir: DARK, label: 'covers/dark', style: activeDark, flag: '--use-dark', skip: [] },
  ];
  for (const { dir, label, style, flag, skip } of copies) {
    for (const f of existsSync(dir) ? readdirSync(dir) : []) {
      if (skip.includes(f) || f.startsWith('.')) continue;
      const m = f.match(/^(.+)\.jpg$/);
      if (!m) { out.push(`${label}/${f}: only <topic>.jpg${skip.length ? ', prompts.yaml, dark/ and sets/' : ''} belong here`); continue; }
      if (!all.includes(m[1])) { out.push(`${label}/${f}: no pack has the topic ${m[1]}`); continue; }
      await checkImage(join(dir, f), `${label}/${f}`, out);
      if (!sameBytes(join(dir, f), join(setDir(style), f))) {
        out.push(`${label}/${f}: differs from covers/sets/${style}/${f} (run npm run covers -- ${flag} ${style})`);
      }
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
    for (const t of all) if (!existsSync(join(DARK, `${t}.jpg`))) out.push(`${t}: no covers/dark/${t}.jpg (run npm run covers -- --use-dark ${activeDark})`);
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

/** One cover of a derived style, from its `from` set's cover. Written as RGB, like every other set. */
async function derive({ treatment }, jpeg) {
  const { black, white, gamma } = TREATMENTS[treatment];
  const lut = new Uint8Array(256);
  for (let v = 0; v < 256; v++) {
    const x = Math.min(1, Math.max(0, (v / 255 - black) / (white - black)));
    lut[v] = Math.round(255 * x ** (1 / gamma));
  }
  const { data, info } = await sharp(jpeg).grayscale().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i++) data[i] = lut[data[i]];
  return sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } })
    .resize(COVER_WIDTH, COVER_HEIGHT, { fit: 'cover', position: 'centre' })
    .toColourspace('srgb')
    .jpeg({ quality: JPEG_QUALITY, mozjpeg: true, progressive: true })
    .toBuffer();
}

/**
 * Makes `style` the set one appearance shows, and records it: light (`active`) copies
 * covers/sets/<style>/*.jpg to covers/, dark (`active_dark`) copies them to covers/dark/.
 */
function use(style, { dark }) {
  const { styles } = loadPrompts();
  if (!styles[style]) throw new Error(`${style}: no such style in covers/prompts.yaml`);
  const missing = topics().filter((t) => !existsSync(join(setDir(style), `${t}.jpg`)));
  if (missing.length) throw new Error(`covers/sets/${style} has no cover for: ${missing.join(', ')}`);
  const dir = dark ? DARK : COVERS;
  const key = dark ? 'active_dark' : 'active';
  mkdirSync(dir, { recursive: true });
  // Drop a copy whose topic is gone, so the folder holds exactly the set.
  for (const f of readdirSync(dir)) if (f.endsWith('.jpg') && !topics().includes(f.slice(0, -4))) rmSync(join(dir, f));
  for (const t of topics()) copyFileSync(join(setDir(style), `${t}.jpg`), join(dir, `${t}.jpg`));
  const text = readFileSync(PROMPTS, 'utf8');
  const line = new RegExp(`^${key}: .*$`, 'm');
  if (!line.test(text)) throw new Error(`covers/prompts.yaml has no \`${key}:\` line`);
  writeFileSync(PROMPTS, text.replace(line, `${key}: ${style}`));
  console.log(`${dark ? 'Dark-appearance' : 'Active'} covers are now the ${style} set (${topics().length} topics).`);
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
    const { active, active_dark: activeDark, styles } = loadPrompts();
    console.log(`covers: ${topics().length} topics, ${Object.keys(styles).length} complete sets (${Object.keys(styles).join(', ')}); light: ${active}, dark: ${activeDark}`);
    return;
  }
  const useDarkArg = option(args, '--use-dark');
  if (useDarkArg) return use(useDarkArg, { dark: true });
  const useArg = option(args, '--use');
  if (useArg) return use(useArg, { dark: false });

  loadEnv();
  const key = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_IMAGE_MODEL || 'gpt-image-2.6-sunburst';
  const noKey = 'OPENAI_API_KEY is not set. Copy .env.example to .env and fill it in.';
  if (flag('--list-models')) {
    if (!key) throw new Error(noKey);
    return listModels(key);
  }

  const setProblems = (await problems({ requireImages: false })).filter((p) => !p.includes('differs from'));
  if (setProblems.length) {
    for (const p of setProblems) console.error(p);
    process.exit(1);
  }

  const { active, active_dark: activeDark, styles, covers } = loadPrompts();
  const style = option(args, '--style') || active;
  if (!styles[style]) throw new Error(`${style}: no such style in covers/prompts.yaml`);
  const def = styles[style];
  const derived = isDerived(def);
  if (!key && !derived && !flag('--dry-run')) throw new Error(noKey);
  const dir = setDir(style);
  for (const t of only ?? []) if (!covers[t]) throw new Error(`${t}: no subject in covers/prompts.yaml`);
  const todo = (only ?? topics()).filter((t) => only || flag('--force') || !existsSync(join(dir, `${t}.jpg`)));
  if (todo.length === 0) return console.log(`The ${style} set already has every cover. Pass --only or --force to replace some.`);

  const how = derived ? `from the ${def.from} set, ${def.treatment}` : `with ${model}`;
  console.log(`${todo.length} ${style} cover${todo.length === 1 ? '' : 's'} ${how}: ${todo.join(', ')}`);
  if (flag('--dry-run')) {
    if (!derived) console.log(`\nPrompt for ${todo[0]}:\n\n${def}\n\nSubject: ${covers[todo[0]]}`);
    return;
  }

  mkdirSync(dir, { recursive: true });
  const failed = [];
  const queue = [...todo];
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, queue.length) }, async () => {
      for (let t = queue.shift(); t; t = queue.shift()) {
        try {
          if (derived) {
            const source = join(setDir(def.from), `${t}.jpg`);
            if (!existsSync(source)) throw new Error(`no covers/sets/${def.from}/${t}.jpg to make it from`);
            writeFileSync(join(dir, `${t}.jpg`), await derive(def, readFileSync(source)));
          } else {
            const png = await generate(key, model, `${def}\n\nSubject: ${covers[t]}`);
            writeFileSync(join(dir, `${t}.jpg`), await toCover(png));
          }
          console.log(`✓ ${t}`);
        } catch (e) {
          failed.push(t);
          console.error(`✗ ${t}: ${e.message}`);
        }
      }
    }),
  );
  const made = todo.filter((t) => !failed.includes(t));
  for (const [name, d] of Object.entries(styles)) {
    if (isDerived(d) && d.from === style && made.length) {
      console.log(`\nThe ${name} set is made from ${style}: run npm run covers -- --style ${name} --only ${made.join(',')} to remake those.`);
    }
  }
  if (style === active) console.log(`\nThe ${style} set is active: run npm run covers -- --use ${style} to copy it to covers/.`);
  if (style === activeDark) console.log(`\nThe ${style} set is the dark-appearance one: run npm run covers -- --use-dark ${style} to copy it to covers/dark/.`);
  if (failed.length) {
    console.error(`\n${failed.length} failed. Retry with: npm run covers -- --style ${style} --only ${failed.join(',')}`);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
