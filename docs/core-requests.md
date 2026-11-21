# Requests to bettercitizen-core

What the lesson content needs from core that `core-api.md` doesn't offer yet. Core reads this file and answers in its `CHANGELOG.md`, as it does for each app's `docs/core-requests.md`. Numbers here start with C so they don't collide with an app's.

Last updated 2026-11-18: C1 to C5 and C7 moved under "Answered by core 0.2.0" and C6 given core's reply, both from core's `CHANGELOG.md` at fa4f6d2 (0.2.2, unreleased). C8 to C12 were added on 2026-11-16 for [ADR 0003](adr/0003-laws-cases-and-states.md), against core 0.2.1 as unreleased that day, and C7 on 2026-11-13. C1 to C6 were written on 2026-11-09, against core 0.1.0 as built on 2026-11-06 and this repo's working tree after [ADR 0001](adr/0001-figures-are-content.md) (figures are content, not drawings); they extend two requests the Apple app already filed, its R21 (type the MDX components, keep `<Figure caption>`) and R22 (figure assets as real SVG).

## Open

### C6. Validation

Core accepts exactly what the web validator accepts, and the web validator does not check props. The catalog now has shapes worth refusing at import: a `Panels` with fewer than two or more than four panels, a `Scale` whose zones don't ascend to `max`, a `Chart` point that isn't two numbers, a `Ballot` preset naming a candidate who isn't on it. If core checks them, please tell bettercitizen.ai so both validators agree.

Core's reply in 0.2.0: not in that version. Import still accepts what the web's validator accepts. A component whose props don't fit the catalog is kept untyped and reported (`mdx_to_blocks(…).problems`), and core's corpus test fails if any lesson has one; none did. If `validate-content` starts refusing these shapes, core will refuse the same ones. So C6 now waits on bettercitizen.ai's validator, and [`renderer-requests.md`](renderer-requests.md) does not ask for that yet.

### C8. Laws, cases and states are entities (ADR 0003)

Three new collections, `laws/`, `cases/` and `states/`, plus `meta/courts.yaml`, whose formats are decisions 1 to 4 of [ADR 0003](adr/0003-laws-cases-and-states.md). Proposed:

```text
enum EntityKind { …, Law, Case, State }                // as_str: "law", "case", "state"
async fn get_law(slug) -> Law
  record Law   { slug, name, short_name?, official_title?, jurisdiction: Jurisdiction, congress?, session?, bill_number?,
                 other_bills: [BillRef], introduced?, enacted?, public_law?, citation?, codified?, status: LawStatus,
                 sponsors: [Sponsor], amends: [EntityRef], amended_by: [EntityRef], cases: [EntityRef],
                 summary, body: [LessonBlock], sources: [Source], linked_from: Backlinks }
  enum   LawStatus    { Introduced, PassedOneChamber, PassedBoth, Enacted, Vetoed, Died, Repealed }
  enum   Jurisdiction { Federal, State(EntityRef) }
  record Sponsor      { name, person: EntityRef? }      // `name` always set; `person` when the sponsor has a page
  record BillRef      { congress?, session?, bill_number }
async fn get_case(slug) -> Case
  record Case  { slug, name, short_name?, court: Court, argued?, decided?, citation?, docket?, holding?,
                 laws: [EntityRef], overrules: [EntityRef], overruled_by: [EntityRef],
                 summary, body: [LessonBlock], sources: [Source], linked_from: Backlinks }
  record Court { id, name, state: EntityRef? }          // from meta/courts.yaml; CourtListener's ids
async fn get_state(slug) -> State
  record State { slug, name, code, kind: StateKind, ocd_id, capital?, admitted?, legislature?,
                 summary, body: [LessonBlock], sources: [Source],
                 senators: [Member], representatives: [Member],      // current members, from C10; representatives by district
                 people: [EntityRef], laws: [EntityRef], cases: [EntityRef], linked_from: Backlinks }
  enum   StateKind { State, District }
```

- Dates are strings and may be partial (`YYYY`, `YYYY-MM`, `YYYY-MM-DD`). A case with no `decided` is pending and has no holding.
- `amended_by`, `cases` (on a law) and `overruled_by` are the reverse of `amends`, a case's `laws` and `overrules`, computed at import.
- `list_entities` and `search` cover the three kinds. `EntitySummary.category` is a law's status, a case's court and a state's kind.
- The importer rejects what the web's validator rejects: a missing required field, an unknown `status`, `court` or jurisdiction, a `holding` missing from a decided case, a sponsor or `laws`/`amends`/`overrules` slug that resolves to nothing, and a duplicate slug. If core checks more, please tell bettercitizen.ai, as in C6.

### C9. Cross-references: three kinds and a label (ADR 0003, decision 8)

```text
[[law:voting-rights-act]]   [[case:citizens-united-v-fec]]   [[state:ma]]
[[case:buckley-v-valeo|Buckley]]                              // the labeled form, for every kind
```

- `split_cross_refs` reads the kinds `law`, `case` and `state`, and an optional `|label` of 1 to 80 characters with no `[`, `]`, `|` or newline.
- A labeled ref keeps its label through resolution; an unlabeled one gets the entity's name, as now. `Inline::CrossRef` needs no new field: apps set a `Case` link in italics, label or not.
- A ref whose kind core does not know, or whose slug resolves to nothing, becomes `Text` of its label or its slug's words, never the raw `[[…]]`. Today `split_cross_refs` leaves an unknown kind, and a slug with a `|` in it, as text with its brackets, which is what an app on core 0.2 would show for every new link. The native apps should stay on content from before the first `[[law:]]`, `[[case:]]`, `[[state:]]` or labeled link until this lands.
- A ref that resolves to nothing fails import, as now.

### C10. Persons: a state, offices, a Bioguide ID, and members of Congress from `congress/` (ADR 0003, decisions 5 and 6)

- `PersonDoc` gains `state?` (a state slug), `offices: [OfficeDoc]` and `bioguide?`. `OfficeDoc { office, level: federal | state | local, chamber?: upper | lower, state?, district?, from, to? }`.
- Import `congress/members.json` and `congress/slugs.json`. A member whose Bioguide ID is on a `persons/` file is that person; a member without one becomes a person with no editorial fields. `[[person:]]` refs and law sponsors resolve against both.
- `get_person` returns, beside what it returns now: `state: EntityRef?` (written, or the state of the latest office), `offices: [Office]` (the file's offices and the member's terms in Congress, newest first), `bioguide?`, `party?` (from the snapshot for a sitting member when the file has none), `sponsored: [EntityRef]` (laws naming the person as a sponsor) and `linked_from: Backlinks`. A generated member's `role` is their current or last office ("U.S. Senator from Vermont"), and their `bio` is empty.
- `record Member { person: EntityRef, chamber: Senate | House, state: EntityRef, district?, party_label, term_ends }` for C8's state pages and C11.
- `list_entities(Person)` would grow from 217 to about 800. Please consider listing only people with a `persons/` file there, and reaching members without one through state pages, links and search.
- The importer rejects a `bioguide` that is not in the snapshot, or whose snapshot slug is not the file's slug.

### C11. "Who represents me" from the snapshot, offline (ADR 0003, decision 6)

`who_represents_me` reads `https://supercitizen.org/civic-data/home/<st>.json`, which has answered 404 since supercitizen.org's production site deleted its civic routes on 2026-11-09. A stopgap serving only the members of Congress, in the fields core already parses, was committed to supercitizen.org's `main` on 2026-11-16 (`1815f50`, not yet deployed when this was written). It is meant to last until core reads members from content. Proposed:

- Answer from the imported members: the two senators of the place's state, and the representative for its district when one is set. No network.
- `Officeholder.id` becomes the person's slug, and `profile_url` gives way to `person: EntityRef`, so an app opens the person page. `sources` cite congress-legislators through `congress/README.md`, with the snapshot's build date. `on_ballot` has no source in the snapshot and should go, or be absent.
- `civic_status` reports the content snapshot as its source and its build date as `data_version`.
- The snapshot gives each member's district as Congress numbers it. The maps nine states redrew for 2026 take effect when the 120th Congress meets on January 3, 2027. Until then the snapshot cannot give the district picker those states' new districts (supercitizen.org's file carries them as `house` keys), and a place on the new map may name a district its sitting member does not hold. So switch to the snapshot with the first content release built after January 3, 2027, and keep reading supercitizen.org's file until then. Core's `redrawn` handling should keep saying which map it used.
- After the switch, whether to keep supercitizen.org as an optional source is core's call. The stopgap is meant to be removed.

### C12. Backlinks on every entity (ADR 0003, decision 7)

At import, build one index of links: from lesson bodies, from entity bodies (terms, issues, ideologies, persons, organizations, laws, cases, states) and from fields (a law's `sponsors`, `amends` and `jurisdiction`; a case's `laws`, `overrules` and its court's state; a person's `state`). Proposed:

```text
record Backlinks  { lessons: [LessonRef], entities: [EntityLink] }   // on every get_* record above, and on Term, Issue,
record EntityLink { entity: EntityRef, via: LinkVia }                //   Ideology, Person and Organization
enum   LinkVia    { Body, Sponsor, Amends, Jurisdiction, ReviewedLaw, Overrules, State, Court }
```

- Lessons in curriculum order: packs as `list_packs` orders them, then lesson order. Each `LessonRef` carries its pack's `reading_level` (C7), so an app can put the reader's level first.
- Entities grouped by kind, then sorted by name.
- An issue's `related_lessons` stays as it is: it comes from the issue's hand-kept list and need not match its backlinks.
- bettercitizen.ai computes the same lists by the same rules. If core's rules differ in any case, please say so in the CHANGELOG, so the web can follow.

## Answered by core 0.2.0

In core's commits 6bad87d, dbc339b and bf6fd4b of 2026-11-13, all on its `main` on GitHub. Core's `CHANGELOG.md` has the replies in full under "Core requests answered"; in short:

- **C1.** Done as proposed: `Figure { body, caption, source }`, and every `<svg>` is a `Drawing` where it stands, including the two inside panels in federalism/federal-vs-state. `Drawing` also carries `max_width` (C5).
- **C2.** Done for all eight components, with props read as data and children as lesson flow. Three differences from the sketch: each block is `{ props, fallback }` with a `…Props` record instead of inline fields; defaults are filled in, so a chart's bounds and ticks, `DataBarsProps.max`, `ScaleProps.start`, a map point's `y` on a two-axis map and every default color are values, not options; and `FlowProps` and `ChartProps` carry `plain`, which a renderer inside a panel needs. `PerspectiveTabs` is typed as a ninth block, and a `Perspective`'s children are lesson flow.
- **C3.** Done, as `fallback` on each typed block, holding only headings, paragraphs, lists, tables and drawings. `PerspectiveTabs` has one too, in core's own wording, because its entry in `COMPONENTS.md` names no static form. Core will follow the catalog if it words one.
- **C4.** Done for the static forms, by the rule as written. Core noted two corners, which no lesson reaches, where `components/Chart.tsx` itself departs from the rule: a y value has no `$` branch, and any `xUnit` is attached without a space. Both still stood on 2026-11-18.
- **C5.** Done for MDX lessons, which answers Apple's R22 too: the four assets are valid SVG, and `Drawing.max_width` is 300 for both drawings.
- **C7.** Done, with one difference. `PackSummary` carries `reading_level` and `topic` with the defaults filled in, `PackFilter.reading_level` keeps `list_packs` to one level, `Pack.editions` lists every edition of a pack's topic, and import refuses two packs with the same topic and level. The difference: `get_pack` takes no `reading_level`. `find_edition(slug, reading_level)` does that lookup instead, and answers with the edition's pack or with the levels the topic has. Core has no notion of the level a learner reads at, so the app holds it.

So an app that links core 0.2.0 or later gets every figure, as a typed block with a static form, and the figures are no longer a reason to stay on content at d01c1c9. The same build reads editions: in core's words, an app that links it can show one level, or group a topic's editions and mark each with its level, and one that does neither lists several packs with the same title. C9's caution about the new kinds of link is separate and still stands.

Core's changelog also lists what it found in this repo on the way. Where each stood on 2026-11-18:

- **A chart's data table is headed "Value | Value".** In immigration/02-the-strongest-cases, the foreign-born chart has one named point at 2025.5, so `Chart`'s test that every x is a year fails and the "Show the data" table loses its "Year" heading. Not fixed. Core's static form says "Year" when every unnamed point is a year; `components/Chart.tsx` should do the same, and the change then has to be vendored into bettercitizen.ai.
- **Labeled cross-references.** On 2026-11-13, 18 links in 10 lessons were written `[[kind:slug|label]]`, which neither the web's parser nor core read, so they showed as written. C9 now asks core to read the labeled form.
- **Tab names and `perspectives:`.** Five of the 40 lessons with tabs don't follow the catalog's rule that tab names match the frontmatter; core's changelog names them. Not checked again here.

## Superseded by 0.2.0

The text of C1 to C5 and C7 as filed, kept for the record. Core has answered all of it, so nothing in this section is a request any more, and its advice to stay on older content ended when 0.2.0 landed.

### Why this was urgent

On core 0.1.0, `<Figure>` is lowercased into the `<figure>` path, which looks for an `<svg>` and a `<figcaption>` and emits nothing when it finds neither (`content/markdown.rs`, `figure()`). After ADR 0001, 74 of the 75 figures hold no `<svg>`: on LiveCore they would produce no block at all. Thirty of them (the `DataBars` figures) already vanish today; the other 44 used to be drawings. The 75th keeps only the first of its two drawings and loses its text. Until C1 lands, the native apps should stay on content at d01c1c9.

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

### C7. Editions: carry `reading_level` and `topic` on a pack (ADR 0002)

A pack may now say how hard it is to read and which topic it belongs to ([ADR 0002](adr/0002-editions-one-topic-three-reading-levels.md)):

```yaml
slug: three-branches-1
title: The three branches
topic: three-branches     # the pack's own slug when absent
reading_level: 1          # 1 | 2 | 3; 3 when absent
```

Proposed:

- `PackDoc` gains `reading_level` (an integer 1 to 3, default 3) and `topic` (a slug, default the pack's slug), and `list_packs` and `get_pack` return both.
- The importer rejects two packs with the same `topic` and `reading_level`.
- `list_packs` and `get_pack` take an optional `reading_level`, as the server's `/api/v1/packs?reading_level=` does, so an app can show one level at a time.
- An app shows the level as a small mark of one, two or three bars and never as a name for the reader ("middle school"). Editions of a topic share a title on purpose.

Until this lands, core reads an edition as one more pack with the same title as its siblings. The native apps should stay on content from before the first edition pack (`packs/three-branches-1`, `packs/three-branches-2`).

### C8. Lecture scripts: import `lectures/`, and build a lecture from one (ADR 0006)

A lesson may now have a spoken script beside it, `packs/<pack>/lectures/<lesson file>.md` ([ADR 0006](adr/0006-lecture-scripts.md), [LECTURES.md](../LECTURES.md)), and the site narrates a lesson's lecture from it (bettercitizen.ai ADR 0016). Core's lecture port (`src/lecture/`) builds every lecture from the lesson's page text, so for a lesson with a script its chunks, keys and lengths no longer match the site's. No app plays core's lectures yet (both play the site's manifest), so nothing breaks today.

Proposed:

- The importer reads `packs/<pack>/lectures/*.md` (frontmatter `schema: bettercitizen.lecture/v1`, `lesson: <slug>`; at most one per lesson) and stores the body beside the lesson (the site's column is `content_lessons.lecture_md`).
- Port `parseSpokenScript` (bettercitizen.ai `src/content-schema/lecture.ts`): paragraphs become beats, each with the silence after it; `[beat]`, `[pause]`, `[long pause]`, `[pause 5s]`, `>` key lines and `##` headings set that silence from one table, `LECTURE_GAPS_MS`.
- A part with a script is its title (followed by a pause) and then its beats, one chunk each. A chunk gains `speech` (today's key: voice and spoken text) and `pause_ms`; its `key` is `speech` when `pause_ms` is 0 and otherwise the first 20 hex digits of SHA-256 of `<speech>\npause <pause_ms>`. `pause_ms` is the gap less 550 ms, rounded to a multiple of 24 (bettercitizen.ai `src/lib/lectures/pacing.ts`).
- The intro's stated length and every estimate count the pauses; the bumpers around a scripted part are followed by a pause (intro) and a beat (part marker).
- A chunk's audio is its cached speech followed by `pause_ms` of silent MP3 frames (`FF F3 84 C4`, then 188 zero bytes, per 24 ms), which a native player can also write itself when it plays from core offline.
- Add each lecture's script file to the parity recorder's file list, raise `LECTURES_FORMAT`, and re-record.
