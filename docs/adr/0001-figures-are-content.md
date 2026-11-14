# 0001: Figures are content, not drawings

Status: accepted, 2026-11-13. Written on 2026-11-09 at Chris's direction ("content that reflows instead of drawings that shrink"; then "make the lesson data and graphics truly great, include any 3D or interactive when it helps the learner learn"). Accepted when Chris had it committed.

This decision crosses repos. It lives here because bettercitizen-content owns the lesson format and the component catalog (`COMPONENTS.md`). What it asks of bettercitizen-core, bettercitizen.ai and the four native apps is in [`../core-requests.md`](../core-requests.md) and [`../renderer-requests.md`](../renderer-requests.md).

## Context

At d01c1c9 the lessons had 75 figures. Thirty were `<DataBars>` charts. Forty-five were hand-drawn inline SVG, each 720 units wide with labels 11 to 15 units tall.

A drawing can only scale. In a phone's reading column (about 300 px on bettercitizen.ai) a 720-unit drawing is shown at 42 percent, so a 12-unit label is 5 px. The web showed them that way, and so did the Apple app once it drew the figures natively (its ADR 0005); its answer was a viewer for zooming into a figure. Zooming works, but it treats the symptom.

The drawings had other costs:

- Their words were pixels to assistive technology: one `aria-label` per figure stood in for up to thirty labels, and text inside a drawing does not follow the reader's text size.
- Several carried meaning by color alone (the healthcare calendar's blue, burgundy and gold dots), and their captions pointed at colors and line styles.
- White text on token fills lost its contrast on the dark palette, where the tokens turn pale. Some labels overlapped (the Laffer curve), and the checks-and-balances arrows ran through their own labels.
- Each native app needs an SVG renderer, because core will not render figures (Apple R17). Core copies each drawing as the JSX it was written in, so the assets are not valid SVG (Apple R22).
- Two line charts drew curves through points nobody had sourced: the Keeling curve was a hand-drawn schematic, and the wealth-share figure labeled its trough "late 1970s" and drew it in 1968. A third, the debt chart, spaced 28 years and 7 years the same distance apart.

Most of the forty-five were not pictures at all. They were lists, comparisons, processes, timelines and a few numbers, set as boxes and arrows.

## Decision

1. **A figure is structure and text.** Authors write what the figure is; every renderer lays it out for the width and the text size it has. Nothing is a fixed canvas, and nothing scrolls sideways.

2. **`<Figure caption source>` wraps any figure content:** a catalog component, a Markdown table or list, a paragraph, or a drawing. The caption describes the content and never the drawing.

3. **The forms, and how each lays out.** Breakpoints are in em of the reader's text size, so larger text reflows sooner.

   | Form | Data | Narrow | Wide |
   | --- | --- | --- | --- |
   | Markdown table | A few numbers or single words: two columns, or three when every cell is that short | The same table | The same table |
   | `Panels` (new) | 2–4 `Panel`s: `title`, `tone?`, Markdown body | Every panel full width, in source order | One row of equal columns. All or nothing: never two above one |
   | `Flow` (new) | `steps[]`: one node (`title`, `detail?`, `tone?`, `via?`) or `nodes[]`; plus `label?`, `between?`, `note?`; `numbered?` | Stages top to bottom; a row of 3 or more nodes stacks; a pair stays side by side | The same, with rows of nodes side by side |
   | `Timeline` (revised) | `events[]`: `date`, `title`, `detail?`, `tag?`, `tone?`; `expanded?` | One event per row; a long title drops under its date | The same |
   | `DataBars` (revised) | `bars[]` or `groups[]` of `label`, `value`, `color?`, `note?`; `unit?`, `max?`, `marker?`, `stacked?` | Label and value on one line, bar beneath | The same |
   | `Chart` (new) | `series[]` of `[x, y]` points; ticks, `marks?`, `rules?`, `bands?`; `schematic?` | The plot stretches to the column; every label is text at the reader's size | The same, wider |
   | `PositionMap` (new) | `x`, `y?` axes (`label`, `low`, `high`); `points[]` (`label`, `x`, `y?`, `detail?`); `spans?` | Numbered markers on the map, numbered list beneath | The same |
   | `Scale` (new) | `zones[]` (`upTo`, `label`, `detail?`), `max`, `unit?`, `start?`, `examples?` | Readout, band and slider, zone list | The same |
   | `Ballot` (new) | `candidates[]`, `methods[]` of pick, rank, score; preset marks; `averages?` | One ballot per row | Ballots share a row where they fit |

   `COMPONENTS.md` has each one's props and its **static form**: the table, list or sentences a renderer shows before it has built the interactive version.

4. **Interaction where it teaches, and only there.** Four of the new components respond to the reader: a chart reads out any point, a position map links a marker to its explanation, a scale lets the reader cross the Senate's thresholds, and a ballot can be marked. Each renders its whole content on the server and without script; interaction adds exploration and hides nothing. `Scale` and `Ballot` count as a lesson's one simulator.

5. **No 3D.** None of the 75 figures has a third dimension to show. A 3D bar or an extruded map adds occlusion and perspective error to values a flat chart reads exactly, and it would need a renderer on five platforms. If a lesson ever teaches something whose shape is spatial, that is the time.

6. **A drawing stays only when its shape is the content and no component draws it.** It carries no text, is about 300 units wide, sits in a `Panel` (so two drawings to compare stack on a phone), uses the eight tokens, and stays inside the SVG subset every platform draws. One figure qualifies today: Grodzins's layer cake and marble cake, as two small drawings.

7. **Rules that came out of the audit**, now in `STYLE.md`:
   - Every plotted number is a claim and is sourced like one. A curve that cannot be cited point by point is `schematic`, or it becomes the two or three values that can be.
   - Color never carries meaning alone, and captions never point at a color or a line style.
   - No party colors: never red for one party beside blue for the other.
   - Text on a token fill uses the surface color, never hard-coded white.
   - A table must fit a phone, because its columns cannot stack: two columns, or three of numbers or single words. Sentences that are compared, and anything on two tracks, go in `Panels`.

## What changed in the content

All 45 drawings were rewritten, in 44 lessons across 31 packs. Three more lessons changed only a chart's unit or colors, and all 32 packs touched have their version bumped a minor.

| Form | Figures | Which |
| --- | --- | --- |
| `Flow` | 13 | The conservative and libertarian family trees; the dark-money routes; Article V; housing filtering; who lobbies whom; the two doors and the three-prong test (PACs); confounding; school-district money; the two assembly lines of federal law; the life of a mail ballot; the three forms of city government (three small flows in panels) |
| `Panels` | 9 | The three branches; checks and balances; federal, concurrent and state powers; Citizens United before and after; where a political dollar can go; the three faces of a party; the two cakes; the two tracks of gerrymandering doctrine; the 2024 primary calendars of both parties |
| `DataBars` | 8 | The discount-rate gap; green cards by category; debt against the 1946 record; tax owed on each bracket step; three counting rules over the same ballots; center squeeze; the top 0.1 percent's wealth share; the 1,779 policy issues. The 30 existing charts gained the phone layout |
| `Chart` | 5 | The Keeling curve, now NOAA's 67 annual means instead of a schematic line; the foreign-born share; the calibration plot; the Laffer curve; elastic and inelastic supply (two small charts in panels) |
| `Timeline` | 3 | Incorporation of the Bill of Rights; the Electoral College's inversions and fixes; the 2025–2032 health-policy calendar, with each event's kind as a word |
| `PositionMap` | 3 | The socialist family on two axes; libertarianism's scope-of-state spectrum; the three communitarian streams |
| `Ballot` | 3 | Pick one against a ranked ballot; pick, rank and score; a score ballot beside the city's averages |
| `Scale` | 1 | 51, 60 and 67 senators |

(Some figures use two forms; the counts name the main one.)

Facts were carried over word for word. Where a drawing implied numbers it never stated, they were either sourced or dropped: the Keeling curve is now NOAA's published series (file of October 9, 2026); the foreign-born line's eighteen census values were already encoded in the drawing and are now readable; the wealth-share figure keeps only the three values its source and caption state. Nine captions lost a reference to a color, an arrow or a dashed line. One chart (the Alaska transfer count) and one drawing (the 2024 primary calendar) showed Republicans in red and Democrats in blue; the chart uses neutral tones now and the calendar is two panels with no tone of their own. That calendar and the gerrymandering tracks were first rewritten as three-column tables; the check on the running site showed that a three-column table does not fit the web's phone column, so both became panels.

## Consequences

- **A phone, a desk, a screen reader and large text all get the same figure.** Checked twice. First in a harness that runs the web's pipeline (MDX, GFM, the real components, the web's lesson CSS) at 375 px and 1,100 px, in both palettes. Then on bettercitizen.ai itself, running against a scratch database seeded with this content: all 149 lessons on the plain page at 320, 375, 768, 1,024 and 1,440 px and at 375 px with the lesson 35 percent larger, and in the site's windowed mode at 360, 375 and 1,280 px. All 75 figures render, none sticks out of its column, and the chart readout, the slider, the position map and the ballots respond to keyboard and pointer. The site's phone column turned out narrower than the harness assumed (299 px, not 343). That is what sent the two tables to panels, made chart labels wrap inside the plot and put each score-ballot name above its bubbles. `npm run check` and the web's `validate-content` pass.
- **The catalog grows by six components** (`Panels`, `Flow`, `Chart`, `PositionMap`, `Scale`, `Ballot`), and `DataBars`, `Timeline` and `Figure` change. Each needs a renderer on the web (done here: the web vendors `components/`) and, in time, natively on Apple, Android, Windows and Linux. The static forms exist so that no app is blocked on that: core can hand every app a correct table or list on day one.
- **Order matters.** bettercitizen.ai must vendor the new `components/` before it seeds this content, or lessons with new components fall back to raw text. And on bettercitizen-core 0.1.0 as built, a `<Figure>` with no `<svg>` in it produces no block at all, so on LiveCore 74 of the 75 figures would vanish (the 30 chart figures already do; this adds the 44 that used to be drawings). Core's answer to Apple's R21 unblocks all of them; until then the native apps should stay on content at d01c1c9.
- **The native SVG problem shrinks from 90 assets to 4** (two drawings, two palettes), with no text in them. Apple's FigureRenderer and its zoom viewer stay useful for those and for anything drawn later; R22 still applies to them.
- **Authors lose the free-form canvas.** A figure that fits no form needs a conversation about a new component, not an SVG. That is intended: each form is a renderer on five platforms.
- **The web's lesson tables are cut off on a phone.** On the running site at 375 px, 93 of the 109 tables in lesson prose (85 of the 94 lessons that have one) are wider than the 299 px column, by up to 352 px, and the page clips them instead of scrolling. No figure is a table any more, but the prose tables needed the web's renderer to lay them out. That is done in bettercitizen.ai (W2 in `docs/renderer-requests.md`): under 612 px of column a row becomes a card, and no table is cut off at any width checked.
