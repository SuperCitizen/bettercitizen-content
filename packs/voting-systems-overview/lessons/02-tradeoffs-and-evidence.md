---
schema: bettercitizen.lesson/v1
slug: tradeoffs-and-evidence
kind: socratic
title: Tradeoffs — what each voting system actually optimizes for
objectives:
  - Distinguish between three things voting systems get judged on — voter expressiveness, strategic resistance, and counting simplicity
  - Recognize that no voting system optimizes for all properties simultaneously (Arrow + Gibbard-Satterthwaite)
  - Read empirical evidence about turnout, polarization, and majority-finding under each system without overreading it
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
duration_min: 16
---

# Tradeoffs — what each voting system actually optimizes for

Three honest claims to start with:

1. **No voting system is best at every property simultaneously.** This is a mathematical theorem, not an opinion. Kenneth Arrow proved it in 1951 for ranked systems; Gibbard and Satterthwaite extended a related result to nearly all single-winner systems in 1973–75.
2. **Empirical evidence on real-world adoption is partial and recent.** Most U.S. RCV history is from the past decade; Alaska's RCV is from 2022; approval voting has two cities. Strong claims about long-run effects on polarization or turnout *should* carry uncertainty bars.
3. **The "best" system depends on which property matters most to you.** The lesson is to be able to name those properties before you pick a side.

## Property 1: voter expressiveness

How much information can a voter convey about their preferences?

- **Plurality:** lowest. One bit per voter (one name).
- **Approval:** richer. A yes/no per candidate.
- **RCV:** richer still. A full ordering of candidates.
- **Score:** richest. Both an ordering *and* the relative intensity of preferences.
- **STAR:** as expressive as score on the ballot, with a runoff layer for tiebreaking.

An expressive ballot tells the system more — but the system is only useful if it actually uses what you said.

## Property 2: strategic resistance

How well does the system reward voting your honest preference, vs. voting tactically?

The Gibbard-Satterthwaite theorem (1973–75) proved that **every reasonable single-winner voting system with ≥3 candidates can be strategically manipulated** in some cases. So the question is not "is this system manipulable?" — they all are — but "is the strategic move under this system also a *plausible* move under realistic information?"

- **Plurality:** highly strategic in practice. The "spoiler" pressure to abandon your favorite is the canonical example.
- **Approval:** moderate. The strategic question is "where do I draw the approval threshold?" — but voting your favorite as approved never hurts you.
- **RCV:** strategically subtle. Truncation (not ranking everyone) and "burying" (ranking your favorite higher than tactically preferred) can occasionally backfire, but the cases where this matters are rare and require unusual coordination.
- **Score:** the most strategic on paper. The mathematically optimal strategy is min-maxing — give your favorite a 10 and your worst a 0, with little in between — which collapses score voting toward approval voting in practice.
- **STAR:** the runoff layer disrupts pure min-maxing, restoring incentives to give honest middle scores.

## Property 3: counting simplicity

How hard is it to administer? How easy is the count to audit?

- **Plurality:** trivial. Sum the vote counts per candidate.
- **Approval:** trivial. Sum the approvals per candidate.
- **Score:** trivial. Sum the scores per candidate.
- **RCV:** complex. Counts are sequential — eliminate, transfer, recount — and require centralized tabulation (you cannot just sum precinct totals).
- **STAR:** in between. Score totals can be summed; the runoff layer is a single additional pairwise comparison.

Counting simplicity matters for audit, recount, and public trust.

## Property 4: majority-finding (Condorcet criterion)

A voting system "satisfies the Condorcet criterion" if it always elects the candidate who would beat every other candidate one-on-one (when such a candidate exists).

- **Plurality:** does not satisfy.
- **Approval:** does not satisfy.
- **RCV (IRV):** does not satisfy (a famous failure case is Burlington VT 2009).
- **Score:** does not satisfy.
- **STAR:** not in general, but more often than IRV in simulation.
- **Pure Condorcet methods (Schulze, Ranked Pairs):** by construction. These are sometimes proposed but have not seen U.S. governmental adoption.

The Condorcet criterion has theoretical appeal. Whether it matters more than other properties is exactly the kind of values judgment voters and reformers have to make.

## What the empirical record actually says (with appropriate caveats)

- **Turnout under RCV:** generally similar to plurality, with mixed results in studies of specific cities. Maine and Alaska show no detectable turnout decline post-adoption.
- **Polarization / extremism:** the strongest case is theoretical (single-winner reform incentivizes broader appeal). Empirical evidence is too recent and too few jurisdictions to establish a strong causal claim.
- **Voter understanding:** large majorities in jurisdictions that have adopted RCV report understanding the ballot. Spoilage / overvote rates are slightly higher than plurality but comparable to other reform systems.
- **Cost of administration:** higher for RCV (centralized counting, voter education). Lower for approval (no infrastructure changes needed). Score voting falls between.

## The takeaway is not "X is best"

The takeaway is: **identify which properties you weigh most**, then ask which system optimizes for those, then look at the evidence on whether real-world adoption produces the predicted effects.

If you read the [[issue:ranked-choice-voting]] book or the [[issue:score-voting]] book and feel pulled to one camp — good. The next move is to read the *other* book with the same charity, and the academic literature with appropriate skepticism. The Mirror feature of SuperCitizen is built exactly for this.
