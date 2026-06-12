# BetterCitizen lesson authoring standard

This guide governs every lesson in `packs/`. The bar: a chapter a college senior
in a political science seminar would *want* to read — rigorous enough to cite,
written like a book, never like a slide deck.

The canonical example of every convention below:
[`packs/electoral-college/lessons/01-how-it-works.mdx`](packs/electoral-college/lessons/01-how-it-works.mdx).
The interactive-component catalog lives in [`COMPONENTS.md`](COMPONENTS.md) —
read both before authoring.

## Voice

- **Write narrative, not notes.** Bullets are for genuinely enumerable things
  (a statute's elements, a table of methods). Everything else is prose with
  connective tissue: *because*, *which is why*, *the catch is*.
- **Open cold.** Start each lesson with a hook — an anecdote, a number that
  shouldn't be true, a scene, a puzzle — before any definition. Two to five
  sentences, then earn the abstraction.
- **Be concrete before abstract.** Name the year, the state, the case, the
  dollar figure. "States have plenary authority" lands only after South
  Carolina's legislature picking electors until 1860.
- **Respect the reader's intelligence; assume zero prior coursework.** Define
  terms on first use, then use them without apology.
- **Steel-man on contested ground.** Contested packs present each position as
  its smartest advocate would. No editorializing, no "some say." Attribute
  positions to real schools of thought and real scholars.
- **The scholar's lens.** Where the political-science literature has something
  load-bearing to say (Madison, Hamilton, Dahl, Downs, Duverger, Olson, Key,
  Mayhew, Riker, Ostrom, Fenno, Schattschneider…), bring it in by name and
  work, in one or two paragraphs — a seminar aside, not a literature review.
  Only cite works you can verify exist.
- **Keep the closing discipline.** Lessons end by stating what they did *not*
  settle and where the live argument continues (existing "What this lesson is
  not" convention). Keep it.

## Structure of a lesson body

1. `# Title` (H1, matches frontmatter title)
2. Cold-open hook (no heading)
3. 3–6 `##` sections, each a real argument or mechanism — not a topic label
4. **Checkpoints woven throughout** (see below): one after roughly every major
   section, 2–4 per lesson. Never stack two back-to-back; never put one at the
   very end (that's the assessment's job).
5. At least one **figure or table** where it genuinely teaches (see below)
6. Closing section: what's settled here / what's still contested, pointing to
   the next lesson where applicable

Target length: **1,400–2,400 words** for regular lessons; **900–1,800** for
book chapters. Expand with substance (mechanisms, history, evidence, named
scholarship), never padding.

## Interactive components (MDX)

Lessons are **MDX**: markdown plus a fixed catalog of interactive components
documented in [`COMPONENTS.md`](COMPONENTS.md). Lesson files never write
`import`/`export` — the app supplies the catalog to its MDX renderer, and the
validator rejects any JSX tag outside it.

The workhorse is the predict-then-reveal checkpoint:

```mdx
<Checkpoint question="Your state has 8 House seats. How many electors does it get — and who decides how they're chosen?">
  **Ten** — eight (House) plus two (Senate). And the *state legislature*
  decides the manner of choosing them (Art. II §1), which is why
  winner-take-all is a state-law choice, not a constitutional command.
</Checkpoint>
```

Rules:
- The question must be answerable from what the reader just read, but should
  require *applying* it (a scenario, a discrimination between near-misses),
  not parroting it. The answer always explains *why*, in 1–4 sentences.
- `<QuickCheck>` (instant-feedback multiple choice) is the checkpoint's
  sibling — use it when the teaching move is discriminating between
  near-misses. Together: 2–4 per lesson, never back-to-back, never at the
  very end (that's the assessment's job).
- At most **one simulator** per lesson (`RankedChoiceSim`, `GerrymanderLab`,
  `TaxBracketExplorer`, `Path270`, `GuessTheShare`), always followed by a
  paragraph naming what the reader should have noticed.
- Sequences and structures: `Timeline`, `ProcessFlow`, `OrderIt`. Enumerable
  drill: `Flashcards`, `MatchUp`. Contested positions: `PerspectiveTabs`.
- For a purely Socratic pause (no answer revealed), use a markdown blockquote
  instead, sparingly — at most one per lesson:

  ```markdown
  > **Think it through:** If electors were abolished tomorrow but the 270-vote
  > threshold logic kept its state-by-state shape, what would actually change?
  ```

MDX syntax cautions (the compile check will catch violations): `className=`
not `class=`, style **objects** not style strings, `{/* … */}` not
`<!-- … -->`, escape literal `{` and `<` in prose.

## Figures, diagrams, and tables

- **GFM tables** for anything comparative (methods, cases, thresholds). Always
  introduce a table in prose and read its meaning afterward — a table never
  speaks for itself.
- **Inline SVG** for structure, flows, timelines, and proportions. The SVG is
  inline in the app's DOM, so use the app's CSS variables with fallbacks —
  figures then theme themselves:
  - ink/text: `var(--ink, #14130f)`; muted: `var(--muted, #6b6457)`
  - accent (burgundy): `var(--accent, #8a2a1e)`; gold: `var(--gold, #b08a3e)`
  - blue: `var(--blue, #2f4d6e)`; green: `var(--green, #4a6b3a)`
  - rules/lines: `var(--line, #d9d5c9)`; surface: `var(--card, #ffffff)`
- Wrap every SVG in `<Figure caption="…">` (see COMPONENTS.md); give the SVG
  `role="img"`, an `aria-label`, `width="100%"`, and a `viewBox`. Remember
  MDX is JSX: style **objects**, not style strings. Text inside SVG:
  `font-family="Georgia, serif"` or the sans stack, size ≥ 12.
- Prefer `<DataBars>` over hand-drawn SVG when the figure is really just
  labeled magnitudes; prefer `<GuessTheShare>` when the magnitudes are
  surprising enough that the reader should guess first.
- Keep diagrams *diagrammatic*: 1 idea per figure, ≤ ~40 elements, no
  decorative clutter. If it needs a legend of more than 4 items, split it.
- **Never** use `<script>`, `<style>`, `<iframe>`, event-handler attributes,
  or external image URLs. Interactivity comes from the component catalog
  only. (Content must stay auditable and safe.)
- `~~text~~` is GFM strikethrough. Never use `~~` around numbers to mean
  "approximately" — write "about 56,000" or use a single `~`.

### Hand-drawn SVG layout (the part generators get wrong)

The two failure modes that make a figure look broken are text running past
the viewBox edge and labels sitting on top of connector lines. The rules
that prevent them:

- **Compose in row lanes.** Source box(es) in one column, destination boxes
  in another, one row per relationship. Connectors are **orthogonal**
  (horizontal/vertical elbows, not bezier fans), and each connector's label
  sits in its own clear band *above its own horizontal run* — never on,
  under, or across a line. Exemplar: the money-flow figure in
  [`money-in-politics-101/01`](packs/money-in-politics-101/lessons/01-the-flow-of-political-money.mdx).
- **Do the width arithmetic.** Estimated text width ≈ chars × fontSize ×
  0.56. Every label must fit its run with ≥ 20px to spare inside the
  viewBox; `textAnchor="middle"` text must fit its box. If it doesn't fit:
  shorten it, wrap it to a second `<text>` line, or re-anchor it — widen the
  viewBox only as a last resort.
- **Captions don't live in the canvas.** Multi-sentence explanations and
  source notes go in `<Figure caption="…" source="…">`, not in 11px `<text>`
  crammed along the bottom of the SVG. In-SVG text is for labels.
- **Keep ≥ 24px vertical clearance** between any label band and any line
  that crosses the same x-range.
- **Lint it:** `npm run check:figures` flags likely overflow and
  label-path collisions (estimates, not proof — but a flag usually means a
  real problem).

## Callouts

Markdown blockquotes with a bold label, already styled by the app:

```markdown
> **Why this matters:** The contingent-election rule is one state one vote —
> Wyoming's delegation counts exactly as much as California's.
```

Labels in use: **Why this matters**, **Common misconception**, **Think it
through**, **The scholar's lens** (when short; use a `##`-less paragraph or
blockquote), **In the primary sources**. The `<Callout type="…">` component
renders the same labels with stronger styling — either form is acceptable;
use the component when the callout carries structure (lists, multiple
paragraphs).

## Truth and sourcing (non-negotiable)

- Every number, date, case holding, statute citation, and quotation must be
  verified against a primary or authoritative source before it ships. If you
  cannot verify it, soften it or cut it.
- Prefer durable phrasings for moving targets: "as of mid-2026", "in the
  2025–26 cycle", with the source carrying the date.
- `sources:` frontmatter is required (≥ 1) and must genuinely back the body.
  Keep existing sources; add what the expansion actually uses. Allowed types:
  `paper`, `book`, `website`, `video`, `audio`, `pdf`, `court-opinion`,
  `statute`, `crs-report`.
- **Never invent a URL, DOI, or page number.** Only cite URLs verified to
  exist or from stable official patterns (constitution.congress.gov,
  congress.gov, supremecourt.gov, archives.gov, fec.gov, census.gov, cbo.gov,
  crsreports.congress.gov, oyez.org, justia.com, ipcc.ch, …).
- Quotations are exact and attributed (speaker, work, year). Paraphrase if
  the exact wording can't be confirmed.

## Cross-references and concepts

- `[[term:slug]]`, `[[ideology:slug]]`, `[[issue:slug]]`, `[[org:slug]]`,
  `[[person:slug]]` link into the knowledge base and are validated at seed
  time — **the slug must exist** (`ls glossary/`, `ls ideologies/`, etc.).
  Use 3–8 per lesson, on first meaningful mention only.
- `concepts:` frontmatter: prefer existing glossary slugs; don't invent new
  concept slugs casually.

## Schema constraints (the validator enforces these)

- Lesson files are **`.mdx`**, listed by exact filename in `pack.yaml`
  `lessons:`. Lesson bodies may not contain `import` or `export` statements,
  and every JSX tag must come from the catalog in `COMPONENTS.md` — the
  validator and the MDX compile check enforce both. (See `MIGRATION.md` for
  the app-side loader/renderer changes this format requires.)
- Lesson frontmatter: `schema: bettercitizen.lesson/v1`, `slug` (kebab-case,
  must keep its existing value — assessments and seeds key off it), `kind`
  (`socratic` | `media` | `interactive` | `reading`), `title`, `objectives`,
  `concepts`, `sources` (≥1), `duration_min`; packs with `contested: true`
  require `perspectives:` (`- name: …`) on every lesson.
- Assessments: `assessments/<lesson-slug>.yaml` with
  `schema: bettercitizen.assessment/v1`, `lesson: <lesson-slug>`, and
  `questions:` of kind `multiple-choice` (≥2 choices, `correct_choice_id`,
  `explanation`) or `free-response` (optional `socratic_seed`).
- After editing a pack, bump its `pack.yaml` `version` minor (1.0.0 → 1.1.0).
- Validate before opening a PR:
  `cd ../bettercitizen.ai && CONTENT_LOCAL_PATH=../bettercitizen-content pnpm validate-content`

## Assessments (end-of-lesson)

Every regular-pack lesson ships an assessment file: 3–5 questions — mostly
multiple-choice plus one closing `free-response` with a `socratic_seed`.
Checkpoints in the body teach; the assessment *discriminates*:

- Distractors are plausible near-misses (the classic confusions), never jokes.
- Every multiple-choice question carries an `explanation` that teaches the
  distinction, not just names the right letter.
- At least one question should require transfer to a novel scenario.
- Don't reuse a checkpoint question verbatim.

## Book packs (`*-book`)

The two book packs (*Rank the Vote*, *Score the Vote*) are ingested advocacy
books and stay `contested: true`, `official: false`. Editorial treatment:

- Preserve the author's first-person advocacy voice — the contested banner and
  `perspectives:` do the balancing; the prose should not be neutered.
- Expand stub chapters into full chapters (900–1,800 words) in that voice.
- Replace the "sole source: the book itself" pattern: keep the book citation
  and **add the primary sources each chapter's claims actually rest on**
  (election results, statutes, court opinions, named studies) — fact-checked
  like everything else. Remove the `Editorial note (M4 ingestion)` block once
  a chapter has real sources.
- Checkpoints and figures apply to book chapters too.
