---
schema: bettercitizen.lesson/v1
slug: the-policy-landscape
kind: reading
title: The current policy landscape
objectives:
  - Describe what Dodd-Frank did and what the 2018 rollback changed
  - Explain the 2023 bank failures (SVB, Signature, First Republic) and the regulatory response
  - Identify the live fights — Basel III "endgame," the CFPB, stablecoins and a digital dollar, and Fed independence
  - Distinguish what regulators can do on their own from what requires an act of Congress
concepts:
  - dodd-frank
  - bank-regulation
  - too-big-to-fail
  - stablecoin
  - cbdc
  - fed-independence
sources:
  - type: statute
    citation: 'Dodd-Frank Wall Street Reform and Consumer Protection Act of 2010, Pub. L. No. 111-203.'
    url: https://www.congress.gov/bill/111th-congress/house-bill/4173
  - type: statute
    citation: 'Economic Growth, Regulatory Relief, and Consumer Protection Act of 2018, Pub. L. No. 115-174 — raised the enhanced-supervision threshold from $50B to $250B in assets.'
    url: https://www.congress.gov/bill/115th-congress/senate-bill/2155
  - type: statute
    citation: 'Gramm-Leach-Bliley Act of 1999, Pub. L. No. 106-102 — repealed the Glass-Steagall separation of commercial and investment banking.'
    url: https://www.congress.gov/bill/106th-congress/senate-bill/900
  - type: paper
    citation: 'Board of Governors of the Federal Reserve System (2023), "Review of the Federal Reserve''s Supervision and Regulation of Silicon Valley Bank" (the Barr Report).'
    url: https://www.federalreserve.gov/publications/files/svb-review-20230428.pdf
  - type: website
    citation: 'FDIC, "Speeches & Testimony and resources on the 2023 bank failures and the systemic risk exception."'
    url: https://www.fdic.gov/news/
  - type: paper
    citation: 'Supreme Court of the United States (2024), CFPB v. Community Financial Services Association of America, 601 U.S. 416 — upheld the constitutionality of the CFPB''s funding.'
    url: https://www.supremecourt.gov/opinions/23pdf/22-448_o7jp.pdf
  - type: paper
    citation: 'Basel Committee on Banking Supervision (2017), "Basel III: Finalising post-crisis reforms" — basis for the U.S. "Basel III endgame" proposal.'
    url: https://www.bis.org/bcbs/publ/d424.htm
perspectives:
  - name: Financial-stability advocate
  - name: Market-discipline advocate
  - name: Monetary-reform advocate
duration_min: 10
---

# The current policy landscape

The debates from Lesson 2 are not abstract. They run through a specific, recent history of laws, failures, and rule-makings — and through several fights that are live right now.

## The arc: Glass-Steagall, Dodd-Frank, and the 2018 rollback

The modern regulatory perimeter has moved twice in living memory.

**1999 — Gramm-Leach-Bliley** repealed the parts of the Depression-era Glass-Steagall Act that had separated commercial banking (taking deposits, making loans) from investment banking (underwriting and trading securities). Whether this repeal contributed to the 2008 crisis is itself contested — many of the firms at the center of 2008 were not Glass-Steagall combinations — but it marked the high-water mark of deregulation.

**2010 — the Dodd-Frank Act** was the post-2008 response, the largest financial overhaul since the 1930s. Its core pieces:
- Created the **CFPB** to consolidate consumer financial protection.
- Created the **Financial Stability Oversight Council (FSOC)** to watch for systemic risk across the whole system, including non-banks.
- Imposed **enhanced standards** (stress tests, living wills, higher capital and liquidity) on large banks — originally any bank with **$50B+** in assets.
- Added **orderly liquidation authority** so a failing giant could be wound down without a bailout *or* a disorderly collapse.
- Added the **Volcker Rule** restricting banks from proprietary trading.

**2018 — the Economic Growth, Regulatory Relief, and Consumer Protection Act (S.2155)** was the partial rollback. Its headline change: it **raised the threshold for enhanced supervision from $50B to $250B**, freeing dozens of mid-size "regional" banks from the toughest stress-testing and liquidity rules. Supporters said the strictest rules were never meant for regional lenders and were choking community banking; critics warned that mid-size banks can still be dangerous. That warning was tested in 2023.

## 2023: the regional-bank failures

In March 2023, **Silicon Valley Bank (SVB)** — about $209B in assets, the second-largest bank failure in U.S. history at the time — collapsed in roughly 48 hours. The mechanism was a classic run with a modern twist: SVB had loaded up on long-dated bonds that lost market value as the Fed raised rates; its deposit base was concentrated, uninsured, and tech-savvy; and when doubt set in, depositors pulled funds digitally at unprecedented speed. **Signature Bank** failed days later; **First Republic** followed in May 2023, was seized, and was sold to JPMorgan — itself becoming the second-largest failure in U.S. history.

The official response leaned hard on the Lesson-2 trade-offs:
- Regulators invoked the **systemic risk exception** to guarantee **all** deposits at SVB and Signature, **including uninsured balances above $250,000** — protecting depositors the law does not normally cover, to stop the run from spreading.
- The Fed stood up the **Bank Term Funding Program (BTFP)**, an emergency facility letting banks borrow against their bonds at par (face value) rather than depressed market value — a textbook lender-of-last-resort move.
- The Fed's own post-mortem, the **Barr Report**, faulted both SVB's management *and* its supervisors, and pointed at the 2018 rollback for weakening the rules that might have caught the problem.

Each camp read 2023 as confirmation. **Financial-stability** advocates saw the predictable cost of the 2018 deregulation and pushed to re-tighten. **Market-discipline** advocates saw the opposite lesson: backstopping *uninsured* depositors at SVB just extended the safety net and the moral hazard further than ever. **Monetary-reform** advocates noted that SVB's bond losses were created by the Fed's own rate cycle — the central bank caused the wound it then treated.

## The live fights

**Basel III "endgame."** U.S. regulators proposed (in 2023) to implement the final tranche of the international Basel III capital standards, which would raise required capital at the largest banks. The proposal drew intense industry pushback and was sent back for substantial revision; as of 2026 the size and shape of the final rule is still unsettled. It is the most consequential ongoing capital fight, and it is exactly the Admati-Hellwig vs. industry argument from Lesson 2 playing out in a rulemaking.

**The CFPB.** The consumer bureau has been the single most contested agency in this space. Opponents argued for years that its structure — a single director and a budget drawn from the Fed rather than from congressional appropriations — was unconstitutional. The Supreme Court **rejected the funding challenge in 2024** (*CFPB v. CFSA*), settling the constitutional question. But the *political* question stayed wide open: the bureau's funding, staffing, leadership, and very existence have been the target of repeated efforts to shrink or dismantle it, and its day-to-day reach swings sharply with each change of administration. Whether a dedicated consumer regulator should exist at all remains a genuine fault line.

**Stablecoins and a digital dollar.** Two related questions about the *form* of money:
- **Stablecoins** — privately issued tokens pegged to the dollar — have grown large enough to raise the question of who should regulate them, what reserves should back them, and whether they belong inside the banking perimeter. Congress moved toward a federal framework for them; the details (reserve rules, who charters issuers, the state-vs-federal split) are where the fight is.
- **A central bank digital currency (CBDC)** — a digital dollar issued directly by the Fed — has been studied but is politically radioactive. Proponents see efficiency and financial inclusion; opponents (across the spectrum) see surveillance and an unprecedented concentration of monetary power, and there has been active legislation to *prohibit* the Fed from issuing one. This is the [[term:monetary-policy]] and Fed-power debate from Lesson 2 in its newest form.

**Fed independence.** The most consequential live question of all. The Fed's insulation from elected officials — long treated as settled doctrine — is again openly contested, with sustained political pressure on the central bank over interest-rate decisions and recurring arguments that elected leaders should have more say over monetary policy. Defenders warn that politicizing rate-setting risks the high-inflation outcomes independence was designed to prevent; critics counter that unelected officials wielding this much power is the real democratic problem. Lesson 2's monetary-reform camp lives here.

## What only Congress can do — and what regulators do alone

A recurring confusion in banking debates is mistaking what an agency can change on its own for what takes a law.

- **Regulators acting alone** can do a great deal *within* their statutes: the Fed, OCC, and FDIC write and revise capital, liquidity, and stress-test rules (this is how Basel III endgame and most of the post-2023 tightening happen); the Fed sets interest rates and can open or close emergency facilities; the CFPB issues and rescinds consumer rules. This is why so much policy swings with each administration without a single vote in Congress.
- **Only Congress** can move the big levers: changing the **$250,000** deposit-insurance limit, redrawing the **$250B** supervision threshold (or re-tightening Dodd-Frank), creating a statutory framework for **stablecoins**, **authorizing or prohibiting a CBDC**, restructuring or defunding the **CFPB**, or altering the **Federal Reserve's mandate or independence**. The structure of the agencies themselves is statutory.

The practical upshot: most of what you read about bank "regulation" is regulators adjusting dials Congress already handed them, and is therefore reversible by the next set of regulators. The genuinely durable changes — and the ones that decide the Lesson-2 debates — require legislation.

## What a learner should take away

A defensible position on the federal money system requires:

1. A view on **how much banks should be regulated**, and through which tools (high equity capital? detailed supervision? market discipline?).
2. A view on **the safety net** — deposit insurance and the lender of last resort — and whether its run-stopping benefit outweighs the moral hazard it creates.
3. A view on **who should control the money supply** and under what constraints (discretionary central banking? a rule? a harder anchor?).
4. An honest accounting of what evidence would change your mind.

The Coach will engage you on each. The Mirror will save your declared position; the steel-man drill will push you to build the strongest version of the camp you find least convincing.

A useful next step: declare a position at `/me/positions/new` with `slug: bank-regulation`, then run a steel-man drill against whichever of the three camps in Lesson 2 you find least persuasive.
