---
schema: bettercitizen.lesson/v1
slug: the-aftermath
kind: reading
title: Where the law has gone since
objectives:
  - Trace the line from Citizens United (Jan 2010) → SpeechNow.org (Mar 2010) → Super PAC creation
  - State what McCutcheon v. FEC (2014) added, in the same mechanical way Lesson 1 stated CU
  - Describe the FEC's regulatory paralysis post-CU and why it matters
  - Distinguish 501(c)(4)s, 527s, traditional PACs, and Super PACs by their disclosure obligations
concepts:
  - super-pacs
  - dark-money
  - mccutcheon
  - 501c4
  - independent-expenditures
sources:
  - type: court-opinion
    citation: 'SpeechNow.org v. FEC, 599 F.3d 686 (D.C. Cir. 2010) (en banc).'
    url: https://www.cadc.uscourts.gov/internet/opinions.nsf/0/B504F88FF73DB18585257702004D2BAA/$file/08-5223-1238909.pdf
  - type: court-opinion
    citation: 'McCutcheon v. FEC, 572 U.S. 185 (2014).'
    url: https://www.supremecourt.gov/opinions/13pdf/12-536_e1pf.pdf
  - type: paper
    citation: 'Briffault, R. (2011), "Super PACs," Minnesota Law Review 96, 1644.'
    url: https://scholarship.law.umn.edu/mlr/305/
  - type: paper
    citation: 'Mayer, K. R. (2017), "The FEC Is Stalemated. Here''s Why That''s a Problem." Election Law Journal 16:4.'
  - type: website
    citation: 'OpenSecrets, "Outside Spending by Cycle, Excluding Party Committees" — annual data series since 2002.'
    url: https://www.opensecrets.org/outside-spending/cycle-totals
  - type: website
    citation: 'Brennan Center for Justice, "Citizens United: A Look at the Decision and Its Aftermath" (2020).'
    url: https://www.brennancenter.org/our-work/research-reports/citizens-united-explained
  - type: website
    citation: 'IRS, Publication 557, "Tax-Exempt Status for Your Organization" — defines 501(c)(4) social welfare organizations.'
    url: https://www.irs.gov/publications/p557
perspectives:
  - name: First Amendment maximalist
  - name: Anti-corruption advocate
  - name: Disclosure-first reformer
duration_min: 12
---

# Where the law has gone since

Citizens United was decided January 21, 2010. The next fifteen years are the system the holding actually produced — which turns out to be the SCOTUS holding plus a D.C. Circuit decision plus an FEC that has stopped being able to regulate. Each piece matters for thinking about Citizens United now.

## March 2010: SpeechNow.org and the birth of Super PACs

Two months after Citizens United, the D.C. Circuit Court of Appeals decided *SpeechNow.org v. FEC* (599 F.3d 686). SpeechNow was an independent-expenditure-only political committee that wanted to accept unlimited donations from individuals to fund its independent ads. The FEC said the contributions were capped under existing law. SpeechNow argued that, post-CU, capping contributions to a committee that *only* makes independent expenditures had no anti-corruption justification — the Buckley contribution-limit logic depends on a corruption risk that, by stipulation, doesn't exist for independent-only committees.

The D.C. Circuit, sitting en banc (all nine judges), unanimously agreed:

> "We conclude that contributions to an independent expenditure committee … cannot corrupt or create the appearance of corruption. The First Amendment cannot be encroached upon for naught."

This decision created the **independent-expenditure-only PAC** — the entity now universally called a **Super PAC**. SpeechNow is the case that did this; Citizens United did not. The shorthand "Citizens United created Super PACs" elides the SpeechNow step, but mechanically, the line is:

```
Citizens United (Jan 2010) → corporations + unions can spend unlimited
                              independent expenditures from general treasury
SpeechNow.org (Mar 2010) → political committees can ACCEPT unlimited
                            contributions to fund independent expenditures
                            = "Super PAC" structure
```

The first decision opened the funding source. The second decision opened the aggregation vehicle. Together they produced the post-2010 landscape.

## 2014: McCutcheon and the aggregate-limit holding

*McCutcheon v. FEC* (572 U.S. 185) was decided four years later. McCutcheon, an Alabama businessman, had donated $33,088 to sixteen federal candidates in the 2011–12 cycle and wanted to give to twelve more. The base limits (the per-candidate caps Buckley upheld in 1976) were satisfied; the issue was BCRA's *aggregate* limit, which capped the total a person could give *across all federal candidates and committees* in a two-year cycle.

By 5–4, with Chief Justice Roberts writing the plurality, the Court struck down the aggregate limits. The reasoning:

- Base contribution limits to individual candidates remain constitutional under Buckley.
- The aggregate limit doesn't add anti-corruption protection beyond what the base limits already provide. (The base limits already constrain quid-pro-quo with any specific candidate.)
- It does, however, restrict the donor's First Amendment right to *participate in the political process by supporting multiple candidates*.
- So it fails strict scrutiny.

McCutcheon is narrower than Citizens United (it's about how *much* an individual can give in total, not whether corporations can spend) but builds on the same logic: that contribution limits need a tight, quid-pro-quo-grounded corruption rationale to survive. The cumulative effect of CU + SpeechNow + McCutcheon is a system where **base limits to candidates are intact, but the volume that can flow around candidates through Super PACs and aggregate giving is effectively unlimited.**

## What the disclosure rules look like in 2025

The disclosure piece of Citizens United (upheld 8–1) survives in name but unevenly in practice. The post-CU landscape has multiple vehicles:

| Vehicle | Donor disclosure? | Contribution caps? | Coordination with candidate? |
|---|---|---|---|
| Traditional PAC | Yes (FEC reports) | Yes ($5,000/donor/year) | Limited |
| Super PAC | Yes (FEC reports) | No | Forbidden in principle |
| 501(c)(4) "social welfare" | **No** (donors not disclosed) | No | Forbidden if "primary purpose" is electoral |
| 527 organization | Yes (IRS reports) | No | Forbidden |
| Hybrid PAC ("Carey PAC") | Yes for the segregated funds | Mixed | Limited for one fund only |

The phrase **"dark money"** in policy literature refers to spending by 501(c)(4)s — entities organized under §501(c)(4) of the Internal Revenue Code as "social welfare" organizations, which can engage in election-related communications as long as electoral activity isn't their *primary* purpose, and which do not have to disclose their donors to the FEC. Donors to a 501(c)(4) can give unlimited amounts and remain anonymous; the 501(c)(4) can then donate to a Super PAC, which is required to report the donation but only as coming from the 501(c)(4), with the original individual donors invisible.

This pipeline — individual → 501(c)(4) → Super PAC → political ad — is the structural feature that makes "the disclosure portion of CU survived" feel hollow to many reformers, even though as a matter of doctrine it did. We'll trace the live policy debate over closing this pipeline in Lesson 4.

## The FEC's regulatory paralysis

The Federal Election Commission has six commissioners, with three from each major party by statute. Most enforcement actions require four affirmative votes. Since approximately 2008, the Commission has been deadlocked on a wide range of issues — including, critically, several involving the post-CU coordination rules and 501(c)(4) disclosure questions.

This isn't the same as Citizens United doing the work. It is, however, the regulatory environment in which Citizens United now operates. Justice Kennedy's opinion repeatedly invoked the FEC as the safety valve — strict coordination rules, robust disclosure, vigorous enforcement of the line between independent and coordinated. The actual FEC of the 2010s and 2020s has not been able to act on most of those issues. Mayer (2017) traces the institutional dynamics; the Brennan Center has tracked the deadlock on a per-vote basis.

The maximalist response: this is a feature, not a bug — government election regulators *should* be hard to weaponize against speech, and a deadlocked FEC is preferable to one that can be captured by either party.

The reformer response: the system Kennedy described in his opinion never actually existed; it was a counterfactual FEC that Congress built but the political branches stopped letting work.

Both descriptions are true. Which one matters more for evaluating CU is one of the live questions.

## The empirical landscape since 2010

A few facts that all sides generally accept (data: OpenSecrets, FEC summary reports):

- **Outside spending in federal elections** — the umbrella for non-candidate, non-party spending — was approximately $0.36B in 2008 (the last pre-CU cycle) and has been $1.6–$2.6B per cycle since 2012.
- **Super PAC spending** specifically has been the largest single category — roughly $2B+ in the 2024 cycle.
- **501(c)(4) "dark money"** spending reported to the FEC was approximately $0.15B in 2024 (per FEC reports). Reformers generally argue the actual amount is higher because 501(c)(4)s only have to report to the FEC the portion of their spending that explicitly advocates for or against a candidate, not issue ads that mention candidates without express advocacy.
- **The donor concentration** has shifted: a small number of mega-donors now account for the majority of Super PAC funding. The top 25 donors collectively gave more than the bottom 5M individual donors combined in recent cycles.

The maximalist reading: more political speech is reaching more voters, and the public has more information than before. The reformer reading: the donor base is wildly unrepresentative of the electorate, and the speech they're funding has outsized influence relative to their numbers.

Lesson 4 turns to the live policy fight: what disclosure looks like now, what reforms are on the table, and where the next legal battle is most likely.
