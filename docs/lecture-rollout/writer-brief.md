# Brief: write spoken lecture scripts for BetterCitizen lessons

BetterCitizen is a civic-education product. Every lesson can be listened to as a lecture, narrated by a synthetic voice. Until now the narrator read the lesson's page text, and the owner's verdict was blunt: it sounds like a machine reading sentences, with no cadence, no pauses to reflect, nothing said twice, nothing captivating. He asked for lectures that sound like the best instructors at the best colleges, speaking to a hall of hundreds, built so people remember what they heard.

Your job is to write the **lecture script** for each lesson assigned to you: the same lesson, rewritten for the ear. This is writing work of the highest standard. Take your time over each one.

## Where you work

The content repo checkout on branch `feat/spoken-lectures`. When this was written that was the worktree: `/Users/chris/Repos/mine/SuperCitizen/bettercitizen-content/.claude/worktrees/spoken-lectures`

- Use absolute paths. Do not `cd` to any other checkout.
- Create only the script files assigned to you, and edit only the `version:` line of your packs' `pack.yaml`. Touch nothing else. Other writers are working on other packs in this same directory right now.
- Do not run `git add`, `git commit`, `git stash` or any other git command that changes state.
- Never edit a lesson (`.mdx`). If a lesson looks wrong, report it.

## Read first, in full

1. `LECTURES.md` (repo root): the standard. It is the law for this work. Follow all of it.
2. The canonical example, as a pair: the lesson `packs/three-branches/lessons/01-overview.mdx` and its script `packs/three-branches/lectures/01-overview.md`. Study what happened to each piece of the lesson: the hook became the cold open; the figure became two sentences; each `Checkpoint` became a think-pause; the flashcards became the gather; the closing section became "what is not settled" and the pointer.
3. If any of your packs has `reading_level: 1` or `2`: the level 1 pair, `packs/three-branches-1/lessons/01-why-three-branches.mdx` and `packs/three-branches-1/lectures/01-why-three-branches.md`.

## For each lesson

1. Read the whole lesson file: frontmatter (`slug`, `title`, `objectives`, `perspectives`), prose, and every component (`Checkpoint`, `QuickCheck`, `Flashcards`, `PerspectiveTabs`, `Figure`, `Timeline`, simulators). All of it is your material. Read the pack's `pack.yaml` for the lesson order, and skim the neighbouring lessons so your "last time" and "next lecture" lines are true.
2. Plan before you write: the three to five things a listener must keep (start from `objectives:` and the flashcards); the cold open; the sections; which checks become think-pauses; the one recall prompt; the key lines.
3. Write the script to `packs/<pack>/lectures/<lesson file name without .mdx>.md`, with the frontmatter shown in LECTURES.md (`lesson:` is the lesson's `slug`).
4. Check your script against the lesson, line by line: every number, date, name, case, quotation and claim in the script must be in that lesson. Quotations must be exact. If you cannot find it in the lesson, cut it.
5. Run `node scripts/check-lectures.mjs --pack <pack> --all` from the worktree root. Fix every error, and every warning you can. It caps a script's length by reading level (see "Length" in LECTURES.md): if you are over, choose what to leave on the page; do not squeeze.
6. Run `node scripts/check-lecture-facts.mjs --pack <pack>`. It lists every number, quotation and name in your scripts that it cannot find in the lesson. Resolve every line it prints: if the thing is in the lesson in another form (a rounded figure, an abbreviation spelled out), leave it and say so in your report; if it is not in the lesson, cut it, however true it is. A quotation must match the lesson word for word, including a line of dialogue taken from a `Checkpoint`.
7. Read the finished script once more as a listener would hear it, start to finish, and fix what drags, what repeats without purpose, and what you could not follow by ear.

When every lesson of a pack has a script, bump that pack's `version:` minor in `pack.yaml` (x.y.z becomes x.(y+1).0). If a pack is only partly yours, do not bump it.

## Where scripts go wrong (avoid all of these)

- **A transcript with pauses sprinkled in.** Do not walk the lesson paragraph by paragraph. Rebuild it: what does a listener need first, what must be said twice, where do they need a moment.
- **A telegram.** Short sentences land a point. Explanation flows in sentences of twelve to twenty words. Mix them on purpose.
- **Facts from memory.** You know this subject. It does not matter: only the lesson's facts go in. No extra examples, dates, numbers, cases or first names, however true.
- **A tilted contested lesson.** If the pack is `contested: true`, follow "Contested lessons" in LECTURES.md exactly: same treatment, same verbs, a key line for each perspective, no verdict.
- **Words for the eye.** No brackets, no "above" or "below", no "this lesson" or "this page". Inside the series say "this lecture", "last time", "the next lecture". The last lesson of a pack has no next lecture: point to where the argument goes.
- **Questions with no time or no answer.** Every question put to the listener is followed by `[long pause]` and then its answer with the reason (the one steel-man pause in a contested lecture is the only exception).
- **Naming the reading level**, or talking down at level 1.
- **Greetings and sign-offs.** The narrator adds the lesson's title before your script and "That's the end of this lecture" after it. Start in the scene; end on your last line.

## Your report (your final message)

Under 300 words. For each lesson: the script's path, its word count and running time from the checker, and the things-to-keep in one line each. Then, separately: anything in a lesson that looked wrong or inconsistent, and any place you were unsure a statement was supported by the lesson. Report only what you did and verified; do not describe plans.
