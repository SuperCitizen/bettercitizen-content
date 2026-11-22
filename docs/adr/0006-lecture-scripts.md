# 0006: A lesson may carry a lecture script, written for the ear

Status: proposed, 2026-11-21, on branch `feat/spoken-lectures` for Chris's review. Written at Chris's direction after he listened to lecture mode: lectures "sound like AI is just reading a bunch of sentences together", with no cadence, no pauses to reflect, nothing said twice. He asked for lectures like those of the best instructors, built to be remembered, for all the content. The app's side of this is bettercitizen.ai ADR 0016.

## Context

Lecture mode narrated a lesson's page text. A lesson is written to be read: its sentences are long, its asides sit in brackets, its figures and checks are components a voice cannot say, and it never repeats a point, because a reader can look back. None of that can be fixed by a better voice. It is a different text.

## Decision

1. **A lesson may have a lecture script beside it**: `packs/<pack>/lectures/<lesson file name>.md`, with a frontmatter of `schema: bettercitizen.lecture/v1` and `lesson: <the lesson's slug>`. It is the same lesson rewritten for a listener. The lesson stays the source of truth; the script is its spoken edition. A lesson with no script is narrated from its page text, as before.
2. **The script writes down its timing** in a small set of marks: a paragraph is a breath; `[beat]`, `[pause]`, `[long pause]` and `[pause 5s]` are silences; a blockquote is a key line; a heading is an unspoken turn. A mark names the job a silence does. How long each lasts is the app's one table, so the rhythm of every lecture can be retuned without editing a script.
3. **The standard is [`LECTURES.md`](../../LECTURES.md)**: the shape of a lecture, the moves (key lines, saying it again in other words, think-pauses built from the lesson's own checks, a recall prompt, the gather), and how to write for a synthetic narrator.
4. **Only the lesson's facts.** A script adds no fact, number, date, name, case or quotation that its lesson does not have, and changes none. So a script needs no `sources:` of its own: the lesson's sources are its sources, and a correction to a lesson is a correction to its script.
5. **A contested lesson keeps its balance when spoken**: each perspective the lesson names gets the same treatment, the same verbs, comparable time and a key line of its own, and the lecture gives no verdict. A pack that makes a case (the two reform books) keeps its author's voice and says whose case it is.
6. **A script is written at its pack's reading level** and never names it.
7. **`npm run check:lectures`** measures every script against the standard: that it names a real lesson, its length against the lesson's, its sentences, its key lines, think-pauses and silences, and anything written for the eye. The app's `validate-content` remains the source of truth for the format.
8. **Adding scripts to a pack bumps its version**, like any edit.

## Consequences

- The repo holds two texts for a lesson, and an edit to a lesson's facts has to reach its script. The check cannot see that; a reviewer has to. A script that has fallen behind its lesson is the main risk of this decision.
- bettercitizen-core imports only `pack.yaml`'s lesson files today, so it does not see scripts. Until it does, a lecture built from core alone would be the page text. Recorded in `docs/core-requests.md`.
- Terms, issues and ideologies have no scripts. They are short entries, narrated as written.
