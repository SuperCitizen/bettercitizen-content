# Migration: markdown lessons → MDX with interactive components

This repo moved lessons from `.md` (rendered app-side with `marked` +
`dangerouslySetInnerHTML`) to **`.mdx`** with the component catalog in
[`COMPONENTS.md`](COMPONENTS.md) / [`components/`](components/). The content
here is already converted. The app needs the following changes before it can
seed and render this version of the repo — until then, pin the last pre-MDX
commit.

## App-side checklist

1. **Loader** — accept `.mdx` filenames in `pack.yaml` `lessons:` (the loader
   currently accepts only what `pack.yaml` names, so this is just relaxing
   the extension check; slugs and frontmatter are unchanged —
   `schema: bettercitizen.lesson/v1` still applies).
2. **Renderer** — replace `marked` + `dangerouslySetInnerHTML` with an MDX
   renderer (e.g. `next-mdx-remote/rsc` or `@mdx-js/mdx` `evaluate`), passing
   the `mdxComponents` map exported from this repo's `components/index.ts`.
   Vendor or workspace-link the `components/` directory; it is dependency-free
   React + TypeScript (`'use client'` where stateful) and themes itself via
   the existing CSS variables (`--ink`, `--muted`, `--accent`, `--gold`,
   `--blue`, `--green`, `--line`, `--card`).
3. **Validator** — extend `validate-content`:
   - lesson files end in `.mdx`;
   - the MDX compiles (`@mdx-js/mdx` `compile()` — catches stray `{`/`<`,
     HTML comments, style-string attributes);
   - **no `import`/`export` statements** in lesson bodies (compile with
     a check on the ESM tree, or reject on regex `^(import|export)\s` outside
     code fences) — this is the auditability guarantee;
   - every JSX element name is either a lowercase HTML/SVG tag or a member of
     `LessonComponentName` (exported from `components/index.ts`);
   - existing rules unchanged: frontmatter schema, `sources:` ≥ 1,
     `perspectives:` on contested packs, `[[type:slug]]` cross-refs resolve.
4. **Sanitization** — the old pipeline passed raw HTML through; MDX renders
   real JSX. Keep rejecting `<script>`, `<style>`, `<iframe>`, event-handler
   attributes (`on*`), and external URLs in `src`/`href` inside lesson bodies
   at validation time (defense in depth even though the catalog provides no
   such surface).
5. **Glossary popovers** — `[[term:slug]]` and friends are untouched; the
   remark plugin (or post-processing) that resolves them must run in the MDX
   pipeline (as a remark plugin before compile).
6. **Checkpoint styling** — the `.checkpoint` CSS for `<details>` can be
   retired once no `.md` lessons remain; `<Checkpoint>` carries its own
   inline styles.

## What deliberately did NOT change

- `pack.yaml` schema (`bettercitizen.content/v1`) — only the lesson filename
  extensions inside `lessons:` and version bumps.
- Lesson frontmatter schema (`bettercitizen.lesson/v1`), slugs, and the
  assessment format (`bettercitizen.assessment/v1`). Assessments still key
  off lesson slugs, which were preserved exactly.
- Sourcing rules (STYLE.md "Truth and sourcing") and the contested-pack
  `perspectives:` requirement.

## Verifying this repo standalone (no app checkout)

The repo now carries a minimal dev toolchain (content authors still never
need it — it only gates PRs):

```sh
npm install
npm run check          # check:mdx (compile + catalog + structure), check:components (tsc), check:render (SSR smoke test)
```

`scripts/check-mdx.mjs` compiles every lesson, enforces the
no-`import`/`export` rule, whitelists JSX tags against
`components/index.ts`, and cross-checks `pack.yaml` lesson lists. It is a
fast structural gate, not a replacement for the app's `validate-content`.
