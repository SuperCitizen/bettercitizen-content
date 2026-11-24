# Better Citizen lesson spec, version 1.0.1

<!-- Generated from bettercitizen.ai (src/lib/lesson-spec). Do not edit by hand: change the spec there and run `pnpm lesson-spec:write`. -->

How to write a Better Citizen lesson: three files (a reading version in MDX, a listening version for the narrator, and an assessment), the parts each needs in order, length and cadence targets, recall and challenge checks, and the sourcing and neutrality rules. Read it before writing or editing a lesson; validate_lesson checks a draft against it.

Spec `bettercitizen.lesson-spec` 1.0.1, updated 2026-11-24. The current version is always at `/api/v1/lesson-spec` on bettercitizen.ai and from the MCP tool `get_lesson_spec`. Rule ids in bold are what `validate_lesson` cites; a rule marked *validator* is checked automatically, and the rest are for the author and the editor.

## How a lesson gets written

For people and for AI. Every lesson is written twice, because reading and being lectured to need different cadence and structure: a reading version for the page, and a listening version that the narrator reads aloud in lecture mode. A lesson also ships an assessment.

- **`workflow.read-spec`** Read this spec (get_lesson_spec, or GET /api/v1/lesson-spec) before writing or editing a lesson. Cite its version in your draft notes.
- **`workflow.study-examples`** Study good examples first: list_lessons with exemplar=true, then get_lesson, which returns a lesson’s reading text and its lecture script.
- **`workflow.three-files`** A lesson is three files in its pack, all named after the lesson file: lessons/<file>.mdx (reading), lectures/<file>.md (listening) and assessments/<file>.yaml. *(validator: error)*
- **`workflow.validate`** Run validate_lesson on all three files and fix every error before saving. Warnings are for judgment; say why you kept one.
- **`workflow.draft-only`** Save with create_lesson_draft. It stores a draft for an editor and never publishes. A lesson reaches learners only when an editor approves it and merges it into bettercitizen-content.
- **`workflow.ai-label`** Say which model drafted the text (create_lesson_draft records it). AI-drafted text is labeled until a person has reviewed it.

## Files and formats

A pack is a directory: pack.yaml, lessons/, lectures/ and assessments/. The field tables below are generated from the schemas the app parses content with; the JSON Schema for each file is in the JSON form of this spec.

- **`files.lesson.mdx`** The reading version is MDX: Markdown plus the component catalog. No import or export statements, and no JSX outside the catalog. *(validator: error)*
- **`files.lesson.frontmatter`** Its frontmatter must parse against the lesson schema: schema, slug, kind, title, sources (one or more) and the optional fields. *(validator: error)*
- **`files.lecture.markdown`** The listening version is plain Markdown at lectures/<the lesson’s file name>.md, with a two-line frontmatter: schema and lesson. *(validator: error)*
- **`files.lecture.lesson`** A lecture’s `lesson:` is the lesson’s slug, not its file name. *(validator: error)*
- **`files.assessment.yaml`** The assessment is YAML at assessments/<the lesson’s file name>.yaml (01-how-it-works.yaml) and must parse against the assessment schema. *(validator: error)*
- **`files.assessment.lesson`** An assessment’s `lesson:` is the lesson’s slug. *(validator: error)*
- **`files.pack.manifest`** pack.yaml must parse against the pack schema. A draft names its pack: pack.yaml for a new one, or an existing pack’s slug. *(validator: error)*
- **`files.pack.listed`** pack.yaml lists every lesson file, in order, by exact file name. *(validator: warning)*
- **`files.pack.version`** After any edit, bump the pack’s version minor (1.0.0 to 1.1.0).

### pack.yaml

| Field | Meaning |
| --- | --- |
| `schema` | Always `bettercitizen.content/v1`. |
| `slug` | Kebab-case. The level 3 edition keeps the topic’s slug; editions at levels 1 and 2 add `-1` or `-2`. |
| `title` | The pack’s title. Every edition of a topic carries the same title, with no level in it. |
| `summary` | One or two sentences on what the pack covers. |
| `author` | Usually `SuperCitizen Editorial`. |
| `license` | Usually `CC-BY-SA-4.0`. |
| `version` | Semver. A new pack starts at `1.0.0`; bump the minor after any edit. |
| `tags` | Free tags. `book` marks a reform book that argues a case in its author’s voice. |
| `level` | What the pack assumes the reader already knows: intro, intermediate, advanced or scholar. Pick the rung of its first lesson. |
| `reading_level` | How hard the text is to read: 1, 2 or 3 (3 when absent). Never shown in a title or the text. |
| `topic` | The topic this pack is an edition of; the pack’s own slug when absent. |
| `official` | True for SuperCitizen Editorial’s own packs; false for ingested books. |
| `contested` | True when the subject is contested. Every lesson then needs `perspectives:` and presents each position at its strongest. |
| `core` | True for a core civic-foundations pack that every learner should cover. |
| `languages` | Language codes; `[en]`. |
| `lessons` | The lesson files, in order, by exact file name (`01-how-it-works.mdx`). |

### Lesson frontmatter (lessons/<file>.mdx)

| Field | Meaning |
| --- | --- |
| `schema` | Always `bettercitizen.lesson/v1`. |
| `slug` | Kebab-case and permanent: assessments, lecture scripts and learners’ records key off it. |
| `kind` | socratic, media, interactive or reading. |
| `title` | The lesson’s title, matched by its H1. Title the question the reader already has. |
| `objectives` | What the reader will be able to do or explain, one line each. |
| `concepts` | Glossary slugs the lesson teaches. Prefer existing slugs; never invent one casually. |
| `sources` | Required, at least one. Each `{type, citation, url?, ref?}`; they must genuinely back the body. |
| `perspectives` | Required in a contested pack: `- name: …` for each position, matching the PerspectiveTabs names. |
| `duration_min` | Minutes to read, as a whole number. |
| `touchstone_slugs` | Slugs of Touchstones the lesson draws on. Each must exist in touchstones/. |

### A source (each entry of `sources:`)

| Field | Meaning |
| --- | --- |
| `type` | paper, book, website, video, audio, pdf, court-opinion, statute or crs-report. |
| `url` | A URL verified to exist, or omitted. Never invented. |
| `citation` | Author or publisher, title, table or section, and date. |
| `ref` | Optional kebab-case key for citing this exact source. |

### Lecture frontmatter (lectures/<file>.md)

| Field | Meaning |
| --- | --- |
| `schema` | Always `bettercitizen.lecture/v1`. |
| `lesson` | The slug of the lesson this script is the spoken version of (its frontmatter slug, not its file name). |

### Assessment (assessments/<file>.yaml)

| Field | Meaning |
| --- | --- |
| `schema` | Always `bettercitizen.assessment/v1`. |
| `lesson` | The slug of the lesson it assesses (the file is named after the lesson file). |
| `questions` | 3 to 5 questions: mostly multiple choice, closing with one free response. |

### A question (each entry of `questions:`)

| Field | Meaning |
| --- | --- |
| `id` | Unique within the file (`q1`, `q2`…). |
| `kind` | `multiple-choice` or `free-response`. |
| `text` | The question. |
| `choices` | Multiple choice: two or more `{id, text}`, of similar length; distractors are plausible near misses, never jokes. |
| `correct_choice_id` | Multiple choice: the id of the right choice. |
| `explanation` | Multiple choice: required by this spec. Teaches the distinction, not just the letter. |
| `concepts` | Glossary slugs the question tests. |
| `socratic_seed` | Free response: how the coach opens the discussion of the reader’s answer. |

Allowed values, from the schemas: lesson `kind` `socratic`, `media`, `interactive`, `reading`; pack `level` `intro`, `intermediate`, `advanced`, `scholar`; `reading_level` 1, 2, 3; source `type` `paper`, `book`, `website`, `video`, `audio`, `pdf`, `court-opinion`, `statute`, `crs-report`; question `kind` `multiple-choice`, `free-response`.

## Required parts, in order

- **`order.reading`** Reading version: frontmatter; `# Title` (the frontmatter title); a cold open with no heading; 3 to 6 `##` sections, each a real argument or mechanism, with a check after roughly every major section; at least one figure or table where it teaches; a closing `##` section on what is settled and what is still contested, pointing to the next lesson.
- **`order.listening`** Listening version: a cold open (20 to 40 seconds); the promise and the map (what the listener will be able to explain, then the stops counted off, three or four); 3 to 5 `##` sections, each a hand-off, the idea concrete before abstract, its key line, the idea again in other words, and in most sections a think-pause; the gather (“Let’s gather it up. Four things to keep.”); what is not settled; the pointer to the next lecture; the close, back at the opening image.
- **`order.assessment`** Assessment: 3 to 5 questions, mostly multiple choice, the last one a free response with a socratic_seed.

## The reading version

The bar: a chapter a college senior in a political science seminar would want to read. Rigorous enough to cite, written like a book, never like a slide deck. (Levels 1 and 2 keep the same bar for truth, written for younger or newer readers.)

- **`reading.narrative`** Write narrative, not notes. Bullets are for genuinely enumerable things; everything else is prose with connective tissue: because, which is why, the catch is.
- **`reading.cold-open`** Open cold: an anecdote, a number that should not be true, a scene or a puzzle, in two to five sentences, before any definition. *(validator: warning)*
- **`reading.h1`** The body starts with `# Title`, the frontmatter title. *(validator: error)*
- **`reading.concrete`** Concrete before abstract: name the year, the state, the case, the person, the dollar figure, then the rule.
- **`reading.define`** Assume zero prior coursework. Define a term on first use, then use it without apology.
- **`reading.question-titles`** Title the question the reader already has (“Why does Congress have two chambers?”), especially at intro.
- **`reading.neutral-ground`** Teach a fought-over mechanism on neutral, invented ground first, then move to real cases.
- **`reading.analogy`** One concrete analogy per hard idea, then say where it breaks.
- **`reading.near-miss`** Name the near miss right after a definition (judicial review is not appellate review). A QuickCheck is its natural home.
- **`reading.overturn`** Overturn an assumption with the text: lead with what the reader expects, then show the primary source.
- **`reading.scholars`** Bring in the scholarship by name and work where it is load-bearing, in a paragraph or two. Only works you can verify exist.
- **`reading.sections`** Between 3 and 7 `##` sections, the closing one included. Each is an argument or a mechanism, not a topic label. *(validator: warning)*
- **`reading.closing`** End with a section on what the lesson did not settle and where the live argument continues, pointing to the next lesson. Never end on a check. *(validator: warning)*
- **`reading.figure`** At least one figure or table where it genuinely teaches. *(validator: warning)*
- **`reading.length`** Length, in words of prose: level 3 intro 1,400 to 2,000 words, intermediate 1,400 to 2,400 words, advanced 1,800 to 2,600 words, scholar 2,200 to 3,000 words; a book chapter 900 to 1,800 words; reading level 2 1,200 to 1,800 words; reading level 1 600 to 1,000 words. Expand with substance, never padding. *(validator: warning)*
- **`reading.level-1`** Reading level 1 (read alone from about age 10): Flesch-Kincaid grade about 5 to 7, never above 8; a scene the reader has lived as the open; every new word defined in the sentence that brings it in; sentences of ordinary length (about twelve words); simplify, never falsify; two checks, one activity (MatchUp or OrderIt) and one or two figures; scholars left out. *(validator: error)*
- **`reading.level-2`** Reading level 2 (read alone from about age 14): grade about 9 to 11, never above 12; put a primary document in front of the reader at length (Callout type="sources") and ask a question only it can answer; name a scholar when their argument is the open question. *(validator: error)*
- **`reading.level-names`** A level is a number and only a number. Never write the level, an age or a school grade into a title, summary, heading or the text.
- **`reading.simulators`** At most 1 simulator (RankedChoiceSim, GerrymanderLab, TaxBracketExplorer, Path270, GuessTheShare, Scale, Ballot), always followed by a paragraph naming what the reader should have noticed. *(validator: error)*
- **`reading.cross-refs`** Link the knowledge base with `[[term:slug]]`, `[[ideology:slug]]`, `[[issue:slug]]`, `[[org:slug]]` and `[[person:slug]]`: 3 to 8 a lesson (1 to 3 at level 1), on first meaningful mention only. The slug must exist. *(validator: warning)*
- **`reading.callouts`** Callouts are blockquotes with a bold label (**Why this matters:**, **Common misconception:**, **Think it through:**, **The scholar’s lens:**, **In the primary sources:**) or the Callout component. At most one Socratic “Think it through” pause a lesson.
- **`reading.figures-are-content`** A figure is structure and text, never a picture of text: a two-column table (three only when every cell is a number or one short word), Panels, Flow, Timeline, DataBars or Chart. Wrap it in Figure with a caption and a source, introduce it in prose and read its meaning afterward.
- **`reading.no-color-meaning`** Color never carries meaning alone, no caption points at a color or a line style, and no party colors.
- **`reading.mdx-syntax`** MDX is JSX: className, not class; style objects, not strings; {/* comments */}, not <!-- -->; escape a literal { or < in prose. *(validator: error)*
- **`reading.safe`** Never <script>, <style>, <iframe>, an event-handler attribute or an external image URL. *(validator: error)*
- **`reading.tilde`** Never ~~ around a number to mean “about”: it is strikethrough. Write “about”. *(validator: warning)*

### The component catalog

The only JSX a reading version may use. Anything else fails validation.

- **`Checkpoint`** (check). Predict, then reveal. The reader commits to an answer before opening it. The workhorse check, and the home of the recall pair. Props: question (string, required: must make the reader apply what they just read); hint (string, optional); children: the answer, which always says why, in 1 to 4 sentences.
- **`QuickCheck`** (check). One multiple-choice question with instant feedback, for telling near misses apart. Props: question; choices ({id, text}[], 3 or 4 plausible near misses); answer (the correct id); explanation (teaches the distinction).
- **`Figure`** (figure). Captions any figure: a component, a Markdown table or list, or a small drawing. Markdown inside needs a blank line after the opening tag and before the closing one. Props: caption (string, required: describes the content, never the drawing); source (string, optional); children.
- **`Panels`** (figure). Two to four things read against each other, or two parallel tracks. Side by side when there is room, stacked on a phone. Props: title (optional); children: 2 to 4 <Panel>.
- **`Panel`** (figure). One panel inside Panels. Props: title (required); tone ('blue' | 'accent' | 'gold' | 'green' | 'ink', decoration only); children: short paragraphs and lists.
- **`Flow`** (figure). Boxes and arrows written as text: a process, a lineage, a fork, a merge, two lanes. Props: steps (FlowStep[]: {title, detail?, tone?, via?, label?, note?} or {nodes: FlowNode[], via?, between?, note?}); title; numbered (boolean); plain (boolean).
- **`Chart`** (figure). A series over time, or a curve that is the point. Every plotted value is a sourced claim; a curve you cannot back with data is `schematic`. Props: series ({label, points: [x, y][] , color?, dashed?, show?}[]); title; unit; xUnit; xLabel; yLabel; xTicks; yTicks (five or fewer); xMin; xMax; yMin; yMax; marks ({x, y, label, place?}[]); rules ({x?|y?, label}[]); bands ({from, to, label}[]); schematic; plain.
- **`Callout`** (aside). A labeled aside: Why this matters, Common misconception, Think it through, The scholar’s lens, In the primary sources. Props: type ('why' | 'misconception' | 'think' | 'scholar' | 'sources'); title (optional); children.
- **`Timeline`** (sequence). A chronology on a rail. Add `expanded` when it stands in for a figure. Props: events ({date, title, detail?, tag?, tone?}[], 3 to 10); title; expanded (boolean).
- **`ProcessFlow`** (sequence). Click-through stages of a mechanism, with optional branch notes where the path can divert or die. Props: steps ({title, detail, branch?}[], 3 to 8); title.
- **`PerspectiveTabs`** (contested). Steel-manned positions side by side, for contested packs. Tab names match the lesson’s perspectives frontmatter. Props: children: 2 to 4 <Perspective>.
- **`Perspective`** (contested). One position inside PerspectiveTabs, as its smartest advocate would put it. Props: name (the position’s honest name); children: the case.
- **`DataBars`** (figure). Magnitudes the reader should feel, or a handful of dated values. Props: bars ({label, value, color?, note?}[]) or groups ({label, bars, note?}[]); title; unit (a leading % attaches, a leading $ goes in front); max; marker ({value, label}); stacked.
- **`Flashcards`** (drill). Genuinely enumerable facts. Never for argument. Props: cards ({front, back}[], 4 to 12); title.
- **`MatchUp`** (drill). Pair matching: term to definition, case to holding, clause to power. Props: pairs ({left, right}[], 3 to 6); title; instructions.
- **`OrderIt`** (sequence). Put a shuffled list in order, when the order is the content. Props: items (string[], written in the correct order); prompt (required); explanation; title.
- **`GuessTheShare`** (simulator). Commit to a guess of each share, then see the actual values. Counts as the lesson’s one simulator. Props: title (required); items ({label, actual, hint?}[]); unit (default %); source (strongly encouraged).
- **`RankedChoiceSim`** (simulator). Instant-runoff rounds, step by step. Props: See COMPONENTS.md in bettercitizen-content for the ballots and candidates it takes..
- **`GerrymanderLab`** (simulator). The same voters, three maps, three outcomes. Props: See COMPONENTS.md in bettercitizen-content..
- **`TaxBracketExplorer`** (simulator). Marginal versus effective tax rates. Props: See COMPONENTS.md in bettercitizen-content..
- **`Path270`** (simulator). Build a winning electoral coalition. Props: See COMPONENTS.md in bettercitizen-content..
- **`Scale`** (simulator). A count, the thresholds it crosses (51, 60, 67 senators), and a slider. Counts as the one simulator. Props: title; unit; min; max; value; zones and thresholds (see COMPONENTS.md).
- **`PositionMap`** (figure). Places on a spectrum or a two-question plane. Props: See COMPONENTS.md in bettercitizen-content..
- **`Ballot`** (simulator). A sample ballot the reader can mark. Counts as the one simulator. Props: See COMPONENTS.md in bettercitizen-content..

## Recall and challenge

A reader practises with checks in the page; a listener practises with think-pauses in the lecture; the assessment discriminates at the end. One question at a time, always.

- **`checks.count`** 2 to 4 checks (Checkpoint, QuickCheck) a lesson, one after roughly every major section. A recall pair counts as one. *(validator: warning)*
- **`checks.recall-pair`** The recall pair: after a section, a Checkpoint whose question begins “In your own words…” asks the reader to restate the section’s key idea; its answer is a model restatement in one to three sentences. Then, after at least a sentence of prose, a challenge (a Checkpoint or QuickCheck) that applies the idea to a case the section did not discuss.
- **`checks.apply`** A check must be answerable from what the reader just read, by applying it to a scenario or telling near misses apart, never by parroting the last sentence. The answer always explains why, in 1 to 4 sentences.
- **`checks.not-back-to-back`** Never two checks back to back: prose always comes between them, inside a recall pair too. *(validator: error)*
- **`checks.not-last`** Never a check at the very end of a lesson: that is the assessment’s job. *(validator: warning)*
- **`checks.no-duplicates`** Never reuse a check’s question verbatim in the assessment. *(validator: warning)*
- **`checks.think-pauses`** A lecture has 2 to 4 think-pauses (one or two in a short one): a question, `[long pause]` or `[pause 5s]`, then the answer with its reason. Take them from the lesson’s checks first. *(validator: warning)*
- **`checks.think-pause-required`** A lecture has at least one think-pause. *(validator: error)*
- **`checks.recall-prompt`** A lecture has at least one recall prompt: a moment that asks the listener to pull back something from earlier in the same lecture (“A minute ago I gave you three verbs. Can you still name them?”). *(validator: warning)*
- **`checks.never-ask-to-act`** A lecture never asks the listener to do, write, click or say anything. “Take a moment.” “Think it through.”
- **`checks.assessment-count`** An assessment has 3 to 5 questions, mostly multiple choice, closing with one free response that carries a socratic_seed. *(validator: warning)*
- **`checks.assessment-explanations`** Every multiple-choice question carries an explanation that teaches the distinction, and its correct_choice_id names one of its choices. *(validator: error)*
- **`checks.assessment-distractors`** Distractors are plausible near misses (the classic confusions), never jokes. At least one question requires transfer to a new scenario.

## The listening version

The lesson rewritten for the ear: a different text that teaches the same lesson. The test: one listen, eyes closed, no rewind. Tomorrow, can the listener tell a friend the three to five things it taught? The listener is on a walk, in a car or in bed with the screen off; they cannot see a heading, a bold word, a table or a quotation mark, and they never click or answer anything.

- **`listening.required`** Every new lesson ships a listening version. *(validator: error)*
- **`listening.marks`** The marks: a paragraph is one breath (0.9 s after it); `[beat]` holds a beat (1.3 s) before a reveal or between counted items; `[pause]` lets a line land (2 s); `[long pause]` gives time to think after a question (3.6 s); `[pause 5s]` is exactly that long, 10 s at most; `> A line.` is a key line, with a beat before and a pause after; `## Heading` is a section, never spoken (2.6 s); `<!-- note -->` is dropped. Choose a mark for the job its silence does, never its length. Where two meet, the longer wins.
- **`listening.speakable`** Nothing a voice cannot say: no links, no [[term:…]], no components, no tables, no bullet or numbered lists, no code, no web addresses. *(validator: error)*
- **`listening.breath`** A paragraph is one breath: usually one to three sentences, never over 900 characters. *(validator: error)*
- **`listening.no-title`** Do not write the title or a sign-off: the narrator says the title first and “That’s the end of this lecture” after. *(validator: warning)*
- **`listening.cold-open`** Start in the scene. Never “welcome”, never “in this lecture we will”. *(validator: warning)*
- **`listening.sections`** 3 to 5 `##` sections, each one idea. *(validator: warning)*
- **`listening.sentences`** Subject and verb early, one idea a sentence. Average 16 words a sentence or fewer (12 at level 1); no sentence over 30 except an exact quotation. Let explanation flow in sentences of twelve to twenty words, then land on a short one. *(validator: warning)*
- **`listening.no-asides`** No brackets and no asides inside a sentence; no “the former”, “the latter”, “respectively”, “as shown above” or “the following”. *(validator: warning)*
- **`listening.word-last`** Put the word that matters last: the narrator cannot stress a word, and the ear weights the end of a sentence.
- **`listening.verbs-first`** Say what happens in plain verbs, then name it, and use the new term again within two sentences.
- **`listening.signposts`** Signpost out loud: “First.” “That is the what. Now the why.” “Here is the turn.” Announce a list before you give it, and count it off.
- **`listening.key-lines`** 4 to 8 key lines (never fewer than 3), each 14 words or fewer, whole when heard alone, true as stated, and the point of its section. On contested ground a key line states a structural fact or an attributed position, never a verdict. *(validator: error)*
- **`listening.say-it-again`** After every definition and every hard claim, say it again in other words or show it in an example (“Put another way…”). Bring it back by name sections later.
- **`listening.gather`** The gather: count off the things to keep, one or two sentences each, with a [beat] between, reusing the key lines’ words. *(validator: warning)*
- **`listening.silences`** Expect, in a thousand words, ten to twenty [beat]s, five to ten [pause]s and one or two [long pause]s; at least 9 silences (marks, key lines and sections) per thousand words. *(validator: error)*
- **`listening.numbers`** One number a sentence. Round what need not be exact, keep exact what is the point. Numerals for years and counts; words where a numeral reads wrong (“Article One”, “section eight”, “five to four”). No Roman numerals; write out “percent”, “dollars”, “section”. *(validator: warning)*
- **`listening.names`** Introduce a person by what they are (“the historian Kenneth Jackson”). Cite in a clause; never read a citation, URL or docket number. A case is called what people call it.
- **`listening.quotations`** Quotations are exact, as the lesson has them. Say who is speaking first, say what to listen for when it is long, echo its key phrase after. Thirty words is long by ear. Never say “quote” and “unquote”.
- **`listening.figures`** A figure or table becomes the one thing it shows, in a sentence or two; a timeline becomes a walk in order; a simulator becomes one run described. Flashcards’ facts all belong in the gather.
- **`listening.voice`** A teacher who knows the material cold and likes the listener: plain, warm, exact, unhurried. Never hype, filler (“basically”, “essentially”), talking down (“simply”, “obviously”, “of course”), jokes that need a face, or “thanks for listening”. *(validator: warning)*
- **`listening.narrator`** The narrator reads punctuation as timing and cannot stress, see italics or do irony. Avoid a word that reads two ways when another will do (read, lead, live, minute, close). An ellipsis almost never.
- **`listening.level`** A script is written at its pack’s reading level and never mentions it. At level 1 a sentence averages 12 words, every new word is explained in the sentence that brings it in, and scholars and case names stay out unless the lesson uses them; levels 1 and 2 keep their reading grade ceilings. At level 2 a quoted document is still put in front of the listener, by reading its key sentence. *(validator: error)*
- **`listening.length`** Length, in spoken words: level 3 1,800 to 2,800 words, never over 3,000; level 2 1,400 to 2,200 words, never over 2,400; level 1 800 to 1,200 words, never over 1,400; a book chapter 1,100 to 2,200 words, never over 2,400. And never under 60 percent of the lesson’s prose. Past about twenty minutes, people stop holding on: choose, and let the page keep the rest. Never cut a think-pause or the gather to make room. *(validator: error)*
- **`listening.facts`** The lecture teaches the lesson and only the lesson: every fact, number, date, name, case and quotation in it is in its lesson. Leave detail out; never add or change any. A hedge stays a hedge. *(validator: warning)*
- **`listening.contested`** Contested lessons: set the question on ground nobody owns; give each perspective the same four things (who holds it, what it protects, its strongest argument in its own terms, its evidence) with the same verbs; give each its own attributed key line; say what the evidence settles and what it cannot; once, ask the listener to state the best case for the side they find less convincing, with [pause 5s], and leave that one unanswered.
- **`listening.books`** A reform book’s lecture says whose argument it is at the open, keeps the author’s first-person voice, and keeps the objections at the strength the chapter gives them.

## Truth and sourcing

- **`sourcing.verify`** Every number, date, case holding, statute citation and quotation is verified against a primary or authoritative source. If you cannot verify it, soften it or cut it.
- **`sourcing.required`** sources: is required, at least one, and must genuinely back the body. *(validator: error)*
- **`sourcing.no-invention`** Never invent a URL, DOI or page number. Cite only URLs verified to exist or stable official patterns (constitution.congress.gov, congress.gov, supremecourt.gov, archives.gov, census.gov, bls.gov, cbo.gov, crsreports.congress.gov…).
- **`sourcing.dated`** Every number carries a date: “as of mid-2026”, “in 2024”. A source citation names its date. *(validator: warning)*
- **`sourcing.figures`** Every plotted value is a claim and is sourced like one.
- **`sourcing.quotations`** Quotations are exact and attributed (speaker, work, year). Paraphrase when the exact wording cannot be confirmed.
- **`sourcing.aggregators`** Never cite a quote aggregator (BrainyQuote, Goodreads quote pages and the rest of bettercitizen-content’s meta/banned-sources.yaml).
- **`sourcing.facts-vs-interpretation`** Separate what is well established from what is an interpretation. State settled findings as findings, with their source; attribute interpretations to the people and schools that hold them.

## Neutrality

- **`neutrality.nonpartisan`** Civic content is nonpartisan: no endorsements, ratings or party colors, and never a word on how to vote.
- **`neutrality.steel-man`** On contested ground, present each position as its smartest advocate would. No editorializing, no “some say”: attribute positions to real schools of thought and real scholars.
- **`neutrality.no-verdicts`** No verdicts on contested value questions. Steel-man and stop. Empirical findings are stated as findings.
- **`neutrality.pair-examples`** When a tool has been used or abused, pair a real example from each side. One-sided examples read as editorializing even when every fact is right.
- **`neutrality.perspectives`** A contested pack’s lessons carry perspectives: frontmatter, and PerspectiveTabs names match them. *(validator: error)*
- **`neutrality.same-verbs`** Use the same verbs for every side: if one side “argues” and “points to”, so does the other.
- **`neutrality.no-nostalgia`** Neither nostalgia nor cynicism: say what each era did well and what it cost, and who paid.

## Lessons to study

Full lessons that show the standard at its best. Read both versions with `get_lesson`.

- **electoral-college / how-it-works**: The canonical reading version at level 3: cold open, mechanism before doctrine, checks woven through, a figure that teaches, the closing discipline. Its lecture shows a long lesson cut to what a listener can hold.
- **three-branches / overview**: The canonical listening version: the promise and the map, key lines, say-it-again, think-pauses, the gather and the close.
- **three-branches-2 / why-split-power**: Reading level 2: a primary document put in front of the reader, and a question only it can answer.
- **three-branches-1 / why-three-branches**: Reading level 1, in both versions: a scene the reader has lived, every new word defined where it appears.

## Examples

Short on purpose: they show the format, the parts and the voice, not the length. For full lessons, call `list_lessons` with `exemplar: true` and read them with `get_lesson`.

### Reading version (lessons/02-two-chambers.mdx)

````mdx
---
schema: bettercitizen.lesson/v1
slug: two-chambers
kind: reading
title: Why does a bill need both chambers?
objectives:
  - Explain why a bill must pass the House and the Senate in identical words
concepts: [bicameralism]
sources:
  - type: website
    citation: "U.S. Constitution, Article I, Section 7, in the Constitution Annotated (Library of Congress, accessed 2026)"
    url: https://constitution.congress.gov/browse/article-1/section-7/
duration_min: 12
---

# Why does a bill need both chambers?

Every Congress, the House passes bills that the Senate never votes on. Each one won a majority of the people's elected representatives, and each one died anyway. That is not a breakdown. It is the design.

## Two locks on one door

Article I, Section 7 says a bill becomes law only after both the House and the Senate pass it, and only then goes to the president. Think of two locks on one door: neither key opens it alone. The image breaks in one place, which the next section takes up: the two locks are not cut alike, because the chambers are elected differently.

<Checkpoint question="In your own words: what has to happen before a bill can reach the president?">
  Both chambers have to pass it, in the very same words. A House version and a Senate version that differ by a date are two bills, not one.
</Checkpoint>

That last point surprises people, so test it on a case.

<QuickCheck
  question="The House passes a bill. The Senate passes it with one date changed. What happens next?"
  choices={[
    {id: 'a', text: 'It goes to the president, since both chambers voted for it'},
    {id: 'b', text: 'One chamber must pass the other chamber’s exact text first'},
    {id: 'c', text: 'The Supreme Court decides which version is law'},
  ]}
  answer="b"
  explanation="Until both chambers have passed identical text there is no bill to present. The House can accept the Senate's change, or the two can reconcile their versions in a conference."
/>

## What this lesson doesn't settle

Whether two locks protect liberty or merely slow it is an argument as old as the Constitution, and the next lesson puts its strongest cases side by side.
````

### Listening version (lectures/02-two-chambers.md)

````markdown
---
schema: bettercitizen.lecture/v1
lesson: two-chambers
---

Picture a door with two locks. You have one key. [beat] The door stays shut.

That is how a bill becomes law in the United States. By the end of this lecture, you will be able to say why. We will take it in two steps. First, what the Constitution requires. Then, why the requirement surprises people.

## Two locks

Start with the text. Article One, section seven, says a bill becomes law only after both chambers pass it. Only then does it go to the president.

> A bill needs both chambers, in the same words.

Put another way, the House and the Senate each hold a key, and neither key works alone.

## The same words

Here is the part people miss. Both chambers must pass the very same text.

> Two different texts are two different bills.

Let's test that. The House passes a bill. The Senate passes it too, with one date changed. Can it go to the president? Take a moment.

[long pause]

Not yet. [beat] One chamber has to pass the other's exact text first. Until then, there is no bill to sign.

## What to keep

A minute ago I gave you an image for all of this. Can you still picture it?

[pause]

Two locks on one door. [beat] Both chambers must pass a bill. [beat] And they must pass the same words.

Whether two locks protect liberty or only slow it down is still argued. The next lecture puts the strongest cases side by side.

> Two keys, one door, the same words.
````

### Assessment (assessments/02-two-chambers.yaml)

````yaml
schema: bettercitizen.assessment/v1
lesson: two-chambers
questions:
  - id: q1
    kind: multiple-choice
    text: "A bill passes the Senate 60 to 40 and the House 250 to 180, but the House version adds one sentence. What is true?"
    choices:
      - { id: a, text: "It is ready for the president's signature" }
      - { id: b, text: "It has not passed Congress until both chambers pass identical text" }
      - { id: c, text: "The larger margin's version becomes law" }
    correct_choice_id: b
    explanation: "Article I, Section 7 requires both chambers to pass the same bill. Two different texts are two different bills, whatever the margins."
  - id: q2
    kind: free-response
    text: "Explain to a friend why a bill that won a majority in the House can still die."
    socratic_seed: "Ask what the second lock is, and who holds its key."
````

## Changelog

### 1.0.1 (2026-11-24)

- No rule changes. The JSON form now carries every number and phrase a lecture is checked against: the 900-character paragraph (limits.lectureParagraphChars), the length under which one or two think-pauses will do (limits.shortLectureWords), the narrator’s rate (numbers.narrationCharsPerSecond) and the phrases the listening version rules out (lectureRuledOut).
- `pnpm lesson-spec:write` also writes the JSON form into bettercitizen-content as lesson-spec.json, which its lecture check reads, so the content repo’s checks and the app’s validator use the same numbers.

### 1.0.0 (2026-11-22)

- First published spec. Brings STYLE.md (reading version), LECTURES.md (listening version), COMPONENTS.md (catalog), the assessment rules and the app’s schemas into one versioned document, served at /api/v1/lesson-spec and by the MCP tool get_lesson_spec.
- Names the recall pair: a prompt to restate a section’s idea in your own words, then a challenge question that tests it. A pair counts as one check.
- Every new lesson ships three files: the reading version, the listening version and the assessment. validate_lesson checks all three; create_lesson_draft saves them for an editor and never publishes.
