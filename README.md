# supercitizen-content

Curriculum and reference content for [SuperCitizen](https://supercitizen.ai) —
the personal AI civic coach.

This repo is the **source of truth** for everything the app teaches. It is
deliberately kept *outside* the application codebase so that anyone can review,
fork, and propose changes to the content without touching the product code or
needing a TypeScript/Node toolchain. Civic content should be auditable by the
public — that is the whole point.

## What's in here

| Directory | What it holds | Format |
| --- | --- | --- |
| `packs/` | Curriculum packs — the lessons in `/learn`. One directory per pack. | Markdown + YAML |
| `glossary/` | Glossary terms (definitions the coach and lessons reference). | YAML, one file per term |
| `ideologies/` | Political traditions used by the steel-man flow. | YAML, one file per ideology |
| `issues/` | Issue cards + per-issue charitable framings (left/center/right). | YAML, one file per issue |
| `organizations/` | Civic + governmental organizations. | YAML, one file per org |
| `persons/` | **Editorial** people (tier 3/4 commentators, journalists, public figures). | YAML, one file per person |

> Federal and state officeholders (tier 1/2) are **not** authored here — the app
> imports those from GovTrack and Open States. This repo is editorial content
> only.

## Pack layout

```
packs/<pack-slug>/
├── pack.yaml              # manifest: title, summary, level, contested, lessons[]
├── lessons/
│   ├── 01-intro.md        # markdown body + YAML frontmatter (sources REQUIRED)
│   └── ...
└── assessments/
    └── <lesson-slug>.yaml # questions keyed to a lesson slug
```

Every lesson's frontmatter **must** include `sources:` with primary sources.
Contested packs (`contested: true`) require each lesson to carry
`perspectives:` presenting multiple viewpoints without editorializing. The
validator rejects content that breaks these rules — see **Validation** below.

## How the app consumes this

Today (Phase 1) the app reads this repo from a sibling checkout on disk:

```
Repos/
├── supercitizen/            # the app
└── supercitizen-content/    # this repo
```

The app's `CONTENT_LOCAL_PATH` env var points at this checkout (default
`../supercitizen-content`). Seeding happens through the app — the
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

Content is validated against the schemas the app defines. CI runs the validator
on every PR. To run it locally, point a SuperCitizen app checkout at this repo
and run its content validator:

```sh
# from the supercitizen app checkout
CONTENT_LOCAL_PATH=../supercitizen-content pnpm validate-content
```

## License

See [LICENSE](./LICENSE).
