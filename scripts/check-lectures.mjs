/**
 * Lecture script check. Run with `npm run check:lectures`. Add `-- --all` to
 * list every script, `-- --missing` to list the lessons that have none,
 * `-- --warnings` to list every warning, and `-- --pack <slug>` to check one
 * pack (its warnings are listed).
 *
 * A lesson may have a lecture script beside it, `packs/<pack>/lectures/<lesson
 * file>.md`: the lesson rewritten for the ear (LECTURES.md). The app's
 * validator is the source of truth for the format. This script is the
 * author's gauge for the craft: it measures each script against the lesson
 * spec and fails one that has drifted back toward a page read aloud.
 *
 * Every number it measures against is the lesson spec's, read from
 * lesson-spec.json: the copy of the spec as data that `pnpm lesson-spec:write`
 * in bettercitizen.ai writes beside LESSON_SPEC.md. It keeps no thresholds of
 * its own, so it cannot drift from the app: change a number in the spec,
 * write the copies, and this check follows. It counts the way the app does
 * (words between spaces, sentences inside a paragraph, a paragraph cut at its
 * marks), so it fails what the app's validators fail.
 *
 * It fails a script that:
 *   - names no lesson of its pack, or is not named after its lesson's file;
 *   - holds anything a voice cannot say (links, components, tables, lists, code);
 *   - holds a paragraph longer than one breath (the app's parser caps it);
 *   - has no think-pause, too few key lines, or too few silences;
 *   - averages longer sentences than its reading level allows, or (levels 1
 *     and 2) reads above the level's grade ceiling;
 *   - is far shorter than the lesson it teaches, or longer than a listener
 *     can stay with (a cap by reading level).
 * It warns where the spec asks for a band (length, average sentence, sections,
 * key lines, think-pauses), and about brackets, signs written for the eye,
 * long sentences, long key lines and phrases the spec rules out. By default
 * the warnings are counted by the spec rule they break.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { measure, measureText } from './lib/reading.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const showAll = args.includes('--all');
const showMissing = args.includes('--missing');
const onlyPack = args.includes('--pack') ? args[args.indexOf('--pack') + 1] : null;
const listWarnings = args.includes('--warnings') || showAll || onlyPack !== null;

// --- the lesson spec's numbers ---

/** The spec as data. Both copies are written together, so they must be the same version. */
function readSpec() {
  const fail = (message) => {
    console.error(`✗ ${message}: run \`pnpm lesson-spec:write\` in bettercitizen.ai`);
    process.exit(1);
  };
  const file = join(root, 'lesson-spec.json');
  if (!existsSync(file)) fail('lesson-spec.json is missing');
  const spec = JSON.parse(readFileSync(file, 'utf8'));
  const limits = ['lectureParagraphChars', 'lectureSentenceMax', 'lectureShortestShare', 'silencesPerThousand', 'keyLines', 'keyLinesMin', 'keyLineWords', 'thinkPauses', 'shortLectureWords', 'lectureSections'];
  const need = ['numbers.lectureWords', 'numbers.lectureSentence', 'numbers.readingGrade', 'numbers.narrationCharsPerSecond', 'enums.lectureGapsMs', 'enums.maxGapMs', 'lectureRuledOut', ...limits.map((k) => `numbers.limits.${k}`)];
  const missing = need.filter((path) => path.split('.').reduce((o, k) => o?.[k], spec) === undefined);
  if (missing.length) fail(`lesson-spec.json (spec ${spec.version}) has no ${missing.join(', ')}`);
  const md = existsSync(join(root, 'LESSON_SPEC.md')) ? readFileSync(join(root, 'LESSON_SPEC.md'), 'utf8') : '';
  const mdVersion = /^# Better Citizen lesson spec, version (\S+)/.exec(md)?.[1] ?? 'missing';
  if (mdVersion !== spec.version) fail(`LESSON_SPEC.md is spec ${mdVersion} but lesson-spec.json is spec ${spec.version}`);
  return spec;
}

const spec = readSpec();
/** Spoken words: `aim` is a band, over `most` is an error. By reading level, and for a book chapter. */
const WORDS = spec.numbers.lectureWords;
/** Average words a sentence: over `aim` is a warning, over `most` an error. By reading level. */
const SENTENCE = spec.numbers.lectureSentence;
/** The reading grade a level-1 or level-2 script never goes above. */
const GRADE = spec.numbers.readingGrade;
const LIMITS = spec.numbers.limits;
/** The narrator's silences (in seconds) and rate, used only to estimate a running time: the app's own timing is what a listener hears. */
const GAPS = Object.fromEntries(Object.entries(spec.enums.lectureGapsMs).map(([kind, ms]) => [kind, ms / 1000]));
const MAX_GAP = spec.enums.maxGapMs / 1000;
const CHARS_PER_SECOND = spec.numbers.narrationCharsPerSecond;
/** Phrases a script's own words never use. */
const RULED_OUT = spec.lectureRuledOut.map((p) => ({ re: new RegExp(p.pattern, p.flags), rule: p.rule, message: p.message }));

// --- reading a script ---

const MARK = /\[(beat|pause|long pause)(?:\s+(\d+(?:\.\d+)?)\s*s)?\]/gi;

/** Drop the inline Markdown a script may carry for its author's eye, as the app's parser does. */
const plain = (text) =>
  text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*\s][^*]*)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
/** Words and sentences, counted as the app counts them. */
const wordsOf = (text) => (text.trim() ? text.trim().split(/\s+/).length : 0);
const sentencesOf = (text) => text.split(/(?<=[.!?…]["'”’)\]]*)\s+/).filter((s) => /[A-Za-z0-9]/.test(s));
/** A quotation says what its speaker said: only the script's own words are held to the voice rules. */
const ownWords = (text) => text.replace(/"[^"\n]*"|“[^”\n]*”/g, ' ');
const round1 = (n) => Math.round(n * 10) / 10;
const outside = (n, [lo, hi]) => n < lo || n > hi;
const band = ([lo, hi]) => `${lo.toLocaleString('en-US')} to ${hi.toLocaleString('en-US')}`;

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

/** Read a script's body: what is said, the silences, and what is wrong with it. */
function readScript(body) {
  const problems = [];
  const src = body.replace(/\r\n?/g, '\n').replace(/<!--[\s\S]*?-->/g, (m) => m.replace(/[^\n]/g, ''));
  const beats = []; // what is said in one go, as the app's parser cuts it
  const keyLines = [];
  const marks = { beat: 0, pause: 0, long: 0 };
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
    const err = (rule, message) => problems.push({ level: 'error', rule, line, message });
    const warn = (rule, message) => problems.push({ level: 'warning', rule, line, message });

    // A mark inside a paragraph cuts it there: each piece is said in one go, and none may run past a breath.
    const say = (piece) => {
      const text = plain(piece);
      if (!text) return;
      if (text.length > LIMITS.lectureParagraphChars) err('listening.breath', `a paragraph of ${text.length} characters: a paragraph is one breath (${LIMITS.lectureParagraphChars} at most). Split it at a sentence break`);
      beats.push(text);
    };
    let at = 0;
    for (const m of raw.matchAll(MARK)) {
      say(raw.slice(at, m.index));
      at = m.index + m[0].length;
      if (!beats.length) warn('listening.marks', 'a pause mark before any words does nothing');
      const name = m[1].toLowerCase();
      if (m[2] !== undefined) {
        if (name === 'pause') thinkPauses++;
        else err('listening.marks', `${m[0]} is not a mark: only [pause 5s] takes a length`);
        seconds += Math.min(MAX_GAP, Number(m[2]));
        marks.pause++;
      } else {
        const kind = name === 'beat' ? 'beat' : name === 'pause' ? 'pause' : 'long';
        marks[kind]++;
        seconds += GAPS[kind];
        if (kind === 'long') thinkPauses++;
      }
    }
    say(raw.slice(at));

    const text = plain(raw.replace(MARK, ' '));
    if (!text) return;
    if (/\[\[/.test(text)) err('listening.speakable', 'a [[link]] cannot be spoken: write the words');
    else if (/\[[^\]]*\]\([^)]*\)/.test(text)) err('listening.speakable', 'a Markdown link cannot be spoken: write the words');
    else if (/\[[^\]]*\]/.test(text)) err('listening.marks', `an unknown mark ${/\[[^\]]*\]/.exec(text)[0]}: the marks are [beat], [pause], [long pause] and [pause 5s]`);
    if (/https?:\/\/|\bwww\./i.test(text)) err('listening.speakable', 'a web address cannot be spoken');
    if (/<\/?[A-Za-z][^>]*>/.test(text)) err('listening.speakable', 'a tag or component cannot be spoken');
    // "501(c)(4)" is a name with brackets in it, and the narrator knows how to say it.
    if (/[()]/.test(text.replace(/\b\d+\([a-z]\)(?:\(\d+\))?/gi, ''))) warn('listening.no-asides', 'brackets cannot be heard: say the aside as its own sentence, or leave it out');
    if (looksBack(text)) warn('listening.no-asides', '"the former… the latter", "respectively": the ear cannot look back');
    if (/\b(?:e\.g\.|i\.e\.|etc\.|viz\.|cf\.)|[§¶]/i.test(text)) warn('listening.numbers', 'written for the eye (e.g., i.e., etc., §): say it in words');
    if (/\d\s*[–—-]\s*\d/.test(text)) warn('listening.numbers', 'a range or score written with a dash: say "5 to 4", "from 1787 to 1791"');
    const own = ownWords(text);
    for (const { re, rule, message } of RULED_OUT) {
      const hit = re.exec(own);
      if (hit) warn(rule, `ruled out by the spec: ${message}; found "${hit[0]}"`);
    }
    if (blockKey) {
      keyLines.push(text);
      const n = wordsOf(text);
      if (n > LIMITS.keyLineWords) warn('listening.key-lines', `a key line of ${n} words: ${LIMITS.keyLineWords} or fewer is one a listener can keep`);
      if (/^(?:this|it|that|these|they)\s+(?:is|was|are|were|means|meant|matters)\b/i.test(text)) warn('listening.key-lines', 'a key line that starts with a pointer ("this is", "it means"): a key line must make sense heard alone');
    }
    // A paragraph ends in a breath unless a longer silence follows; counted as a breath here, which is close enough for an estimate.
    seconds += GAPS.breath;
  };

  let fence = false;
  src.split('\n').forEach((rawLine, i) => {
    const line = rawLine.trimEnd();
    const n = i + 1;
    if (/^\s*(```|~~~)/.test(line)) {
      flush();
      if (!fence) problems.push({ level: 'error', rule: 'listening.speakable', line: n, message: 'a code block cannot be spoken' });
      fence = !fence;
      return;
    }
    if (fence) return;
    if (!line.trim()) return flush();
    if (/^#{1,6}\s+/.test(line)) {
      flush();
      sections++;
      seconds += GAPS.section;
      return;
    }
    if (/^\s*\|/.test(line)) {
      flush();
      problems.push({ level: 'error', rule: 'listening.speakable', line: n, message: 'a table cannot be spoken: say what it shows' });
      return;
    }
    if (/^\s*(?:[-*+]\s+|\d{1,2}[.)]\s+)/.test(line)) problems.push({ level: 'error', rule: 'listening.speakable', line: n, message: 'a list cannot be spoken as a list: count the items off in sentences' });
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

  const spoken = beats.join('\n');
  const words = beats.reduce((n, b) => n + wordsOf(b), 0);
  const sentences = beats.flatMap(sentencesOf);
  for (const s of sentences) {
    const n = wordsOf(s);
    if (n > LIMITS.lectureSentenceMax && !/["“]/.test(s)) problems.push({ level: 'warning', rule: 'listening.sentences', message: `a sentence of ${n} words is hard to follow by ear (${LIMITS.lectureSentenceMax} at most, except an exact quotation): "${s.slice(0, 60)}…"` });
  }
  seconds += spoken.length / CHARS_PER_SECOND;
  return {
    problems,
    words,
    sentences: sentences.length,
    perSentence: sentences.length ? round1(words / sentences.length) : 0,
    grade: measureText(spoken).grade,
    keyLines: keyLines.length,
    thinkPauses,
    sections,
    silences: marks.beat + marks.pause + marks.long + keyLines.length + sections,
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
  const level = WORDS[field(manifest, 'reading_level')] ? field(manifest, 'reading_level') : '3';
  const isBook = /^tags:[^\n]*\bbook\b|^\s+-\s+book\s*$/m.test(manifest);
  const length = isBook ? WORDS.bookChapter : WORDS[level];
  const what = isBook ? 'a chapter' : `a level ${level} lesson`;
  const sentence = SENTENCE[level];
  const ceiling = GRADE[level]?.ceiling ?? null;

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
    const err = (rule, message) => errors.push({ file, rule, message });
    const warn = (rule, message) => warnings.push({ file, rule, message });
    const fm = frontmatter(readFileSync(join(lecturesDir, f), 'utf8'));
    if (!fm) {
      err('files.lecture.markdown', 'no frontmatter: a script opens with ---, schema: bettercitizen.lecture/v1, lesson: <slug>, ---');
      continue;
    }
    if (field(fm.yaml, 'schema') !== 'bettercitizen.lecture/v1') err('files.lecture.markdown', 'schema must be bettercitizen.lecture/v1');
    const slug = field(fm.yaml, 'lesson');
    const lesson = slug ? lessons.get(slug) : null;
    if (!lesson) {
      err('files.lecture.lesson', `lesson "${slug}" is not a lesson of this pack (its slugs: ${[...lessons.keys()].join(', ')})`);
      continue;
    }
    if (covered.has(slug)) err('files.lecture.lesson', `lesson "${slug}" already has a script`);
    covered.add(slug);
    if (f !== `${lesson.stem}.md`) err('workflow.three-files', `a script is named after its lesson's file: ${lesson.stem}.md`);

    const offset = fm.body ? readFileSync(join(lecturesDir, f), 'utf8').split('\n').length - fm.body.split('\n').length : 0;
    const s = readScript(fm.body);
    for (const p of s.problems) (p.level === 'error' ? err : warn)(p.rule, `${p.line ? `line ${p.line + offset}: ` : ''}${p.message}`);
    if (s.words === 0) {
      err('listening.speakable', 'the script says nothing');
      continue;
    }
    const minutes = Math.round(s.seconds / 60);
    const share = lesson.words ? s.words / lesson.words : 1;
    if (s.words > length.most) err('listening.length', `${s.words} words (about ${minutes} minutes): ${length.most} at most for ${what}. Cut the fourth example before a think-pause`);
    else if (outside(s.words, length.aim)) warn('listening.length', `${s.words} words (about ${minutes} minutes): aim for ${band(length.aim)} for ${what}`);
    if (share < LIMITS.lectureShortestShare) err('listening.length', `${s.words} words is ${Math.round(share * 100)}% of its lesson's ${lesson.words}: under ${Math.round(LIMITS.lectureShortestShare * 100)}%, the lecture has left too much of the lesson out`);
    if (s.perSentence > sentence.most) err('listening.sentences', `sentences average ${s.perSentence} words: ${sentence.most} at most at level ${level} (aim for ${sentence.aim})`);
    else if (s.perSentence > sentence.aim) warn('listening.sentences', `sentences average ${s.perSentence} words: aim for ${sentence.aim} or fewer at level ${level}`);
    // The spec's "let the explaining flow": the one gauge here the spec does not number.
    if (s.perSentence < 7) warn('listening.sentences', `sentences average ${s.perSentence} words: a run of very short sentences sounds like a telegram; let the explaining flow`);
    if (ceiling !== null && s.grade > ceiling) err('listening.level', `reading grade ${s.grade} is above the level ${level} ceiling of ${ceiling}`);
    const pauses = s.words < LIMITS.shortLectureWords ? [1, LIMITS.thinkPauses[1]] : LIMITS.thinkPauses;
    if (s.thinkPauses === 0) err('checks.think-pause-required', 'no think-pause: put a question to the listener and follow it with [long pause]');
    else if (outside(s.thinkPauses, pauses)) warn('checks.think-pauses', `${s.thinkPauses} think-pause(s): aim for ${band(pauses)}`);
    if (s.keyLines < LIMITS.keyLinesMin) err('listening.key-lines', `${s.keyLines} key line(s): mark at least ${LIMITS.keyLinesMin} of the lines a listener should keep with ">" (aim for ${band(LIMITS.keyLines)})`);
    else if (outside(s.keyLines, LIMITS.keyLines)) warn('listening.key-lines', `${s.keyLines} key lines: aim for ${band(LIMITS.keyLines)}`);
    const perThousand = round1((s.silences / s.words) * 1000);
    if (perThousand < LIMITS.silencesPerThousand) err('listening.silences', `${perThousand} silences per thousand words: it will sound read, not spoken (${LIMITS.silencesPerThousand} at least)`);
    if (outside(s.sections, LIMITS.lectureSections)) warn('listening.sections', `${s.sections} section(s): aim for ${band(LIMITS.lectureSections)} "## headings", each one idea`);
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
if (warnings.length && listWarnings) {
  console.log(`⚠ ${warnings.length} warning(s):\n`);
  for (const w of warnings) console.log(`  ${w.file}: ${w.message} [${w.rule}]`);
  console.log('');
} else if (warnings.length) {
  const byRule = new Map();
  for (const w of warnings) byRule.set(w.rule, [...(byRule.get(w.rule) ?? []), w]);
  const scripts = new Set(warnings.map((w) => w.file)).size;
  console.log(`⚠ ${warnings.length} warning(s) in ${scripts} script(s), by rule of the lesson spec (\`-- --warnings\` lists them, \`-- --pack <slug>\` checks one pack):\n`);
  for (const [rule, ws] of [...byRule].sort((a, b) => b[1].length - a[1].length)) console.log(`  ${String(ws.length).padStart(4)}  ${rule.padEnd(26)} e.g. ${ws[0].file}: ${ws[0].message}`);
  console.log('');
}
if (errors.length) {
  console.error(`✗ ${errors.length} problem(s) with lecture scripts:\n`);
  for (const e of errors) console.error(`  ${e.file}: ${e.message} [${e.rule}]`);
  process.exit(1);
}
const total = rows.reduce((n, r) => n + r.seconds, 0);
console.log(`✓ ${rows.length} lecture script(s) meet lesson spec ${spec.version} (${lessonsTotal - missing.length} of ${lessonsTotal} lessons have one; about ${Math.round(total / 60)} minutes of lectures)`);
