# bettercitizen-content

Curriculum and reference content for [BetterCitizen](https://bettercitizen.ai) —
the personal AI civic coach.

This repo is the **source of truth** for everything the app teaches. It is
deliberately kept *outside* the application codebase so that anyone can review,
fork, and propose changes to the content without touching the product code or
needing a TypeScript/Node toolchain. Civic content should be auditable by the
public — that is the whole point.

## What's in here

| Directory | What it holds | Format |
| --- | --- | --- |
| `packs/` | Curriculum packs — the lessons in `/learn`. One directory per pack. | MDX + YAML |
| `components/` | The interactive lesson component library (the only JSX lessons may use — see [COMPONENTS.md](COMPONENTS.md)). | TypeScript/React |
| `glossary/` | Glossary terms (definitions the coach and lessons reference). | YAML, one file per term |
| `ideologies/` | Political traditions used by the steel-man flow. | YAML, one file per ideology |
| `issues/` | Issue cards + per-issue charitable framings (left/center/right). | YAML, one file per issue |
| `news-sources/` | News outlets the app's news features draw from (feed URL, tier, editorial lean). | YAML, one file per outlet |
| `organizations/` | Civic, governmental, think-tank, and university organizations. University-hosted policy centers link to their host via `parent_org` + `org_relationship` and carry `partisan_lean`, `ideology_tags`, and `influence_channels`. | YAML, one file per org |
| `persons/` | **Editorial** people (tier 3/4 commentators, journalists, public figures). | YAML, one file per person |
| `scripts/` | Dev-only structural checks (MDX compile, catalog whitelist, render smoke test). Content authors never need these. | Node |
| `touchstones/` | Touchstones — short memorable lines in four kinds (`saying`/`quote`/`fact`/`number`), the corpus behind the app's recall training. Authoring standard: [TOUCHSTONES.md](TOUCHSTONES.md). | YAML, one file per item |
| `meta/` | Repo-level data read by the validator *and* the authoring prompts (e.g. `banned-sources.yaml`). | YAML |
| `docs/` | Decisions about the lesson format (`docs/adr/`), and what they ask of the engine and the apps that render lessons (`docs/core-requests.md`, `docs/renderer-requests.md`). | Markdown |

> Federal and state officeholders (tier 1/2) are **not** authored here — the app
> imports those from GovTrack and Open States. This repo is editorial content
> only.

## Pack layout

```
packs/<pack-slug>/
├── pack.yaml              # manifest: title, summary, level, contested, lessons[]
├── lessons/
│   ├── 01-intro.mdx       # MDX body + YAML frontmatter (sources REQUIRED)
│   └── ...
└── assessments/
    └── <lesson-slug>.yaml # questions keyed to a lesson slug
```

Lessons are MDX: markdown plus a fixed catalog of interactive components
(checkpoints, quick checks, timelines, simulators) documented in
[COMPONENTS.md](COMPONENTS.md). Lesson files may not `import` anything — the
app supplies the catalog — so content stays auditable as plain text.

Every lesson's frontmatter **must** include `sources:` with primary sources.
Contested packs (`contested: true`) require each lesson to carry
`perspectives:` presenting multiple viewpoints without editorializing. The
validator rejects content that breaks these rules — see **Validation** below.

A topic can be written at more than one reading level. Each **edition** is a pack of its own that names its `reading_level:` (`1`, `2` or `3`; `3` when absent) and the `topic:` it shares with the others. `packs/three-branches-1`, `packs/three-branches-2` and `packs/three-branches` are the first set. See [STYLE.md](STYLE.md), "Reading levels (editions)".

## How the app consumes this

Today (Phase 1) the app reads this repo from a sibling checkout on disk:

```
Repos/
├── bettercitizen.ai/        # the app
└── bettercitizen-content/   # this repo
```

The app's `CONTENT_LOCAL_PATH` env var points at this checkout (default
`../bettercitizen-content`). Seeding happens through the app — the
`/setup/seed` step on a fresh install, or an admin "Re-seed" action — which
parses + validates everything here and writes it into the app's database.

A future phase will publish **signed, versioned releases** of this repo that
deployments pin and fetch (with ed25519 verification) instead of cloning a
sibling. The on-disk layout here won't change when that lands.

## Contributing

1. Fork this repo.
2. Add or edit a file (a new glossary term is a one-file PR; a new pack is a new
   directory under `packs/`).
3. Run validation locally (see below) so CI passes.
4. Open a PR. A maintainer reviews for accuracy, neutrality, and sourcing.

### Validation

Two layers of checks run in CI on every PR (see `.github/workflows/`):

1. **Standalone structural checks** (`check-mdx.yml`) — no app checkout needed.
   Compiles every `.mdx` lesson, enforces the component catalog and the
   no-`import`/`export` rule, cross-checks `pack.yaml` lesson lists,
   typechecks the component library, and server-renders every lesson:

   ```sh
   npm install
   npm run check
   ```

2. **The app's schema validator** (`validate.yml`) — content is validated
   against the schemas the app defines. To run it locally, point a
   BetterCitizen app checkout at this repo and run its content validator:

   ```sh
   # from the bettercitizen.ai app checkout
   CONTENT_LOCAL_PATH=../bettercitizen-content pnpm validate-content
   ```

   Note: until the app's MDX migration lands (see
   [MIGRATION.md](MIGRATION.md)), the app validator targets the last pre-MDX
   commit of this repo.

## License

[CC BY-SA 4.0](./LICENSE) — with the carve-outs any quotation corpus needs,
because parts of what this repo *contains* were never ours to license:

- **Curation, annotations, and metadata** — the selection and arrangement,
  lesson prose, every Touchstone `explanation`, origin and correction notes,
  and the structured metadata around them — are licensed **CC BY-SA 4.0**.
- **Quoted text** — the `line` of a `quote` Touchstone, and any quoted
  passage elsewhere — **remains © its original authors** where copyright
  applies. It is reproduced here as brief, attributed quotation (fair use);
  the license above does not, and cannot, relicense it.
- **Facts are not copyrightable, and US government works are public domain**
  (17 U.S.C. § 105) — statutes, court opinions, official statistics, and
  official government speech reproduced here carry no copyright at all.
- **Contributor credits:** a `contributed_by` display name is published with
  the content it credits and, like the rest of a public git history, is
  retained permanently — in this repo, in releases, and wherever the content
  is redistributed with its CC BY-SA attribution. Contribute under a name you
  are content to see in that record for good.
