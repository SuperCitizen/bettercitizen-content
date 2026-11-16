# 0004: Pack covers, one generated picture per topic

Status: proposed, 2026-11-16. Written at Chris's direction: every Learn entry gets a thumbnail generated with an AI image API, consistent and professional, with the image behind and separate from the text so the text design can change on its own, and the list filterable by level. It becomes accepted when Chris has it committed.

This decision crosses repos. It lives here because bettercitizen-content owns what a pack is. bettercitizen-core 0.2.2 reads the covers (`docs/core-api.md`, "Covers"), the shared design language draws them (`bettercitizen-core/docs/design.md`, "Cover card" and "Learn filters"), and the four native apps and bettercitizen.ai follow it.

## Context

The Learn list was text only: a title, a long summary and a few chips per pack, forty topics deep. It was hard to scan and looked like a table of contents rather than a course catalog. A picture per pack makes the list recognizable at a glance, but only if the pictures read as one set. Forty pictures each made on its own drift in style, palette and framing, and a picture with words in it fixes the typography for good.

The content's rules also bind pictures. Nothing may read as partisan: no party colors (red and blue together read that way in a U.S. civic app), no party symbols, no endorsement of one side of a contested topic. No real person may be shown.

## Decision

1. **One cover per topic, not per pack.** `covers/<topic>.jpg`, where the topic is a pack's `topic:` (its own slug when it names none). Every edition of a topic shows the same picture, so the picture names the subject and the reading level is told by its mark, as ADR 0002 has it. Nothing is added to `pack.yaml`, so the manifest schema and bettercitizen.ai's validator are unchanged.

2. **The pictures carry no text.** No titles, letters, numbers or legible writing. Each app lays the title, level and length over the picture with a scrim, from one recipe in the design language. Changing that text layer never means regenerating a picture.

3. **One style and one prompt per topic, in the repo.** `covers/prompts.yaml` holds a shared `style` and a `subject` per topic, and every picture is generated from the style plus its subject. The style fixes the medium (editorial illustration: fine engraved line-work with soft gouache shading), the palette (warm charcoal, stone grays, parchment and one muted gold accent, the design language's own accent, and no other colors), the framing (one symbolic subject in the upper two thirds, a quiet bottom third for the title) and the exclusions (no text, no faces or real people, no flags, party symbols or campaign imagery). The prompts are reviewable like any other content: a subject is a sentence anyone can read and challenge.

4. **Subjects are neutral by the content's rules.** A subject illustrates a topic, never a side of it. Each ideology pack gets a subject its own adherents would accept as fair. The gold accent sits on what unifies (a shared lintel, a level beam), never on one side. People appear only as small anonymous silhouettes.

5. **Generated with OpenAI's image API, by a dev script.** `npm run covers` generates the topics that have no cover, `--only` regenerates named ones, `--force` regenerates all of them. The key is the regenerating person's own, in this repo's `.env`, which is never committed. The model is `OPENAI_IMAGE_MODEL`, `gpt-image-2.6-sunburst` when unset (chosen over `gpt-image-2.6-flare`, whose pictures read more as 3D renders than as illustration). Content authors never need to run it: a new topic without a cover shows the design language's fallback card until someone generates one.

6. **The file is a 1200 × 800 JPEG.** 3:2, large enough for a 600-point card at 2x. JPEG because every platform the apps run on decodes it with no extra codec (WebP and AVIF need one on some Windows and GNOME setups). `npm run check:covers` fails when a topic has no subject or no cover, when a cover belongs to no topic, or when a file has the wrong format or size.

7. **AI-made pictures are labeled where content is credited.** The covers are illustrations, not claims, so a card does not carry an "AI-drafted" chip. The repo says how they were made here and in the README, and the apps' about screens credit the cover illustrations as AI-generated.

## Consequences

- Adding a topic means adding a `subject` and running `npm run covers -- --only <topic>`, or leaving the fallback card until someone does.
- The forty covers add about 4 MB (3.8 MB as generated on 2026-11-16) to the content tree and to a release archive, which `docs/content-release.md` in core now lists `covers/` in.
- A cover changes only by regenerating it. Core names each installed cover by its hash, so an app's image cache never shows an old one.
- The style is the contract for consistency. Changing it means regenerating every cover, not some of them.
- A generated picture can still contain something the prompt forbade (stray lettering, a color outside the palette). Each cover is looked at before it is committed, and regenerated with `--only` when it fails the rules above.
