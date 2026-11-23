# Brief: write short video scripts for BetterCitizen lessons and packs

BetterCitizen is a civic-education product. Its owner wants every lesson, and every pack's own page, to have a short video behind a Play button: one to three minutes, narrated by the lecture's synthetic voice and shown on a stage that displays scene titles, the line being said, key lines and short points. A viewer can watch straight through or choose to be stopped on the lesson's own check questions. This is the first, basic version of every video; they will be grown later.

Your job is to write the **video script** for each lesson of the packs assigned to you, and each of those packs' **introduction**. A script is short, so every sentence carries weight. Take care over each one.

## Where you work

The content repo's main checkout: `/Users/chris/Repos/mine/SuperCitizen/bettercitizen-content`

- Use absolute paths. Do not work in any other checkout or worktree.
- Create only files under `packs/<your pack>/videos/`, and edit only the `version:` line of your packs' `pack.yaml`. Touch nothing else: other writers are working on other packs in this same directory right now, and the checkout holds other people's uncommitted changes.
- Do not run `git add`, `git commit`, `git stash`, `git checkout` or any other git command that changes state.
- Never edit a lesson (`.mdx`), an assessment or a lecture script. If one looks wrong, report it.

## Read first, in full

1. `VIDEOS.md` (repo root): the standard. Follow all of it.
2. The two examples beside their sources: `packs/taxes/videos/01-how-it-works.md` with `packs/taxes/lessons/01-how-it-works.mdx` and `packs/taxes/assessments/01-how-it-works.yaml`; and `packs/taxes/videos/_intro.md` with `packs/taxes/pack.yaml`.
3. "Truth and neutrality" and "Writing for the narrator" in `LECTURES.md`.

## For each lesson

1. Read the whole lesson file (frontmatter, prose, every component) and its assessment file. The lesson's lecture script, `packs/<pack>/lectures/<same name>.md`, is a good guide to what matters most and how it sounds; you may reuse its phrasing, but the video is its own piece with its own shape, not a cut of the lecture.
2. Decide the one idea the lesson turns on, the scene that opens it, what the lesson complicates, and what the lesson has that the video will not. Choose one to three of the lesson's multiple-choice questions that your video will actually teach.
3. Write `packs/<pack>/videos/<lesson file name without .mdx>.md`.
4. Check it against the lesson line by line: every number, date, name, case, quotation and claim, in narration, key lines and points, must be in that lesson. For each stop, read the question and its correct answer and confirm the video has taught it by that point.

Then write the pack's `packs/<pack>/videos/_intro.md` from `pack.yaml` and what you now know of its lessons.

When all of a pack's scripts exist:

5. Run `node scripts/check-videos.mjs --pack <pack> --all` from the repo root. Fix every error and every warning you can.
6. Run `node scripts/check-lecture-facts.mjs --videos --pack <pack>`. Resolve every line it prints: in the lesson in another form (say so in your report), or cut.
7. Read each script once with the narration covered: do the scene titles, key lines and points alone tell the idea?
8. Bump the pack's `version:` minor in `pack.yaml` (x.y.z becomes x.(y+1).0).

## Where video scripts go wrong

- **A summary of everything.** Two minutes cannot hold a sixteen-minute lesson. Pick the one idea and its best example; name the rest in the hand-off.
- **A tilted contested video.** In a `contested: true` pack every perspective the lesson gives gets its turn, in the lesson's order, same verbs, about the same words, and its own key line or point. No verdict, no habitual last word. If there is not room to argue each, name all of them and say the lesson gives each its case.
- **Facts from memory.** Only the lesson's facts, however sure you are.
- **Points that are sentences, or that say something the narrator did not.** A point is a label of eight words or fewer for what was just said.
- **A stop the video has not earned.** If the viewer could not answer the question from what the video has shown so far, move the stop or choose another question.
- **Greetings, sign-offs, "in this video", "click below".**
- **The books.** `score-the-vote-book` and `ranked-choice-voting-book` argue a case in their author's first person: say so in the first scene and keep the chapter's objections at the chapter's strength.
- **Naming the reading level**, or talking down at level 1.

## Your report (your final message)

Under 250 words. For each pack: the checker's table lines for its scripts (words, scenes, stops, running time), and which question ids each lesson's video stops on. Then, separately: anything in a lesson or assessment that looked wrong, and any place you were unsure a statement was supported. Report only what you did and verified.
