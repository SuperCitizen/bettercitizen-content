# 0005: A second, airy cover set, kept beside the first

Status: proposed, 2026-11-16. Written at Chris's direction: the first covers "look a little too ominous and dark"; make a completely new set that is "more airy and open", keep the first "in case we want to switch back", and compare both. It becomes accepted when Chris has it committed. It extends [ADR 0004](0004-pack-covers.md) and changes nothing it decided about what a cover is.

## Context

ADR 0004's covers share one style: warm charcoal grounds, engraved line-work and gouache, one gold accent. As a set it is consistent, and on a list of forty it reads as heavy. Chris asked for a lighter set to compare, without losing the first.

## Decision

1. **A set is every topic's cover in one style.** Sets live in `covers/sets/<style>/<topic>.jpg`. `covers/prompts.yaml` names each style under `styles:`, and every set shares the topics' `subject`s, so two sets differ in style alone. The first set is `dark`; the new one is `airy`.
2. **One set is active, and the apps read only that one.** `covers/<topic>.jpg` stays where core, bettercitizen.ai and the apps' dev scripts read it, as a copy of the set `prompts.yaml` names as `active:`. `npm run covers -- --use <style>` makes another set active; `npm run check:covers` fails when the copy differs from its set. Nothing in core or any app changes to switch sets, and switching back is the same one command.
3. **The airy style**: delicate ink line-work with translucent watercolor washes on warm white paper, lots of open space, soft morning daylight whatever the subject says about light, warm whites, soft grays and a little pale sage, and the same single muted gold accent. The rules of ADR 0004 hold: no text, no faces or real people, no party colors or symbols, skies pale warm white rather than blue, a quiet bottom third for the title.
4. **The comparison is Chris's own, side by side.** Not an experiment on learners: the apps carry no analytics (every repo's rules), so they never show learners different sets to measure them. Chris compares the sets on a private page, with each topic's card in three treatments: dark as shipped, airy with the current dark text band, and airy with a pale band and ink text.
5. **The text layer may follow the set.** White text on a black band suits dark pictures and weighs on light ones. If airy wins with the pale band, design.md's "Cover card" gains a pale text layer (warm white from 82% to 94% behind the title, ink text, the same 48-point fade above) chosen by the active set, and every app follows. Until then the dark band is the only text layer.

## Consequences

- The repo holds both sets, about 8 MB, plus the active copy. Release archives should carry only `covers/<topic>.jpg`, not `covers/sets/`.
- Regenerating one topic means regenerating it in every set (`--style dark --only x`, `--style airy --only x`) and running `--use` for the active one.
- A third style is one more entry under `styles:` and one `--style` run.
