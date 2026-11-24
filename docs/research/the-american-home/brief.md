# Writer brief: The American Home

The brief each lesson in this draft was written from. Chris's request, November 22, 2026: a lesson series on the history of American housing and the American household, from colonial times to today, written to Better Citizen's lesson standard, saved as a draft for his review and not published.

## The series

**Goal:** help learners understand what actually made homes and family life affordable in each era, so nobody points at the past and gets it wrong.

**Central question:** what made the postwar "American dream" possible, and which parts could policy realistically recreate today?

**The five measures, tracked in every lesson** so learners can compare eras: home price in years of income; household size; who worked outside the home; age at first marriage; birth rate. (The homeownership rate rides along where it helps.) The shared values and their sources are in `research/measures.md`. Use those numbers, cite those sources, and do not substitute other figures for the same measure and year. Every lesson's reading version has one figure, a two-column table wrapped in `<Figure caption="…" source="…">`, titled like "The five measures, around 1900", giving the era's values (write "no reliable figure" where the dossier has none). Its listening version says the two or three that matter most for the era.

**Lessons** (pack `the-american-home`, all in `drafts/the-american-home/`):

1. `01-land-and-the-frontier` — Colonial times to about 1890. Abundant land; the Homestead Act of 1862 and free or cheap government land as an early form of subsidy (and railroad land grants); the farm household as a unit of production; large families. Who paid: the land came from Native nations by treaty, purchase and force. Who was excluded.
2. `02-cities-boarders-and-wages` — About 1870 to 1920. Industrial cities; tenements (Jacob Riis, New York's 1901 Tenement House Act); boarders and lodgers; multigenerational homes; the shift from farm households to wage-earning households; children's wages.
3. `03-the-mortgage-and-the-new-deal` — The 1920s and 1930s. Short, high-down-payment balloon mortgages; Depression foreclosures; the New Deal housing system (HOLC 1933, FHA 1934, Fannie Mae 1938) and the long amortized mortgage; redlining and FHA underwriting, including the live scholarly debate over how much the HOLC maps themselves caused.
4. `04-the-postwar-boom` — About 1945 to 1965. The GI Bill and VA loans; Levittown and mass-produced homes; interstates (1956) and suburbs; the baby boom; young marriage; the single-earner family; strong unions; America's unique position after World War II. Be clear about who was excluded and how (racial covenants until Shelley v. Kraemer, 1948; FHA and VA practice; Levittown's own rules).
5. `05-two-earners-and-two-crashes` — 1970 to 2008. Stagflation and mortgage rates near 18 percent in 1981; the move to two-earner households; rising prices; zoning and land-use rules; the savings and loan crisis; the 2008 crash.
6. `06-the-shortage-today` — Today. The housing shortage (the estimates and why they differ); home prices in years of income; zoning, permitting and construction costs; household formation; marriage age, birth rates and childcare costs.
7. `07-what-policy-could-do` — What policy could realistically do today: one-time conditions that cannot be repeated versus levers that still exist; the tradeoffs; the strongest arguments from different perspectives (for example supply-side and zoning reform, demand-side subsidy and finance, tenant protection and public housing, family policy). Ends with a short further-reading list: Stephanie Coontz, *The Way We Never Were* (1992); Kenneth T. Jackson, *Crabgrass Frontier* (1985); Richard Rothstein, *The Color of Law* (2017), each with a sentence on where its interpretation is debated.

Each lesson's closing section points to the next lesson; lesson 7's points back to the central question.

## Teaching requirements (Chris's)

- Concrete stories, people and numbers, not abstractions. Open each lesson on a real person, place or document.
- Separate well-established facts from contested interpretations, and present the main sides of any debate fairly. No partisan framing.
- Distinguish one-time conditions that can't be repeated from policy levers that still exist. Say which is which, in every era.
- Avoid both nostalgia and cynicism.
- After each `##` section, a recall pair: a `<Checkpoint>` whose question begins "In your own words" asking the reader to restate the section's key idea (its answer is a model restatement), then, after at least one sentence of prose, a challenge question (`<Checkpoint>` or `<QuickCheck>`) that applies the idea to a case the section did not discuss. One question at a time. The closing section has no check.
- Cite sources for key numbers. Save as a draft; do not publish.

## The standard

Read before writing, in this order:

1. `LESSON_SPEC.md`: the lesson spec, version 1.0.0. It is the standard; follow it. Path: `/Users/chris/Repos/mine/SuperCitizen/bettercitizen-content/.claude/worktrees/spoken-lectures/LESSON_SPEC.md`.
2. An exemplar, all three files: `packs/electoral-college/lessons/01-how-it-works.mdx`, `lectures/01-how-it-works.md`, `assessments/01-how-it-works.yaml`; and the canonical lecture `packs/three-branches/lectures/01-overview.md`. A contested pack to study for perspectives: `packs/housing/` (all of it; this series should point to it where today's policy debate is concerned). All under `/Users/chris/Repos/mine/SuperCitizen/bettercitizen-content/.claude/worktrees/spoken-lectures/`.
3. For the craft and the reasons: `STYLE.md`, `LECTURES.md` and `COMPONENTS.md` (component props) in the same folder.

The pack is `contested: true` and `level: intermediate`, reading level 3. So:

- Every lesson's frontmatter has `perspectives:` naming the interpretations the lesson presents, and the reading version presents them in `<PerspectiveTabs>` with matching `<Perspective name="…">` tabs, each at its strongest, attributed to real scholars or schools. The listening version gives each perspective its turn by the spec's contested-lecture rules, including one steel-man pause with `[pause 5s]`.
- Reading version: 1,400 to 2,400 words of prose; listening version 1,800 to 2,800 spoken words (never over 3,000, never under 60 percent of the lesson's prose); assessment 4 or 5 questions, the last a free response with a `socratic_seed`.
- `[[term:slug]]` and other links must name slugs that exist: check with `ls /Users/chris/Repos/mine/SuperCitizen/bettercitizen-content/glossary/` (and `issues/`, `ideologies/`, `organizations/`). There is no `housing` issue: link the specific ones that exist, such as `[[issue:zoning-reform]]`, `[[issue:nimby-and-yimby]]`, `[[issue:rent-control]]`, `[[issue:public-housing]]`, `[[issue:low-income-housing-tax-credit]]`, `[[issue:mortgage-interest-deduction]]` or `[[issue:child-tax-credit]]`, and name the existing `housing` pack ("U.S. Housing Policy") in plain words. Three to eight links a lesson. `concepts:` should be existing glossary slugs too.
- `sources:` frontmatter lists what the lesson actually rests on, each with a year in its citation. Every URL must be one you fetched and confirmed. Never invent a URL, DOI, page number or quotation; if you cannot verify a claim, soften it or cut it. Quotations are exact and attributed; paraphrase when you cannot confirm the wording.

## Files and checks

Write exactly three files for your lesson, and nothing else:

- `drafts/the-american-home/lessons/<file>.mdx`
- `drafts/the-american-home/lectures/<file>.md`
- `drafts/the-american-home/assessments/<file>.yaml`

`pack.yaml` already lists every lesson; do not edit it or another lesson's files. Then check your lesson with the app's validator, which runs the same checks as the MCP tool `validate_lesson`:

```sh
cd /Users/chris/Repos/mine/SuperCitizen/bettercitizen.ai/.claude/worktrees/spoken-lectures
CONTENT_LOCAL_PATH=/Users/chris/Repos/mine/SuperCitizen/bettercitizen-content npx tsx scripts/validate-lesson.ts /Users/chris/Repos/mine/SuperCitizen/bettercitizen-content/drafts/the-american-home <file>.mdx
```

Fix every error. Fix warnings where you can; for any you keep, say why in your report. Do not commit anything, and do not touch any other file or repository.

Your report back: the lesson's title, its word counts (reading and listening) and its validator result; the perspectives you used; every claim you could not fully verify and what you did with it; and any warnings you kept, with why.
