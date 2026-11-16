#!/usr/bin/env node
// Generates pack covers (covers/<topic>.jpg) from covers/prompts.yaml with OpenAI's image API.
//
//   npm run covers                      every topic that has no cover yet
//   npm run covers -- --only a,b        just these topics (replacing their covers)
//   npm run covers -- --force           every topic, replacing every cover
//   npm run covers -- --dry-run         print what would be generated, call nothing
//   npm run covers -- --list-models     the image models this API key can use
//   npm run check:covers                every topic has a cover of the right size, and nothing else is in covers/
//
// Needs OPENAI_API_KEY in this repo's .env (see .env.example). OPENAI_IMAGE_MODEL picks the model.
// Decision: docs/adr/0004-pack-covers.md.

import { readFileSync, readdirSync, existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const COVERS = join(ROOT, 'covers');
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
  const doc = parse(readFileSync(join(COVERS, 'prompts.yaml'), 'utf8'));
  if (typeof doc?.style !== 'string' || typeof doc?.covers !== 'object') {
    throw new Error('covers/prompts.yaml needs a `style:` string and a `covers:` map');
  }
  return doc;
}

/** Problems with the set as it stands: topics without a subject or a cover, strays, wrong sizes. */
async function problems({ requireImages }) {
  const out = [];
  const all = topics();
  const { covers } = loadPrompts();
  for (const t of all) if (!covers[t]) out.push(`${t}: no subject in covers/prompts.yaml`);
  for (const t of Object.keys(covers)) if (!all.includes(t)) out.push(`${t}: in covers/prompts.yaml but no pack has this topic`);
  for (const f of readdirSync(COVERS)) {
    if (f === 'prompts.yaml' || f.startsWith('.')) continue;
    const m = f.match(/^(.+)\.jpg$/);
    if (!m) { out.push(`covers/${f}: only <topic>.jpg and prompts.yaml belong here`); continue; }
    if (!all.includes(m[1])) { out.push(`covers/${f}: no pack has the topic ${m[1]}`); continue; }
    const meta = await sharp(join(COVERS, f)).metadata();
    if (meta.width !== COVER_WIDTH || meta.height !== COVER_HEIGHT || meta.format !== 'jpeg') {
      out.push(`covers/${f}: ${meta.format} ${meta.width}x${meta.height}, expected jpeg ${COVER_WIDTH}x${COVER_HEIGHT}`);
    }
  }
  if (requireImages) for (const t of all) if (!existsSync(join(COVERS, `${t}.jpg`))) out.push(`${t}: no covers/${t}.jpg`);
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

async function main() {
  const args = process.argv.slice(2);
  const flag = (name) => args.includes(name);
  const onlyArg = args.find((a) => a.startsWith('--only'));
  const only = onlyArg
    ? (onlyArg.includes('=') ? onlyArg.split('=')[1] : args[args.indexOf(onlyArg) + 1] ?? '').split(',').filter(Boolean)
    : null;

  if (flag('--check')) {
    const found = await problems({ requireImages: true });
    for (const p of found) console.error(p);
    if (found.length) process.exit(1);
    console.log(`covers: ${topics().length} topics, every one with a ${COVER_WIDTH}x${COVER_HEIGHT} cover`);
    return;
  }

  loadEnv();
  const key = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_IMAGE_MODEL || 'gpt-image-2.6-sunburst';
  if (!key && !flag('--dry-run')) throw new Error('OPENAI_API_KEY is not set. Copy .env.example to .env and fill it in.');
  if (flag('--list-models')) return listModels(key);

  const setProblems = (await problems({ requireImages: false })).filter((p) => !p.includes('no pack has'));
  if (setProblems.length) {
    for (const p of setProblems) console.error(p);
    process.exit(1);
  }

  const { style, covers } = loadPrompts();
  for (const t of only ?? []) if (!covers[t]) throw new Error(`${t}: no subject in covers/prompts.yaml`);
  const todo = (only ?? topics()).filter((t) => only || flag('--force') || !existsSync(join(COVERS, `${t}.jpg`)));
  if (todo.length === 0) return console.log('Every topic already has a cover. Pass --only or --force to replace some.');

  console.log(`${todo.length} cover${todo.length === 1 ? '' : 's'} with ${model}: ${todo.join(', ')}`);
  if (flag('--dry-run')) {
    console.log(`\nPrompt for ${todo[0]}:\n\n${style}\n\nSubject: ${covers[todo[0]]}`);
    return;
  }

  mkdirSync(COVERS, { recursive: true });
  const failed = [];
  const queue = [...todo];
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, queue.length) }, async () => {
      for (let t = queue.shift(); t; t = queue.shift()) {
        try {
          const png = await generate(key, model, `${style}\n\nSubject: ${covers[t]}`);
          writeFileSync(join(COVERS, `${t}.jpg`), await toCover(png));
          console.log(`✓ ${t}`);
        } catch (e) {
          failed.push(t);
          console.error(`✗ ${t}: ${e.message}`);
        }
      }
    }),
  );
  if (failed.length) {
    console.error(`\n${failed.length} failed. Retry with: npm run covers -- --only ${failed.join(',')}`);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
