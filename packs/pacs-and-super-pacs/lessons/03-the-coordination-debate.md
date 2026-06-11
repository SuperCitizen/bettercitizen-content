---
schema: bettercitizen.lesson/v1
slug: the-coordination-debate
kind: reading
title: The coordination debate (where reform is most active)
objectives:
  - Walk the three-prong coordinated-communications test (11 CFR 109.21) and explain why all three prongs must be met
  - Identify the major lawful workarounds — redboxing, public footage, the 120-day personnel window, pre-candidacy super PAC building, candidate fundraising appearances
  - State what FEC Advisory Opinion 2024-01 (Texas Majority PAC) held and what it changed about ground campaigns
  - Explain why coordination enforcement rarely happens and what the live reform proposals are
concepts:
  - super-pac
  - pac
  - campaign-finance
sources:
  - type: website
    citation: 'FEC, "Coordinated Communications" — current rule and guidance.'
    url: https://www.fec.gov/help-candidates-and-committees/coordinated-communications-and-independent-expenditures/
  - type: paper
    citation: 'Briffault, R. (2013), "Coordination Reconsidered," Columbia Law Review Sidebar 113: 88.'
    url: https://columbialawreview.org/content/coordination-reconsidered/
  - type: statute
    citation: '11 CFR §109.21 — the coordinated-communications three-prong test (payment, content, conduct).'
    url: https://www.law.cornell.edu/cfr/text/11/109.21
  - type: statute
    citation: '11 CFR §109.23 — financing the dissemination or republication of candidate campaign materials.'
    url: https://www.law.cornell.edu/cfr/text/11/109.23
  - type: website
    citation: 'FEC, "AO 2024-01: Canvassing literature and scripts are not public communications, coordinated communications or coordinated expenditures" (Mar. 20, 2024) — the Texas Majority PAC advisory opinion.'
    url: https://www.fec.gov/updates/ao-2024-01/
  - type: website
    citation: 'Campaign Legal Center, "Voters Need to Know What Redboxing Is and How It Undermines Democracy."'
    url: https://campaignlegal.org/update/voters-need-know-what-redboxing-and-how-it-undermines-democracy
  - type: website
    citation: 'NBC News, "Inside Elon Musk''s high-stakes pro-Trump door-knocking effort" (Nov. 2024) — America PAC''s canvassing role in the 2024 ground game.'
    url: https://www.nbcnews.com/politics/2024-election/elon-musks-high-stakes-trump-door-knocking-effort-america-pac-rcna176255
  - type: website
    citation: 'TIME, "Jeb Bush Super PAC Raises $103 Million for Presidential Race" (July 2015) — the pre-candidacy Right to Rise buildout.'
    url: https://time.com/3951931/jeb-bush-super-pac-fundraising/
  - type: pdf
    citation: 'Ravel, A. (2017), "Dysfunction and Deadlock: The Enforcement Crisis at the Federal Election Commission" — deadlock statistics on substantive enforcement votes.'
    url: https://www.fec.gov/resources/about-fec/commissioners/ravel/statements/ravelreport_feb2017.pdf
  - type: crs-report
    citation: 'Congressional Research Service, R40779, "Deadlocked Votes Among Members of the Federal Election Commission (FEC): Overview and Potential Considerations for Congress."'
    url: https://www.everycrsreport.com/reports/R40779.html
  - type: statute
    citation: 'Freedom to Vote Act (S. 2747), 117th Congress — Division B coordination and FEC-enforcement provisions (proposed, not enacted).'
    url: https://www.congress.gov/bill/117th-congress/senate-bill/2747
  - type: website
    citation: 'U.S. Department of Justice, "Campaign Manager Pleads Guilty to Coordinated Campaign Contributions and False Statements" (Feb. 12, 2015) — United States v. Harber, the first criminal coordination prosecution.'
    url: https://www.justice.gov/archives/opa/pr/campaign-manager-pleads-guilty-coordinated-campaign-contributions-and-false-statements
perspectives:
  - name: PAC-defender
  - name: PAC-restrictionist
  - name: Coordination-rules reformer
duration_min: 13
---

# The coordination debate

On March 20, 2024, the Federal Election Commission answered a question from a Democratic super PAC in Texas, and quietly rewrote how presidential ground games work. Texas Majority PAC had asked whether it could pay for door-to-door canvassing — scripts, literature, organizers — *in consultation with candidates and parties*, sharing strategy that would be flagrantly illegal to share about a TV ad. The Commission's answer, Advisory Opinion 2024-01: yes. Canvassing isn't a "public communication" under the rules, so the coordination restrictions never attach. By that autumn, Donald Trump's campaign had handed much of its swing-state door-knocking to America PAC, Elon Musk's [[term:super-pac]] — an arrangement NBC News chronicled from inside as nervous Republican operatives watched a presidential ground game run by an outside group. Nothing about it was illegal. Whether that sentence describes a sensible accommodation or the final collapse of a constitutional premise is this lesson's question — because "coordination" is the single word holding up the entire post-2010 system.

## Why one word carries the whole structure

Recall Lesson 1's diagram: two doors into a race, the capped-contribution door and the uncapped-independence door, separated by a dashed wall. The wall is built from one statutory sentence. Under federal law, an expenditure made "in cooperation, consultation, or concert, with, or at the request or suggestion of" a candidate is treated as a **contribution** to that candidate. Cross the line and the legal character of the money transforms: a $40 million "independent" ad campaign becomes a $40 million in-kind contribution — roughly 11,000 times the legal limit, and flatly illegal if any corporate or union money funded it. Every uncapped dollar in American elections flows on the premise that this line is real. *Buckley* rested the expenditure/contribution distinction on it; *Citizens United* assumed it ("independent expenditures... do not give rise to corruption or the appearance of corruption"); *SpeechNow* built the super PAC on it.

So the operative question is not philosophical but administrative: *how does the FEC decide what counts?* The answer lives in one regulation, 11 CFR 109.21, and its architecture explains most of what you see in the wild.

## The three-prong machine

A communication is "coordinated" only if it satisfies **all three** prongs — payment, content, and conduct. Miss any one, and the communication is independent, whatever else was going on.

<figure class="lesson-figure" style="margin:2rem 0;">
<svg viewBox="0 0 720 460" width="100%" role="img" aria-label="Diagram of the three-prong coordination test of 11 CFR 109.21: payment by an outside spender, content that is electoral, and conduct connecting spender to campaign — all three required; safe harbors for firewalls and publicly available information drain the conduct prong" style="max-width:680px;height:auto;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <text x="20" y="26" font-family="Georgia, serif" font-size="15" font-weight="bold" fill="var(--ink, #14130f)">The coordination test (11 CFR 109.21): all three prongs, or nothing</text>
  <!-- prong 1 -->
  <rect x="20" y="50" width="216" height="120" rx="8" fill="var(--card, #ffffff)" stroke="var(--blue, #2f4d6e)" stroke-width="2"/>
  <text x="128" y="76" font-family="Georgia, serif" font-size="14" font-weight="bold" fill="var(--blue, #2f4d6e)" text-anchor="middle">1 · PAYMENT</text>
  <text x="128" y="100" font-family="Georgia, serif" font-size="12.5" fill="var(--ink, #14130f)" text-anchor="middle">Paid for by someone other</text>
  <text x="128" y="117" font-family="Georgia, serif" font-size="12.5" fill="var(--ink, #14130f)" text-anchor="middle">than the candidate or party</text>
  <text x="128" y="148" font-family="Georgia, serif" font-size="11.5" fill="var(--muted, #6b6457)" text-anchor="middle">(almost always met)</text>
  <!-- prong 2 -->
  <rect x="252" y="50" width="216" height="120" rx="8" fill="var(--card, #ffffff)" stroke="var(--accent, #8a2a1e)" stroke-width="2"/>
  <text x="360" y="76" font-family="Georgia, serif" font-size="14" font-weight="bold" fill="var(--accent, #8a2a1e)" text-anchor="middle">2 · CONTENT</text>
  <text x="360" y="98" font-family="Georgia, serif" font-size="12" fill="var(--ink, #14130f)" text-anchor="middle">Electioneering communication;</text>
  <text x="360" y="114" font-family="Georgia, serif" font-size="12" fill="var(--ink, #14130f)" text-anchor="middle">express advocacy (or equivalent);</text>
  <text x="360" y="130" font-family="Georgia, serif" font-size="12" fill="var(--ink, #14130f)" text-anchor="middle">republished campaign material;</text>
  <text x="360" y="146" font-family="Georgia, serif" font-size="12" fill="var(--ink, #14130f)" text-anchor="middle">or names a candidate ≤90/120 days out</text>
  <!-- prong 3 -->
  <rect x="484" y="50" width="216" height="120" rx="8" fill="var(--card, #ffffff)" stroke="var(--green, #4a6b3a)" stroke-width="2"/>
  <text x="592" y="76" font-family="Georgia, serif" font-size="14" font-weight="bold" fill="var(--green, #4a6b3a)" text-anchor="middle">3 · CONDUCT</text>
  <text x="592" y="98" font-family="Georgia, serif" font-size="12" fill="var(--ink, #14130f)" text-anchor="middle">Request or suggestion;</text>
  <text x="592" y="114" font-family="Georgia, serif" font-size="12" fill="var(--ink, #14130f)" text-anchor="middle">material involvement;</text>
  <text x="592" y="130" font-family="Georgia, serif" font-size="12" fill="var(--ink, #14130f)" text-anchor="middle">substantial discussion;</text>
  <text x="592" y="146" font-family="Georgia, serif" font-size="12" fill="var(--ink, #14130f)" text-anchor="middle">common vendor / ex-staffer (120 days)</text>
  <!-- AND gates -->
  <text x="244" y="115" font-family="Georgia, serif" font-size="16" font-weight="bold" fill="var(--ink, #14130f)" text-anchor="middle">+</text>
  <text x="476" y="115" font-family="Georgia, serif" font-size="16" font-weight="bold" fill="var(--ink, #14130f)" text-anchor="middle">+</text>
  <!-- arrows to verdict -->
  <line x1="360" y1="170" x2="360" y2="212" stroke="var(--ink, #14130f)" stroke-width="2"/>
  <path d="M355 206 L360 216 L365 206 Z" fill="var(--ink, #14130f)"/>
  <rect x="200" y="216" width="320" height="56" rx="8" fill="var(--gold, #b08a3e)"/>
  <text x="360" y="240" font-family="Georgia, serif" font-size="13.5" font-weight="bold" fill="#ffffff" text-anchor="middle">All three met = COORDINATED</text>
  <text x="360" y="259" font-family="Georgia, serif" font-size="12" fill="#ffffff" text-anchor="middle">the spending is an in-kind contribution: capped, maybe illegal</text>
  <!-- escape hatches -->
  <text x="20" y="306" font-family="Georgia, serif" font-size="13.5" font-weight="bold" fill="var(--ink, #14130f)">The escape hatches (why prong 3 almost never closes):</text>
  <rect x="20" y="320" width="330" height="64" rx="6" fill="var(--card, #ffffff)" stroke="var(--line, #d9d5c9)" stroke-width="1.5"/>
  <text x="34" y="342" font-family="Georgia, serif" font-size="12.5" font-weight="bold" fill="var(--ink, #14130f)">Publicly available information</text>
  <text x="34" y="360" font-family="Georgia, serif" font-size="12" fill="var(--muted, #6b6457)">strategy posted on a campaign website is fair</text>
  <text x="34" y="376" font-family="Georgia, serif" font-size="12" fill="var(--muted, #6b6457)">game for anyone — the redboxing door</text>
  <rect x="370" y="320" width="330" height="64" rx="6" fill="var(--card, #ffffff)" stroke="var(--line, #d9d5c9)" stroke-width="1.5"/>
  <text x="384" y="342" font-family="Georgia, serif" font-size="12.5" font-weight="bold" fill="var(--ink, #14130f)">Firewall safe harbor</text>
  <text x="384" y="360" font-family="Georgia, serif" font-size="12" fill="var(--muted, #6b6457)">a shared vendor with a written information-</text>
  <text x="384" y="376" font-family="Georgia, serif" font-size="12" fill="var(--muted, #6b6457)">wall policy defeats the conduct prong</text>
  <text x="20" y="420" font-family="Georgia, serif" font-size="12" fill="var(--muted, #6b6457)">And if the activity is not a "public communication" at all — door-to-door canvassing, per AO 2024-01 —</text>
  <text x="20" y="438" font-family="Georgia, serif" font-size="12" fill="var(--muted, #6b6457)">the content prong can never be met, and candidates may share strategy directly.</text>
</svg>
<figcaption style="font-size:0.9em;color:var(--muted,#6b6457);margin-top:0.5rem;">Figure: The three-prong test is a logical AND. Reformers' complaint is not that any prong is crazy, but that the conjunction — each prong independently narrow, with safe harbors draining the conduct prong — makes the wall easy to walk around rather than through.</figcaption>
</figure>

Walk the prongs with the regulation in hand. **Payment** is trivial — someone other than the campaign paid. **Content** asks whether the communication is electoral enough to matter: an electioneering communication; express advocacy or its functional equivalent; republished campaign material; or any public communication that merely *names* a candidate within 90 days of a House or Senate election (120 days for presidential races, primary through general). **Conduct** is where the action is. The rule lists the ways a spender and campaign can be connected: the campaign requested or suggested the ad; was materially involved in decisions about its content, audience, timing, or placement; held substantial discussions conveying campaign plans; or the spender used a **common vendor** or hired a **former campaign employee** who used material campaign knowledge — both within a 120-day window. Then come the exits: information the campaign made *publicly available* doesn't count, and a shared vendor with a written **firewall** policy defeats the prong unless evidence shows information actually crossed it.

A separate rule, 11 CFR 109.23, handles **republication**: paying to disseminate a campaign's own materials is an in-kind contribution from the spender, full stop. But note the asymmetry the FEC built in — the *candidate* generally isn't charged with receiving anything unless the conduct standards are also met. That asymmetry created one of the most visible workarounds in modern politics, which brings us to the field guide.

<details class="checkpoint">
<summary><strong>Checkpoint:</strong> A super PAC hires the same media firm a Senate campaign used six months ago, and runs an ad praising the senator 60 days before the general election, scripted entirely from the campaign's public speeches. Which prongs are met?</summary>
<p>Payment: met. Content: met — a public communication naming a candidate within 90 days. Conduct: <em>not</em> met. The common-vendor standard reaches back only 120 days, and six months is outside the window; the script came from publicly available material, which the conduct standards expressly excuse. Two prongs out of three means the ad is legally independent. Now change the vendor gap to 90 days with no firewall and have the firm reuse the campaign's private targeting data — all three prongs close, and the ad becomes an in-kind contribution.</p>
</details>

## The workarounds, catalogued

What follows is not a list of scandals. Every item is lawful under the rules just described — that is precisely the reformer's point, and the defender's rejoinder is that each reflects a deliberate, speech-protective choice.

**Redboxing.** Campaigns post, on public websites, text blocks (often literally outlined in red) addressed to no one in particular: *voters need to know* that the opponent did X; *the message that works* with suburban women is Y; the ideal channel is digital video in these counties. Super PACs read the public page and execute. Because the information is publicly available, the conduct prong never closes. Campaign Legal Center documented the practice across more than 200 federal candidates' websites in the 2022 cycle, and an *Election Law Journal* study titled "Coordination in Plain Sight" found it widespread and bipartisan. Campaigns also post broadcast-quality footage of the candidate — gauzy b-roll, family scenes — that outside groups download and cut into "independent" ads, stepping around the republication rule's bite on the candidate side.

**The personnel pipeline.** The cooling-off window is 120 days. A campaign manager can leave in March and run the supporting super PAC by August, carrying relationships and judgment (the rule polices conveyed *information*, not accumulated wisdom). The single-candidate super PAC staffed by the candidate's former aides — a structure *Buckley*'s authors never imagined — is now the default architecture of presidential politics.

**The pre-candidacy buildout.** Coordination rules restrict coordination with *candidates*. Jeb Bush spent the first half of 2015 personally headlining fundraisers for Right to Rise USA — which banked a then-record $103 million by June 30 — while declining to declare his candidacy until mid-June, five months after he and his aides created the group. Once he declared, the wall went up; by then the blueprint, the donor network, and the war chest were built. Declared candidates, for their part, may still appear and speak at their super PAC's fundraisers under FEC guidance, so long as they personally solicit no more than federal limits allow.

**The canvassing carve-out.** AO 2024-01 is the newest and, by scale, biggest. The Commission reasoned that canvassing scripts and literature are not "public communications" because door-to-door contact involves no paid mass-media placement — and the entire coordinated-communications rule applies only to public communications. Consequence: a candidate may sit with a super PAC and plan the ground game — turf, scripts, targets — with money no contribution limit touches. The one wall left standing: if the canvassing data flows back to the campaign for less than its usual and normal charge, that is an in-kind contribution. Campaign Legal Center has sued the FEC over the opinion; meanwhile, 2024 demonstrated the model at presidential scale, with America PAC fielding much of the Republican nominee's door operation — and operatives publicly worrying about the quality control that came with renting a ground game.

> **Common misconception:** "Super PACs and campaigns coordinate illegally all the time." Mostly backwards. The remarkable fact is how little of the visible cooperation requires breaking any rule — the rules were drafted, prong by prong and safe harbor by safe harbor, so that this cooperation is legal. The reform argument is about rewriting rules, not (mainly) about catching cheaters.

## Why enforcement almost never happens

Even when conduct arguably crosses the line, the enforcement machine stalls. The FEC's structure — six commissioners, no more than three per party, four votes required for action — produces 3–3 deadlocks on politically sensitive matters; deadlocks function as dismissals; and dismissed complaints rarely see the inside of a courtroom. (Commissioner Ann Ravel's 2017 report put deadlocks on substantive enforcement votes near 30 percent by 2016, up from about 3 percent a decade earlier — the Dark Money pack's third lesson dissects that institutional story.) Criminal coordination prosecutions exist but require proving *knowing and willful* violations — the first one in American history concluded only in 2015, when operative Tyler Harber pleaded guilty to directing $325,000 in coordinated super PAC spending for a 2012 congressional campaign he simultaneously managed, drawing 24 months in prison. Such cases remain rare. The practical result: the coordination wall is patrolled by an agency built to deadlock, backed by a criminal standard built for the flagrant.

The live reform proposals map directly onto the holes: lengthen the 120-day windows to a year or more; treat super PACs founded or staffed by a candidate's recent aides, or funded predominantly to support one candidate, as presumptively coordinated; close the publicly-available-information door for material a campaign itself posts (the proposed Stop Illegal Campaign Coordination Act targets redboxing by name); move enforcement toward courts or an odd-numbered commission (provisions along these lines appeared in the Freedom to Vote Act, S. 2747, which never overcame a Senate filibuster). Each proposal trades against the defender's standing objection — every tightened standard sweeps in some genuinely independent speech, and the [[term:first-amendment]] casts its shadow over close cases.

<details class="checkpoint">
<summary><strong>Checkpoint:</strong> Reform Bill A extends the former-employee window from 120 days to 2 years. Reform Bill B makes any strategy memo a campaign posts publicly count as "conduct" if an outside group demonstrably uses it. Which prong does each bill rewrite, and which faces the harder First Amendment objection?</summary>
<p>Both rewrite the <em>conduct</em> prong — A widens a connection standard, B shrinks a safe harbor. B faces the harder objection: it penalizes outside groups for using <em>truthful, public information</em>, which sits close to the First Amendment's core and is hard to square with the principle that anyone may act on public facts. A regulates an employment relationship — courts have historically given revolving-door rules more room. That asymmetry is why most drafted bills (including the redboxing legislation CLC endorses) target the campaign's act of signaling rather than the group's act of reading.</p>
</details>

## What this lesson is not

It is not a resolution of the premise it tested. After three lessons you can now state the machine (Lesson 1), argue all three camps (Lesson 2), and walk the coordination doctrine hole by hole (this lesson). What remains genuinely open: whether *Buckley*'s independence premise can be made true by better drafting, whether it was always a legal fiction awaiting this much money, or whether its erosion is simply what robust political speech looks like. A defensible position on super PAC policy requires a view on the empirical question (is the post-2010 system producing dependence-corruption?), the remedial question (which reforms, if any, fit within current doctrine?), and an honest account of what evidence would change your mind. Declare a position with `slug: super-pac-policy`, and before you do, run the steel-man drill against whichever of Lesson 2's camps you found least convincing — the Coach will hold you to it.
