/**
 * Video script check. Run with `npm run check:videos`. Add `-- --all` to list
 * every script, `-- --missing` to list the lessons and packs that have none,
 * and `-- --pack <slug>` to check one pack.
 *
 * A lesson has a short video script beside it, `packs/<pack>/videos/<lesson
 * file>.md`, and a pack has an introduction, `packs/<pack>/videos/_intro.md`
 * (VIDEOS.md). The app's validator is the source of truth for the format.
 * This script is the author's gauge for the standard.
 *
 * It fails a script that:
 *   - names no lesson of its pack (or, for `_intro.md`, not its pack), or is
 *     not named after its lesson's file;
 *   - does not begin with a scene, or holds anything the stage cannot show
 *     or the voice cannot say (links, components, tables, code);
 *   - is outside the length, scene, key-line or point counts;
 *   - has a stop that is not one of the lesson's multiple-choice questions,
 *     a stop in its first scene, the same stop twice, or too many or too few;
 *   - averages longer sentences than its reading level allows.
 * It warns about scenes that show nothing, long key lines and points,
 * brackets, signs written for the eye and phrases the standard rules out.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const showAll = args.includes('--all');
const showMissing = args.includes('--missing');
const onlyPack = args.includes('--pack') ? args[args.indexOf('--pack') + 1] : null;

const GAPS = { breath: 0.9, beat: 1.3, pause: 2.0, long: 3.6, scene: 1.6 };
const CHARS_PER_SECOND = 14.6;

/** What each kind of video allows. */
const KINDS = {
  lesson: { words: { least: 150, low: 180, high: 420, most: 450 }, scenes: [3, 6], keyLines: [2, 5], points: 3, stops: [1, 3] },
  intro: { words: { least: 70, low: 90, high: 220, most: 260 }, scenes: [2, 4], keyLines: [1, 3], points: 2, stops: [0, 0] },
};
/** The average sentence, in words, at most, by reading level. */
const SENTENCE = { 1: 13, 2: 16, 3: 17 };
const KEY_LINE_WORDS = 14;
const POINT_WORDS = 8;
const POINTS_PER_SCENE = 4;

const MARK = /\[(beat|pause|long pause)\]/gi;
const CHECK_LINE = /^\[check\s+([A-Za-z0-9_-]+)\]$/i;
const RULED_OUT = [
  [/\bin this (?:video|lecture|lesson|episode),? we(?:'ll| will)\b/i, '"in this video we will": start in the scene'],
  [/\bwelcome(?: back)?\b/i, '"welcome": start in the scene'],
  [/\bthanks? (?:you )?for (?:watching|listening)\b/i, '"thanks for watching"'],
  [/\b(?:subscribe|like and)\b/i, 'asks for a like or a subscription'],
  [/\bas you can see\b|\bsee (?:above|below)\b|\bshown (?:above|below)\b|\bthe following\b/i, 'a pointer ("as you can see", "above", "below", "the following")'],
  [/\b(?:click(?! restraint)|tap|scroll|write (?:this|that|it) down)\b/i, 'asks the viewer to do something: only a stop does that'],
  [/\b(?:basically|essentially|obviously|of course|as you know)\b/i, 'filler or talking down ("basically", "obviously", "of course")'],
];

function frontmatter(src) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---[^\S\n]*\r?\n?/.exec(src);
  return m ? { yaml: m[1], body: src.slice(m[0].length) } : null;
}
const field = (yaml, name) => yaml.match(new RegExp(`^${name}:\\s*["']?([^"'\\n#]+?)["']?\\s*(?:#.*)?$`, 'm'))?.[1]?.trim() ?? null;
const wordCount = (text) => (text.match(/[A-Za-z][A-Za-z'’]*|\d[\d,.]*/g) || []).length;
const plain = (s) => s.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*\s][^*]*)\*/g, '$1').replace(/\s+/g, ' ').trim();

/** The ids of an assessment's multiple-choice questions. */
function multipleChoiceIds(yaml) {
  const ids = new Set();
  for (const block of yaml.split(/^\s*-\s+id:\s*/m).slice(1)) {
    const id = /^["']?([A-Za-z0-9_-]+)/.exec(block)?.[1];
    if (id && /^\s*kind:\s*["']?multiple-choice/m.test(block)) ids.add(id);
  }
  return ids;
}

/** Read a script's body: its scenes, what is said and shown, the stops, and what is wrong with it. */
function readScript(body) {
  const problems = [];
  const src = body.replace(/\r\n?/g, '\n').replace(/<!--[\s\S]*?-->/g, (m) => m.replace(/[^\n]/g, ''));
  const scenes = []; // { title, line, keyLines, points, said, stops }
  const said = [];
  const keyLines = [];
  const points = [];
  const stops = []; // { id, line, scene }
  let seconds = 0;
  let block = [];
  let blockKey = false;
  let blockLine = 0;
  const scene = () => scenes[scenes.length - 1];
  const needScene = (line, what) => {
    if (scenes.length) return true;
    problems.push({ level: 'error', line, message: `${what} before the first scene: a script begins with a "## scene title"` });
    scenes.push({ title: '', line, keyLines: 0, points: 0, said: 0, stops: 0 });
    return true;
  };

  const flush = () => {
    if (!block.length) return;
    const raw = block.join(' ');
    block = [];
    const line = blockLine;
    for (const m of raw.matchAll(MARK)) {
      const name = m[1].toLowerCase();
      seconds += name === 'beat' ? GAPS.beat : name === 'pause' ? GAPS.pause : GAPS.long;
    }
    const text = plain(raw.replace(MARK, ' '));
    if (!text) return;
    needScene(line, 'narration');
    if (/\[\[/.test(text)) problems.push({ level: 'error', line, message: 'a [[link]] cannot be spoken: write the words' });
    else if (/\[[^\]]*\]\([^)]*\)/.test(text)) problems.push({ level: 'error', line, message: 'a Markdown link cannot be spoken: write the words' });
    else if (/\[[^\]]*\]/.test(text)) problems.push({ level: 'error', line, message: `an unknown mark ${/\[[^\]]*\]/.exec(text)[0]}: the marks are [beat], [pause], [long pause], and [check <id>] on a line of its own` });
    if (/https?:\/\/|\bwww\./i.test(text)) problems.push({ level: 'error', line, message: 'a web address cannot be spoken' });
    if (/<\/?[A-Za-z][^>]*>/.test(text)) problems.push({ level: 'error', line, message: 'a tag or component cannot be spoken' });
    if (/[()]/.test(text.replace(/\b\d+\([a-z]\)(?:\(\d+\))?/gi, ''))) problems.push({ level: 'warning', line, message: 'brackets cannot be heard: say the aside as its own sentence, or leave it out' });
    if (/\b(?:e\.g\.|i\.e\.|etc\.)|[§¶%$]/i.test(text)) problems.push({ level: 'warning', line, message: 'written for the eye (e.g., i.e., etc., §, %, $): say it in words' });
    if (/\d\s*[–—-]\s*\d/.test(text)) problems.push({ level: 'warning', line, message: 'a range or score written with a dash: say "5 to 4", "from 1787 to 1791"' });
    for (const [re, message] of RULED_OUT) if (re.test(text)) problems.push({ level: 'warning', line, message: `ruled out by the standard: ${message}` });
    said.push(text);
    scene().said++;
    if (blockKey) {
      keyLines.push(text);
      scene().keyLines++;
      const n = wordCount(text);
      if (n > KEY_LINE_WORDS) problems.push({ level: n > KEY_LINE_WORDS + 4 ? 'error' : 'warning', line, message: `a key line of ${n} words: ${KEY_LINE_WORDS} or fewer fits the stage` });
      if (scene().keyLines === 2) problems.push({ level: 'warning', line, message: 'a second key line in one scene: one scene, one line to keep' });
    }
    seconds += GAPS.breath + text.length / CHARS_PER_SECOND;
  };

  let fence = false;
  src.split('\n').forEach((rawLine, i) => {
    const line = rawLine.trimEnd();
    const n = i + 1;
    if (/^\s*(```|~~~)/.test(line)) {
      flush();
      if (!fence) problems.push({ level: 'error', line: n, message: 'a code block cannot be shown or spoken' });
      fence = !fence;
      return;
    }
    if (fence) return;
    if (!line.trim()) return flush();
    const heading = /^#{1,6}\s+(.*)$/.exec(line);
    if (heading) {
      flush();
      if (!/^##\s/.test(line)) problems.push({ level: 'error', line: n, message: 'a scene title is written "## title" (two hashes)' });
      const title = plain(heading[1].replace(/#+\s*$/, ''));
      if (wordCount(title) > 8) problems.push({ level: 'warning', line: n, message: `a scene title of ${wordCount(title)} words: eight or fewer fits the stage` });
      scenes.push({ title, line: n, keyLines: 0, points: 0, said: 0, stops: 0 });
      seconds += GAPS.scene;
      return;
    }
    if (/^\s*\|/.test(line)) {
      flush();
      problems.push({ level: 'error', line: n, message: 'a table cannot be shown: say what it shows, and put its numbers in points' });
      return;
    }
    if (/^\s*\d{1,2}[.)]\s+/.test(line)) {
      flush();
      problems.push({ level: 'error', line: n, message: 'a numbered list is not allowed: write points with "- "' });
      return;
    }
    const point = /^\s*[-*+]\s+(.*)$/.exec(line);
    if (point) {
      flush();
      needScene(n, 'a point');
      const text = plain(point[1]);
      if (!text) return;
      if (/\[[^\]]*\]|https?:\/\/|<\/?[A-Za-z]/.test(text)) problems.push({ level: 'error', line: n, message: 'a point is plain words: no marks, links, addresses or tags' });
      const w = wordCount(text);
      if (w > POINT_WORDS) problems.push({ level: w > POINT_WORDS + 4 ? 'error' : 'warning', line: n, message: `a point of ${w} words: ${POINT_WORDS} or fewer` });
      if (scene().said === 0) problems.push({ level: 'warning', line: n, message: 'a point before any narration in its scene: a point labels what was just said' });
      points.push(text);
      scene().points++;
      if (scene().points === POINTS_PER_SCENE + 1) problems.push({ level: 'error', line: n, message: `more than ${POINTS_PER_SCENE} points in one scene` });
      return;
    }
    const check = CHECK_LINE.exec(line.trim());
    if (check) {
      flush();
      needScene(n, 'a stop');
      stops.push({ id: check[1], line: n, scene: scenes.length - 1 });
      scene().stops++;
      return;
    }
    if (/\[check\b/i.test(line)) {
      flush();
      problems.push({ level: 'error', line: n, message: 'a stop is written on a line of its own: [check q2]' });
      return;
    }
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

  for (const s of scenes) {
    if (s.said === 0) problems.push({ level: 'error', line: s.line, message: 'a scene with no narration' });
    else if (s.keyLines === 0 && s.points === 0) problems.push({ level: 'warning', line: s.line, message: 'a scene that shows nothing but its title: give it a key line or a point' });
  }

  const text = said.join('\n');
  const sentences = text
    .replace(/\b(No|Nos|U\.S|v|vs|Mr|Mrs|Ms|Dr|St|Jr|Sr|Sen|Rep|Gov|Gen)\./g, '$1')
    .split(/(?<=[.!?…])["'”’)\]]*\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => /[A-Za-z0-9]/.test(s));
  const words = wordCount(text);
  return {
    problems,
    words,
    perSentence: sentences.length ? words / sentences.length : 0,
    scenes: scenes.length,
    keyLines: keyLines.length,
    points: points.length,
    stops,
    seconds,
  };
}

// --- walk packs ---
const errors = [];
const warnings = [];
const rows = [];
const missing = [];
let wanted = 0;
const packsDir = join(root, 'packs');
for (const pack of readdirSync(packsDir).sort()) {
  if (onlyPack && pack !== onlyPack) continue;
  const manifestPath = join(packsDir, pack, 'pack.yaml');
  const lessonsDir = join(packsDir, pack, 'lessons');
  if (!existsSync(manifestPath) || !existsSync(lessonsDir)) continue;
  const manifest = readFileSync(manifestPath, 'utf8');
  const packSlug = field(manifest, 'slug') ?? pack;
  const level = field(manifest, 'reading_level') ?? '3';
  const sentenceMost = SENTENCE[level] ?? SENTENCE[3];

  /** Lesson slug → { file stem, multiple-choice ids }. */
  const lessons = new Map();
  for (const f of readdirSync(lessonsDir).filter((f) => f.endsWith('.mdx')).sort()) {
    const fm = frontmatter(readFileSync(join(lessonsDir, f), 'utf8'));
    const slug = fm && field(fm.yaml, 'slug');
    if (slug) lessons.set(slug, { stem: f.replace(/\.mdx$/, ''), ids: new Set() });
  }
  // An assessment belongs to the lesson its `lesson:` names, whatever its file is called.
  const assessmentsDir = join(packsDir, pack, 'assessments');
  for (const f of existsSync(assessmentsDir) ? readdirSync(assessmentsDir).filter((f) => f.endsWith('.yaml')) : []) {
    const yaml = readFileSync(join(assessmentsDir, f), 'utf8');
    const lesson = lessons.get(field(yaml, 'lesson'));
    if (lesson) for (const id of multipleChoiceIds(yaml)) lesson.ids.add(id);
  }
  wanted += lessons.size + 1;

  const videosDir = join(packsDir, pack, 'videos');
  const covered = new Set();
  let hasIntro = false;
  const files = existsSync(videosDir) ? readdirSync(videosDir).filter((f) => f.endsWith('.md')).sort() : [];
  for (const f of files) {
    const file = `packs/${pack}/videos/${f}`;
    const err = (m) => errors.push(`${file}: ${m}`);
    const warn = (m) => warnings.push(`${file}: ${m}`);
    const src = readFileSync(join(videosDir, f), 'utf8');
    const fm = frontmatter(src);
    if (!fm) {
      err('no frontmatter: a script opens with ---, schema: bettercitizen.video/v1, lesson: <slug> (or pack: <slug> in _intro.md), ---');
      continue;
    }
    if (field(fm.yaml, 'schema') !== 'bettercitizen.video/v1') err('schema must be bettercitizen.video/v1');
    const isIntro = f === '_intro.md';
    let ids = new Set();
    if (isIntro) {
      hasIntro = true;
      if (field(fm.yaml, 'pack') !== packSlug) err(`an introduction names its pack: pack: ${packSlug}`);
      if (field(fm.yaml, 'lesson')) err('an introduction has pack:, not lesson:');
    } else {
      const slug = field(fm.yaml, 'lesson');
      const lesson = slug ? lessons.get(slug) : null;
      if (!lesson) {
        err(`lesson "${slug}" is not a lesson of this pack (its slugs: ${[...lessons.keys()].join(', ')})`);
        continue;
      }
      if (covered.has(slug)) err(`lesson "${slug}" already has a video script`);
      covered.add(slug);
      if (f !== `${lesson.stem}.md`) err(`a script is named after its lesson's file: ${lesson.stem}.md`);
      ids = lesson.ids;
    }
    const rules = KINDS[isIntro ? 'intro' : 'lesson'];
    const offset = src.split('\n').length - fm.body.split('\n').length;
    const s = readScript(fm.body);
    for (const p of s.problems) (p.level === 'error' ? err : warn)(`${p.line ? `line ${p.line + offset}: ` : ''}${p.message}`);
    if (s.words === 0) {
      err('the script says nothing');
      continue;
    }
    const w = rules.words;
    if (s.words > w.most) err(`${s.words} words: ${w.most} at most. Keep the one idea and cut the rest`);
    else if (s.words > w.high) warn(`${s.words} words: aim for ${w.high} or fewer`);
    if (s.words < w.least) err(`${s.words} words: ${w.least} at least`);
    else if (s.words < w.low) warn(`${s.words} words: aim for ${w.low} or more`);
    if (s.scenes < rules.scenes[0] || s.scenes > rules.scenes[1]) err(`${s.scenes} scene(s): ${rules.scenes[0]} to ${rules.scenes[1]}`);
    if (s.keyLines < rules.keyLines[0] || s.keyLines > rules.keyLines[1]) err(`${s.keyLines} key line(s): ${rules.keyLines[0]} to ${rules.keyLines[1]}`);
    if (s.points < rules.points) err(`${s.points} point(s): ${rules.points} at least`);
    if (s.perSentence > sentenceMost) err(`sentences average ${s.perSentence.toFixed(1)} words: ${sentenceMost} at most at level ${level}`);

    const seen = new Set();
    for (const stop of s.stops) {
      const at = `line ${stop.line + offset}: `;
      if (isIntro) err(`${at}an introduction has no stops`);
      else if (!ids.has(stop.id)) err(`${at}[check ${stop.id}] is not a multiple-choice question of this lesson (its ids: ${[...ids].join(', ') || 'none'})`);
      else if (seen.has(stop.id)) err(`${at}[check ${stop.id}] is used twice`);
      else if (stop.scene === 0) err(`${at}a stop in the first scene: the video has taught nothing yet`);
      seen.add(stop.id);
    }
    if (!isIntro) {
      const [least, most] = ids.size === 0 ? [0, 0] : rules.stops;
      if (s.stops.length < least || s.stops.length > most) err(`${s.stops.length} stop(s): ${least === most ? least : `${least} to ${most}`} for this lesson`);
    }
    rows.push({ file, level, ...s });
  }
  for (const [, l] of lessons) if (![...covered].some((slug) => lessons.get(slug) === l)) missing.push(`packs/${pack}/videos/${l.stem}.md`);
  if (!hasIntro) missing.push(`packs/${pack}/videos/_intro.md`);
}

const mmss = (s) => `${Math.floor(Math.round(s) / 60)}:${String(Math.round(s) % 60).padStart(2, '0')}`;
if (showAll && rows.length) {
  console.log(' level  words  w/sent  scenes  key  points  stops   runs   script');
  for (const r of rows) {
    console.log(
      `   ${r.level}   ${String(r.words).padStart(5)}  ${r.perSentence.toFixed(1).padStart(5)}  ${String(r.scenes).padStart(6)}  ${String(r.keyLines).padStart(3)}  ${String(r.points).padStart(6)}  ${String(r.stops.length).padStart(5)}  ${mmss(r.seconds).padStart(5)}   ${r.file}`,
    );
  }
  console.log('');
}
if (showMissing && missing.length) {
  console.log(`No video script yet (${missing.length}):`);
  for (const m of missing) console.log(`  ${m}`);
  console.log('');
}
if (warnings.length) {
  console.log(`⚠ ${warnings.length} warning(s):\n`);
  for (const w of warnings) console.log('  ' + w);
  console.log('');
}
if (errors.length) {
  console.error(`✗ ${errors.length} problem(s) with video scripts:\n`);
  for (const e of errors) console.error('  ' + e);
  process.exit(1);
}
const total = rows.reduce((n, r) => n + r.seconds, 0);
console.log(`✓ ${rows.length} video script(s) meet the standard (${rows.length} of ${wanted} written; about ${Math.round(total / 60)} minutes of video)`);
