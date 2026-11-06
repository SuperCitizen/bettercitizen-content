# Touchstones — authoring standard & seed prompt

**One text, two audiences.** A generation session reads this document as its
instructions; a reviewer reads the same document as the checklist to grade the
PR against. That is deliberate: the failure mode being designed against is
drift — a seed prompt that permits what the review checklist rejects. There is
no second copy to fall out of sync. If you are an agent authoring Touchstones,
every checklist box below is an instruction addressed to you. If you are the
reviewer, the same boxes are what you tick.

Two files are load-bearing beside this one:

- **The schema is the mechanized truth.** `validate-content` in the
  BetterCitizen app repo ([SuperCitizen/bettercitizen.ai],
  `src/content-schema/touchstone.ts` + `src/feed-validator/validate-touchstones.ts`)
  enforces everything mechanizable here. This document must never permit what
  the validator rejects; where they disagree, the validator wins and this
  document gets fixed in the same PR.
- **[`meta/banned-sources.yaml`](./meta/banned-sources.yaml) is the
  banned-source list**, as data, read by the validator *and* by you. Do not
  restate it, quote it, or trim it — read it and obey it.

[SuperCitizen/bettercitizen.ai]: https://github.com/SuperCitizen/bettercitizen.ai

## What a Touchstone is

The canonical, reviewed, citable unit of short memorable material — the corpus
behind the app's Library (`/touchstones`) and The Circuit's recall training.
Four **kinds**:

| kind | what it is | the recalled thing |
| --- | --- | --- |
| `saying` | a proverb, idiom, or maxim — traditional, no known author | its wording |
| `quote` | an attributed quotation | its wording, its speaker, or (when contested) the attribution verdict |
| `fact` | a checkable claim with a discrete answer | the value |
| `number` | a statistic from an official source | the value |

**Final vocabulary, from day one.** The recalled text is the **`line`**. The
in-house writing under it is the **`explanation`**. A number's three dates are
**`covers`** (the span the figure describes), **`published`** (which
vintage/release of the estimate), and **`recheck_by`** (the refresh horizon).
An authored prompt override is a **`cue`**/**`ask`** pair. Never use the
retired names — no "Key line", no "gloss", no "text", no "review_by", no
"reference_period", no "as_of", no "stimulus".

## Files & layout

- One YAML file per item: `touchstones/<kind>/<slug>.yaml`, kinds exactly
  `saying | quote | fact | number`.
- [ ] `kind:` is written in the file **and** matches the parent directory — a
      misfiled item is a hard error.
- [ ] `slug` is kebab-case and unique across the **whole corpus** (all four
      kinds share the `/touchstones/<slug>` namespace).

## Field reference

Field names and shapes below mirror `TouchstoneSchema` exactly. When in doubt,
the schema file is the arbiter.

**Shared (every kind):**

| Field | Required | Notes |
| --- | --- | --- |
| `slug`, `kind` | yes | See layout rules above. |
| `line` | yes | The thing recalled. Exact wording rules per kind, below. |
| `explanation` | yes | In-house writing: what it means, why it lands. Shown under every answer. Never copied or closely paraphrased from any source — this is the original layer the repo's CC BY-SA license actually covers. |
| `sources` | yes, ≥1 | `{ type, citation, url?, ref? }`. The field for the source's name is **`citation:`** — there is no `title:` field; a `title:` key will fail validation. Types: `paper`, `book`, `website`, `video`, `audio`, `pdf`, `court-opinion`, `statute`, `crs-report`. Which types satisfy which kind: see the per-kind bars. |
| `related` | no | `{ type, slug }[]`, type ∈ `lesson \| person \| issue \| ideology \| organization \| term` (`term` = glossary). Every slug must resolve — a dangling ref is an error. Optional for every kind, sayings included: relationships are enrichment, never a gate. |
| `tags` | no | Free strings, lowercase. |
| `partisan_lean`, `ideology_tags` | no | Same treatment as `organizations/`: `partisan_lean` ∈ `left \| center-left \| center \| center-right \| right \| none \| mixed`; `ideology_tags` are slugs into `ideologies/`. See "Balance tagging". |
| `media_refs` | no | `{ kind: video\|audio\|website, url, title, start_seconds? }[]`. Link-outs only, never embeds — and never a *source* (sources cite; media_refs point at context, e.g. the moment in the speech). |
| `prompt` | no | Authored `{ cue, ask }` override of the app's per-kind template. `cue` is what the learner is shown — write `cue: null` (key present, value null) when showing anything would spoil the card. The `ask` must state the shape of the answer it wants ("Name the speaker", "To the nearest whole percent, …"). Do not hand-write prompts routinely — the app templates them; override only when the template would misfire. |
| `level` | no | `foundational \| intermediate \| advanced \| expert`. Editorial reading level — not spaced-repetition difficulty. |
| `contributed_by` | no | Self-chosen display name of a nominating learner. ≤40 characters, no `@`, no `://`, no markup (`<`, `>`, `[`, `]`, backticks). Never resolved against `persons/`. Only present when a real nomination exists — seed batches generally have none. |

**Per kind:**

| kind | Fields |
| --- | --- |
| `saying` | `origin_note` (**required** — traditional/anonymous provenance, earliest attestation you found), `usage_note` (optional — when and how a careful speaker deploys it). |
| `quote` | `speaker` (**required** — the *claimed* speaker, free text), `speaker_slug` (optional, must resolve into `persons/` — see the living-author rule), `occasion`, `date` (free strings), `attribution_status` (**required**: `verified \| disputed \| misattributed`), `actual_speaker` (where known), `correction_note` (**required when `misattributed`**), `attribution_checks` (string array, values `wikiquote`, `quote-investigator`). |
| `fact` | `claim` (**required** — what question this answers), `value` (**required** — the discrete answer). |
| `number` | `value` (**required**, a *string*: `"60"`, `"37%"`, `"$1.2T"`), `unit`, `subject`, `covers` (**all required**), `published` + `recheck_by` (**required**, real ISO dates `YYYY-MM-DD`), `series_id` (optional, strongly preferred), `tolerance` (`exact \| measured`). |

## Sourcing bars, per kind

Every Touchstone owns its own `sources:` — at least one entry must clear the
kind's bar. First, the rules that apply to all four kinds:

- [ ] **No banned sources.** No URL in `sources:` may point at any domain in
      [`meta/banned-sources.yaml`](./meta/banned-sources.yaml) — the validator
      hard-errors on a match, subdomains included. If your research trail runs
      through an aggregator, the trail is not done: find the archive the
      aggregator should have cited.
- [ ] **Wikipedia is never terminal.** It may lead you to the primary source;
      it may not *be* the load-bearing source for anything.
- [ ] **No news sourcing where an official source exists.** A news story about
      the statute is not the statute.

### Sayings

A saying is sourced by its **origin**, not by a citation that verifies its
truth — proverbs are not true or false, they are attested.

- [ ] ≥1 source of type `book`, `paper`, or `website` that is a **reference
      work or scholarly discussion** (Oxford Dictionary of Proverbs, Safire's
      Political Dictionary, a dialect/folklore journal) — not an inspiration
      blog, not an anthology mirrored wholesale (compilation copyright: never
      reproduce any single anthology's *selection*).
- [ ] `origin_note` states traditional status: anonymous or pre-20th-century,
      with the earliest attestation you actually found.
- [ ] **Named author or modern coinage ⇒ this is not a saying.** Reclassify it
      as a `quote` (with the full quote bar below) or drop it. This rule is
      checklist-only — sayings have no `speaker` field for the validator to
      inspect — which is exactly why it is your job.
- [ ] No trademarked slogans; glosses and explanations written in-house.

### Facts

- [ ] ≥1 **official/primary** source: `statute`, `court-opinion`,
      `crs-report`, `paper`, `pdf` — or `website` **only when the URL is a
      .gov host** (the validator checks the hostname; a non-.gov `website`
      does not clear this bar no matter how good it is).
- [ ] The `line` restates the fact **in our own words**, directly checkable
      against the cited source.
- [ ] `claim` names the question; `value` is the discrete answer a learner
      can be graded on.
- [ ] **Contested claims are never facts.** See the contested-claims rule
      below before you write any fact.

### Numbers

Everything in the facts bar, plus the three-dates discipline:

- [ ] Source is an **official statistical agency or body with a stable
      identifier** where one exists — FRED/BLS series ID, CRS/GAO report code,
      Census table — recorded in `series_id`. Stable IDs are what make
      staleness scriptable; prefer them over bare URLs.
- [ ] `covers` says what span the figure describes ("Standing rule, in force
      since 1975"; "Calendar year 2024"; "2020 apportionment").
- [ ] `published` is the vintage/release date of the estimate you used —
      agencies revise (BEA's 30/60/90-day estimates, ACS vintages); record
      which one this is.
- [ ] `recheck_by` is derived from the **source's publication cadence** — a
      monthly BLS series gets a near horizon, a decennial apportionment a far
      one, a standing Senate rule the next Congress. Past `recheck_by` the
      validator *warns* (never fails) and the app shows a staleness marker;
      refresh happens through a PR like every other canon change.
- [ ] `tolerance` is authored **explicitly on every number** — never rely on
      the schema default. `exact` for counts, thresholds, and dates fixed by
      rule (60 votes, 435 seats, 1787); `measured` only for estimates where
      an approximate recall is a correct recall (a population, a
      turnout percentage). The safe direction is `exact`: wrongly-`exact` is
      merely strict, wrongly-`measured` silently blesses 1776 for 1787.
- [ ] No undated numbers; no news-article numbers when the agency publishes
      them; no bulk extraction from any dataset (EU/UK database right; and we
      are a corpus, not a mirror).

### Quotes

The riskiest kind — the recipe is a pipeline, run **in order, per quote**:

1. [ ] **Primary-archive pin.** Find the quote in the archive that *holds* it,
       with document and date: Founders Online, the American Presidency
       Project, the Congressional Record via govinfo, LoC/NARA, a presidential
       library, an estate's own records. Cite that (`sources:` type `book`,
       `pdf`, `website`, `video`, `audio`, `court-opinion`, `statute`, or
       `crs-report` — a `paper` *about* the quote does not clear the bar; it
       discusses, it doesn't hold). Fallback when no archive pin exists: two
       independent secondary works that each *name* the primary — and say so
       in the PR trail.
2. [ ] **Wikiquote negative check.** Look the quote up on the claimed
       speaker's Wikiquote page, *Misattributed* and *Disputed* sections
       included. Record the check in `attribution_checks: [wikiquote]` —
       never as a `sources:` entry (a negative check is absence of evidence,
       and citing Wikiquote as a source is banned).
3. [ ] **Quote Investigator check** — mandatory when the claimed speaker is a
       quote magnet (Einstein, Twain, Churchill, Lincoln, Jefferson,
       Franklin, Gandhi, …) or when step 1 failed to produce a pin. Record it
       in `attribution_checks: [wikiquote, quote-investigator]`.
4. [ ] **Exact wording from the primary.** The `line` is the primary source's
       wording, not the poster version. If the famous wording and the archival
       wording differ, the archival wording wins and the `explanation` or
       `correction_note` teaches the difference.
5. [ ] **Verdict.** Set `attribution_status`: `verified` (pinned),
       `disputed` (genuine scholarly disagreement — say why in the
       `explanation`), or `misattributed` (see the misattribution policy).
6. [ ] **Living-author marker.** A quote from a living/contemporary speaker
       **must** carry a `speaker_slug` resolving into `persons/` (add the
       person in the same PR if missing — `persons/` is the contemporary set);
       the copyright caps below are keyed on it. A historic speaker gets
       **no** `speaker_slug` — `persons/` is contemporary-only, and a
       dangling slug is an error.

## Cross-kind rules

### Misattribution policy — admitted, and the correction is the teaching

Misattributed lines are **first-class corpus items**, not rejects: the citizen
who confidently deploys a fake Jefferson line in public is precisely the
failure this corpus exists to prevent. But they are admitted *as
corrections*:

- [ ] `attribution_status: misattributed` is set.
- [ ] `correction_note` is present (the validator hard-errors without it) and
      carries the debunk: what the record actually shows, where the line
      really comes from, `actual_speaker` where known.
- [ ] The `speaker` field holds the *claimed* speaker — the app's byline rule
      only ever renders it inside a sentence disowning it, and the false
      attribution is never a drillable "correct answer".
- [ ] The sourcing bar still applies: cite the reference work or archive that
      establishes the correction (e.g. *Respectfully Quoted*, an estate's
      spurious-quotes list), not an aggregator.

Compact example of the fields that change (everything else per the quote bar):

```yaml
speaker: Thomas Jefferson
attribution_status: misattributed
actual_speaker: John Philpot Curran
correction_note: >
  No form of this appears in Jefferson's papers. The earliest traced
  ancestor is John Philpot Curran's 1790 Dublin speech ("the condition upon
  which God hath given liberty to man is eternal vigilance"); the compact
  wording and the Jefferson attribution both surface decades later.
attribution_checks: [wikiquote, quote-investigator]
```

### Contested claims — never bare facts; they enter attributed

A contested empirical claim ("the minimum wage costs jobs") may **never** be
authored as a `fact`, no matter how confident you are. If it is worth
memorizing, it enters **attributed**:

- as a `quote` — who argued it, pinned to where they said it; or
- as a `number` pinned to the body that produced it — *"CBO scored it at X"*,
  never *"it costs X jobs."*

That converts an unverifiable assertion into a verifiable claim **about
provenance**, which is exactly how a careful debater handles contested
ground. The `fact` kind stays on ground where expert consensus holds. This
rule is checklist-only — contestedness is not encoded anywhere in the YAML —
so the validator cannot catch a violation; you and the reviewer are the gate.

### Copyright caps

- [ ] Quote `line` ≤ **75 words** (whitespace-separated count; the validator
      hard-errors above it). If the memorable core doesn't fit in 75 words,
      trim to the core or drop the item — and record the trim/drop in the PR
      trail.
- [ ] ≤ **5** quotes per **living** author, corpus-wide (mechanized via
      `speaker_slug` — which is why the living-author marker rule above is
      mandatory, not stylistic).
- [ ] ≤ **2–3** quotes per copyrighted work: treat **2 as the authoring bar**;
      3 is the hard cap the validator enforces (keyed on `speaker_slug` +
      `occasion` — spell `occasion` consistently for quotes from the same
      work). Prefer public civic speech (testimony, floor speeches, published
      government text) over anyone's books; never seed from an author's own
      aphorism compilation.
- [ ] **No song lyrics. Ever. At any length.** The validator's regex is only a
      tripwire for the labeled case — the ban is total and it is yours to
      honor.
- [ ] **Avoid poetry** — a memorable line of a poem is the heart of the work
      (*Harper & Row*); public-domain poetry is the only exception, sparingly.
- [ ] US-government works are public domain (17 U.S.C. §105) — official
      statistics, the Congressional Record, official presidential speech —
      quote them freely; the caps above are about copyrighted material.

### Near-duplicate discipline

The validator compares every `line` against the rest of the corpus
(normalized token-set similarity: ≥0.85 error, ≥0.6 flag) and against glossary
`name` + `short_definition` (warning, listed for the PR body). Lesson prose is
deliberately not compared — a card drilling what a lesson teaches is the
design.

- [ ] Before authoring an item, search the existing corpus *and* `glossary/`
      for the same ground. Two Touchstones drilling the same thing is a
      defect; a `fact` legitimately restating a glossary definition in
      drillable form can be fine — the reviewer judges, which is why the
      glossary overlap is a warning, not an error.
- [ ] Every warning the validator prints is **acknowledged in the PR body** —
      kept-with-reason or resolved. An unacknowledged warning reads as an
      unread one.

### Balance tagging — report, never gate

- [ ] Items with a discernible political valence carry `partisan_lean` and/or
      `ideology_tags` — identical treatment to `organizations/` and
      `persons/`, because this is reference data, not the app speaking.
      Most sayings, procedural facts, and agency numbers have none; do not
      invent a lean to seem thorough.
- [ ] The validator prints a distribution summary on every run. It is
      **report-only** — never a quota, never a gate. Skew is corrected by
      *commissioning* the underrepresented material in later batches, not by
      rejecting the overrepresented.

## Writing the two texts

- **`line`** — short, exact, self-contained. For quotes: the archival
  wording. For facts/numbers: our own words, one checkable assertion, no
  hedging, no compound claims.
- **`explanation`** — in-house writing that earns its place under every
  answer: what the line means, why it lands, the one distinction people get
  wrong (signing vs ratifying; legislation vs nominations). Written fresh,
  never lifted — this is the layer the repo's own license covers, so it must
  actually be ours.

## How a batch gets made (the seed session)

1. Read, in order: this document; [`meta/banned-sources.yaml`](./meta/banned-sources.yaml);
   the schema (`src/content-schema/touchstone.ts` in the app repo). Do not
   work from memory of them.
2. For each candidate item, do the research **per item** — real lookups
   against the primary archives and the negative-check surfaces, not a single
   completion. The per-kind bar above is the per-item to-do list.
3. Write the YAML. Self-check every box in this document.
4. An item that fails its bar is **rejected, and the rejection is recorded**
   for the PR body: the item, the gate that fired, the disposition (trimmed,
   reclassified, re-entered attributed, dropped). Rejections are part of the
   deliverable — they are how the gates are proven.
5. Run the validator to green from a BetterCitizen app checkout that includes
   the Touchstone validator:

   ```sh
   # from the app checkout (SuperCitizen/bettercitizen.ai), sibling to this repo
   CONTENT_LOCAL_PATH=../bettercitizen-content pnpm validate-content
   ```

   Green means zero errors. Warnings (staleness, near-dup flags, glossary
   overlaps) do not block — each one is acknowledged in the PR body instead.
6. Open the PR with the Touchstone template
   (`.github/PULL_REQUEST_TEMPLATE/touchstones.md` — append
   `?template=touchstones.md` to the compare URL, or use it as the body with
   `gh pr create`): per-item verification-trail table, rejections,
   validator output including the balance summary. Content PRs are
   **added-files-only** — no edits to lessons, glossary, or app-side
   anything.

## Batch 1 — the calibration batch

Batch 1 exists to harden this document, not to fill the corpus. Contract:
[SuperCitizen/bettercitizen.ai#24] and SPEC §16.11.

[SuperCitizen/bettercitizen.ai#24]: https://github.com/SuperCitizen/bettercitizen.ai/issues/24

- **10 items per kind**, four PRs, serialized cheapest→riskiest:
  **sayings → facts → numbers → quotes**. Each PR is reviewed by the owner
  (~35 min); the review's feedback is folded into **this document** before
  the next kind begins. That loop is the point — do not batch ahead of it.
- **One anchored theme across all four kinds: elections & voting +
  constitutional structure.** Maximum near-dup pressure against the two
  densest glossary categories, cheapest primary pinning (Founders Online,
  American Presidency Project, FEC, Census), and real `related` targets
  (`electoral-college`, `filibuster`, `ratification`, …).
- **Five probes, included deliberately** so the gates are proven rather than
  merely exercised. Their expected outcomes are part of the deliverable:
  1. a **misattributed quote** — exercises `attribution_status` +
     required `correction_note`;
  2. an **over-75-word quote candidate** — expected trimmed to the core or
     dropped, recorded in the trail;
  3. a **saying with a named author** — expected **reclassified as a
     `quote`**;
  4. a **contested empirical claim offered as a fact** — expected **refused**
     and re-entered attributed (quote or agency-pinned number);
  5. a **number already past a tight `recheck_by`** — expected to draw the
     staleness **warning**, acknowledged in the PR body.
- Scope edges, batch-wide: every `number` authors `tolerance` explicitly;
  every quote records its `attribution_checks`; **no `speaker_slug` for
  historic speakers** (zero dangling slugs); **no lesson-side
  `touchstone_slugs` backfill** — facts link outward via
  `related: [{ type: lesson, slug: … }]` and that is the whole link.
- Validator green before each PR opens. Acceptance is PRs merged + validator
  green — no retro gate.

## Worked examples

One per kind, fully sourced, final field names. The `number` is the
spec-blessed example (SPEC §16.1); note its sources use `citation:`.

### `number` — `touchstones/number/senate-cloture-threshold.yaml`

```yaml
slug: senate-cloture-threshold
kind: number
line: "Ending a filibuster on legislation in the U.S. Senate takes 60 votes."
explanation: >
  Cloture is the only way to force debate to end. Sixty is three-fifths of the
  full Senate — not of those present — set by Rule XXII in 1975, down from
  two-thirds. It covers legislation only: nominations were carved out to a
  simple majority in 2013 and again in 2017, which is why "you need 60 votes to
  pass anything" is half true.
value: "60"
unit: votes
subject: Senate cloture threshold, legislation
covers: Standing rule, in force since 1975
published: 2026-07-26
recheck_by: 2031-01-03
tolerance: exact
sources:
  - type: crs-report
    citation: "Cloture Attempts on Nominations: Data and Historical Development"
    url: https://crsreports.congress.gov/product/pdf/RL/RL32878
  - type: website
    citation: "U.S. Senate — Rule XXII, Standing Rules of the Senate"
    url: https://www.senate.gov/about/powers-procedures/filibusters-cloture.htm
related:
  - { type: term, slug: filibuster }
  - { type: term, slug: cloture }
tags: [senate, procedure]
contributed_by: wren-holloway
```

Why it clears the bar: official/primary sources (a CRS report + a .gov page);
all three dates present, `recheck_by` set from the rule's cadence (a standing
rule → the start of a future Congress); `tolerance: exact` authored
explicitly because 59 is wrong; both `related` slugs resolve in `glossary/`.

### `saying` — `touchstones/saying/as-maine-goes-so-goes-the-nation.yaml`

```yaml
slug: as-maine-goes-so-goes-the-nation
kind: saying
line: "As Maine goes, so goes the nation."
explanation: >
  A nineteenth-century campaign proverb: Maine elected its governor in
  September, weeks ahead of everyone else, so its result was read as the
  country's forecast. It survives as shorthand for treating any early result
  as destiny — and as its own caution, because its most famous outing was its
  funeral: after Maine and Vermont alone went against Roosevelt in 1936, his
  campaign manager quipped "As Maine goes, so goes Vermont."
origin_note: >
  Traditional American electioneering proverb, in circulation by the 1840s;
  no known coiner. James Farley's 1936 "so goes Vermont" is an attributed
  quip about the proverb, not its origin.
usage_note: >
  Deploy against early-result determinism — it names the habit of reading one
  bellwether as the whole election, and it carries its own counterexample.
sources:
  - type: book
    citation: "Safire, Safire's Political Dictionary, rev. ed. (Oxford University Press, 2008) — 'as Maine goes' entry"
tags: [elections, forecasting]
level: foundational
```

Why it clears the bar: a reference work of type `book`; `origin_note`
establishes traditional status and keeps the *attributed* 1936 quip on the
right side of the saying/quote line. Had the proverb itself traced to a named
coiner, this file would be a `quote` instead — that is the reclassification
rule in action.

### `fact` — `touchstones/fact/amendment-ratification-three-fourths.yaml`

```yaml
slug: amendment-ratification-three-fourths
kind: fact
line: "Amending the U.S. Constitution requires ratification by three-fourths of the states."
explanation: >
  Article V sets two gates: proposal (two-thirds of both chambers, or a
  convention sought by two-thirds of the states) and ratification
  (three-fourths of the states — 38 of 50 today). The second gate is why
  thousands of amendments have been proposed and twenty-seven have made it:
  a supermajority that wide is one of the hardest thresholds in American law.
claim: Share of the states needed to ratify a constitutional amendment
value: Three-fourths (38 of 50)
sources:
  - type: website
    citation: "National Archives — The Constitution of the United States, Article V (transcript)"
    url: https://www.archives.gov/founding-docs/constitution-transcript
related:
  - { type: term, slug: amendment }
  - { type: term, slug: ratification }
tags: [constitution, amendments]
level: foundational
```

Why it clears the bar: a .gov `website` source satisfies the official/primary
tier; the `line` is our own wording, checkable against Article V in one
click; `claim` names the question and `value` is gradeable. Note the shared
ground with the `amendment` glossary entry: this line scores 0.5 against it —
*under* the 0.60 warning threshold, so the validator stays silent. That is
why the search-before-authoring box exists: the mechanical check catches
rewordings, not neighborhoods. Here the drillable threshold ("three-fourths")
adds what the definition doesn't, so the item stands; had the score crossed
0.60, the PR body would say exactly that against the printed warning.

### `quote` — `touchstones/quote/a-republic-if-you-can-keep-it.yaml`

```yaml
slug: a-republic-if-you-can-keep-it
kind: quote
line: "A republic, if you can keep it."
explanation: >
  Franklin's reply — asked, as the Constitutional Convention closed, what
  kind of government it had produced — compresses the civic bargain into a
  conditional: the design is half the machine, and maintenance is the
  citizens' half. The line reaches us through a single witness, James
  McHenry's journal, which is why the wording here follows his note rather
  than the embroidered versions.
speaker: Benjamin Franklin
occasion: >-
  Reply to Elizabeth Willing Powel at the close of the Constitutional
  Convention, as recorded in James McHenry's journal
date: "1787"
attribution_status: verified
attribution_checks: [wikiquote, quote-investigator]
sources:
  - type: book
    citation: "Farrand (ed.), The Records of the Federal Convention of 1787, vol. 3 (Yale, 1911), appendix A — the anecdote from James McHenry's journal"
    url: https://memory.loc.gov/ammem/amlaw/lwfr.html
related:
  - { type: term, slug: republic }
tags: [founding, self-government]
level: foundational
```

Why it clears the bar: the primary-archive pin is the archive that *holds*
the anecdote (Farrand's Records, digitized by the Library of Congress);
Franklin is a quote magnet, so both negative checks ran and are recorded in
`attribution_checks`; the wording is McHenry's, not the internet's; **no
`speaker_slug`** — Franklin is historic and `persons/` is contemporary-only.
The 7-word `line` is comfortably under the 75-word cap, and as an
18th-century US text it is public domain besides.
