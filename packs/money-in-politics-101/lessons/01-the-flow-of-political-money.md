---
schema: bettercitizen.lesson/v1
slug: the-flow-of-political-money
kind: socratic
title: The flow of political money — who can give what to whom
objectives:
  - Distinguish a campaign committee, a party committee, a PAC, a Super PAC, and a 501(c)(4) by what each can legally accept and spend
  - Identify the federal contribution limits per individual per recipient type for the 2025–26 cycle
  - Trace where a dollar's disclosure trail goes dark, and why the same dollar behaves differently in different channels
  - Recognize that "money in politics" is not one channel but five — and that the unlimited channels are a post-2010 creation
concepts:
  - campaign-finance
  - pac
  - super-pac
  - dark-money
  - independent-expenditure
sources:
  - type: website
    url: https://www.fec.gov/help-candidates-and-committees/candidate-taking-receipts/contribution-limits/
    citation: 'Federal Election Commission, "Contribution limits" — official 2025–2026 limits table (primary source)'
  - type: website
    url: https://www.fec.gov/press/resources-journalists/political-action-committees-pacs/
    citation: 'FEC, "Political action committees (PACs)" — official taxonomy of PACs, Super PACs and hybrid PACs'
  - type: website
    url: https://www.opensecrets.org/about/
    citation: 'OpenSecrets / Center for Responsive Politics — most-cited tracker of disclosed political money'
  - type: court-opinion
    url: https://supreme.justia.com/cases/federal/us/558/310/
    citation: "Citizens United v. FEC, 558 U.S. 310 (2010)"
  - type: court-opinion
    url: https://www.fec.gov/law/litigation/speechnow_ac_opinion.pdf
    citation: "SpeechNow.org v. FEC, 599 F.3d 686 (D.C. Cir. 2010) — the case that birthed Super PACs"
  - type: website
    url: https://www.opensecrets.org/news/2024/10/total-2024-election-spending-projected-to-exceed-previous-record/
    citation: 'OpenSecrets, "Total 2024 election spending projected to exceed previous record" (Oct. 2024) — the $15.9B federal total, including $5.5B on the presidential race'
  - type: website
    url: https://www.cnn.com/2025/02/01/politics/elon-musk-2024-election-spending-millions
    citation: 'CNN, "Elon Musk spent more than $290 million on the 2024 election, year-end FEC filings show" (Feb. 1, 2025)'
  - type: website
    url: https://www.brennancenter.org/our-work/research-reports/dark-money-hit-record-high-19-billion-2024-federal-races
    citation: 'Brennan Center for Justice, "Dark Money Hit a Record High of $1.9 Billion in 2024 Federal Races" (2025), analyzing OpenSecrets data'
  - type: paper
    url: https://www.aeaweb.org/articles?id=10.1257/089533003321164976
    citation: 'Ansolabehere, S., de Figueiredo, J. M., & Snyder, J. M. (2003), "Why Is There So Little Money in U.S. Politics?" Journal of Economic Perspectives 17(1), 105–130.'
duration_min: 16
---

# The flow of political money — who can give what to whom

In the 2024 election cycle, Elon Musk put more than \$290 million into electing his preferred candidates — by year-end FEC filings, the largest disclosed political outlay by any individual in American history. Here is the strange part: the legal ceiling on what he could hand Donald Trump's own campaign committee was \$3,300 per election — \$6,600 for the primary and general combined. Both facts are true at once, and neither involved breaking any law. The distance between \$6,600 and \$290 million is the actual subject of every "money in politics" argument you have ever heard, and most of those arguments go off the rails because the people having them are not talking about the same channel.

There are five legally distinct vehicles a political dollar can flow through. Each has different caps, different disclosure rules, and a different relationship to the candidate. This lesson maps them. The next lesson covers the law that drew the lines.

## Three questions to ask about any political dollar

Before the taxonomy, fix the framework. For any dollar moving through politics, ask:

1. **Is it capped?** Some channels have hard dollar limits, indexed to inflation; some have none.
2. **Is it disclosed?** Some channels itemize every meaningful donor in a public federal database; one, by design, does not.
3. **Can it be coordinated with the candidate?** Money a candidate controls is regulated tightly; money spent *independently* of the candidate is, since 2010, unlimited.

The five channels are just the five different ways those three questions get answered.

<figure class="lesson-figure" style="margin:2rem 0;">
<svg viewBox="0 0 720 560" width="100%" role="img" aria-label="Flow diagram showing a donor's money moving through five channels — candidate committee, party committee, traditional PAC, Super PAC, and 501(c)(4) — with contribution limits and disclosure rules labeled on each arrow, and a coordination wall separating candidate-controlled money from independent spending" style="max-width:680px;height:auto;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <text x="20" y="26" font-family="Georgia, serif" font-size="16" fill="var(--ink, #14130f)" font-weight="bold">Where a political dollar can go (2025–26 limits)</text>
  <!-- Donor box -->
  <rect x="20" y="250" width="120" height="60" rx="6" fill="var(--card, #ffffff)" stroke="var(--ink, #14130f)" stroke-width="2"/>
  <text x="80" y="276" font-family="Georgia, serif" font-size="14" fill="var(--ink, #14130f)" text-anchor="middle" font-weight="bold">You</text>
  <text x="80" y="294" font-family="Georgia, serif" font-size="12" fill="var(--muted, #6b6457)" text-anchor="middle">(the donor)</text>
  <!-- Candidate committee -->
  <rect x="330" y="60" width="180" height="52" rx="6" fill="var(--blue, #2f4d6e)"/>
  <text x="420" y="82" font-family="Georgia, serif" font-size="13.5" fill="#ffffff" text-anchor="middle" font-weight="bold">Candidate committee</text>
  <text x="420" y="100" font-family="Georgia, serif" font-size="12" fill="#ffffff" text-anchor="middle">spends with the candidate</text>
  <!-- Party committee -->
  <rect x="330" y="150" width="180" height="52" rx="6" fill="var(--green, #4a6b3a)"/>
  <text x="420" y="172" font-family="Georgia, serif" font-size="13.5" fill="#ffffff" text-anchor="middle" font-weight="bold">National party</text>
  <text x="420" y="190" font-family="Georgia, serif" font-size="12" fill="#ffffff" text-anchor="middle">limited coordination</text>
  <!-- PAC -->
  <rect x="330" y="240" width="180" height="52" rx="6" fill="var(--gold, #b08a3e)"/>
  <text x="420" y="262" font-family="Georgia, serif" font-size="13.5" fill="#ffffff" text-anchor="middle" font-weight="bold">Traditional PAC</text>
  <text x="420" y="280" font-family="Georgia, serif" font-size="12" fill="#ffffff" text-anchor="middle">gives $5,000/election</text>
  <!-- Super PAC -->
  <rect x="330" y="360" width="180" height="52" rx="6" fill="var(--accent, #8a2a1e)"/>
  <text x="420" y="382" font-family="Georgia, serif" font-size="13.5" fill="#ffffff" text-anchor="middle" font-weight="bold">Super PAC</text>
  <text x="420" y="400" font-family="Georgia, serif" font-size="12" fill="#ffffff" text-anchor="middle">independent ads only</text>
  <!-- 501c4 -->
  <rect x="330" y="460" width="180" height="52" rx="6" fill="var(--ink, #14130f)"/>
  <text x="420" y="482" font-family="Georgia, serif" font-size="13.5" fill="#ffffff" text-anchor="middle" font-weight="bold">501(c)(4) nonprofit</text>
  <text x="420" y="500" font-family="Georgia, serif" font-size="12" fill="#ffffff" text-anchor="middle">donors stay hidden</text>
  <!-- Arrows from donor -->
  <path d="M 140 262 C 230 262, 240 86, 326 86" fill="none" stroke="var(--blue, #2f4d6e)" stroke-width="2"/>
  <text x="160" y="120" font-family="Georgia, serif" font-size="12" fill="var(--blue, #2f4d6e)">$3,500/election · disclosed</text>
  <path d="M 140 270 C 230 270, 240 176, 326 176" fill="none" stroke="var(--green, #4a6b3a)" stroke-width="2"/>
  <text x="160" y="205" font-family="Georgia, serif" font-size="12" fill="var(--green, #4a6b3a)">$44,300/yr · disclosed</text>
  <path d="M 140 280 L 326 268" fill="none" stroke="var(--gold, #b08a3e)" stroke-width="2"/>
  <text x="170" y="258" font-family="Georgia, serif" font-size="12" fill="var(--gold, #b08a3e)">$5,000/yr · disclosed</text>
  <path d="M 140 296 C 230 296, 240 386, 326 386" fill="none" stroke="var(--accent, #8a2a1e)" stroke-width="2"/>
  <text x="158" y="345" font-family="Georgia, serif" font-size="12" fill="var(--accent, #8a2a1e)" font-weight="bold">UNLIMITED · disclosed</text>
  <path d="M 140 302 C 240 302, 240 486, 326 486" fill="none" stroke="var(--ink, #14130f)" stroke-width="2"/>
  <text x="158" y="445" font-family="Georgia, serif" font-size="12" fill="var(--ink, #14130f)" font-weight="bold">UNLIMITED · donor hidden</text>
  <!-- PAC to candidate arrow -->
  <path d="M 420 240 L 420 116" fill="none" stroke="var(--gold, #b08a3e)" stroke-width="1.5" stroke-dasharray="4,3"/>
  <text x="430" y="230" font-family="Georgia, serif" font-size="11.5" fill="var(--muted, #6b6457)">$5,000/election</text>
  <!-- c4 to superpac arrow -->
  <path d="M 514 486 C 560 486, 560 392, 514 388" fill="none" stroke="var(--muted, #6b6457)" stroke-width="1.5" stroke-dasharray="4,3"/>
  <text x="556" y="445" font-family="Georgia, serif" font-size="11.5" fill="var(--muted, #6b6457)">unlimited; only the</text>
  <text x="556" y="460" font-family="Georgia, serif" font-size="11.5" fill="var(--muted, #6b6457)">nonprofit's name shows</text>
  <!-- Coordination wall -->
  <line x1="240" y1="330" x2="700" y2="330" stroke="var(--accent, #8a2a1e)" stroke-width="2" stroke-dasharray="8,5"/>
  <text x="245" y="322" font-family="Georgia, serif" font-size="12" fill="var(--accent, #8a2a1e)" font-weight="bold">the coordination wall — below this line, spending must be independent of the candidate</text>
</svg>
<figcaption style="font-size:0.9em;color:var(--muted,#6b6457);margin-top:0.5rem;">Figure: The five channels of federal political money, with 2025–26 limits (FEC). Above the dashed wall, money is capped but can be coordinated with candidates; below it, money is unlimited but must — in legal theory — be spent independently. The 501(c)(4) is the only channel where the original donor's name never reaches a public database.</figcaption>
</figure>

## Channel 1: candidate campaign committees

Every federal candidate must register a **campaign committee** with the FEC — this is the money the candidate actually controls. Individuals (U.S. citizens and lawful permanent residents) can give **\$3,500 per election** in the 2025–26 cycle, and because the primary and general count as separate elections, that is \$7,000 per cycle to one candidate. The limit is indexed to inflation in odd-numbered years — it was \$3,300 in 2023–24, and \$1,000 from 1974 until 2002, when the Bipartisan Campaign Reform Act doubled it and started the indexing. Corporations and unions have been barred from contributing since the Tillman Act of 1907 and the Taft–Hartley Act of 1947; foreign nationals are barred entirely.

Disclosure here is maximal. Once your contributions to a committee pass \$200 in aggregate, your name, address, employer, and occupation become a public, searchable federal record. This is the most regulated channel in American [[term:campaign-finance]] — and, tellingly, the one the biggest spenders use least.

## Channel 2: party committees

Parties are the channel reformers forget. An individual can give **\$44,300 per year** to a national party committee (the DNC or RNC), plus up to **\$132,900 per year apiece** to three special-purpose party accounts (presidential conventions, headquarters buildings, and election recounts and legal proceedings) — a structure Congress added in 2014. State and local party committees can take \$10,000 a year, combined, per donor.

What can parties do with it? Give candidates a modest \$5,000 per election directly — and, more importantly, make **coordinated expenditures** on a candidate's behalf under a separate, indexed schedule: in 2026, from \$65,300 for a House nominee in a multi-district state up to about \$4.07 million for a Senate nominee in the largest state. Those party coordination caps are, as of mid-2026, before the Supreme Court in *NRSC v. FEC* (argued December 9, 2025) — if they fall, the party channel widens dramatically. Watch that case; Lesson 2 explains the doctrine it is testing.

<details class="checkpoint">
<summary><strong>Checkpoint:</strong> A donor wants to put \$60,000 behind one Senate candidate using only <em>capped, fully disclosed</em> channels in 2026. Roughly how far can she get?</summary>
<p>Not very far directly: <strong>\$7,000</strong> to the candidate's committee (\$3,500 each for primary and general), <strong>\$5,000</strong> a year to a PAC that supports the candidate, and <strong>\$44,300</strong> a year to the national party — but the PAC can only pass \$5,000 per election to the candidate, and the party spreads its money across many races. The capped channels are built to keep any one donor's direct stake in any one candidate small. To deploy \$60,000 on <em>one</em> race, she would have to cross the coordination wall — a Super PAC — where the cap disappears but so does her ability to coordinate with the campaign.</p>
</details>

## Channel 3: traditional PACs

A **PAC** — formally a "separate segregated fund" when a corporation or union sponsors one, or a "nonconnected committee" otherwise — pools money from individuals and gives it to candidates and parties. An individual can give a [[term:pac]] **\$5,000 per year**; a multicandidate PAC can give a candidate **\$5,000 per election** and a national party \$15,000 per year. Disclosure is the same itemized regime as campaign committees. Note the asymmetry that trips up news readers: a corporate PAC is funded by *voluntary employee contributions*, not the corporate treasury — the treasury ban survives. PACs are the mid-century compromise vehicle: capped, transparent, and small. When a headline says a "PAC" spent \$40 million, it almost never means this channel.

## Channel 4: Super PACs

The **Super PAC** — legally, an "independent-expenditure-only committee" — is the post-2010 vehicle, created not by *Citizens United* directly but by *SpeechNow.org v. FEC* (D.C. Cir. 2010), which extended its logic. A [[term:super-pac]] can accept **unlimited** money from individuals, corporations, and unions, and spend unlimited sums advocating for or against candidates — provided it does not contribute to or coordinate with them. Its donors are itemized in FEC filings, just like a campaign's.

The scale is the story. Outside spending in 2024 hit a record of roughly \$4.5 billion (OpenSecrets); the largest single outside spender, the pro-Harris Future Forward USA, reported about \$517 million in spending on the presidential race, and the pro-Trump MAGA Inc. about \$377 million. Musk's \$290 million traveled almost entirely through this channel — \$239 million of it to a single Super PAC, America PAC.

## Channel 5: 501(c)(4)s — where the lights go out

A **501(c)(4)** is an IRS category, not an FEC one: a tax-exempt "social welfare" nonprofit that may engage in electoral politics so long as that is not its *primary* purpose. It can take unlimited money from anyone — and, under current IRS rules, **its donors are never publicly disclosed**. The public sees the spending; it cannot see who paid. This is the channel the policy literature calls [[term:dark-money]], and it set its own record in 2024: more than \$1.9 billion flowed through groups that do not disclose their donors, by the Brennan Center's analysis (which extends OpenSecrets' tracking methodology) — including about \$1.3 billion passed from such groups and shell companies *into* Super PACs, which then dutifully disclosed "the nonprofit" as the donor while the original names stayed invisible.

That laundering pattern — person → 501(c)(4) → Super PAC → ad — also powers most modern [[term:astroturfing]]: a campaign that looks like grassroots "Concerned Citizens for X" with no way to see whose money is behind the curtain.

> **Common misconception:** "Money in politics" often gets conflated with *lobbying* — but paying a [[term:lobbyist]] to argue your case to officeholders is a separate, separately regulated activity (the Lobbying Disclosure Act), not a campaign contribution. A company barred from giving its treasury money to a Senate campaign can lawfully spend many times that amount lobbying the same senator's office. Keep the two ledgers distinct.

## The 2025–26 limits at a glance

The FEC's indexed limits for this cycle, simplified to the cells that matter most:

| Giver → recipient | Candidate committee | National party | Traditional PAC | Super PAC | 501(c)(4) |
| --- | --- | --- | --- | --- | --- |
| Individual | \$3,500 / election | \$44,300 / yr (+\$132,900 / yr per special account) | \$5,000 / yr | Unlimited | Unlimited |
| Multicandidate PAC | \$5,000 / election | \$15,000 / yr | \$5,000 / yr | Unlimited | Unlimited |
| Corporation / union treasury | **Banned** (1907 / 1947) | **Banned** | **Banned** (PAC must use employee money) | Unlimited | Unlimited |
| Publicly disclosed? | Yes (itemized over \$200) | Yes | Yes | Yes (donors itemized) | **No** |

Read the table column-wise and the post-2010 system explains itself: every cell Congress can still cap is small and transparent; the two right-hand columns — both creatures of 2010 court decisions — are where the \$290 million lives.

<details class="checkpoint">
<summary><strong>Checkpoint:</strong> A regional grocery chain's CEO wants the company itself — corporate treasury money — to support a House candidate. Which channels are open, and what is the disclosure consequence of each?</summary>
<p>The treasury cannot touch the candidate's committee, a party committee, or a traditional PAC (the corporate-contribution ban of 1907/1947 still stands). It <em>can</em> give unlimited treasury money to a <strong>Super PAC</strong> — where "Smith Groceries, Inc." appears in public FEC filings — or to a <strong>501(c)(4)</strong>, where no public record ever names the company. The choice between those two channels is, in practice, a choice about whether customers find out.</p>
</details>

## The scholar's lens: is \$15.9 billion a lot?

The 2024 federal elections cost about \$15.9 billion — \$5.5 billion of it on the presidential race, with congressional races accounting for more than \$10 billion (OpenSecrets). That sounds enormous until you ask, compared to what? In a famous 2003 *Journal of Economic Perspectives* article, "Why Is There So Little Money in U.S. Politics?", Stephen Ansolabehere, John de Figueiredo, and James Snyder pointed out that given the trillions of dollars the federal government allocates, rationally self-interested investors should pour *far more* into elections than they do — and that campaign giving as a share of GDP has barely moved in a century. Their reading of the evidence: most political money behaves like **consumption, not investment** — people give to participate, the way they donate to a church or a team — and only about one in four published studies finds contributions moving legislators' roll-call votes at all. The puzzle, they argued, is not why there is so much money in politics but why there is so little.

That finding is a genuine constraint on lazy "money buys votes" rhetoric — and it is not the end of the argument. The strongest reform-side reply (Lawrence Lessig's "dependence corruption," which Lesson 2 takes up) is that the harm isn't votes purchased retail; it's whom candidates spend their time courting wholesale. Hold both ideas; you'll need them.

## What this lesson is not

This lesson mapped the plumbing — it did not settle whether the plumbing is good. It did not cover the legal architecture (*Buckley*, BCRA, *Citizens United*, *SpeechNow*, *McCutcheon* — Lesson 2), and it offered no view on whether unlimited independent spending corrupts politics or constitutes protected speech (the Citizens United pack steel-mans that fight). And it gave no advice about your own giving; that is Lesson 3, where the question becomes practical: knowing the channels, how do you give with your eyes open?
