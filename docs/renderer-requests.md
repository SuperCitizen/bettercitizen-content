# Requests to the renderers: bettercitizen.ai and the native apps

What [ADR 0001](adr/0001-figures-are-content.md) (figures are content, not drawings) needs from each repo that draws lessons. Core's part is in [`core-requests.md`](core-requests.md). Written 2026-11-09 against bettercitizen.ai at 57abf16 and the app repos as their status notes described them that week. Nothing here has been changed in those repos, except that bettercitizen.ai's vendored `src/components/lesson-mdx/` was refreshed at Chris's request (W1). W2, W4 and W6 were measured on the running site that day, and W2 was then fixed there (see its status). Both changes were committed on bettercitizen.ai's `main` on 2026-11-13.

## bettercitizen.ai (the web)

**W1. Vendor `components/` before seeding this content.** Run `pnpm vendor:lesson-components`. It brings six new files (`Panels`, `Flow`, `Chart`, `PositionMap`, `Scale`, `Ballot`) and changes to `DataBars`, `Timeline`, `ProcessFlow`, `Path270`, `GerrymanderLab`, `lib` and `index`. Until it runs, `LessonBody` falls back to plain-Markdown rendering for every lesson that uses a new component: its pre-flight call to the compiled body throws on a tag missing from the catalog, so the reader would see raw JSX. `pnpm validate-content` passes on the new content either way, because the validator doesn't check component names.

Status, 2026-11-09: vendored at Chris's request into `src/components/lesson-mdx/`, identical to `components/` here, and committed on `main` on 2026-11-13 (not yet pushed). With that copy the whole-app type-check, lint on the folder and the 46 lesson-renderer tests pass. Then checked on the running site against a scratch database (`bettercitizen_figures_check`: created, migrated, seeded with this content, and dropped afterwards; the shared `bettercitizen` database was not touched). All 149 lessons render with no fallback and all 75 figures are present. No figure sticks out of its column on the plain page at 320, 375, 768, 1,024 and 1,440 px, at 375 px with the lesson 35 percent larger, or in the windowed mode at 360, 375 and 1,280 px. The chart readout, the slider, the position map and the ballots respond to keyboard and pointer. Still to do: push it, bring it into every worktree that runs the app, and only then reseed the shared database (`pnpm db:seed` for the reference data, `pnpm content:seed` for the lessons). Reseeding first would turn lesson pages into raw text on any dev server still running the old catalog.

**W2. Lesson tables are cut off on a phone.** Measured on the running site: of the 109 tables in lesson prose (94 lessons), 93 are wider than the lesson column at a 375 px viewport (85 lessons, by up to 352 px) and 101 at 320 px; one is 21 px too wide at 1,024 px. The column at 375 px is 299 px. The table does not scroll: `.app-2col > main` has `overflow-x: hidden`, so whatever lies past the right edge is not shown (a four-column table loses its last column and half of the third). The cause is `.prose-editorial th, td { padding: 10px 14px }` on a table that cannot shrink below its longest words. No figure is a table any more, so this is only about tables in prose. Proposed, in order of effort: give each table a wrapper that scrolls sideways, so nothing is lost; cut cell padding to `6px 8px` under about 30em; and for tables of four or more columns, reflow each row into a labeled card on a phone, which the native apps will want from core's `Table` block too.

Status, 2026-11-09: fixed in bettercitizen.ai at Chris's request, and committed on `main` on 2026-11-13 (not yet pushed). `src/components/learn/lesson-tables.ts` is a rehype plugin in `LessonBody`'s MDX pipeline: it wraps each Markdown table in `div.lesson-table`, gives every cell an `aria-hidden` label with its column's name, and sets explicit table roles so the semantics survive. `editorial.css` then turns each row into a card when the table's own column is under 36em (612 px), using a container query on the wrapper, so it behaves the same on the plain page and in an OS window. A table that fits the narrowest phone stays a table (`data-fit="compact"`: 3 of the 108), a row of short values sits side by side (`data-cells="short"`), and five tables estimated near the column's full width get a sideways scroller as a last resort (`data-fit="wide"`). Checked on the running site against a scratch database, since dropped: all 149 lessons on the plain page at 320, 375, 414, 540, 654, 690, 768, 1,024 and 1,440 px. No table and no figure sticks out at any of them; under 612 px 105 tables are cards and 3 stay tables, and from 768 px up all 108 are tables as before. Sixty lesson-renderer tests pass (14 of them new) and lint is clean. The whole app type-checked before the plugin's last refinement, and the plugin type-checks on its own since. Not checked: the windowed mode separately (the switch depends only on the column's width), a screen reader, and `pnpm build`. A lesson that fails to compile still renders plain tables through the Markdown fallback.

**W3. Dark `--muted` is under AA on the card surface.** `#8a8270` on `#262219` is about 4.1:1, and the components use it for small text (block labels, sources, notes). The Windows app raised its equivalent to `#9D9582` for the same reason. The light palette is fine (5.6:1).

**W4. Three panels fit the real column: nothing to do.** Measured on the running site with Newsreader: the lesson column is 668 px (39em of the 17 px lesson text) at 768 and 1,440 px, and 630 px (37em) at 1,024 px, where the rail takes room. Three panels need 30em, so all five three-panel figures sit in a row from 768 px up, and all eleven panel groups stack at 375 px.

**W5. Nothing else is needed for the interactive pieces.** `Chart`, `PositionMap`, `Scale` and `Ballot` are client components with local state; `DataBars` no longer is one (it has no animation and renders its final widths on the server). `Scale` and `Ballot` use native range and radio inputs with `accent-color`.

**W6. Glossary tooltips widen the page.** `.prose-editorial a.term-ref::after` is the definition tooltip: `position: absolute; left: 0; width: min(320px, 74vw)`, hidden with `opacity: 0; visibility: hidden`. Hidden, it is still laid out, so wherever a term sits in the right part of a line the tooltip reaches past the column. On the plain page `main`'s `overflow-x: hidden` clips it. In the windowed mode `body` has `overflow-x: auto`, so a lesson window scrolls sideways into blank space: measured at a 375 px window, 139 px on three-branches/overview (no table in it) and 157 px on american-conservatism/what-it-believes. Proposed: keep the tooltip inside the column, for instance by anchoring it to the paragraph (`left: 0; right: 0; width: auto` on a positioned block ancestor) instead of to the term.

**W7. The lesson column on a phone.** At 375 px the plain page gives the lesson 299 px, about 80 percent of the screen; the windowed mode gives it 335 px. Every figure fits either way. But each 10 px returned to the column is about one more character in every table column and panel line, so it is worth a look alongside W2.

## Every native app (Apple, Android, Windows, Linux)

**N1. Stay on content at d01c1c9 until core answers C1 to C3.** On core 0.1.0 a figure with no `<svg>` produces no block, so this content would show 74 of its 75 figures as nothing (`core-requests.md` has the detail).

**N2. An order that never leaves a figure blank:**

1. `Figure` as a captioned container: its body, then caption and source as secondary text, grouped for the screen reader.
2. Core's static form (C3) for any component without a native renderer yet. From here on every figure is at least a correct table or list.
3. Native `DataBars`, `Flow` and `Panels`: together they are 60 of the 75 figures.
4. `Timeline`'s `tag`, `tone` and `expanded`; then `Chart` and `PositionMap`.
5. The exercises: `Scale` and `Ballot`.

**N3. Layout rules, so every platform breaks at the same place.** All measured in em of the reader's current text size, so larger text reflows sooner:

- `Panels`: one row only if every panel can be at least 11.5em wide (two panels), 9.5em (three) or 8.5em (four). Otherwise every panel is full width, in source order. Never a partial row.
- `Flow`: a row of nodes sits side by side only if each node can be at least 7.5em wide, or 6.5em in a row of two. Two stages with the same number of nodes are lanes: each node's arrow comes from the node above it.
- `DataBars`: label and value share a line, the bar is beneath at full width. Never put the value inside the fill.
- `Chart`: the plot takes the column's width at a fixed height of about 13em; labels stay at text size; never scale the chart as a picture. A label that would leave the plot shifts or wraps inside it. A series drawn as points has a dot in the key, not a line.
- `Ballot`: ballots wrap; a score ballot needs about 13.5em, a ranked one 11.5em, pick-one 9em. On a score ballot every bubble shows its number, and a candidate's name sits beside its bubbles only when the ballot is about 19em wide; otherwise above them.
- Nothing scrolls sideways, and nothing shrinks its text to fit.

**N4. What the screen reader should hear.**

- `Panels`: a group named by its title; each panel's title is a heading; read panel by panel.
- `Flow`: an ordered list. Arrows are decoration; `via`, `between` and `note` are read in place.
- `DataBars`: a list of "label, note, value"; bars are decoration; the marker is read once.
- `Chart`: an adjustable element that reads one point per step ("1930: 11.6%"), plus the data as a table.
- `PositionMap`: buttons named "3. Social democracy"; the numbered list is the content.
- `Scale`: a slider whose value text is the count, its zone and the zone's detail; the zone list is always present.
- `Ballot`: radio groups, one per candidate row on the ranked and score ballots; "On this ballot: …" is announced when it changes.

**N5. Color.** A `tone` is one of core's eight tokens ("Figure colors" in `core-api.md`) and only ever decorates a rule, a dot or a bar. Text is ink on the surface. Text on an ink fill (a selected chip) uses the surface color. No text in white on a tone.

**N6. Drawings.** Two remain, with no text in them. Draw one no wider than its viewBox (300 units), centered. Apple's zoom viewer still applies to them.

## Notes for single apps

- **Apple.** `FigureRenderer` keeps its job for `Drawing`, on four assets instead of ninety. MockCore's figures are PNGs rasterized from the old SVGs by `scripts/make-mock-fixtures.rb`; when the fixtures are rebuilt from this content those figures become components, so MockCore needs the new blocks as much as LiveCore does. LiveCore's coverage test that draws all 45 figures should count drawings, not figures.
- **Windows.** Its MockCore parses the lessons itself ("every one of the 111 lessons with no fallback blocks"), so it will meet `Panels`, `Flow`, `Chart`, `PositionMap`, `Scale` and `Ballot` as unknown tags, and props that are JavaScript literals rather than strings.
- **Android and Linux.** Both install a content subset (Android from a checkout, Linux from `data/sample-content`); refreshing either subset brings the new components with it.
