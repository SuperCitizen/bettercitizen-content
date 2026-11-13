# Requests to bettercitizen-core

What the lesson content needs from core that `core-api.md` doesn't offer yet. Core reads this file and answers in its `CHANGELOG.md`, as it does for each app's `docs/core-requests.md`. Numbers here start with C so they don't collide with an app's.

Last updated 2026-11-09, against core 0.1.0 as built on 2026-11-06 and this repo's working tree after [ADR 0001](adr/0001-figures-are-content.md) (figures are content, not drawings). These extend two requests the Apple app already filed: its R21 (type the MDX components, keep `<Figure caption>`) and R22 (figure assets as real SVG).

## Why this is urgent

On core 0.1.0, `<Figure>` is lowercased into the `<figure>` path, which looks for an `<svg>` and a `<figcaption>` and emits nothing when it finds neither (`content/markdown.rs`, `figure()`). After ADR 0001, 74 of the 75 figures hold no `<svg>`: on LiveCore they would produce no block at all. Thirty of them (the `DataBars` figures) already vanish today; the other 44 used to be drawings. The 75th keeps only the first of its two drawings and loses its text. Until C1 lands, the native apps should stay on content at d01c1c9.

## Open

### C1. `Figure` is a captioned container (extends Apple R21)

`<Figure caption="…" source="…">` now wraps a catalog component, a Markdown table or list, paragraphs, or (in one lesson) drawings. Proposed:

```text
Figure  { body: [LessonBlock], caption: [Inline], source: [Inline] }
Drawing { asset, asset_dark?, alt, width, height }      // today's Figure, minus its caption
```

- `caption` and `source` come from the props, parsed as inline Markdown. `source` matters as much as the caption: sourcing is a content rule, and 38 of the 75 figures carry one.
- The children are parsed as lesson flow: Markdown (GFM tables, lists, paragraphs), catalog components, and any `<svg>`.
- An `<svg>` becomes a `Drawing` wherever it appears, including inside a `Panel` (federalism/federal-vs-state has two in one figure). Core takes only the first `<svg>` of a figure today.

If changing `Figure`'s shape is too disruptive, a new block (`Captioned { body, caption, source }`) beside the existing `Figure` carries the same information.

### C2. Type the figure components (extends Apple R21)

Each is plain data in its props, so it can be a typed block. `COMPONENTS.md` is the reference for props and defaults.

```text
Panels      { title?, panels: [Panel] }                  Panel { title, tone?: Tone, body: [LessonBlock] }
Flow        { title?, numbered, steps: [FlowStep] }
  FlowStep  { nodes: [FlowNode], via?, label?, between?, note? }      // a single-node step is nodes of length 1
  FlowNode  { title, detail?, tone?: Tone, via? }
Timeline    { title?, expanded, events: [TimelineEvent] }  TimelineEvent { date, title, body: [Inline], tag?, tone?: Tone }
DataBars    { title?, unit?, max?, marker?: { value, label }, stacked, groups: [BarGroup] }
  BarGroup  { label?, note?, bars: [Bar] }                Bar { label, value: f64, color?: Tone, note? }   // `bars` alone is one unlabeled group
Chart       { title?, unit?, x_unit?, x_label?, y_label?, x_ticks, y_ticks, x_min?, x_max?, y_min?, y_max?,
              schematic, series: [Series], marks: [Mark], rules: [Rule], bands: [Band] }
  Series    { label, points: [Point], color?: Tone, dashed, show: Line | Points | Both }   Point { x: f64, y: f64, name? }
  Mark      { x, y, label, place?: Above | Below | Left | Right }   Rule { x?, y?, label }   Band { from, to, label, color?: Tone }
PositionMap { title?, x: Axis, y?: Axis, points: [MapPoint], spans: [Span] }
  Axis      { label, low, high }   MapPoint { label, x: f64, y?: f64, detail?, tone?: Tone, dashed }   Span { from, to, label }
Scale       { title?, min: i64, max: i64, unit?, start?, zones: [Zone], examples: [Example] }
  Zone      { up_to: i64, label, detail?, tone?: Tone }   Example { value: i64, label }
Ballot      { title?, candidates: [String], methods: [Pick | Rank | Score], pick?, rank: [String], score: [CandidateScore],
              max_score: u32, ranks: u32, headings, notes, averages: [CandidateScore], averages_label? }
enum Tone   { Blue, Accent, Gold, Green, Ink }
```

Two things core has to do that it doesn't today:

- **Read the props as data.** `steps={[{title: 'Clients', …}]}` is a JavaScript object literal: unquoted keys, single-quoted strings, trailing commas, numbers, booleans, nested arrays, and string escapes such as `\'`. Core stores an attribute's raw text as a JSON string now. No lesson uses a function, a template string or an identifier in a prop; refusing anything beyond literals is right.
- **Parse children as lesson flow** for `Panel` (and `Checkpoint`, `Perspective`, `Callout`), where core keeps only plain text now. A `Panel` body may hold paragraphs, lists, a `Flow`, a `Chart` or a drawing.

### C3. A static form for every component

Six components are new, and each native app will build its renderers at its own pace. So that no app shows a placeholder meanwhile, please give every typed component block a `fallback: [LessonBlock]` built from blocks every app already draws (`Table`, `ListBlock`, `Paragraph`, `Heading`). `COMPONENTS.md` states the static form of each one; in short:

| Component | Fallback |
| --- | --- |
| `Panels` | Each panel: a heading, then its body |
| `Flow` | An ordered list; a row of nodes is a nested list; `via`, `between` and `note` are sentences in place |
| `Timeline` | A list: date, tag, title, detail |
| `DataBars` | A table of label, value (with the unit applied) and note, with a heading row per group; the marker as a sentence |
| `Chart` | One table per series (x, y), then marks, rules and bands as a list |
| `PositionMap` | A sentence per axis, then the numbered list of positions |
| `Scale` | A table of zones: range, label, detail; then the examples |
| `Ballot` | A table: a row per candidate, a column per ballot, showing the preset marks; then each ballot's note |

The same would serve the interactive components core doesn't type yet (`QuickCheck`, `MatchUp`, `OrderIt`, `GuessTheShare`, the simulators), though those are Apple R21's question rather than this one.

### C4. Units are part of the value

`DataBars`, `Chart` and `Scale` format numbers with a unit by one rule, and core's fallback tables should apply the same one so a native table says what the web says: thousands separators; a unit starting with `%` attaches ("51% of receipts"); one starting with `$` goes in front ("$3,500", "$4,200 billion"); any other unit follows after a space ("435 electors"). Years on a chart's x axis print without separators.

### C5. Fewer drawings, still not SVG (Apple R22 stands)

After ADR 0001 the content has two drawings (four assets with the dark palette), both in federalism/federal-vs-state, with no text in them. They are still written as JSX (`fillOpacity`, `strokeWidth`, `style={{…}}` on the root), so R22's ask is unchanged: write assets as SVG. The `style` object on a drawing's root now carries one thing a renderer should keep: `maxWidth`, the widest the drawing should be shown (300 for both). `Drawing` could carry it as `max_width?`, or apps can use the rule in `STYLE.md`: never wider than the viewBox.

### C6. Validation

Core accepts exactly what the web validator accepts, and the web validator does not check props. The catalog now has shapes worth refusing at import: a `Panels` with fewer than two or more than four panels, a `Scale` whose zones don't ascend to `max`, a `Chart` point that isn't two numbers, a `Ballot` preset naming a candidate who isn't on it. If core checks them, please tell bettercitizen.ai so both validators agree.
