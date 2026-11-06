/**
 * Builds meta/concept-index.json — the derived relationship layer linking
 * PACKS, LESSONS, and GLOSSARY TERMS. Sources, in priority order:
 *
 *   teaches:   (lesson frontmatter, glossary slugs)  — AUTHORITATIVE "this lesson
 *              teaches term T". Complete + glossary-resolved. Falls back to the
 *              lesson's [[term:]] links when a lesson has no teaches: field yet.
 *   [[term:]]  (inline links in the body)             — what the lesson REFERENCES.
 *   concepts:  (lesson frontmatter)                   — loose TOPIC tags, a separate
 *              namespace from the glossary (kept under `topics`, not merged in).
 *
 * Derived per pack:
 *   teaches    = ∪ lessons' effective-teaches (explicit teaches:, else links)
 *   references = ∪ lessons' [[term:]] links
 *   assumes    = references − teaches, attributed to the pack(s) that teach each term
 *                (referenced-but-not-taught → prerequisite signal)
 *   topics     = ∪ lessons' concepts:  (informational; not glossary-resolved)
 *
 * Powers:  pack "key terms" preview (teaches) · per-pack flashcards (teaches +
 * glossary) · glossary→lesson backlinks (terms[t].taught_in) · prerequisite graph
 * (prerequisites[]).
 *
 * Usage:
 *   node scripts/build-concept-index.mjs           # write meta/concept-index.json
 *   node scripts/build-concept-index.mjs --check   # CI gate (see below)
 *
 * --check fails if (a) the committed index is stale [lockfile pattern, like
 * check-mdx's pack↔lesson cross-check] or (b) any explicit teaches: slug does
 * not resolve to a glossary file. It does NOT fail on dangling links/topics or
 * orphan terms — those are reported under `coverage` for cleanup, and the app's
 * seed validator owns slug resolution for the looser namespaces. Output is fully
 * deterministic (sorted keys + arrays, no timestamps).
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(root, 'meta', 'concept-index.json');
const uniqSort = (xs) => [...new Set(xs)].sort();

function splitFrontmatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n?/);
  return m ? { fm: m[1], body: src.slice(m[0].length) } : { fm: '', body: src };
}
const stripCode = (b) => b.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '');

function scalar(text, key) {
  const m = text.match(new RegExp(`^${key}:\\s*(.+?)\\s*$`, 'm'));
  return m ? m[1].replace(/^['"]|['"]$/g, '').trim() : null;
}
function listField(fm, key) {
  const lines = fm.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(new RegExp(`^${key}:\\s*(.*)$`));
    if (!m) continue;
    const inline = m[1].trim();
    if (inline.startsWith('[')) {
      return inline.replace(/^\[|\]$/g, '').split(',')
        .map((s) => s.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
    }
    const out = [];
    for (let j = i + 1; j < lines.length; j++) {
      const item = lines[j].match(/^\s+-\s+(.+?)\s*$/);
      if (item) { out.push(item[1].replace(/^['"]|['"]$/g, '').trim()); continue; }
      if (/^\S/.test(lines[j])) break;
    }
    return out;
  }
  return [];
}
const termLinks = (body) => [...stripCode(body).matchAll(/\[\[term:([a-z0-9-]+)\]\]/g)].map((m) => m[1]);

const glossarySlugs = new Set(
  readdirSync(join(root, 'glossary')).filter((f) => f.endsWith('.yaml')).map((f) => f.slice(0, -5)),
);

// --- walk packs/lessons ---
const packsDir = join(root, 'packs');
const packs = {};
let lessonCount = 0;

for (const pack of readdirSync(packsDir).sort()) {
  const py = join(packsDir, pack, 'pack.yaml');
  if (!existsSync(py)) continue;
  const yaml = readFileSync(py, 'utf8');
  const slug = scalar(yaml, 'slug') || pack;
  const order = [...yaml.matchAll(/^\s*-\s+([\w.-]+\.mdx?)\s*$/gm)].map((m) => m[1]);

  const lessonsDir = join(packsDir, pack, 'lessons');
  const files = (existsSync(lessonsDir) ? readdirSync(lessonsDir) : []).filter((f) => /\.mdx$/.test(f));
  files.sort((a, b) => order.indexOf(a) - order.indexOf(b));

  const lessons = [];
  for (const f of files) {
    const { fm, body } = splitFrontmatter(readFileSync(join(lessonsDir, f), 'utf8'));
    lessonCount++;
    const teaches = uniqSort(listField(fm, 'teaches'));
    const links = uniqSort(termLinks(body));
    lessons.push({
      slug: scalar(fm, 'slug') || f.replace(/\.mdx$/, ''),
      title: scalar(fm, 'title') || '',
      teaches,                              // explicit (may be empty)
      effective: teaches.length ? teaches : links, // authoritative teaches signal
      links,
      concepts: uniqSort(listField(fm, 'concepts')),
      teaches_source: teaches.length ? 'explicit' : 'links',
    });
  }

  const teaches = uniqSort(lessons.flatMap((l) => l.effective));
  const references = uniqSort(lessons.flatMap((l) => l.links));
  const sources = new Set(lessons.map((l) => l.teaches_source));
  packs[slug] = {
    title: scalar(yaml, 'title') || '',
    level: scalar(yaml, 'level') || '',
    teaches_source: sources.size === 1 ? [...sources][0] : 'mixed',
    teaches,
    references,
    topics: uniqSort(lessons.flatMap((l) => l.concepts)),
    lessons,
  };
}

// --- reverse index ---
const terms = {};
const ensure = (t) => (terms[t] ||= { glossary: glossarySlugs.has(t), packs: [], taught_in: [], referenced_in: [] });
for (const [slug, p] of Object.entries(packs)) {
  for (const t of p.teaches) ensure(t).packs.push(slug);
  for (const l of p.lessons) {
    for (const t of l.effective) ensure(t).taught_in.push({ pack: slug, lesson: l.slug });
    for (const t of l.links) ensure(t).referenced_in.push({ pack: slug, lesson: l.slug });
  }
}
const byKey = (a, b) => (a.pack + a.lesson).localeCompare(b.pack + b.lesson);
for (const t of Object.values(terms)) {
  t.packs = uniqSort(t.packs);
  t.taught_in.sort(byKey);
  t.referenced_in.sort(byKey);
}

// --- prerequisites: referenced but not taught here, taught by another pack ---
const teachesBy = {};
for (const [slug, p] of Object.entries(packs)) for (const t of p.teaches) (teachesBy[t] ||= []).push(slug);

const prerequisites = [];
for (const [slug, p] of Object.entries(packs)) {
  const assumed = p.references.filter((t) => !p.teaches.includes(t));
  const edges = {};
  p.assumes = assumed.map((t) => {
    const by = uniqSort((teachesBy[t] || []).filter((q) => q !== slug));
    for (const q of by) (edges[q] ||= new Set()).add(t);
    return { term: t, taught_by: by };
  }).sort((a, b) => a.term.localeCompare(b.term));
  for (const q of Object.keys(edges).sort()) prerequisites.push({ pack: slug, depends_on: q, via: uniqSort([...edges[q]]) });
}
prerequisites.sort((a, b) => (a.pack + a.depends_on).localeCompare(b.pack + b.depends_on));

// --- coverage (informational, except dangling_teaches which gates --check) ---
const danglingTeaches = [], danglingLinks = [], danglingTopics = [];
for (const [slug, p] of Object.entries(packs)) for (const l of p.lessons) {
  for (const t of l.teaches) if (!glossarySlugs.has(t)) danglingTeaches.push({ pack: slug, lesson: l.slug, term: t });
  for (const t of l.links) if (!glossarySlugs.has(t)) danglingLinks.push({ pack: slug, lesson: l.slug, term: t });
  for (const t of l.concepts) if (!glossarySlugs.has(t)) danglingTopics.push({ pack: slug, lesson: l.slug, term: t });
}
const referenced = new Set(Object.keys(terms));
const orphanGlossary = [...glossarySlugs].filter((t) => !referenced.has(t)).sort();
const assumedUncovered = uniqSort(
  Object.values(packs).flatMap((p) => (p.assumes || []).filter((a) => !a.taught_by.length).map((a) => a.term)),
);

const ordered = {
  _note: 'GENERATED by scripts/build-concept-index.mjs — do not edit by hand. Run `npm run build:concepts`.',
  stats: {
    packs: Object.keys(packs).length,
    lessons: lessonCount,
    glossary_terms: glossarySlugs.size,
    terms_referenced: referenced.size,
    packs_with_explicit_teaches: Object.values(packs).filter((p) => p.teaches_source !== 'links').length,
    prerequisite_edges: prerequisites.length,
    dangling_teaches: danglingTeaches.length,
    dangling_term_links: danglingLinks.length,
    dangling_topic_tags: danglingTopics.length,
    orphan_glossary_terms: orphanGlossary.length,
    assumed_but_uncovered: assumedUncovered.length,
  },
  packs,
  terms,
  prerequisites,
  coverage: {
    dangling_teaches: danglingTeaches,
    dangling_term_links: danglingLinks,
    dangling_topic_tags: danglingTopics,
    orphan_glossary_terms: orphanGlossary,
    assumed_but_uncovered: assumedUncovered,
  },
};

function stable(v) {
  if (Array.isArray(v)) return v.map(stable);
  if (v && typeof v === 'object') return Object.fromEntries(Object.keys(v).sort().map((k) => [k, stable(v[k])]));
  return v;
}
const finalObj = {
  _note: ordered._note,
  stats: stable(ordered.stats),
  packs: stable(ordered.packs),
  terms: stable(ordered.terms),
  prerequisites: ordered.prerequisites.map(stable),
  coverage: stable(ordered.coverage),
};
const json = JSON.stringify(finalObj, null, 2) + '\n';

if (process.argv.includes('--check')) {
  let bad = false;
  const current = existsSync(OUT) ? readFileSync(OUT, 'utf8') : '';
  if (current !== json) {
    console.error('✗ meta/concept-index.json is stale — run `npm run build:concepts` and commit it.');
    bad = true;
  }
  if (danglingTeaches.length) {
    console.error(`✗ ${danglingTeaches.length} teaches: slug(s) have no glossary file:`);
    for (const d of danglingTeaches) console.error(`    ${d.pack}/${d.lesson}: ${d.term}`);
    bad = true;
  }
  if (bad) process.exit(1);
  console.log('✓ concept-index up to date; all teaches: slugs resolve');
} else {
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, json);
  const s = finalObj.stats;
  console.log(`✓ wrote meta/concept-index.json — ${s.packs} packs (${s.packs_with_explicit_teaches} with explicit teaches:), ${s.lessons} lessons, ${s.terms_referenced} terms, ${s.prerequisite_edges} prereq edges`);
  console.log(`  coverage: ${s.dangling_teaches} dangling teaches, ${s.dangling_term_links} dangling links, ${s.dangling_topic_tags} dangling topic-tags, ${s.orphan_glossary_terms} orphan terms`);
}
