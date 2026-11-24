# Writer brief: 250 Years of America in the World

The brief each lesson in this draft was written from. Chris's request, November 22, 2026: a lesson series covering roughly 250 years of American history, 1776 to today, written to Better Citizen's lesson standard, saved as a draft for his review and not published.

## The series

**Goal:** a clear arc of history: what made the United States what it became as a country, a culture and a people, and how the rest of the world shaped that at each stage. The ebbs and flows, where America stood in the world in each era, and why. Learners should come away knowing which American advantages came from geography and timing, which came from choices and policy, and which came from the troubles of other nations.

**Recurring threads, in every lesson:** geography and resources; immigration; the role of government versus private enterprise; the myth and the reality of self-reliance; America's position relative to other powers; and who shared in prosperity and who was left out.

**Shared measures.** `research/measures.md` holds sourced values for where America stood at each benchmark year (population, share of world output, income per person against Britain and Western Europe, foreign-born share, federal spending, manufacturing share, trade, defense). Use those numbers, cite those sources, and do not substitute other figures for the same measure and year. Every lesson's reading version has one figure, wrapped in `<Figure caption="…" source="…">`, showing where America stood in its era (a two-column table, or `DataBars`), and its listening version says the one or two numbers that matter most.

**Every lesson sorts the era's American advantages** into the three kinds the goal names (geography and timing; choices and policy; the troubles of other nations), saying plainly where historians disagree about which kind something was.

**Lessons** (pack `america-in-the-world`, all in `drafts/america-in-the-world/`):

1. `01-founding` — 1776 to 1800: the colonial economy; Enlightenment ideas; the Revolution and the Constitution; the Britain–France rivalry that made independence possible (French alliance, 1778).
2. `02-expansion` — 1800 to 1860: the Louisiana Purchase; westward expansion and the displacement of Native nations (Indian Removal Act, 1830); slavery and a cotton economy tied to British mills; immigration; the market revolution.
3. `03-civil-war-and-reconstruction` — 1860 to 1877: the war, emancipation, the Reconstruction amendments, Reconstruction's end; Britain and France's choice not to intervene; what the war settled and what it did not.
4. `04-industrial-rise` — 1870 to 1914: railroads; mass immigration; giant corporations; labor conflict; European empires at their height and America's own turn outward (1898).
5. `05-war-boom-and-depression` — 1914 to 1941: World War I and the shift from debtor to creditor; the 1920s; immigration restriction (1924); the Depression, tariffs and the New Deal.
6. `06-the-american-century` — 1941 to the early 1960s: World War II and postwar dominance; Bretton Woods (1944); the Marshall Plan (1948); the Cold War; why the position was partly the ruin of every rival.
7. `07-civil-rights-and-the-sixties` — The civil rights movement (Brown, 1954; the Civil Rights Act of 1964; the Voting Rights Act of 1965); the Immigration and Nationality Act of 1965; the Cold War's pressure on segregation; Vietnam and the decade's divisions.
8. `08-the-1970s-turn` — Oil shocks (1973, 1979); the end of the gold-linked dollar (1971); stagflation; rising competition from Europe and Japan.
9. `09-globalization` — 1980 to 2008: deregulation; globalization; the end of the Cold War (1991); China joining the WTO (2001); the internet.
10. `10-since-2008` — The financial crisis; China's rise; polarization; artificial intelligence. Ends with what the 250-year arc does and does not tell us about what comes next.

Each lesson's closing section points to the next lesson; lesson 10's points back to the series' question.

## Teaching requirements (Chris's)

- Concrete stories, people and numbers, not abstractions. Open each lesson on a real person, place or document.
- Separate facts from interpretation; treat contested questions fairly, with the main sides at their strongest. No partisan framing.
- Avoid both triumphalism and cynicism: say what each era built, what it cost and who paid.
- After each `##` section, a recall pair: a `<Checkpoint>` whose question begins "In your own words" asking the reader to restate the section's key idea (its answer is a model restatement), then, after at least one sentence of prose, a challenge question (`<Checkpoint>` or `<QuickCheck>`) that applies the idea to a case the section did not discuss. One question at a time. The closing section has no check.
- Cite sources for key claims. Save as a draft; do not publish.

## The standard

Read before writing, in this order:

1. `LESSON_SPEC.md`: the lesson spec, version 1.0.0. It is the standard; follow it. Path: `/Users/chris/Repos/mine/SuperCitizen/bettercitizen-content/.claude/worktrees/spoken-lectures/LESSON_SPEC.md`.
2. An exemplar, all three files: `packs/electoral-college/lessons/01-how-it-works.mdx`, `lectures/01-how-it-works.md`, `assessments/01-how-it-works.yaml`; and the canonical lecture `packs/three-branches/lectures/01-overview.md`. A contested pack to study for perspectives: `packs/immigration/` or `packs/foreign-policy/`. All under `/Users/chris/Repos/mine/SuperCitizen/bettercitizen-content/.claude/worktrees/spoken-lectures/`.
3. For the craft and the reasons: `STYLE.md`, `LECTURES.md` and `COMPONENTS.md` (component props) in the same folder.

The pack is `contested: true` and `level: intermediate`, reading level 3. So:

- Every lesson's frontmatter has `perspectives:` naming the interpretations the lesson presents (real schools of historical interpretation, such as Bernard Bailyn's ideological reading of the Revolution against Charles Beard's economic one), and the reading version presents them in `<PerspectiveTabs>` with matching `<Perspective name="…">` tabs, each at its strongest and attributed. The listening version gives each perspective its turn by the spec's contested-lecture rules, including one steel-man pause with `[pause 5s]`.
- Reading version: 1,400 to 2,400 words of prose; listening version 1,800 to 2,800 spoken words (never over 3,000, never under 60 percent of the lesson's prose); assessment 4 or 5 questions, the last a free response with a `socratic_seed`.
- `[[term:slug]]` and other links must name slugs that exist: check with `ls /Users/chris/Repos/mine/SuperCitizen/bettercitizen-content/glossary/` (and `issues/`, `ideologies/`, `organizations/`). Three to eight links a lesson. `concepts:` should be existing glossary slugs too.
- `sources:` frontmatter lists what the lesson actually rests on, each with a year in its citation. Every URL must be one you fetched and confirmed (archives.gov, history.state.gov, loc.gov, census.gov, constitution.congress.gov, founders.archives.gov, avalon.law.yale.edu and the like are good). Never invent a URL, DOI, page number or quotation; if you cannot verify a claim, soften it or cut it. Quotations are exact and attributed; paraphrase when you cannot confirm the wording.

## Files and checks

Write exactly three files for your lesson, and nothing else:

- `drafts/america-in-the-world/lessons/<file>.mdx`
- `drafts/america-in-the-world/lectures/<file>.md`
- `drafts/america-in-the-world/assessments/<file>.yaml`

`pack.yaml` already lists every lesson; do not edit it or another lesson's files. Then check your lesson with the app's validator, which runs the same checks as the MCP tool `validate_lesson`:

```sh
cd /Users/chris/Repos/mine/SuperCitizen/bettercitizen.ai/.claude/worktrees/spoken-lectures
CONTENT_LOCAL_PATH=/Users/chris/Repos/mine/SuperCitizen/bettercitizen-content npx tsx scripts/validate-lesson.ts /Users/chris/Repos/mine/SuperCitizen/bettercitizen-content/drafts/america-in-the-world <file>.mdx
```

Fix every error. Fix warnings where you can; for any you keep, say why in your report. Do not commit anything, and do not touch any other file or repository.

Your report back: the lesson's title, its word counts (reading and listening) and its validator result; the perspectives you used; every claim you could not fully verify and what you did with it; and any warnings you kept, with why.
