# 0006: Covers follow light and dark appearance

Status: proposed, 2026-11-22. Written at Chris's direction: "make sure the photos we use match the light/dark mode they are in". It becomes accepted when Chris has it committed. It extends [ADR 0004](0004-pack-covers.md) and [ADR 0005](0005-airy-cover-set.md), and replaces 0005's "one set is active, and the apps read only that one".

## Context

ADR 0005 kept two cover sets and showed one of them, airy, on a pale card in both themes. In dark mode that puts a grid of near-white pictures on a dark window, and with the dark set active a light window gets a grid of charcoal ones. The two sets were drawn from the same subjects, one on warm white paper and one on warm charcoal, so they are already a light and a dark version of every cover.

## Decision

1. **Every topic ships two covers.** `covers/<topic>.jpg` is the light-appearance picture and `covers/dark/<topic>.jpg` the dark-appearance one. Both are content, and both go in a release archive. `covers/sets/` still does not.
2. **Each is a copy of a set.** `prompts.yaml` names the light set as `active:` (airy) and the dark one as `active_dark:` (dark). `npm run covers -- --use <style>` copies a set to `covers/`, and `--use-dark <style>` copies one to `covers/dark/`. `npm run check:covers` fails when either copy is missing a topic or differs from its set.
3. **The app picks by its appearance, and the text layer follows the picture.** Core carries both (`PackSummary.cover` and `cover_dark`). In light appearance an app draws `cover` under the pale text layer, and in dark appearance `cover_dark` under the dark text layer; design.md, "Cover card", has both recipes. When a topic has no dark cover the app draws the light one with the pale layer, as before, so a picture and its text layer are never mismatched.
4. **Appearance is the app's own.** It is the theme the app is drawn in, which may be the system's or the learner's choice in the app. It is not a setting of its own.

## Consequences

- The content tree and a release archive carry about 8 MB of covers rather than 4.
- Regenerating one topic means regenerating it in both sets and running `--use` and `--use-dark`.
- A third style can replace either appearance's set with one command, and nothing in core or the apps changes for it as long as a light set is pale and a dark set is dark.
- Core's importer, bettercitizen.ai and the four native apps each have to read the second picture. Until one does, it keeps showing the light cover on the pale card in both themes.
