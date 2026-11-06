# BetterCitizen interactive component contract (MDX)

Lessons are **MDX** files (`.mdx`). They may use the interactive components
documented here — and **only** these. The components live in
[`components/`](components/) in this repo; the app vendors that directory and
supplies the components to its MDX renderer, so **lesson files never write
`import` or `export` statements**. The validator rejects any JSX tag not in
this catalog and any `import`/`export` in a lesson body.

Design constraints every component obeys (and that authors can rely on):

- **Zero dependencies** beyond React. No fetch, no storage, no router. All
  state is local and resets on reload.
- **Theme-aware.** Colors come from the app's CSS variables with fallbacks:
  ink `--ink`, muted `--muted`, accent `--accent` (burgundy), `--gold`,
  `--blue`, `--green`, lines `--line`, surface `--card`.
- **Accessible.** Everything is keyboard-operable; no drag-only interactions;
  controls are real `<button>`s with ARIA where needed.
- **SSR-safe and deterministic.** No `window` during render, no randomness
  that changes the teaching content.

## MDX authoring rules (read before converting `.md` lessons)

MDX parses raw HTML as **JSX**, which changes some old habits:

1. `class=` → `className=`; inline `style="…"` strings → style **objects**:
   `style={{maxWidth: 680, height: 'auto', display: 'block', margin: '0 auto'}}`.
2. HTML comments `<!-- … -->` are invalid → use `{/* … */}`.
3. Literal `{` `}` `<` in prose must be escaped (`\{`, `\<`) or avoided.
4. `<details class="checkpoint">` blocks → `<Checkpoint>`. Blockquote callouts
   may stay as markdown, or upgrade to `<Callout>` when they carry structure.
5. Inline SVG is still welcome — but wrap it in `<Figure caption="…">` instead
   of a raw `<figure>`, convert any `style`/`class` attributes per rule 1, and
   use **camelCase** SVG attributes (`fontFamily`, `fontSize`, `textAnchor`,
   `strokeWidth`, `strokeDasharray`, `fillOpacity`, …) — hyphenated forms
   render but trip React dev warnings, and the render smoke test fails on
   warnings.
6. Still **never**: `<script>`, `<style>`, `<iframe>`, event-handler
   attributes, external image/network URLs. Interactivity comes only from
   this catalog. Content must stay auditable.
7. Blank lines separate JSX blocks from markdown. Markdown **inside** a
   component's children works (MDX parses it), but keep component children
   simple: paragraphs, bold, lists.

**Pedagogy first.** A component earns its place only when interaction teaches
something prose cannot — prediction before reveal, manipulation of a
mechanism, discrimination between near-misses. Target per lesson: 2–4
`<Checkpoint>`/`<QuickCheck>` woven through (never two back-to-back, never one
at the very end), at most one simulator, figures only where they genuinely
teach. A lesson that is all widgets is as bad as a lesson that is all bullets.

---

## Catalog

### Checkpoint — predict-then-reveal

The workhorse. Poses an application question; the reader commits mentally,
then reveals the answer. Replaces the old `<details class="checkpoint">`.

```mdx
<Checkpoint question="Your state has 8 House seats. How many electors does it get — and who decides how they're chosen?">
  **Ten** — eight (House) plus two (Senate). And the *state legislature*
  decides the manner of choosing them (Art. II §1), which is why
  winner-take-all is a state-law choice, not a constitutional command.
</Checkpoint>
```

| Prop | Type | Required | Notes |
| --- | --- | --- | --- |
| `question` | string | yes | Must require *applying* what was just read |
| `hint` | string | no | Optional nudge shown before reveal |
| children | MDX | yes | The answer; always explains *why*, 1–4 sentences |

### QuickCheck — one-question multiple choice, instant feedback

Inline formative check with distractors. Use for discriminations the reader
should make *now*, not at the end-of-lesson assessment (don't duplicate
assessment questions).

```mdx
<QuickCheck
  question="Winner-take-all allocation is required by…"
  choices={[
    {id: 'a', text: 'Article II of the Constitution'},
    {id: 'b', text: 'The 12th Amendment'},
    {id: 'c', text: 'State law — each legislature chooses its method'},
    {id: 'd', text: 'The Electoral Count Reform Act of 2022'},
  ]}
  answer="c"
  explanation="The Constitution leaves the manner of appointment to state legislatures (Art. II §1); 48 states + D.C. chose winner-take-all by ordinary statute. Maine and Nebraska chose differently — no amendment needed."
/>
```

| Prop | Type | Required | Notes |
| --- | --- | --- | --- |
| `question` | string | yes | |
| `choices` | `{id, text}[]` | yes | 3–4 plausible choices; distractors are near-misses |
| `answer` | string | yes | The correct choice `id` |
| `explanation` | string | yes | Teaches the distinction, shown after answering |

### Figure — captioned figure wrapper

Wraps inline SVG (or a `DataBars`, etc.) with a styled caption. Replaces raw
`<figure>`/`<figcaption>`.

```mdx
<Figure caption="The fixed arithmetic of the Electoral College. Every state gets its House seats + 2.">
  <svg viewBox="0 0 720 170" width="100%" role="img" aria-label="…">…</svg>
</Figure>
```

| Prop | Type | Required | Notes |
| --- | --- | --- | --- |
| `caption` | string | yes | Read after the figure; a figure never speaks for itself |
| `source` | string | no | Small-print attribution line |
| children | JSX | yes | The figure content |

### Callout — labeled aside

Component form of the house callout labels.

```mdx
<Callout type="misconception">
  "The Electoral College weights small states, so it was designed to protect
  small states." The "+2" tilt and the winner-take-all rule are different
  mechanisms — they get blamed for each other constantly.
</Callout>
```

| Prop | Type | Required | Notes |
| --- | --- | --- | --- |
| `type` | `'why' \| 'misconception' \| 'think' \| 'scholar' \| 'sources'` | yes | Renders the house label (Why this matters, Common misconception, Think it through, The scholar's lens, In the primary sources) |
| `title` | string | no | Override label text |
| children | MDX | yes | |

### Timeline — expandable event sequence

For history that *is* a sequence (amendment ratification, a case's path, an
election crisis). Events expand on click; one open at a time.

```mdx
<Timeline events={[
  {date: '1796', title: 'Parties break the original design', detail: 'Adams wins; rival Jefferson becomes VP because electors cast two undifferentiated votes.'},
  {date: '1800', title: 'The Jefferson–Burr tie', detail: '36 House ballots to untangle an exact tie between a ticket and itself.'},
  {date: '1804', title: '12th Amendment', detail: 'Separate ballots for President and VP — the Constitution absorbs the existence of parties.'},
]} />
```

| Prop | Type | Required | Notes |
| --- | --- | --- | --- |
| `events` | `{date, title, detail}[]` | yes | 3–8 events; `date` is a display string ("1804", "Dec 2024") |
| `title` | string | no | Optional heading above the rail |

### ProcessFlow — click-through stages of a mechanism

For processes with stages (bill → law, a case to the Supreme Court, the
electoral count). Click a stage to read its detail; optional `branch` notes
where the path can divert or die.

```mdx
<ProcessFlow steps={[
  {title: 'Introduction', detail: 'A member drops the bill in the hopper; it gets a number and a committee referral.'},
  {title: 'Committee', detail: 'Hearings, markup, report — or, for ~90% of bills, silence.', branch: 'Most bills die here, without a vote.'},
  {title: 'Floor', detail: 'Rules Committee (House) or unanimous consent/cloture (Senate) governs debate.'},
  {title: 'Conference / ping-pong', detail: 'The chambers reconcile differing texts.'},
  {title: 'President', detail: 'Sign, veto, or pocket veto.', branch: 'A veto can be overridden by two-thirds of each chamber.'},
]} />
```

| Prop | Type | Required | Notes |
| --- | --- | --- | --- |
| `steps` | `{title, detail, branch?}[]` | yes | 3–8 steps |
| `title` | string | no | |

### PerspectiveTabs / Perspective — steel-manned positions side by side

For contested packs: each tab is a position presented as its smartest advocate
would. Tab names should match the lesson's `perspectives:` frontmatter.

```mdx
<PerspectiveTabs>
  <Perspective name="Originalist defender">
    The institution was a deliberate compromise that has served stability and
    federalism…
  </Perspective>
  <Perspective name="Democratic-majority reformer">
    Five popular-vote losers have won; every other office is now elected
    directly…
  </Perspective>
</PerspectiveTabs>
```

| Component | Prop | Type | Notes |
| --- | --- | --- | --- |
| `PerspectiveTabs` | children | `Perspective[]` | 2–4 tabs |
| `Perspective` | `name` | string | The position's honest name |
| `Perspective` | children | MDX | The steel-manned case |

### DataBars — animated horizontal bar comparison

For magnitudes the reader should *feel* (electors by state, spending by
category, turnout by method). Bars animate in; optional threshold marker.

```mdx
<DataBars
  title="Where 538 comes from"
  unit="electors"
  marker={{value: 270, label: '270 = majority'}}
  max={538}
  bars={[
    {label: 'House seats', value: 435, color: 'blue'},
    {label: 'Senate seats', value: 100, color: 'accent'},
    {label: 'D.C. (23rd Amdt.)', value: 3, color: 'gold'},
  ]}
/>
```

| Prop | Type | Required | Notes |
| --- | --- | --- | --- |
| `bars` | `{label, value, color?, note?}[]` | yes | `color`: `'blue' \| 'accent' \| 'gold' \| 'green' \| 'ink'` |
| `title` | string | no | |
| `unit` | string | no | Shown after values |
| `max` | number | no | Scale max (defaults to largest bar) |
| `marker` | `{value, label}` | no | Dashed threshold line |
| `stacked` | boolean | no | Render as one stacked bar instead of rows |

### Flashcards — flip-card review deck

For genuinely enumerable material (the ten amendments, cabinet departments,
glossary clusters). Click to flip, arrows to navigate.

```mdx
<Flashcards title="The first ten amendments" cards={[
  {front: 'First Amendment', back: 'Speech, press, religion (establishment + free exercise), assembly, petition.'},
  {front: 'Second Amendment', back: 'Right to keep and bear arms.'},
]} />
```

| Prop | Type | Required | Notes |
| --- | --- | --- | --- |
| `cards` | `{front, back}[]` | yes | 4–12 cards |
| `title` | string | no | |

### MatchUp — pair matching exercise

Tap an item on the left, then its match on the right. For term↔definition,
case↔holding, clause↔power.

```mdx
<MatchUp
  title="Match the case to its holding"
  pairs={[
    {left: 'McPherson v. Blacker (1892)', right: 'State legislatures have plenary authority over choosing electors'},
    {left: 'Chiafalo v. Washington (2020)', right: 'States may bind electors to their pledge'},
    {left: 'Bush v. Gore (2000)', right: 'Halted the Florida recount on equal-protection grounds'},
  ]}
/>
```

| Prop | Type | Required | Notes |
| --- | --- | --- | --- |
| `pairs` | `{left, right}[]` | yes | 3–6 pairs; right column is displayed shuffled |
| `title` | string | no | |
| `instructions` | string | no | Defaults to "Tap an item, then its match." |

### OrderIt — put the steps in order

Reader reorders a shuffled list (up/down buttons), then checks. For
sequences where order *is* the content.

```mdx
<OrderIt
  prompt="Put the stages of a federal bill in order."
  items={[
    'Introduced and referred to committee',
    'Committee markup and report',
    'Floor debate and passage',
    'Second chamber passes identical text',
    'Presented to the President',
  ]}
  explanation="Identical text must pass both chambers before presentment — a bill that passes both in different forms has not passed Congress."
/>
```

| Prop | Type | Required | Notes |
| --- | --- | --- | --- |
| `items` | `string[]` | yes | **In correct order**; component displays them shuffled |
| `prompt` | string | yes | |
| `explanation` | string | no | Shown after a correct check |
| `title` | string | no | Optional heading above the prompt |

### GuessTheShare — commit to a guess, then see the actual

The reader sets sliders to their guess of each share, then reveals actuals.
Exploits the prediction effect: people remember what surprised them. Built
for budget shares, demographic shares, turnout rates.

```mdx
<GuessTheShare
  title="Where does federal spending actually go?"
  unit="% of FY2024 outlays"
  items={[
    {label: 'Social Security', actual: 21},
    {label: 'Medicare + Medicaid', actual: 24},
    {label: 'Defense', actual: 13},
    {label: 'Interest on the debt', actual: 13},
    {label: 'Foreign aid', actual: 1},
  ]}
  source="CBO, Budget and Economic Outlook"
/>
```

| Prop | Type | Required | Notes |
| --- | --- | --- | --- |
| `items` | `{label, actual, hint?}[]` | yes | `actual` in the given unit (usually %) |
| `title` | string | yes | |
| `unit` | string | no | Defaults to `%` |
| `source` | string | no | Attribution for the actuals — strongly encouraged |

### RankedChoiceSim — instant-runoff rounds, step by step

Steps through IRV counting: last place eliminated, ballots transfer, repeat
until majority. Ships with an illustrative 4-candidate city-election profile;
authors may supply their own.

```mdx
<RankedChoiceSim />
```

```mdx
<RankedChoiceSim
  candidates={['Avila', 'Brooks', 'Chen', 'Dimas']}
  ballots={[
    {ranking: ['Avila', 'Chen'], count: 38},
    {ranking: ['Brooks', 'Chen'], count: 32},
    {ranking: ['Chen', 'Avila'], count: 18},
    {ranking: ['Dimas', 'Brooks'], count: 12},
  ]}
/>
```

| Prop | Type | Required | Notes |
| --- | --- | --- | --- |
| `candidates` | `string[]` | no | Defaults to illustrative profile |
| `ballots` | `{ranking: string[], count: number}[]` | no | Rankings may be partial (exhausted ballots happen — that teaches too) |
| `title` | string | no | |

### GerrymanderLab — same voters, three maps, three outcomes

A fixed grid of voters (60/40 two-party split) districted three ways:
proportional-ish, **packed**, and **cracked**. Toggling plans shows seat
outcomes flip while votes never change. Data is synthetic and labeled
illustrative.

```mdx
<GerrymanderLab />
```

| Prop | Type | Required | Notes |
| --- | --- | --- | --- |
| `title` | string | no | |

(No other props in v1 — the built-in scenario is tuned so all three plans are
contiguous and equal-population.)

### TaxBracketExplorer — marginal vs. effective, finally intuitive

An income slider fills bracket buckets in sequence and reads out marginal vs.
effective rate — the single most misunderstood distinction in tax policy.
Ships with 2025 single-filer brackets (Rev. Proc. 2024-40).

```mdx
<TaxBracketExplorer />
```

| Prop | Type | Required | Notes |
| --- | --- | --- | --- |
| `brackets` | `{upTo: number \| null, rate: number}[]` | no | Override default brackets; `upTo: null` = top bracket |
| `title` | string | no | |
| `source` | string | no | Defaults to the IRS revenue procedure note |

### Path270 — build a winning electoral coalition

All 51 jurisdictions with current (2024-apportionment) electoral votes.
Toggle states into a coalition and watch the count race toward 270. Teaches
the swing-state logic kinesthetically: try winning without the big seven.

```mdx
<Path270 />
```

| Prop | Type | Required | Notes |
| --- | --- | --- | --- |
| `title` | string | no | |
| `prompt` | string | no | Framing challenge, e.g. "Win without Texas, Florida, or California." |

---

## Choosing the right tool

| You want the reader to… | Reach for |
| --- | --- |
| Commit to an answer before seeing it | `Checkpoint`, `QuickCheck` |
| Feel a magnitude or proportion | `DataBars`, `GuessTheShare` |
| Hold a sequence in their head | `Timeline`, `ProcessFlow`, `OrderIt` |
| Compare positions without strawmen | `PerspectiveTabs` |
| Drill enumerable facts | `Flashcards`, `MatchUp` |
| Manipulate the mechanism itself | `RankedChoiceSim`, `GerrymanderLab`, `TaxBracketExplorer`, `Path270` |
| See structure that prose can't carry | `Figure` + inline SVG |

Anti-patterns: a `QuickCheck` that parrots the previous sentence; a `Timeline`
of two events; `Flashcards` for argumentation (cards are for facts);
simulators dropped in without a follow-up paragraph that names what the
reader should have noticed.
