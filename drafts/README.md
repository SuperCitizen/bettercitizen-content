# Drafts

Packs being written that are not published. The seed and the checks read `packs/` only, so nothing here reaches learners. Each draft keeps a pack's layout (`pack.yaml`, `lessons/`, `lectures/`, `assessments/`), plus `research/` for the sourced notes behind it.

Check a draft against the lesson spec (`LESSON_SPEC.md`) from the app checkout:

```sh
pnpm validate-lesson ../bettercitizen-content/drafts/<pack>
```

To publish one, an editor reviews it, moves it to `packs/<pack>/` (without `research/`), runs `pnpm validate-content` and `npm run check`, and opens a pull request.
