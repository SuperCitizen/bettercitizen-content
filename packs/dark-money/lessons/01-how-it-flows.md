---
schema: supercitizen.lesson/v1
slug: how-it-flows
kind: reading
title: How dark money actually flows
objectives:
  - Define dark money in mechanical terms (501(c)(4) electoral spending without donor disclosure)
  - Trace the "individual → 501(c)(4) → Super PAC → political ad" pipeline
  - Distinguish 501(c)(4)s from other tax-exempt entities (501(c)(3)s, 527s)
  - State the empirical record on dark money spending
concepts:
  - dark-money
  - 501c4
  - donor-disclosure
  - electoral-activity
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
    citation: 'Brennan Center for Justice, "Dark Money Tracker" — annual analysis.'
    url: https://www.brennancenter.org/our-work/research-reports/citizens-united-explained
  - type: court-opinion
    citation: 'Citizens United v. FEC, 558 U.S. 310 (2010) — disclosure portion upheld 8-1.'
    url: https://www.supremecourt.gov/opinions/09pdf/08-205.pdf
  - type: court-opinion
    citation: 'Americans for Prosperity Foundation v. Bonta, 594 U.S. ___ (2021).'
    url: https://www.supremecourt.gov/opinions/20pdf/19-251_p86b.pdf
perspectives:
  - name: Disclosure-first reformer
  - name: Donor-privacy advocate
  - name: Structural-reform centrist
duration_min: 8
---

# How dark money actually flows

"Dark money" is a specific term in campaign-finance literature: spending by 501(c)(4) "social welfare" organizations on electoral activity, where the donors funding the spending are not disclosed to the public.

## The 501(c)(4) structure

Internal Revenue Code §501(c)(4) creates a category of tax-exempt entities called "social welfare organizations." Key features:

- **Tax exemption**: 501(c)(4)s pay no federal income tax on most revenue.
- **No charitable deduction for donors**: unlike 501(c)(3)s, donations to a 501(c)(4) are not tax-deductible.
- **Permitted activities**: any activity that "promotes the common good and general welfare of the people of the community."
- **Electoral activity**: permitted as long as it's not the *primary* activity of the organization.
- **Donor disclosure**: NOT required — the IRS does not publicly disclose 501(c)(4) donors. Some states have tried to compel disclosure; results have been mixed.

The "primary activity" requirement is the most-litigated element. The IRS has historically interpreted "primary" loosely — usually meaning "less than 50% of activity by spending." This means a 501(c)(4) can spend up to 49.9% of its budget on electoral activity (defined narrowly) without losing its tax-exempt status.

The "electoral activity" definition is critical. Under FEC rules, electoral activity is communication that "expressly advocates" for or against a candidate, or that occurs within specific time windows (60 days before general election, 30 days before primary) and identifies a candidate. 501(c)(4)s can engage in extensive "issue advocacy" — communications about policy issues that mention candidates — without it counting as electoral activity in the IRS sense.

## The dark-money pipeline

The structural feature that makes "dark money" possible:

```
Individual donor (anonymous to public)
        ↓
501(c)(4) "social welfare" organization
        ↓ (donates to)
Super PAC
        ↓ (makes independent expenditure)
Political ad attacking/supporting a candidate
```

In this pipeline:
- The individual donor's identity is not disclosed to the public.
- The 501(c)(4) doesn't disclose its donors.
- The Super PAC must report donors to the FEC — but reports the donation as coming from the 501(c)(4), not the original individual donors.
- The political ad reaches voters with the candidate name and either pro or con messaging.

The result: voters know an ad attacking Senator X exists, know it's funded by some entity, but cannot trace it back to the individuals who actually paid for it.

## Variants of the pipeline

The pipeline has many variants:

- **501(c)(4) ads directly.** A 501(c)(4) can run electioneering ads itself (within the "primary purpose" limit). These are reported to the FEC if they meet the electoral-activity definition; the 501(c)(4) is the named spender; donors remain anonymous.
- **501(c)(6) trade associations.** These can engage in electoral activity similar to 501(c)(4)s, also without donor disclosure. The U.S. Chamber of Commerce, for example, has a 501(c)(6) status.
- **Inter-c(4) transfers.** Money can move between multiple 501(c)(4)s before reaching a Super PAC, further obscuring the original source.
- **LLC contributions to Super PACs.** A 501(c)(4) or wealthy donor can fund an LLC that then donates to a Super PAC. The Super PAC reports the LLC as the donor; the LLC is itself opaque.

These variants compound. A donor seeking maximum anonymity can combine LLCs, multiple 501(c)(4)s, inter-c(4) transfers, and final Super PAC distribution to make tracing nearly impossible.

## What's reported to the FEC and what isn't

For purposes of public disclosure:

- **Super PAC contributions**: reported to FEC quarterly. Donors named.
- **501(c)(4) electoral spending**: reported to FEC if it meets the "express advocacy" or "electioneering communication" definitions. Donors NOT named.
- **501(c)(4) issue advocacy**: not reported to FEC at all. Donors NOT named.
- **501(c)(4) other activity**: reported to IRS in 990 forms (which are public), but donor information is not.

The result: dark money's invisibility is structural, not an enforcement gap. Closing it would require either changes to IRS rules (under what conditions does electoral activity require donor disclosure?) or new federal legislation (DISCLOSE Act-style).

## The empirical scale

OpenSecrets and Brennan Center data:

- **Total reported dark money** (501(c)(4) and 501(c)(6) electoral spending reported to FEC): ~$150-200M per cycle in recent years.
- **Estimated unreported activity**: substantially higher. The amount that flows through 501(c)(4)s in issue advocacy that mentions candidates without express advocacy is harder to estimate but likely in the billions.
- **Inter-organizational transfers**: tens of millions per cycle move between 501(c)(4)s, further obscuring sources.

The reported dark-money spending is small relative to total Super PAC spending (~$2B). The relevant question is whether the $150-200M+ of reported dark money is the tip of an iceberg or roughly the visible scale of the activity. The empirical literature is divided.

## The Citizens United disclosure context

Citizens United (2010) explicitly upheld the disclosure provisions of BCRA §§201 and 311 by 8-1 (only Justice Thomas dissented). The majority's logic:

> "Disclosure permits citizens and shareholders to react to the speech of corporate entities in a proper way." (Slip op. at 55.)

This is the part of CU that dark-money advocates point to: the constitutional question of disclosure is settled. The 501(c)(4) gap is not a constitutional matter — it's a regulatory and statutory gap that legislative action could close.

But Bonta v. AFP (2021) complicated this by applying "exacting scrutiny" to disclosure mandates and striking down California's required-disclosure provision for 501(c)(3) charities. The Bonta decision didn't directly affect 501(c)(4) electoral disclosure but signaled the Court's evolving view of disclosure mandates.

## Why this lesson is contested

Three perspectives the next lesson sharpens:

- **Disclosure-first reformers** argue that the post-CU world requires closing the 501(c)(4) loophole through legislation or IRS rule-making. The CU majority's framing (disclosure makes the political-speech expansion safe) requires actually working disclosure.
- **Donor-privacy advocates** argue NAACP v. Alabama and Bonta establish that compelled disclosure of donors faces constitutional scrutiny, and that the 501(c)(4) anonymity is a feature protecting donors from retaliation.
- **Structural-reform centrists** argue that pure disclosure-vs.-privacy is the wrong frame; the right reform is targeted disclosure of large donors with privacy protections for small donors, plus enforcement of "primary purpose" rules to prevent 501(c)(4)s from being electoral organizations in disguise.

A defensible position takes one of these views, says why, and identifies what evidence would change it.
