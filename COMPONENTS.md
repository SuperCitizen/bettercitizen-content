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
- **Laid out for the width they get.** A component is structure and real text, never a fixed drawing that scales down. It reads at 320 px and at 700 px, and its breakpoints are measured in em, so larger text reflows sooner. Nothing scrolls sideways.
- **Complete without interaction.** The server renders the whole content: every zone, every preset mark, every value. Interaction adds exploration; it never hides the lesson behind a tap.
- **Color is never the only carrier.** A tone decorates a rule or a dot; the meaning is always also in words. No party colors (never red for one party beside blue for the other). Text on a token fill uses the surface color (`onFill` in `components/lib.ts`), never hard-coded white, so it keeps its contrast on the dark palette.

Each component is also a typed block for the native apps, which render the lesson without a web view. Its props are plain data for that reason, and every entry below names its **static form**: what a renderer shows before it has built the interactive version.

## MDX authoring rules (read before converting `.md` lessons)

MDX parses raw HTML as **JSX**, which changes some old habits:

1. `class=` → `className=`; inline `style="…"` strings → style **objects**:
   `style={{maxWidth: 680, height: 'auto', display: 'block', margin: '0 auto'}}`.
2. HTML comments `<!-- … -->` are invalid → use `{/* … */}`.
3. Literal `{` `}` `<` in prose must be escaped (`\{`, `\<`) or avoided.
4. `<details class="checkpoint">` blocks → `<Checkpoint>`. Blockquote callouts
   may stay as markdown, or upgrade to `<Callout>` when they carry structure.
5. Inline SVG is the last resort, not the default. A figure is a list, a table, or a catalog component (`Panels`, `Flow`, `Chart`, `DataBars`, `Timeline`, `PositionMap`) unless its meaning is a shape no component draws; STYLE.md ("Figures, diagrams, and tables") has the rules for a drawing that stays. When you do write one, wrap it in `<Figure caption="…">`, convert any `style`/`class` attributes per rule 1, and use **camelCase** SVG attributes (`fontFamily`, `fontSize`, `textAnchor`, `strokeWidth`, `strokeDasharray`, `fillOpacity`, …): hyphenated forms render but trip React dev warnings, and the render smoke test fails on warnings.
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

Gives any figure content a caption and a source line: a catalog component, a Markdown table or list, a short paragraph, or (rarely) a drawing. Replaces raw `<figure>`/`<figcaption>`. Markdown inside it needs a blank line after the opening tag and before the closing one.

```mdx
<Figure caption="Sixty-four years of doctrine on two tracks." source="…">

| Year | Partisan claims | Racial claims |
| --- | --- | --- |
| 1962 | *Baker* | |
| 1965 | | Voting Rights Act |

</Figure>
```

| Prop | Type | Required | Notes |
| --- | --- | --- | --- |
| `caption` | string | yes | Read after the figure; a figure never speaks for itself. Describe the content, never the drawing ("the dashed line", "the blue box") |
| `source` | string | no | Small-print attribution line |
| children | MDX | yes | The figure content |

**Static form:** its children, then the caption and source as text.

### Panels / Panel — side by side when there is room, stacked when there isn't

For two to four things that are read against each other: branches, forms of government, before and after, the prongs of a test. On a wide column the panels sit in one row; on a narrow one every panel takes the full width, in source order. It is all or nothing, so a row never leaves one panel orphaned beneath the others.

```mdx
<Panels title="One government, three vesting clauses">
<Panel title="Article I: Congress" tone="blue">

**Writes the law.** 435 House members (2-year terms) and 100 senators (6-year, staggered).

*Powers "herein granted": an enumerated list.*

</Panel>
<Panel title="Article II: the President" tone="accent">

**Executes the law.** One person (4-year term; two-term limit since 1951).

</Panel>
</Panels>
```

| Component | Prop | Type | Notes |
| --- | --- | --- | --- |
| `Panels` | `title` | string | Optional heading above the row |
| `Panels` | children | `Panel[]` | 2–4 panels. Two stack on a phone; three or four only fit a wide column |
| `Panel` | `title` | string | Required. Rendered as a heading, so a screen reader can jump between panels |
| `Panel` | `tone` | `'blue' \| 'accent' \| 'gold' \| 'green' \| 'ink'` | Color of the top rule. Decoration only |
| `Panel` | children | MDX | Short paragraphs and lists. May hold a `<Flow plain>`, a `<Chart plain>` or a small text-free drawing |

Keep panel text terse: on a desktop column three panels are about 20 characters wide each. Prose comparisons belong here rather than in a table, whose columns cannot stack. So do two parallel tracks (two parties' calendars, two lines of cases): one panel per track, each a dated list.

**Static form:** each panel as a heading followed by its content, in order.

### Flow — a diagram made of text

For anything that used to be boxes and arrows: a process, a lineage, a fork, a merge, two parallel lanes, sources into a budget and out again. Stages run top to bottom. A stage is one node or a row of nodes, and the arrow into a stage or a node can carry a label. A row sits side by side when its nodes fit and stacks when they don't; a row of two holds out longest, because a fork or a pair of lanes reads wrongly once stacked.

```mdx
<Flow title="Who lobbies whom" steps={[
  {title: 'Clients', detail: 'Corporations · trade groups · unions · nonprofits.'},
  {nodes: [
    {title: 'Lobbyists', detail: 'In-house staff, or hired K Street firms.', via: 'hire', tone: 'blue'},
    {title: 'The indirect route', detail: 'Think tanks · coalitions · ads, op-eds, research.', tone: 'gold'},
  ]},
  {title: 'Targets', detail: 'Members of Congress · committee staff · agencies.'},
]} />
```

| Prop | Type | Required | Notes |
| --- | --- | --- | --- |
| `steps` | `FlowStep[]` | yes | The stages, in order |
| `title` | string | no | |
| `numbered` | boolean | no | Number the steps instead of drawing arrows. Use when the order is itself the content (the life of a mail ballot) |
| `plain` | boolean | no | Drop the frame and label, for a small flow inside a `Panel` |

A `FlowStep` is either one node (`title`, `detail?`, `tone?`, `via?`) or `nodes: FlowNode[]`, plus:

| Field | Type | Notes |
| --- | --- | --- |
| `via` | string | Label on the arrow into this stage ("fused", "all three met"). On a node inside `nodes`, the label on that node's own arrow; use it only on rows of two |
| `label` | string | Short heading above the stage ("1 · Proposal (either track)") |
| `between` | string | Names the relation between the two nodes of a row, on a dashed bracket beneath them ("the correlation you observe") |
| `note` | string | Read after the stage: a caveat, or who joined along the way |

Two stages with the same number of nodes read as parallel lanes: each node gets its own arrow from the node above it.

**Static form:** an ordered list. Each stage is an item ("title: detail"), a row of nodes is a nested list, and `via`, `between` and `note` are sentences in place.

### Chart — a line or point chart at the reader's text size

For data over time and for the few curves that are the point (a Laffer curve, a supply and demand cross). The plot stretches to the column; every label is real text laid over it, so nothing shrinks on a phone. Dragging across the plot, or focusing it and pressing the arrow keys, reads out one point at a time, and "Show the data" opens the full table.

```mdx
<Chart
  title="The U-shape: foreign-born share of the U.S. population, 1850–2025"
  unit="%"
  yMax={18}
  yTicks={[0, 5, 10, 15]}
  xTicks={[1850, 1900, 1950, 2000]}
  rules={[{x: 1965, label: '1965 Act'}]}
  marks={[{x: 1890, y: 14.8, label: '1890: 14.8%', place: 'above'}]}
  series={[
    {label: 'Census and ACS', points: [[1850, 9.7], [1860, 13.2], [1870, 14.4]]},
    {label: 'Pew estimates', color: 'blue', dashed: true, show: 'both', points: [[2025, 15.8, 'early 2025']]},
  ]}
/>
```

| Prop | Type | Required | Notes |
| --- | --- | --- | --- |
| `series` | `{label, points, color?, dashed?, show?}[]` | yes | `points` are `[x, y]` pairs in x order, or `[x, y, name]` when the x value needs words. `show`: `'line'` (default), `'points'`, `'both'`. `dashed` marks an estimate, a projection or a reference |
| `title` | string | no | |
| `unit` | string | no | For y values. A unit starting with `%` attaches without a space |
| `xUnit` | string | no | For x values. Years need none |
| `xLabel`, `yLabel` | string | no | Axis titles |
| `xTicks`, `yTicks` | number[] | no | Keep to five or fewer so they fit a phone |
| `xMin`, `xMax`, `yMin`, `yMax` | number | no | Default to the data's range, with y starting at 0 |
| `marks` | `{x, y, label, place?}[]` | no | A few labeled points, far enough apart to read on a phone. A label wraps rather than leave the plot, so keep it short. `place`: `'above' \| 'below' \| 'left' \| 'right'` |
| `rules` | `{x? \| y?, label}[]` | no | Dashed reference lines. A label wraps inside the plot |
| `bands` | `{from, to, label, color?}[]` | no | Shaded ranges of x, named in the key under the chart |
| `schematic` | boolean | no | A concept curve, not measured data: no y numbers, no readout, no data table |
| `plain` | boolean | no | Drop the frame, for a small chart inside a `Panel` |

Every number in `points` is a claim and is sourced like one. Plot only values you can cite; a curve you cannot back with data is `schematic`, or it is two or three `DataBars`.

**Static form:** the title, then one table per series (x, y), then the marks, rules and bands as a list of labels.

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

### Timeline — event sequence on a rail

For history that *is* a sequence (amendment ratification, a case's path, an
election crisis). An event with a `detail` expands on click, one open at a time. With `expanded`, every detail shows at once and nothing needs opening: use that when the timeline stands in for a figure.

```mdx
<Timeline events={[
  {date: '1796', title: 'Parties break the original design', detail: 'Adams wins; rival Jefferson becomes VP because electors cast two undifferentiated votes.'},
  {date: '1800', title: 'The Jefferson–Burr tie', detail: '36 House ballots to untangle an exact tie between a ticket and itself.'},
  {date: '1804', title: '12th Amendment', detail: 'Separate ballots for President and VP — the Constitution absorbs the existence of parties.'},
]} />
```

```mdx
<Timeline title="The implementation calendar Congress wrote" events={[
  {date: 'Jan 1, 2026', tag: 'Benefit', tone: 'blue', title: 'First 10 negotiated Medicare drug prices take effect'},
  {date: 'Nov 2026', tag: 'Election', tone: 'gold', title: 'Midterm elections'},
  {date: 'Dec 31, 2026', tag: 'Cut', tone: 'accent', title: '6-month renewals begin'},
]} />
```

| Prop | Type | Required | Notes |
| --- | --- | --- | --- |
| `events` | `{date, title, detail?, tag?, tone?}[]` | yes | 3–10 events; `date` is a display string ("1804", "Dec 2024"). `tag` names the event's kind or track in a word, shown as text; `tone` colors its dot and always travels with a `tag` or a self-explanatory title |
| `title` | string | no | Optional heading above the rail |
| `expanded` | boolean | no | Show every detail, with nothing to open |

Two parallel tracks with short entries (two parties' calendars, two lines of cases) read better as two `Panels`, one per track, each a dated list. A table of date, track and track is too wide for a phone.

**Static form:** a list of events: date, tag, title, then the detail.

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

### DataBars — horizontal bar comparison

For magnitudes the reader should *feel* (electors by state, spending by
category, turnout by method). Each row sets the label and its value on one line with the bar beneath, so it reads the same on a phone as on a desk. Values are always text. Nothing animates. A handful of dated values (debt in six benchmark years) belongs here too; a real series over time is a `Chart`.

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
| `bars` | `{label, value, color?, note?}[]` | yes, unless `groups` | `color`: `'blue' \| 'accent' \| 'gold' \| 'green' \| 'ink'` |
| `groups` | `{label, bars, note?}[]` | no | Sets of bars under their own headings, drawn to one scale: three counting rules over the same ballots, two years for each state |
| `title` | string | no | |
| `unit` | string | no | Shown after values ("435 electors"). A unit starting with `%` attaches ("51% of receipts"); one starting with `$` goes in front (`$` gives "$3,500", `$ billion` gives "$4,200 billion") |
| `max` | number | no | Scale max (defaults to largest bar) |
| `marker` | `{value, label}` | no | Dashed threshold tick on every bar, named once above them |
| `stacked` | boolean | no | Render as one stacked bar with a legend instead of rows |

```mdx
<DataBars title="One election, three counting rules, three winners" unit="votes" max={100} groups={[
  {label: 'Plurality: count first choices only', bars: [
    {label: 'Avery — wins', value: 35, color: 'accent'},
    {label: 'Brooks', value: 25, color: 'ink'},
  ]},
  {label: 'Top-two runoff: Avery vs. Brooks in a second election', note: 'Cruz, Diaz, and Ellis voters all prefer Brooks to Avery.', bars: [
    {label: 'Brooks — wins', value: 65, color: 'blue'},
    {label: 'Avery', value: 35, color: 'ink'},
  ]},
]} />
```

**Static form:** a table of label, value and note, with a heading row per group; the marker as a sentence.

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

### Scale — a count, its thresholds, and a slider

For a number line cut into zones by thresholds: 51, 60 and 67 senators; 270 electors; 38 states. The reader moves the count and reads what it can and cannot do. The list of zones underneath states every zone without anyone touching the slider.

```mdx
<Scale
  title="How many senators support the bill?"
  unit="senators in favor"
  max={100}
  start={54}
  zones={[
    {upTo: 50, label: 'Cannot pass', detail: 'Short of the 51 votes passage takes.'},
    {upTo: 59, label: 'A majority, still blocked', detail: 'Enough to pass, but there is no path to a final vote without 60.', tone: 'gold'},
    {upTo: 66, label: 'Filibuster-proof', detail: 'Enough to invoke cloture, but not to override a veto.', tone: 'blue'},
    {upTo: 100, label: 'Veto-proof', detail: 'Enough to override a veto.', tone: 'green'},
  ]}
  examples={[{value: 54, label: 'Manchin–Toomey'}, {value: 60, label: 'cloture'}]}
/>
```

| Prop | Type | Required | Notes |
| --- | --- | --- | --- |
| `zones` | `{upTo, label, detail?, tone?}[]` | yes | Ascending. Each zone runs from one past the previous `upTo` through its own; the last ends at `max` |
| `max` | number | yes | Highest value on the scale |
| `min` | number | no | Lowest value; defaults to 0 |
| `unit` | string | no | What the number counts |
| `start` | number | no | Where the slider starts. Start it somewhere instructive |
| `examples` | `{value, label}[]` | no | Named values the reader can jump to |
| `title` | string | no | A question works best |

Whole numbers only. The slider is a native range input, so it works with a keyboard, a touch screen and a screen reader, which hears the count and its zone.

**Static form:** a table of zones (range, label, detail), then the examples as a list.

### PositionMap — positions on one or two axes

For placing traditions, proposals or candidates on a spectrum, or on a plane made of two questions. Each position is a numbered marker; the numbered list beneath names and explains it, so labels never collide at any width. Tapping a marker or its name highlights the pair.

```mdx
<PositionMap
  title="One word, four families"
  x={{label: 'Social ownership of the means of production', low: 'mostly private', high: 'comprehensive'}}
  y={{label: 'Political means', low: 'single-party, coercive', high: 'democratic, pluralist'}}
  points={[
    {label: 'Nordic model', x: 0.29, y: 0.88, detail: 'Market economy plus welfare state.', tone: 'gold'},
    {label: 'Market socialism', x: 0.78, y: 0.65, detail: 'Lange, Roemer. Largely on paper.', dashed: true},
  ]}
/>
```

| Prop | Type | Required | Notes |
| --- | --- | --- | --- |
| `x` | `{label, low, high}` | yes | What the axis measures, and the names of its two ends |
| `y` | `{label, low, high}` | no | Leave out for a one-axis spectrum |
| `points` | `{label, x, y?, detail?, tone?, dashed?}[]` | yes | `x` and `y` run 0 (low end) to 1 (high end). `dashed` rings a position that is hypothetical or shown only for contrast; say which in its `detail` |
| `spans` | `{from, to, label}[]` | no | One-axis only: a labeled bracket over part of the axis ("the libertarian family") |
| `title` | string | no | |

A position is a description, never a rating. Place points by the content's own argument, say in the lesson why each sits where it does, and never map people or parties by lean.

**Static form:** the axes as a sentence each, then the numbered list of positions with their details, in order along the x axis as authored.

### Ballot — sample ballots the reader can mark

For the three ways a ballot can ask the same question: pick one, rank, score. The reader marks the ballot, and each ballot says underneath what it just recorded. Preset marks make the ballots read complete before anyone touches them.

```mdx
<Ballot
  candidates={['Avila', 'Brooks', 'Chen']}
  methods={['pick', 'rank', 'score']}
  pick="Avila"
  rank={['Avila', 'Brooks', 'Chen']}
  score={{Avila: 5, Brooks: 4, Chen: 0}}
  notes={{pick: 'Your favorite, nothing else.', rank: 'Order, but not distance.', score: 'How much, for everyone.'}}
/>
```

| Prop | Type | Required | Notes |
| --- | --- | --- | --- |
| `candidates` | `string[]` | yes | Fictional names. Never real candidates or parties |
| `methods` | `('pick' \| 'rank' \| 'score')[]` | yes | Which ballots to show, in order |
| `pick`, `rank`, `score` | string, `string[]`, `{[candidate]: number}` | no | Preset marks. `rank` lists candidates first choice first |
| `maxScore` | number | no | Top score; defaults to 5 |
| `ranks` | number | no | Choices the ranked ballot offers; defaults to 3 |
| `headings`, `notes` | `{pick?, rank?, score?}` | no | Replace a ballot's heading, or the line saying what it records |
| `averages` | `{[candidate]: number}` | no | Everyone's average score, shown beside the reader's own; the highest is marked as the winner |
| `averagesLabel` | string | no | What the averages are called ("city average") |
| `title` | string | no | |

The controls are real radio buttons. On the ranked ballot a rank holds one candidate and a candidate holds one rank, as on paper. On the score ballot every bubble carries its number, and a candidate's name sits beside its row of bubbles when the ballot is wide enough and above it when it is not, so the ballot reads the same on a phone.

**Static form:** a table with a row per candidate and a column per ballot, showing the preset marks, then each ballot's note.

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
| See a quantity change over time | `Chart` (a few dated values: `DataBars`) |
| Hold a sequence in their head | `Timeline`, `ProcessFlow`, `OrderIt`, `Flow numbered` |
| See how parts connect: a process, a lineage, a fork, two lanes | `Flow` |
| Read two to four things against each other | `Panels` (a few numbers or single words in rows and columns: a table) |
| See where positions sit on a spectrum or a plane | `PositionMap` |
| Compare positions without strawmen | `PerspectiveTabs` |
| Drill enumerable facts | `Flashcards`, `MatchUp` |
| Feel a threshold by crossing it | `Scale` |
| Manipulate the mechanism itself | `Ballot`, `RankedChoiceSim`, `GerrymanderLab`, `TaxBracketExplorer`, `Path270` |
| See a shape no component draws | `Figure` + a small inline SVG, by STYLE.md's rules |

`Chart` and `PositionMap` respond to the reader but are figures: use them as freely as a table. `Scale` and `Ballot` are exercises and count as the lesson's one simulator.

Anti-patterns: a `QuickCheck` that parrots the previous sentence; a `Timeline`
of two events; `Flashcards` for argumentation (cards are for facts);
simulators dropped in without a follow-up paragraph that names what the
reader should have noticed.
