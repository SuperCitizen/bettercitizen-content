<!--
Touchstone content PR template. Use it by appending `?template=touchstones.md`
to the compare URL, or as the body file for `gh pr create`.

Full standard: TOUCHSTONES.md at the repo root — this template is the
condensed reviewer surface, not a substitute for it. Content PRs are
added-files-only: touchstones/<kind>/<slug>.yaml, nothing else.
-->

## Batch

- **Kind(s) / count:**
- **Theme:**
- **Seed standard version:** TOUCHSTONES.md @ <!-- commit sha this batch was authored against -->

## Verification trail

One row per item. *Primary source* is the load-bearing citation (the archive
pin for quotes, the official/primary source for facts and numbers, the
reference work for sayings). *Negative checks* is `attribution_checks` for
quotes (`wikiquote`, `quote-investigator`), `—` otherwise. *Flags* is anything
the reviewer should look at twice: validator warnings acknowledged, probe
items, judgment calls.

| slug | kind | primary source | negative checks | flags |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

## Rejections

Rejections are part of the deliverable — they prove the gates. One row per
candidate that did not land as authored.

| candidate | gate that fired | disposition |
| --- | --- | --- |
| <!-- e.g. "eternal vigilance…" --> | <!-- e.g. named author on a saying --> | <!-- reclassified as quote / trimmed / re-entered attributed / dropped --> |

## Validator

- [ ] `pnpm validate-content` ran green (zero errors) from an app checkout
      that includes the Touchstone validator, before this PR opened.
- [ ] Every **warning** it printed (staleness, near-dup flags, glossary
      overlaps) is either resolved or acknowledged below with a reason.
- Balance distribution summary (paste the `ℹ touchstones balance:` lines):

```
(paste here)
```

- Warnings acknowledged:

```
(paste each warning + one line: kept because … / resolved by …)
```

## Checklist (condensed from TOUCHSTONES.md)

**Every item**

- [ ] `kind:` matches its directory; slug kebab-case, corpus-unique.
- [ ] `line` + `explanation` present; explanation written in-house, never
      lifted from a source.
- [ ] ≥1 source clearing the kind's bar; sources use `citation:` (no
      `title:`); **no banned domains** (`meta/banned-sources.yaml`);
      Wikipedia never terminal; no news sourcing where an official source
      exists.
- [ ] Every `related` slug resolves; `partisan_lean`/`ideology_tags` set
      where a valence exists (report-only — tagged, not gamed).

**Sayings**

- [ ] Reference-work source + `origin_note` (earliest attestation found).
- [ ] No named author or modern coinage — anything with one was reclassified
      as a `quote` (see Rejections).

**Facts**

- [ ] Official/primary source (`statute`/`court-opinion`/`crs-report`/
      `paper`/`pdf`, or a **.gov** website).
- [ ] No contested claims authored as facts — contested ground entered
      attributed (see Rejections).

**Numbers**

- [ ] Official source with `series_id` where one exists.
- [ ] `covers` + `published` + `recheck_by` all authored; `recheck_by`
      derived from the source's publication cadence.
- [ ] `tolerance` authored **explicitly** on every number.

**Quotes**

- [ ] Primary-archive pin (document + date), exact archival wording.
- [ ] Negative checks run and recorded in `attribution_checks`
      (Quote Investigator mandatory for quote-magnet speakers).
- [ ] `attribution_status` set; `misattributed` ⇒ `correction_note`
      (+ `actual_speaker` where known).
- [ ] ≤75-word lines; ≤5 per living author; aim ≤2 per work (3 = hard cap);
      **no lyrics, at any length**; poetry avoided.
- [ ] Living speakers carry a resolving `speaker_slug`; historic speakers
      carry **none**.
