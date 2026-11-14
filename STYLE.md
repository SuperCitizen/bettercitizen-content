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

## Teaching moves (benchmarked against Crash Course)

Crash Course's government series are the best-known free civics explainers,
so they are the bar our explanations have to clear. We studied them in
November 2026 ([`docs/benchmarks/crash-course.md`](docs/benchmarks/crash-course.md)).
These moves are worth borrowing at every reading level and every `level`,
alongside the rules above:

- **Title the question the reader already has.** Especially at `intro`:
  "Why does Congress have two chambers?" beats "Bicameralism."
- **Teach a fought-over mechanism on neutral ground first.** Show packing,
  vote-counting, or apportionment in an invented state with placeholder
  parties, where nobody's team is on the line. Then move to real cases.
- **Pair real examples across the aisle.** When a tool has been used or
  abused, give one case from each side (a Republican House bill and a
  Democratic House bill that both died in the Senate). One-sided examples
  read as editorializing even when every fact is right.
- **One concrete analogy per hard idea, then say where it breaks.** "Two
  locks on one door" carries bicameralism; say what the image leaves out.
- **Name the near miss right after the definition.** Judicial review is not
  appellate review; the 60-vote Senate hurdle is a Senate rule, not the
  Constitution. A `QuickCheck` is the natural home for this.
- **Overturn an assumption with the text.** "Where does the Constitution
  grant judicial review? It doesn't." Lead with what the reader expects,
  then show the primary source.
- **End by pointing forward.** Close on the question the next lesson
  answers, so the pack reads as a series, not a stack.

What we deliberately do **not** copy:

- **Verdicts on contested questions.** Their newer episodes say things like
  "the system is broken." We steel-man and stop. Settled empirical findings
  (what courts and audits found) are stated as findings. Value questions
  stay open.
- **Undated, unsourced numbers.** Several 2015 episodes are now wrong
  because the facts moved: seat counts, Supreme Court doctrine. A few were
  wrong to begin with. Everything we state carries a source and a date.
- **Their material.** Characters, running jokes, names, and scripts belong to
  Crash Course. We borrow techniques, never text.

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

## Levels

`pack.yaml` `level:` is one of four rungs. The level sets what the lesson may
*assume*, not how smart it sounds — every rung keeps the same voice and the
same sourcing bar.

- **intro** — assumes nothing: no prior pack, no civics coursework. Every
  term defined at first use. 1,400–2,000 words.
- **intermediate** — assumes the intro civics packs (three branches,
  constitution basics, how laws are made). May open with doctrine or data
  rather than definitions. 1,400–2,400 words. Most packs live here.
- **advanced** — assumes several intermediate packs and comfort reading
  about cases and institutions. Engages the scholarly literature and primary
  doctrine directly; sources lean toward opinions, statutes, and named
  studies over explainers. 1,800–2,600 words.
- **scholar** — seminar-grade capstone. Primary sources are quoted and
  *argued with*, scholarly disagreement is part of the content (not a
  footnote), and the reader is expected to hold competing frameworks at
  once before the lesson adjudicates what it can. 2,200–3,000 words; the
  closing "what this doesn't settle" section carries real weight.

A pack takes one level; pick the rung of its *first* lesson's assumptions.

## Reading levels (editions)

A topic can be written more than once, at different reading levels. Each version is an **edition**: a pack of its own, with its own lessons and assessments, that names its `reading_level:` and the `topic:` it shares with the other editions. The decision record is [`docs/adr/0002-editions-one-topic-three-reading-levels.md`](docs/adr/0002-editions-one-topic-three-reading-levels.md), and the first topic written this way is the three branches: [`packs/three-branches-1`](packs/three-branches-1), [`packs/three-branches-2`](packs/three-branches-2) and [`packs/three-branches`](packs/three-branches).

```yaml
slug: three-branches-1
title: The three branches
topic: three-branches     # the same on every edition of the topic; the pack's own slug when absent
reading_level: 1          # 1 | 2 | 3; 3 when absent
```

**The levels are numbers, and only numbers.** A level describes the text. It never names the reader, their age or their school, because nobody should be told at every turn that they are on the text for younger readers, and because the same level serves a ten-year-old, an adult coming to the subject cold and a learner whose first language is not English. So:

- Every edition of a topic carries the same title. The level is never written into a title, a summary, a heading or the body of a lesson.
- The slug carries it as a bare number: the level 3 edition keeps the topic's slug, and the others add `-1` or `-2`.
- An app shows it as a small mark of one, two or three bars, and says "level 1", "level 2" or "level 3".
- Who each level suits is written here, for authors, and published through the app's API for the adults and partner sites that choose a level for someone. It is not shown to the learner.

`reading_level` is how hard the text is to read. `level` (above) is what the pack assumes the reader already knows. They are separate: a level 1 or level 2 edition is almost always `level: intro`, and the four values of `level` keep their meaning inside level 3.

An edition is written from scratch for its reader. It is never the level 3 text with shorter words. It may have a different number of lessons, and its lessons have their own slugs. Editions are for the core civics spine, not for every pack.

Every edition keeps the same bar for truth and sourcing, the same neutrality rules, the same component catalog and the same figure rules. The rest of this guide describes level 3. What changes for the other two:

### Level 1

Written to be read alone from about age 10 (roughly grades 5 to 8), and with an adult by younger readers.

- **Reading grade about 5 to 7, never above 8. 600–1,000 words a lesson.** Three or four short lessons serve this reader better than two long ones.
- **Open with a scene the reader has lived** (a playground, a classroom, a family rule), then say where the comparison breaks down.
- **Define every new word in the sentence that introduces it.** Name a document or a case only when the lesson needs it. Leave the scholars out.
- **One idea to a paragraph, in sentences of ordinary length** (about twelve words on average). A run of very short sentences reads as talking down, and it is not what a good book for this reader sounds like.
- **Simplify, never falsify.** Prefer "most", "usually" and "almost no" to a clean rule that is not true. Every number still has a source and a date.
- **Per lesson:** two checks (`Checkpoint`, `QuickCheck`), one thing to do (`MatchUp`, `OrderIt`), and one or two figures.
- **Assessment:** three or four multiple-choice questions in plain words, with choices of similar length, and one free response that asks the reader to explain the idea to someone else.
- **Anchor:** the grades 6–8 civics indicators of the C3 Framework for Social Studies State Standards (for the three branches, D2.Civ.4.6-8, the powers and limits of the three branches).

### Level 2

Written to be read alone from about age 14 (roughly grades 9 to 12).

- **Reading grade about 9 to 11, never above 12. 1,200–1,800 words a lesson.**
- **Title the question the reader already has.** Teach a mechanism on invented, neutral ground before the real cases. Pair real examples across party lines. Name the near miss right after each definition. (These are the [teaching moves](#teaching-moves-benchmarked-against-crash-course) above, written for the Foundations track, bettercitizen.ai#52.)
- **Put a document in front of the reader.** Each lesson quotes at least one primary-source passage at length (`<Callout type="sources" title="Read the document: …">`) and asks a question that can only be answered from it. The assessment has at least one question built on a quoted passage.
- **Name a scholar when their argument is the open question**, in a sentence or two, and close on what the lesson does not settle.
- **Per lesson:** two to four checks, at most one simulator, and the figures the argument needs.
- **Assessment:** four multiple-choice questions and one free response that asks for evidence.
- **Anchor:** the AP U.S. Government and Politics course framework.

### Level 3

Written for adults and college students. Everything else in this guide.

### Glossary links in any edition

A `[[term:slug]]` link shows the term's name as the glossary writes it, capital letter included. Place it where that reads as a sentence, which usually means at the start: "[[term:judicial-review]] is the name for that power." A level 1 lesson needs one to three links; the definitions behind them are written at level 3.

### The check

`npm run check:reading` measures each lesson's prose (the Markdown body and the children of components; not frontmatter, tables or component props) and reports its Flesch-Kincaid grade and word count. It fails a level 1 or level 2 lesson outside its band and reports level 3 lessons without failing them. Syllables are counted by rule, so read the grade as a gauge good to about half a grade. As measured in November 2026, the three-branches topic reads at about grade 5 (level 1), 9 (level 2) and 12 (level 3).

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
  `TaxBracketExplorer`, `Path270`, `GuessTheShare`, `Scale`, `Ballot`), always followed by a
  paragraph naming what the reader should have noticed.
- Sequences and structures: `Timeline`, `ProcessFlow`, `OrderIt`, `Flow`. Enumerable
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

**A figure is content, not a picture of content.** Lessons are read on phones, in native apps that render no web view, and by screen readers. A drawing 720 units wide lands in a phone's reading column (about 300 px on the web) at about 40 percent of its size, with its labels near 5 px, and nothing can make it reflow. So a figure is written as structure and text, and every renderer lays it out for the width and text size it has. The decision record is [`docs/adr/0001-figures-are-content.md`](docs/adr/0001-figures-are-content.md).

Ask what the figure really is, then write that:

| The figure is… | Write it as |
| --- | --- |
| A few numbers or single words in rows and columns | A **GFM table**: two columns, or three when every cell is that short |
| Two to four things read against each other, in sentences; or two tracks side by side (two parties' calendars, two lines of cases) | `<Panels>`, one panel per thing or track |
| Boxes and arrows: a process, a lineage, a fork, a merge, two lanes | `<Flow>` |
| A chronology | `<Timeline>` (add `expanded` when it stands in for a figure) |
| Magnitudes, shares, a handful of dated values | `<DataBars>` (`<GuessTheShare>` when the reader should guess first) |
| A series over time, or a curve that is the point | `<Chart>` |
| Places on a spectrum or a two-question plane | `<PositionMap>` |
| A count and the thresholds it crosses | `<Scale>` |
| A ballot | `<Ballot>` |
| A shape none of these draws | A small drawing, by the rules below |

Rules that hold for every form:

- Wrap it in `<Figure caption="…" source="…">`. Introduce it in prose and read its meaning afterward: a figure never speaks for itself.
- **Every number is a claim.** A chart's points are sourced like any sentence. If you cannot cite the values between the ones you know, do not draw a line through them: show the values you have as `DataBars`, or mark the chart `schematic`.
- **Color never carries meaning alone.** Name the kind in words (a `tag`, a title, a legend); a tone only decorates. Never write a caption that points at a color or a line style ("the dashed arrow", "the gold zone"): a list has no dashes, and a screen reader has no gold.
- **No party colors.** Never red for Republicans beside blue for Democrats, in a bar, a dot or a rule. Pick tones that mean nothing.
- **A table has to fit a phone, because it cannot stack its columns.** On bettercitizen.ai a phone's lesson column is about 300 px, which leaves three columns about nine characters each: one ten-letter word and the table is cut off at the edge of the screen. So a table is two columns, or three when every cell is a number or one short word. Sentences, and anything on two tracks, go in `Panels`. Keep a date in one piece with `&nbsp;` (`Jan&nbsp;15`). Many older lesson tables are wider than this. The web now lays those out as one card per row on a phone (`docs/renderer-requests.md`, W2), so give any table a first column that names its row and short column headings: on a phone each heading becomes the label above its cell.
- **Never** use `<script>`, `<style>`, `<iframe>`, event-handler attributes,
  or external image URLs. Interactivity comes from the component catalog
  only. (Content must stay auditable and safe.)
- `~~text~~` is GFM strikethrough. Never use `~~` around numbers to mean
  "approximately" — write "about 56,000" or use a single `~`.

### When a drawing has to stay

Rarely: a picture whose shape is the content and that no component draws (the layer cake and the marble cake). Then:

- **Put no text in it.** Words go in the `Panel` or caption around the drawing, where they stay the reader's size. If a label truly must sit inside, it is at least 14 units tall in a viewBox no wider than 360, so it is still about 13 px in a phone's column.
- **Draw it small and let it sit in a `Panel`.** A viewBox about 300 units wide, `width="100%"`, and `style={{maxWidth: 300, height: 'auto', display: 'block', margin: '0 auto'}}` so it never balloons on a desk. Two drawings to compare are two panels, never one wide canvas.
- **Use the tokens**, so the drawing themes itself: ink `var(--ink, #14130f)`, muted `var(--muted, #6b6457)`, accent `var(--accent, #8a2a1e)`, gold `var(--gold, #b08a3e)`, blue `var(--blue, #2f4d6e)`, green `var(--green, #4a6b3a)`, lines `var(--line, #d9d5c9)`, surface `var(--card, #ffffff)`. Never hard-code `#ffffff` text on a token fill: it washes out on the dark palette.
- **Stay inside the subset every platform draws:** `rect`, `circle`, `ellipse`, `line`, `polyline`, `polygon`, `path`, `g`, `text`, with fill, stroke, opacity, dashes and transforms. No gradients, filters, clip paths, `<use>`, images or style sheets: the native apps draw figures themselves and show only the alt text for anything else.
- Give it `role="img"` and an `aria-label` that says what it shows, and camelCase attributes (MDX is JSX).
- **Lint it:** `npm run check:figures` flags text that overflows the viewBox or sits on a line.

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
