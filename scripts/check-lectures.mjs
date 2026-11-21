/**
 * Lecture script check. Run with `npm run check:lectures`. Add `-- --all` to
 * list every script, `-- --missing` to list the lessons that have none, and
 * `-- --pack <slug>` to check one pack.
 *
 * A lesson may have a lecture script beside it, `packs/<pack>/lectures/<lesson
 * file>.md`: the lesson rewritten for the ear (LECTURES.md). The app's
 * validator is the source of truth for the format. This script is the
 * author's gauge for the craft: it measures each script against the standard
 * and fails one that has drifted back toward a page read aloud.
 *
 * It fails a script that:
 *   - names no lesson of its pack, or is not named after its lesson's file;
 *   - holds anything a voice cannot say (links, components, tables, lists);
 *   - has no think-pause, fewer than three key lines, or too few silences;
 *   - averages longer sentences than its reading level allows, or (levels 1
 *     and 2) reads above the level's grade ceiling;
 *   - is far shorter than the lesson it teaches, or longer than a listener
 *     can stay with (a cap by reading level).
 * It warns about brackets, signs written for the eye, very long sentences,
 * long key lines and phrases the standard rules out.
 *
 * The silences' lengths below mirror `LECTURE_GAPS_MS` in the app
 * (src/content-schema/lecture.ts) and are used only to estimate a running
 * time; the app's own numbers are what a listener hears.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BANDS, measure, syllables } from './lib/reading.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const showAll = args.includes('--all');
const showMissing = args.includes('--missing');
const onlyPack = args.includes('--pack') ? args[args.indexOf('--pack') + 1] : null;

const GAPS = { breath: 0.9, beat: 1.3, pause: 2.0, section: 2.6, long: 3.6 };
/** The narrator's rate, in characters a second (the app's NARRATION_CHARS_PER_SECOND). */
const CHARS_PER_SECOND = 14.6;

/**
 * What a level allows. `sentence` is the average sentence, in words.
 * `words` is the script's length: over `aim` is a warning, over `most` an
 * error. A listener's attention sets these, not the lesson's length: past
 * about twenty minutes a lecture should have been two.
 */
const LEVELS = {
  1: { sentence: 13, maxGrade: BANDS[1].maxGrade, words: { aim: 1200, most: 1400 } },
  2: { sentence: 16, maxGrade: BANDS[2].maxGrade, words: { aim: 2200, most: 2400 } },
  3: { sentence: 17, maxGrade: null, words: { aim: 2800, most: 3000 } },
};
/** A chapter of a book pack is shorter than a lesson. */
const CHAPTER_WORDS = { aim: 2200, most: 2400 };
/** A script far shorter than its lesson has left the lesson out: under this share of the lesson's prose is an error. */
const SHORTEST = 0.6;
/** Silences (marks, key lines, sections) per thousand words, at least. */
const MIN_SILENCES_PER_THOUSAND = 9;
const KEY_LINE_WORDS = 14;
const LONG_SENTENCE = 40;

const MARK = /\[(beat|pause|long pause)(?:\s+(\d+(?:\.\d+)?)\s*s)?\]/gi;
const RULED_OUT = [
  [/\bin this (?:lecture|lesson|episode),? we(?:'ll| will)\b/i, '"in this lecture we will": start in the scene'],
  [/\bwelcome(?: back)?\b/i, '"welcome": start in the scene'],
  [/\bthanks? (?:you )?for listening\b/i, '"thanks for listening"'],
  [/\bunquote\b/i, '"quote… unquote": say who is speaking, then the words'],
  [/\bas you can see\b|\bsee (?:above|below)\b|\bshown (?:above|below)\b|\bthe following\b/i, 'a pointer for the eye ("as you can see", "above", "below", "the following")'],
  // "Click restraint" is a term of art in media literacy, not an instruction.
  [/\b(?:click(?! restraint)|tap|scroll|write (?:this|that|it) down)\b/i, 'asks the listener to do something: a lecture never does'],
  [/\b(?:basically|essentially|obviously|of course|as you know)\b/i, 'filler or talking down ("basically", "obviously", "of course")'],
];
/** "The former… the latter…" and "respectively" make the listener look back. ("The former governor" does not, and a quotation says what it says.) */
function looksBack(text) {
  const own = text.replace(/"[^"]*"/g, ' ');
  return /\bthe latter\b(?!\s+(?:half|part|years|days|stages?)\b)/i.test(own) || /\brespectively\b/i.test(own);
}

function frontmatter(src) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---[^\S\n]*\r?\n?/.exec(src);
  return m ? { yaml: m[1], body: src.slice(m[0].length) } : null;
}

const field = (yaml, name) => yaml.match(new RegExp(`^${name}:\\s*["']?([^"'\\n#]+?)["']?\\s*(?:#.*)?$`, 'm'))?.[1]?.trim() ?? null;

function wordCount(text) {
  return (text.match(/[A-Za-z][A-Za-z'’]*|\d[\d,.]*/g) || []).length;
}

/** Read a script's body: what is said, the silences, and what is wrong with it. */
function readScript(body) {
  const problems = [];
  const src = body.replace(/\r\n?/g, '\n').replace(/<!--[\s\S]*?-->/g, (m) => m.replace(/[^\n]/g, ''));
  const said = []; // paragraphs of spoken text
  const keyLines = [];
  const gaps = { breath: 0, beat: 0, pause: 0, section: 0, long: 0 };
  let seconds = 0;
  let thinkPauses = 0;
  let sections = 0;
  let block = [];
  let blockKey = false;
  let blockLine = 0;

  const flush = () => {
    if (!block.length) return;
    const raw = block.join(' ');
    block = [];
    const line = blockLine;
    for (const m of raw.matchAll(MARK)) {
      const name = m[1].toLowerCase();
      if (m[2] !== undefined) {
        if (name !== 'pause') problems.push({ level: 'error', line, message: `${m[0]} is not a mark: only [pause 5s] takes a length` });
        const s = Math.min(10, Number(m[2]));
        seconds += s;
        if (s >= 3) thinkPauses++;
        gaps.pause++;
      } else {
        const kind = name === 'beat' ? 'beat' : name === 'pause' ? 'pause' : 'long';
        gaps[kind]++;
        seconds += GAPS[kind];
        if (kind === 'long') thinkPauses++;
      }
    }
    const text = raw
      .replace(MARK, ' ')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*\s][^*]*)\*/g, '$1')
      .replace(/\s+/g, ' ')
      .trim();
    if (!text) return;
    if (/\[\[/.test(text)) problems.push({ level: 'error', line, message: 'a [[link]] cannot be spoken: write the words' });
    else if (/\[[^\]]*\]\([^)]*\)/.test(text)) problems.push({ level: 'error', line, message: 'a Markdown link cannot be spoken: write the words' });
    else if (/\[[^\]]*\]/.test(text)) problems.push({ level: 'error', line, message: `an unknown mark ${/\[[^\]]*\]/.exec(text)[0]}: the marks are [beat], [pause], [long pause] and [pause 5s]` });
    if (/https?:\/\/|\bwww\./i.test(text)) problems.push({ level: 'error', line, message: 'a web address cannot be spoken' });
    if (/<\/?[A-Za-z][^>]*>/.test(text)) problems.push({ level: 'error', line, message: 'a tag or component cannot be spoken' });
    // "501(c)(4)" is a name with brackets in it, and the narrator knows how to say it.
    if (/[()]/.test(text.replace(/\b\d+\([a-z]\)(?:\(\d+\))?/gi, ''))) problems.push({ level: 'warning', line, message: 'brackets cannot be heard: say the aside as its own sentence, or leave it out' });
    if (looksBack(text)) problems.push({ level: 'warning', line, message: 'ruled out by the standard: "the former… the latter", "respectively": the ear cannot look back' });
    if (/\b(?:e\.g\.|i\.e\.|etc\.)|[§¶]/i.test(text)) problems.push({ level: 'warning', line, message: 'written for the eye (e.g., i.e., etc., §): say it in words' });
    if (/\d\s*[–—-]\s*\d/.test(text)) problems.push({ level: 'warning', line, message: 'a range or score written with a dash: say "5 to 4", "from 1787 to 1791"' });
    for (const [re, message] of RULED_OUT) if (re.test(text)) problems.push({ level: 'warning', line, message: `ruled out by the standard: ${message}` });
    said.push(text);
    if (blockKey) {
      keyLines.push(text);
      const n = wordCount(text);
      if (n > KEY_LINE_WORDS + 4) problems.push({ level: 'warning', line, message: `a key line of ${n} words: ${KEY_LINE_WORDS} or fewer is one a listener can keep` });
    }
    // A paragraph ends in a breath unless a longer silence follows; counted as a breath here, which is close enough for an estimate.
    gaps.breath++;
    seconds += GAPS.breath;
  };

  let fence = false;
  src.split('\n').forEach((rawLine, i) => {
    const line = rawLine.trimEnd();
    const n = i + 1;
    if (/^\s*(```|~~~)/.test(line)) {
      flush();
      if (!fence) problems.push({ level: 'error', line: n, message: 'a code block cannot be spoken' });
      fence = !fence;
      return;
    }
    if (fence) return;
    if (!line.trim()) return flush();
    if (/^#{1,6}\s+/.test(line)) {
      flush();
      sections++;
      gaps.section++;
      seconds += GAPS.section;
      return;
    }
    if (/^\s*\|/.test(line)) {
      flush();
      problems.push({ level: 'error', line: n, message: 'a table cannot be spoken: say what it shows' });
      return;
    }
    if (/^\s*(?:[-*+]\s+|\d{1,2}[.)]\s+)/.test(line)) problems.push({ level: 'error', line: n, message: 'a list cannot be spoken as a list: count the items off in sentences' });
    const quote = /^\s*>\s?(.*)$/.exec(line);
    const isKey = quote !== null;
    if (block.length && isKey !== blockKey) flush();
    if (!block.length) {
      blockKey = isKey;
      blockLine = n;
    }
    const text = (quote ? quote[1] : line).trim();
    if (text) block.push(text);
  });
  flush();

  const text = said.join('\n');
  const sentences = text
    .replace(/\b(No|Nos|U\.S|v|vs|Mr|Mrs|Ms|Dr|St|Jr|Sr|Sen|Rep|Gov|Gen)\./g, '$1')
    .split(/(?<=[.!?…])["'”’)\]]*\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => /[A-Za-z0-9]/.test(s));
  const words = wordCount(text);
  for (const s of sentences) {
    const n = wordCount(s);
    if (n > LONG_SENTENCE) problems.push({ level: 'warning', message: `a sentence of ${n} words is hard to follow by ear: "${s.slice(0, 60)}…"` });
  }
  let syl = 0;
  for (const token of text.match(/[A-Za-z][A-Za-z'’]*|\d[\d,.]*/g) || []) syl += /^\d/.test(token) ? 1 : syllables(token);
  const grade = words && sentences.length ? Math.round((0.39 * (words / sentences.length) + 11.8 * (syl / words) - 15.59) * 10) / 10 : 0;
  seconds += text.length / CHARS_PER_SECOND;
  return {
    problems,
    words,
    sentences: sentences.length,
    perSentence: sentences.length ? words / sentences.length : 0,
    grade,
    keyLines: keyLines.length,
    thinkPauses,
    sections,
    silences: gaps.beat + gaps.pause + gaps.long + gaps.section + keyLines.length,
    seconds,
  };
}

// --- walk packs ---
const errors = [];
const warnings = [];
const rows = [];
const missing = [];
let lessonsTotal = 0;
const packsDir = join(root, 'packs');
for (const pack of readdirSync(packsDir).sort()) {
  if (onlyPack && pack !== onlyPack) continue;
  const manifestPath = join(packsDir, pack, 'pack.yaml');
  const lessonsDir = join(packsDir, pack, 'lessons');
  if (!existsSync(manifestPath) || !existsSync(lessonsDir)) continue;
  const manifest = readFileSync(manifestPath, 'utf8');
  const level = field(manifest, 'reading_level') ?? '3';
  const rules = LEVELS[level] ?? LEVELS[3];
  const isBook = /^tags:[^\n]*\bbook\b|^\s+-\s+book\s*$/m.test(manifest);
  const length = isBook ? CHAPTER_WORDS : rules.words;

  /** Lesson slug → { file stem, words of prose }. */
  const lessons = new Map();
  for (const f of readdirSync(lessonsDir).filter((f) => f.endsWith('.mdx')).sort()) {
    const fm = frontmatter(readFileSync(join(lessonsDir, f), 'utf8'));
    if (!fm) continue;
    const slug = field(fm.yaml, 'slug');
    if (slug) lessons.set(slug, { stem: f.replace(/\.mdx$/, ''), words: measure(fm.body).words });
  }
  lessonsTotal += lessons.size;

  const lecturesDir = join(packsDir, pack, 'lectures');
  const covered = new Set();
  const files = existsSync(lecturesDir) ? readdirSync(lecturesDir).filter((f) => f.endsWith('.md')).sort() : [];
  for (const f of files) {
    const file = `packs/${pack}/lectures/${f}`;
    const err = (m) => errors.push(`${file}: ${m}`);
    const warn = (m) => warnings.push(`${file}: ${m}`);
    const fm = frontmatter(readFileSync(join(lecturesDir, f), 'utf8'));
    if (!fm) {
      err('no frontmatter: a script opens with ---, schema: bettercitizen.lecture/v1, lesson: <slug>, ---');
      continue;
    }
    if (field(fm.yaml, 'schema') !== 'bettercitizen.lecture/v1') err('schema must be bettercitizen.lecture/v1');
    const slug = field(fm.yaml, 'lesson');
    const lesson = slug ? lessons.get(slug) : null;
    if (!lesson) {
      err(`lesson "${slug}" is not a lesson of this pack (its slugs: ${[...lessons.keys()].join(', ')})`);
      continue;
    }
    if (covered.has(slug)) err(`lesson "${slug}" already has a script`);
    covered.add(slug);
    if (f !== `${lesson.stem}.md`) err(`a script is named after its lesson's file: ${lesson.stem}.md`);

    const offset = fm.body ? readFileSync(join(lecturesDir, f), 'utf8').split('\n').length - fm.body.split('\n').length : 0;
    const s = readScript(fm.body);
    for (const p of s.problems) (p.level === 'error' ? err : warn)(`${p.line ? `line ${p.line + offset}: ` : ''}${p.message}`);
    if (s.words === 0) {
      err('the script says nothing');
      continue;
    }
    const share = lesson.words ? s.words / lesson.words : 1;
    if (share < SHORTEST) err(`${s.words} words is ${Math.round(share * 100)}% of its lesson's ${lesson.words}: the lecture has left too much of the lesson out`);
    if (s.words > length.most) err(`${s.words} words (about ${Math.round(s.seconds / 60)} minutes): ${length.most} at most for ${isBook ? 'a chapter' : `a level ${level} lesson`}. Cut the fourth example before a think-pause`);
    else if (s.words > length.aim) warn(`${s.words} words (about ${Math.round(s.seconds / 60)} minutes): aim for ${length.aim} or fewer`);
    if (s.perSentence > rules.sentence) err(`sentences average ${s.perSentence.toFixed(1)} words: ${rules.sentence} at most at level ${level}`);
    if (s.perSentence < 7) warn(`sentences average ${s.perSentence.toFixed(1)} words: a run of very short sentences sounds like a telegram; let the explaining flow`);
    if (rules.maxGrade !== null && s.grade > rules.maxGrade) err(`reading grade ${s.grade} is above the level ${level} ceiling of ${rules.maxGrade}`);
    if (s.thinkPauses === 0) err('no think-pause: put a question to the listener and follow it with [long pause]');
    if (s.keyLines < 3) err(`${s.keyLines} key line(s): mark the three to eight lines a listener should keep with ">"`);
    const perThousand = (s.silences / s.words) * 1000;
    if (perThousand < MIN_SILENCES_PER_THOUSAND) err(`${perThousand.toFixed(0)} silences per thousand words: it will sound read, not spoken (${MIN_SILENCES_PER_THOUSAND} at least)`);
    if (s.sections < 2) warn(`${s.sections} section(s): mark each turn of the lecture with a "## heading"`);
    rows.push({ file, level, ...s, share });
  }
  for (const [slug, l] of lessons) if (!covered.has(slug)) missing.push(`packs/${pack}/lessons/${l.stem}.mdx`);
}

const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;
if (showAll && rows.length) {
  console.log(' level  words   of lesson  w/sent  grade  key  think   runs   script');
  for (const r of rows) {
    console.log(
      `   ${r.level}   ${String(r.words).padStart(5)}   ${String(Math.round(r.share * 100)).padStart(6)}%   ${r.perSentence.toFixed(1).padStart(5)}  ${String(r.grade).padStart(5)}  ${String(r.keyLines).padStart(3)}  ${String(r.thinkPauses).padStart(5)}  ${mmss(r.seconds).padStart(6)}   ${r.file}`,
    );
  }
  console.log('');
}
if (showMissing && missing.length) {
  console.log(`Lessons with no lecture script (${missing.length}):`);
  for (const m of missing) console.log(`  ${m}`);
  console.log('');
}
if (warnings.length) {
  console.log(`⚠ ${warnings.length} warning(s):\n`);
  for (const w of warnings) console.log('  ' + w);
  console.log('');
}
if (errors.length) {
  console.error(`✗ ${errors.length} problem(s) with lecture scripts:\n`);
  for (const e of errors) console.error('  ' + e);
  process.exit(1);
}
const total = rows.reduce((n, r) => n + r.seconds, 0);
console.log(`✓ ${rows.length} lecture script(s) meet the standard (${lessonsTotal - missing.length} of ${lessonsTotal} lessons have one; about ${Math.round(total / 60)} minutes of lectures)`);
