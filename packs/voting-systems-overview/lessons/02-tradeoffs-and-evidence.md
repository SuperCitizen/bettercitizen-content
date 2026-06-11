---
schema: bettercitizen.lesson/v1
slug: tradeoffs-and-evidence
kind: socratic
title: Tradeoffs — what each voting system actually optimizes for
objectives:
  - Distinguish between the properties voting systems get judged on — voter expressiveness, strategic resistance, counting simplicity, and majority-finding
  - State what Arrow's impossibility theorem actually proves (and what it does not), and what Gibbard–Satterthwaite adds
  - Diagnose a real election failure (Burlington 2009) in terms of a named criterion
  - Read empirical evidence about turnout, ballot errors, and polarization under each system without overreading it
concepts:
  - arrows-impossibility-theorem
  - gibbard-satterthwaite
  - voter-satisfaction-efficiency
  - strategic-voting
  - condorcet-criterion
sources:
  - type: paper
    citation: 'Arrow, K. J., "Social Choice and Individual Values" (Yale, 1951; 2nd ed. 1963) — original impossibility theorem'
  - type: paper
    citation: 'Gibbard, A., "Manipulation of Voting Schemes: A General Result," Econometrica 41 (1973): 587–601'
  - type: paper
    citation: 'Satterthwaite, M., "Strategy-proofness and Arrow''s conditions," Journal of Economic Theory 10 (1975): 187–217'
  - type: paper
    url: https://www.equal.vote/vse_paper
    citation: 'Quinn, J., "Voter Satisfaction Efficiency," Equal Vote Coalition (simulation methodology paper)'
  - type: paper
    url: https://electionlab.mit.edu/research/elections-performance-index
    citation: "MIT Election Data + Science Lab, Elections Performance Index — turnout & administration data"
  - type: paper
    url: https://protectdemocracy.org/work/electoral-reform-research/
    citation: 'Protect Democracy, "Electoral Reform Research" — meta-survey of empirical RCV studies'
  - type: book
    citation: 'Riker, W. H. (1982), Liberalism Against Populism: A Confrontation Between the Theory of Democracy and the Theory of Social Choice, W. H. Freeman — the classic argument for what Arrow''s result means for democratic theory.'
  - type: website
    citation: 'ranked.vote, "Burlington 2009 Mayoral Election" — full ballot-level tabulation of the IRV count and pairwise matrix.'
    url: https://ranked.vote/report/us/vt/btv/2009/03/mayor
  - type: website
    citation: 'FairVote, "Where is ranked choice voting used?" — adoption and repeal record through 2026.'
    url: https://fairvote.org/where-is-ranked-choice-voting-used/
duration_min: 16
---

# Tradeoffs — what each voting system actually optimizes for

In 1948, a young economist at the RAND Corporation was handed a Cold War problem: game theory needed a way to talk about what "the Soviet Union" or "the United States" prefers, so someone had to define how millions of individual preferences combine into a collective one. Kenneth Arrow went looking for an aggregation rule that met a short list of reasonable-sounding conditions — and proved, instead, that no such rule exists. *Social Choice and Individual Values* (1951) turned a staffing memo into one of the most consequential theorems in social science, and eventually a Nobel Prize. It also fixed the terms of every argument you will ever have about voting systems: the argument cannot be about finding the flawless one, because there isn't one. It has to be about which flaws you can live with.

Three honest claims frame everything that follows:

1. **No voting system is best at every property simultaneously.** That is a theorem, not an opinion — Arrow for ranked systems, Gibbard and Satterthwaite for strategy in nearly all systems.
2. **The U.S. empirical record on alternatives is real but short.** Most American RCV history is from the past decade; Alaska's system has run since 2022; approval voting's record is two cities, one of which has since been shut down by its state legislature. Strong causal claims about polarization or turnout should carry uncertainty bars.
3. **"Best" depends on which property you weight most.** The job of this lesson is to make you able to *name* the properties before you pick a side.

## What Arrow proved — and what he didn't

State the theorem carefully, because it is overclaimed constantly. Arrow considered systems that take voters' *rankings* of three or more candidates and produce a collective ranking. He asked for four conditions, each individually hard to argue with: **unrestricted domain** (voters may rank candidates in any order they like); **unanimity** (if literally everyone prefers A to B, the outcome must not put B above A); **independence of irrelevant alternatives**, or IIA (whether the group ranks A above B should depend only on how voters compare A and B — not on where some third candidate C sits); and **non-dictatorship** (no single voter's ballot decides everything regardless of the rest). The theorem: no ranked voting system can satisfy all of them at once. Every ordinal system you will ever meet violates at least one, usually IIA — which is the formal name for the spoiler problem.

Now the honest boundaries. Arrow's theorem does **not** say all voting systems are equally flawed; systems fail different conditions, at different frequencies, in scenarios of very different plausibility. It does **not** say elections are meaningless — most real electorates don't produce the pathological preference cycles the proof exploits. And it does not directly cover **cardinal** systems like approval, score, and STAR, which collect more than rankings; they escape Arrow's exact framing (a point their advocates press hard), though they walk straight into the next theorem instead. William Riker's *Liberalism Against Populism* (1982) built an entire theory of democracy on Arrow's result — elections as a veto on tyranny rather than a revelation of a coherent "popular will" — which remains the strongest statement of what the theorem might *mean*, and is itself contested.

<details class="checkpoint">
<summary><strong>Checkpoint:</strong> A friend says: "Arrow proved every voting system is equally broken, so reform is pointless." Name two distinct errors in that sentence.</summary>
<p>First, scope: Arrow's theorem covers <em>ranked</em> (ordinal) systems aggregating three or more candidates; cardinal systems like approval and score are outside its exact framing. Second, "equally": the theorem says every ranked system fails <em>some</em> condition <em>somewhere</em> — it says nothing about how often or how plausibly each fails, which is precisely where systems differ and where the real argument lives.</p>
</details>

## The strategy theorem: Gibbard–Satterthwaite

Arrow left a loophole — maybe some system, ordinal or not, at least never rewards lying about your preferences? Allan Gibbard (1973) and Mark Satterthwaite (1975) closed it. Their result: any deterministic voting rule that can elect three or more possible winners and is not a dictatorship is **manipulable** — there exist situations where some voter does better by voting insincerely. Gibbard's version is sweeping enough to cover cardinal ballots too. So "is this system gameable?" is the wrong question; they all are. The productive questions are: how *often* do profitable manipulations arise, how much *information* does a voter need to find them, and is the strategic move *psychologically natural* or exotic?

Graded on those questions, the five systems separate:

- **Plurality** is the most manipulated system in practice, and the manipulation is so natural we barely call it that: abandoning your sincere favorite to block your least-favorite. Duverger's psychological effect *is* mass tactical voting.
- **Approval**'s strategy is threshold-setting — how good is good enough to check? — but approving your sincere favorite can never backfire on them.
- **RCV** rewards sincere first choices in the overwhelming majority of real contests; its known failure modes (a favorite ranked first can, in rare "non-monotonic" configurations, be hurt by gaining support) require information no real campaign has. The practical cost is subtler: voters who rank only one candidate ("truncation") risk exhausted ballots, not backfires.
- **Score** is the most strategic on paper: with any information about the front-runners, your optimal ballot is min-max — top score for your side of the race, zero for the other, nothing in between — which collapses score voting into approval voting among strategic voters.
- **STAR** was engineered against exactly that: because the runoff counts only *which finalist you scored higher*, flattening your ballot to 5s and 0s throws away your runoff voice among your 5s. Honest middle scores stay rational — in simulations. No public election has tested it.

## Counting, auditing, and the Condorcet question

Two more properties round out the standard scorecard. The first is **counting simplicity**. Plurality, approval, and score are *precinct-summable*: each precinct reports totals, the totals add, and any citizen can check the arithmetic. RCV is not — elimination order depends on every ballot, so counts must be centralized (or precincts must report full preference tallies), recounts are more intricate, and election-night results in close races can wait days. STAR sits between: score totals sum by precinct, and the runoff needs only the pairwise tallies among top candidates. Summability sounds like bureaucratic trivia until a contested recount, at which point it becomes a public-trust property.

The second is the **Condorcet criterion**: does the system always elect the candidate who would beat every rival head-to-head, when such a candidate exists? You met the canonical American counterexample in Lesson 1 — Burlington, 2009, where Democrat Andy Montroll won every pairwise matchup and finished third under IRV. The mechanism has a name, **center squeeze**: a candidate positioned between two larger blocs is everyone's acceptable second choice and too few voters' first choice, so sequential elimination kills the consensus candidate first.

<figure class="lesson-figure" style="margin:2rem 0;">
<svg viewBox="0 0 720 240" width="100%" role="img" aria-label="A left-right spectrum with three candidates: Left with 35 percent first choices, Center with 28 percent, Right with 37 percent. The center candidate would win either head-to-head matchup but is eliminated first under instant runoff." style="max-width:680px;height:auto;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <text x="20" y="26" font-family="Georgia, serif" font-size="15" font-weight="bold" fill="var(--ink, #14130f)">Center squeeze: why elimination order matters</text>
  <line x1="40" y1="120" x2="680" y2="120" stroke="var(--line, #d9d5c9)" stroke-width="2" />
  <text x="40" y="142" font-family="Georgia, serif" font-size="12" fill="var(--muted, #6b6457)">left</text>
  <text x="680" y="142" font-family="Georgia, serif" font-size="12" fill="var(--muted, #6b6457)" text-anchor="end">right</text>
  <circle cx="150" cy="120" r="26" fill="var(--blue, #2f4d6e)" />
  <text x="150" y="125" font-family="Georgia, serif" font-size="12.5" fill="#ffffff" text-anchor="middle">L: 35%</text>
  <circle cx="360" cy="120" r="22" fill="var(--gold, #b08a3e)" />
  <text x="360" y="125" font-family="Georgia, serif" font-size="12.5" fill="#ffffff" text-anchor="middle">C: 28%</text>
  <circle cx="570" cy="120" r="27" fill="var(--accent, #8a2a1e)" />
  <text x="570" y="125" font-family="Georgia, serif" font-size="12.5" fill="#ffffff" text-anchor="middle">R: 37%</text>
  <text x="360" y="78" font-family="Georgia, serif" font-size="12.5" fill="var(--ink, #14130f)" text-anchor="middle">C is the second choice of nearly all L and R voters —</text>
  <text x="360" y="94" font-family="Georgia, serif" font-size="12.5" fill="var(--ink, #14130f)" text-anchor="middle">C beats L head-to-head and beats R head-to-head</text>
  <text x="360" y="178" font-family="Georgia, serif" font-size="12.5" fill="var(--ink, #14130f)" text-anchor="middle">But C has the fewest first choices, so instant runoff eliminates C first.</text>
  <text x="360" y="198" font-family="Georgia, serif" font-size="12.5" fill="var(--muted, #6b6457)" text-anchor="middle">Final round: L vs. R. The consensus candidate never gets there. (Plurality fails the same way.)</text>
</svg>
<figcaption style="font-size:0.9em;color:var(--muted,#6b6457);margin-top:0.5rem;">Figure: The center-squeeze configuration behind Burlington 2009. Any system that filters on first-choice strength — plurality, runoffs, IRV — can eliminate the candidate a majority prefers to every alternative.</figcaption>
</figure>

Here is the standard scorecard in one table. Read it as a menu of tradeoffs, not a ranking — every "no" is the price of some "yes" elsewhere:

| Property | Plurality | Approval | RCV (IRV) | Score | STAR |
| --- | --- | --- | --- | --- | --- |
| Expressiveness of ballot | One name | Yes/no per candidate | Full ranking | Graded intensity | Graded intensity |
| Sincere favorite never hurt by ranking/scoring them top | Fails | Holds | Holds for first choice; rare non-monotonic cases exist | Holds | Holds |
| Later choices can't hurt earlier ones ("later-no-harm") | — | Fails | Holds | Fails | Fails |
| Precinct-summable count | Yes | Yes | No | Yes | Mostly (pairwise tallies) |
| Always elects the Condorcet winner | No | No | No (Burlington 2009) | No | No, but rarely misses in simulation |

One cell deserves a gloss: **later-no-harm**. Under IRV, ranking a second choice can never hurt your first (your ballot stays with your favorite until elimination). Under approval, score, and STAR, supporting a second choice *can* help them beat your favorite. Advocates of each side treat the other's cell as the fatal one — IRV people say later-no-harm is what makes voters comfortable ranking honestly; approval/score people reply that later-no-harm is precisely *why* IRV ignores consensus candidates and squeezed the center in Burlington. That is not a resolvable disagreement; it is a values choice wearing a math costume. Pure Condorcet methods (Schulze, ranked pairs), which always elect the pairwise champion when one exists, are sometimes proposed as the fix; no U.S. government uses one.

<details class="checkpoint">
<summary><strong>Checkpoint:</strong> A city's IRV election elects candidate K, and analysts later show eliminated candidate M would have beaten K and everyone else one-on-one. A reform group says "switch back to plurality — it wouldn't have done this." Are they right?</summary>
<p>No. The failure here is the <strong>Condorcet criterion</strong>, and plurality fails it at least as badly — in the same center-squeeze configuration, plurality never even consults the second choices that make M the consensus candidate, and M (with the fewest first choices) loses immediately. The honest comparisons are between IRV and systems that <em>do</em> weigh consensus support: Condorcet methods, approval, score, or STAR — each of which buys that property by giving up something else, like later-no-harm or summability.</p>
</details>

## What the empirical record actually says (with appropriate caveats)

Theory tells you what *can* go wrong; only adoption tells you what *does*. The American record, read cautiously:

- **Turnout.** Studies of U.S. RCV cities find effects on turnout that are small and inconsistent in both directions; Maine and Alaska show no detectable post-adoption decline. No serious analyst claims a large turnout effect either way — be suspicious of anyone who does.
- **Ballot errors and voter understanding.** Overvote and spoilage rates run modestly higher under RCV than plurality, concentrated in first uses and in jurisdictions with weak voter education; surveys in adopting cities consistently report large majorities describing the ballot as easy to use. Exhausted ballots — real, typically a single-digit share — are the substantive cost to watch.
- **Polarization and candidate behavior.** The strongest claims here are theoretical (systems rewarding second-choice support should advantage coalition-builders). Alaska 2022 is suggestive — and so is Alaska 2024, when the same rules elected a Republican to the same seat. Too few cases, too little time, for confident causal claims.
- **Administration.** RCV costs more (central tabulation, education campaigns); approval costs nearly nothing extra; score and STAR sit between, untested at public scale.
- **The political record is data too.** Since 2020: Alaska adopted its system by 3,781 votes in 2020 and kept it by 743 in 2024, with a third vote coming in November 2026; Nevada's top-five-plus-RCV initiative passed in 2022 and died in its required 2024 second vote; Missouri banned future adoptions while grandfathering St. Louis; nineteen states have banned RCV outright; North Dakota's 2025 ban erased Fargo's approval voting. Electoral reform has itself polarized — which is evidence about feasibility, whatever you think of the merits.

## What this lesson did not settle

It did not tell you which property is most important, because that is not a technical question. A voter who prizes auditability and simplicity can rationally favor plurality or approval; one who prizes sincere ranking without spoilers, IRV; one who prizes consensus winners, a Condorcet method or STAR — and each is making a defensible values choice, not a math error. The takeaway is a discipline: **name the properties you weight most, then check which system optimizes them, then check whether real-world evidence supports the predicted behavior.** If you read the [[issue:ranked-choice-voting]] book or the [[issue:score-voting]] book in this library and feel pulled to one camp — good. The next move is to read the *other* book with the same charity, and the academic literature with the same skepticism. The Mirror feature of SuperCitizen is built exactly for this.
