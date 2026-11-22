/**
 * Reading-level check. Run with `npm run check:reading` (add `-- --all` to
 * list every lesson, level 3 included).
 *
 * A pack is written at one reading level (`reading_level:` in pack.yaml: 1, 2
 * or 3; 3 when absent). STYLE.md, "Reading levels (editions)", sets a
 * reading-grade ceiling and a length range for levels 1 and 2. This script
 * measures each lesson and fails when one is outside its band, so a level
 * cannot drift away from the text beneath it.
 *
 * What is measured: the lesson's prose. That is the Markdown body plus the
 * children of components (a Checkpoint's answer, a Panel's text). Frontmatter,
 * tables, code, and component props (a QuickCheck's choices, a chart's data)
 * are left out.
 *
 * The grade is Flesch-Kincaid: 0.39 x (words per sentence) + 11.8 x
 * (syllables per word) - 15.59. Syllables are counted by rule, not from a
 * dictionary, so treat the number as a gauge accurate to about half a grade,
 * not as a verdict on a single sentence. Level 3 lessons are reported and
 * never failed.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BANDS, measure } from './lib/reading.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const showAll = process.argv.includes('--all');

// --- walk packs ---
const errors = [];
const rows = [];
const college = [];
const packsDir = join(root, 'packs');
for (const pack of readdirSync(packsDir).sort()) {
  const manifestPath = join(packsDir, pack, 'pack.yaml');
  const lessonsDir = join(packsDir, pack, 'lessons');
  if (!existsSync(manifestPath) || !existsSync(lessonsDir)) continue;
  const manifest = readFileSync(manifestPath, 'utf8');
  const level = manifest.match(/^reading_level:\s*["']?([^"'\s#]+)["']?\s*(?:#.*)?$/m)?.[1] ?? '3';
  if (!(level in BANDS)) {
    errors.push(`packs/${pack}/pack.yaml: reading_level "${level}" is not one of ${Object.keys(BANDS).join(', ')}`);
    continue;
  }
  if (/^audience:/m.test(manifest)) {
    errors.push(`packs/${pack}/pack.yaml: "audience:" was replaced by "reading_level:" (1, 2 or 3)`);
  }
  const band = BANDS[level];
  for (const f of readdirSync(lessonsDir).filter((f) => f.endsWith('.mdx')).sort()) {
    const file = `packs/${pack}/lessons/${f}`;
    const src = readFileSync(join(lessonsDir, f), 'utf8');
    const m = measure(src.replace(/^---\n[\s\S]*?\n---\n?/, ''));
    if (!band) {
      college.push({ file, ...m });
      continue;
    }
    rows.push({ file, level, ...m });
    if (m.grade > band.maxGrade) {
      errors.push(`${file}: reading grade ${m.grade} is above the level ${level} ceiling of ${band.maxGrade}`);
    }
    if (m.words < band.words[0] || m.words > band.words[1]) {
      errors.push(`${file}: ${m.words} words is outside the level ${level} range of ${band.words[0]}–${band.words[1]}`);
    }
  }
}

const line = (r) => `  ${String(r.grade).padStart(5)}  ${String(r.words).padStart(5)} words  ${r.file}`;
if (rows.length) {
  console.log('Edition lessons (reading grade, length):');
  for (const a of ['1', '2']) {
    const set = rows.filter((r) => r.level === a);
    if (!set.length) continue;
    const b = BANDS[a];
    console.log(`\n level ${a}: grade at most ${b.maxGrade}, ${b.words[0]}–${b.words[1]} words`);
    for (const r of set) console.log(line(r));
  }
}
if (college.length) {
  const avg = college.reduce((s, r) => s + r.grade, 0) / college.length;
  const min = Math.min(...college.map((r) => r.grade));
  console.log(`\n level 3: ${college.length} lessons, average grade ${avg.toFixed(1)}, lowest ${min} (reported, not checked)`);
  if (showAll) for (const r of college) console.log(line(r));
}

if (errors.length) {
  console.error(`\n✗ ${errors.length} problem(s) with reading levels:\n`);
  for (const e of errors) console.error('  ' + e);
  process.exit(1);
}
console.log(`\n✓ ${rows.length} edition lesson(s) inside their bands`);
