# Lecture rollout: how the scripts are being written

Every lesson is getting a lecture script (`packs/<pack>/lectures/`, standard in [`LECTURES.md`](../../LECTURES.md), decision in [ADR 0006](../adr/0006-lecture-scripts.md)). This folder is the working kit for that rollout, kept so anyone can pick it up. The live status is the GitHub issue in SuperCitizen/bettercitizen.ai titled "Spoken lecture scripts: rollout and handoff".

## The kit

- [`writer-brief.md`](writer-brief.md): the brief a writer is given. One writer takes one pack (three lessons), or three chapters of a book.
- [`verifier-brief.md`](verifier-brief.md): the brief for an independent second reader, used on scripts whose writer was cut off before their final checks.
- [`lesson-issues.md`](lesson-issues.md): contradictions the writers found inside lessons. Lessons are not edited by this work.

## Giving a writer a pack

The prompt is the brief plus an assignment that names the pack, each lesson file and slug, the script path to write, whether the pack is `contested: true`, and whether to bump the pack version (not for a book pack shared by several writers). For a contested pack, add the paragraph the brief calls "A tilted contested lesson" in full: each perspective the same treatment, the same verbs, a key line of its own, no verdict.

## Landing a finished pack

```bash
node scripts/check-lectures.mjs --pack <pack> --all     # must exit 0
node scripts/check-lecture-facts.mjs --pack <pack>      # read every line it prints
git add packs/<pack>/lectures packs/<pack>/pack.yaml && git commit
```

Then, from the app checkout, `CONTENT_LOCAL_PATH=<this checkout> pnpm validate-content`.

## What the checks do not prove

The fact check catches numbers, quotations and names that are not in the lesson. It cannot tell whether a position is credited to the right side, or whether a hedge was dropped. That takes a reader with the lesson open, which is what the verifier brief is for.
