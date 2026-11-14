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

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const showAll = process.argv.includes('--all');

/** The bands STYLE.md sets. `maxGrade` is a ceiling; `words` is a range. */
export const BANDS = {
  1: { maxGrade: 8.0, words: [600, 1000] },
  2: { maxGrade: 12.0, words: [1200, 1800] },
  3: null,
};

/** Remove every JSX tag (with its props) and every `{…}` expression, keeping children. */
function stripJsx(src) {
  let out = '';
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (c === '<' && /[A-Za-z/]/.test(src[i + 1] ?? '')) {
      // Scan to the tag's closing `>`, skipping over quoted strings and `{…}` props.
      let depth = 0;
      let quote = '';
      let j = i + 1;
      for (; j < src.length; j++) {
        const d = src[j];
        if (quote) {
          if (d === '\\') j++;
          else if (d === quote) quote = '';
        } else if (d === '"' || d === "'" || d === '`') quote = d;
        else if (d === '{') depth++;
        else if (d === '}') depth--;
        else if (d === '>' && depth === 0) break;
      }
      out += '\n';
      i = j + 1;
    } else if (c === '{') {
      let depth = 0;
      let j = i;
      for (; j < src.length; j++) {
        if (src[j] === '{') depth++;
        else if (src[j] === '}' && --depth === 0) break;
      }
      i = j + 1;
    } else {
      out += c;
      i++;
    }
  }
  return out;
}

const ABBREVIATIONS = /\b(No|Nos|U\.S|v|vs|Mr|Mrs|Ms|Dr|St|Art|Sec|Jr|Sr|Sen|Rep|Gov|Gen|Co|Inc|e\.g|i\.e|Amdt|Jan|Feb|Mar|Apr|Aug|Sept|Sep|Oct|Nov|Dec)\./g;

/** Lesson source (frontmatter already removed) to plain sentences, one per line. */
export function proseOf(body) {
  let s = body.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '');
  s = stripJsx(s);
  const lines = [];
  for (let line of s.split('\n')) {
    line = line.trim();
    if (!line || line.startsWith('|')) continue; // tables are data, not prose
    const block = /^(#{1,6}\s|[-*+]\s|\d+\.\s)/.test(line); // a heading or list item is its own sentence
    line = line
      .replace(/^#{1,6}\s+/, '')
      .replace(/^>\s?/, '')
      .replace(/^([-*+]|\d+\.)\s+/, '')
      .replace(/\[\[[a-z]+:([a-z0-9-]+)\]\]/g, (_, slug) => slug.replace(/-/g, ' '))
      .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/[*_~]+/g, '')
      .replace(/&nbsp;/g, ' ');
    if (!line) continue;
    if (block && !/[.!?:]["')\]]*$/.test(line)) line += '.';
    lines.push(line);
  }
  return lines.join('\n');
}

export function syllables(word) {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (w.length <= 3) return 1;
  let n = (w.match(/[aeiouy]+/g) || []).length;
  if (/[^aeiouy]ed$/.test(w) && !/[td]ed$/.test(w)) n--; // "passed", not "voted"
  else if (/[^aeiouy]es$/.test(w) && !/(?:[sxz]|ch|sh|[cg])es$/.test(w)) n--; // "votes", not "judges"
  else if (/[^aeiouyl]e$/.test(w) || /[aeiouy]le$/.test(w)) n--; // silent e: "vote", "rule"; not "table"
  return Math.max(1, n);
}

export function measure(body) {
  const text = proseOf(body).replace(ABBREVIATIONS, '$1');
  const sentences = text
    .split(/(?<=[.!?])["'”’)\]]*\s+|\n+/)
    .map((x) => x.trim())
    .filter((x) => /[A-Za-z0-9]/.test(x));
  let words = 0;
  let syl = 0;
  for (const token of text.match(/[A-Za-z][A-Za-z'’]*|\d[\d,.]*/g) || []) {
    words++;
    syl += /^\d/.test(token) ? 1 : syllables(token);
  }
  if (!words || !sentences.length) return { words: 0, sentences: 0, grade: 0 };
  const grade = 0.39 * (words / sentences.length) + 11.8 * (syl / words) - 15.59;
  return { words, sentences: sentences.length, grade: Math.round(grade * 10) / 10 };
}

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
