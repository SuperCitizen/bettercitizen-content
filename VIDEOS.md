# BetterCitizen video standard

Every lesson in `packs/`, and every pack's own page, has a short video with a Play button. This guide governs the **video script**: one to three minutes that give the heart of a lesson to someone who has not read it yet, narrated and shown on a stage. A viewer chooses how to watch: straight through, or stopping on the lesson's own check questions.

A video is not the lecture cut short, and it is not the lesson read aloud. The lecture (LECTURES.md) teaches the whole lesson to someone who cannot look. The video has a screen and two minutes: it shows the one idea the lesson turns on, makes the viewer want the rest, and sends them to it.

This is the basic form, meant to be grown. Today a scene can show its title, the line being said, key lines and short points. Figures, maps and things to do on the stage will be added to scenes later without changing what is written now.

Examples of everything below: [`packs/taxes/videos/01-how-it-works.md`](packs/taxes/videos/01-how-it-works.md) for a lesson, and [`packs/taxes/videos/_intro.md`](packs/taxes/videos/_intro.md) for a pack's introduction.

## The test

**Watched once, with the sound on or off: can the viewer say the one idea, and do they know what the lesson will give them that the video did not?**

Many people watch with the sound off. Everything spoken is captioned, and what must be kept is on the screen as a key line or a point. Nothing may depend on a voice alone or on a picture alone.

## The file

A lesson's video script lives beside its lesson: `packs/<pack>/videos/<lesson file name>.md` for `packs/<pack>/lessons/<lesson file name>.mdx`. A pack's introduction is `packs/<pack>/videos/_intro.md`. Both are plain Markdown, not MDX.

```markdown
---
schema: bettercitizen.video/v1
lesson: how-it-works
---

## The raise nobody should refuse

Somebody at work turned down a raise. They say it would have pushed them into the next bracket.

> No raise can lower your take-home pay through the brackets.

- A bracket taxes only the dollars inside it

[check q3]
```

`lesson:` is the lesson's `slug` (from its frontmatter), not its file name. An introduction has `pack: <the pack's slug>` in place of `lesson:`.

Nothing is added around the script. The stage opens on a title card (the lesson's or pack's title, unspoken) and closes on a card that points to the lesson. Do not write either, and do not greet or sign off.

### What you can write

| Write | It does |
| --- | --- |
| `## A scene title` | Starts a **scene**. The title is shown on the stage and never spoken. A script begins with one. |
| A paragraph | **Narration**: said in one go and shown as the caption, then a short silence. |
| `> A line.` | A **key line**: spoken, and held large on the stage. The one thing from this scene to keep. |
| `- A point` | A **point**: shown on the stage, never spoken. It appears when the narration reaches the place it is written, and stays until the scene ends. |
| `[beat]`, `[pause]`, `[long pause]` | Silences, as in a lecture (1.3 s, 2 s, 3.6 s). |
| `[check q2]` | A **stop**, on a line of its own. A viewer who chose to be asked gets the lesson's question `q2` here, and the answer counts as it does on the lesson's page. A viewer who chose to watch straight through never sees it. |
| `<!-- a note -->` | A note to other authors. Dropped. |

Nothing else is allowed: no links, no `[[term:…]]`, no components, no tables, no numbered lists, no code.

## The shape of a lesson's video

Three to six scenes, 180 to 420 spoken words (the checker fails a script under 150 or over 450). At the narrator's pace that is one to three minutes.

1. **The open.** The lesson's hook as a scene, a case or a question, in two or three sentences. Never "welcome", never "in this video".
2. **The idea.** The one thing the lesson turns on, shown plainly: one or two scenes. Use the lesson's best example, not a summary of all of them.
3. **Why it is not simple.** What the lesson complicates, disputes or leaves open, in one scene. A video that makes the subject sound finished has misled the viewer.
4. **The hand-off.** One or two sentences on what the lesson itself has that the video did not: the cases, the figure, the argument on each side. End there.

Per scene: one idea, at most one key line, at most four points. Every scene shows something besides its title, a key line or at least one point.

- **Key lines**: two to five in a video, each 14 words or fewer, each able to stand alone on a screen.
- **Points**: at least three in a video, eight words or fewer each. A point is a label for what was just said (a number with its unit, a name, a step), never a new fact and never a sentence the narrator did not cover. Write it straight after the sentence it belongs to.
- **Stops**: one to three `[check …]` marks, using the ids of the lesson's own multiple-choice questions (`packs/<pack>/assessments/<lesson file>.yaml`). Put each one after the scene that gives the viewer what they need to answer it. Never before the video has taught it, and never in the first scene. If the video does not teach what a question asks, do not use that question. A lesson with no multiple-choice question has no stops.

## The shape of an introduction

A pack's `_intro.md` is shorter: two to four scenes, 90 to 220 spoken words (fails under 70 or over 260), one to three key lines, at least two points, and no stops.

1. **Why this subject is worth an hour of someone's life**: a scene or a question from the pack's own material.
2. **What the pack covers**, lesson by lesson, in order, in a sentence each or less. Points are good here: one per lesson.
3. **Where to start.** Name the first lesson.

## Truth and neutrality (non-negotiable)

- **A lesson's video uses only that lesson's facts.** Every number, date, name, case and quotation is in the lesson: its body, a figure, a check, a card. Nothing from memory, however sure you are. A hedge in the lesson stays a hedge. An introduction uses only its pack: `pack.yaml` and the pack's lessons.
- **Short is where neutrality breaks.** With two minutes it is tempting to give one side the example and the other side a clause. In a pack marked `contested: true`, every perspective the lesson gives gets a turn in the video, in the lesson's order, with the same verbs, about the same number of words, and a key line or a point of its own. The video never says which side is right and never gives one side the last word. If the lesson has more perspectives than the video has room for, name them all and say the lesson gives each its case; do not pick two.
- **Packs that make a case.** The two reform books (`tags: [book]`) argue for something in their author's first person. Their videos say so in the first scene ("This is a chapter of Score the Vote. It is an argument, and the 'I' in it is the book's author.") and keep the chapter's objections at the strength the chapter gives them.
- **Reading levels.** A script is written at its pack's `reading_level` and never mentions it. At level 1 a sentence averages 12 words and every new word is explained in the sentence that brings it in.
- **Nothing is asked of the viewer** except through a stop. No "click", "tap", "scroll", "like" or "subscribe".

## Writing for the narrator and the screen

The narrator is the lecture's synthetic voice; everything in "Writing for the narrator" in LECTURES.md applies: punctuate for the ear, write out signs ("percent", "dollars"), no "e.g.", no brackets, numerals for years and counts.

Points and key lines are read, not heard, so they may use numerals and signs the narration writes out: the narration says "33 percent", the point may say `Payroll taxes: 33%`.

## Before you commit

1. `node scripts/check-videos.mjs --pack <pack> --all` passes, and you have read its warnings.
2. `node scripts/check-lecture-facts.mjs --videos --pack <pack>`: every line it prints is something in the script it could not find in the lesson. Each one is either in the lesson in another form, or it is cut.
3. You have read the script as a viewer with the sound off: scene titles, key lines and points alone still tell the idea.
4. The pack's `version` is bumped (minor), as for any edit.
