# 0002: Editions, one topic written at three reading levels

Status: proposed, 2026-11-13. Written at Chris's direction ("top of the line content at three different levels", pulled by level through the API). It becomes accepted when Chris has it committed. The first four topics written this way are the three branches, how a bill becomes law, the Constitution and the Bill of Rights.

This decision crosses repos. It lives here because bettercitizen-content owns the pack format. What it asks of bettercitizen-core and the native apps is request C7 in [`../core-requests.md`](../core-requests.md).

## Context

Every lesson was written for one reader. `STYLE.md` set the bar as "a chapter a college senior in a political science seminar would want to read", and said of the four `level` values that each "sets what the lesson may *assume*, not how smart it sounds". So `level` is a ladder of prerequisites inside one register, and nothing in the format could say how hard a pack is to read.

The content review of 2026-11-04 found the consequence: no lesson could be read by a child or a young teenager. Measured with this repo's own gauge (`npm run check:reading`, Flesch-Kincaid on the lesson prose), the 149 lessons averaged grade 12.5, and the two lessons of the "intro" three-branches pack read at 12.1 and 12.6.

A partner site that teaches a ten-year-old, a ninth-grade class and a political science major needs three texts on the same subject, each written for its reader, and a way to ask for the one it wants.

## Decision

1. **Reading level is its own axis, and it is a number.** A pack says how hard it is to read: `reading_level: 1 | 2 | 3`. It is `3` when absent, so none of the 40 existing packs changes. `level` keeps its meaning (what the pack assumes the reader knows) and is not reused.

2. **The number is the only name a level has.** The same token is used in the slug (`three-branches-1`), in the data (`reading_level: 1`), in the API (`?reading_level=1`) and in the interface (a mark of one, two or three bars, spoken as "level 1"). An earlier draft called the levels `middle`, `high` and `college`. Chris rejected that on 2026-11-13: those words name the reader's school when the thing that differs is the text, they tell a learner at every turn that they are on the text for younger readers, they do not fit an adult coming to a subject cold or a learner reading in a second language, and they are terms from one country's school system. Numbered levels are what children's leveled readers and graded readers for language learners already use, for the same reasons.

3. **Who a level suits is published for adults and never shown to the learner.** Level 1 reads at about a fifth-grade level and suits most readers from about age 10, younger with an adult. Level 2 reads at about a ninth-grade level and suits readers from about age 14. Level 3 is written for adults and college students. `STYLE.md` says this to authors, and the app's API returns it with every pack so that a parent, a teacher or a partner site can choose. Titles, summaries, headings and lesson text never mention it.

4. **An edition is a pack.** A topic written at another level is a new pack directory with its own `pack.yaml`, lessons and assessments. It is not a variant of a lesson and not a folder inside another pack. Editions of one topic share a `topic:` slug, which defaults to the pack's own slug, and they share a title.

   ```yaml
   slug: three-branches-1
   title: The three branches
   topic: three-branches
   reading_level: 1
   ```

   One pack per level within a topic. The level 3 edition keeps the topic's slug, because those slugs already exist, and the others add `-1` or `-2`.

5. **An edition is written from scratch for its reader.** It may have a different number of lessons (three short ones where level 3 has two long ones), different examples and different figures. Lessons do not correspond one to one across editions, and lesson slugs are not shared.

6. **The same bar everywhere.** Truth and sourcing, neutrality, the component catalog and the figure rules of ADR 0001 hold at every level. A lower level simplifies and never falsifies.

7. **Each level has a written standard and a check.** `STYLE.md`, "Reading levels (editions)", sets a reading-grade ceiling and a length range for levels 1 and 2. `npm run check:reading` fails a lesson outside its band. Level 3 lessons are reported, not failed.

8. **Editions are for the core spine.** About fifteen topics get all three levels (the review's list: the Founding, the Constitution, the Bill of Rights, the three branches, federalism, how laws are made, the Supreme Court, voting and elections, parties, the Electoral College, money in politics, media literacy, local government, civil rights, the federal budget). A pack such as dark-money stays at level 3 only.

9. **The API takes a level.** `GET /api/v1/packs?reading_level=` filters the list. `GET /api/v1/packs/{pack}?reading_level=` answers with that topic's edition at the level, and with a 404 that names the levels that exist when there is none. It never answers with another level's text. Every pack lists its sibling editions.

10. **There are three levels.** A later edition for readers younger than about ten would have to be a level 0 or force a renumbering. That cost is accepted: level 1 read with an adult serves those readers.

## Consequences

- Nothing that keys on a pack slug and a lesson slug changes: progress, question ids, grading, chat anchors and ratings all see an edition as an ordinary pack. A learner's progress at level 1 is separate from level 3, which is right, because they are different lessons.
- Readers of the format that do not know `reading_level` (core 0.1.0, the native apps, any list in the web app that has not been taught) see each edition as one more pack with the same title as its siblings. Request C7 asks core to carry `reading_level` and `topic` so the apps can group and filter. Until then the native apps should stay on content from before the first edition pack.
- A list that shows one row per topic has to choose an edition. The web app's Curriculum index shows level 3 by default.
- The concept index gains the edition packs, so a concept may list three packs that teach it, one per level.
- Three editions are three texts to keep current. A fact that moves (a veto count, a seat number) moves in up to three places. Touchstones are the place to hold such a fact once; linking edition lessons to them is future work.
- "Level" now appears twice in a manifest, as `level` (what the pack assumes) and `reading_level` (how hard it reads). Renaming the older key would be clearer and is a separate, larger change.

## Considered options

- **Naming the levels after school stages** (`middle`, `high`, `college`), or after grade bands (`6-8`, `9-12`). They help an adult choose, and they label the learner. Decision 3 keeps the help and drops the label.
- **Descriptive words** (`starter`, `standard`, `in-depth`). They read more warmly in a web address, but they rank the reader more than a number does, they need translating, and they extend no better than numbers.
- **Editions as folders inside one pack** (`packs/three-branches/editions/1/`). It reads well on disk and hides editions from old readers. But every table and API that keys on pack and lesson would need an edition added, or lesson slugs would have to be unique across editions by rule, and the seeder, the validator, core's importer and four check scripts all walk `packs/<dir>/lessons`.
- **One lesson file with a variant per level.** It forces the lessons to correspond one to one, and a younger reader needs a different sequence, not the same sections in shorter words.
- **Rewriting the level 3 text for the reader on request, with a model.** The Coach can already adapt an explanation. It is no substitute for an authored edition: the facts in a rewritten text have not been checked, the assessments are static and would no longer match, and a partner would get a different text on every call.
- **Reusing `level`** (`intro` for the youngest readers and so on). `level` already means something else, and the labels it carries today do not track reading difficulty.
