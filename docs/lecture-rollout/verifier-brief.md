# Brief: verify spoken lecture scripts another writer drafted

BetterCitizen is a civic-education product. Every lesson can be listened to as a lecture, narrated by a synthetic voice. Each lesson is getting a **lecture script**: the same lesson rewritten for the ear, the way the best lecturer would teach it to a hall of hundreds so they remember it. The standard for these scripts is `LECTURES.md`.

The scripts assigned to you were drafted by a writer who was cut off before their final checks. They pass the mechanical checkers, but nobody has verified them against their lessons. **You are the independent second reader.** Your job is to find and fix what is wrong, and to leave alone what is right. This product's promise is that it is accurate and does not take sides, so this check matters more than polish.

## Where you work

The content repo checkout on branch `feat/spoken-lectures`. When this was written that was the worktree: `/Users/chris/Repos/mine/SuperCitizen/bettercitizen-content/.claude/worktrees/spoken-lectures`

- Use absolute paths. Do not `cd` to any other checkout.
- Edit only the script files assigned to you (`packs/<pack>/lectures/*.md`). Do not touch `pack.yaml` (its version is already bumped), lessons, or anything else. Other people are working on other packs in this directory right now.
- Do not run `git add`, `git commit`, `git stash` or any git command that changes state.
- Never edit a lesson (`.mdx`). If a lesson looks wrong, report it.

## Read first, in full

1. `LECTURES.md` (repo root): the standard.
2. The canonical example, as a pair: the lesson `packs/three-branches/lessons/01-overview.mdx` and its script `packs/three-branches/lectures/01-overview.md`.
3. For a contested pack, one finished contested script for reference: `packs/voter-id-and-mail-ballots/lectures/02-the-strongest-cases.md`.

## For each script, in this order

1. Read its lesson in full (frontmatter, prose, every component: `Checkpoint`, `QuickCheck`, `Flashcards`, `PerspectiveTabs`, figures). Then read the script in full.
2. **Facts, statement by statement.** Go through the script one paragraph at a time and find each factual statement in the lesson: every number, date, name, case, holding, quotation, and every claim about who argues what or what caused what. A quotation must match word for word. A statement the lesson does not make comes out or is corrected to what the lesson says, however true it is in the world. Watch especially for: a position credited to the wrong side; a hedge dropped ("most" become "all", "as of mid-2026" gone); a number rounded so far it changes the claim; a finding the lesson calls contested stated as settled.
3. **Balance** (when the pack is `contested: true`; see "Contested lessons" in LECTURES.md). Each perspective the lesson names gets the same treatment, the same verbs, comparable time and a key line of its own. No verdict, no adjective for one side that the other does not get, no side given the last word by habit. For a pack that teaches a political tradition: the tradition in its adherents' own strongest terms, its critics exactly at the strength the lesson gives them. Ask of each perspective: would someone who holds it say this is their case, put as well as they would put it?
4. **The shape.** A cold open, the map, sections, key lines (`>`), each hard idea said twice in different words, think-pauses each followed by `[long pause]` (or `[pause 5s]`) and then an answer, one recall prompt, the gather, what is not settled, and a pointer that is true (check the pack's `pack.yaml` for the lesson order; the last lesson of a pack has no "next lecture").
5. **The ear.** No "above", "below", "this lesson", "this page"; no brackets; nothing a voice cannot say.
6. Run `node scripts/check-lectures.mjs --pack <pack> --all` and `node scripts/check-lecture-facts.mjs --pack <pack>` from the worktree root. Fix every error, every warning you can, and resolve every fact flag (in the lesson in another form: leave it and say so; not in the lesson: cut it).

## How to fix

Make the smallest edit that makes the script right, in the writer's own voice. Do not rewrite what works, do not restructure a script that is sound, and do not add material. If a script is over its length cap after your fixes, cut the least important detail, never a think-pause or the gather.

## Your report (your final message)

Under 350 words. For each script: its path, then either "clean" or a list of what you changed and why, one line each (quote the old words briefly). Then, separately: anything in a lesson that looked wrong or inconsistent, and anything you were unsure of and left. Report only what you did and verified.
