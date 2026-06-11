---
schema: bettercitizen.lesson/v1
slug: what-it-is
kind: reading
title: What gerrymandering is — and what it isn't
objectives:
  - Define gerrymandering in mechanical terms a non-specialist can repeat
  - Identify "packing" and "cracking" as the two core moves and show how each wastes votes
  - Compute a simple efficiency gap and state what it does and doesn't prove
  - Distinguish partisan, racial, and incumbent-protection variants
  - Explain why a weird-looking or lopsided map is not, by itself, evidence of gerrymandering
concepts:
  - gerrymandering
  - redistricting
sources:
  - type: paper
    citation: 'Stephanopoulos, N. & McGhee, E. (2015), "Partisan Gerrymandering and the Efficiency Gap," U. Chi. L. Rev. 82: 831.'
    url: https://chicagounbound.uchicago.edu/uclrev/vol82/iss2/4/
  - type: book
    citation: 'Cain, B. (2015), Democracy More or Less, Cambridge University Press.'
  - type: website
    citation: 'Brennan Center for Justice, "Gerrymandering Explained" (last updated 2024).'
    url: https://www.brennancenter.org/our-work/research-reports/gerrymandering-explained
  - type: website
    citation: 'Library of Congress, "Elbridge Gerry and the Monstrous Gerrymander" (In Custodia Legis, 2017) — the 1812 origin, the Tisdale cartoon, and the election result.'
    url: https://blogs.loc.gov/law/2017/02/elbridge-gerry-and-the-monstrous-gerrymander/
  - type: paper
    citation: 'Wang, S. (2016), "Three Tests for Practical Evaluation of Partisan Gerrymandering," Stanford Law Review 68: 1263.'
    url: https://www.stanfordlawreview.org/print/article/three-tests-for-practical-evaluation-of-partisan-gerrymandering/
  - type: paper
    citation: 'Chen, J. & Rodden, J. (2013), "Unintentional Gerrymandering: Political Geography and Electoral Bias in Legislatures," Quarterly Journal of Political Science 8.'
    url: https://www.nowpublishers.com/article/Details/QJPS-12033
  - type: book
    citation: 'Rodden, J. (2019), Why Cities Lose: The Deep Roots of the Urban-Rural Political Divide, Basic Books.'
  - type: website
    citation: 'Ballotpedia, "United States House of Representatives elections in North Carolina, 2016" — statewide vote share vs. seats.'
    url: https://ballotpedia.org/United_States_House_of_Representatives_elections_in_North_Carolina,_2016
perspectives:
  - name: Reform advocate
  - name: Partisan-realist defender
  - name: Federalist (states-decide) view
duration_min: 13
---

# What gerrymandering is — and what it isn't

On February 11, 1812, Governor Elbridge Gerry of Massachusetts signed a redistricting bill that, by contemporary accounts, he personally disliked. His Democratic-Republican party controlled the legislature, faced a Federalist resurgence, and had drawn the state's senate districts to survive it. One district curled around Essex County in a long, lumpy arc that ignored every town-line convention of the day. In the offices of the *Boston Gazette*, someone (legend says the painter Gilbert Stuart, though the engraver Elkanah Tisdale drew the published version) added wings, claws, and fangs to the district's outline. On March 26, 1812, the *Gazette* printed the beast over a new word: **the Gerry-mander**. That spring the monster did exactly what it was built to do. Federalists won the governorship — Gerry himself was turned out — and won more votes statewide in senate races, yet the gerrymandered senate went Democratic-Republican by 29 seats to 11. More votes, fewer seats: that inversion, not the funny shape, is the thing the word names. Gerry got a consolation prize — he died in 1814 as James Madison's vice president — and his name (hard *G*, originally) got attached, soft *G* and all, to a practice older than the label and very much alive in the 2026 midterms.

The word now gets thrown around as a synonym for "election map I dislike," which makes it useless for thinking with. So start with the mechanics.

## Two moves: packing and cracking

Gerrymandering is the **deliberate manipulation of district boundaries to produce partisan, racial, or incumbent-protection outcomes that diverge from what neutral line-drawing would produce**. Strip away the litigation and the cartography and there are only two moves:

- **Packing.** Concentrate the opposing party's voters into a few districts they win by overwhelming margins. Every vote past the winning threshold is surplus — it elects no one extra.
- **Cracking.** Split the opposing party's remaining voters across many districts where they fall just short everywhere. Every vote in a losing cause elects no one at all.

Both moves work by **wasting** the other side's votes — piling them up above the threshold (packing) or stranding them below it (cracking) — while spreading your own voters with maximal efficiency: comfortable wins, no blowouts, no losses. The figure below is the whole logic in one electorate. Fifty voters, 30 Blue (60%) and 20 Red (40%), districted two different ways into five districts of ten. Same voters, same houses, same opinions — opposite delegations.

<figure class="lesson-figure" style="margin:2rem 0;">
<svg viewBox="0 0 720 300" width="100%" role="img" aria-label="Two five-district maps of the same 50 voters, 30 Blue and 20 Red. In the cracked map, vertical districts each contain six Blue and four Red voters and Blue wins all five districts. In the packed map, Blue voters are packed into two districts they win ten to zero, and Red wins the remaining three districts." style="max-width:680px;height:auto;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <text x="20" y="22" font-family="Georgia, serif" font-size="15" font-weight="bold" fill="var(--ink, #14130f)">One electorate, two maps: 30 Blue voters (60%), 20 Red voters (40%)</text>
  <text x="20" y="52" font-family="Georgia, serif" font-size="13.5" font-weight="bold" fill="var(--ink, #14130f)">Map 1 — crack Red</text>
  <g>
    <rect x="20" y="62" width="300" height="90" fill="var(--blue, #2f4d6e)" />
    <rect x="20" y="152" width="300" height="60" fill="var(--accent, #8a2a1e)" />
    <path d="M50,62 V212 M80,62 V212 M110,62 V212 M140,62 V212 M170,62 V212 M200,62 V212 M230,62 V212 M260,62 V212 M290,62 V212 M20,92 H320 M20,122 H320 M20,182 H320" stroke="var(--card, #ffffff)" stroke-width="1" opacity="0.55" fill="none" />
    <path d="M80,62 V212 M140,62 V212 M200,62 V212 M260,62 V212" stroke="var(--ink, #14130f)" stroke-width="3.5" fill="none" />
    <rect x="20" y="62" width="300" height="150" fill="none" stroke="var(--ink, #14130f)" stroke-width="3.5" />
  </g>
  <text x="20" y="236" font-family="Georgia, serif" font-size="13" fill="var(--ink, #14130f)">Five vertical districts, each 6 Blue–4 Red.</text>
  <text x="20" y="256" font-family="Georgia, serif" font-size="14" font-weight="bold" fill="var(--blue, #2f4d6e)">Blue wins 5–0.</text>
  <text x="20" y="276" font-family="Georgia, serif" font-size="12.5" fill="var(--muted, #6b6457)">All 20 Red votes are wasted in losses.</text>
  <text x="400" y="52" font-family="Georgia, serif" font-size="13.5" font-weight="bold" fill="var(--ink, #14130f)">Map 2 — pack Blue</text>
  <g>
    <rect x="400" y="62" width="300" height="90" fill="var(--blue, #2f4d6e)" />
    <rect x="400" y="152" width="300" height="60" fill="var(--accent, #8a2a1e)" />
    <path d="M430,62 V212 M460,62 V212 M490,62 V212 M520,62 V212 M550,62 V212 M580,62 V212 M610,62 V212 M640,62 V212 M670,62 V212 M400,92 H700 M400,122 H700 M400,182 H700" stroke="var(--card, #ffffff)" stroke-width="1" opacity="0.55" fill="none" />
    <path d="M550,62 V122 M400,122 H700 M490,122 V182 M490,182 H520 M520,182 V212 M580,122 V182 M580,182 H640 M640,182 V212" stroke="var(--ink, #14130f)" stroke-width="3.5" fill="none" />
    <rect x="400" y="62" width="300" height="150" fill="none" stroke="var(--ink, #14130f)" stroke-width="3.5" />
  </g>
  <text x="400" y="236" font-family="Georgia, serif" font-size="13" fill="var(--ink, #14130f)">Two districts packed 10–0 Blue; three lean Red.</text>
  <text x="400" y="256" font-family="Georgia, serif" font-size="14" font-weight="bold" fill="var(--accent, #8a2a1e)">Red wins 3–2 — with 40% of the votes.</text>
  <text x="400" y="276" font-family="Georgia, serif" font-size="12.5" fill="var(--muted, #6b6457)">Blue's surplus votes are wasted in two blowouts.</text>
</svg>
<figcaption style="font-size:0.9em;color:var(--muted,#6b6457);margin-top:0.5rem;">Figure: The canonical demonstration. In Map 1 the line-drawer cracks Red across all five districts (6–4 losses everywhere). In Map 2 the line-drawer packs Blue into two 10–0 districts and wins the other three. A 60–40 electorate can produce a 5–0 delegation for the majority or a 3–2 delegation for the minority, depending entirely on where the lines fall.</figcaption>
</figure>

Notice what the figure does *not* require: ugly shapes. Map 2's districts are reasonably tidy rectangles and notched blocks. A gerrymander is defined by what it does to votes, not by how it offends the eye — which is why modern gerrymanders, drawn with precinct-level data and optimization software, can look perfectly innocent while being more durable than anything Elbridge Gerry's allies could draw by hand. [[term:redistricting]] happens on a clock — every state redraws after each decennial census — and the party holding the pen when the clock strikes can bank the advantage for a decade.

<details class="checkpoint">
<summary><strong>Checkpoint:</strong> Your party expects 45% of the statewide vote. As the line-drawer, which move do you apply to the majority party — packing or cracking — and why can't you crack them?</summary>
<p>You <strong>pack</strong> them. Cracking only works against a side you can hold <em>under</em> 50% in many districts at once — impossible when the other side has the statewide majority, since spreading their voters evenly hands them every seat (that's Map 1, run against you). Instead you concentrate their surplus into a few overwhelming wins and assemble narrow majorities for yourself everywhere else — exactly Map 2.</p>
</details>

## Measuring the waste: the efficiency gap

For decades the standard objection to policing gerrymanders was that "fairness" couldn't be measured. The modern political-science answer is that wasted votes can be counted. In a 2015 *University of Chicago Law Review* article, law professor Nicholas Stephanopoulos and political scientist Eric McGhee defined the **efficiency gap**: the difference between the two parties' wasted votes (surplus votes in wins, plus all votes in losses), divided by all votes cast. Here is the arithmetic on a five-district state, 100 voters per district:

| District | Party A votes | Party B votes | Winner | A's wasted votes | B's wasted votes |
| --- | --- | --- | --- | --- | --- |
| 1 | 80 | 20 | A | 30 (surplus) | 20 (losing) |
| 2 | 80 | 20 | A | 30 (surplus) | 20 (losing) |
| 3 | 35 | 65 | B | 35 (losing) | 15 (surplus) |
| 4 | 35 | 65 | B | 35 (losing) | 15 (surplus) |
| 5 | 35 | 65 | B | 35 (losing) | 15 (surplus) |
| **Total** | **265 (53%)** | **235 (47%)** | **B wins 3–2** | **165** | **85** |

Party A wins a 53% majority of votes and a minority of seats. The efficiency gap is (165 − 85) ÷ 500 = **16% in Party B's favor** — B turned votes into seats far more efficiently, because the map was built to waste A's. Stephanopoulos and McGhee proposed treating a plan as presumptively suspect when the gap exceeds **8% in a state legislature, or two seats in a congressional delegation**, sustained across elections. Their measure anchored the *Whitford* challenge to Wisconsin's 2011 assembly map and is now a standard exhibit in redistricting litigation and journalism alike.

The efficiency gap is not the only ruler. Princeton neuroscientist-turned-elections-analyst Samuel Wang proposed three statistical tests (*Stanford Law Review*, 2016) that detect gerrymanders from election results alone — including the telltale signature of a packed map: the gerrymandering party wins its districts by suspiciously uniform, modest margins while the victim party wins its few districts by landslides. Political scientists Bernard Grofman and Gary King's "partisan symmetry" standard asks a hypothetical: if the parties' vote shares were swapped, would the seat shares swap too? A symmetric map can favor a party in fact; an asymmetric one favors it by construction. No single metric is dispositive — and the Supreme Court ultimately found none judicially manageable, as Lesson 3 recounts — but the empirical claim that gerrymanders are detectable and measurable is no longer seriously contested.

<details class="checkpoint">
<summary><strong>Checkpoint:</strong> In the table above, suppose District 1 had gone 55–45 for Party A instead of 80–20 (with those 25 voters moving to District 3, making it 60–40 for A). Would the efficiency gap shrink or grow — and what does that tell you about what the gap is really measuring?</summary>
<p>It would <strong>shrink dramatically</strong> — A now wastes only 5 surplus votes in District 1 instead of 30, and District 3 flips from 35 wasted losing votes to a win wasting 10. The gap measures <em>how unequally the map wastes the two sides' votes</em>, so un-packing Party A and letting it win a previously cracked district moves the map toward zero. The metric rewards maps where both parties' wins are similarly efficient — not maps that look pretty.</p>
</details>

## What gerrymandering isn't

Three things are routinely called gerrymandering and aren't — and each confusion has a body of scholarship attached.

**1. Districts that look weird because geography is weird.** A district that hugs a coastline, follows a river valley, or snakes along a mountain ridge is non-compact for reasons that have nothing to do with vote-wasting. Compactness is a useful screening signal, nothing more. The converse matters more: as the figure above shows, a tidy-looking map can be a ruthless gerrymander. Shape is neither necessary nor sufficient.

**2. Lopsided outcomes that political geography produces on its own.** In a 2013 *Quarterly Journal of Political Science* paper, Jowei Chen and Jonathan Rodden ran thousands of computer-simulated, intent-free districting plans for Florida and found that most of them favored Republicans anyway — because Democrats cluster so densely in cities that they pack *themselves*. Rodden's book *Why Cities Lose* (2019) generalizes the point: under winner-take-all districts, a party whose voters are geographically concentrated wins its turf by 80% and loses everywhere else by 8%. This "unintentional gerrymander" means a bare seats-votes mismatch is not proof of foul play; the analytical gold standard is now to compare an enacted map against an ensemble of simulated neutral maps and ask whether it's an outlier. Many challenged maps are outliers — beyond even the most partisan of the simulated alternatives — which is the rebuttal to treating geography as a universal alibi.

**3. Districts drawn to comply with the Voting Rights Act.** Section 2 of the VRA has long required states, under conditions the Supreme Court set out in *Thornburg v. Gingles* (1986), to draw districts where geographically compact, politically cohesive minority communities can elect candidates of their choice. A district drawn to satisfy that mandate is a statutory remedy for vote dilution, not a partisan weapon — though the same map can be both, and the line between "majority-minority district the VRA requires" and "racial sort the [[term:equal-protection]] Clause forbids" has been litigated for thirty years. The Supreme Court redrew that line again in 2026, in *Louisiana v. Callais* — Lesson 3 takes it up in full.

## Three variants worth keeping separate

**Partisan gerrymandering** advantages a party. It is the 1812 original and the headline modern cases. North Carolina's 2016 congressional map produced a 10–3 Republican delegation on about 53% of the statewide vote, and its author, Representative David Lewis, said the quiet part into a microphone: "I propose that we draw the maps to give a partisan advantage to 10 Republicans and three Democrats, because I do not believe it's possible to draw a map with 11 Republicans and two Democrats." Maryland Democrats did the mirror image in 2011, redrawing the 6th District to unseat a 20-year Republican incumbent — former governor Martin O'Malley later testified that flipping the seat "was certainly my hope, and it was part of my intent."

**Racial gerrymandering** dilutes (or, in the *Shaw v. Reno* line of cases, excessively sorts by) race. It is governed by the 14th and 15th Amendments and the VRA rather than by politics doctrine, and it remains justiciable in federal court — though on terms the Court narrowed sharply in 2026. Because Black and Latino voters vote heavily Democratic in most covered states, nearly every racial case has a partisan shadow, and *disentangling race from party* has become the central evidentiary fight.

**Incumbent-protection (bipartisan) gerrymandering** packs *both* parties' voters into safe seats so that sitting legislators of each party stop facing competitive elections. The Supreme Court blessed a Connecticut "political fairness" plan of exactly this kind in *Gaffney v. Cummings* (1973). It is rarely litigated, arguably the most common variant, and corrosive in a different way: instead of skewing *which party* wins, it removes the voters' practical ability to fire anyone, shifting real competition to low-turnout party primaries and rewarding [[term:incumbency]] as such.

The same map can do all three at once — which is precisely why the legal doctrine, which treats them under different constitutional theories, feels so misaligned with the practice.

<details class="checkpoint">
<summary><strong>Checkpoint:</strong> A state's map gives the majority party 70% of seats on 55% of votes. Its districts are compact and follow county lines. A simulation ensemble of 50,000 neutral maps shows the enacted plan awards the majority party more seats than 49,900 of them. Gerrymander or geography?</summary>
<p>Almost certainly a <strong>gerrymander</strong> — and the compact shapes are irrelevant. The ensemble comparison is the test built to answer exactly this question: political geography (the Chen–Rodden effect) is already baked into the 50,000 neutral maps, so landing in the top 0.2% of pro-majority outcomes means the lines themselves, not the geography, are doing the work. Lopsidedness alone proves nothing; being an extreme <em>outlier against neutral alternatives</em> is the modern smoking gun.</p>
</details>

## What this lesson is not

It is not yet an argument about what, if anything, should be *done*. You now have the mechanics — packing, cracking, wasted votes, the efficiency gap, the geography confound, the three variants. What remains genuinely contested is everything downstream: whether the practice is a democratic emergency or politics-as-usual, who should hold the pen, and whether any institution can be trusted to police it. Lesson 2 steel-mans the three live positions — reform advocates, partisan realists, and federalists — and Lesson 3 follows the courts from *Baker v. Carr* (1962) through *Rucho* (2019) to the 2026 *Callais* decision and the mid-decade redistricting war that is reshaping the 2026 midterms as you read this.
