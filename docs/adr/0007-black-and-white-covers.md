# 0007: Black-and-white covers, on a white text band

Status: proposed, 2026-11-23. Written at Chris's direction: the covers "don't look great in color", "can we try them in black and white". He compared three treatments of the airy set as Learn cards on a private page (color as shipped, plain grayscale, and crisp grayscale), chose "Crisp grayscale", and asked to "remove the cream overlay color". It becomes accepted when Chris has it committed. It extends [ADR 0004](0004-pack-covers.md), [ADR 0005](0005-airy-cover-set.md) and [ADR 0006](0006-covers-follow-appearance.md).

## Context

The airy set is watercolor on warm white paper: cream, pale sage and one gold accent. On a Learn grid of forty cards the tints add up to a beige page that competes with the titles. Taking the color out turns each cover into what reads as a pencil drawing, and the line-work the prompts asked for carries it. A plain grayscale turns the warm paper a dull light gray, so the chosen treatment also pushes the paper to white and darkens the lines a little. With the pictures neutral, the cream text band behind each title stood out as the only warm color left.

## Decision

1. **A style can be derived from another set.** In `covers/prompts.yaml` a style is either a prompt, as before, or `from:` a prompt style plus a `treatment:`. `npm run covers -- --style <derived>` makes the set from its source set's pictures with sharp, calls no API and needs no key. The only treatment so far is `crisp-grayscale`: the picture in grayscale, levels from 6% (black) to 92% (white), a 0.9 gamma on the midtones, written as an RGB JPEG at 1200x800 like every other set.
2. **`airy-mono` is airy in crisp grayscale, and it is the light-appearance set** (`active: airy-mono`). `covers/<topic>.jpg` is now a copy of it. The subjects are unchanged, so every cover shows the same scene as before.
3. **Dark appearance is black and white too** (added later on 2026-11-23, when Chris asked to "use light and dark (black and white) images for dark like we do for light now"). `dark-mono` is the `dark` set under the same `crisp-grayscale` treatment, which takes out the warm charcoal and the gold and pushes the background toward black, and it is the dark-appearance set (`active_dark: dark-mono`). `covers/dark/` is now a copy of it. As first written, this decision left dark appearance on the warm `dark` set.
4. **The pale text layer is white.** core's design.md, "Cover card", now makes `coverPaper` `#FFFFFF` instead of `#FBF8F1`, at the same 82% to 94% and with the same 48-tall fade, and every app draws it: bettercitizen.ai, Android, Apple, Linux and Windows. White is lighter than the cream it replaces, so the contrast design.md promises still holds: on at least 82% white over pure black the title measures 11.8:1 and the meta line 7.1:1.

## Consequences

- The repo holds a third and a fourth set, about 3.3 MB and 3.6 MB. As before, release archives carry only `covers/<topic>.jpg` and `covers/dark/`, not `covers/sets/`.
- Remaking an airy cover means remaking its mono copy too: `--style airy --only x`, then `--style airy-mono --only x`, then `--use airy-mono`. The script prints that reminder after it generates airy covers. `check:covers` confirms every set is complete and the copies match their sets, but it does not notice a mono cover that is older than its airy source.
- The prompts still ask for a gold accent. It becomes a light gray in both mono sets, and no shipped cover shows gold any more.
- The no-cover fill stays `coverFallback` `#EFE9DC`. Every topic has a cover, so it shows only while a picture loads.
- Going back to color is `npm run covers -- --use airy`, plus the warm `#FBF8F1` band back in design.md and every app.
- Screenshots in the app repos that show the Learn grid show the color covers until they are retaken.
