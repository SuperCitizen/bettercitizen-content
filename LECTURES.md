# BetterCitizen lecture standard

> **The rules and numbers in this guide are published as the lesson spec**, [`LESSON_SPEC.md`](LESSON_SPEC.md), section "The listening version": one versioned document that the app's validator enforces and that any AI writing a lesson reads from `/api/v1/lesson-spec` or the MCP tool `get_lesson_spec`. Where this guide and the spec differ, the spec is right. This guide keeps the craft and the reasons.

Every lesson in `packs/` can be listened to as a lecture. This guide governs the **lecture script**: the lesson rewritten for the ear, which the narrator reads in lecture mode. The bar is the best lecturer you ever had, in a hall of several hundred people, teaching so that the room remembers it next week: someone who talks to people for a living, who knows when to slow down, when to stop, when to ask, and when to say it again.

A lesson is written to be read. Read aloud as it stands, it sounds like a voice reading sentences: nothing lands, nothing is repeated, and there is never a moment to think. A lecture script fixes that with writing, not with a better voice. It is a different text that teaches the same lesson.

The canonical example of everything below: [`packs/three-branches/lectures/01-overview.md`](packs/three-branches/lectures/01-overview.md), beside the lesson it teaches, [`packs/three-branches/lessons/01-overview.mdx`](packs/three-branches/lessons/01-overview.mdx). Read both before you write one. A level 1 example is [`packs/three-branches-1/lectures/01-why-three-branches.md`](packs/three-branches-1/lectures/01-why-three-branches.md).

## The test

**One listen, eyes closed, no rewind. Tomorrow, can the listener tell a friend the three to five things this lecture taught?**

The listener is on a walk, in a car, or in bed with the screen off. They cannot see a heading, a bold word, a table or a quotation mark. They cannot glance back. They never click or answer anything. Everything the page does with layout, the script has to do with words and time.

## The file

A script lives beside its lesson: `packs/<pack>/lectures/<lesson file name>.md` for `packs/<pack>/lessons/<lesson file name>.mdx`. It is plain Markdown, not MDX.

```markdown
---
schema: bettercitizen.lecture/v1
lesson: overview
---

Picture a copy of the Constitution in front of you. Don't read it yet. Just look at its shape.

[beat]

Article One creates Congress. It takes up about half of the original document.
```

`lesson:` is the lesson's `slug` (from its frontmatter), not its file name. A lesson with no script is still narrated, from its page text, as before. After adding or changing scripts, bump the pack's `version` minor, as for any edit.

The narrator says the lesson's title by itself before the script starts, and "That's the end of this lecture" after it. Do not write either.

### The marks

| Write | It does |
| --- | --- |
| A paragraph | One **breath**: said in one go, then a short silence (0.9 s). |
| `[beat]` | Holds for a beat (1.3 s): before a reveal, after a set-up, between items worth counting. |
| `[pause]` | Lets the last line land (2 s). |
| `[long pause]` | Time to think (3.6 s): after a question put to the listener. |
| `[pause 5s]` | A pause of exactly that long, 10 s at most. For a problem that takes working out. |
| `> A line.` | A **key line**: the narrator holds a beat before it and a pause after it. |
| `## A heading` | A **section**: never spoken. The lecture turns here, with a longer silence (2.6 s). |
| `<!-- a note -->` | A note to other authors. Dropped. |

A mark on a line of its own follows the paragraph above it. A mark inside a paragraph cuts the paragraph there: `And the answer? [beat] Nobody.` Marks never add up; where two meet, the longer one wins. The lengths live in one table in the app and can be retuned without touching a script, so choose a mark for the **job** the silence does, never for its length.

Nothing else is allowed in a script: no links, no `[[term:…]]`, no components, no tables, no bullet lists, no code. The validator refuses them, because a voice cannot say them.

## The shape of a lecture

1. **The cold open** (20 to 40 seconds). The lesson's hook, rebuilt as something the listener can picture or a question they want answered. Never "welcome", never "in this lecture we will". Start in the scene.
2. **The promise and the map.** One or two sentences on what the listener will be able to do or explain by the end, then the stops, counted off: three, four at most. "We will take it in three steps. First… Second… And last…"
3. **Three to five sections**, each a `##`. A section is one idea, built the same way every time:
   - a line that hands off from the last section and opens this one ("That is the what. Now the why.");
   - the idea, concrete before abstract: the case, the year, the scene, then the rule;
   - the **key line** that states it;
   - the idea **again, in other words** or in an example;
   - in most sections, a **think-pause**: a question, time to answer it, the answer.
4. **The gather.** "Let's gather it up. Four things to keep." Count them off, one or two sentences each, with a `[beat]` between. Reuse the key lines' own words.
5. **What is not settled.** The lesson's closing discipline, in two to four sentences: the question this lecture leaves open.
6. **The pointer.** The question the next lecture answers. For the last lesson of a pack, where the argument goes from here.
7. **The close.** Come back to the opening image, and end on a line with weight.

## The moves

### Write sentences for the ear

- **Subject and verb early. One idea a sentence.** "Congress capped the House at 435, by an ordinary law, in 1929." Not "The House, whose size the Constitution leaves open, was capped at 435 by a 1929 statute."
- **Average 16 words a sentence or fewer** (12 at level 1). No sentence over 30 except an exact quotation. Break a long one into several: "And there is a list. Most of it sits in Article One, section eight. Taxing. Borrowing. Declaring war."
- **But let explanation flow.** Short sentences are for landing a point, not for everything. Three short ones in a row is a rhythm; ten is a telegram, and the narrator's voice falls the same way at the end of each. Most explaining should run in sentences of twelve to twenty words, with commas where you would breathe, and then land on a short one.
- **No brackets, no asides inside a sentence.** An aside becomes its own sentence or goes. No "the former", "the latter", "respectively", "as shown above", "see below", "the following".
- **Put the word that matters last.** The narrator cannot stress a word. The ear gives weight to the end of a sentence, so end there: "By Madison's lights, that is still a tyranny." Not "That is still a tyranny by Madison's lights."
- **Verbs first, then the term.** Say what happens in plain verbs, then name it: "No money leaves the Treasury unless Congress approves it. That approval is called an appropriation." Use the new term again within two sentences so it sticks.
- **A paragraph is a breath.** Usually one to three sentences. One sentence alone has weight. A run of very short sentences in one paragraph has speed. Decide which you want.

### Signpost out loud

The listener has no headings, so say them: "First." "That is the what. Now the why." "Here is the turn." "One caution before we go on." "Hold on to this." "Let's test that." Announce a list before you give it ("Three reasons") and count it off as you go.

### Key lines

A key line (`>`) is a sentence the listener should be able to say tomorrow. Four to eight a lecture. Each is:

- **short**: 14 words or fewer;
- **whole**: it makes sense heard alone, with no "this" or "it" pointing outside it;
- **true as stated**, with no hedge missing;
- **the point of its section**, not a decoration.

"Separation does not mean isolation." "Congress has a list. The president's clause has no such limit." On contested ground a key line states a structural fact or an attributed position, never a verdict (see below).

### Say it again, differently

A reader can re-read. A listener needs you to do it for them. After every definition and every hard claim, say it a second time in other words, or show it in an example: "In plainer words…", "Put another way…", "Here is what that means in practice…", "Let me say that once more, because it sounds like a paradox." Then, sections later, bring it back by name. Repetition with variation is the method, not padding. Verbatim repetition is for one thing only: echoing a short phrase straight after a quotation ("The very definition of tyranny.") or bringing a key line back in the gather.

### Think-pauses

Two to four a lecture (one or two in a short one). A think-pause gives the listener the practice a reader gets from the lesson's checks, without asking them to do anything:

```markdown
Let's test what we have so far. Here is a scene.

Your representative announces: "I will cut off every dollar for this military operation." Your neighbor scoffs: "Only the president controls the military."

Who has the Constitution on their side? Take a moment.

[long pause]

Both of them hold real cards. And that is the point.
```

- **Take them from the lesson's `Checkpoint` and `QuickCheck` components first.** Those are already the right questions.
- The question must be answerable from what the lecture has already said, by applying it, not by repeating it.
- Always put `[long pause]` after it (or `[pause 5s]` when it takes working out), and always answer it, with the reason.
- Never ask the listener to do, write, click or say anything. "Take a moment." "Think it through." "What would you say?"
- **At least one recall prompt**: a moment that asks the listener to pull back something from earlier in the same lecture. "A minute ago I gave you three verbs. Can you still name them?" Pulling it back is what fixes it.

### Use the silences for their jobs

- `[beat]`: timing. Before the answer to a set-up, between counted items, before the last word of a reveal.
- `[pause]`: landing. After a quotation that needs a moment, after the end of a thought, before the lecture changes direction inside a section.
- `[long pause]`: thinking. Only after a question the listener is meant to answer.
- A key line and a section break bring their own silence. Do not add marks around them unless you want longer.

In a thousand words, expect roughly ten to twenty `[beat]`s, five to ten `[pause]`s and one or two `[long pause]`s. A script with none sounds like the reading we are replacing. A script with one after every sentence sounds like a ransom note.

### Numbers, dates, names

- **One number a sentence.** Round what does not need to be exact ("about half", "nearly two hundred statutes") and keep exact what is the point ("435", "nine"). Never round in a way that changes what the lesson claims.
- Keep the years that anchor the story. Drop a year that was only a parenthesis on the page.
- Introduce a person by what they are: "the political scientist Richard Neustadt". Cite in a clause: "Madison, in Federalist 47". Never read a citation, a URL or a docket number.
- A case is called what people call it: "a case called Loper Bright", with the year if it matters. A case name with "v." is fine; the narrator says "versus".

### Quotations

Exact, as the lesson has them, in quotation marks (the captions show them). Say who is speaking before the quotation starts, tell the listener what to listen for when it is long, and echo its key phrase after. Thirty words is long by ear; trim to the lesson's heart of it or split it at a `[beat]`. Never say "quote" and "unquote".

### Figures, tables, simulators and cards

- A **figure or table** becomes the one thing it shows, in a sentence or two. Never read rows.
- A **process or timeline** becomes a walk in order: "First… Then… Only then…"
- A **simulator** becomes one run described: what you would set, what you would see, what it shows. You may point to the page once: "The lesson page has a simulator where you can try this."
- **Flashcards** are the lesson telling you what must be remembered. Make sure every one of them is in the gather.

### Rhythm

Vary sentence length on purpose: build with a longer sentence, land with a short one. Use threes ("Write. Carry out. Interpret."). Ask real questions, because a question changes the narrator's pitch, and pitch that never changes is what "a machine reading" sounds like; but never more than three in a row. Read the script aloud once yourself. Where you run out of breath, cut the sentence. Where you want to stop, mark it.

## The voice

A teacher who knows the material cold and likes the listener: plain, warm, exact, unhurried. "We", "you", "let's". Contractions are fine.

Never: hype ("amazing", "incredible"), filler ("basically", "essentially", "at the end of the day"), talking down ("simply", "obviously", "of course", "as you know"), jokes or sarcasm that need a face, stage directions, "welcome back", "in this lecture we will", "thanks for listening".

## Truth and neutrality (non-negotiable)

- **The lecture teaches the lesson, and only the lesson.** Every fact, number, date, name, case and quotation in a script is in its lesson: the body, a figure, a check, a card. Nothing from memory, however sure you are. You may leave detail out. You may not add any or change any. A hedge in the lesson ("most", "roughly", "as of mid-2026") stays a hedge.
- **Settled findings are stated as findings** (what a court held, what an audit found). Value questions stay open.
- **Reading levels.** A script is written at its pack's `reading_level` and never mentions it. At level 1: a sentence averages 12 words, every new word is explained in the sentence that brings it in, the open is a scene the listener has lived, and scholars and case names stay out unless the lesson uses them. At level 2 a quoted document is still put in front of the listener, by reading its key sentence.

### Contested lessons

A pack marked `contested: true` gives more than one position, usually in `<PerspectiveTabs>`. A lecture cannot show tabs, so it gives each perspective its turn, and builds the turns alike:

1. **Set the question on ground nobody owns**: what is being decided, and what every side agrees is true.
2. **Give each perspective the same four things**: who holds it, what they are trying to protect, their strongest argument in their own terms, and the evidence they point to. Keep the lesson's order and the lesson's names for the perspectives.
3. **Use the same verbs for every side.** If one side "argues" and "points to", so does the other. Never "claims" for one and "shows" for the other, and no adjective for one side's case that the other side's does not get.
4. **Give each perspective its own key line**, attributed: `> The access-first case: the measured harms run one way.` One side never holds the only key line.
5. **Say what the evidence settles and what it cannot.** Then stop. "That is a contested question, not a settled one" is a good last line for a section.
6. **One steel-man pause.** Once in the lecture, ask the listener to state the best case for the side they find less convincing, and give them `[pause 5s]`. This is the one question a lecture does not answer.

The lecture never says which side is right, never softens a position its lesson states strongly, and never gives one side the last word as a habit.

### Packs that make a case

The two reform books (`tags: [book]`) argue for something, in their author's first person, and say so. Their lectures keep that voice and that honesty: open by saying whose argument this is and what it argues for ("This is a chapter of Score the Vote. It is an argument, and the 'I' in it is the book's author."), and keep the chapter's objections and rival views at the strength the chapter gives them.

### When the lesson asks the reader to do something

A lesson may end by inviting the reader to try a simulator, declare a position or take the assessment. A lecture never asks for anything, but it may say once what is waiting: "When you are back at a screen, the lesson has a map you can redraw yourself."

## Writing for the narrator

The narrator is a synthetic voice. It reads punctuation as timing: a comma is a short pause, a full stop falls, a question mark rises, a colon sets up. That is all the expression it has, so punctuate for the ear.

- It cannot stress a word, see italics or do irony. Emphasis comes from word order, from a sentence standing alone, and from the silences.
- Write numerals for years and counts ("1787", "435") and words where a numeral is read wrong or looks wrong: "Article One", "section eight", "the Seventeenth Amendment", "five to four". No Roman numerals.
- Write out signs: "percent", "dollars", "section", "and". No "e.g.", "i.e.", "etc.".
- Write acronyms and names as they are normally written (FEC, PAC, Neustadt). How they are pronounced is fixed in the narrator, not in the script, so the captions stay right.
- Avoid a word that can be read two ways when another will do: "read" in the past tense, "lead" the metal, "live" as in a live question, "minute" meaning tiny, "close" meaning near.
- An ellipsis trails off. Use it almost never.

## Length

A lecture is set by the listener's attention, not by the lesson's length. Past about twenty minutes, people stop holding on.

| The lesson is | Aim for | Never more than |
| --- | --- | --- |
| Level 3 | 1,800 to 2,800 words (14 to 21 minutes) | 3,000 |
| Level 2 | 1,400 to 2,200 words | 2,400 |
| Level 1 | 800 to 1,200 words (6 to 9 minutes) | 1,400 |
| A book chapter | 1,100 to 2,200 words | 2,400 |

A lecture adds restatement, questions and the gather, so it cannot also carry every detail of a long lesson. Choose. Keep what the listener must leave with, and let the page keep the rest: cut the fourth example, the second statistic that makes the same point, the list of every statute. Never cut a think-pause or the gather to make room for a detail.

## Before you commit

```bash
npm run check:lectures
```

It measures every script: that it names a real lesson, its length, its average sentence, its key lines, think-pauses and silences, and anything written for the eye.

```bash
npm run check:lecture-facts
```

It lists every number, quotation and name in a script that it cannot find in the script's lesson. Look at each line it prints: either the thing is in the lesson in another form, or it comes out.

Then validate with the app, which is the source of truth for the format:

```bash
cd ../bettercitizen.ai && CONTENT_LOCAL_PATH=../bettercitizen-content pnpm validate-content
```

And ask of the finished script:

- Could I say back its three to five points without looking?
- Does every section state its idea twice, in different words?
- Is every question followed by time and then an answer?
- Is there one moment that asks the listener to recall something from earlier?
- Is every fact in the lesson? Is every position on contested ground still in its advocates' own strongest terms?
- Did I read it aloud?
