/**
 * Lecture fact check. Run with `npm run check:lecture-facts` (add
 * `-- --pack <slug>` for one pack, `-- --strict` to exit non-zero on any flag).
 *
 * A lecture script may hold only its lesson's facts (LECTURES.md, "Truth
 * and neutrality"). No script can prove that, but three things can be
 * checked by machine, and they catch most of what goes wrong when a writer
 * reaches for something they remember instead of something the lesson says:
 *
 *   numbers     every figure in the script is in the lesson: as a figure, in
 *               words ("fifty-three days"), or as the round figure of one
 *               that is ("about 577,000" for 576,851). A number the SCRIPT
 *               writes in words is not checked: that is left to a reader.
 *   quotations  every quoted passage of four words or more is in the lesson,
 *               word for word
 *   names       every capitalized word that is not starting a sentence is a
 *               word the lesson also uses
 *
 * Each flag is a place for a person to look, not a verdict: a number may be
 * a count the writer made of things the lesson lists, and a quoted line may
 * be speech invented for a scene. The lesson's frontmatter, prose and
 * component props are all the lesson.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const strict = args.includes('--strict');
const onlyPack = args.includes('--pack') ? args[args.indexOf('--pack') + 1] : null;

const frontmatter = (src) => {
  const m = /^---\r?\n([\s\S]*?)\r?\n---[^\S\n]*\r?\n?/.exec(src);
  return m ? { yaml: m[1], body: src.slice(m[0].length) } : null;
};
const field = (yaml, name) => yaml.match(new RegExp(`^${name}:\\s*["']?([^"'\\n#]+?)["']?\\s*(?:#.*)?$`, 'm'))?.[1]?.trim() ?? null;

/** Text as a reader would compare it: straight quotes, plain dashes, no markup. */
function plain(s) {
  return s
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[–—]/g, '-')
    .replace(/&nbsp;/g, ' ')
    .replace(/\[\[[a-z]+:([a-z0-9-]+)(?:\|([^\]]+))?\]\]/g, (_, slug, label) => label ?? slug.replace(/-/g, ' '))
    .replace(/[*_`]/g, '')
    .replace(/\\(["'])/g, '$1');
}

/** Letters and digits only, lowercased, single-spaced: for finding a quotation whatever its punctuation. */
const bare = (s) => plain(s).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

const NUMBER = /\d[\d,]*(?:\.\d+)?/g;
const value = (n) => Number(n.replace(/,/g, ''));

/** Numbers a text writes in words ("fifty-three days", "two hundred statutes"), as figures. */
const UNITS = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9 };
const TEENS = { ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19 };
const TENS = { twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90 };
function wordNumbers(text) {
  const out = [];
  const t = text.toLowerCase();
  const small = `${Object.keys(TENS).join('|')}|${Object.keys(TEENS).join('|')}|${Object.keys(UNITS).join('|')}`;
  const re = new RegExp(`\\b(${small})(?:[- ](${Object.keys(UNITS).join('|')}))?(?:\\s+(hundred|thousand|million|billion))?(?:\\s+(?:and\\s+)?(${small})(?:[- ](${Object.keys(UNITS).join('|')}))?)?\\b`, 'g');
  const small2 = (a, b) => (TENS[a] ?? TEENS[a] ?? UNITS[a] ?? 0) + (TENS[a] && b ? UNITS[b] : 0);
  for (const m of t.matchAll(re)) {
    const head = small2(m[1], m[2]);
    const scale = { hundred: 100, thousand: 1e3, million: 1e6, billion: 1e9 }[m[3]];
    out.push(head);
    if (scale) {
      out.push(head * scale);
      if (m[3] === 'hundred' && m[4]) out.push(head * 100 + small2(m[4], m[5]));
    }
  }
  return out;
}

/** Words that are capitalized in a script for reasons of speech, not because they name something. */
const SPOKEN_CAPS = new Set(
  `I One Two Three Four Five Six Seven Eight Nine Ten Eleven Twelve Twenty Thirty Forty Fifty Sixty Seventy Eighty Ninety Hundred Thousand Million Billion
   First Second Third Fourth Fifth Sixth Seventh Eighth Ninth Tenth Eleventh Twelfth Thirteenth Fourteenth Fifteenth Sixteenth Seventeenth Eighteenth Nineteenth Twentieth
   Twenty-First Twenty-Second Twenty-Third Twenty-Fourth Twenty-Fifth Twenty-Sixth Twenty-Seventh
   Article Articles Section Amendment Amendments Chapter Part Title Clause Federalist Rule
   And But So Or Now Then Not No Yes Why What Who How Where When Which That This It He She They We You A An The In On At For To Of If Is Are Was Were Do Does Did Can Could Would Should Will May Let Take Keep Hold Think Picture Imagine Here There Both Each Every Only Even Still Just Stop Listen Notice Remember Suppose Say Call Put`.split(/\s+/),
);

function checkScript(scriptBody, lessonSrc) {
  const flags = [];
  const lesson = plain(lessonSrc);
  const lessonBare = ` ${bare(lessonSrc)} `;
  const lessonNumbers = [...new Set([...(lesson.match(NUMBER) || []).map(value), ...wordNumbers(lesson)])];
  // Whole words, and the parts of hyphenated ones ("Jefferson-Burr tie" names Burr).
  const lessonWords = new Set([...(lesson.match(/[A-Za-z][A-Za-z'-]*/g) || []), ...(lesson.match(/[A-Za-z][A-Za-z']*/g) || [])]);
  const lessonWordsLower = new Set([...lessonWords].map((w) => w.toLowerCase()));

  const script = plain(scriptBody.replace(/<!--[\s\S]*?-->/g, '').replace(/^#{1,6}\s.*$/gm, '').replace(/\[(?:beat|pause|long pause)[^\]]*\]/gi, ' '));

  // Numbers.
  const seen = new Set();
  for (const m of script.matchAll(NUMBER)) {
    const n = value(m[0]);
    if (seen.has(n) || !Number.isFinite(n)) continue;
    seen.add(n);
    if (lessonNumbers.includes(n)) continue;
    if (n <= 12 && Number.isInteger(n)) continue; // a small count, written as a figure
    // "nearly 20 million" for 19,743,821: read the figure at its spoken scale.
    const scale = { thousand: 1e3, million: 1e6, billion: 1e9, trillion: 1e12 }[/^\s+(thousand|million|billion|trillion)\b/i.exec(script.slice(m.index + m[0].length))?.[1]?.toLowerCase()];
    if (scale && lessonNumbers.some((l) => l !== 0 && Math.abs(l - n * scale) / Math.abs(l) <= 0.03)) continue;
    // The round figure of a number the lesson has: within 2.5%, and rounder than it.
    const rounder = (a, b) => String(a).replace(/[^0]/g, '').length > String(b).replace(/[^0]/g, '').length || !Number.isInteger(b);
    if (lessonNumbers.some((l) => l !== 0 && Math.abs(l - n) / Math.abs(l) <= 0.025 && rounder(n, l))) continue;
    const at = script.slice(Math.max(0, m.index - 50), m.index + m[0].length + 30).replace(/\s+/g, ' ');
    flags.push(`number ${m[0]} is not in the lesson: "…${at}…"`);
  }

  // Quotations of four words or more.
  for (const m of script.matchAll(/"([^"\n]{12,400})"/g)) {
    const q = bare(m[1]);
    if (q.split(' ').length < 4) continue;
    if (lessonBare.includes(` ${q} `)) continue;
    flags.push(`quotation is not in the lesson word for word: "${m[1].slice(0, 110)}${m[1].length > 110 ? '…' : ''}"`);
  }

  // Capitalized words that do not start a sentence.
  const named = new Set();
  for (const para of script.split(/\n+/)) {
    const text = para.replace(/^>\s?/, '').trim();
    for (const m of text.matchAll(/[A-Z][A-Za-z'-]*/g)) {
      const word = m[0].replace(/'s$/, '');
      const before = text.slice(0, m.index).trimEnd();
      const startsSentence = before === '' || /[.!?:…"]$/.test(before);
      if (startsSentence || SPOKEN_CAPS.has(word) || named.has(word)) continue;
      if (lessonWords.has(word) || lessonWords.has(`${word}'s`) || lessonWords.has(`${word}s`) || lessonWordsLower.has(word.toLowerCase())) continue;
      // "Korea" where the lesson says "Korean": the same name in another form.
      if (word.length >= 4 && [...lessonWords].some((w) => w.length >= 4 && (w.startsWith(word) || word.startsWith(w)))) continue;
      named.add(word);
      const at = text.slice(Math.max(0, m.index - 40), m.index + word.length + 25);
      flags.push(`name "${word}" is not in the lesson: "…${at}…"`);
    }
  }
  return flags;
}

let scripts = 0;
let flagged = 0;
let total = 0;
const packsDir = join(root, 'packs');
for (const pack of readdirSync(packsDir).sort()) {
  if (onlyPack && pack !== onlyPack) continue;
  const lessonsDir = join(packsDir, pack, 'lessons');
  const lecturesDir = join(packsDir, pack, 'lectures');
  if (!existsSync(lessonsDir) || !existsSync(lecturesDir)) continue;
  const lessons = new Map();
  for (const f of readdirSync(lessonsDir).filter((f) => f.endsWith('.mdx'))) {
    const src = readFileSync(join(lessonsDir, f), 'utf8');
    const fm = frontmatter(src);
    const slug = fm && field(fm.yaml, 'slug');
    if (slug) lessons.set(slug, src);
  }
  for (const f of readdirSync(lecturesDir).filter((f) => f.endsWith('.md')).sort()) {
    const fm = frontmatter(readFileSync(join(lecturesDir, f), 'utf8'));
    const lesson = fm && lessons.get(field(fm.yaml, 'lesson'));
    if (!lesson) continue; // check-lectures.mjs reports this
    scripts++;
    const flags = checkScript(fm.body, lesson);
    if (flags.length === 0) continue;
    flagged++;
    total += flags.length;
    console.log(`packs/${pack}/lectures/${f}`);
    for (const flag of flags) console.log(`  ? ${flag}`);
    console.log('');
  }
}
console.log(`${scripts} script(s) read; ${total} place(s) to look in ${flagged} of them.`);
if (strict && total > 0) process.exit(1);
