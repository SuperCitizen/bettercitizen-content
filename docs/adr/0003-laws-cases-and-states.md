# 0003: Laws, court cases and states are pages that lessons link to

Status: accepted, 2026-11-16. Written at Chris's direction: content should be a web of linked pages, where a lesson that names a law opens the law's page, the law's sponsors open their person pages, and a person's state opens the state's page, which lists that state's lawmakers and laws. On 2026-11-16 Chris decided its three open choices as written here: a state's slug is its lowercase postal code (decision 4); members of Congress are built from congress-legislators and GovInfo's BILLSTATUS, matched to supercitizen.org by Bioguide ID, and `congress/` is dedicated CC0 (decision 6); and a law's sponsor may be a name with no page (decision 2).

This decision crosses repos. It lives here because bettercitizen-content owns the cross-reference syntax and the formats of the things lessons link to. The order in which bettercitizen.ai, bettercitizen-core, this repo and the native apps take it up is decision 10. What it asks of core is C8 to C12 in [`../core-requests.md`](../core-requests.md).

## Context

Lessons link five kinds of thing today. The 174 lessons hold 747 links, in 165 of them: 619 to glossary terms, 48 to issues, 32 to ideologies, 30 to persons and 18 to organizations. The syntax is `[[kind:slug]]`, shown as the entity's name, and bettercitizen.ai (`SHORTCODE_RE` in `src/content-schema/parse.ts`) and core (`split_cross_refs` in `content/markdown.rs`) read it the same way.

The things lessons name most often have no page. Measured on 2026-11-16 (decision 11 has the method), 115 of the 174 lessons name an Act or a court case, and between them they name about 157 Acts and 290 cases. The One Big Beautiful Bill Act is named in 16 lessons, *Buckley v. Valeo* and *Citizens United v. FEC* in 11 each, the Voting Rights Act and the Inflation Reduction Act in 10 each. Every one of those mentions is plain text. The nearest thing to a link is a citation in the lesson's `sources:`.

Four glossary terms and two issues are about a single case or law already: the terms `citizens-united` (linked from 6 lessons), `war-powers-act` (2), `roe-v-wade` (2) and `brown-v-board-of-education` (1), and the issues `citizens-united` and `voting-rights-act-restoration`. They are the closest the format comes to a case or law page.

States have no page, and persons say where they serve only in prose. Bernie Sanders's file says "US Senator from Vermont" in `bio_md` and nowhere else. By a match on names, 42 of the 217 persons have served in Congress since 2023, and none has a structured state, office or Bioguide ID, so nothing can list Vermont's senators or say which lessons mention a Vermont officeholder.

Three systems each hold members of Congress, and none of them is this repo:

- bettercitizen.ai imports federal officeholders from GovTrack into its own database (`src/civic-data/govtrack-importer.ts`) with slugs it makes itself (`src/civic-data/slugify.ts`: first and last name, then the state, then the district). This repo's README says officeholders are not authored here for that reason.
- bettercitizen-core answers "who represents me" from `https://supercitizen.org/civic-data/home/<st>.json` (`civic.rs`). supercitizen.org's production `main` deleted its civic routes on 2026-11-09, so that file is a 404, and the answer is empty for any learner without a cached copy. A stopgap that serves the members of Congress alone, under the same path and field names, was committed to supercitizen.org's `main` on 2026-11-16 (`1815f50`, not yet deployed when this was written), and is meant to go once BetterCitizen reads members from its own content.
- supercitizen.org's `development` branch mirrors unitedstates/congress-legislators (639 members of the 118th and 119th Congresses, `data/civic/generated/legislators.json`) and a selection of GovInfo's BILLSTATUS bulk data (208 bills that had a contested floor vote and 102 that never got one, `data/civic/bills/`). Its ADR-0009 gives each person a frozen slug and a crosswalk of outside ids, separates a Bill from the Policy (a law or a ruling) it becomes, and moves bulk data from git to Postgres. Its frozen slug table covers 237 members, those who were not 2026 candidates, and one of them already differs from this repo: it has `marjorie-greene` where `persons/` has `marjorie-taylor-greene`.

Nothing computes backlinks. An issue's related lessons are a list kept by hand (`related_lesson_slugs`), and no page says which lessons link to it.

## Decision

### 1. Three new collections

`laws/`, `cases/` and `states/` hold one YAML file per entity, as `glossary/` and `persons/` do. Every file has:

- `summary`: one or two plain sentences, used in lists, hover cards and search.
- `body_md`: the page itself, written under the rules for lesson prose: Markdown, cross-references and the component catalog, no `import` or `export`, and every figure rule of ADR 0001. A law or case body runs 300 to 900 words, a state body 300 to 700.
- `sources`: at least one, in the lesson format (`type`, `citation`, `url`).

Pages are neutral in the way lessons are. A law page says what the law does and a case page what the court held, and any judgment of either is attributed to the people who made it.

A slug never changes once published.

### 2. Laws

A law page is about a named statute or bill: an Act of Congress, a state statute, or a bill that was never enacted but that lessons discuss by name, such as the DISCLOSE Act. It describes the law as it stands, with its amendments in its body, unless lessons treat an amending Act as a thing of its own.

```yaml
slug: one-big-beautiful-bill-act
name: One Big Beautiful Bill Act
short_name: OBBBA
official_title: An act to provide for reconciliation pursuant to title II of H. Con. Res. 14.
jurisdiction: federal
congress: 119
bill_number: H.R. 1
introduced: 2025-05-20
enacted: 2025-07-04
public_law: Pub. L. 119-21
status: enacted
sponsors:
  - jodey-arrington          # a person: here a member from the congress/ snapshot (decision 6)
summary: The 2025 budget reconciliation law. It cut taxes, cut or raised spending on many federal programs and raised the debt limit.
body_md: |
  …
sources:
  - type: website
    citation: 'H.R. 1, 119th Congress: actions, titles and text. Congress.gov.'
    url: https://www.congress.gov/bill/119th-congress/house-bill/1
```

An older law shows the other form of sponsor:

```yaml
slug: tillman-act
name: Tillman Act
jurisdiction: federal
enacted: 1907-01-26
citation: 34 Stat. 864
status: enacted
sponsors:
  - name: Benjamin Tillman   # no person page: shown as text
```

The fields:

- `name` (required): what the page is titled and a link shows, as lessons write it ("Voting Rights Act of 1965", "Taft–Hartley Act").
- `short_name`: what a tight list or a second mention uses, a popular name or an initialism ("VRA", "BCRA").
- `official_title`: the title the statute itself carries, when it differs from `name` (Taft–Hartley is the Labor Management Relations Act, 1947).
- `jurisdiction` (required): `federal`, or a state's slug (`ma`) for a state law.
- `congress` and `bill_number`, for a federal law: the bill that became the law, or for a bill never enacted, its latest introduction, written as Congress.gov writes it (`H.R. 1`, `S. 1`). A state law has `session` in place of `congress`. `other_bills` lists earlier introductions and companion bills as `{congress, bill_number}`.
- `introduced` and `enacted`: `YYYY-MM-DD`, or `YYYY-MM` or `YYYY` when no closer date can be sourced. `enacted` is the day it became law: signed, allowed to become law, or passed over a veto.
- `public_law`, `citation` and `codified`: `Pub. L. 119-21`; the Statutes at Large or session-law citation (`34 Stat. 864`); where it sits in the code (`52 U.S.C. § 10301 et seq.`).
- `status` (required): `introduced`, `passed-one-chamber`, `passed-both`, `enacted`, `vetoed`, `died` (never enacted, and its Congress or session is over) or `repealed`. A law a court struck down in part stays `enacted`: the case page says what was struck and links the law (decision 3).
- `sponsors`: who introduced it, and the people it is named for when it is known by their names (McCain and Feingold). Each entry is either a person slug, which must resolve as a `[[person:]]` link does, or `{name: …}` for someone with no page, shown as text. Chris decided on 2026-11-16 to allow name-only sponsors, with `check:congress` reporting any that match a member (decision 6). Cosponsors are not listed.
- `amends`: the slugs of laws this one amends (the Bipartisan Campaign Reform Act amends the Federal Election Campaign Act).

**Slug:** the name lessons use for the law, spelled out and kebab-cased, without its year: `voting-rights-act`, `taft-hartley-act`, `international-emergency-economic-powers-act` (never `ieepa`). The year is added only when two laws share a name: `judiciary-act-1789`, `judiciary-act-1869`, `civil-rights-act-1964`. When a later law takes a name that is already a slug, the later law gets the year and the old slug stays.

Not laws: the Constitution and its amendments, executive orders, regulations, treaties and foreign statutes (see "Not decided here").

### 3. Cases

```yaml
slug: buckley-v-valeo
name: Buckley v. Valeo
short_name: Buckley
court: scotus
argued: 1975-11-10
decided: 1976-01-30
citation: 424 U.S. 1 (1976)
holding: Limits on contributions to candidates, and the Federal Election Campaign Act's disclosure rules, are constitutional. Limits on independent expenditures, on what candidates spend of their own money and on total campaign spending violate the First Amendment, and the Federal Election Commission as Congress had appointed it could not exercise executive power.
laws:
  - federal-election-campaign-act
summary: The 1976 decision that set the constitutional frame for campaign finance law. Limits on giving to candidates can stand; limits on spending cannot.
body_md: |
  …
sources:
  - type: court-opinion
    citation: 'Buckley v. Valeo, 424 U.S. 1 (1976).'
    url: https://supreme.justia.com/cases/federal/us/424/1/
```

The fields:

- `name` (required): the caption as lessons write it. Renderers set it in italics, as legal writing does, and so they do a labeled link to a case.
- `short_name`: the short form ("Buckley", "Citizens United").
- `court` (required): a court id from a new `meta/courts.yaml`, which takes CourtListener's ids (`scotus`, `cadc`, `ca9`, `minn`) and gives each court its name and, for a state court, its state. Four of the 25 most-named cases were decided by a court other than the Supreme Court (decision 11), so the court cannot be assumed.
- `argued` and `decided`: dates, as for laws. A case with no `decided` is pending: its page says so and has no holding.
- `citation`: the reporter citation (`424 U.S. 1 (1976)`, `599 F.3d 686 (D.C. Cir. 2010) (en banc)`). `docket`: the docket number, which is all a case has until it is reported.
- `holding` (required once decided): one to three sentences on what the court decided, with no view on whether it was right. Separate opinions and the arguments about the case go in the body.
- `laws`: the slugs of laws the case reviewed or construed.
- `overrules`: the slugs of cases it overruled in whole or in part (*Citizens United* overruled *Austin v. Michigan Chamber of Commerce*).

**Slug:** the caption as lessons most often write it, kebab-cased, with `v` for "v.", dots dropped, "&" written "and" and "Inc." left out: `citizens-united-v-fec`, `speechnow-org-v-fec`, `youngstown-sheet-and-tube-co-v-sawyer`, `learning-resources-v-trump`. A later case with the same caption takes its year.

### 4. States

```yaml
slug: ma
name: Massachusetts
code: MA
kind: state
ocd_id: ocd-division/country:us/state:ma
capital: Boston
admitted: 1788-02-06
legislature: General Court
summary: A commonwealth governed under the oldest written constitution still in force, drafted largely by John Adams in 1780, with a two-chamber legislature called the General Court.
body_md: |
  …
sources:
  - type: website
    citation: 'Constitution of the Commonwealth of Massachusetts (1780). Massachusetts Legislature.'
    url: https://malegislature.gov/Laws/Constitution
```

- Fifty-one files: the fifty states, and the District of Columbia as `dc` with `kind: district` and no `capital` or `admitted`. Territories can follow the same way.
- `code`: the USPS code, uppercase. `ocd_id`: the Open Civic Data division id, which is how core already stores a learner's place (D.C.'s is `ocd-division/country:us/district:dc`).
- `admitted`: the day of statehood; for the original thirteen, the day the state ratified the Constitution.
- `legislature`: what the state calls its legislature (the General Court, the General Assembly, the Legislature).
- `body_md`: how the state governs itself: its constitution, governor and other elected executives, legislature, courts, direct democracy where it has it, and local government. It names no current officeholder. Those are computed (decision 7), so the prose never goes stale.

**Slug: the lowercase USPS code** (`ma`, `me`, `dc`), not the name (`massachusetts`). The code is the key every system this content meets already uses: Open Civic Data ids, which spell it lowercase (`state:ma`); core's civic data; congress-legislators; bettercitizen.ai's officeholder schema (`[A-Z]{2}`); and GovInfo. It needs no mapping table and never changes. And with it a state has one spelling everywhere in this repo: `state: ma` in a person file, `jurisdiction: ma` in a law file and `[[state:ma]]` in a lesson are the same slug. The cost is that an author writes `[[state:me]]` for Maine, which the rendered link spells out, and that bettercitizen.ai's address is `/states/ma` where supercitizen.org's is `/places/massachusetts`. A site may still serve the name in its address and redirect from the code; that is presentation and does not change the slug. Chris decided on the code on 2026-11-16.

### 5. Persons gain a state, offices and a Bioguide ID

```yaml
slug: brian-kemp
# … the existing fields …
offices:
  - office: Governor of Georgia
    level: state
    state: ga
    from: 2019-01-14
  - office: Georgia Secretary of State
    level: state
    state: ga
    from: 2010-01
    to: 2018-11
```

```yaml
slug: bernie-sanders
# … the existing fields …
bioguide: S000033
offices:
  - office: Mayor of Burlington
    level: local
    state: vt
    from: 1981-04
    to: 1989-04
```

All three fields are optional.

- `bioguide`: the Bioguide ID of anyone who has served in Congress. It joins the file to the members snapshot (decision 6), which holds the person's service in Congress, so `offices` does not repeat it.
- `offices`: every other office worth listing, newest first. Each has `office` (its name as written), `level` (`federal`, `state` or `local`), `chamber` (`upper` or `lower`, for a seat in a legislature), `state` (a state slug), `district` (as the legislature numbers it, or `at-large`), and `from` and `to` (dates as for laws; no `to` while the person holds it).
- `state`: the state whose page lists the person. It defaults to the state of the person's most recent office, from `offices` or from the snapshot. Write it only when the person has no such office or the default is wrong.

Nothing is replaced: `role`, `affiliation` and the prose of `bio_md` stay.

### 6. Members of Congress are generated data, from the upstream sources

A new directory, `congress/`, is written by `npm run build:congress` (`scripts/build-congress.mjs`) and never by hand:

- `members.json`: every member who has served since the 118th Congress began on January 3, 2023, from congress-legislators' current and historical files. Each has the Bioguide ID, slug, name, party, chamber, state slug, district (or `at-large`), Senate class, the dates of the current or last term, the official website, every term in Congress (chamber, state, district, party, start, end) and outside ids (GovTrack, FEC, ICPSR, Wikidata). One record per member, sorted by Bioguide ID, so a diff shows only what changed.
- `bills.json`: BILLSTATUS's record of each bill a `laws/` file names, where BILLSTATUS has it: titles, date introduced, the sponsor's Bioguide ID, the cosponsor count, the latest action, the public law number and the Congress.gov address. It is a check on law pages, not a mirror. It leaves out the thousands of bills in each Congress that no lesson mentions. BILLSTATUS covers the 108th Congress (2003) onward, so 10 of the 25 most-named laws are in it and the other 15 are older.
- `slugs.json`: Bioguide ID to person slug, append-only. A member with a `persons/` file gets that file's slug. Anyone else gets bettercitizen.ai's rule: first and last name, then the state, then the district, until it is unique. An entry is never changed or removed.
- `README.md`: the sources and their licenses, the date and upstream commit of the last build, and how to rebuild.

`npm run check:congress` runs offline, as part of `npm run check`. It fails when a `bioguide` in `persons/` is missing from the snapshot or has another slug there, when a slug is used twice across `persons/` and the snapshot, when a sponsor slug resolves to nothing, or when a law disagrees with `bills.json` on its Congress, bill number, dates, public law or first sponsor. It also checks a joined person's name against the snapshot, so a mistyped Bioguide ID does not join the wrong record, and it reports any `{name: …}` sponsor who matches a member's name, so a possible link is not missed.

A `[[person:]]` link and a sponsor slug resolve against `persons/` and the snapshot together. A member with no `persons/` file has a generated page: name, party, state, district and service from the snapshot, and the lists of decision 7. So every member on a state page can be linked, and a lesson can link any member of Congress before anyone writes a file. A member with a file has one page that shows both.

**The snapshot is built from the upstream sources, not from supercitizen.org's mirror:**

- The upstreams are the sources. congress-legislators is dedicated to the public domain (CC0 1.0), and BILLSTATUS is a work of the U.S. government (17 U.S.C. § 105). Citing them directly keeps one hop between a fact and its source, as `STYLE.md` asks of every other fact.
- The mirror lives on an unmerged branch of another repo, and its layout is about to change: its ADR-0009 moves people and bills to Postgres, and its frozen slugs are split between a table for members and the candidates' profiles. This repo builds from a fork of itself alone and should not need a sibling checkout on a particular branch.
- The mirror's bills are a selection from the 118th and 119th Congresses, chosen for contested votes. Of the 25 laws lessons name most, it has one.

The cost is a second importer of the same upstream (supercitizen.org has one in `scripts/civic/`), of a few hundred lines. The two sites agree on a person by Bioguide ID, not by slug, since their slugs already differ once. Chris decided on the upstream sources, and on the CC0 dedication below, on 2026-11-16.

**Licensing:** the files in `congress/` hold CC0 and public-domain data and are dedicated CC0 in turn. The README states this as one more carve-out from the repo's CC BY-SA license.

**Freshness:** rebuild when a new Congress is sworn in (the 120th is due on January 3, 2027, after the election of November 3, 2026) and after any special election, death or resignation. A content release carries the snapshot it was built with, and every app shows its date. The first build that core should answer "who represents me" from is the one after January 3, 2027: until then the sitting members hold the old districts in the nine states that redrew for 2026, and the snapshot cannot give core's district picker the new map's districts. supercitizen.org's stopgap file serves those until then (C11).

### 7. Every page lists what links to it

Core and bettercitizen.ai compute backlinks at import, from the same content and by the same rules, so every app and the web list the same things in the same order:

- **Lessons** that link the entity in their body, in curriculum order (packs as `list_packs` orders them, then lesson order), each with its pack's reading level, so an app can show the reader's level first.
- **Pages** that link it, in their body or through a field: a law's `sponsors` (on a person's page, "Sponsored"), `amends` and `jurisdiction`; a case's `laws`, `overrules` and its court's state; a person's `state`. Grouped by kind, then by name.

A state page also computes its two senators and its representatives by district (current members, from the snapshot), the persons whose state it is, the laws whose jurisdiction it is, and the cases from its courts.

An issue's hand-kept `related_lesson_slugs` stays: it lists lessons about the issue, which need not link to it.

### 8. The cross-reference syntax

```text
[[law:voting-rights-act]]
[[case:citizens-united-v-fec]]
[[state:ma]]
[[case:buckley-v-valeo|Buckley]]            the labeled form, for any kind
[[term:judicial-review|judicial review]]
```

The grammar, for both parsers:

```text
\[\[(ideology|issue|person|org|term|law|case|state):([a-z0-9]+(?:-[a-z0-9]+)*)(?:\|([^\[\]|\n]{1,80}))?\]\]
```

A link shows its label when it has one and the entity's `name` when it does not. A case's text is italic either way. The label is plain text, with no Markdown, of 1 to 80 characters. Because the labeled form works for every kind, a glossary link no longer has to sit where the term's capitalized name reads as a sentence. A possessive goes outside: `[[case:buckley-v-valeo|Buckley]]'s`.

Where the web shows a term's definition on hover, it shows a law's, case's or state's `summary`.

A link that resolves to nothing fails validation, as now. A reader that meets a kind or label it does not know shows the label, or the slug's words, as plain text, never the raw `[[…]]`. Today both readers show the raw text: core keeps an unknown kind, or a slug with a `|` in it, as text with its brackets, and the web's pattern does not match either. That is why decision 10 orders the work as it does.

### 9. When to link (for `STYLE.md`)

- Link a law, case, state or person on its first meaningful mention in a lesson: where the passage is about it, not where it passes in a list. Once per lesson.
- Three to eight links per lesson stays the guide for all kinds together. A lesson that names ten cases links the two or three it teaches.
- Link a state when the lesson is about something in it (Maine's ranked-choice law), not wherever a state is named.
- Never in a heading, a component prop (props are not read for links), a source citation or an assessment. No lesson does today.
- Use a label when the name does not fit the sentence: a short form a reader recognizes ("[[case:citizens-united-v-fec|Citizens United]]"), or a term in lowercase mid-sentence. A label names what the link opens: "the Act" only where the sentence has just named the Act.
- A name with no page stays plain text. The page comes first.
- Where a lesson links one of the four glossary terms about a case or law (`citizens-united`, `war-powers-act`, `roe-v-wade`, `brown-v-board-of-education`) and the passage is about the case or law itself, the link moves to its page once that page exists. The terms stay in the glossary, because a term is something a learner can add to a review deck, and each term's body links its page. No new glossary term is written for a single law or case; it gets a page instead. The issues `citizens-united` and `voting-rights-act-restoration` are debates, not cases or laws, and stay as they are.

### 10. Rollout, in the order the parity rule requires

Syntax lands in bettercitizen.ai's parser and validator first, then in core, then in content, then in the apps. No content with a new kind or a label may reach a reader that does not know them, because both readers would show it as raw brackets.

1. **This ADR**, accepted.
2. **bettercitizen.ai.**
   - `src/content-schema/parse.ts`: `SHORTCODE_RE` takes the three kinds and the label, and `CrossRef` gains `label?`.
   - `src/components/learn/cross-refs.ts`: `CROSS_REF_ROUTES` gains `law: '/laws'`, `case: '/cases'` and `state: '/states'`; a labeled link renders its label; case names are italic; laws, cases and states get the hover card.
   - Schemas, loaders, tables and seeding for `laws/`, `cases/`, `states/`, `meta/courts.yaml`, the three person fields and `congress/`.
   - Pages `/laws/[slug]`, `/cases/[slug]` and `/states/[slug]`; `/people/[slug]` shows offices, state and sponsored laws; every entity page gets its "Linked from" lists.
   - `scripts/validate-content.ts` and the slug registry in `src/db/content-inventory.ts`: the three kinds, persons as `persons/` and the snapshot together, sponsors, courts and the label's limits. Empty new directories pass, so this ships before content has a single law.
   - Members of Congress seed from `congress/` instead of the GovTrack importer, re-keyed by Bioguide ID. State officeholders from Open States are not touched.
3. **bettercitizen-core**: C8 to C12, with its decisions recorded in its CHANGELOG.
4. **Content**, in this order:
   - `states/`, all 51, and `meta/courts.yaml`.
   - `congress/` and its two scripts; `bioguide` on the persons who served (about 42), with `state` and `offices` where they add what the snapshot lacks.
   - Laws and cases, by the plan in decision 11.
   - `STYLE.md` (the three formats and decision 9) and `README.md` (the new directories, members of Congress now generated here, the CC0 carve-out).
   - Link passes, pack by pack, each with its minor version bump, once the pages they link exist. A `npm run check:mentions` report, built from the counting in decision 11, lists for each lesson the laws and cases it names that have a page it does not link.
5. **The native apps** (Apple, Android, Linux, Windows): the new kinds as links, the three page types, the person additions, the "Linked from" lists, and "who represents me" from the snapshot. Until an app runs a core with C8 and C9, it stays on content from before the first new link.

### 11. Authoring plan: the most-named first

Write pages in the order of how many lessons name them, because a page is worth what links to it and a lesson links once. Write them in clusters, a law with the cases about it, and run the link pass for a cluster when it is done:

- **Campaign finance:** the Tillman Act, FECA, BCRA, the DISCLOSE Act, the Lobbying Disclosure Act, FARA; *Buckley*, *Citizens United*, *SpeechNow*, *McCutcheon*, *NRSC*, *Americans for Prosperity Foundation v. Bonta*.
- **Voting and districts:** the Voting Rights Act, the NVRA, the Electoral Count Reform Act, the Freedom to Vote Act, the Fair Representation Act; *Shelby County*, *Reynolds*, *Rucho*, *Louisiana v. Callais*, and the three ranked-choice cases (*Brown v. Smallwood*, *Minnesota Voters Alliance*, *Dudum v. Arntz*).
- **Executive power and the agencies:** IEEPA, the Impoundment Control Act, the Clean Air Act; *Learning Resources*, *Youngstown*, *Loper Bright*, *West Virginia v. EPA*.
- **Federalism and the Court:** the Judiciary Acts of 1789 and 1869; *Marbury*, *Barron*, *NFIB*, *South Dakota v. Dole*, *Murphy v. NCAA*.
- The budget and tax laws (the One Big Beautiful Bill Act, the Inflation Reduction Act, the Tax Cuts and Jobs Act, the CHIPS and Science Act) and the rest in rank order.

**The 25 laws lessons name most:**

| # | Law | Lessons | Mentions | Slug |
| --- | --- | --- | --- | --- |
| 1 | One Big Beautiful Bill Act | 16 | 72 | `one-big-beautiful-bill-act` |
| 2 | Voting Rights Act of 1965 | 10 | 43 | `voting-rights-act` |
| 3 | Inflation Reduction Act | 10 | 30 | `inflation-reduction-act` |
| 4 | Bipartisan Campaign Reform Act (BCRA, McCain–Feingold) | 8 | 30 | `bipartisan-campaign-reform-act` |
| 5 | International Emergency Economic Powers Act (IEEPA) | 6 | 36 | `international-emergency-economic-powers-act` |
| 6 | Electoral Count Reform Act | 6 | 17 | `electoral-count-reform-act` |
| 7 | DISCLOSE Act (never enacted) | 5 | 23 | `disclose-act` |
| 8 | Federal Election Campaign Act (FECA) | 5 | 22 | `federal-election-campaign-act` |
| 9 | Tillman Act | 5 | 14 | `tillman-act` |
| 10 | Lobbying Disclosure Act | 4 | 37 | `lobbying-disclosure-act` |
| 11 | Affordable Care Act | 4 | 24 | `affordable-care-act` |
| 12 | Tax Cuts and Jobs Act | 4 | 20 | `tax-cuts-and-jobs-act` |
| 13 | Clean Air Act | 4 | 12 | `clean-air-act` |
| 14 | Congressional Budget and Impoundment Control Act | 4 | 12 | `congressional-budget-and-impoundment-control-act` |
| 15 | Freedom to Vote Act (never enacted) | 4 | 9 | `freedom-to-vote-act` |
| 16 | Judiciary Act of 1789 | 4 | 5 | `judiciary-act-1789` |
| 17 | CHIPS and Science Act | 4 | 5 | `chips-and-science-act` |
| 18 | Taft–Hartley Act | 4 | 5 | `taft-hartley-act` |
| 19 | National Voter Registration Act | 3 | 25 | `national-voter-registration-act` |
| 20 | Foreign Agents Registration Act (FARA) | 3 | 13 | `foreign-agents-registration-act` |
| 21 | Fair Representation Act (never enacted) | 3 | 8 | `fair-representation-act` |
| 22 | Brady Act | 3 | 7 | `brady-act` |
| 23 | Civil Rights Act of 1964 | 3 | 5 | `civil-rights-act-1964` |
| 24 | Judiciary Act of 1869 | 3 | 4 | `judiciary-act-1869` |
| 25 | Epstein Files Transparency Act | 3 | 4 | `epstein-files-transparency-act` |

Next come the Honest Leadership and Open Government Act, the Congressional Review Act, the Insurrection Act, the SAVE Act, the National Emergencies Act and the Posse Comitatus Act, two lessons each.

**The 25 cases lessons name most:**

| # | Case | Court | Lessons | Mentions | Slug |
| --- | --- | --- | --- | --- | --- |
| 1 | *Buckley v. Valeo* | Supreme Court | 11 | 89 | `buckley-v-valeo` |
| 2 | *Citizens United v. FEC* | Supreme Court | 11 | 88 | `citizens-united-v-fec` |
| 3 | *SpeechNow.org v. FEC* | D.C. Cir. | 8 | 37 | `speechnow-org-v-fec` |
| 4 | *Loper Bright Enterprises v. Raimondo* | Supreme Court | 7 | 29 | `loper-bright-enterprises-v-raimondo` |
| 5 | *NFIB v. Sebelius* | Supreme Court | 6 | 23 | `nfib-v-sebelius` |
| 6 | *Learning Resources, Inc. v. Trump* | Supreme Court | 6 | 20 | `learning-resources-v-trump` |
| 7 | *Marbury v. Madison* | Supreme Court | 5 | 27 | `marbury-v-madison` |
| 8 | *Reynolds v. Sims* | Supreme Court | 5 | 8 | `reynolds-v-sims` |
| 9 | *Gideon v. Wainwright* | Supreme Court | 4 | 23 | `gideon-v-wainwright` |
| 10 | *Rucho v. Common Cause* | Supreme Court | 4 | 22 | `rucho-v-common-cause` |
| 11 | *Youngstown Sheet & Tube Co. v. Sawyer* | Supreme Court | 4 | 16 | `youngstown-sheet-and-tube-co-v-sawyer` |
| 12 | *Americans for Prosperity Foundation v. Bonta* | Supreme Court | 4 | 12 | `americans-for-prosperity-foundation-v-bonta` |
| 13 | *NRSC v. FEC* | Supreme Court | 4 | 12 | `nrsc-v-fec` |
| 14 | *Moore v. United States* | Supreme Court | 4 | 11 | `moore-v-united-states` |
| 15 | *Minnesota Voters Alliance v. City of Minneapolis* | Minn. (2009) | 4 | 9 | `minnesota-voters-alliance-v-city-of-minneapolis` |
| 16 | *South Dakota v. Dole* | Supreme Court | 4 | 8 | `south-dakota-v-dole` |
| 17 | *Louisiana v. Callais* | Supreme Court | 4 | 7 | `louisiana-v-callais` |
| 18 | *Murphy v. NCAA* | Supreme Court | 4 | 7 | `murphy-v-ncaa` |
| 19 | *Brown v. Smallwood* | Minn. (1915) | 3 | 20 | `brown-v-smallwood` |
| 20 | *Shelby County v. Holder* | Supreme Court | 3 | 20 | `shelby-county-v-holder` |
| 21 | *McCutcheon v. FEC* | Supreme Court | 3 | 16 | `mccutcheon-v-fec` |
| 22 | *Dudum v. Arntz* | 9th Cir. | 3 | 10 | `dudum-v-arntz` |
| 23 | *NAACP v. Alabama* | Supreme Court | 3 | 10 | `naacp-v-alabama` |
| 24 | *West Virginia v. EPA* | Supreme Court | 3 | 10 | `west-virginia-v-epa` |
| 25 | *Barron v. Baltimore* | Supreme Court | 3 | 9 | `barron-v-baltimore` |

Next come *Gitlow v. New York*, *Gonzales v. Raich*, *Printz v. United States*, *Allen v. Milligan*, *Hurtado v. California*, *Tinker v. Des Moines* and *Austin v. Michigan Chamber of Commerce*, three lessons each.

**How these were counted.** Over the whole of each file in `packs/*/lessons/*.mdx` (frontmatter, prose and component props), on 2026-11-16. Acts were found by pattern (a run of capitalized words ending in "Act", with any "of 1965"), and cases by caption ("X v. Y"). Variant captions were merged (*NFIB* and *National Federation of Independent Business*, *AFPF* and *Americans for Prosperity Foundation*, the Impoundment Control Act and the Congressional Budget Act into the 1974 law that holds both). Established short forms were added: OBBBA, VRA, BCRA and McCain–Feingold, FECA, IEEPA, ECRA, TCJA, NVRA and motor voter, FARA, HLOGA, HAVA and Taft–Hartley; and Buckley, Citizens United, SpeechNow, Loper Bright, Learning Resources, Gideon, Rucho, Youngstown, McCutcheon, Shelby County, Marbury, NFIB and Chevron. A short form that can mean something else (Buckley, Citizens United the organization, ACA, IRA, LDA, Gideon, Marbury, Chevron) was counted only in a lesson that also writes the full name. "Lessons" is how many name it; "mentions" counts every naming. The bare "Judiciary Act" was left out of both Judiciary Acts, the bare "Civil Rights Act" was counted for 1964 because every such passage is about that Act, and the two Consolidated Appropriations Acts lessons cite (for 2023 and for 2026) were not ranked as one law. The counts are approximate: a pattern misses a name written another way and can catch a near miss.

## Not decided here

- **The Constitution and its amendments.** They are the most-named texts of all (the First Amendment in 29 lessons, the Fourteenth in 10), but a clause is not a statute, and how to link one is its own decision.
- **State legislators and state bills in bulk**, from Open States or from supercitizen.org once it holds them. State law pages here are editorial and few.
- **Roll-call votes.** As on supercitizen.org (its D15), a vote is not a stated position, and this repo will not derive one from it.
- **Executive orders, regulations, treaties and foreign laws.** Lessons name some (Australia's Commonwealth Electoral Act); they stay plain text.

## Consequences

- Fifty pages in the first round give the lessons' most-named laws and cases somewhere to go, and every page shows what links to it. A person's state, a law's sponsors and a case's laws tie the pages to one another.
- Members of Congress become content. bettercitizen.ai's GovTrack import, core's fetch from supercitizen.org and this README's line that officeholders are not authored here all change. From the first content release after January 3, 2027, "who represents me" works offline in every app from data at most one release old, and supercitizen.org's stopgap file can go.
- The snapshot goes stale between builds. Someone has to run `build:congress` on January 3, 2027 and after each change of membership; the README dates it, and the apps show the date.
- The format change breaks old readers. Core 0.2 and today's web show `[[law:…]]` and labeled links as raw text, which is what decision 10's order prevents. The native apps stay on content from before the first new link until their core has C8 and C9, as they did for ADR 0001 and ADR 0002.
- Persons come from two places. A person with a file and a Bioguide ID is one page; `check:congress` keeps the two agreeing on slug and name. `list_entities` for persons grows from 217 to about 800 unless an app lists only people with a file (C10).
- Law and case pages are editorial: summaries and holdings are written, sourced and reviewed like lessons. A pending case's page changes when the court decides it, and some of the most-named cases are recent.
- Content and supercitizen.org each import congress-legislators. They agree on people by Bioguide ID, and their slugs may differ.
- This is a lot of writing: 51 state pages and 50 law and case pages before the second round, each at 300 to 900 words.

## Considered options

- **States slugged by name** (`massachusetts`), as supercitizen.org's `/places` is. Readable in an address and in source. But every join to the systems in Context would need a mapping, and content would spell a state two ways: the name in links, the code in data fields where codes are the norm.
- **The snapshot from supercitizen.org's mirror or its API.** One importer instead of two, and supercitizen.org's slugs where it froze them. Rejected for decision 6's reasons. Worth revisiting if supercitizen.org publishes a stable, versioned API for people.
- **Members of Congress left to each reader**, the web from GovTrack and core from supercitizen.org. Then content could link a member only after someone wrote a file, state pages could not list a delegation, and core would stay broken.
- **All of BILLSTATUS.** Thousands of bills each Congress, almost none of which lessons discuss, while 15 of the 25 laws lessons name most are older than its coverage.
- **Sponsors as person slugs only.** Every sponsor of an older law would need a page before the law could have one, and the snapshot starts in 2023. Name-only sponsors let a law page go first, and the check points out any that could link.
- **One kind for laws and rulings**, like supercitizen.org's Policy. A statute and a ruling are cited, described and linked differently, and lessons name them differently. supercitizen.org's other line, a Bill against the Policy it becomes, is held here by one law page and its `status`.
- **Laws and cases as glossary terms**, as four are today. A term is a definition sized for a review card. A law has sponsors, dates and amendments, and a case has a court, a holding and the laws it reviewed, which are what let pages link to one another.
