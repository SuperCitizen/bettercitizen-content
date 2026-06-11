---
schema: bettercitizen.lesson/v1
slug: how-it-flows
kind: reading
title: How dark money actually flows
objectives:
  - Define dark money in mechanical terms (501(c)(4)/(c)(6) electoral spending without public donor disclosure) and distinguish it from super PAC spending
  - Trace the "donor → 501(c)(4) → super PAC → political ad" pipeline and explain where disclosure dies at each hop
  - Distinguish 501(c)(4)s from 501(c)(3)s, 501(c)(6)s, and 527s on tax treatment, campaign activity, and disclosure
  - Explain the IRS "primarily engaged" test and why it has never been defined by regulation
  - State the verified empirical record on dark-money spending by cycle, including the methodology caveats
concepts:
  - dark-money
  - 501c4
  - donor-disclosure
  - electoral-activity
  - super-pac
  - campaign-finance
sources:
  - type: statute
    citation: 'Internal Revenue Code §501(c)(4) — social welfare organizations.'
    url: https://www.law.cornell.edu/uscode/text/26/501
  - type: website
    citation: 'IRS, "Social Welfare Organizations" — primary regulatory guidance.'
    url: https://www.irs.gov/charities-non-profits/other-non-profits/social-welfare-organizations
  - type: website
    citation: 'OpenSecrets, "Dark Money Basics" — overview + data tracking.'
    url: https://www.opensecrets.org/dark-money/basics
  - type: website
    citation: 'Brennan Center for Justice, "Citizens United Explained" — background analysis.'
    url: https://www.brennancenter.org/our-work/research-reports/citizens-united-explained
  - type: court-opinion
    citation: 'Citizens United v. FEC, 558 U.S. 310 (2010) — disclosure portion upheld 8-1.'
    url: https://www.supremecourt.gov/opinions/09pdf/08-205.pdf
  - type: court-opinion
    citation: 'Americans for Prosperity Foundation v. Bonta, 594 U.S. 595 (2021).'
    url: https://www.supremecourt.gov/opinions/20pdf/19-251_p86b.pdf
  - type: website
    citation: 'Massoglia, A. (2025), "Dark Money Hit a Record High of $1.9 Billion in 2024 Federal Races," Brennan Center for Justice (May 7, 2025).'
    url: https://www.brennancenter.org/our-work/research-reports/dark-money-hit-record-high-19-billion-2024-federal-races
  - type: website
    citation: 'U.S. Department of Justice, S.D. Ohio, "Former Ohio House Speaker sentenced to 20 years in prison for leading racketeering conspiracy involving $60 million in bribes" (2023).'
    url: https://www.justice.gov/usao-sdoh/pr/former-ohio-house-speaker-sentenced-20-years-prison-leading-racketeering-conspiracy
  - type: website
    citation: 'IRS, REG-134417-13, "Guidance for Tax-Exempt Social Welfare Organizations on Candidate-Related Political Activities," 78 Fed. Reg. 71535 (Nov. 29, 2013) — the never-finalized rulemaking.'
    url: https://www.federalregister.gov/documents/2013/11/29/2013-28492/guidance-for-tax-exempt-social-welfare-organizations-on-candidate-related-political-activities
  - type: website
    citation: 'IRS, "Political Organization Filing and Disclosure" — Form 8872 donor disclosure for §527 organizations under P.L. 106-230 (2000).'
    url: https://www.irs.gov/charities-non-profits/political-organizations/political-organization-filing-and-disclosure
  - type: website
    citation: 'Alliance for Justice, "Does your 501(c)(4) have to disclose its donors on Schedule B of its 990? Not anymore…" — on T.D. 9898 (2020).'
    url: https://afj.org/article/does-your-501c4-have-to-disclose-its-donors-on-schedule-b-of-its-990-not-anymore/
  - type: crs-report
    citation: 'Congressional Research Service, IF11005, "Campaign Finance Law: Disclosure and Disclaimer Requirements for Political Campaign Advertising" (2018) — includes CREW v. FEC and the independent-expenditure donor-disclosure rules.'
    url: https://www.congress.gov/crs_external_products/IF/PDF/IF11005/IF11005.2.pdf
  - type: court-opinion
    citation: 'Van Hollen v. FEC, 811 F.3d 486 (D.C. Cir. 2016) — upheld the "purpose" limit on electioneering-communication donor disclosure.'
    url: https://www.fec.gov/legal-resources/court-cases/van-hollen-v-fec/
  - type: paper
    citation: 'Oklobdzija, S. (2024), "Dark Parties: Unveiling Nonparty Communities in American Political Campaigns," American Political Science Review 118(1): 401–422.'
    url: https://www.cambridge.org/core/journals/american-political-science-review/article/dark-parties-unveiling-nonparty-communities-in-american-political-campaigns/9576CD955EE490DD6555439FC1E34E71
  - type: website
    citation: 'Campaign Legal Center, "Prodded by Campaign Legal Center Complaint, Mystery Million Dollar Donor to Romney-Supporting Super PAC Comes Forward" (2011) — the W Spann LLC episode.'
    url: https://campaignlegal.org/press-releases/prodded-campaign-legal-center-complaint-filed-fec-and-doj-mystery-million-dollar
perspectives:
  - name: Disclosure-first reformer
  - name: Donor-privacy advocate
  - name: Structural-reform centrist
duration_min: 14
---

# How dark money actually flows

Between March 2017 and March 2020, the Ohio utility FirstEnergy and its affiliates routed roughly $60 million to a nonprofit called Generation Now. The nonprofit spent it electing allies of House Speaker Larry Householder, defending them, and then crushing a ballot referendum — all in service of House Bill 6, a $1.3 billion ratepayer-funded bailout of two nuclear plants. Ohio voters saw the ads. What they could not see, anywhere, was who paid for them, because Generation Now was organized under section 501(c)(4) of the tax code and owed the public no donor list. Federal prosecutors called it likely the largest bribery scheme in Ohio history; Householder was sentenced in 2023 to 20 years for racketeering. Here is the detail to sit with: the *bribery* was the crime. The *secrecy* was not. Every dollar of anonymity in that scheme used legal architecture available to anyone — and that architecture is this lesson's subject.

## The term is narrower than the outrage

"[[term:dark-money]]" gets thrown at everything from corporate PACs to lobbying, so start with definition discipline. In [[term:campaign-finance]] scholarship the term means something specific: **spending intended to influence elections whose original source is concealed from the public**. The classic vehicles are 501(c)(4) "social welfare" organizations and 501(c)(6) trade associations — tax-exempt entities that may engage in electoral activity (within limits we'll get to) and are not required to disclose their donors.

Three near-misses to keep separate:

- **Dark money is not just "outside money."** A [[term:super-pac]] is outside money, but it is *not* dark by default: super PACs must itemize their contributors to the Federal Election Commission. When *SpeechNow.org v. FEC* (D.C. Cir. 2010, en banc) struck the contribution caps for independent-expenditure groups, the same court explicitly *upheld* the reporting requirements. The PACs & Super PACs pack covers that ecosystem; here you only need the disclosure baseline.
- **Dark money is not just "big money."** A $5 donation to a (c)(4) is dark; a $50 million super PAC check from a named billionaire is not.
- **The line blurs in one direction.** When a nondisclosing nonprofit or an opaque shell LLC *gives to* a super PAC, the super PAC discloses a name — but the name is a dead end. Researchers call this **gray money**, and it is now the dominant pattern, as we'll see below.

> **Common misconception:** "Citizens United created dark money." Not quite. *Citizens United* (2010) freed corporations — including nonprofit corporations — to spend treasury funds on express electoral advocacy, which made the (c)(4) form newly useful for election work. But the disclosure gap itself comes from the tax code and from FEC regulations written decades earlier. The Court's majority actually *endorsed* disclosure 8–1, with only Justice Thomas dissenting on that portion: "this transparency enables the electorate to make informed decisions and give proper weight to different speakers and messages" (558 U.S. at 371). The gap between that premise and the regulatory reality is the central irony of the post-2010 system.

## A field guide to the 501(c) universe

The tax code, not election law, defines the players. Four entity types do most of the work, and their differences are the whole game:

| Entity | Tax treatment of donations | Candidate electioneering allowed? | Donors disclosed to the public? |
| --- | --- | --- | --- |
| 501(c)(3) charity | Deductible | No — absolute ban (Johnson Amendment, 1954) | No (amounts reported to IRS, names withheld from public) |
| 501(c)(4) social welfare org | Not deductible | Yes, if not its "primary" activity | **No** |
| 501(c)(6) trade association | Not deductible (business expense rules apply) | Yes, if not its "primary" activity | **No** |
| 527 political organization | Not deductible | Yes — it's the entity's purpose | **Yes** (FEC reports, or IRS Form 8872) |

Read the table from the bottom up. Section 527 organizations — the category that includes parties, PACs, and the infamous freestanding groups of the early 2000s — must disclose. Congress imposed that in 2000 (P.L. 106-230) after a wave of anonymous 527 "issue ad" spending: a 527 that doesn't report to the FEC must register with the IRS within 24 hours of formation and file Form 8872 naming its contributors, on pain of confiscatory penalties. That law worked. It also taught political operatives a durable lesson: *the disclosure obligation follows the tax classification.* Reclassify the same activity as "social welfare," and the obligation evaporates.

Which brings us to the 501(c)(4). The statute says these organizations must operate "exclusively for the promotion of social welfare." A 1959 Treasury regulation softened "exclusively" to "primarily engaged" — and in the half-century since, neither Congress nor the IRS has ever defined "primarily." Practitioners operate on a folk rule that electoral activity under 50 percent of spending (the "51/49" rule) keeps the exemption safe, but that number appears in no statute and no regulation. The IRS has at times suggested thresholds and at times argued in litigation that "primary" means something far stricter. The vagueness is not an oversight that nobody noticed; it is a vacuum that proved impossible to fill. In November 2013, the IRS proposed a rule (REG-134417-13) defining "candidate-related political activity" for (c)(4)s. It drew more than 150,000 public comments — a record for an IRS rulemaking — from reformers who thought it too weak and conservative groups who, fresh off the 2013 IRS targeting controversy, saw it as a censorship tool. The agency retreated in May 2014, and since fiscal year 2016 Congress has attached appropriations riders forbidding the IRS from finalizing any such rule. The folk rule governs because nothing else does.

Two more pieces complete the disclosure picture. First, the Johnson Amendment (1954) bars 501(c)(3) charities — including churches — from intervening in candidate campaigns at all, which is why the (c)(4), not the charity, is the electoral vehicle of choice. Second, since 2020 the anonymity runs even deeper than most explainers say: under Treasury regulations finalized that May (T.D. 9898), 501(c)(4)s and (c)(6)s no longer report donor *names* even to the IRS on Schedule B — only amounts. Before 2020, at least one government agency knew who the donors were. Now, in the ordinary course, none does.

<details class="checkpoint">
<summary><strong>Checkpoint:</strong> A donor network wants to spend $40 million influencing Senate races without any public donor trail. Why does it organize the spending vehicle as a 501(c)(4) rather than a 527 — and what constraint does that choice impose?</summary>
<p>A 527 must publicly disclose its contributors (to the FEC, or to the IRS on Form 8872 under the 2000 law), so it cannot deliver anonymity. The 501(c)(4) owes the public no donor list — but in exchange, electoral work cannot be the organization's <em>primary</em> activity, under the folk rule meaning it must keep reported political spending under roughly half its budget and document enough "social welfare" activity to cover the rest. The disclosure obligation follows the tax classification, and so does the constraint.</p>
</details>

## The pass-through pipeline

Now assemble the machine. The canonical dark-money structure is a relay in which each hop is individually legal and individually reported — and the *original source* disappears at the first handoff.

<figure class="lesson-figure" style="margin:2rem 0;">
<svg viewBox="0 0 720 400" width="100%" role="img" aria-label="Flow diagram of the dark-money pipeline: an anonymous donor gives to a 501(c)(4), which gives to a super PAC, which buys political ads. Disclosure dies at the first hop; the super PAC's FEC report names only the 501(c)(4). A shell LLC offers a parallel route." style="max-width:680px;height:auto;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <text x="20" y="26" font-family="Georgia, serif" font-size="15" font-weight="bold" fill="var(--ink, #14130f)">Where disclosure dies: the pass-through pipeline</text>
  <!-- Donor box -->
  <rect x="20" y="48" width="200" height="64" rx="6" fill="var(--card, #ffffff)" stroke="var(--ink, #14130f)" stroke-width="1.5"/>
  <text x="120" y="74" font-family="Georgia, serif" font-size="14" font-weight="bold" fill="var(--ink, #14130f)" text-anchor="middle">Original donor</text>
  <text x="120" y="94" font-family="Georgia, serif" font-size="12" fill="var(--muted, #6b6457)" text-anchor="middle">individual, corporation, union</text>
  <!-- c4 box -->
  <rect x="20" y="160" width="200" height="64" rx="6" fill="var(--accent, #8a2a1e)"/>
  <text x="120" y="186" font-family="Georgia, serif" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">501(c)(4) nonprofit</text>
  <text x="120" y="206" font-family="Georgia, serif" font-size="12" fill="#ffffff" text-anchor="middle">no public donor list</text>
  <!-- super PAC box -->
  <rect x="20" y="272" width="200" height="64" rx="6" fill="var(--blue, #2f4d6e)"/>
  <text x="120" y="298" font-family="Georgia, serif" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">Super PAC</text>
  <text x="120" y="318" font-family="Georgia, serif" font-size="12" fill="#ffffff" text-anchor="middle">discloses contributors to FEC</text>
  <!-- arrows down -->
  <line x1="120" y1="112" x2="120" y2="154" stroke="var(--ink, #14130f)" stroke-width="2"/>
  <path d="M115 148 L120 158 L125 148 Z" fill="var(--ink, #14130f)"/>
  <line x1="120" y1="224" x2="120" y2="266" stroke="var(--ink, #14130f)" stroke-width="2"/>
  <path d="M115 260 L120 270 L125 260 Z" fill="var(--ink, #14130f)"/>
  <!-- disclosure annotations right side -->
  <line x1="250" y1="48" x2="250" y2="336" stroke="var(--line, #d9d5c9)" stroke-width="1"/>
  <text x="270" y="74" font-family="Georgia, serif" font-size="13" font-weight="bold" fill="var(--green, #4a6b3a)">What the public sees at this hop</text>
  <text x="270" y="100" font-family="Georgia, serif" font-size="13" fill="var(--accent, #8a2a1e)">✕ Nothing. The (c)(4) files no public donor list;</text>
  <text x="270" y="118" font-family="Georgia, serif" font-size="13" fill="var(--accent, #8a2a1e)">since 2020 even the IRS gets amounts, not names.</text>
  <text x="270" y="196" font-family="Georgia, serif" font-size="13" fill="var(--ink, #14130f)">△ The (c)(4)'s own ads are reported as spending</text>
  <text x="270" y="214" font-family="Georgia, serif" font-size="13" fill="var(--ink, #14130f)">(if they cross FEC lines) — spender named, donors not.</text>
  <text x="270" y="298" font-family="Georgia, serif" font-size="13" fill="var(--green, #4a6b3a)">✓ The super PAC itemizes its donors — but the line</text>
  <text x="270" y="316" font-family="Georgia, serif" font-size="13" fill="var(--green, #4a6b3a)">reads "Nonprofit, Inc., $10,000,000." A dead end.</text>
  <!-- LLC bypass -->
  <rect x="470" y="160" width="230" height="64" rx="6" fill="var(--card, #ffffff)" stroke="var(--gold, #b08a3e)" stroke-width="2" stroke-dasharray="6,4"/>
  <text x="585" y="186" font-family="Georgia, serif" font-size="14" font-weight="bold" fill="var(--ink, #14130f)" text-anchor="middle">Shell LLC (variant)</text>
  <text x="585" y="206" font-family="Georgia, serif" font-size="12" fill="var(--muted, #6b6457)" text-anchor="middle">formed, donates, dissolves</text>
  <path d="M560 160 C520 110, 280 90, 226 78" stroke="var(--gold, #b08a3e)" stroke-width="1.5" fill="none" stroke-dasharray="6,4"/>
  <path d="M585 224 C575 256, 350 290, 226 300" stroke="var(--gold, #b08a3e)" stroke-width="1.5" fill="none" stroke-dasharray="6,4"/>
  <text x="20" y="382" font-family="Georgia, serif" font-size="12.5" fill="var(--muted, #6b6457)">The ad ends with: "Paid for by Americans for a Better Tomorrow." Every filing is accurate. The source is gone.</text>
</svg>
<figcaption style="font-size:0.9em;color:var(--muted,#6b6457);margin-top:0.5rem;">Figure: The pass-through pipeline. Each transfer is legal and each report is truthful, but the public-facing chain of custody ends at the 501(c)(4) — or at a shell LLC, which can route money to a super PAC directly. In 2024, contributions from nondisclosing groups to super PACs reached about $1.3 billion (Brennan Center).</figcaption>
</figure>

The shell-LLC variant deserves its own anecdote, because it produced the genre's founding scandal. In March 2011 a Delaware entity called **W Spann LLC** was formed; in April it gave $1 million to Restore Our Future, the super PAC supporting Mitt Romney; in July it dissolved — a corporate lifespan of about four months, exactly long enough to write one check. Only after watchdog complaints to the FEC and Justice Department did former Bain Capital executive Edward Conard come forward and ask the super PAC to amend its filings to name him. Conard's million became visible because he volunteered. The structure that hid it remains available, and FEC enforcement against LLC straw-donor arrangements has been sporadic.

Variants compound: money can move between multiple (c)(4)s before reaching a super PAC; a (c)(6) trade association can play the (c)(4)'s role; an LLC can sit between a donor and a nonprofit. Each added hop is another layer a journalist must subpoena-proof her way through — and journalists do not have subpoenas.

<details class="checkpoint">
<summary><strong>Checkpoint:</strong> You pull a super PAC's FEC report and find a $7 million contribution from "Heartland Prosperity Alliance," a 501(c)(4). What do you now know about the original source of the $7 million, and through what records could you learn more?</summary>
<p>You know the legal identity of the <em>intermediary</em> — nothing about the original source. The (c)(4)'s public Form 990 will show its total revenue and spending (with a lag of a year or more) but, since T.D. 9898 in 2020, not donor names — those aren't even reported to the IRS in the ordinary course. Unless a donor self-discloses, a leak or litigation pries records open, or a state law like Arizona's Proposition 211 forces tracing, the trail ends there. That dead end is what "gray money" means.</p>
</details>

## How much money is dark? Less than you've heard — and more

Quantifying concealed spending is inherently an exercise in measuring a shadow, so respect the methodology. There are two very different numbers in circulation:

| Cycle | Reported directly to the FEC by nondisclosing groups | Fuller estimate (incl. transfers to super PACs, online and TV issue ads) |
| --- | --- | --- |
| 2012 | about $309 million (the peak for this metric) | — |
| 2020 | far less than 2012 | more than $1 billion (the then-record) |
| 2022 (midterm) | under $25 million | — |
| 2024 | $43 million | about $1.9 billion |

The first column is what dark-money groups *themselves* report spending on express advocacy and electioneering communications. By that measure, dark money peaked in 2012 and nearly vanished — by 2022 it was under $25 million. The second column, assembled by the Brennan Center and OpenSecrets from FEC reports, television ad-tracking, and platform ad libraries, tells the opposite story: a record of roughly **$1.9 billion in 2024**, up from about $1 billion in 2020, with at least $4.3 billion cumulatively since *Citizens United*. The two columns diverge because the strategy changed: rather than buying ads in their own names, nondisclosing groups now mostly *transfer money to super PACs* — about $1.3 billion of the 2024 total — plus roughly $315 million in online ads and $242 million in TV issue ads that evade FEC reporting categories. The reported number fell *because* the laundering improved. And the Brennan analysis is explicit that even $1.9 billion "necessarily — and perhaps substantially — underestimates the true scale," since some categories of undisclosed spending cannot be tracked at all.

One more verified fact that should discipline anyone's partisan instincts: in 2024, dark money predominantly benefited *Democrats* — roughly $1.2 billion aligned with Democratic causes against about $664 million aligned with Republican ones, led by more than $304 million flowing into Future Forward, the main pro-Harris super PAC, from its affiliated nonprofit. Both coalitions built the machine; both run it.

The scholar's lens belongs to Stan Oklobdzija, whose study "Dark Parties" (*American Political Science Review*, 2024) assembled roughly 2.35 million IRS documents to map money moving among politically active nonprofits. His finding: dark-money networks are not random scatterings of independent groups but hub-and-spoke structures that recruit donors, launder reputations, and route funds to peripheral electioneering groups — functionally, *shadow parties* operating alongside the formal ones, but exempt from the disclosure rules that bind actual parties. Jane Mayer's *Dark Money* (2016) told the same story journalistically for the Koch network; Oklobdzija showed the pattern generalizes across the spectrum.

<details class="checkpoint">
<summary><strong>Checkpoint:</strong> Between 2012 and 2022, dark-money spending reported to the FEC fell from about $309 million to under $25 million. A friend concludes the dark-money era is ending. What's wrong with the inference?</summary>
<p>The metric measures <em>self-reported direct spending</em>, and the dominant strategy shifted to routing money through super PACs and to issue ads outside FEC reporting categories. Fuller estimates that track those flows show dark money <em>rising</em> to about $1.9 billion in 2024 — a record. The reported number fell because concealment improved, not because the activity declined. Always ask what a campaign-finance statistic actually counts.</p>
</details>

## Where disclosure law actually stands

The legal architecture has three load-bearing facts, and they point in different directions.

**First: electoral disclosure is constitutionally secure — in principle.** *Citizens United* upheld the Bipartisan Campaign Reform Act's disclaimer and disclosure provisions (§§201, 311) by 8–1, and *SpeechNow* applied organizational and reporting requirements to the new super PACs without blinking. The constitutional question for *electoral* transparency is, under current doctrine, mostly settled.

**Second: the regulations under that secure constitutional authority are full of holes — some recently patched, most not.** For *electioneering communications* (broadcast ads naming a candidate within 60 days of a general or 30 days of a primary), FEC rules require naming only donors who gave $1,000 or more "for the purpose of furthering" such ads — a purpose almost no donor ever states, which is why groups routinely report *zero* donors. The D.C. Circuit upheld that regulation in *Van Hollen v. FEC* (2016). For *independent expenditures* (express advocacy), the analogous purpose-string was struck down: in *CREW v. FEC* (D.D.C. 2018), Chief Judge Beryl Howell vacated the regulation as an impermissible narrowing of the statute, the Supreme Court declined to stay the ruling, and the D.C. Circuit affirmed in 2020. On paper, a group making independent expenditures must now name every donor above $200 who gave for the purpose of furthering *an* independent expenditure — any of them, not merely the one specific ad being reported, which was the narrowing the courts rejected. In practice, groups assert that their donations carried no such purpose at all, and reported donor lists remain thin — a gap between holding and behavior that watchdogs litigate cycle after cycle.

**Third: a countervailing doctrine is rising.** In *Americans for Prosperity Foundation v. Bonta* (2021), the Supreme Court struck down — facially, 6–3 — California's blanket demand that charities hand their major-donor lists to the state attorney general, applying "exacting scrutiny" with a narrow-tailoring requirement to compelled donor disclosure. *Bonta* concerned charity regulation, not election law, and the majority took pains not to disturb electoral-disclosure precedent. But its logic is the strongest doctrinal resource the donor-privacy side has had since 1958, and both camps know it. That collision — transparency's settled constitutional pedigree versus associational privacy's new momentum — is the entire subject of the next lesson.

> **Why this matters:** The dark-money gap is *regulatory and statutory, not constitutional*. Congress could mandate (c)(4) electoral-donor disclosure tomorrow without offending current doctrine — the DISCLOSE Act has proposed exactly that since 2010. Whether it *should*, and how *Bonta* might reshape the doctrine, is where honest people divide.

## What this lesson is not

This lesson is the plumbing, not the verdict. Knowing how the pipeline works tells you nothing, by itself, about whether the system is a scandal or a shield. Reformers look at Generation Now and see the inevitable product of structural secrecy; privacy advocates look at NAACP-era Alabama — and at modern doxxing — and see why anonymous association is constitutionally sacred; centrists think both are right about different donors. Lesson 2 steel-mans all three. What you should now own cold: the definition (concealed-source electoral spending), the vehicles ((c)(4)s and (c)(6)s, with 527s and super PACs as the disclosed contrast), the pipeline (disclosure dies at the first hop), the numbers ($1.9 billion in 2024, methodology caveats attached), and the legal map (disclosure constitutionally secure, regulatorily porous, and newly contested under *Bonta*).
